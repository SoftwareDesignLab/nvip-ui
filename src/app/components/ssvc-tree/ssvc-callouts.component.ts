import { Component, Input, SimpleChanges } from '@angular/core';
import { SSVCData, automatableColor, 
    automatableTooltipText, 
    decisionTooltipText, 
    exploitationColor, 
    exploitationTooltipText, 
    missionAndWellbeingTooltipText, 
    missionColor, 
    scoreColor, 
    technicalImpactColor, 
    technicalImpactTooltipText 
} from './ssvc-tree-nodes';

export interface TreeData {
    exploitation: string;
    automatable: string;
    technicalImpact: string;
}

export interface DecisionData {
    technicalImpact: Decision;
    automatable: Decision;
    exploitation: Decision;
}

export interface Decision {
    name: string;
    value: string;
    info: string;
    color: string;
}

@Component({
selector: 'ssvc-callouts',
templateUrl: './ssvc-callouts.component.html',
styleUrls: [ './ssvc-tree.component.css' ]
})
export class SSVCCalloutsComponent  {
    @Input('ssvc') ssvc: SSVCData;
    activePane = 0;
    missionPrev: Object = missionAndWellbeingTooltipText.missionPrevalence;
    pubWellBeing: Object = missionAndWellbeingTooltipText.publicWellbeingImpact;
    decisionData = {} as DecisionData;
    treeData = {} as Object;
    constructor() {
        this.ssvc = {} as SSVCData;
        this.activePane = 0;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['ssvc']) {
            this.ssvc = changes['ssvc'].currentValue[0];
            this.decisionData = {
                technicalImpact: {
                    name: 'Technical Impact',
                    value: this.ssvc.technicalImpact ? 'Total' : 'Partial',
                    info: technicalImpactTooltipText[this.ssvc.technicalImpact ? 'total' : 'partial'],
                    color: technicalImpactColor(this.ssvc.technicalImpact),
                },
                automatable: {
                    name: 'Automatable',
                    value: this.ssvc.automatable ? 'Yes' : 'No',
                    info: automatableTooltipText[this.ssvc.automatable ? 'yes' : 'no'],
                    color: automatableColor(this.ssvc.automatable),
                },
                exploitation: {
                    name: 'Exploitation',
                    value: this.ssvc.exploitStatus,
                    info: exploitationTooltipText[this.ssvc.exploitStatus.toLowerCase()],
                    color: exploitationColor(this.ssvc.exploitStatus),
                },}
            this.treeData = {
                exploitation: 'Active',
                automatable: 'No',
                technicalImpact: 'Total',
            };
        }
    }

    getMissionLevel(level: string) {
        return level === 'ssvcScoreHigh' ? 'High' : level === 'ssvcScoreMedium' ? 'Medium' : 'Low';
    }

    getMissionColor(level: string) {
        return missionColor(level);
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
    }

    unsorted(a: any, b: any): number { return 0; }
} 
