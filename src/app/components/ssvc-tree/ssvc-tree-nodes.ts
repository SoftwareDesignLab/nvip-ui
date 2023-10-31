// holds all of the options and structures for rendering nodes on tree
// for SSVC tree

// same rgy colors the CVSS gauge uses + others
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
    white: '#ffffff'
}

export const boxColors = {
    backgroundColor: colors.white,
    borderColor: colors.grey,
    padding: 2,
    borderRadius: 5,
    borderWidth: 2.5,
}

export function scoreNode(value: string, score: string) {
    // color based on SSVC decision
    // Track - green
    // Track* - yellow
    // Attend - orange
    // Act - red
    const color = score === 'Act' ? colors.red : score === 'Attend' ? colors.orange : score === 'Track*' ? colors.yellow : colors.green;
    return {
        'name': value + ": " + score,
        label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
            distance: 10,
            // backgroundColor: color,
            // borderColor: color
            ...boxColors,
            // borderRadius: 1,
            color: color,
            // fontWeight: 'bold',
        },
        itemStyle : {
            color: color,
            borderColor: color
        },
        lineStyle: {
            color: colors.black,
            opacity:1,
        },
    }
}

export function missionAndWellbeingNode(treeData: Object) {
    return { 
        'name': 'Mission & Well-being',
        lineStyle: {
            color: colors.black,
            opacity:1
        },
        label: {
            position: 'top',
            verticalAlign: 'top',
            align: 'center',
            distance: 35,
            // backgroundColor: '#024a7a',
            // borderColor:'#024a7a'
            // backgroundColor: 'transparent',
            // borderColor: 'transparent',
            ...boxColors,
            formatter: [
                '{title| Mission &\n Well-Being: }',
                // `{a| ↗ Low }\n\t\t{b| Medium }\n\t\t{c| High }`
            ].join(''),
        
            rich: {
                title: {
                    color: colors.black,
                },
                a: {
                    color: colors.green,
                },
                b: {
                    color: colors.yellow,
                },
                c: {
                    color: colors.red,
                },
            }
        },
        itemStyle:{
            color:'#024a7a',
            borderColor:'#024a7a'
        }, 
        'value': 8833,
        'children': [
            scoreNode('Low', 'Track'),
            scoreNode('Medium', 'Attend'),
            scoreNode('High', 'Act')
        ]
    }
}

// TODO: model the treeData import instead of any
export function technicalImpactNode(treeData: Object|any) { 
    const technical = treeData.technicalImpact;
    const technicalColor = technical === 'Total' ? colors.red :
                            technical === 'Partial' ? colors.yellow :
                            colors.black;
    return {
        'name': 'Technical Impact',
        lineStyle: {
            color: colors.black,
            opacity:1
        },
        label: {
            position: 'top',
            verticalAlign: 'top',
            align: 'center',
            distance: 25,
            // backgroundColor: colors.purple,
            // borderColor:colors.purple
            // backgroundColor: 'transparent',
            // borderColor: 'transparent',
            ...boxColors,
            formatter: [
                '{title| Technical Impact: }',
                `{a| ${technical} }`
            ].join(''),
        
            rich: {
                title: {
                    color: colors.black,
                },
                a: {
                    color: technicalColor,
                },
            }
        },
        itemStyle:{
            // color: colors.purple,
            // borderColor: colors.purple
            color: technicalColor,
        },
        'children': [
            missionAndWellbeingNode(treeData)
        ] 
    }
}

export function automatableNode(treeData: Object|any) {
    const automate = treeData.automatable;
    const automateColor = automate === 'No' ? colors.green :
                            automate === 'Yes' ? colors.red :
                            colors.black;
    return {
        'name': 'Automatable',
        lineStyle: {
            color: colors.black,
            opacity:1
        },
        label: {
            position: 'top',
            verticalAlign: 'top',
            align: 'center',
            distance: 25,
            // backgroundColor: colors.blue,
            // borderColor: colors.blue,
            // backgroundColor: 'transparent',
            // borderColor: 'transparent',
            ...boxColors,
            formatter: [
                '{title| Automatable: }',
                `{a| ${automate} }`
            ].join(''),
        
            rich: {
                title: {
                    color: colors.black,
                },
                a: {
                    color: automateColor,
                },
            }
        },
        itemStyle:{
            // color: colors.blue,
            // borderColor: colors.blue
            color: automateColor,
        },
        'children': [
                technicalImpactNode(treeData)
        ]
    }
}

export function rootExploitation(treeDataa: Object) {
    // console.log("this is tree data", treeData);
    // TODO: pass in Exploitation, Automatable, and Technical impact decisions through here
    const treeData = {
        exploitation: 'Active',
        automatable: 'No',
        technicalImpact: 'Total'
    }
    const exploitation = treeData.exploitation;
    const exploitColor = exploitation === 'None' ? colors.green : 
                            exploitation === 'POC' ? colors.yellow : 
                            exploitation === 'Active' ? colors.red : 
                            colors.black
    return {
        itemStyle:{
            color: exploitColor,
            // borderColor: colors.darkred 
        },
        label: {
            position: 'top',
            verticalAlign: 'top',
            align: 'center',
            distance: 25,
            // backgroundColor: 'transparent',
            // borderColor: 'transparent',
            // backgroundColor: colors.grey,
            // borderColor: colors.grey,
            ...boxColors,
            formatter: [
                '{title| Exploitation: }',
                `{a| ${exploitation} }`
            ].join(''),
        
            rich: {
                title: {
                    color: colors.black,
                },
                a: {
                    color: exploitColor,
                },
            }
        },
        'name': 'Exploitation',
        'children': [
            automatableNode(treeData)
        ]
    }
}