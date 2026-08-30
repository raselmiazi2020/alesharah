if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) 
{
   $(".banner").css({
        'height': ($("body").height() - $("header").height() + 'px' ) 
    });
	$(".about-content").css({
        'height': ($("body").height() / 2 - 40 + 'px' ) 
    });
    $('.client-section .heading, .at-glance h1, .intro-txt h1').css({'-webkit-text-fill-color':'#00A0AF'});
    $('.mission,.about-content').css({'background-attachment':'scroll'});
}


$('.industries-carousel,.news-carousel,.company-carousel').owlCarousel({
    items: 1,
    loop: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    nav: true, // Show next and prev buttons
    slideSpeed: 300,
    dots: false,
    paginationSpeed: 400,
    autoplay: true,
    autoplayTimeout: 8000,
    autoplayHoverPause: true,
    singleItem: true,

});

$('.clients-logos').owlCarousel({
    loop:true,
    margin:10,
    nav:false,
	dots:true,
	autoplay:true,
    autoplayTimeout:1000,
    autoplayHoverPause:true,
    responsive:{
        0:{
            items:3,
            dots: false,
            nav: true
        },
        600:{
            items:3
        },
        1200:{
            items:6
        }
    }
});

// WOW
wow = new WOW({
    animateClass: 'animated',
    offset: 100,
    callback: function(box) {}
});
wow.init();
// WOW END

$('a[href^="#"]').click(function(e) {
    if ($(this.hash).length > 0) {
        $('html,body').animate({
            scrollTop: $(this.hash).offset().top - 10
        }, 1000);
        return false;
        e.preventDefault();
    }
});


$('body').css('padding-top', $('header').height());
 
$('.joblist ul li a').click(function(){
    $('.joblist ul li a').removeClass("active")
   $(this).addClass("active")
});


/*----------------- TAB -------------------*/
function applyme(thechosenone) {
    $('.slide-content,.cv-section').each(function(index) {
        if ($(this).attr("id") == thechosenone) {
            $(this).slideDown(400);
        } else {
            $(this).slideUp(400);
        }
    });
}



$('.project-list ul li a,.service-nav ul li a').click(function() {
    $('.project-list ul li a,.service-nav ul li a').removeClass('active');
    $(this).addClass('active');
});

$(window).load(function(){
	  $('#loading').fadeOut(2000);
});

nice = $("html").niceScroll();

(function(e) {
    e.fn.visible = function(t, n, r) {
        var i = e(this).eq(0),s = i.get(0),o = e(window),u = o.scrollTop(),a = u + o.height(),f = o.scrollLeft(),l = f + o.width(),c = i.offset().top,
            h = c + i.height(),p = i.offset().left,d = p + i.width(),v = t === true ? h : c,m = t === true ? c : h,g = t === true ? d : p,y = t === true ? p : d,
            b = n === true ? s.offsetWidth * s.offsetHeight : true,r = r ? r : "both";
        if (r === "both") return !!b && m <= a && v >= u && y <= l && g >= f;
        else if (r === "vertical") return !!b && m <= a && v >= u;
        else if (r === "horizontal") return !!b && y <= l && g >= f
    }
})(jQuery)


// Variables
var wholeWindow = $(window);
var box = $('.figure-img');
// If it is then add a class
wholeWindow.scroll(function() {
    box.each(function(i, obj) {
        if ($(obj).visible(true)) {
            $(obj).addClass('active');
        }       
    }); 
});
