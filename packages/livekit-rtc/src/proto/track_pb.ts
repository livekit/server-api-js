// Copyright 2023 LiveKit, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// @generated by protoc-gen-es v1.10.0 with parameter "target=ts,import_extension=.js"
// @generated from file track.proto (package livekit.proto, syntax proto2)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto2 } from "@bufbuild/protobuf";
import { RtcStats } from "./stats_pb.js";
import { EncryptionType } from "./e2ee_pb.js";
import { FfiOwnedHandle } from "./handle_pb.js";

/**
 * @generated from enum livekit.proto.TrackKind
 */
export enum TrackKind {
  /**
   * @generated from enum value: KIND_UNKNOWN = 0;
   */
  KIND_UNKNOWN = 0,

  /**
   * @generated from enum value: KIND_AUDIO = 1;
   */
  KIND_AUDIO = 1,

  /**
   * @generated from enum value: KIND_VIDEO = 2;
   */
  KIND_VIDEO = 2,
}
// Retrieve enum metadata with: proto2.getEnumType(TrackKind)
proto2.util.setEnumType(TrackKind, "livekit.proto.TrackKind", [
  { no: 0, name: "KIND_UNKNOWN" },
  { no: 1, name: "KIND_AUDIO" },
  { no: 2, name: "KIND_VIDEO" },
]);

/**
 * @generated from enum livekit.proto.TrackSource
 */
export enum TrackSource {
  /**
   * @generated from enum value: SOURCE_UNKNOWN = 0;
   */
  SOURCE_UNKNOWN = 0,

  /**
   * @generated from enum value: SOURCE_CAMERA = 1;
   */
  SOURCE_CAMERA = 1,

  /**
   * @generated from enum value: SOURCE_MICROPHONE = 2;
   */
  SOURCE_MICROPHONE = 2,

  /**
   * @generated from enum value: SOURCE_SCREENSHARE = 3;
   */
  SOURCE_SCREENSHARE = 3,

  /**
   * @generated from enum value: SOURCE_SCREENSHARE_AUDIO = 4;
   */
  SOURCE_SCREENSHARE_AUDIO = 4,
}
// Retrieve enum metadata with: proto2.getEnumType(TrackSource)
proto2.util.setEnumType(TrackSource, "livekit.proto.TrackSource", [
  { no: 0, name: "SOURCE_UNKNOWN" },
  { no: 1, name: "SOURCE_CAMERA" },
  { no: 2, name: "SOURCE_MICROPHONE" },
  { no: 3, name: "SOURCE_SCREENSHARE" },
  { no: 4, name: "SOURCE_SCREENSHARE_AUDIO" },
]);

/**
 * @generated from enum livekit.proto.StreamState
 */
export enum StreamState {
  /**
   * @generated from enum value: STATE_UNKNOWN = 0;
   */
  STATE_UNKNOWN = 0,

  /**
   * @generated from enum value: STATE_ACTIVE = 1;
   */
  STATE_ACTIVE = 1,

  /**
   * @generated from enum value: STATE_PAUSED = 2;
   */
  STATE_PAUSED = 2,
}
// Retrieve enum metadata with: proto2.getEnumType(StreamState)
proto2.util.setEnumType(StreamState, "livekit.proto.StreamState", [
  { no: 0, name: "STATE_UNKNOWN" },
  { no: 1, name: "STATE_ACTIVE" },
  { no: 2, name: "STATE_PAUSED" },
]);

/**
 * Create a new VideoTrack from a VideoSource
 *
 * @generated from message livekit.proto.CreateVideoTrackRequest
 */
export class CreateVideoTrackRequest extends Message<CreateVideoTrackRequest> {
  /**
   * @generated from field: required string name = 1;
   */
  name?: string;

  /**
   * @generated from field: required uint64 source_handle = 2;
   */
  sourceHandle?: bigint;

