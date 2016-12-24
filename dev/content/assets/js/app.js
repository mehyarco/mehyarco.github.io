(function($){
    $(document).ready(function() {

        var menu_type = 'menu';

        $('.block.link.soon').tinytip({

            position : 'bottom',
            animation : {
                top: +10
            },
            tooltip : "Coming Soon",
            // content : $('.drop-menu'),
            fix : {
                top: -100,
                left: -100
            },
            speed : 100,
            on : 'click',
            preventClose : true,
            onLoad : function(e){
                //e.text('lool');
            },
            //off: 'click'
        });

        $(".fixed-menu-button").click(function(){

            $('.fixed-overlay').show().animate({
                opacity : '0.6'
            }, 250);

            $('.fixed-menu').css({
                // height : $(window).height() + "px"
            }).animate({
                right : 0
            }, 250);
        });

        $(".fixed-menu-button-close, .fixed-overlay").click(function(){
            if (menu_type === 'contact_us'){
                $('.text.menu').text('MENU');
                $('.menu_list').show();
                $('.contact_us').hide();
                menu_type = 'menu';
                return false;
            }

            $('.text.menu').text('MENU');
            $('.menu_list').show();
            $('.contact_us').hide();

            $('.fixed-overlay').animate({
                opacity : '0'
            }, 250, function(){
                $(this).hide();
            });

            $('.fixed-menu').css({
                // height : $(window).height() + "px"
            }).animate({
                right : '-250px'
            }, 250);
        });

        $('.active a, .disabled a').click(function(){
        	return false;
        });

        $('#contact_us').click(function(){
            menu_type = 'contact_us';

            $('.menu_list').fadeOut(150, function(){
                $('.contact_us').fadeIn(100, function(){
                    $('.text.menu').text('CONTACT US');
                });
            });

            return false;
        });
    });
}(jQuery));
