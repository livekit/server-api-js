// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0

import { RpcError as RpcError_Proto } from './proto/rpc_pb.js';

/**
 * Specialized error handling for RPC methods.
 *
 * Instances of this type, when thrown in a method handler, will have their `message`
 * serialized and sent across the wire. The sender will receive an equivalent error on the other side.
 *
 * Build-in types are included but developers may use any string, with a max length of 256 bytes.
 */

export class RpcError extends Error {
  static MAX_MESSAGE_BYTES = 256;
  static MAX_DATA_BYTES = 15360; // 15 KB

  code: number;
  data?: string;

  /**
   * Creates an error object with the given code and message, plus an optional data payload.
   *
   * If thrown in an RPC method handler, the error will be sent back to the caller.
   *
   * Error codes 1001-1999 are reserved for built-in errors (see RpcError.ErrorCode for their meanings).
   */
  constructor(code: number, message: string, data?: string) {
    super(message);
    this.code = code;
    this.message = truncateBytes(message, RpcError.MAX_MESSAGE_BYTES);
    this.data = data ? truncateBytes(data, RpcError.MAX_DATA_BYTES) : undefined;
  }

  static fromProto(proto: RpcError_Proto) {
    return new RpcError(proto.code, proto.message, proto.data);
  }

  toProto() {
    return new RpcError_Proto({
      code: this.code,
      message: this.message,
      data: this.data,
    });
  }

  static ErrorCode = {
    UNCAUGHT_ERROR: 1001,
    UNSUPPORTED_METHOD: 1002,
    CONNECTION_TIMEOUT: 1003,
    RESPONSE_TIMEOUT: 1004,
    RECIPIENT_DISCONNECTED: 1005,
    RECIPIENT_NOT_FOUND: 1006,
    REQUEST_PAYLOAD_TOO_LARGE: 1007,
    RESPONSE_PAYLOAD_TOO_LARGE: 1008,
    MALFORMED_RESPONSE: 1099, // TODO: Shouldn't be needed with protobuf type
  } as const;

  /**
   * @internal
   */
  static ErrorMessage: Record<keyof typeof RpcError.ErrorCode, string> = {
    UNCAUGHT_ERROR: 'Uncaught application error',
    UNSUPPORTED_METHOD: 'Method not supported at destination',
    CONNECTION_TIMEOUT: 'Connection timeout',
    RESPONSE_TIMEOUT: 'Response timeout',
    RECIPIENT_DISCONNECTED: 'Recipient disconnected',
    RECIPIENT_NOT_FOUND: 'Recipient not found',
    REQUEST_PAYLOAD_TOO_LARGE: 'Request payload too large',
    RESPONSE_PAYLOAD_TOO_LARGE: 'Response payload too large',
    MALFORMED_RESPONSE: 'Malformed response',
  } as const;

  /**
   * Creates an error object from the code, with an auto-populated message.
   *
   * @internal
   */
  static builtIn(key: keyof typeof RpcError.ErrorCode, data?: string): RpcError {
    return new RpcError(RpcError.ErrorCode[key], RpcError.ErrorMessage[key], data);
  }
}

/**
 * @internal
 */
export const MAX_PAYLOAD_BYTES = 15360; // 15 KB

/**
 * @internal
 */
export function byteLength(str: string): number {
  const encoder = new TextEncoder();
  return encoder.encode(str).length;
}

/**
 * @internal
 */
export function truncateBytes(str: string, maxBytes: number): string {
  if (byteLength(str) <= maxBytes) {
    return str;
  }

  let low = 0;
  let high = str.length;
  const encoder = new TextEncoder();

  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    if (encoder.encode(str.slice(0, mid)).length <= maxBytes) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return str.slice(0, low);
}
