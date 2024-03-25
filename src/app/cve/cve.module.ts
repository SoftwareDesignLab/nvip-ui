import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { CveRoutingModule } from './cve-routing.module';
import { MainComponent } from './main/main.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { CveComponent } from './cve/cve.component';
import {
    CveAffectedProductsComponent,
    CveDescriptionComponent,
    CveDetailsComponent,
    CveExploitsComponent,
    CvePatchesComponent,
    CveFixesComponent,
    CveSourcesComponent,
    CveSsvcScoresComponent,
    CveVdoLabelsComponent,
    CpeComponent,
} from './cve-details/cve-details.component';
import { SearchComponent } from './main/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        MainComponent,
        CveComponent,
        CveDetailsComponent,
        CveDescriptionComponent,
        CveSsvcScoresComponent,
        CveSourcesComponent,
        CveAffectedProductsComponent,
        CveExploitsComponent,
        CveVdoLabelsComponent,
        CvePatchesComponent,
        CveSsvcScoresComponent,
        CveFixesComponent,
        CpeComponent,
        SearchComponent,


    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CveRoutingModule,
        SharedComponentsModule,
        NgxPaginationModule,
    ],
})
export class CveModule {}
