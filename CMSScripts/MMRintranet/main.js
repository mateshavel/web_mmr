var menuTimeout;
var menuOpen = false;
var searchOpen = false;

$('.search-input').attr('placeholder', 'Hledaný výraz');
$('.js-search-mobile').click(function () {
    searchOpen = true;
    $(this).find('.js-search .search-input').focus();
    $('.header-top').addClass('header-open-search');
});

$('.js-search-mobile-close').click(function () {
    searchOpen = false;
    $('.header-top').removeClass('header-open-search');
});

$('.js-menu-mobile-close').click(function () {
    menuOpen = false;
    $('body').removeClass('open-menu');
    $('.header-top').removeClass('header-open-menu');
});

$('.js-menu-mobile').click(function () {
    menuOpen = !searchOpen && !menuOpen;
    searchOpen = false;

    if (menuOpen) {
        $('body').addClass('open-menu');
        $('.header-top').addClass('header-open-menu');
    }
    $('.header-top').removeClass('header-open-search');
});

$('.js-menu-open').click(function () {
    if (!$(this).next().hasClass('submenu-open')) {
        $(this).next().addClass('submenu-open');
        return false;
    }
});

$('.js-menu-close').click(function () {
    $(this).closest('.submenu-open').removeClass('submenu-open');
});

function mobileInit() {
    if ($(window).width() > 992) {
        $('.header-open-menu').removeClass('header-open-menu');
    }
    if ($(window).width() > 750) {
        $(".mobile-carousel").trigger("destroy");
        $('.js-mobile-slider').removeClass('mobile-carousel');
        $('.js-mobile-slider').attr('style', '');
        $('.js-mobile-slider .item').attr('style', '');

    } else {
        // Mobile Slider
        if (($('.js-mobile-slider')).length) {
            $('.js-mobile-slider').addClass('mobile-carousel');
            setTimeout(function () {
                $('.mobile-carousel').carouFredSel({
                    width: '100%',
                    scroll: 1,
                    auto: false,
                    prev: '.prevslider',
                    next: '.nextslider',
                });
            }, 1000);
        }
        $('.js-create-tr').after('</tr><tr>');
    }
}

function menuMouseOver(object) {
    var $menuStroke = $('.menu-stroke');
    clearTimeout(menuTimeout);
    $menuStroke.css('width', $(object).width());
    $menuStroke.css('transform', 'translate3d(' + (($(object).offset().left + 16) - $(object).closest('.items').offset().left) + 'px, 0, 0)');
    $menuStroke.css('visibility', 'visible');
}

function menuMouseOut(object) {
    var $menuStroke = $('.menu-stroke');
    var menuSelected = $('.menu .items > li.active').length;
    if (menuSelected > 0) {
        $menuStroke.css('width', $('.menu .items > li.active').width());
        $menuStroke.css('transform', 'translate3d(' + (($('.menu .items > li.active').offset().left + 16) - $('.menu .items > li.active').closest('.items').offset().left) + 'px, 0, 0)');
        $menuStroke.css('visibility', 'visible');
    } else {
        $menuStroke.css('visibility', 'hidden');
    }
}

function scrollTheTopInit() {
    if ($(this).scrollTop() > 300) {
        $('.scrollTheTop').fadeIn();
    } else {
        $('.scrollTheTop').fadeOut();
    }
}

// filtr kalendar akce
function ajaxLoadCalendar(date, object, reset) {
    $('.js-ajax-loading').show();
    var $this = object;
    $('.old-items').empty();
    $('.js-target-data-k').empty();
    setTimeout(function () {
        var source = $this.attr('data-source-class');
        if ($this.attr('data-source-class')) {
            var $target = $("." + source);
        } else {
            var $target = $('.js-target-data-k');
            source = "js-target-data-k";
        }

        var filter = "&date=" + date;
        var allitems = $this.attr('data-items');
        if (reset) page = $target.attr('data-page', 1);
        var page = $target.attr('data-page');
        var items = $target.attr('data-repeat-items');
        var url = $target.attr('data-source-url');
        var path = $target.attr('data-source');
        $.ajax({ method: "GET", url: url + "?page=" + page + "&items=" + items + "&path=" + path + filter }).done(function (result) {
            var $s = $(result).find('.js-source-data-k').children('div.item');
            if ((page * items) < allitems) {
                $this.show();
                $('.js-count-k').find('span').text('1-' + page * items);
            } else {
                $('.js-count-k').find('span').text('1-' + allitems);
            }
            $('.js-ajax-loading').hide();
            $target.append($s);
        });
        $target.attr('data-page', parseInt(page) + 1);
    }, 100);
}

