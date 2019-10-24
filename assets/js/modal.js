$('.button').click(function(){
    $('#modal-container').removeAttr('class').addClass("one");
    $('body').addClass('modal-active');

    var owl = $('.owl-carousel');
    owl.owlCarousel();
    owl.trigger('to.owl.carousel',[parseInt($(this).attr('id')) - 1,300]);
})

/*
$('#modal-container').click(function(){
    $(this).addClass('out');
    $('body').removeClass('modal-active');
    alert($(this).attr("class"));
});
*/

$(document).mouseup(function(e)
{
    var container = $("#mySlider");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0)
    {
        $('#modal-container').addClass('out');
        $('#modal-container').removeClass('modal-active');
    }
});
