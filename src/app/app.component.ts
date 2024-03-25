import { Component, OnInit } from '@angular/core';

declare var $:any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    title = 'nvip-frontend';
    ngOnInit(): void {



        var addClassOnScroll = function () {
            var windowTop = $(window).scrollTop();
            $('.weakness_element').each(function () {
                var offsetTop = $(this).offset().top;
                var outerHeight = $(this).outerHeight(true);
                if( windowTop > (offsetTop-200) && windowTop < ( offsetTop + outerHeight)) {
                    var elemId = $(this).attr('id');
                    $("li").removeClass('active');
                    $("#list_"+elemId).parent().addClass('active');
                    return;
                }
            });
        };

        $(function () {
            $(window).on('scroll', function () {
                addClassOnScroll();
            });
        });

        
        $(document.body).on('click', '.show-hide' ,function(){
            var id:string=$(this).attr('id')
            $(this).toggleClass('text-danger');
            $('#'+id +' i').toggleClass('fa-eye')
            var targetBug=id.replace('show_hide_','');
            $('#'+id +' i').toggleClass('fa-eye-slash');
            $('#'+targetBug).toggleClass('d-none');
            addClassOnScroll();
        });

        $(document.body).on('click', '.scrol-to-id' ,function(){
            var id:string=$(this).attr('id').replace('list_','#');
            $('html, body').animate({
                scrollTop: $(id).offset().top
            }, 250);
        });
    }
}
