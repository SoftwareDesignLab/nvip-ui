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
import { Session } from 'src/app/services/Auth/auth-service.service';
import { CookieService } from 'src/app/services/Cookie/cookie.service';
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

  // track which day is currently rendered
  dailyVulnIndex: number = 0;
  // store all the CVEs we have gathered so far organized by date
  // this goes in reverse order Ex. [today, yesterday, ...]
  dailyVulns: VulnMaps = [];
  // store how many vulns are currently being displayed
  vulnsDisplayed: number = 5;
  // emitter for daily vuln dropdowns - close all other dropdowns when one is opened
  currentSelected: number = -1;
  // show/hide loading spinner
  apiCallDone: boolean = false;
  session = {} as Session;

  /**
   * constructor
   * @param vulnService to access vulnerabilityServlet endpoints
   */
  constructor(private vulnService: VulnService, private cookieService: CookieService) { }

  /** call recent vulnerabilites on page init */
  ngOnInit() {
    this.session = this.cookieService.get('nvip_user');
    const today = new Date();
    this.getVulnsByDate(today.toDateString());
  }

  isToday(date: string) {
    return date === this.unformatDate(new Date().toDateString());
  }

  getVulnsByDate(date: string) {
    this.apiCallDone = false;
    // convert DateStrng to YYYY-MM-DD
    date = this.unformatDate(date);
    this.vulnService.getByDate(date, this.session.token).subscribe((res: any) => {
      this.dailyVulns.push({ date: date, cve_list: res });
      this.apiCallDone = true;
    })
  }

  getCount(date: string) {
    const idx = this.dailyVulns.findIndex(vuln => vuln.date === date);
    return this.dailyVulns[idx].cve_list.length;
  }

  /** format title date */
  formatDate(dateString: string) {
    const timeZone = 'T00:00:00.000-08:00';
    const date = new Date(dateString + timeZone);
    return date.toDateString();
  }

  /** convert date back to YYYY-MM-DD to be passed into dailyPage call */
  unformatDate(dateString: String) {
    // Split the date string into its components
    const [, month, day, year] = dateString.split(' ');
    // Convert the month string to a numerical representation (0-11)
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    // Create a new Date object with the components
    const dateObject = new Date(Number(year), monthIndex, Number(day));
    return dateObject.toISOString().split('T')[0];
  }

  /** helper to determine whether a show more or show less button is disabled */
  isDisabled(isMore: boolean, date: string) {
    if (isMore)
      return this.getCount(date) <= this.vulnsDisplayed;
    else return this.getCount(date) > this.vulnsDisplayed || this.vulnsDisplayed === 5;
  }

  prevDate(dateString: string) {
    const date = new Date(this.formatDate(dateString));
    date.setDate(date.getDate() - 1);
    return date.toDateString();
  }

  /** helper for arrows back and forth between recent dates */
  incrementDailyVulnDay(incr: number) {
    this.dailyVulnIndex = this.dailyVulnIndex += incr;
    // if we do not have the vulns for this date yet, call by create date
    if (this.dailyVulns.length === this.dailyVulnIndex) {
      this.getVulnsByDate(this.prevDate(this.dailyVulns[this.dailyVulns.length - 1].date));
    }
  }

  /** increase the number of vulns rendered for a given date */
  showMore() {
    this.vulnsDisplayed += 5;
  }

  /** trigger removal of last 5 vulns showing under that day */
  showLess() {
    this.vulnsDisplayed -= 5;
  }

  /** helper function for emitting collapsing of other dropdowns when a new one is selected */
  setCurrentSelected(event: any) {
    this.currentSelected = event['index'];
  }
}
