import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CveUtilService } from '../cve-util-service';
import { HttpLoadingService } from '../../services/shared/http-loading.service';


@Component({
    selector: 'app-cve',
    templateUrl: './cve.component.html',
    styleUrl: './cve.component.scss',
})
export class CveComponent implements OnInit {


    selectedTab: string = 'Description';
    cveId: string = '';

    date:Date=new Date();
    nvd:any={
        status:'Analyzed',
        publishedDate:new Date(),
        modifiedDate:new Date()
    }
    mitre:any={
        status:'Not In Metre',
        lastModified:new Date()
    }

    constructor(
        public utilService:CveUtilService,
        private Activeroute: ActivatedRoute,
        public loadingService:HttpLoadingService
    ) {}

    ngOnInit(): void {
        this.Activeroute.params.subscribe((params) => {
            this.cveId = params['cveId'];
        });
    }
}


