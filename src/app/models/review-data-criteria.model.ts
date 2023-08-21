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

export interface ReviewCVSS {
  base_score:number
  impact_score:number
}

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
