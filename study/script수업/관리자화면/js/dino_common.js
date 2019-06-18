// JavaScript Document

// a[href="#"] 상단 튐 방지
function preventDefaultA() {
    $(document).on('click', 'a[href="#"]', function(e) {
        e.preventDefault();
    });
}

// 현재 메뉴에 on 표시 (GNB 태그에 따라 수정)
function checkCurrentMenu() {
    // 메뉴 키워드 식별 (menuName[1], menuName[2], menuName[3])
    var menuName = $('body').attr('class').split(' ');
    if (menuName[0] !== 'sub') return false; // sub로 시작하지 않으면 취소 (main 화면은 미적용)
    $('#gnb h3').each(function() {
        if (menuName[1] === $(this).attr('data-menu')) {
            $(this).addClass('on');
        }
    });
    $('#gnb h3.on + ul.nav > li').each(function() {
        if (menuName[2] === $(this).attr('data-menu')) {
            $(this).addClass('on');
        }
    });
    $('#gnb h3.on + ul.nav > li.on > ul > li').each(function() {
        if (menuName[3] === $(this).attr('data-menu')) {
            $(this).addClass('on');
        }
    });
}

// GNB UI (관리자용)
function adminGNBUI() {
    if ($('#gnb').length !== 1) return false;
    var initialHeight = 0; // 초기 메뉴 높이
    var myScroll = null;
    
    // 서브메뉴 표시 및 열기
    $('#gnb ul.nav > li').each(function() {
        if ($(this).find('ul').length > 0) {
            $(this).find('> a').append('<span class="fontawesome"><i class="fas fa-chevron-down"></i></span>');
        }
    });
    $('#gnb ul.nav > li.on > a > em + span.fontawesome').addClass('open');
    $('#gnb ul.nav > li.on > ul > li').each(function(i) {
        initialHeight += $(this).outerHeight();
    });
    $('#gnb ul.nav > li.on > ul').css({'height': (initialHeight + 15) + 'px'});
    setTimeout(function() {
        myScroll = applyIScroll('#gnb');
        //myScroll.scrollToElement($('#gnb ul.nav > li.on')[0], 500);
    }, 300);
    
    // 대메뉴 표시
    $('#gnb ul.nav > li > a[href="#"]').on('click', function() {  // 서브메뉴가 있는 요소만 해당 (없으면 링크 이동)
        var menuHeight = $(this).next().outerHeight();
        var newHeight = 0;
        // 현재메뉴 열기
        if (menuHeight > 0) {  // 열린상태
            $(this).next().css({'height': 0});
            $(this).find('em + span.fontawesome').removeClass('open');
        } else {
            $(this).next().find('> li').each(function(i) {
                newHeight += $(this).outerHeight();
            });
            $(this).next().css({'height': newHeight + 'px'});
            $(this).find('em + span.fontawesome').addClass('open');
        }
        setTimeout(function() {myScroll.refresh();}, 200);
    });
    
    $('#gnb').on('mouseleave', function() {
        $('#gnb ul.nav > li:not(.on) > ul').css({'height': 0});
        $('#gnb ul.nav > li:not(.on) > a em + span.fontawesome').removeClass('open');
        setTimeout(function() {
            myScroll.refresh();
            //myScroll.scrollToElement($('#gnb ul.nav > li.on')[0], 500);
        }, 300);
    });
    
    // 레이아웃 변경
    $('#header a.toggle').on('click', function() {
        $('#header, #gnb, body.sub #main, #footer').toggleClass('off');
        // 차트크기 조정필요
        //setTimeout(function() {google.charts.setOnLoadCallback(drawChart);}, 300);
    });
}

function applyIScroll(selector) {
    var myScroll = new IScroll(selector, {
        snap: false,
        click: true,
        mouseWheel: true,
        scrollbars: true,
        fadeScrollbars: true,
        interactiveScrollbars: true,
        resizeScrollbars: true,
        shrinkScrollbars: 'scale',
        scrollX: false,
        scrollY: true
    });
    return myScroll;  // 해당 iScroll 객체를 리턴
}

function openPopup(url, name, width, height, top, left) {  // 앞의 4개 파라미터 필수, left/top 선택(없으면 0)
    if (top === undefined) top = 0;
    if (left === undefined) left = 0;
    window.open(url, name, 'toolbar = no, scrollbars = yes, resizable = no, menubar = no, status = no, titlebar = no, top = ' + top + ', left = ' + left + ', width = ' + width + ', height = ' + height);
}


// 특정 요소가 배열 내 존재하는지 검사(데이터 타입까지 일치하는지 확인) / 존재하면 배열 index, 존재하지 않으면 -1 return.
function checkInArray(el, arr) {
    var result = -1;
    for (var i = 0; i < arr.length; i++) {
        if (el === arr[i]) return i;
    }
    return result;
}

// 천단위 콤마 표시(문자열)
function numberWithCommas(num) {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

