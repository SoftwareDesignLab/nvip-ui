import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree/tree.component';
import { CvssGaugeComponent } from './cvss-gauge/cvss-gauge.component';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
    declarations: [TreeComponent,CvssGaugeComponent],
    imports: [CommonModule,GoogleChartsModule],
    exports:[TreeComponent,CvssGaugeComponent]
})
export class SharedModule {}
