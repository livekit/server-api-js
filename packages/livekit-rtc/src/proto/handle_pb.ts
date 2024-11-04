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

// @generated by protoc-gen-es v2.2.0 with parameter "target=ts,import_extension=js"
// @generated from file handle.proto (package livekit.proto, syntax proto2)
/* eslint-disable */

import type { GenFile, GenMessage } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file handle.proto.
 */
export const file_handle: GenFile = /*@__PURE__*/
  fileDesc("CgxoYW5kbGUucHJvdG8SDWxpdmVraXQucHJvdG8iHAoORmZpT3duZWRIYW5kbGUSCgoCaWQYASACKARCEKoCDUxpdmVLaXQuUHJvdG8");

/**
 * # Safety
 * The foreign language is responsable for disposing handles
 * Forgetting to dispose the handle may lead to memory leaks
 *
 * Dropping a handle doesn't necessarily mean that the object is destroyed if it is still used
 * on the FfiServer (Atomic reference counting)
 *
 * When refering to a handle without owning it, we just use a uint32 without this message. 
 * (the variable name is suffixed with "_handle")
 *
 * @generated from message livekit.proto.FfiOwnedHandle
 */
export type FfiOwnedHandle = Message<"livekit.proto.FfiOwnedHandle"> & {
  /**
   * @generated from field: required uint64 id = 1;
   */
  id: bigint;
};

/**
 * Describes the message livekit.proto.FfiOwnedHandle.
 * Use `create(FfiOwnedHandleSchema)` to create a new message.
 */
export const FfiOwnedHandleSchema: GenMessage<FfiOwnedHandle> = /*@__PURE__*/
  messageDesc(file_handle, 0);

