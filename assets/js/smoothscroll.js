$('.js-anchor-link').click(function(e){
    e.preventDefault();
    var target = $($(this).attr('href'));
    if(target.length){
        var addoffset = 0;
        if($(this).attr('href') != "#home" && $(document).scrollTop()<=100){
            addoffset = 22;
        }
        var scrollTo = target.offset().top - $(".header-main").outerHeight(true) + addoffset;
        $('body, html').animate({scrollTop: scrollTo+'px'}, 800);
    }
});