import { Component, Input } from '@angular/core';
import { CveService } from '../../services/cve.service';

class Source {
    rawDescription: string;
    createdDate: Date;
    publishedDate: Date;
    lastModifiedDate: Date;

    sourceUrl: string;
    isGarbage: number;
    sourceType: string;
    parserType: string;
}
type UrlMap = { [host: string]: Source[] };
@Component({
    selector: 'app-sources',
    templateUrl: './sources.component.html',
})
export class SourcesComponent {
    @Input() cveId: string = '';

    groupedUrls: Map<string, Source[]> = new Map();
    sources: Source[] = [];

    constructor(private cveService: CveService) {}

    ngOnInit(): void {
        console.log(this.cveId);
        this.getRawDescriptions();
    }

    getRawDescriptions() {
        this.cveService.getRawDescription(this.cveId).subscribe((response) => {
            this.sources = Array.from(response);
            this.groupedUrls = this.groupByHost(this.sources);
            
        });
    }

    private groupByHost(items: Source[]): Map<string, Source[]> {
        const map = new Map<string, Source[]>();
        items.forEach((item) => {
            const { hostname } = new URL(item.sourceUrl);
            const existing = map.get(hostname) || [];
            existing.push(item);
            map.set(hostname, existing);
        });
        return map;
    }
}
