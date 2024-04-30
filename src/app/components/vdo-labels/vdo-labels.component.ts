import { Component, Input } from '@angular/core';
import { CveService } from '../../services/cve.service';

@Component({
    selector: 'app-vdo-labels',
    templateUrl: './vdo-labels.component.html',
    styles: ``,
})
export class VdoLabelsComponent {
    
    @Input() cveId: string = '';
    vdoLabels: any[] = [];
    score: number = null;
    constructor(private cveService: CveService) {}
    ngOnInit(): void {
        this.getVdoLabels();
    }

    getVdoLabels() {
        this.cveService.getVdoLabels(this.cveId).subscribe((response) => {
            this.vdoLabels = Array.from(response.vdoLabels);
            this.score = response.cvss;
        });
    }

    getScoreColor(number: number): string {
        return number <= 25
            ? 'bg-success'
            : number <= 50
            ? 'bg-warning'
            : number <= 75
            ? 'bg-danger'
            : 'bg-secondary';
    }

    getSeverityScore(score: number): string {
        if(score!=null){
            return score < 3
            ? 'Low'
            : score < 6
            ? 'Medium'
            : score < 9
            ? 'High'
            : 'Critical';
        }else{
            return 'N/A';
        }

    }

    getSeverityColor(score: number): string {
        if (this.score!=null) {
            const severity = this.getSeverityScore(score);
            return severity == 'Low'
                ? 'text-success'
                : severity == 'Medium'
                ? 'text-warning'
                : severity == 'High'
                ? 'text-danger'
                : 'text-white';
        } else {
            return 'bg-danger text-white';
        }
    }
}