// filtr proběhlé/nadcházející akce
function ajaxLoadByDateAction(object, reset) {
    $('.js-ajax-loading').show();
    var $this = object;
    //$('.old-items-a').hide();
    $('.js-target-data-by-date').empty();
    $('.js-target-data-a').empty();
    setTimeout(function () {
        var source = $this.attr('data-source-class');
        if ($this.attr('data-source-class')) {
            var $target = $("." + source);
        } else {
            var $target = $('.js-target-data-by-date');
            source = "js-target-data-by-date";
        }
        var date = $('.action-by-date').attr('attr-date');
        var sort;
        if ($('.action-by-date.previous.active').length===1) {
            var dateTo = date;
            sort = 1;
        } else {
            var dateFrom = date;
            sort = 2;
        };
        if (dateTo === undefined) {
            dateTo = 0;
        };
        if (dateFrom === undefined) {
            dateFrom = 0;
        };

        var filter = "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&sort=" + sort;
        var allitems = $this.attr('data-items');
        if (reset) page = $target.attr('data-page', 1);
        var page = $target.attr('data-page');
        var items = $target.attr('data-repeat-items');
        var url = $target.attr('data-source-url');
        var path = $target.attr('data-source');
        $.ajax({ method: "GET", url: url + "?page=" + page + "&items=" + items + "&path=" + path + filter }).done(function (result) {
            var $s = $(result).find('.js-source-data-a').children('div.item');
            if ((page * items) < allitems) {
                $this.show();
                $('.js-count-a').find('span').text('1-' + page * items);
            } else {
                $('.js-count-a').find('span').text('1-' + allitems);
            }
            $('.js-ajax-loading').hide();
            $target.append($s);
        });
        $target.attr('data-page', parseInt(page) + 1);
    }, 100);
}

//načítání akcí
function ajaxLoadInitA(object, reset) {
    $('.js-ajax-loading').show();
    var $this = object;
    $this.hide();
    $('.js-target-data-a').empty();
    $('.js-target-data-a').fadeIn();
    $('.js-target-data-by-date').empty();
    setTimeout(function () {
        var source = $this.attr('data-source-class');
        if ($this.attr('data-source-class')) {
            var $target = $("." + source);
        } else {
            var $target = $('.js-target-data-a');
            source = "js-target-data-a";
        }
        var category = $('.js-filter-category').val();
        var actions = $('.js-filter-action').val();
        var year = $('.js-filter-year-a').val();
        var sort = $('.js-filter-sort-a .active').attr('data-sort');
        if ((actions === undefined) || (actions === "")) {
            actions = 0;
        }
        if ((category === undefined) || (category === "")) {
            category = 0;
        }
        var filter = "&actions=" + actions + "&category=" + category + "&year=" + year + "&sort=" + sort;
        var allitems = $this.attr('data-items');
        if (reset) page = $target.attr('data-page', 1);
        var page = $target.attr('data-page');
        var items = $target.attr('data-repeat-items');
        var url = $target.attr('data-source-url');
        var path = $target.attr('data-source');
        $.ajax({ method: "GET", url: url + "?page=" + page + "&items=" + items + "&path=" + path + filter }).done(function (result) {
            var $s = $(result).find('.js-source-data-a').children('div.item');
            if ((page * items) < allitems) {
                $this.show();
                $('.js-count-a').find('span').text('1-' + page * items);
            } else {
                $('.js-count-a').find('span').text('1-' + allitems);
            }
            $('.js-ajax-loading').hide();
            $target.append($s);
        });
        $target.attr('data-page', parseInt(page) + 1);
    }, 100);
}

//načítání novinek
function ajaxLoadInit(object, reset) {
    $('.js-ajax-loading').show();
    var $this = object;
    $this.hide();
    setTimeout(function () {
        var source = $this.attr('data-source-class');
        if ($this.attr('data-source-class')) {
            var $target = $("." + source);
        } else {
            var $target = $('.js-target-data');
            source = "js-target-data";
        }
        var category = $('.js-filter-category').val();
        var year = $('.js-filter-year').val();
        var sort = $('.js-filter-sort .active').attr('data-sort');
        var filter = "&category=" + category + "&year=" + year + "&sort=" + sort;
        var allitems = $this.attr('data-items');
        if (reset) page = $target.attr('data-page', 1);
        var page = $target.attr('data-page');
        var items = $target.attr('data-repeat-items');
        var url = $target.attr('data-source-url');
        var path = $target.attr('data-source');
        $.ajax({ method: "GET", url: url + "?page=" + page + "&items=" + items + "&path=" + path + filter }).done(function (result) {
            var $s = $(result).find('.js-source-data').children('div.item');
            if ((page * items) < allitems) {
                $this.show();
                $('.js-count').find('span').text('1-' + page * items);
            } else {
                $('.js-count').find('span').text('1-' + allitems);
            }
            $('.js-ajax-loading').hide();
            $target.append($s);
        });
        $target.attr('data-page', parseInt(page) + 1);
    }, 100);
}

