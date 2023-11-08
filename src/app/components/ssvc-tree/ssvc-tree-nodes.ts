// holds all of the options and structures for rendering nodes on tree
// for SSVC tree

// Tooltip text source: https://democert.org/ssvc/
export const exploitationTooltipText: Object | any = {
    none: "There is no evidence of active exploitation and no public proof of concept (PoC) of how to exploit the vulnerability.",
    poc: "One of the following cases is true: (1) private evidence of exploitation is attested but not shared; (2) widespread hearsay attests to exploitation; (3) typical public" +
        " PoC in places such as Metasploit or ExploitDB; or (4) the vulnerability has a well-known method of exploitation. Some examples of conditition (4) are open-source web" +
        " proxies serve as the PoC code for how to exploit any vulnerability in the vein of improper validation of TLS certificates. As another example, Wireshark serves as a PoC" +
        " for packet replay attacks on ethernet or WiFi networks.",
    active: "Shared, observable, reliable evidence that the exploit is being used in the wild by real attackers; there is credible public reporting.",
}

export const automatableTooltipText: any = {
    no: "Steps 1-4 of the kill chain cannot be reliably automated for this vulnerability for some reason. These steps are reconnaissance, weaponization, delivery, and exploitation." +
        " Example reasons for why a step may not be reliably automatable include (1) the vulnerable component is not searchable or enumerable on the network, (2) weaponization may" +
        " require human direction for each target, (3) delivery may require channels that widely deployed network security configurations block, and (4) exploitation may be frustrated" + 
        " by adequate exploit-prevention techniques enabled by default; ASLR is an example of an exploit-prevention tool.",
    yes: "Steps 1-4 of the kill chain can be reliably automated. If the vulnerability allows unauthenticated remote code execution (RCE) or command injection, the response is likely yes."   
}

export const technicalImpactTooltipText: any = {
    partial: "The exploit gives the adversary limited control over, or information exposure about, the behavior of the software that contains the vulnerability. Or the exploit gives" + 
        " the adversary an importantly low stochastic opportunity for total control. In this context, \"low\" means that the attacker cannot reasonably make enough attempts to overcome" +
        " the low chance of each attempt not working. Denial of service is a form of limited over the behavior of the vulnerable component.",
    total: "The exploit gives the adversary total control over the behavior of the software, or it gives total disclosure of all information on the system that contains the vulnerability."
}

export const missionAndWellbeingTooltipText: any = {
    low: "Mission Prevalence is Minimal and Public well-being impact is Minimal",
    medium: "{Mission Prevalence is Support and Public well-being is Minimal or Material} OR {Mission Prevalence is Minimal or Support and Public well-being is Material}",
    high: "Mission Prevalence is Essential or Public well-being impact is Irreversible",

    missionPrevalence: {
        minimal: "Neither support nor essential apply. The vulnerable component may be used within the entities, but it is not used as a mission-essential component nor does it support" + 
            " (enough) mission essential functions.",
        support: "The operation of the vulnerable component merely supports mission essential functions for two or more entities.",
        essential: "The vulnerable component directly provides capabilities that constitute at least one MEF for at least one entity, and failure may (but need not) lead to overall mission failure."
    },

    publicWellbeingImpact: {
        minimal: "Type of harm is \"All\" (Physical, Environmental, Financial, Psychological) and the associated Safety Impact Value is \"None\". The effect is below the threshold" +
            " for all aspects described in material.",
        material: "Any one or more of the conditions (Physical, Environmental, Financial, Psychological) hold and the associated Safety Impact Value is \"Major\". \"Physical harm\" means" +
            " \"Physical distress or injuries for users of the system OR introduces occupational safety hazards OR reduction and/or failure of cyber-physical system's safety margins.\"" + 
            " \"Environment\" means \"Major externalities (property damage, environmental damage, etc.) imposed on other parties.\" \"Financial\" means \"Financial losses that likely" +
            " lead to bankruptcy of multiple persons.\" \"Psychological\" means \"Widespread emotional or psychological harm, sufficient to be cause for counselling or therapy, to" + 
            " populations of people.\"",
        irreversible: "Any one or more of the following conditions hold and the associated Safety Impact Value is \"Catastrophic\". \"Physical harm\" means \"Multiple fatalities likely" +
            " OR loss or destruction of cyber-physical system of which the vulnerable component is a part.\" \"Environment\" means \"Extreme or serious externalities (immediate public health" +
            " thread, environmental damage leading to small ecosystem collapse, etc.) imposed on other parties.\" \"Financial\" means \"Social systems (elections, financial grid, etc.) supported" +
            " by the software are destabilized and potentially collapse.\""
    },
}

