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
import { ReviewDataCriteria, ReviewCVSS, ReviewVDO, ReviewVDOLabel } from 'src/app/models/review-data-criteria.model';
import { ActivatedRoute } from '@angular/router';

export interface updateCvss {
  base_score: number
  impact_score: number
}

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
  cvss: Array<updateCvss>;
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

  constructor(
    private vulnService: VulnService,
    private cookieService: CookieService,
    private apiService: ApiService,
    private funcs: FuncsService,
    private route: ActivatedRoute,
    private searchResService: SearchResultService
  ) {
    this.route.params.subscribe((params) => this.init(params['id']))
    this.update.vdos = new Array<updateVdo>()
    for(let i = 0; i < 24; i++) {
      this.update.vdos.push({} as updateVdo)
    }

    this.update.cvss = new Array<updateCvss>()
    for(let i = 0; i < 24; i++) {
      this.update.cvss.push({} as updateCvss)
    }

    this.update.affprods = new Array<updateAffProd>();
    this.update.affprods_to_remove = new Array<updateAffProd>();
  }

  ngOnInit(): void {
    this.session = this.cookieService.get('nvip_user');
    this.username = this.session.userName;
    this.token = this.session.token;

    
  }

  /** ensure the user is signed on when navigating to this page */
  init(id: string) {
    var session: Session = this.cookieService.get('nvip_user');
    this.vulnService
      .getByID(id, session.userName, session.token)
      .subscribe((res: any) => {
        this.handleRes(res)
      });
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
    for(let i = 0; i < this.vuln.cvssScoreList.length; i++) {
      this.update.cvss[i].base_score = this.vuln.cvssScoreList[i].baseScore
      this.update.cvss[i].impact_score = this.vuln.cvssScoreList[i].impactScore
    }
    for(let i = 0; i < this.vuln.vdoList.length; i++) {
      this.update.vdos[i].vdolabel = this.vuln.vdoList[i].vdoLabel
      this.update.vdos[i].vdogroup = this.vuln.vdoList[i].vdoNounGroup
      this.update.vdos[i].confidence = this.vuln.vdoList[i].vdoConfidence
    }
    for(let prod of this.vuln.products){
      this.update.affprods.push(prod)
    }
  }

  toggleCVSS($event: any) {
    this.cvssactive = !this.cvssactive
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

    let updateCvssFlag: Array<number> = new Array<number>();
    for(let i = 0; i < this.vuln.cvssScoreList.length; i++) {
      if(vuln.cvssScoreList.length > 0 && 
      ((this.update.cvss[i].base_score !== vuln.cvssScoreList[i].baseScore) ||
      (this.update.cvss[i].impact_score !== vuln.cvssScoreList[i].impactScore))) {
        updateCvssFlag.push(i)
      }
    }
    console.log(updateCvssFlag)
    console.log(this.update.cvss)
    console.log(this.vuln.cvssScoreList)
    if(updateCvssFlag.length > 0) {
      parameters.updateCVSS = true;

      data.cvss = new Array<ReviewCVSS>();
      for(let i of updateCvssFlag) {
        let cvss = {} as ReviewCVSS
        cvss.base_score = this.update.cvss[i].base_score
        cvss.impact_score = this.update.cvss[i].impact_score
        data.cvss.push(cvss)
      }
    }

    let updateVdoFlag: Array<number> = new Array<number>();
    for(let i= 0; i < vuln.vdoList.length; i++) {
      if(this.update.vdos[i].vdolabel !== vuln.vdoList[i].vdoLabel ||
         this.update.vdos[i].vdogroup !== vuln.vdoList[i].vdoNounGroup ||
         this.update.vdos[i].confidence !== vuln.vdoList[i].vdoConfidence){
        updateVdoFlag.push(i)
      }
    }
    if(updateVdoFlag.length > 0) {
      parameters.updateVDO = true;

      data.vdoUpdates = {} as ReviewVDO
      data.vdoUpdates.vdoLabels = new Array<ReviewVDOLabel>()
      for(let i of updateVdoFlag){
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
