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
import { Component, OnInit, HostListener } from '@angular/core';

import { NgForm } from '@angular/forms';
import { faSpinner, faAngleDoubleLeft, faAngleDoubleRight, faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/Api/api-service.service';
import { Session } from 'src/app/services/Auth/auth-service.service';
import { CookieService } from 'src/app/services/Cookie/cookie.service';
import { SearchResultService } from 'src/app/services/SearchResult/search-result.service';
import { VulnService } from 'src/app/services/vuln/vuln.service';
import { SearchCriteria } from 'src/app/models/search-criteria.model';

/** Search Page */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  /** FontAwesome Icons */
  faSpinner = faSpinner;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  faAngleRight = faAngleRight;
  faAngleDown = faAngleDown;
  /** Hold state of icon rotation, rotated if a dropdown is opened */
  rotationAmountVDO = 90;
  rotationAmountCVSS = 90;
  /** Hold state for currently active dropdown, collapse all others */
  currentSelected: number = -1;
  search = {} as SearchCriteria;
  session = {} as Session;
  showForm: boolean = true;
  searchSuccess: boolean = false;
  searchResults: Array<any> = [];
  filteredSearchResults: Array<any> = [];
  reviewedSearchResults: Array<any> = []; /** for a change to implementation idea **/
  cvssScores = [];
  resultTotalCount = 0;
  reviewedResultTotalCount = 0;
  pageRecord: Array<number> = [];
  currentPage = 0;
  pageBlocks: Array<number> = [];
  totalPages = 0;
  totalPageLimit = 0;
  pageLimit = 10;
  vdoNounGroups = {} as Record<string, Array<any>>;
  vdoNounGroupLabels = [] as Array<any>;
  vdoEntityLabels = {} as Record<string, Array<any>>;

  /** Whether or not we see the CVSS or VDO dropdowns */
  toggledDropCVSS = false;
  toggledDropVDO = false;

  /** boolean for if filter is used **/
  filterReviewed:boolean = false;



  constructor(
    private vulnService: VulnService,
    private cookieService: CookieService,
    private apiService: ApiService,
    private searchResService: SearchResultService
  ) {}

  /** grab search info on init, things like score categorites and VDO groups */
  ngOnInit(): void {
    this.session = this.cookieService.get('nvip_user');
    this.vulnService
      .searchInfo(this.session.userName, this.session.token)
      .subscribe((res: any) => {
        this.cvssScores = res.cvssScores.cvssScores;
        this.vdoNounGroups = res.vdoNounGroups;
        (
          Object.keys(this.vdoNounGroups) as (keyof typeof this.vdoNounGroups)[]
        ).forEach((key, index) => {
          this.vdoNounGroupLabels.push(key);
          this.vdoEntityLabels[key] = this.vdoNounGroups[key].sort();
        });
      });
    this.searchResults = this.searchResService.getSearchResults();
    if (this.searchResults.length) {
      this.toggleSearchForm();
      this.handleRes(this.searchResults);
    }
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

  toggleCVSSDrop() {
    this.toggledDropCVSS = !this.toggledDropCVSS;
    this.rotationAmountCVSS = this.toggledDropCVSS ? 0 : 90;
  }

  toggleVDODrop() {
    this.toggledDropVDO = !this.toggledDropVDO;
    this.rotationAmountVDO = this.toggledDropVDO ? 0 : 90;
  }

  /** driver function for calling searchServlet, loading,
   * and displaying results after call response
   */
  searchVulns($event: any, f: NgForm) {
    // Retrieve the search form button and disable it
    var searchFormBtn = document.getElementsByClassName(
      'nvip-form-btn'
    )[0] as HTMLInputElement;
    // Prevent multiple calls to the database if the button is currently
    // disabled (i.e. waiting for a query to complete)
    if (searchFormBtn!.disabled !== true) {
      document.getElementById('searchKeyWordError')!.style.display = 'none';
      document.getElementById('searchLimitError')!.style.display = 'none';
      var username = this.session.userName;
      var token = this.session.token;

      if (username == null || username == '' || token == null || token == '') {
        alert('You are not logged in!');
        this.cookieService.remove('nvip_user');
        window.location.reload();
      }

      if (
        !Number.isInteger(this.search.limitCount) &&
        this.search.limitCount !== null &&
        this.search.limitCount !== undefined
      ) {
        document.getElementById('searchLimitError')!.style.display = 'block';
        document.getElementById('searchLimitError')!.innerText =
          'Please enter an integer for the limit';
        return;
      } else if (Math.abs(this.search.limitCount) > 100) {
        document.getElementById('searchLimitError')!.style.display = 'block';
        document.getElementById('searchLimitError')!.innerText =
          'Please enter a limit less than or equal to 100';
        return;
      } else if (
        this.search.limitCount === undefined ||
        this.search.limitCount === null
      ) {
        this.search.limitCount = 100;
      }

      searchFormBtn.disabled = true;

      console.log(this.search)

      // Display the loading bar
      this.toggleLoading();

      this.searchResults = [];
      this.filteredSearchResults = [];
      this.reviewedSearchResults = [];
      if(this.search.cve_id != null){
        this.vulnService
          .getByID(this.search.cve_id, username, token)
          .subscribe({
            next: (res: any) => {
              this.searchResService.setSearchResults([res]);
              this.handleRes([res]);

              // Hide the loading bar now that the results have arrived
              this.toggleLoading();

              // Once the search results have been loaded, toggle the search form so that
              // the search results now appear. Do not trigger if call launched not launched
              // from a form button event.
              if ($event !== null) {
                this.toggleSearchForm();
              }
              searchFormBtn.disabled = false;
            },error: (e) => {
              // Hide the loading bar now that request has failed
              this.toggleLoading();
              this.searchResults = [];
              this.filteredSearchResults = [];

              if (e.response.status == 401) {
                alert(e.data);
                window.location.assign(window.location.href + 'login');
              }
            },
            complete: () => {}
          })
      } else {
        this.apiService
          .cveSearch({ ...this.search, username: username, token: token })
          .subscribe({
            next: (res: any) => {
              this.searchResService.setSearchResults(res);
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
              this.searchResults = [];
              this.filteredSearchResults = [];

              if (e.response.status == 401) {
                alert(e.data);
                window.location.assign(window.location.href + 'login');
              }
            },
            complete: () => {},
          });
      }
    }
  }

  /** helper function for gathering results whether they be previously
   * stored or newly received
   */
  handleRes(res: any) {
    this.resultTotalCount = res.length;
    this.searchResults = res;
    console.log(this.searchResults)
    this.searchSuccess = true;
    if (this.resultTotalCount < 10) {
      this.totalPageLimit = 1;
    } else {
      this.totalPageLimit = Math.ceil(this.resultTotalCount / 10) - 1;
    }
    if(this.filterReviewed){
      this.filteredSearchResults = this.reviewedSearchResults.slice(0,this.pageLimit);
      this.getTotalPages();
      this.updatePages(this.reviewedSearchResults.length);
    } else {
      this.filteredSearchResults = this.searchResults.slice(0, this.pageLimit);
      this.getTotalPages();
      this.updatePages(this.searchResults.length);
    }
  }

  /** calculate and hold state for total number of pages to be displayed */
  getTotalPages() {
    var totalPages = 0;
    if(this.filterReviewed){
      totalPages =
        this.reviewedResultTotalCount % this.pageLimit == 0
          ? this.reviewedResultTotalCount / this.pageLimit
          : Math.floor(this.reviewedResultTotalCount / this.pageLimit) + 1;
    } else {
      totalPages =
        this.resultTotalCount % this.pageLimit == 0
          ? this.resultTotalCount / this.pageLimit
          : Math.floor(this.resultTotalCount / this.pageLimit) + 1;
    }
    // Set the total number of pages
    this.totalPages = totalPages;
  }

  /** calculate vulns per page and hold state for each page block */
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
      if(this.filterReviewed){
        if (pageOffset < this.reviewedSearchResults.length)
          this.filteredSearchResults = this.reviewedSearchResults.slice(
            pageOffset,
            pageOffset + this.pageLimit
          );
        this.updatePages(this.reviewedSearchResults.length);
      } else {
        if (pageOffset < this.searchResults.length)
          this.filteredSearchResults = this.searchResults.slice(
            pageOffset,
            pageOffset + this.pageLimit
          );
        this.updatePages(this.searchResults.length);
      }
    }
  }

  updateSelectedLabels(event: any) {
    if (this.search.vdoLabels == undefined) this.search.vdoLabels = [];
    let hash = event["selected"] as Map<string, boolean>
    for (const key of hash) {
      if(this.search.vdoLabels.indexOf(key[0]) < 0 && key[1]){
        this.search.vdoLabels.push(key[0])
      }

      if(this.search.vdoLabels.indexOf(key[0]) > 0 && !key[1]){
        let i = this.search.vdoLabels.indexOf(key[0])
        this.search.vdoLabels.splice(i, 1)
      }
    }
  }

  onCVSSChange(event: any, cvssScore: string) {
    let cvssBase = 3
    switch(cvssScore) {
    case "CRITICAL":
      cvssBase = 4
      break;
    case "HIGH":
      cvssBase = 1
      break;
    case "MEDIUM":
      cvssBase = 2
      break;
    case "LOW":
      cvssBase = 5
      break;
    }
    // checkbox checked
    if (event.target.checked) {
      if (this.search.cvssScores == undefined) this.search.cvssScores = [];
      this.search.cvssScores.push(cvssBase);
    }
    // checkbox unchecked
    else {
      const i = this.search.cvssScores.indexOf(cvssBase, 0);
      this.search.cvssScores.splice(i, 1);
    }
  }

  /** trigger emit of new active dropdown to collapse all other dropdowns on the page */
  setCurrentSelected(event: any) {
    this.currentSelected = event['index'];
  }

  /** When user clicks the back button while on the search results page, refreshes the page with the search form visible, otherwise goes back a page */
  @HostListener('window:popstate')
  onPopState(){
    if(!this.showForm){
      window.location.assign('/search');
    }
  }

  updateReviewedCheckbox(event: any){
    this.filterReviewed= event.target.checked;
    if(this.filterReviewed){
      this.updateReviewedResults()
    }
    this.handleRes(this.searchResults);
    this.changePage(0);
  }

  updateReviewedResults(){
    this.reviewedSearchResults = [];
    this.reviewedSearchResults = this.searchResults.filter((value) => value.reviewed);
    this.reviewedResultTotalCount = this.reviewedSearchResults.length;
    //console.log(this.reviewedSearchResults);
  }

}
