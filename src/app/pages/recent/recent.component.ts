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
import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { VulnService } from 'src/app/services/vuln/vuln.service';
/** Recent Vulnerabilities page */

/** Key-value store object of recent date and dropdowns to display on that date */
export interface VulnMap {
  date: string;
  cve_list: Array<any>;
}

/** Array of date-list vuln pages to navigate through */
export interface VulnMaps extends Array<VulnMap> {}

@Component({
  selector: 'nvip-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css'],
})
export class RecentComponent implements OnInit {
  /** FontAwesome Icon */
  faSpinner = faSpinner;

  /** Variables to hold state of which date we are on and
   * how much we have increased/decreased a certain pages limit,
   * and what vulns are on each page
   */
  dailyVulnLimit: Array<number> = [];
  vulnLimitIncr: number = 5;
  dailyVulnIndex: number = 0;
  dailyVulns: VulnMaps = [];
  currentSelected: number = -1;
  apiCallDone: boolean = false;

  /**
   * constructor
   * @param vulnService to access vulnerabilityServlet endpoints
   */
  constructor(private vulnService: VulnService) {}

  /** call recent vulnerabilites on page init */
  ngOnInit() {
    this.vulnService.onRecentInit().subscribe((res: any) => {
      this.apiCallDone = true;
      Object.keys(res).forEach((key) => {
        this.dailyVulns.push({
          date: this.formatDate(key),
          cve_list: res[key],
        });
        this.dailyVulnLimit.push(this.vulnLimitIncr);
      })
    });
  }

  /** format title date */
  formatDate(dateString: string) {
    const timeZone = 'T00:00:00.000-08:00';
    const date = new Date(dateString + timeZone);
    return date.toDateString();
  }

  /** convert date back to YYYY-MM-DD to be passed into dailyPage call */
  unformatDate(dateString: String) {
    const inputFormat = 'ddd MMM DD YYYY';
    // Split the date string into its components
    const [weekday, month, day, year] = dateString.split(' ');
    // Convert the month string to a numerical representation (0-11)
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    // Create a new Date object with the components
    const dateObject = new Date(Number(year), monthIndex, Number(day));
    return dateObject.toISOString().split('T')[0];
  }

  /** helper to determine whether a show more or show less button is disabled */
  isDisabled(isMore: boolean, panelIndex: number, vulnMap: VulnMap) {
    if (isMore)
      return this.dailyVulnLimit[panelIndex] >= vulnMap.cve_list.length;
    else return this.dailyVulnLimit[panelIndex] <= this.vulnLimitIncr;
  }

  /** helper for arrows back and forth between recent dates */
  incrementDailyVulnDay(incr: number) {
    if ( (this.dailyVulnIndex + incr < 0) || (this.dailyVulnIndex + incr >= this.dailyVulns.length) ) {
      return;
    }
    this.dailyVulnIndex = this.dailyVulnIndex += incr;
  }

  /** trigger API call to show more recent vulns under that day to show */
  showMore(panelIndex: number, date: String) {
    const indexToUpdate = this.dailyVulns.findIndex(vuln => vuln.date === date);
    console.log("limit here", this.dailyVulnLimit)
    console.log("amount of vulns we have here", this.dailyVulns[indexToUpdate].cve_list.length)
    console.log("panel index", panelIndex)
    if (this.dailyVulnLimit[panelIndex] + this.vulnLimitIncr + 5 > this.dailyVulns[indexToUpdate].cve_list.length)
      this.vulnService.getByDateAndPage(this.unformatDate(date), panelIndex, this.vulnLimitIncr).subscribe((res: any) => {
        // push res to VulnMap corresponding to date String
        let thisVulnObj: VulnMap = this.dailyVulns[indexToUpdate]
        thisVulnObj.cve_list = [...thisVulnObj.cve_list, ...res]
        this.dailyVulns[indexToUpdate] = thisVulnObj
        console.log("daily vulns now", this.dailyVulns[indexToUpdate])
      })
    else
      console.log("no need to get more vulns here")
    this.dailyVulnLimit[panelIndex] =
      this.dailyVulnLimit[panelIndex] + this.vulnLimitIncr;
  }

  /** trigger removal of last 5 vulns showing under that day */
  showLess(panelIndex: number) {
    const newLimit: number = this.dailyVulnLimit[panelIndex] - this.vulnLimitIncr;
    if (newLimit < this.vulnLimitIncr) {
      this.dailyVulnLimit[panelIndex] = this.vulnLimitIncr;
    } else {
      this.dailyVulnLimit[panelIndex] = newLimit;
    }
  }

  /** helper function for emitting collapsing of other dropdowns when a new one is selected */
  setCurrentSelected(event: any) {
    this.currentSelected = event['index'];
  }
}
