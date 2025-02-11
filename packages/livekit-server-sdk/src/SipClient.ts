// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { Duration } from '@bufbuild/protobuf';
import type { RoomConfiguration, SIPHeaderOptions } from '@livekit/protocol';
import {
  CreateSIPDispatchRuleRequest,
  CreateSIPInboundTrunkRequest,
  CreateSIPOutboundTrunkRequest,
  CreateSIPParticipantRequest,
  CreateSIPTrunkRequest,
  DeleteSIPDispatchRuleRequest,
  DeleteSIPTrunkRequest,
  ListSIPDispatchRuleRequest,
  ListSIPDispatchRuleResponse,
  ListSIPInboundTrunkRequest,
  ListSIPInboundTrunkResponse,
  ListSIPOutboundTrunkRequest,
  ListSIPOutboundTrunkResponse,
  ListSIPTrunkRequest,
  ListSIPTrunkResponse,
  SIPDispatchRule,
  SIPDispatchRuleDirect,
  SIPDispatchRuleIndividual,
  SIPDispatchRuleInfo,
  SIPInboundTrunkInfo,
  SIPOutboundTrunkInfo,
  SIPParticipantInfo,
  SIPTransport,
  SIPTrunkInfo,
  TransferSIPParticipantRequest,
} from '@livekit/protocol';
import { ServiceBase } from './ServiceBase.js';
import type { Rpc } from './TwirpRPC.js';
import { TwirpRpc, livekitPackage } from './TwirpRPC.js';

const svc = 'SIP';

/**
 * @deprecated use CreateSipInboundTrunkOptions or CreateSipOutboundTrunkOptions
 */
export interface CreateSipTrunkOptions {
  name?: string;
  metadata?: string;
  inbound_addresses?: string[];
  inbound_numbers?: string[];
  inbound_username?: string;
  inbound_password?: string;
  outbound_address?: string;
  outbound_username?: string;
  outbound_password?: string;
}
export interface CreateSipInboundTrunkOptions {
  metadata?: string;
  /** @deprecated - use `allowedAddresses` instead */
  allowed_addresses?: string[];
  allowedAddresses?: string[];
  /** @deprecated - use `allowedNumbers` instead */
  allowed_numbers?: string[];
  allowedNumbers?: string[];
  /** @deprecated - use `authUsername` instead */
  auth_username?: string;
  authUsername?: string;
  /** @deprecated - use `authPassword` instead */
  auth_password?: string;
  authPassword?: string;
  headers?: { [key: string]: string };
  headersToAttributes?: { [key: string]: string };
  // Map SIP response headers from INVITE to sip.h.* participant attributes automatically.
  includeHeaders?: SIPHeaderOptions;
  krispEnabled?: boolean;
}
export interface CreateSipOutboundTrunkOptions {
  metadata?: string;
  transport: SIPTransport;
  /** @deprecated - use `authUsername` instead */
  auth_username?: string;
  authUsername?: string;
  /** @deprecated - use `authPassword` instead */
  auth_password?: string;
  authPassword?: string;
  headers?: { [key: string]: string };
  headersToAttributes?: { [key: string]: string };
  // Map SIP response headers from INVITE to sip.h.* participant attributes automatically.
  includeHeaders?: SIPHeaderOptions;
}

export interface SipDispatchRuleDirect {
  type: 'direct';
  roomName: string;
  pin?: string;
}

export interface SipDispatchRuleIndividual {
  type: 'individual';
  roomPrefix: string;
  pin?: string;
}

export interface CreateSipDispatchRuleOptions {
  name?: string;
  metadata?: string;
  trunkIds?: string[];
  hidePhoneNumber?: boolean;
  attributes?: { [key: string]: string };
  roomPreset?: string;
  roomConfig?: RoomConfiguration;
}

