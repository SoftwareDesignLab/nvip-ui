// holds all of the options and structures for rendering nodes on tree
// for SSVC tree

// same rgy colors the CVSS gauge uses + the navy blue color
export const colors = {
    red: 'rgb(220, 57, 18)',
    green: 'rgb(16, 150, 24)',
    yellow: 'rgb(255, 153, 0)',
    navy: '#21618C'
}

export function scoreNode(score: number) {
    // TODO: what is the scoring criteria... should we color based on that or show something else here
    return {
        'name': 'Score: ',
        label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
            backgroundColor: colors.navy,
            borderColor: colors.navy
        },
        itemStyle : {
            color: colors.navy,
            borderColor: colors.navy
        },
        lineStyle: {
            color: colors.navy,
            opacity:1
        },
    }
}

export const missionAndWellbeing = { 
    'name': 'Mission & Well-being',
    lineStyle: {
        color: '#024a7a',
        opacity:1
    },
    label: {
        position: 'right',
        verticalAlign: 'middle',
        align: 'left',
        backgroundColor: '#024a7a',
        borderColor:'#024a7a'
    },
    itemStyle:{
        color:'#024a7a',
        borderColor:'#024a7a'
    }, 
    'value': 8833,
    'children': [
        scoreNode(1),
        scoreNode(2),
        scoreNode(3)
    ]
}

export const technicalImpact = { 
    'name': 'Technical Impact',
    lineStyle: {
        color: colors.navy,
        opacity:1
    },
    label: {
        position: 'right',
        verticalAlign: 'middle',
        align: 'left',
        backgroundColor: colors.navy,
        borderColor:colors.navy
    },
    itemStyle:{
        color: colors.navy,
        borderColor: colors.navy
    },
    'children': [
        missionAndWellbeing
    ] 
}

export const automatable = {
    'name': 'Automatable',
    lineStyle: {
        color: colors.navy,
        opacity:1
    },
    label: {
        position: 'right',
        verticalAlign: 'middle',
        align: 'left',
        backgroundColor: colors.navy,
        borderColor: colors.navy
    },
    itemStyle:{
        color: colors.navy,
        borderColor: colors.navy
    },
  'children': [
        technicalImpact
  ]
}

export const rootExploitation = {
    itemStyle:{
        color: colors.navy,
        borderColor: colors.navy 
    },
    label: {
        position: 'right',
        verticalAlign: 'middle',
        align: 'left',
        backgroundColor: colors.navy,
        borderColor: colors.navy
    },
    'name': 'Exploitation',
    'children': [
        automatable
    ]
}