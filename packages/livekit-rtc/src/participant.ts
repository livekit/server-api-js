// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { DataStream_Header } from '@livekit/protocol';
import type { PathLike } from 'node:fs';
import { open, stat } from 'node:fs/promises';
import { type FileStreamOptions, TextStreamWriter } from './data_streams/index.js';
import { FfiClient, FfiHandle } from './ffi_client.js';
import { log } from './log.js';
import {
  DisconnectReason,
  type OwnedParticipant,
  type ParticipantInfo,
  type ParticipantKind,
} from './proto/participant_pb.js';
import {
  DataStream_Chunk,
  DataStream_FileHeader,
  DataStream_OperationType,
  DataStream_TextHeader,
  type PublishDataCallback,
  type PublishDataResponse,
  type PublishSipDtmfCallback,
  type PublishSipDtmfResponse,
  type PublishTrackCallback,
  type PublishTrackResponse,
  type PublishTranscriptionCallback,
  type PublishTranscriptionResponse,
  type SendChatMessageCallback,
  type SendChatMessageResponse,
  type SendStreamChunkCallback,
  SendStreamChunkRequest,
  type SendStreamChunkResponse,
  type SendStreamHeaderCallback,
  SendStreamHeaderRequest,
  type SendStreamHeaderResponse,
  type SetLocalAttributesCallback,
  type SetLocalAttributesResponse,
  type SetLocalMetadataCallback,
  type SetLocalMetadataResponse,
  type SetLocalNameCallback,
  type SetLocalNameResponse,
  type TrackPublishOptions,
  type UnpublishTrackCallback,
  type UnpublishTrackResponse,
} from './proto/room_pb.js';
import { ChatMessage as ChatMessageModel } from './proto/room_pb.js';
import {
  EditChatMessageRequest,
  TranscriptionSegment as ProtoTranscriptionSegment,
  PublishDataRequest,
  PublishSipDtmfRequest,
  PublishTrackRequest,
  PublishTranscriptionRequest,
  SendChatMessageRequest,
  SetLocalAttributesRequest,
  SetLocalMetadataRequest,
  SetLocalNameRequest,
  UnpublishTrackRequest,
} from './proto/room_pb.js';
import type {
  PerformRpcCallback,
  PerformRpcResponse,
  RegisterRpcMethodResponse,
  RpcMethodInvocationResponseResponse,
  UnregisterRpcMethodResponse,
} from './proto/rpc_pb.js';
import {
  PerformRpcRequest,
  RegisterRpcMethodRequest,
  RpcMethodInvocationResponseRequest,
  UnregisterRpcMethodRequest,
} from './proto/rpc_pb.js';
import { type PerformRpcParams, RpcError, type RpcInvocationData } from './rpc.js';
import type { LocalTrack } from './track.js';
import type { RemoteTrackPublication, TrackPublication } from './track_publication.js';
import { LocalTrackPublication } from './track_publication.js';
import type { Transcription } from './transcription.js';
import type { ChatMessage } from './types.js';
import { numberToBigInt } from './utils.js';

const STREAM_CHUNK_SIZE = 15_000;

export abstract class Participant {
  /** @internal */
  info: ParticipantInfo;

  /** @internal */
  ffi_handle: FfiHandle;

  trackPublications = new Map<string, TrackPublication>();

  constructor(owned_info: OwnedParticipant) {
    this.info = owned_info!.info!;
    this.ffi_handle = new FfiHandle(owned_info.handle!.id!);
  }

  get sid(): string | undefined {
    return this.info.sid;
  }

  get name(): string | undefined {
    return this.info.name;
  }

  get identity(): string | undefined {
    return this.info.identity;
  }

  get metadata(): string | undefined {
    return this.info.metadata;
  }

  get attributes(): Record<string, string> | undefined {
    return this.info.attributes;
  }

  get kind(): ParticipantKind | undefined {
    return this.info.kind;
  }

