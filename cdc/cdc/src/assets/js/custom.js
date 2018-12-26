$(document).ready(function(){
    $('.things').slick({
        dots:true,
        arrows:false,
        autoplay:true,
        autoplaySpeed:2000,
    });

    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });
    $( '.js-input' ).keyup(function() {
        if( $(this).val() ) {
           $(this).addClass('not-empty');
        } else {
           $(this).removeClass('not-empty');
        }
      });

     var offset= 60;
     var duration =500;

     $(window).scroll(function(){
        if($(this).scrollTop() > offset){
            $('.js-top').fadeIn(3000);
        }
        else{
            $('.js-top').fadeOut(duration);
        }
     });
     $('.js-top').click(function(){
         $('body').animate({scrollTop:0},1000);
     });

     var loaderPage = function() {
		$(".colorlib-loader").fadeOut(3000);
    };
    $(function(){
		loaderPage();
	});
      


});