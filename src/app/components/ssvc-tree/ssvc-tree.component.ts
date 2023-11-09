import { Component, HostListener, Input, OnInit, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { SSVCData, rootExploitation } from './ssvc-tree-nodes';

var custOrient :any ='LR';

export const TREE_OPTION = {
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove',
    confine: true,
    className: 'tree-tooltip',
    extraCssText: 'width:500px; height:250px; white-space:pre-wrap;',
    formatter: function (params: any) {
        const info = params.data.toolTipInfo;
        return [
            `<span class="fs-mini me-2">${info.name}:</span><b style='color:${info.color} !important;'>${info.value}</b><hr size=1 style="margin: 3px 0">`,
            `<div>${info.text}</div>`,
           ].join('')
    }
  },
  legend: {
    top: '2%',
    left: '3%',
    orient: 'vertical',
    data: [
    {
      name: 'SSVC',
      icon: 'circle',
    }],
  },
  series: [
    {
      orient: custOrient,
      type: 'tree',
      name: 'SSVC',
      initialTreeDepth: -1,
      data: [],
      top: '5%',
    //   left: '7%',
      bottom: '2%',
      right: '30%',
      symbolSize: 10,
      symbol:'emptyCircle',
      lineStyle: {
          color: '#ffcd00',
          opacity:1,
      },
      label: {
        normal: {  
          position: 'insideTop',
          verticalAlign: 'top',
          align: 'center',
          fontSize: 16, 
          fontFamily: 'Roboto',      
          color:'#ffffff',
          opacity:1,
          borderRadius:1,
          borderWidth: 5,
          gapWidth: 5,
          borderColor: '#ffcd00',          
          backgroundColor: '#ffcd00',
        }   
      },
      emphasis: {
          label: {
              show: true
          }
      },
      leaves: {
        label: {
          normal: {
            show: true,
            position: 'top',
            // distance: 50,
            verticalAlign: 'top',
            align: 'center',
            fontSize: 16, 
            fontFamily: 'Roboto',
            color:'#ffffff',
            borderWidth: 5,
            gapWidth: 3,
            opacity:1,
          }
        },
        lineStyle: {
          color: '#95cb03',
          opacity:1
        },
      },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750

    }
  ]
};
@Component({
selector: 'ssvc-tree',
templateUrl: './ssvc-tree.component.html',
styleUrls: [ './ssvc-tree.component.css' ]
})
export class SSVCTreeComponent implements OnInit  {
    @Input('ssvc') ssvc: SSVCData;
    options = TREE_OPTION as EChartsOption;
    mergeData = {};

    constructor() {
        this.ssvc = {} as SSVCData;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['ssvc']) {
            this.ssvc = changes['ssvc'].currentValue[0];
            TREE_OPTION.series[0].data = [rootExploitation(this.ssvc)] as any;
            this.mergeData = {
                series: TREE_OPTION.series
            };
        }
    }

    ngOnInit() {
      if (window.innerWidth < 768) custOrient ='TB';
      else custOrient ='LR';
      TREE_OPTION.series[0].orient=custOrient;
      TREE_OPTION.series[0].data = [rootExploitation(this.ssvc)] as any;
      this.mergeData = {
          series: TREE_OPTION.series
      };
    }

    @HostListener('window:resize')
    onResize() {
      if (window.innerWidth < 768 && custOrient=='LR') {
        custOrient ='TB';
        TREE_OPTION.series[0].orient='TB';
        this. mergeData = {};
        this.ngOnInit();
      } else if (window.innerWidth > 768 && custOrient=='TB') {
        custOrient ='LR';
        TREE_OPTION.series[0].orient='LR';
        TREE_OPTION.series[0].label.normal = { ...TREE_OPTION.series[0].label.normal, ...{
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
      } };
      this.mergeData = {};
      this.ngOnInit();
      }
    }

    changeOrientation(){
        if(custOrient=='RL'){
            custOrient ='LR';
            const newOritentation = {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
            }
            TREE_OPTION.series[0].orient='LR';
            TREE_OPTION.series[0].label.normal = { ...TREE_OPTION.series[0].label.normal, ...newOritentation };
        }
        else {
            custOrient='RL';
            const newOritentation = {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left',
            }
            TREE_OPTION.series[0].label.normal = { ...TREE_OPTION.series[0].label.normal, ...newOritentation };
            TREE_OPTION.series[0].orient='RL';
        }
        this. mergeData = {};
        this.ngOnInit();
    }

    changeVerticalorientation(){
        if(custOrient=='TB'){
            custOrient ='BT';
            TREE_OPTION.series[0].orient='BT';
        }
        else {
            custOrient='TB';
            TREE_OPTION.series[0].orient='TB';
        }
        this. mergeData = {};
        this.ngOnInit();
    } 

    

} 
