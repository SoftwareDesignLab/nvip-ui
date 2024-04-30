import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourcesComponent } from './sources/sources.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AffectedProductsComponent } from './affected-products/affected-products.component';
import { VdoLabelsComponent } from './vdo-labels/vdo-labels.component';
import { SsvcScoreComponent } from './ssvc-score/ssvc-score.component';
import { SharedModule } from '../shared/shared.module';
import { ExploitsComponent } from './exploits/exploits.component';
import { MonacoEditorModule } from 'ngx-monaco-editor'
import { BrowserModule } from '@angular/platform-browser';
import { CpeComponent } from './cpe/cpe.component';

@NgModule({
    declarations: [
        SourcesComponent,
        AffectedProductsComponent,
        VdoLabelsComponent,
        SsvcScoreComponent,
        ExploitsComponent,
        CpeComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        MonacoEditorModule.forRoot(),
    ],
    exports: [
        SourcesComponent,
        AffectedProductsComponent,
        VdoLabelsComponent,
        SsvcScoreComponent,
        ExploitsComponent,
        CpeComponent
    ],
})
export class ComponentsModule {}
