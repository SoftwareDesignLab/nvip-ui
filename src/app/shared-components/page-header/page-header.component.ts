import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent implements OnInit {
  @Input() leftTitle: string = "Vulnerabilities";
  @Input() rightTitle:string="";
  @Input() icon: string = "fa-list";
  constructor(private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    $(document).ready(function () {
      $("#right-sidebar-collapse").on("click", function () {
        $(".right-sidebar").toggleClass("active");
        $(".contents").toggleClass("blur");
        $("#right-sidebar-collapse i").toggleClass("fa-flip-horizontal");
      });
      $("#left-sidebar-collapse").on("click", function () {
        $(".left-sidebar").toggleClass("active");
        $("#left-sidebar-collapse i").toggleClass("fa-flip-horizontal");
      });

      $(".close-sidebar-button").on("click", function () {
        $(".right-sidebar").removeClass("active");
        $(".left-sidebar").removeClass("active");
        $(".contents").removeClass("blur");
      })
    })
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges(); // Trigger a change detection cycle
    });
  }
}
