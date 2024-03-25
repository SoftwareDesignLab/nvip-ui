import { Component, OnInit ,Input,Output, EventEmitter} from '@angular/core';
import { Attribute, Attributes } from "../models/utils.model";
import { CveUtilService } from '../cve-util-service';
import { VulnerabilitiesService } from '../../services/vulnerabilities.service';



const vdo: Attribute[] = [
    {
        key: 'Context',
        values: [
            'Application',
            'Channel',
            'Firmware',
            'Guest Os',
            'Host Os',
            'Hypervisor',
            'Physical Hardware',
        ],
    },
    {
        key: 'Mitigation',
        values: [
            'ASLR',
            'HPKP/HSTS',
            'Multi Factor',
            'Authentication',
            'Physical Security',
            'Sandboxed',
        ],
    },
    {
        key: 'Logical Impact',
        values: [
            'Indirect Disclosure',
            'Privilige Escalation',
            'Read',
            'Resource Removal',
            'Service Interrupt',
            'Write',
        ],
    },
    {
        key: 'Attack Theater',
        values: ['Limited Rmt', 'Local', 'Physical', 'Remote'],
    },
    {
        key: 'Impact Method',
        values: [
            'Authentication',
            'Bypass',
            'Code Execution',
            'Context Escape',
            'Man-in-the-Middle',
            'Trust Failure',
        ],
    },
];


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
    vdo=vdo;
    cvss: string[] = ['Low', 'Medium', 'High', 'Critical'];

    @Output() onSerach:EventEmitter<boolean>=new EventEmitter<boolean>();

    constructor(
        private vulnerabilityService:VulnerabilitiesService,
        public utilService:CveUtilService
    ){}
    ngOnInit(): void {}

    updateContent(event:any){
    }

    search(){
        this.vulnerabilityService.search({},this.utilService.searchObject).subscribe((response)=>{
            this.utilService.vulnerabilities = response.data;
            this.utilService.paginationObject.totalPages = response.total;
        })
    }

    onCvssChange(event:any,item:string){
        var checked=event.target.checked;
        if(checked==false){
            var index=this.utilService.searchObject.cvss.indexOf(item);
            this.utilService.searchObject.cvss.splice(index,1);
        }else{
            this.utilService.searchObject.cvss.push(item);
        }
        this.updateContent(event);
    }
}