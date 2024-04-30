import { Component, Input } from '@angular/core';
import { SsvcService } from '../../services/ssvc.service';


export const colors = {
    red: 'rgb(220, 53, 69)',
    green: 'rgb(40, 167, 69)',
    yellow: 'rgb(255, 193, 7)',
    orange: 'rgb(238, 135, 51)',
    navy: '#21618C',
    darkred: 'rgb(112, 1, 1)',
    blue: 'rgb(0, 68, 194)',
    purple: 'rgb(53, 0, 79)',
    black: 'rgb(0, 0, 0)',
    grey: '#c6c6cc',
    white: '#ffffff',
};

export class Ssvc {
    automatable: boolean = false;
    exploitStatus: string = 'NONE';
    exploitStatusRationale: string = 'Nothing Found';
    ssvcScoreHigh: string = 'TRACK*';
    ssvcScoreLow: string = 'TRACK';
    ssvcScoreMedium: string = 'TRACK';
    technicalImpact: string = 'total';
}
export class TreeNode {
    title: string = '';
    value: string = '';
    titleColor: string = '';
    valueColor: string = '';
    children: TreeNode[] = null;
    width: number = 150;
    isRoot: boolean = false;
    constructor(
        title: string,
        value: string,
        titleColor: string,
        valueColor: string,
        children: TreeNode[] = null,
        width: number = 150,
        isRoot: boolean = false
    ) {
        this.title = title;
        this.value = value;
        this.titleColor = titleColor;
        this.valueColor = valueColor;
        this.children = children;
        this.width = width;
        this.isRoot = isRoot;
    }
}

@Component({
    selector: 'app-ssvc-score',
    templateUrl: './ssvc-score.component.html',
})
export class SsvcScoreComponent {
    @Input() cveId: string = '';
    treeData: TreeNode = null;
    isTreeInitialized: boolean = false;
    public Ssvc: Ssvc = new Ssvc();

    constructor(private ssvcService: SsvcService) {}

    ngOnInit(): void {
        this.getSsvcScore();
    }

    getSsvcScore() {
        this.ssvcService.getSsvcScore(this.cveId).subscribe((response) => {
            this.Ssvc = Object.assign(new Ssvc(), response);
            this.initializeTree();
            
        });
    }

    initializeTree() {
        this.treeData = new TreeNode(
            'Exploitation : ',
            this.Ssvc.exploitStatus,
            'white',
            this.exploitationColor(this.Ssvc.exploitStatus),
            [
                new TreeNode(
                    'Automatable :',
                    this.Ssvc.automatable ? 'Yes' : 'No',
                    'white',
                    this.automatableColors(this.Ssvc.automatable),
                    [
                        new TreeNode(
                            'Technical Impact : ',
                            this.Ssvc.technicalImpact,
                            'white',
                            this.technicalImpactColor(
                                this.Ssvc.technicalImpact
                            ),
                            [
                                new TreeNode(
                                    'Mission & Well-Being',
                                    '',
                                    'white',
                                    colors.grey,
                                    [
                                        new TreeNode(
                                            'Low : ',
                                            this.Ssvc.ssvcScoreLow,
                                            this.scoreColor(
                                                this.Ssvc.ssvcScoreLow
                                            ),
                                            this.scoreColor(
                                                this.Ssvc.ssvcScoreLow
                                            ),
                                            null,
                                            150
                                        ),
                                        new TreeNode(
                                            'Medium : ',
                                            this.Ssvc.ssvcScoreMedium,
                                            this.scoreColor(
                                                this.Ssvc.ssvcScoreMedium
                                            ),
                                            this.scoreColor(
                                                this.Ssvc.ssvcScoreMedium
                                            ),
                                            null,
                                            150
                                        ),
                                        new TreeNode(
                                            'High : ',
                                            this.Ssvc.ssvcScoreHigh,
                                            this.scoreColor(
                                                this.Ssvc.ssvcScoreHigh
                                            ),
                                            this.scoreColor(
                                                this.Ssvc.ssvcScoreHigh
                                            ),
                                            null,
                                            150
                                        ),
                                    ],
                                    170
                                ),
                            ],
                            200
                        ),
                    ],
                    150
                ),
            ],
            200,
            true
        );
        this.isTreeInitialized = true;
    }

    scoreColor(score: string): string {
        score = score.toLowerCase();
        return score === 'act'
            ? colors.red
            : score === 'attend'
            ? colors.orange
            : score === 'track*'
            ? colors.yellow
            : colors.green;
    }

    exploitationColor(exploit: string) {
        return exploit === 'NONE'
            ? colors.green
            : exploit === 'POC'
            ? colors.yellow
            : exploit === 'Active'
            ? colors.red
            : colors.white;
    }
    automatableColors(automatable: boolean) {
        return automatable == false ? colors.green : colors.red;
    }
    technicalImpactColor(technical: string) {
        return technical == 'total' ? colors.red : colors.green;
    }
}
