export class Description {
    description: string = '';
    createdDate: Date;
}

export class Ssvc {
    automatable: boolean = false;
    exploitStatus: string = 'NONE';
    exploitStatusRationale: string = 'Nothing Found';
    ssvcScoreHigh: string = 'TRACK*';
    ssvcScoreLow: string = 'TRACK';
    ssvcScoreMedium: string = 'TRACK';
    technicalImpact: string = 'total';
}

export class Exploit {
    id: number;

    name: string;

    description: string;

    exampleFile: string;

    author: string;

    datePublished: Date;

    isRepo: boolean;

    source: string;

    dateCreated: string;

    sourceUrl: string;

    ignore: boolean;
    fixed: boolean;
}

export class Fix {
    fixDescription: string = '';
    sourceUrl: string = '';
}

export class Patch {
    commitSha: string;
    commitMessage: string;
    uniDiff: string;
    timeline: string;
    timeToPatch: string;
    linesChanged: number;
    commitDate: Date;
    sourceUrl:any;
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
