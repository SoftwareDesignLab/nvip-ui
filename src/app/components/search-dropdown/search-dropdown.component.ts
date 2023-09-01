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
import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { faAngleLeft, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FuncsService } from 'src/app/services/Funcs/funcs.service';
import { VdoHash } from 'src/app/models/search-criteria.model';

/** Search dropdown component for VDO categories */
@Component({
  selector: 'search-dropdown',
  templateUrl: './search-dropdown.component.html',
  styleUrls: ['./search-dropdown.component.css']
})
export class SearchDropdownComponent {
  /** Font Awesome Icons */
  faAngleLeft = faAngleLeft;
  faAngleDown = faAngleDown;

  /** for dropped down component, rotate our arrow icon downward (-90 degrees) */
  rotationAmount = 0;

  /** hold state for which checkboxes are marked on the form */
  checkedLabels: Map<string, boolean> = new Map<string, boolean>();

  /** Whether or not we can see the given dropdown */
  toggledDropdown = false;

  @Input('label') label: string;
  @Input('entityLabels') entityLabels: Array<string>;
  @Output() selected = new EventEmitter<{selected: Map<string, boolean>}>

  /**
   * search dropdown constructor
   * @param funcs access globally defined functions instance
   */
  constructor(private funcs: FuncsService) {
    this.label = "";
    this.entityLabels = [];
  }

  /** update labels when we receive searchData from servlet */
  ngOnChanges(changes: SimpleChanges) {
    this.label = changes['label'].currentValue;
    this.entityLabels = changes['entityLabels'].currentValue;
    for(let label of this.entityLabels) {
      this.checkedLabels.set(label, false)
    }
  }

  toggleDropdown() {
    this.toggledDropdown = !this.toggledDropdown;
    this.rotationAmount = this.toggledDropdown ? -90 : 0;
  }

  onChange(event: any, label: any) {
    // checkbox checked
    if (event.target.checked) {
      this.checkedLabels.set(label, true)
    }
    // checkbox unchecked
    else {
      this.checkedLabels.set(label, false)
    }
    this.selected.emit({selected: this.checkedLabels});
  }
}
