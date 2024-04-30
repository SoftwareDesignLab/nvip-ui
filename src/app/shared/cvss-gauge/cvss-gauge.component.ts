import { Component, Input } from '@angular/core';

export enum ChartType {
    AnnotationChart = 'AnnotationChart',
    AreaChart = 'AreaChart',
    Bar = 'Bar',
    BarChart = 'BarChart',
    BubbleChart = 'BubbleChart',
    Calendar = 'Calendar',
    CandlestickChart = 'CandlestickChart',
    ColumnChart = 'ColumnChart',
    ComboChart = 'ComboChart',
    PieChart = 'PieChart',
    Gantt = 'Gantt',
    Gauge = 'Gauge',
    GeoChart = 'GeoChart',
    Histogram = 'Histogram',
    Line = 'Line',
    LineChart = 'LineChart',
    Map = 'Map',
    OrgChart = 'OrgChart',
    Sankey = 'Sankey',
    Scatter = 'Scatter',
    ScatterChart = 'ScatterChart',
    SteppedAreaChart = 'SteppedAreaChart',
    Table = 'Table',
    Timeline = 'Timeline',
    TreeMap = 'TreeMap',
    WordTree = 'wordtree',
}

@Component({
    selector: 'app-cvss-gauge',
    templateUrl: './cvss-gauge.component.html',
    styleUrl: './cvss-gauge.component.scss',
})
export class CvssGaugeComponent {
    @Input() score:number=0;
    title = 'CVSS V3.0';

    // Chart configuration
    type = ChartType.Gauge;
    ngOnInit(): void {
        this.data=[
            ['Base', this.score],
        ]
    }
    data = [
        ['Base', this.score],
    ];
    columnNames = ['Label', 'Value'];
    options = {
        width: 400,
        height: 160,
        redFrom: 7.0, redTo: 10,
        yellowFrom: 4.0, yellowTo: 7.0,
        greenFrom:0, greenTo: 4.0,
        minorTicks: 6, max: 10,
    };
}
