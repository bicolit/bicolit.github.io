jQuery(function($) {

    /* -- WINDOW WIDTH CHECK --*/

        /*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (coffee) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */
        window.matchMedia||(window.matchMedia=function(){var b=(window.styleMedia||window.media);if(!b){var c=document.createElement("style"),a=document.getElementsByTagName("script")[0],d=null;c.type="text/css";c.id="matchmediajs-test";a.parentNode.insertBefore(c,a);d=("getComputedStyle" in window)&&window.getComputedStyle(c,null)||c.currentStyle;b={matchMedium:function(e){var f="@media "+e+"{ #matchmediajs-test { width: 1px; } }";if(c.styleSheet){c.styleSheet.cssText=f}else{c.textContent=f}return d.width==="1px"}}}return function(e){return{matches:b.matchMedium(e||"all"),media:e||"all"}}}());

        var media_queries = {
            tablet: window.matchMedia('(min-width:768px) and (max-width: 991px)'),
            mobile: window.matchMedia('(max-width:767px)')
        }

        function refreshMediaQueries() {
            media_queries.tablet = window.matchMedia('(min-width:768px) and (max-width: 991px)');
            media_queries.mobile = window.matchMedia('(max-width:767px)');
        }

        function isSmall() { return media_queries.mobile.matches; }
        function isMedium() { return media_queries.tablet.matches; }
        function isXLarge() { return (!media_queries.tablet.matches && !media_queries.mobile.matches); }

        jQuery(function($) {
            $(window).on('resize', refreshMediaQueries());
        });



    "use strict";

    var intent_theme = {};


    // Mobile nav menu
    intent_theme.mobile_nav_menu = function(){

        /* -- nav menu button click -- */
        $( '#mobile-nav-button' ).click(function(e) {
            e.preventDefault();

            $('#mobile-nav-button').toggleClass('active');

            $('#site-header,#header-nav,#main-content,.header-inner,footer').toggleClass('menu-active');

        });


        /* -- mobile drop down menu(s) -- */
        $('.sub-drop-icon').on('click', function(e) {

            e.preventDefault();

            if(!isXLarge()) {
                if (!$(this).hasClass('sub-second-drop')){
                    // first level drop down
                    $(this).parents('.menu-item').find('> .sub-menu-first').slideToggle(250).toggleClass('opened');
                } else {
                    // second level drop down
                    $(this).parents('.menu-item').find('> .sub-second-tier').slideToggle(250).toggleClass('opened');
                }

                $(this).toggleClass('fa fa-angle-down fa fa-angle-up');

            }

        });


        // close the mobile push menu when click on content
        $('#main-content,footer').on('click', function() {

            // check if push menu is open
            if($('#mobile-nav-button').hasClass('active')){
                // hide the push menu
                $('#header-nav,#main-content,.header-inner,footer').removeClass('menu-active');
                $('#mobile-nav-button').removeClass('active');
            }

        });

    }


    // Theme slideshows
    intent_theme.slideshows = function(){

        if ($.fn.owlCarousel) {

            if($('.carousel .featured-slide,.carousel .testimonial-slide,.carousel .post-slide').length > 1) {

                $('.carousel').each(function() {

                    var slideshow_id = this.id;
                    var slideshow_autoplay = $(this).attr('data-autoplay');

                    if(slideshow_autoplay == "true"){
                        var carousel_auto = true;
                        var carousel_speed = $(this).attr('data-autoplay-speed');
                    }

                    if($(this).attr('data-animation-in')){
                        var animation_in = $(this).attr('data-animation-in');
                    }

                    if($(this).attr('data-animation-out')){
                        var animation_out = $(this).attr('data-animation-out');
                    }


                    $('#'+slideshow_id).owlCarousel({
                        autoplay:carousel_auto,
                        autoplayTimeout:carousel_speed,
                        autoplayHoverPause:true,
                        animateIn: animation_in,
                        animateOut: animation_out,
                        items: 1,
                        margin: 0,
                        navigation: true,
                        loop: true,
                    });

                });

            }

            $('.previous-slide-btn').on('click', function() {
                $(this).closest('.carousel-outer').find('.owl-carousel').trigger('prev.owl.carousel');
            });

            $('.next-slide-btn').on('click', function() {
                $(this).closest('.carousel-outer').find('.owl-carousel').trigger('next.owl.carousel');
            });

        }

    }


    // Contact map
    intent_theme.contact_map = function(){

        if($( "#contact-map-container" ).length) {

            /* Change coordinates below to your desired location */
            var lat_lng = '51.5286416,-0.1015987'.split(',');

            // Create an array of styles.
            var styles=[{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];

            var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

            var mapOptions = {
                center: new google.maps.LatLng(lat_lng[0], lat_lng[1]),
                /* Level of zoom */
                zoom: 12,
                disableDefaultUI: false,
                scrollwheel: false,
                zoomControl: true,
                mapTypeControlOptions: {
                  mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                }
            };

            var map = new google.maps.Map(document.getElementById("contact-map"), mapOptions);

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat_lng[0], lat_lng[1]),
                clickable: false,
                map: map,
                title: 'Lucid Themes',
                icon: {
                    url: 'assets/img/map_pin.png',
                    size: new google.maps.Size(27, 37)
                }
            });

            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');

        }

    }


    // Isotope filter
    intent_theme.isotope = function(){

        if ($.fn.isotope) {

            $(window).load(function() {

                var data_layout = $('#portfolio-items').data('layout-style');

                if(data_layout == "masonry"){
                    var layout_mode = "packery";
                } else {
                    var layout_mode = "fitRows";
                }

                $('#portfolio-items').isotope({
                    itemSelector: '[class^=col-]',
                    layoutMode: layout_mode,
                    resizable: false,
                });

                $(function() {

                    var $container = $('#portfolio-items').isotope({
                        itemSelector: '.portfolio-item'
                    });

                    // hash of functions that match data-filter values
                    var filterFns = {
                        // show if number is greater than 50
                        numberGreaterThan50: function() {
                        var number = $(this).find('.number').text();
                        return parseInt( number, 10 ) > 50;
                        },
                        // show if name ends with -ium
                        ium: function() {
                        var name = $(this).find('.name').text();
                        return name.match( /ium$/ );
                        }
                    };

                    // filter items on button click
                    $('#portfolio-item-filter').on( 'click', 'a', function(e) {
                         e.preventDefault();
                        var filterValue = $(this).attr('data-filter');
                        // use filter function if value matches
                        filterValue = filterFns[ filterValue ] || filterValue;
                        $container.isotope({ filter: filterValue });
                    });

                    // change active class on buttons
                    $('#portfolio-item-filter').each(function(i, filterbutton) {
                        var $filterbutton = $(filterbutton);
                        $filterbutton.on('click', 'a', function() {
                            $filterbutton.find('.active').removeClass('active');
                            $(this).addClass('active');
                        });
                    });

                });

            });

        }

    }


    // Scroll top
    intent_theme.scroll_top = function(){

        $(window).scroll(function(){
            if($(document).scrollTop() > 50){
                $('#scroll-top').fadeIn(500);
            } else {
                $('#scroll-top').fadeOut(500);
            }
        });

        $('#scroll-top').on('click', function(e) {
            $('html,body').animate({ scrollTop: 0 }, 500);
            e.preventDefault();
        });

    }


    intent_theme.mobile_nav_menu(); // Mobile nav menu
    intent_theme.slideshows(); // Slideshows
    intent_theme.contact_map(); // Contact map
    intent_theme.scroll_top(); // Scroll top
    intent_theme.isotope(); // Isotope plugin




    /* -- This function is used for the theme feature page ONLY and can be removed if wanted. This is used to showcase the slideshows animation effects and autoplay options. -- */

    intent_theme.feature_slideshow = function(){

        function feature_slideshow(autoplay){

            if ($.fn.owlCarousel) {

                var owl = $('#feature-slideshow');

                owl.trigger('destroy.owl.carousel');

                owl.html(owl.find('.owl-stage-outer').html()).removeClass('owl-loaded');

                var animIn = $( "#slideshow-animation-in" ).val();
                var animOut = $( "#slideshow-animation-out" ).val();

                var slideshow_options = {
                    autoplay:autoplay,
                    autoplayTimeout:2000,
                    autoplayHoverPause:true,
                    animateIn: animIn,
                    animateOut: animOut,
                    items: 1,
                    margin: 0,
                    navigation: true,
                    loop: true,
                };

                owl.owlCarousel(slideshow_options);

            }

        }

        feature_slideshow(false);

        $('.slideshow-animation-select').on('change', function() {
            var autoplay = false;

            if($('#feature-autoplay').hasClass('active')){
                autoplay = true;
            }
            feature_slideshow(autoplay);
        });

        $('#feature-autoplay').on('click', function() {

            $(this).toggleClass('active');

            if($(this).hasClass('active')){
                $(this).text("Autoplay: on");
                feature_slideshow(true);
            } else {
                $(this).text("Autoplay: off");
                feature_slideshow(false);
            }

        });

    }

    intent_theme.feature_slideshow();


});