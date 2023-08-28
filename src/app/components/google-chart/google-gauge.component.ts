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
import { Component, Input } from '@angular/core';
import { GoogleChartComponent } from './google-chart.component';
import { CVSSScore } from 'src/app/models/vulnerability.model';
/** Gauge component for Vulnerability page */
@Component({
  selector: 'cvss-gauge',
  template: `
    <div
      class="vuln-characteristics-graph-container"
      id="{{cvssId}}"
      style="width: 100%;"
    ></div>
  `,
})
export class GoogleGaugeComponent extends GoogleChartComponent {
  /** Google chart variables */
  private options: any;
  private data: any;
  private chart: any;
  @Input('cvssScore') cvssScore: CVSSScore | any;
  @Input('cvssId') cvssId: any;

  

  /** child drawgraph class that inits graph data, options, and then draws on page */
  override drawGraph() {
    this.data = this.createDataTable([
        ['Label', 'Value'],
        ['Base', 0]
      ]);

      if (this.cvssScore.baseScore == 4) {
        this.data.setValue(0, 1, 9.0);
      }
      else if (this.cvssScore.baseScore == 1) { 
        this.data.setValue(0, 1, 7.0);
      }
      else if (this.cvssScore.baseScore == 2) { 
        this.data.setValue(0, 1, 5.0);
      }
      else if (this.cvssScore.baseScore == 5) { 
        this.data.setValue(0, 1, 3.0);
      }
      if (this.cvssScore != undefined && this.cvssScore != null) {
        this.data.setValue(0, 1, parseFloat(this.cvssScore.baseScore));
      }

    this.options = {
        // width: 800, height: 225,
        redFrom: 7.0, redTo: 10,
        yellowFrom: 4.0, yellowTo: 7.0,
        greenFrom:0, greenTo: 4.0,
        minorTicks: 6, max: 10,
        chartArea: {
          left: 40,
          width: '100%'
        },
        width: '100%',
      };

    this.chart = this.createGauge(
      document.getElementById(this.cvssId)
    );
    this.chart.draw(this.data, this.options);
    
    // let resizeHandler = () => this.chart.draw(this.data, this.options);
    // if (window.addEventListener) {
    //     window.addEventListener('resize', resizeHandler, false);
    // }
  }
}
