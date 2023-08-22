/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RSAT19CB0000020 awarded by the United
 * States Department of Homeland Security.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { VdoMap } from "../pages/review/review.component"

export interface ReviewVDOLabel {
  label:string
  group:string
  confidence:number
  isActive:number
}

export interface ReviewVDO {
  vdoLabels: Array<ReviewVDOLabel>
}

export interface ReviewDataCriteria {
  updateInfo: string
  description: string
  cvss: Array<ReviewCVSS>
  vdoUpdates: ReviewVDO
  prodToRemove: Array<number>
}

export enum VdoNounGroup {
  IMPACT_METHOD = "Impact Method",
  CONTEXT = "Context",
  MITIGATION = "Mitigation",
  ATTACK_THEATER = "Attack Theater",
  LOGICAL_IMPACT = "Logical Impact",
}

export class VdoLabel {
  constructor(public readonly id: number, public readonly label: string, public readonly group: VdoNounGroup) { }
}
//TODO: should probably move to a vdo model file
export const vdoMap: VdoMap = {
  TRUST_FAILURE : new VdoLabel(1, "Trust Failure", VdoNounGroup.IMPACT_METHOD),
  MAN_IN_THE_MIDDLE : new VdoLabel(2, "Man-in-the-Middle", VdoNounGroup.IMPACT_METHOD),
  CHANNEL : new VdoLabel(3, "Channel", VdoNounGroup.CONTEXT),
  AUTHENTICATION_BYPASS : new VdoLabel(4, "Authentication Bypass", VdoNounGroup.IMPACT_METHOD),
  PHYSICAL_HARDWARE : new VdoLabel(5, "Physical Hardware", VdoNounGroup.CONTEXT),
  APPLICATION : new VdoLabel(6,"Application", VdoNounGroup.CONTEXT),
  HOST_OS : new VdoLabel(7, "Host OS", VdoNounGroup.CONTEXT),
  FIRMWARE : new VdoLabel(8, "Firmware", VdoNounGroup.CONTEXT),
  CODE_EXECUTION : new VdoLabel(9, "Code Execution", VdoNounGroup.IMPACT_METHOD),
  CONTEXT_ESCAPE : new VdoLabel(10, "Context Escape", VdoNounGroup.IMPACT_METHOD),
  GUEST_OS : new VdoLabel(11, "Guest OS", VdoNounGroup.CONTEXT),
  HYPERVISOR : new VdoLabel(12,"Hypervisor", VdoNounGroup.CONTEXT),
  SANDBOXED : new VdoLabel(13, "Sandboxed", VdoNounGroup.MITIGATION),
  PHYSICAL_SECURITY : new VdoLabel(14, "Physical Security", VdoNounGroup.MITIGATION),
  ASLR : new VdoLabel(15, "ASLR", VdoNounGroup.MITIGATION),
  LIMITED_RMT : new VdoLabel(16, "Limited Rmt", VdoNounGroup.ATTACK_THEATER),
  LOCAL : new VdoLabel(17, "Local", VdoNounGroup.ATTACK_THEATER),
  READ : new VdoLabel(18, "Read", VdoNounGroup.LOGICAL_IMPACT),
  RESOURCE_REMOVAL : new VdoLabel(19, "Resource Removal", VdoNounGroup.LOGICAL_IMPACT),
  HPKP_HSTS : new VdoLabel(20, "HPKP/HSTS", VdoNounGroup.MITIGATION),
  MULTIFACTOR_AUTHENTICATION : new VdoLabel(21, "MultiFactor Authentication", VdoNounGroup.MITIGATION),
  REMOTE : new VdoLabel(22, "Remote", VdoNounGroup.ATTACK_THEATER),
  WRITE : new VdoLabel(23, "Write", VdoNounGroup.LOGICAL_IMPACT),
  INDIRECT_DISCLOSURE : new VdoLabel(24, "Indirect Disclosure", VdoNounGroup.LOGICAL_IMPACT),
  SERVICE_INTERRUPT : new VdoLabel(25, "Service Interrupt", VdoNounGroup.LOGICAL_IMPACT),
  PRIVILEGE_ESCALATION : new VdoLabel(26, "Privilege Escalation", VdoNounGroup.LOGICAL_IMPACT),
  PHYSICAL : new VdoLabel(27, "Physical", VdoNounGroup.ATTACK_THEATER),
};