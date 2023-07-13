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
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faSpinner, faAngleDoubleLeft, faAngleDoubleRight, faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/Api/api-service.service';
import { Session } from 'src/app/services/Auth/auth-service.service';
import { CookieService } from 'src/app/services/Cookie/cookie.service';
import { FuncsService } from 'src/app/services/Funcs/funcs.service';
import { SearchResultService } from 'src/app/services/SearchResult/search-result.service';
import { VulnService } from 'src/app/services/vuln/vuln.service';
import { Vulnerability } from 'src/app/models/vulnerability.model';
import { ReviewCriteria } from 'src/app/models/review-criteria.model';
import { ReviewUpdateCriteria } from 'src/app/models/review-update-criteria.model';
import { ReviewDataCriteria, ReviewCVSS } from 'src/app/models/review-data-criteria.model';

export interface reviewResultObject {
  cve_id: string
  description: string
  run_date_time: string
  status_id: string
  cvss_scores: Array<{}>
  vdos: Array<{}>

  active: boolean
}

export interface updateVdo {
  vdogroup: string
  vdolabel: string
}

export interface updateObject {
  vuln_id: number;
  cve_id: string;
  status_id: number;
  info: string;
  desc: string;
  cvss_severity_id: number;
  severity_confidence: number;
  impact_score: number;
  impact_confidence: number;
}

