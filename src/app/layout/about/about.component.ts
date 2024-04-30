import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
    ngOnInit(): void {
        $('.marquee_text').marquee({
            direction: 'left',
            duration: 40000,
            gap: 50,
            delayBeforeStart: 0,
            duplicated: true,
            startVisible: true,
        });

        $('.marquee_text3').marquee({
            direction: 'left',
            duration: 25000,
            gap: 50,
            delayBeforeStart: 0,
            duplicated: true,
            startVisible: true,
        });
    }
}
