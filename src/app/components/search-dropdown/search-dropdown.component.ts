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

  //TODO: can probably make this more intuitive - current copy from old UI
  toggleContent($event: any) {
    // If the triggering element is a form checkbox, do not toggle.
		if ($event.srcElement.classList.contains("nvip-form-dropdown-checkbox")){
			return;
		}
		
		var formDropdown = this.funcs.getAncestor($event.srcElement as HTMLElement, "nvip-form-dropdown-field");
		var formContent = this.funcs.getSiblingByClassName(formDropdown as HTMLElement, "nvip-form-dropdown-content");
    var caretIcon = formDropdown!.getElementsByClassName("nvip-form-dropdown-caret")[0];
		
		if(formContent!.style.display == 'flex'){
      this.rotationAmount = 0;
			formDropdown!.classList.remove('dropdown-opened');
			formContent!.style.display = 'none';
      caretIcon.classList.add("fa-angle-left");
      caretIcon.classList.remove("fa-angle-down");
		}
		else{
      this.rotationAmount = -90;
			formDropdown!.classList.add('dropdown-opened');
			formContent!.style.display = 'flex';
			caretIcon.classList.remove("fa-angle-left");
	    caretIcon.classList.add("fa-angle-down");
		}
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