$(document).ready(function () {
    console.log('ready');
    // Fancybox
    $(".js-fancybox").fancybox({
        openEffect: 'none',
        closeEffect: 'none',
        type: 'image'
    });

    // Slider
    if (($('.js-slider')).length) {
        setTimeout(function () {
            $('.js-slider').carouFredSel({
                width: '100%',
                scroll: 1,
                auto: false,
                prev: '.prevslider',
                next: '.nextslider',
            });
        }, 1000);
    }

    $('.js-button-more').click(function () {
        ajaxLoadInit($(this), false);
        return false;
    });

    $('.js-button-more-a').click(function () {
        ajaxLoadInitA($(this), false);
        return false;
    });

    $('.js-calendar-day').click(function (event) {
        event.preventDefault();
        var date = $(this).data('date');
        ajaxLoadCalendar(date, $(this), false);
        return false;
    });

    $('.action-by-date.previous').click(function () {
        $(this).addClass('active');
        ajaxLoadByDateAction($(this), false);
        return false;
    });
    $('.action-by-date.next').click(function () {
        $(this).addClass('active');
        ajaxLoadByDateAction($(this), false);
        return false;
    });

    $('.js-filter-sort a').click(function () {
        $('.js-filter-sort a').removeClass('active');
        $(this).addClass('active');
        $('.js-target-data').html('');
        $('.js-button-more').hide();
        ajaxLoadInit($('.js-button-more'), true);
    });

    $('.js-filter-sort-a a').click(function () {
        $('.js-filter-sort-a a').removeClass('active');
        $(this).addClass('active');
        $('.js-target-data-a').html('');
        $('.js-button-more-a').hide();
        ajaxLoadInitA($('.js-button-more-a'), true);
    });

    $('.js-filter-advanced a').click(function () {
        var status = $(this).attr('data-status');
        $(this).closest('.js-filter-advanced').find('a').addClass('active');
        $(this).removeClass('active');
        if (status) {
            $('.js-filter-advanced-items').hide();
        } else {
            $('.js-filter-advanced-items').show();
        }
        return false;
    });

    $('.js-filter').click(function () {
        $('.js-target-data').html('');
        $('.js-button-more').hide();
        ajaxLoadInit($('.js-button-more'), true);
        return false;
    });

    $('.js-filter-a').click(function () {
        $('.js-target-data-a').html('');
        $('.js-button-more-a').hide();
        ajaxLoadInitA($('.js-button-more-a'), true);
        return false;
    });

    $(".customDdl").msDropdown({
        roundedCorner: false,
        addTopToUl: true,
        attributeOptionText: "data-text",
        mainCSS: "",
        rowHeight: 26
    });

    $('.ddTitle').on('click', function () {
        $('.ddOpen').each(function () {
            $(this).removeClass('ddOpen');
            $(this).parent().find('.ddChild').css('z-index', '1');
            $(this).parent().find('.ddChild').css('display', 'none');
        });
    });

    $('.menu .items > li').mouseover(function () {
        menuMouseOver(this);
    });
    $('.menu .items > li').mouseout(function () {
        menuTimeout = setTimeout(function () {
            menuMouseOut(this);
        }, 200);
    });

    $('img.svg').each(function () {
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
        $.get(imgURL, function (data) {
            var $svg = jQuery(data).find('svg');
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }
            $svg = $svg.removeAttr('xmlns:a');
            $img.replaceWith($svg);
        }, 'xml');
    });

    // Scroll the top or anchor
    $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function (event) {
        if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function () {
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) {
                        return false;
                    } else {
                        $target.attr('tabindex', '-1');
                        $target.focus();
                    };
                });
            }
        }
        return false;
    });

    menuMouseOut();
    mobileInit();
    scrollTheTopInit();
});

$(window).resize(function () {
    menuMouseOut();
    mobileInit();
    scrollTheTopInit();
});

$(window).scroll(function () {
    scrollTheTopInit();
});
