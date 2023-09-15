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
  "Trust Failure" : VdoNounGroup.IMPACT_METHOD,
  "Man-in-the-Middle" : VdoNounGroup.IMPACT_METHOD,
  "Channel" : VdoNounGroup.CONTEXT,
  "Authentication Bypass" : VdoNounGroup.IMPACT_METHOD,
  "Physical Hardware" : VdoNounGroup.CONTEXT,
  "Application" : VdoNounGroup.CONTEXT,
  "Host OS" : VdoNounGroup.CONTEXT,
  "Firmware" : VdoNounGroup.CONTEXT,
  "Code Execution" : VdoNounGroup.IMPACT_METHOD,
  "Context Escape" : VdoNounGroup.IMPACT_METHOD,
  "Guest OS" : VdoNounGroup.CONTEXT,
  "Hypervisor" : VdoNounGroup.CONTEXT,
  "Sandboxed" : VdoNounGroup.MITIGATION,
  "Physical Security" : VdoNounGroup.MITIGATION,
  "ASLR" : VdoNounGroup.MITIGATION,
  "Limited Rmt" : VdoNounGroup.ATTACK_THEATER,
  "Local" : VdoNounGroup.ATTACK_THEATER,
  "Read" : VdoNounGroup.LOGICAL_IMPACT,
  "Resource Removal" : VdoNounGroup.LOGICAL_IMPACT,
  "HPKP/HSTS" : VdoNounGroup.MITIGATION,
  "MultiFactor Authentication" : VdoNounGroup.MITIGATION,
  "Remote" : VdoNounGroup.ATTACK_THEATER,
  "Write" : VdoNounGroup.LOGICAL_IMPACT,
  "Indirect Disclosure" : VdoNounGroup.LOGICAL_IMPACT,
  "Service Interrupt" :  VdoNounGroup.LOGICAL_IMPACT,
  "Privilege Escalation" : VdoNounGroup.LOGICAL_IMPACT,
  "Physical" : VdoNounGroup.ATTACK_THEATER,
};