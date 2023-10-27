// holds all of the options and structures for rendering nodes on tree
// for SSVC tree

// same rgy colors the CVSS gauge uses + others
export const colors = {
    red: 'rgb(220, 57, 18)',
    green: 'rgb(16, 150, 24)',
    yellow: 'rgb(255, 153, 0)',
    navy: '#21618C',
    darkred: 'rgb(112, 1, 1)',
    blue: 'rgb(0, 68, 194)',
    purple: 'rgb(53, 0, 79)'
}

export function scoreNode(score: string) {
    // TODO: what is the scoring criteria... should we color based on that or show something else here
    const color = score === 'LOW' ? colors.green : score === 'MEDIUM' ? colors.yellow : colors.red;
    return {
        'name': score,
        label: {
            position: 'top',
            verticalAlign: 'top',
            align: 'center',
            distance: 25,
            backgroundColor: color,
            borderColor: color
        },
        itemStyle : {
            color: color,
            borderColor: color
        },
        lineStyle: {
            color: color,
            opacity:1
        },
    }
}

export const missionAndWellbeing = { 
    'name': 'Mission & Well-being',
    lineStyle: {
        color: 'purple',
        opacity:1
    },
    label: {
        position: 'top',
        verticalAlign: 'top',
        align: 'center',
        distance: 25,
        backgroundColor: '#024a7a',
        borderColor:'#024a7a'
    },
    itemStyle:{
        color:'#024a7a',
        borderColor:'#024a7a'
    }, 
    'value': 8833,
    'children': [
        scoreNode('LOW'),
        scoreNode('MEDIUM'),
        scoreNode('HIGH')
    ]
}

export const technicalImpact = { 
    'name': 'Technical Impact',
    lineStyle: {
        color: colors.blue,
        opacity:1
    },
    label: {
        position: 'top',
        verticalAlign: 'top',
        align: 'center',
        distance: 25,
        backgroundColor: colors.purple,
        borderColor:colors.purple
    },
    itemStyle:{
        color: colors.purple,
        borderColor: colors.purple
    },
    'children': [
        missionAndWellbeing
    ] 
}

export const automatable = {
    'name': 'Automatable',
    lineStyle: {
        color: colors.darkred,
        opacity:1
    },
    label: {
        position: 'top',
        verticalAlign: 'top',
        align: 'center',
        distance: 25,
        backgroundColor: colors.blue,
        borderColor: colors.blue
    },
    itemStyle:{
        color: colors.blue,
        borderColor: colors.blue
    },
  'children': [
        technicalImpact
  ]
}

export const rootExploitation = {
    itemStyle:{
        color: colors.darkred,
        borderColor: colors.darkred 
    },
    label: {
        position: 'top',
        verticalAlign: 'top',
        align: 'center',
        distance: 25,
        backgroundColor: colors.darkred,
        borderColor: colors.darkred
    },
    'name': 'Exploitation',
    'children': [
        automatable
    ]
}