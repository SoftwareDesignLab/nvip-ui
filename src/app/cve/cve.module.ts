import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VulnerabilitiesComponent } from './vulnerabilities/vulnerabilities.component';
import { CveDetailsComponent } from './cve-details/cve-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CveAttributesComponent } from './cve-attributes/cve-attributes.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
    declarations: [VulnerabilitiesComponent, CveDetailsComponent, CveAttributesComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        NgxPaginationModule,
        ComponentsModule
    ],
})
export class CveModule {}
