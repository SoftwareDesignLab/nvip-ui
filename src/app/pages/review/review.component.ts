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
import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faSpinner, faAngleDoubleLeft, faAngleDoubleRight, faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/Api/api-service.service';
import { Session } from 'src/app/services/Auth/auth-service.service';
import { CookieService } from 'src/app/services/Cookie/cookie.service';
import { FuncsService } from 'src/app/services/Funcs/funcs.service';
import { SearchResultService } from 'src/app/services/SearchResult/search-result.service';
import { VulnService } from 'src/app/services/vuln/vuln.service';
import { VDO, Vulnerability } from 'src/app/models/vulnerability.model';
import { ReviewCriteria } from 'src/app/models/review-criteria.model';
import { ReviewUpdateCriteria } from 'src/app/models/review-update-criteria.model';
import { ReviewDataCriteria, ReviewVDO, ReviewVDOLabel, VdoLabel, VdoNounGroup } from 'src/app/models/review-data-criteria.model';
import { ActivatedRoute } from '@angular/router';

export interface updateVdo {
  vdogroup: string
  vdolabel: string
  confidence: number
}

export interface updateAffProd {
  productId: number
  cpe: string
  domain: string
}

export interface updateObject {
  vuln_id: number;
  cve_id: string;
  desc: string;
  vdos: Array<updateVdo>;
  affprods: Array<updateAffProd>
  affprods_to_remove: Array<updateAffProd>
}

export interface VdoMap { [key: string]: VdoLabel; }

/** review page */
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
  /** FontAwesome Icon */
  faSpinner = faSpinner;
  session = {} as Session;
  vuln = {} as Vulnerability;

  username: string = ""
  token: string = ""

  cvssactive: boolean = false
  vdoactive: boolean = false
  aractive: boolean = false

  update = {} as updateObject

  vdoMap = {
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
  } as VdoMap;

  constructor(
    private vulnService: VulnService,
    private cookieService: CookieService,
    private apiService: ApiService,
    private funcs: FuncsService,
    private route: ActivatedRoute,
    private searchResService: SearchResultService
  ) {
    this.route.params.subscribe((params) => this.init(params['id']))
  }

  ngOnInit(): void {
    this.session = this.cookieService.get('nvip_user');
    this.username = this.session.userName;
    this.token = this.session.token;
  }

  /** ensure the user is signed on when navigating to this page */
  init(id: string) {
    var session: Session = this.cookieService.get('nvip_user');

    this.update.vdos = new Array<updateVdo>()
    this.update.affprods = new Array<updateAffProd>();
    this.update.affprods_to_remove = new Array<updateAffProd>();

    this.vulnService
      .getByID(id, session.userName, session.token)
      .subscribe((res: any) => {
        this.handleRes(res)
      });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

   /** legacy loading function to show and hide loading bar while search results are being called */
  toggleLoading(className?: any) {
    // If not given a class name, toggle the first loading bar found
    if (className == null) {
      var loadingBar = document.getElementsByClassName(
        'nvip-loading-bar'
      )[0] as HTMLElement;
      if (loadingBar !== null) {
        if (window.getComputedStyle(loadingBar).display == 'none') {
          loadingBar.style.display = 'block';
        } else {
          loadingBar.style.display = 'none';
        }
      }

      return;
    }

    var element = document.getElementsByClassName(className);

    if (element != null) {
      var loadingBar = element[0].getElementsByClassName('nvip-loading-bar')[0] as HTMLElement;
      if (window.getComputedStyle(loadingBar).display == 'none') {
        loadingBar.style.display = 'block';
      } else {
        loadingBar.style.display = 'none';
      }
    }
  }

  /** helper function for gathering results whether they be previously
   * stored or newly received
   */
  handleRes(res: any) {
    this.vuln = res

    this.update.cve_id = this.vuln.cveId
    this.update.vuln_id = this.vuln.vulnId

    this.update.desc = this.vuln.description
    for(let i = 0; i < this.vuln.vdoList.length; i++) {
      let vdo = {} as updateVdo
      vdo.vdolabel = this.vuln.vdoList[i].vdoLabel
      vdo.vdogroup = this.vuln.vdoList[i].vdoNounGroup
      vdo.confidence = this.vuln.vdoList[i].vdoConfidence
      this.update.vdos.push(vdo)
    }
    for(let prod of this.vuln.products){
      this.update.affprods.push(prod)
    }
  }

  toggleVDO($event: any) {
    this.vdoactive = !this.vdoactive
  }

  toggleAffProd($event: any) {
    this.aractive = !this.aractive
  }

  removeCPE(index: number, vuln: any) {
    this.update.affprods_to_remove.push(this.update.affprods[index])
    this.update.affprods.splice(index, 1)
  }

  addVdo($event: any) {
    let vdo = {} as updateVdo;
    vdo.vdolabel = ""
    vdo.vdogroup = ""
    vdo.confidence = 0
    this.update.vdos.push(vdo)
  }

  removeVdo($event: any, index: number) {
    this.update.vdos.splice(index, 1)
  }

  getVdoConfidence(vdo: VdoLabel) {
    for(let i = 0; i < this.vuln.vdoList.length; i++){
      // insensitive compare of VDO labels; Ex: vulnList vdoLabel "FIRMWARE" === vdo.label "Firmware"
      if (this.vuln.vdoList[i].vdoLabel.localeCompare(vdo.label, undefined, { sensitivity: 'accent' }) === 0)
        return this.vuln.vdoList[i].vdoConfidence
    }
    return "-"
  }

  updateVuln($event: any, f: NgForm, vuln: any) {

    let parameters = {} as ReviewUpdateCriteria
    let data = {} as ReviewDataCriteria

    parameters.username = this.username
    parameters.token = this.token
    parameters.vulnId = this.update.vuln_id
    parameters.cveId = this.update.cve_id

    if(this.update.desc !== vuln.description){
      parameters.updateDescription = true;

      data.description = this.update.desc
    }

    // TODO: CVSS calculation based on VDO label updates

    // map vdoList to something that looks like update.vdos
    //TODO: it should match to begin with - shouldn't need cveId in there

    const vulnVDOs = vuln.vdoList.map((vdo: VDO) => {
      return {
        vdolabel: vdo.vdoLabel,
        vdogroup: vdo.vdoNounGroup,
        confidence: vdo.vdoConfidence,
      }
    })

    const vdoDiff = JSON.stringify(vulnVDOs) !== JSON.stringify(this.update.vdos)

    if (vdoDiff) {
      parameters.updateVDO = true;
      data.vdoUpdates = {} as ReviewVDO
      data.vdoUpdates.vdoLabels = new Array<ReviewVDOLabel>()
      for(let i = 0; i < this.update.vdos.length; i++){
        let vdo = {} as ReviewVDOLabel;
        vdo.label = this.update.vdos[i].vdolabel;
        vdo.group = this.update.vdos[i].vdogroup;
        vdo.confidence = this.update.vdos[i].confidence;
        data.vdoUpdates.vdoLabels.push(vdo);
      }
    }

    if(this.update.affprods.length !== vuln.cpes.length){
      parameters.updateAffRel = true;

      data.prodToRemove = new Array<number>()
      for (let ar of this.update.affprods_to_remove) {
        data.prodToRemove.push(ar.productId)
      }
    }

    this.apiService.reviewUpdate(this.update.cve_id, parameters, data, (res)=>{
      this.init(this.update.cve_id)
    })
  }
}