  constructor(data?: PartialMessage<CreateVideoTrackRequest>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.CreateVideoTrackRequest";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */, req: true },
    { no: 2, name: "source_handle", kind: "scalar", T: 4 /* ScalarType.UINT64 */, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateVideoTrackRequest {
    return new CreateVideoTrackRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateVideoTrackRequest {
    return new CreateVideoTrackRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateVideoTrackRequest {
    return new CreateVideoTrackRequest().fromJsonString(jsonString, options);
  }

  static equals(a: CreateVideoTrackRequest | PlainMessage<CreateVideoTrackRequest> | undefined, b: CreateVideoTrackRequest | PlainMessage<CreateVideoTrackRequest> | undefined): boolean {
    return proto2.util.equals(CreateVideoTrackRequest, a, b);
  }
}

/**
 * @generated from message livekit.proto.CreateVideoTrackResponse
 */
export class CreateVideoTrackResponse extends Message<CreateVideoTrackResponse> {
  /**
   * @generated from field: required livekit.proto.OwnedTrack track = 1;
   */
  track?: OwnedTrack;

  constructor(data?: PartialMessage<CreateVideoTrackResponse>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.CreateVideoTrackResponse";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "track", kind: "message", T: OwnedTrack, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateVideoTrackResponse {
    return new CreateVideoTrackResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateVideoTrackResponse {
    return new CreateVideoTrackResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateVideoTrackResponse {
    return new CreateVideoTrackResponse().fromJsonString(jsonString, options);
  }

  static equals(a: CreateVideoTrackResponse | PlainMessage<CreateVideoTrackResponse> | undefined, b: CreateVideoTrackResponse | PlainMessage<CreateVideoTrackResponse> | undefined): boolean {
    return proto2.util.equals(CreateVideoTrackResponse, a, b);
  }
}

/**
 * Create a new AudioTrack from a AudioSource
 *
 * @generated from message livekit.proto.CreateAudioTrackRequest
 */
export class CreateAudioTrackRequest extends Message<CreateAudioTrackRequest> {
  /**
   * @generated from field: required string name = 1;
   */
  name?: string;

  /**
   * @generated from field: required uint64 source_handle = 2;
   */
  sourceHandle?: bigint;

  constructor(data?: PartialMessage<CreateAudioTrackRequest>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.CreateAudioTrackRequest";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */, req: true },
    { no: 2, name: "source_handle", kind: "scalar", T: 4 /* ScalarType.UINT64 */, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateAudioTrackRequest {
    return new CreateAudioTrackRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateAudioTrackRequest {
    return new CreateAudioTrackRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateAudioTrackRequest {
    return new CreateAudioTrackRequest().fromJsonString(jsonString, options);
  }

  static equals(a: CreateAudioTrackRequest | PlainMessage<CreateAudioTrackRequest> | undefined, b: CreateAudioTrackRequest | PlainMessage<CreateAudioTrackRequest> | undefined): boolean {
    return proto2.util.equals(CreateAudioTrackRequest, a, b);
  }
}

/**
 * @generated from message livekit.proto.CreateAudioTrackResponse
 */
export class CreateAudioTrackResponse extends Message<CreateAudioTrackResponse> {
  /**
   * @generated from field: required livekit.proto.OwnedTrack track = 1;
   */
  track?: OwnedTrack;

  constructor(data?: PartialMessage<CreateAudioTrackResponse>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.CreateAudioTrackResponse";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "track", kind: "message", T: OwnedTrack, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CreateAudioTrackResponse {
    return new CreateAudioTrackResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CreateAudioTrackResponse {
    return new CreateAudioTrackResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CreateAudioTrackResponse {
    return new CreateAudioTrackResponse().fromJsonString(jsonString, options);
  }

  static equals(a: CreateAudioTrackResponse | PlainMessage<CreateAudioTrackResponse> | undefined, b: CreateAudioTrackResponse | PlainMessage<CreateAudioTrackResponse> | undefined): boolean {
    return proto2.util.equals(CreateAudioTrackResponse, a, b);
  }
}

/**
 * @generated from message livekit.proto.GetStatsRequest
 */
export class GetStatsRequest extends Message<GetStatsRequest> {
  /**
   * @generated from field: required uint64 track_handle = 1;
   */
  trackHandle?: bigint;

  constructor(data?: PartialMessage<GetStatsRequest>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.GetStatsRequest";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "track_handle", kind: "scalar", T: 4 /* ScalarType.UINT64 */, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetStatsRequest {
    return new GetStatsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetStatsRequest {
    return new GetStatsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetStatsRequest {
    return new GetStatsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetStatsRequest | PlainMessage<GetStatsRequest> | undefined, b: GetStatsRequest | PlainMessage<GetStatsRequest> | undefined): boolean {
    return proto2.util.equals(GetStatsRequest, a, b);
  }
}

/**
 * @generated from message livekit.proto.GetStatsResponse
 */
export class GetStatsResponse extends Message<GetStatsResponse> {
  /**
   * @generated from field: required uint64 async_id = 1;
   */
  asyncId?: bigint;

  constructor(data?: PartialMessage<GetStatsResponse>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.GetStatsResponse";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "async_id", kind: "scalar", T: 4 /* ScalarType.UINT64 */, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetStatsResponse {
    return new GetStatsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetStatsResponse {
    return new GetStatsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetStatsResponse {
    return new GetStatsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetStatsResponse | PlainMessage<GetStatsResponse> | undefined, b: GetStatsResponse | PlainMessage<GetStatsResponse> | undefined): boolean {
    return proto2.util.equals(GetStatsResponse, a, b);
  }
}

/**
 * @generated from message livekit.proto.GetStatsCallback
 */
export class GetStatsCallback extends Message<GetStatsCallback> {
  /**
   * @generated from field: required uint64 async_id = 1;
   */
  asyncId?: bigint;

  /**
   * @generated from field: optional string error = 2;
   */
  error?: string;

  /**
   * @generated from field: repeated livekit.proto.RtcStats stats = 3;
   */
  stats: RtcStats[] = [];

  constructor(data?: PartialMessage<GetStatsCallback>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.GetStatsCallback";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "async_id", kind: "scalar", T: 4 /* ScalarType.UINT64 */, req: true },
    { no: 2, name: "error", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
    { no: 3, name: "stats", kind: "message", T: RtcStats, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetStatsCallback {
    return new GetStatsCallback().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetStatsCallback {
    return new GetStatsCallback().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetStatsCallback {
    return new GetStatsCallback().fromJsonString(jsonString, options);
  }

  static equals(a: GetStatsCallback | PlainMessage<GetStatsCallback> | undefined, b: GetStatsCallback | PlainMessage<GetStatsCallback> | undefined): boolean {
    return proto2.util.equals(GetStatsCallback, a, b);
  }
}

/**
 * @generated from message livekit.proto.TrackEvent
 */
export class TrackEvent extends Message<TrackEvent> {
  constructor(data?: PartialMessage<TrackEvent>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.TrackEvent";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TrackEvent {
    return new TrackEvent().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TrackEvent {
    return new TrackEvent().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TrackEvent {
    return new TrackEvent().fromJsonString(jsonString, options);
  }

  static equals(a: TrackEvent | PlainMessage<TrackEvent> | undefined, b: TrackEvent | PlainMessage<TrackEvent> | undefined): boolean {
    return proto2.util.equals(TrackEvent, a, b);
  }
}

/**
 * @generated from message livekit.proto.TrackPublicationInfo
 */
export class TrackPublicationInfo extends Message<TrackPublicationInfo> {
  /**
   * @generated from field: required string sid = 1;
   */
  sid?: string;

  /**
   * @generated from field: required string name = 2;
   */
  name?: string;

  /**
   * @generated from field: required livekit.proto.TrackKind kind = 3;
   */
  kind?: TrackKind;

  /**
   * @generated from field: required livekit.proto.TrackSource source = 4;
   */
  source?: TrackSource;

  /**
   * @generated from field: required bool simulcasted = 5;
   */
  simulcasted?: boolean;

  /**
   * @generated from field: required uint32 width = 6;
   */
  width?: number;

  /**
   * @generated from field: required uint32 height = 7;
   */
  height?: number;

  /**
   * @generated from field: required string mime_type = 8;
   */
  mimeType?: string;

  /**
   * @generated from field: required bool muted = 9;
   */
  muted?: boolean;

  /**
   * @generated from field: required bool remote = 10;
   */
  remote?: boolean;

  /**
   * @generated from field: required livekit.proto.EncryptionType encryption_type = 11;
   */
  encryptionType?: EncryptionType;

  constructor(data?: PartialMessage<TrackPublicationInfo>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.TrackPublicationInfo";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "sid", kind: "scalar", T: 9 /* ScalarType.STRING */, req: true },
    { no: 2, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */, req: true },
    { no: 3, name: "kind", kind: "enum", T: proto2.getEnumType(TrackKind), req: true },
    { no: 4, name: "source", kind: "enum", T: proto2.getEnumType(TrackSource), req: true },
    { no: 5, name: "simulcasted", kind: "scalar", T: 8 /* ScalarType.BOOL */, req: true },
    { no: 6, name: "width", kind: "scalar", T: 13 /* ScalarType.UINT32 */, req: true },
    { no: 7, name: "height", kind: "scalar", T: 13 /* ScalarType.UINT32 */, req: true },
    { no: 8, name: "mime_type", kind: "scalar", T: 9 /* ScalarType.STRING */, req: true },
    { no: 9, name: "muted", kind: "scalar", T: 8 /* ScalarType.BOOL */, req: true },
    { no: 10, name: "remote", kind: "scalar", T: 8 /* ScalarType.BOOL */, req: true },
    { no: 11, name: "encryption_type", kind: "enum", T: proto2.getEnumType(EncryptionType), req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TrackPublicationInfo {
    return new TrackPublicationInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TrackPublicationInfo {
    return new TrackPublicationInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TrackPublicationInfo {
    return new TrackPublicationInfo().fromJsonString(jsonString, options);
  }

  static equals(a: TrackPublicationInfo | PlainMessage<TrackPublicationInfo> | undefined, b: TrackPublicationInfo | PlainMessage<TrackPublicationInfo> | undefined): boolean {
    return proto2.util.equals(TrackPublicationInfo, a, b);
  }
}

/**
 * @generated from message livekit.proto.OwnedTrackPublication
 */
export class OwnedTrackPublication extends Message<OwnedTrackPublication> {
  /**
   * @generated from field: required livekit.proto.FfiOwnedHandle handle = 1;
   */
  handle?: FfiOwnedHandle;

  /**
   * @generated from field: required livekit.proto.TrackPublicationInfo info = 2;
   */
  info?: TrackPublicationInfo;

  constructor(data?: PartialMessage<OwnedTrackPublication>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.OwnedTrackPublication";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "handle", kind: "message", T: FfiOwnedHandle, req: true },
    { no: 2, name: "info", kind: "message", T: TrackPublicationInfo, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OwnedTrackPublication {
    return new OwnedTrackPublication().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OwnedTrackPublication {
    return new OwnedTrackPublication().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OwnedTrackPublication {
    return new OwnedTrackPublication().fromJsonString(jsonString, options);
  }

  static equals(a: OwnedTrackPublication | PlainMessage<OwnedTrackPublication> | undefined, b: OwnedTrackPublication | PlainMessage<OwnedTrackPublication> | undefined): boolean {
    return proto2.util.equals(OwnedTrackPublication, a, b);
  }
}

/**
 * @generated from message livekit.proto.TrackInfo
 */
export class TrackInfo extends Message<TrackInfo> {
  /**
   * @generated from field: required string sid = 1;
   */
  sid?: string;

  /**
   * @generated from field: required string name = 2;
   */
  name?: string;

  /**
   * @generated from field: required livekit.proto.TrackKind kind = 3;
   */
  kind?: TrackKind;

  /**
   * @generated from field: required livekit.proto.StreamState stream_state = 4;
   */
  streamState?: StreamState;

  /**
   * @generated from field: required bool muted = 5;
   */
  muted?: boolean;

  /**
   * @generated from field: required bool remote = 6;
   */
  remote?: boolean;

  constructor(data?: PartialMessage<TrackInfo>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.TrackInfo";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "sid", kind: "scalar", T: 9 /* ScalarType.STRING */, req: true },
    { no: 2, name: "name", kind: "scalar", T: 9 /* ScalarType.STRING */, req: true },
    { no: 3, name: "kind", kind: "enum", T: proto2.getEnumType(TrackKind), req: true },
    { no: 4, name: "stream_state", kind: "enum", T: proto2.getEnumType(StreamState), req: true },
    { no: 5, name: "muted", kind: "scalar", T: 8 /* ScalarType.BOOL */, req: true },
    { no: 6, name: "remote", kind: "scalar", T: 8 /* ScalarType.BOOL */, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TrackInfo {
    return new TrackInfo().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TrackInfo {
    return new TrackInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TrackInfo {
    return new TrackInfo().fromJsonString(jsonString, options);
  }

  static equals(a: TrackInfo | PlainMessage<TrackInfo> | undefined, b: TrackInfo | PlainMessage<TrackInfo> | undefined): boolean {
    return proto2.util.equals(TrackInfo, a, b);
  }
}

/**
 * @generated from message livekit.proto.OwnedTrack
 */
export class OwnedTrack extends Message<OwnedTrack> {
  /**
   * @generated from field: required livekit.proto.FfiOwnedHandle handle = 1;
   */
  handle?: FfiOwnedHandle;

  /**
   * @generated from field: required livekit.proto.TrackInfo info = 2;
   */
  info?: TrackInfo;

  constructor(data?: PartialMessage<OwnedTrack>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.OwnedTrack";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "handle", kind: "message", T: FfiOwnedHandle, req: true },
    { no: 2, name: "info", kind: "message", T: TrackInfo, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): OwnedTrack {
    return new OwnedTrack().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): OwnedTrack {
    return new OwnedTrack().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): OwnedTrack {
    return new OwnedTrack().fromJsonString(jsonString, options);
  }

  static equals(a: OwnedTrack | PlainMessage<OwnedTrack> | undefined, b: OwnedTrack | PlainMessage<OwnedTrack> | undefined): boolean {
    return proto2.util.equals(OwnedTrack, a, b);
  }
}

/**
 * Mute/UnMute a track
 *
 * @generated from message livekit.proto.LocalTrackMuteRequest
 */
export class LocalTrackMuteRequest extends Message<LocalTrackMuteRequest> {
  /**
   * @generated from field: required uint64 track_handle = 1;
   */
  trackHandle?: bigint;

  /**
   * @generated from field: required bool mute = 2;
   */
  mute?: boolean;

  constructor(data?: PartialMessage<LocalTrackMuteRequest>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.LocalTrackMuteRequest";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "track_handle", kind: "scalar", T: 4 /* ScalarType.UINT64 */, req: true },
    { no: 2, name: "mute", kind: "scalar", T: 8 /* ScalarType.BOOL */, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LocalTrackMuteRequest {
    return new LocalTrackMuteRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LocalTrackMuteRequest {
    return new LocalTrackMuteRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LocalTrackMuteRequest {
    return new LocalTrackMuteRequest().fromJsonString(jsonString, options);
  }

  static equals(a: LocalTrackMuteRequest | PlainMessage<LocalTrackMuteRequest> | undefined, b: LocalTrackMuteRequest | PlainMessage<LocalTrackMuteRequest> | undefined): boolean {
    return proto2.util.equals(LocalTrackMuteRequest, a, b);
  }
}

/**
 * @generated from message livekit.proto.LocalTrackMuteResponse
 */
export class LocalTrackMuteResponse extends Message<LocalTrackMuteResponse> {
  /**
   * @generated from field: required bool muted = 1;
   */
  muted?: boolean;

  constructor(data?: PartialMessage<LocalTrackMuteResponse>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.LocalTrackMuteResponse";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "muted", kind: "scalar", T: 8 /* ScalarType.BOOL */, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): LocalTrackMuteResponse {
    return new LocalTrackMuteResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): LocalTrackMuteResponse {
    return new LocalTrackMuteResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): LocalTrackMuteResponse {
    return new LocalTrackMuteResponse().fromJsonString(jsonString, options);
  }

  static equals(a: LocalTrackMuteResponse | PlainMessage<LocalTrackMuteResponse> | undefined, b: LocalTrackMuteResponse | PlainMessage<LocalTrackMuteResponse> | undefined): boolean {
    return proto2.util.equals(LocalTrackMuteResponse, a, b);
  }
}

/**
 * Enable/Disable a remote track
 *
 * @generated from message livekit.proto.EnableRemoteTrackRequest
 */
export class EnableRemoteTrackRequest extends Message<EnableRemoteTrackRequest> {
  /**
   * @generated from field: required uint64 track_handle = 1;
   */
  trackHandle?: bigint;

  /**
   * @generated from field: required bool enabled = 2;
   */
  enabled?: boolean;

  constructor(data?: PartialMessage<EnableRemoteTrackRequest>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.EnableRemoteTrackRequest";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "track_handle", kind: "scalar", T: 4 /* ScalarType.UINT64 */, req: true },
    { no: 2, name: "enabled", kind: "scalar", T: 8 /* ScalarType.BOOL */, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): EnableRemoteTrackRequest {
    return new EnableRemoteTrackRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): EnableRemoteTrackRequest {
    return new EnableRemoteTrackRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): EnableRemoteTrackRequest {
    return new EnableRemoteTrackRequest().fromJsonString(jsonString, options);
  }

  static equals(a: EnableRemoteTrackRequest | PlainMessage<EnableRemoteTrackRequest> | undefined, b: EnableRemoteTrackRequest | PlainMessage<EnableRemoteTrackRequest> | undefined): boolean {
    return proto2.util.equals(EnableRemoteTrackRequest, a, b);
  }
}

/**
 * @generated from message livekit.proto.EnableRemoteTrackResponse
 */
export class EnableRemoteTrackResponse extends Message<EnableRemoteTrackResponse> {
  /**
   * @generated from field: required bool enabled = 1;
   */
  enabled?: boolean;

  constructor(data?: PartialMessage<EnableRemoteTrackResponse>) {
    super();
    proto2.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto2 = proto2;
  static readonly typeName = "livekit.proto.EnableRemoteTrackResponse";
  static readonly fields: FieldList = proto2.util.newFieldList(() => [
    { no: 1, name: "enabled", kind: "scalar", T: 8 /* ScalarType.BOOL */, req: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): EnableRemoteTrackResponse {
    return new EnableRemoteTrackResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): EnableRemoteTrackResponse {
    return new EnableRemoteTrackResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): EnableRemoteTrackResponse {
    return new EnableRemoteTrackResponse().fromJsonString(jsonString, options);
  }

  static equals(a: EnableRemoteTrackResponse | PlainMessage<EnableRemoteTrackResponse> | undefined, b: EnableRemoteTrackResponse | PlainMessage<EnableRemoteTrackResponse> | undefined): boolean {
    return proto2.util.equals(EnableRemoteTrackResponse, a, b);
  }
}

