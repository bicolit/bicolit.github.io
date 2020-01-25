$(document).on("scroll", function() {
    scrollTopNav();
});

function scrollTopNav(){
    if($(document).scrollTop()>100) {
        $("#header-fix").removeClass("header-inner");
        $("#site-logo").addClass("site-logo-small");
    } else {
        $("#header-fix").addClass("header-inner");
        $("#site-logo").removeClass("site-logo-small");
    }
}

var sections = $('section')
, nav = $('nav')
, nav_height = nav.outerHeight();
$(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop();

    sections.each(function() {
        var top = $(this).offset().top - nav_height,
        bottom = top + $(this).outerHeight();

        if (cur_pos >= top && cur_pos <= bottom) {
            nav.find('a').removeClass('active');
            sections.removeClass('active');

            $(this).addClass('active');
            nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
        }
    });
});

$(document).ready(function() { scrollTopNav(); $("#header-fix").addClass("header-inner-animation"); $("#site-logo").addClass("site-logo-animation");  });