export interface CreateSipParticipantOptions {
  participantIdentity?: string;
  participantName?: string;
  participantMetadata?: string;
  participantAttributes?: { [key: string]: string };
  dtmf?: string;
  /** @deprecated - use `playDialtone` instead */
  playRingtone?: boolean; // Deprecated, use playDialtone instead
  playDialtone?: boolean;
  // These headers are sent as-is and may help identify this call as coming from LiveKit for the other SIP endpoint.
  headers?: { [key: string]: string };
  // Map SIP response headers from INVITE to sip.h.* participant attributes automatically.
  includeHeaders?: SIPHeaderOptions;
  hidePhoneNumber?: boolean;
  ringingTimeout?: number; // Duration in seconds
  maxCallDuration?: number; // Duration in seconds
  enableKrisp?: boolean;
  sipNumber?: string; // Optional SIP From number to use. If empty, trunk number is used.
}

export interface TransferSipParticipantOptions {
  playDialtone?: boolean;
  headers?: { [key: string]: string };
}

/**
 * Client to access Egress APIs
 */
export class SipClient extends ServiceBase {
  private readonly rpc: Rpc;

  /**
   * @param host - hostname including protocol. i.e. 'https://<project>.livekit.cloud'
   * @param apiKey - API Key, can be set in env var LIVEKIT_API_KEY
   * @param secret - API Secret, can be set in env var LIVEKIT_API_SECRET
   */
  constructor(host: string, apiKey?: string, secret?: string) {
    super(apiKey, secret);
    this.rpc = new TwirpRpc(host, livekitPackage);
  }

