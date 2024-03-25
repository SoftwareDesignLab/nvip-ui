import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header/page-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';
import { TreeComponent } from './tree/tree.component';
import { NoDataComponent } from './no-data/no-data.component';
import { DatepickerComponent } from './datapicker/datapicker.component';
import { DatseFilterComponent } from './datse-filter/datse-filter.component';
import {
    BsDatepickerModule,
    BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MultiAttributesFilterComponent } from './multi-attributes-filter/multi-attributes-filter.component';
import { AttributesFilterComponent } from './attributes-filter/attributes-filter.component';

@NgModule({
    declarations: [
        PageHeaderComponent,
        SpinnerComponent,
        TreeComponent,
        NoDataComponent,
        DatepickerComponent,
        DatseFilterComponent,
        MultiAttributesFilterComponent,
        AttributesFilterComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        BsDatepickerModule,
    ],
    exports: [
        PageHeaderComponent,
        SpinnerComponent,
        TreeComponent,
        NoDataComponent,
        DatepickerComponent,
        DatseFilterComponent,
        AttributesFilterComponent
    ],
})
export class SharedComponentsModule {}
