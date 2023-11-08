import { Component, Input } from '@angular/core';
import { automatableColor, automatableTooltipText, decisionTooltipText, exploitationColor, exploitationTooltipText, missionAndWellbeingTooltipText, missionColor, scoreColor, technicalImpactColor, technicalImpactTooltipText } from './ssvc-tree-nodes';

export interface TreeData {
    exploitation: string;
    automatable: string;
    technicalImpact: string;
}

export interface SSVCScore {
    cveId: string;
    missionAndWellbeing: string;
    score: string;
}

@Component({
selector: 'ssvc-callouts',
templateUrl: './ssvc-callouts.component.html',
styleUrls: [ './ssvc-tree.component.css' ]
})
export class SSVCCalloutsComponent  {
    @Input('ssvcScores') ssvcScores: Array<SSVCScore>;
    activePane = 0;
    missionPrev: Object = missionAndWellbeingTooltipText.missionPrevalence;
    pubWellBeing: Object = missionAndWellbeingTooltipText.publicWellbeingImpact;
    treeDataa:TreeData = {
        exploitation: 'Active',
        automatable: 'No',
        technicalImpact: 'Total',
    }
    decisionData: any = {
        missionPrevalence: {
            name: 'Mission Prevalence',

        },
        technicalImpact: {
            name: 'Technical Impact',
            value: this.treeDataa.technicalImpact,
            info: technicalImpactTooltipText[this.treeDataa.technicalImpact.toLowerCase()],
            color: technicalImpactColor(this.treeDataa.technicalImpact),
        },
        automatable: {
            name: 'Automatable',
            value: this.treeDataa.automatable,
            info: automatableTooltipText[this.treeDataa.automatable.toLowerCase()],
            color: automatableColor(this.treeDataa.automatable),
        },
        exploitation: {
            name: 'Exploitation',
            value: this.treeDataa.exploitation,
            info: exploitationTooltipText[this.treeDataa.exploitation.toLowerCase()],
            color: exploitationColor(this.treeDataa.exploitation),
        },
    };
    constructor() {
        this.ssvcScores = [] as Array<SSVCScore>;
        this.activePane = 0;
    }

    getMissionColor(level: string) {
        return missionColor(level.toLowerCase());
    }

    getMissionText(level: string) {
        return missionAndWellbeingTooltipText[level.toLowerCase()];
    }

    getScoreColor(score: string) {
        return scoreColor(score);
    }

    getDecisionText(decision: string) {
        return decisionTooltipText[decision.toLowerCase()];
    }
    
    onTabChange($event: number) {
        this.activePane = $event;
        console.log('onTabChange', $event);
    }
} 