/** CURRENTLY UNUSED review page */
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
  /** FontAwesome Icon */
  faSpinner = faSpinner;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faAngleRight = faAngleRight;
  faAngleDown = faAngleDown;
  console = console;
  session = {} as Session;
  cve = {} as Vulnerability;
  review = {} as ReviewCriteria;
  searchCveId = ""
  runDateTime = "";
  rotationAmountStatus = 0;
  statuses = ["Accepted", "Under Review", "Rejected", "Crawled"];
  showForm: boolean = true;
  reviewResults: Array<reviewResultObject> = [];
  filteredReviewResults: Array<any> = [];
  reviewSuccess: boolean = false;
  resultTotalCount = 0;
  pageRecord: Array<number> = [];
  currentPage = 0;
  pageBlocks: Array<number> = [];
  totalPages = 0;
  totalPageLimit = 0;
  pageLimit = 100;
  currentSelected: number = -1;
  lastVulnSelected = {} as reviewResultObject;

  update = {} as updateObject
  updateIndex: number = 0;

  active: boolean = false;

  constructor(
    private vulnService: VulnService,
    private cookieService: CookieService,
    private apiService: ApiService,
    private funcs: FuncsService,
    private searchResService: SearchResultService
  ) {}

  ngOnInit(): void {
    this.session = this.cookieService.get('nvip_user');
    this.review.username = this.session.userName;
    this.review.token = this.session.token;
  }

  detailSearchId($event: any, f: NgForm) {
    // Retrieve the search form button and disable it
    var searchFormBtn = document.getElementsByClassName(
      'nvip-form-btn'
    )[0] as HTMLInputElement;

    this.toggleLoading();

    this.reviewResults = [];
    this.filteredReviewResults = [];
    this.apiService
          .reviewDetails(this.review)
          .subscribe({
            next: (res: any) => {
              this.handleRes(res);

              // Hide the loading bar now that the results have arrived
              this.toggleLoading();

              // Once the search results have been loaded, toggle the search form so that
              // the search results now appear. Do not trigger if call launched not launched
              // from a form button event.
              if ($event !== null) {
                this.toggleSearchForm();
              }
              searchFormBtn.disabled = false;
            },
            error: (e) => {
              // Hide the loading bar now that request has failed
              this.toggleLoading();
              this.reviewResults = [];
              this.filteredReviewResults = [];

              if (e.status == 401) {
                alert(e.data);
                window.location.assign(window.location.href + 'login');
              }
            },
            complete: () => {},
          })
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
    this.resultTotalCount = res.length;
    for (let result of res) {
      let obj = result as reviewResultObject
      obj.active = false
      this.reviewResults.push(obj)
    }
    // this.reviewResults = res;
    this.reviewSuccess = true;
    if (this.resultTotalCount < this.pageLimit) {
      this.totalPageLimit = 1;
    } else {
      this.totalPageLimit = Math.ceil(this.resultTotalCount / 10) - 1;
    }
    this.filteredReviewResults = this.reviewResults.slice(0, this.pageLimit);
    this.getTotalPages();
    this.updatePages(this.reviewResults.length);
  }

  toggleSearchForm() {
    var searchFormBtn = document.getElementsByClassName(
      'nvip-form-btn'
    )[0] as HTMLInputElement;
    if (this.showForm) {
      this.showForm = false;
      searchFormBtn.disabled = true;
    } else {
      // Re-enable the Search Form submmit button if it has been disabled
      this.showForm = true;
      searchFormBtn.disabled = false;
    }
  }

  onStatusChange(event: any, status: string) {
    // checkbox checked
    if (event.target.checked) {
      switch(status){
      case "Accepted":
        this.review.accepted = true;
        break;
      case "Under Review":
        this.review.reviewed = true;
        break;
      case "Rejected":
        this.review.rejected = true;
        break;
      case "Crawled":
        this.review.crawled = true;
        break;
      }
    }
    // checkbox unchecked
    else {
      switch(status){
      case "Accepted":
        this.review.accepted = false;
        break;
      case "Under Review":
        this.review.reviewed = false;
        break;
      case "Rejected":
        this.review.rejected = false;
        break;
      case "Crawled":
        this.review.crawled = false;
        break;
      }
    }
  }

  toggleContent($event: any, drop: string) {
    // If the triggering element is a form checkbox, do not toggle.
    if ($event.srcElement.classList.contains('nvip-form-dropdown-checkbox')) {
      return;
    }

    let formDropdown = this.funcs.getAncestor(
      $event.srcElement as HTMLElement,
      'nvip-form-dropdown-field'
    );
    let formContent = this.funcs.getSiblingByClassName(
      formDropdown as HTMLElement,
      'nvip-form-dropdown-content'
    );
    let caretIcon = formDropdown!.getElementsByClassName(
      'nvip-form-dropdown-caret'
    )[0];

    if (formContent!.style.display == 'flex') {
      this.rotationAmountStatus = 90;
      formDropdown!.classList.remove('dropdown-opened');
      formContent!.style.display = 'none';
      caretIcon.classList.add('fa-angle-left');
      caretIcon.classList.remove('fa-angle-down');
    } else {
      this.rotationAmountStatus = 0;
      formDropdown!.classList.add('dropdown-opened');
      formContent!.style.display = 'flex';
      caretIcon.classList.remove('fa-angle-left');
      caretIcon.classList.add('fa-angle-down');
    }
  }

  /** a change button is pressed, handle displaying different page of vuln dropdowns */
  changePage(pageNum: number) {
    // If the page number is not the current page, switch pages
    if (
      this.currentPage !== pageNum &&
      pageNum < this.totalPages &&
      pageNum >= 0
    ) {
      const pageOffset = this.pageLimit * pageNum;
      this.currentPage = pageNum;
      if (pageOffset < this.reviewResults.length)
        this.filteredReviewResults = this.reviewResults.slice(
          pageOffset,
          pageOffset + this.pageLimit
        );
      this.updatePages(this.reviewResults.length);
    }
  }

  updatePages(totalEntries: number) {
    // If there are no entries, skip this method
    if (totalEntries == 0) {
      this.pageBlocks = [];
      this.pageRecord = [0, 0];
      return;
    }

    var numPages =
      this.totalPageLimit <= 1 ? 0 : Math.floor(this.totalPageLimit / 2) - 1;
    var start =
      this.currentPage - numPages < 0 ? 0 : this.currentPage - numPages;
    var end =
      this.currentPage + numPages > this.totalPages
        ? this.totalPages
        : this.currentPage + numPages + 1;

    // If the ending page is before the total allowed number of pages, set it to the
    // total number of pages allowed
    if (end < this.totalPageLimit) end = this.totalPageLimit;
    var totalPages =
      this.totalPageLimit == 1 ? this.totalPageLimit : this.totalPageLimit + 1;
    var pageBlocks = [];
    for (let i = 0; i < totalPages && i < 10; i++) {
      pageBlocks.push(i);
    }

    // Calculate the record range based on the current page and the total
    // number of entries
    this.pageRecord = [
      this.currentPage * this.pageLimit + 1,
      (this.currentPage + 1) * this.pageLimit > totalEntries
        ? totalEntries
        : (this.currentPage + 1) * this.pageLimit,
    ];

    this.pageBlocks = pageBlocks;
  }

  /** trigger emit of new active dropdown to collapse all other dropdowns on the page */
  setCurrentSelected(event: any) {
    this.currentSelected = event['index'];
  }

  /** calculate and hold state for total number of pages to be displayed */
  getTotalPages() {
    var totalPages =
      this.resultTotalCount % this.pageLimit == 0
        ? this.resultTotalCount / this.pageLimit
        : Math.floor(this.resultTotalCount / this.pageLimit) + 1;

    // Set the total number of pages
    this.totalPages = totalPages;
  }

  selectReviewCve($event: any, vuln: any, index: any) {
    console.log(vuln)
    this.currentSelected = index;

    this.lastVulnSelected.active = false;
    this.lastVulnSelected = vuln;

    vuln.active = !vuln.active

    this.update.vuln_id = vuln.vuln_id
    this.update.cve_id = vuln.cve_id
    this.update.status_id = vuln.status_id;

    this.update.desc = vuln.description

    if(vuln.cvss_scores.length != 0) {
      this.update.cvss_severity_id = vuln.cvss_scores[0].cvssSeverity.id;
      this.update.severity_confidence = vuln.cvss_scores[0].severityConfidence;
      this.update.impact_score = vuln.cvss_scores[0].impactScore;
      this.update.impact_confidence = vuln.cvss_scores[0].impactConfidence;
    }
    else {
      this.update.cvss_severity_id = -1
      this.update.severity_confidence = -1
      this.update.impact_score = -1
      this.update.impact_confidence = -1
    }
  }

  statusIdToString(status: string) {
    switch(status){
      case "1":
        return "Crawled"
      case "2":
        return "Rejected"
      case "3":
        return "Under Review"
      case "4":
        return "Accepted"
      default:
        return ""
      }
  }

  setCVSSseverity(id: number) {
    this.update.cvss_severity_id = id;
  }

  setStatus(id: number) {
    this.update.status_id = id;
  }

  updateVuln($event: any, f: NgForm, vuln: any) {
    console.log("woof")

    let parameters = {} as ReviewUpdateCriteria
    let data = {} as ReviewDataCriteria

    parameters.username = this.review.username
    parameters.token = this.review.token
    parameters.vulnId = this.update.vuln_id
    parameters.cveId = this.update.cve_id
    parameters.statusId = this.update.status_id

    if(this.update.status_id !== vuln.status_id){
      parameters.atomicUpdate = true
    }

    if(this.update.desc !== vuln.description){
      parameters.atomicUpdate = false
      parameters.complexUpdate = true;
      parameters.updateDescription = true;
      data.description = this.update.desc
    }

    if(this.update.cvss_severity_id !== vuln.cvss_scores[0].cvssSeverity.id){
      parameters.atomicUpdate = false
      parameters.complexUpdate = true;
      parameters.updateCVSS = true;
      let cvss = {} as ReviewCVSS
      cvss.cvss_severity_id = this.update.cvss_severity_id
      cvss.severity_confidence = this.update.severity_confidence
      cvss.impact_score = this.update.impact_score
      cvss.impact_confidence = this.update.impact_confidence
      data.cvss = cvss;
    }

    data.updateInfo = ""
    if(this.update.info !== undefined){
      data.updateInfo = this.update.info
    }

    console.log(parameters)
    console.log(data)

    this.apiService.reviewUpdate(parameters, data, (res)=>{alert("Yippee!")})
  }
}