  /**
   * @param number - phone number of the trunk
   * @param opts - CreateSipTrunkOptions
   * @deprecated use `createSipInboundTrunk` or `createSipOutboundTrunk`
   */
  async createSipTrunk(number: string, opts?: CreateSipTrunkOptions): Promise<SIPTrunkInfo> {
    let inboundAddresses: string[] | undefined;
    let inboundNumbers: string[] | undefined;
    let inboundUsername: string = '';
    let inboundPassword: string = '';
    let outboundAddress: string = '';
    let outboundUsername: string = '';
    let outboundPassword: string = '';
    let name: string = '';
    let metadata: string = '';

    if (opts !== undefined) {
      inboundAddresses = opts.inbound_addresses;
      inboundNumbers = opts.inbound_numbers;
      inboundUsername = opts.inbound_username || '';
      inboundPassword = opts.inbound_password || '';
      outboundAddress = opts.outbound_address || '';
      outboundUsername = opts.outbound_username || '';
      outboundPassword = opts.outbound_password || '';
      name = opts.name || '';
      metadata = opts.metadata || '';
    }

    const req = new CreateSIPTrunkRequest({
      name: name,
      metadata: metadata,
      inboundAddresses: inboundAddresses,
      inboundNumbers: inboundNumbers,
      inboundUsername: inboundUsername,
      inboundPassword: inboundPassword,
      outboundNumber: number,
      outboundAddress: outboundAddress,
      outboundUsername: outboundUsername,
      outboundPassword: outboundPassword,
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'CreateSIPTrunk',
      req,
      await this.authHeader({}, { admin: true }),
    );
    return SIPTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * @param name - human-readable name of the trunk
   * @param numbers - phone numbers of the trunk
   * @param opts - CreateSipTrunkOptions
   */
  async createSipInboundTrunk(
    name: string,
    numbers: string[],
    opts?: CreateSipInboundTrunkOptions,
  ): Promise<SIPInboundTrunkInfo> {
    if (opts === undefined) {
      opts = {};
    }
    const req = new CreateSIPInboundTrunkRequest({
      trunk: new SIPInboundTrunkInfo({
        name: name,
        numbers: numbers,
        metadata: opts?.metadata,
        allowedAddresses: opts.allowedAddresses ?? opts.allowed_addresses,
        allowedNumbers: opts.allowedNumbers ?? opts.allowed_numbers,
        authUsername: opts.authUsername ?? opts.auth_username,
        authPassword: opts.authPassword ?? opts.auth_password,
        headers: opts.headers,
        headersToAttributes: opts.headersToAttributes,
        includeHeaders: opts.includeHeaders,
        krispEnabled: opts.krispEnabled,
      }),
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'CreateSIPInboundTrunk',
      req,
      await this.authHeader({}, { admin: true }),
    );
    return SIPInboundTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * @param name - human-readable name of the trunk
   * @param address - hostname and port of the SIP server to dial
   * @param numbers - phone numbers of the trunk
   * @param opts - CreateSipTrunkOptions
   */
  async createSipOutboundTrunk(
    name: string,
    address: string,
    numbers: string[],
    opts?: CreateSipOutboundTrunkOptions,
  ): Promise<SIPOutboundTrunkInfo> {
    if (opts === undefined) {
      opts = {
        transport: SIPTransport.SIP_TRANSPORT_AUTO,
      };
    }

    const req = new CreateSIPOutboundTrunkRequest({
      trunk: new SIPOutboundTrunkInfo({
        name: name,
        address: address,
        numbers: numbers,
        metadata: opts.metadata,
        transport: opts.transport,
        authUsername: opts.authUsername ?? opts.auth_username,
        authPassword: opts.authPassword ?? opts.auth_password,
        headers: opts.headers,
        headersToAttributes: opts.headersToAttributes,
        includeHeaders: opts.includeHeaders,
      }),
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'CreateSIPOutboundTrunk',
      req,
      await this.authHeader({}, { admin: true }),
    );
    return SIPOutboundTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * @deprecated use `listSipInboundTrunk` or `listSipOutboundTrunk`
   */
  async listSipTrunk(): Promise<Array<SIPTrunkInfo>> {
    const req: Partial<ListSIPTrunkRequest> = {};
    const data = await this.rpc.request(
      svc,
      'ListSIPTrunk',
      new ListSIPTrunkRequest(req).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return ListSIPTrunkResponse.fromJson(data, { ignoreUnknownFields: true }).items ?? [];
  }

  async listSipInboundTrunk(): Promise<Array<SIPInboundTrunkInfo>> {
    const req: Partial<ListSIPInboundTrunkRequest> = {};
    const data = await this.rpc.request(
      svc,
      'ListSIPInboundTrunk',
      new ListSIPInboundTrunkRequest(req).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return ListSIPInboundTrunkResponse.fromJson(data, { ignoreUnknownFields: true }).items ?? [];
  }

  async listSipOutboundTrunk(): Promise<Array<SIPOutboundTrunkInfo>> {
    const req: Partial<ListSIPOutboundTrunkRequest> = {};
    const data = await this.rpc.request(
      svc,
      'ListSIPOutboundTrunk',
      new ListSIPOutboundTrunkRequest(req).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return ListSIPOutboundTrunkResponse.fromJson(data, { ignoreUnknownFields: true }).items ?? [];
  }

  /**
   * @param sipTrunkId - sip trunk to delete
   */
  async deleteSipTrunk(sipTrunkId: string): Promise<SIPTrunkInfo> {
    const data = await this.rpc.request(
      svc,
      'DeleteSIPTrunk',
      new DeleteSIPTrunkRequest({ sipTrunkId }).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return SIPTrunkInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * @param rule - sip dispatch rule
   * @param opts - CreateSipDispatchRuleOptions
   */
  async createSipDispatchRule(
    rule: SipDispatchRuleDirect | SipDispatchRuleIndividual,
    opts?: CreateSipDispatchRuleOptions,
  ): Promise<SIPDispatchRuleInfo> {
    if (opts === undefined) {
      opts = {};
    }
    let ruleProto: SIPDispatchRule | undefined = undefined;
    if (rule.type == 'direct') {
      ruleProto = new SIPDispatchRule({
        rule: {
          case: 'dispatchRuleDirect',
          value: new SIPDispatchRuleDirect({
            roomName: rule.roomName,
            pin: rule.pin || '',
          }),
        },
      });
    } else if (rule.type == 'individual') {
      ruleProto = new SIPDispatchRule({
        rule: {
          case: 'dispatchRuleIndividual',
          value: new SIPDispatchRuleIndividual({
            roomPrefix: rule.roomPrefix,
            pin: rule.pin || '',
          }),
        },
      });
    }

    const req = new CreateSIPDispatchRuleRequest({
      rule: ruleProto,
      trunkIds: opts.trunkIds,
      hidePhoneNumber: opts.hidePhoneNumber,
      name: opts.name,
      metadata: opts.metadata,
      attributes: opts.attributes,
      roomPreset: opts.roomPreset,
      roomConfig: opts.roomConfig,
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'CreateSIPDispatchRule',
      req,
      await this.authHeader({}, { admin: true }),
    );
    return SIPDispatchRuleInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  async listSipDispatchRule(): Promise<Array<SIPDispatchRuleInfo>> {
    const req: Partial<ListSIPDispatchRuleRequest> = {};
    const data = await this.rpc.request(
      svc,
      'ListSIPDispatchRule',
      new ListSIPDispatchRuleRequest(req).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return ListSIPDispatchRuleResponse.fromJson(data, { ignoreUnknownFields: true }).items ?? [];
  }

  /**
   * @param sipDispatchRuleId - sip trunk to delete
   */
  async deleteSipDispatchRule(sipDispatchRuleId: string): Promise<SIPDispatchRuleInfo> {
    const data = await this.rpc.request(
      svc,
      'DeleteSIPDispatchRule',
      new DeleteSIPDispatchRuleRequest({ sipDispatchRuleId }).toJson(),
      await this.authHeader({}, { admin: true }),
    );
    return SIPDispatchRuleInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * @param sipTrunkId - sip trunk to use for the call
   * @param number - number to dial
   * @param roomName - room to attach the call to
   * @param opts - CreateSipParticipantOptions
   */
  async createSipParticipant(
    sipTrunkId: string,
    number: string,
    roomName: string,
    opts?: CreateSipParticipantOptions,
  ): Promise<SIPParticipantInfo> {
    if (opts === undefined) {
      opts = {};
    }

    const req = new CreateSIPParticipantRequest({
      sipTrunkId: sipTrunkId,
      sipCallTo: number,
      sipNumber: opts.sipNumber,
      roomName: roomName,
      participantIdentity: opts.participantIdentity || 'sip-participant',
      participantName: opts.participantName,
      participantMetadata: opts.participantMetadata,
      participantAttributes: opts.participantAttributes,
      dtmf: opts.dtmf,
      playDialtone: opts.playDialtone ?? opts.playRingtone,
      headers: opts.headers,
      hidePhoneNumber: opts.hidePhoneNumber,
      includeHeaders: opts.includeHeaders,
      ringingTimeout: opts.ringingTimeout
        ? new Duration({ seconds: BigInt(opts.ringingTimeout) })
        : undefined,
      maxCallDuration: opts.maxCallDuration
        ? new Duration({ seconds: BigInt(opts.maxCallDuration) })
        : undefined,
      krispEnabled: opts.enableKrisp,
    }).toJson();

    const data = await this.rpc.request(
      svc,
      'CreateSIPParticipant',
      req,
      await this.authHeader({}, { call: true }),
    );
    return SIPParticipantInfo.fromJson(data, { ignoreUnknownFields: true });
  }

  /**
   * @param roomName - room the SIP participant to transfer is connectd to
   * @param participantIdentity - identity of the SIP participant to transfer
   * @param transferTo - SIP URL to transfer the participant to
   */
  async transferSipParticipant(
    roomName: string,
    participantIdentity: string,
    transferTo: string,
    opts?: TransferSipParticipantOptions,
  ): Promise<void> {
    if (opts === undefined) {
      opts = {};
    }

    const req = new TransferSIPParticipantRequest({
      participantIdentity: participantIdentity,
      roomName: roomName,
      transferTo: transferTo,
      playDialtone: opts.playDialtone,
      headers: opts.headers,
    }).toJson();

    await this.rpc.request(
      svc,
      'TransferSIPParticipant',
      req,
      await this.authHeader({ roomAdmin: true, room: roomName }, { call: true }),
    );
  }
}