export const decisionTooltipText: any = {
    track: "The vulnerability does not require attention outside of Vulnerability Management (VM) at this time. Continue to track the situation and reasses the severity of vulnerability if necessary.",
    trackstar: "Track these closely, especially if mitigation is unavailable or difficult. Recommended that analyst discuss with other analysts and get a second opinion.",
    attend: "The vulnerability requires to be attended to by stakeholders outside VM. The action is a request to others for assistance / information / details, as well as a potential publication about the issue.",
    act: "The vulnerability requires immediate action by the relevant leadership. The action is a high-priority meeting among the relevant supervisors to decide how to respond."
}

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

export function scoreColor(score: string): string {
    return score === 'Act' ? colors.red : score === 'Attend' ? colors.orange : score === 'Track*' ? colors.yellow : colors.green;
}

export function scoreNode(value: string, score: string) {
    // color based on SSVC decision
    // Track - green
    // Track* - yellow
    // Attend - orange
    // Act - red
    const color = scoreColor(score);
    return {
        'name': value + ": " + score,
        toolTipInfo: {
            name: 'Decision',
            value: value,
            color: color,
            score: score,
            text: decisionTooltipText[score.toLowerCase() as keyof Object]
        },
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

export function missionColor(mission: string) {
    return mission === 'low' ? colors.green : mission === 'medium' ? colors.yellow : mission === 'high' ? colors.red : colors.black;
}

export function missionAndWellbeingNode(treeData: Object) {
    return { 
        'name': 'Mission & Well-being',
        toolTipInfo: {
            name: 'Mission & Well-being',
            value: "",
            color: "",
            text: ""
        },
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

export function technicalImpactColor(technical: string) {
    return technical === 'Total' ? colors.red : technical === 'Partial' ? colors.yellow : colors.black;
}

// TODO: model the treeData import instead of any
export function technicalImpactNode(treeData: Object|any) { 
    const technical = treeData.technicalImpact;
    const technicalColor = technicalImpactColor(technical);
    return {
        'name': 'Technical Impact',
        toolTipInfo: {
            name: 'Technical Impact',
            value: technical,
            color: technicalColor,
            text: technicalImpactTooltipText[technical.toLowerCase() as keyof Object]
        },
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

export function automatableColor(automate: string) {
    return automate === 'Yes' ? colors.red : automate === 'No' ? colors.green : colors.black;
}

export function automatableNode(treeData: Object|any) {
    const automate = treeData.automatable;
    const automateColor = automatableColor(automate);
    return {
        'name': 'Automatable',
        toolTipInfo: {
            name: 'Automatable',
            value: automate,
            color: automateColor,
            text: automatableTooltipText[automate.toLowerCase() as keyof Object]
        },
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

export function exploitationColor(exploit: string) {
    return exploit === 'None' ? colors.green : exploit === 'POC' ? colors.yellow : exploit === 'Active' ? colors.red : colors.black;
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
    const exploitColor = exploitationColor(exploitation);
    return {
        toolTipInfo: {
            name: 'Exploitation',
            value: exploitation,
            color: exploitColor,
            text: exploitationTooltipText[exploitation.toLowerCase() as keyof Object]
        },
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