  get disconnectReason(): DisconnectReason | undefined {
    if (this.info.disconnectReason === DisconnectReason.UNKNOWN_REASON) {
      return undefined;
    }
    return this.info.disconnectReason;
  }
}

export type DataPublishOptions = {
  /**
   * whether to send this as reliable or lossy.
   * For data that you need delivery guarantee (such as chat messages), use Reliable.
   * For data that should arrive as quickly as possible, but you are ok with dropped
   * packets, use Lossy.
   */
  reliable?: boolean;
  /**
   * the identities of participants who will receive the message, will be sent to every one if empty
   */
  destination_identities?: string[];
  /** the topic under which the message gets published */
  topic?: string;
};

export class LocalParticipant extends Participant {
  private rpcHandlers: Map<string, (data: RpcInvocationData) => Promise<string>> = new Map();

  trackPublications: Map<string, LocalTrackPublication> = new Map();

  async publishData(data: Uint8Array, options: DataPublishOptions) {
    const req = new PublishDataRequest({
      localParticipantHandle: this.ffi_handle.handle,
      dataPtr: FfiClient.instance.retrievePtr(data),
      dataLen: BigInt(data.byteLength),
      reliable: options.reliable,
      topic: options.topic,
      destinationIdentities: options.destination_identities,
    });

    const res = FfiClient.instance.request<PublishDataResponse>({
      message: { case: 'publishData', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PublishDataCallback>((ev) => {
      return ev.message.case == 'publishData' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }

  async publishDtmf(code: number, digit: string) {
    const req = new PublishSipDtmfRequest({
      localParticipantHandle: this.ffi_handle.handle,
      code,
      digit,
    });

    const res = FfiClient.instance.request<PublishSipDtmfResponse>({
      message: { case: 'publishSipDtmf', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PublishSipDtmfCallback>((ev) => {
      return ev.message.case == 'publishSipDtmf' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }

  async publishTranscription(transcription: Transcription) {
    const req = new PublishTranscriptionRequest({
      localParticipantHandle: this.ffi_handle.handle,
      participantIdentity: transcription.participantIdentity,
      segments: transcription.segments.map(
        (s) =>
          new ProtoTranscriptionSegment({
            id: s.id,
            text: s.text,
            startTime: s.startTime,
            endTime: s.endTime,
            final: s.final,
            language: s.language,
          }),
      ),
      trackId: transcription.trackSid,
    });

    const res = FfiClient.instance.request<PublishTranscriptionResponse>({
      message: { case: 'publishTranscription', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PublishTranscriptionCallback>((ev) => {
      return ev.message.case == 'publishTranscription' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }

  async updateMetadata(metadata: string) {
    const req = new SetLocalMetadataRequest({
      localParticipantHandle: this.ffi_handle.handle,
      metadata: metadata,
    });

    const res = FfiClient.instance.request<SetLocalMetadataResponse>({
      message: { case: 'setLocalMetadata', value: req },
    });

    await FfiClient.instance.waitFor<SetLocalMetadataCallback>((ev) => {
      return ev.message.case == 'setLocalMetadata' && ev.message.value.asyncId == res.asyncId;
    });
  }

  /**
   * Returns a `StreamWriter` instance that allows to write individual chunks of text to a stream.
   * Well suited for TTS and/or streaming LLM output.
   */
  async streamText(options?: {
    topic?: string;
    extensions?: Record<string, string>;
    destinationIdentities?: Array<string>;
  }): Promise<TextStreamWriter> {
    const senderIdentity = this.identity;
    const streamId = crypto.randomUUID();
    const destinationIdentities = options?.destinationIdentities;

    const headerReq = new SendStreamHeaderRequest({
      senderIdentity,
      destinationIdentities,
      localParticipantHandle: this.ffi_handle.handle,
      header: new DataStream_Header({
        streamId,
        mimeType: 'text/plain',
        topic: options?.topic ?? '',
        timestamp: numberToBigInt(Date.now()),
        extensions: options?.extensions,
        contentHeader: {
          case: 'textHeader',
          value: new DataStream_TextHeader({
            operationType: DataStream_OperationType.CREATE,
            version: 0,
            replyToStreamId: '',
            generated: false,
          }),
        },
      }),
    });

    await this.sendStreamHeader(headerReq);

    let chunkId = 0;
    const localHandle = this.ffi_handle.handle;
    const sendChunk = this.sendStreamChunk;

    const writableStream = new WritableStream<[string, number?]>({
      // Implement the sink
      write([textChunk, overrideChunkId]) {
        const textInBytes = new TextEncoder().encode(textChunk);

        if (textInBytes.byteLength > STREAM_CHUNK_SIZE) {
          this.abort?.();
          throw new Error('chunk size too large');
        }

        return new Promise(async (resolve) => {
          // FIXME we need an equivalent for this on the rust layer
          // await localP.engine.waitForBufferStatusLow(DataPacket_Kind.RELIABLE);

          const chunkRequest = new SendStreamChunkRequest({
            senderIdentity,
            localParticipantHandle: localHandle,
            destinationIdentities,
            chunk: new DataStream_Chunk({
              content: textInBytes,
              streamId,
              chunkIndex: numberToBigInt(overrideChunkId ?? chunkId),
            }),
          });

          const res = FfiClient.instance.request<SendStreamHeaderResponse>({
            message: { case: 'sendStreamChunk', value: chunkRequest },
          });

          const cb = await FfiClient.instance.waitFor<SendStreamChunkCallback>((ev) => {
            return ev.message.case == 'sendStreamChunk' && ev.message.value.asyncId == res.asyncId;
          });

          if (cb.error) {
            throw new Error(cb.error);
          }

          chunkId += 1;
          resolve();
        });
      },
      async close() {
        const chunkReq = new SendStreamChunkRequest({
          senderIdentity,
          localParticipantHandle: localHandle,
          destinationIdentities,
          chunk: new DataStream_Chunk({
            streamId,
            chunkIndex: numberToBigInt(chunkId),
            complete: true,
            content: Uint8Array.from([]),
          }),
        });
        await sendChunk(chunkReq);
      },
      abort(err) {
        log.error('Sink error:', err);
      },
    });

    const writer = new TextStreamWriter(writableStream);

    return writer;
  }

  /** Sends a file provided as PathLike to specified recipients */
  async sendFile(path: PathLike, options?: FileStreamOptions) {
    const fileStats = await stat(path);
    const file = await open(path);
    try {
      const stream: ReadableStream<Uint8Array> = file.readableWebStream({ type: 'bytes' });

      const senderIdentity = this.identity;
      const streamId = crypto.randomUUID();
      const destinationIdentities = options?.destinationIdentities;
      const totalLength = numberToBigInt(fileStats.size);

      const headerReq = new SendStreamHeaderRequest({
        senderIdentity,
        destinationIdentities,
        localParticipantHandle: this.ffi_handle.handle,
        header: new DataStream_Header({
          streamId,
          mimeType: options?.mimeType ?? 'application/octet-stream',
          topic: options?.topic ?? '',
          timestamp: numberToBigInt(Date.now()),
          extensions: options?.extensions,
          totalLength,
          contentHeader: {
            case: 'fileHeader',
            value: new DataStream_FileHeader({
              fileName: options?.fileName ?? 'unknown',
            }),
          },
        }),
      });

      await this.sendStreamHeader(headerReq);

      let chunkId = 0;
      for await (const chunk of stream) {
        const biteSizeChunks = Math.ceil(chunk.byteLength / STREAM_CHUNK_SIZE);

        for (let i = 0; i < biteSizeChunks; i++) {
          const offset = i * STREAM_CHUNK_SIZE;
          const chunkyChunk = chunk.slice(
            offset,
            Math.min(offset + STREAM_CHUNK_SIZE, chunk.byteLength),
          );
          const chunkReq = new SendStreamChunkRequest({
            senderIdentity,
            localParticipantHandle: this.ffi_handle.handle,
            destinationIdentities,
            chunk: new DataStream_Chunk({
              streamId,
              chunkIndex: numberToBigInt(chunkId),
              complete: false,
              content: chunkyChunk,
            }),
          });
          await this.sendStreamChunk(chunkReq);
          chunkId += 1;
        }
      }

      // close stream
      const chunkReq = new SendStreamChunkRequest({
        senderIdentity,
        localParticipantHandle: this.ffi_handle.handle,
        destinationIdentities,
        chunk: new DataStream_Chunk({
          streamId,
          chunkIndex: numberToBigInt(chunkId),
          complete: true,
          content: Uint8Array.from([]),
        }),
      });
      await this.sendStreamChunk(chunkReq);
    } finally {
      await file.close();
    }
  }

  private async sendStreamHeader(req: SendStreamHeaderRequest) {
    const type = 'sendStreamHeader';
    const res = FfiClient.instance.request<SendStreamHeaderResponse>({
      message: { case: type, value: req },
    });

    const cb = await FfiClient.instance.waitFor<SendStreamHeaderCallback>((ev) => {
      return ev.message.case == type && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }

  private async sendStreamChunk(req: SendStreamChunkRequest) {
    const type = 'sendStreamChunk';
    const res = FfiClient.instance.request<SendStreamChunkResponse>({
      message: { case: type, value: req },
    });

    const cb = await FfiClient.instance.waitFor<SendStreamChunkCallback>((ev) => {
      return ev.message.case == type && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }
  }

  /**
   * Sends a chat message to participants in the room
   *
   * @param text - The text content of the chat message.
   * @param destinationIdentities - An optional array of recipient identities to whom the message will be sent. If omitted, the message is broadcast to all participants.
   * @param senderIdentity - An optional identity of the sender. If omitted, the default sender identity is used.
   *
   */
  async sendChatMessage(
    text: string,
    destinationIdentities?: Array<string>,
    senderIdentity?: string,
  ): Promise<ChatMessage> {
    const req = new SendChatMessageRequest({
      localParticipantHandle: this.ffi_handle.handle,
      message: text,
      destinationIdentities,
      senderIdentity,
    });

    const res = FfiClient.instance.request<SendChatMessageResponse>({
      message: { case: 'sendChatMessage', value: req },
    });

    const cb = await FfiClient.instance.waitFor<SendChatMessageCallback>((ev) => {
      return ev.message.case == 'chatMessage' && ev.message.value.asyncId == res.asyncId;
    });

    switch (cb.message.case) {
      case 'chatMessage':
        const { id, timestamp, editTimestamp, message } = cb.message.value!;
        return {
          id: id!,
          timestamp: Number(timestamp),
          editTimestamp: Number(editTimestamp),
          message: message!,
        };
      case 'error':
      default:
        throw new Error(cb.message.value);
    }
  }

  /**
   * @experimental
   */
  async editChatMessage(
    editText: string,
    originalMessage: ChatMessage,
    destinationIdentities?: Array<string>,
    senderIdentity?: string,
  ): Promise<ChatMessage> {
    const req = new EditChatMessageRequest({
      localParticipantHandle: this.ffi_handle.handle,
      editText,
      originalMessage: new ChatMessageModel({
        ...originalMessage,
        timestamp: BigInt(originalMessage.timestamp),
        editTimestamp: originalMessage.editTimestamp
          ? BigInt(originalMessage.editTimestamp)
          : undefined,
      }),
      destinationIdentities,
      senderIdentity,
    });

    const res = FfiClient.instance.request<SendChatMessageResponse>({
      message: { case: 'editChatMessage', value: req },
    });

    const cb = await FfiClient.instance.waitFor<SendChatMessageCallback>((ev) => {
      return ev.message.case == 'chatMessage' && ev.message.value.asyncId == res.asyncId;
    });

    switch (cb.message.case) {
      case 'chatMessage':
        const { id, timestamp, editTimestamp, message } = cb.message.value!;
        return {
          id: id!,
          timestamp: Number(timestamp),
          editTimestamp: Number(editTimestamp),
          message: message!,
        };
      case 'error':
      default:
        throw new Error(cb.message.value);
    }
  }

  async updateName(name: string) {
    const req = new SetLocalNameRequest({
      localParticipantHandle: this.ffi_handle.handle,
      name: name,
    });

    const res = FfiClient.instance.request<SetLocalNameResponse>({
      message: { case: 'setLocalName', value: req },
    });

    await FfiClient.instance.waitFor<SetLocalNameCallback>((ev) => {
      return ev.message.case == 'setLocalName' && ev.message.value.asyncId == res.asyncId;
    });
  }

  async setAttributes(attributes: Record<string, string>) {
    const req = new SetLocalAttributesRequest({
      localParticipantHandle: this.ffi_handle.handle,
      attributes: Object.entries(attributes).map(([key, value]) => ({ key, value })),
    });

    const res = FfiClient.instance.request<SetLocalAttributesResponse>({
      message: { case: 'setLocalAttributes', value: req },
    });

    await FfiClient.instance.waitFor<SetLocalAttributesCallback>((ev) => {
      return ev.message.case == 'setLocalAttributes' && ev.message.value.asyncId == res.asyncId;
    });
  }

  async publishTrack(
    track: LocalTrack,
    options: TrackPublishOptions,
  ): Promise<LocalTrackPublication> {
    const req = new PublishTrackRequest({
      localParticipantHandle: this.ffi_handle.handle,
      trackHandle: track.ffi_handle.handle,
      options: options,
    });

    const res = FfiClient.instance.request<PublishTrackResponse>({
      message: { case: 'publishTrack', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PublishTrackCallback>((ev) => {
      return ev.message.case == 'publishTrack' && ev.message.value.asyncId == res.asyncId;
    });

    switch (cb.message.case) {
      case 'publication':
        const track_publication = new LocalTrackPublication(cb.message.value!);
        track_publication.track = track;
        this.trackPublications.set(track_publication.sid!, track_publication);

        return track_publication;
      case 'error':
      default:
        throw new Error(cb.message.value);
    }
  }

  async unpublishTrack(trackSid: string) {
    const req = new UnpublishTrackRequest({
      localParticipantHandle: this.ffi_handle.handle,
      trackSid: trackSid,
    });

    const res = FfiClient.instance.request<UnpublishTrackResponse>({
      message: { case: 'unpublishTrack', value: req },
    });

    const cb = await FfiClient.instance.waitFor<UnpublishTrackCallback>((ev) => {
      return ev.message.case == 'unpublishTrack' && ev.message.value.asyncId == res.asyncId;
    });

    if (cb.error) {
      throw new Error(cb.error);
    }

    const pub = this.trackPublications.get(trackSid);
    if (pub) {
      pub.track = undefined;
    }
    this.trackPublications.delete(trackSid);
  }

  /**
   * Initiate an RPC call to a remote participant.
   * @param params - Parameters for initiating the RPC call, see {@link PerformRpcParams}
   * @returns A promise that resolves with the response payload or rejects with an error.
   * @throws Error on failure. Details in `message`.
   */
  async performRpc({
    destinationIdentity,
    method,
    payload,
    responseTimeout,
  }: PerformRpcParams): Promise<string> {
    const req = new PerformRpcRequest({
      localParticipantHandle: this.ffi_handle.handle,
      destinationIdentity,
      method,
      payload,
      responseTimeoutMs: responseTimeout,
    });

    const res = FfiClient.instance.request<PerformRpcResponse>({
      message: { case: 'performRpc', value: req },
    });

    const cb = await FfiClient.instance.waitFor<PerformRpcCallback>((ev) => {
      return ev.message.case === 'performRpc' && ev.message.value.asyncId === res.asyncId;
    });

    if (cb.error) {
      throw RpcError.fromProto(cb.error);
    }

    return cb.payload!;
  }

  /**
   * Establishes the participant as a receiver for calls of the specified RPC method.
   * Will overwrite any existing callback for the same method.
   *
   * @param method - The name of the indicated RPC method
   * @param handler - Will be invoked when an RPC request for this method is received
   * @returns A promise that resolves when the method is successfully registered
   *
   * @example
   * ```typescript
   * room.localParticipant?.registerRpcMethod(
   *   'greet',
   *   async (data: RpcInvocationData) => {
   *     console.log(`Received greeting from ${data.callerIdentity}: ${data.payload}`);
   *     return `Hello, ${data.callerIdentity}!`;
   *   }
   * );
   * ```
   *
   * See {@link RpcInvocationData} for more details on invocation params.
   *
   * The handler should return a Promise that resolves to a string.
   * If unable to respond within `responseTimeout`, the request will result in an error on the caller's side.
   *
   * You may throw errors of type `RpcError` with a string `message` in the handler,
   * and they will be received on the caller's side with the message intact.
   * Other errors thrown in your handler will not be transmitted as-is, and will instead arrive to the caller as `1500` ("Application Error").
   */
  registerRpcMethod(method: string, handler: (data: RpcInvocationData) => Promise<string>) {
    this.rpcHandlers.set(method, handler);

    const req = new RegisterRpcMethodRequest({
      localParticipantHandle: this.ffi_handle.handle,
      method,
    });

    FfiClient.instance.request<RegisterRpcMethodResponse>({
      message: { case: 'registerRpcMethod', value: req },
    });
  }

  /**
   * Unregisters a previously registered RPC method.
   *
   * @param method - The name of the RPC method to unregister
   */
  unregisterRpcMethod(method: string) {
    this.rpcHandlers.delete(method);

    const req = new UnregisterRpcMethodRequest({
      localParticipantHandle: this.ffi_handle.handle,
      method,
    });

    FfiClient.instance.request<UnregisterRpcMethodResponse>({
      message: { case: 'unregisterRpcMethod', value: req },
    });
  }

  /** @internal */
  async handleRpcMethodInvocation(
    invocationId: bigint,
    method: string,
    requestId: string,
    callerIdentity: string,
    payload: string,
    responseTimeout: number,
  ) {
    let responseError: RpcError | null = null;
    let responsePayload: string | null = null;

    const handler = this.rpcHandlers.get(method);

    if (!handler) {
      responseError = RpcError.builtIn('UNSUPPORTED_METHOD');
    } else {
      try {
        responsePayload = await handler({ requestId, callerIdentity, payload, responseTimeout });
      } catch (error) {
        if (error instanceof RpcError) {
          responseError = error;
        } else {
          console.warn(
            `Uncaught error returned by RPC handler for ${method}. Returning APPLICATION_ERROR instead.`,
            error,
          );
          responseError = RpcError.builtIn('APPLICATION_ERROR');
        }
      }
    }

    const req = new RpcMethodInvocationResponseRequest({
      localParticipantHandle: this.ffi_handle.handle,
      invocationId,
      error: responseError ? responseError.toProto() : undefined,
      payload: responsePayload ?? undefined,
    });

    const res = FfiClient.instance.request<RpcMethodInvocationResponseResponse>({
      message: { case: 'rpcMethodInvocationResponse', value: req },
    });

    if (res.error) {
      console.warn(`error sending rpc method invocation response: ${res.error}`);
    }
  }
}

export class RemoteParticipant extends Participant {
  trackPublications: Map<string, RemoteTrackPublication> = new Map();

  constructor(owned_info: OwnedParticipant) {
    super(owned_info);
  }
}
