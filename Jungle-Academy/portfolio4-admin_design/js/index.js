//click 할때
  //일부에서 튐
$(document).on('click', 'a[href="#"]', function(e){
  e.preventDefault();
});

//header js
$('.menu-bar').on('click', function(){
  var width = window.innerWidth;
  console.log(width);

  if (width < 767) {
    console.log('width767');
    if ($('#main-gnb').hasClass('open')) {
      $('#main-gnb').removeClass('open','');
      $('main').css({'left': 0 + 'px'});
    } else {
      $('#main-gnb').addClass('open','');
      $('main').css({'left': 50 + 'px'});
    }
  } else {
    if ($('header').hasClass('open')) {
      $('header').removeClass('open','');
    } else {
      $('header').addClass('open','');
    }

    if ($('.main-gnb-menu > li > ul').hasClass('show')) {
      $('ul').removeClass('show');
    }
  }
});

$('.user-info > li > a').on('click', function(){
  $('.user-info > li ul').toggleClass('on');
});

$('.main-gnb-menu > li > a').on('click', function(){
  if ($(this).next('ul').hasClass('show')) {
    $('ul').removeClass('show');
  } else {
    $('ul').removeClass('show');
    $(this).next('ul').toggleClass('show');
  }
});

  //header가 open일 때 다른 영역을 클릭하면 자동닫힘
$(document).on('click', function(){
  $('header').removeClass('open','');
});

$(document).on('click', 'header.open', function(e){
  e.stopPropagation();
});

//main js

var animateSpeed = 1000;
var delay = 3000;

setInterval(function(){joingBoardEffect('.joing-board li:eq(0)', 0, animateSpeed)}, 5000);
setInterval(function(){joingBoardEffect('.joing-board li:eq(1)', 500, animateSpeed)}, 6000);
setInterval(function(){joingBoardEffect('.joing-board li:eq(2)', 1000, animateSpeed)}, 7000);
setInterval(function(){joingBoardEffect('.joing-board li:eq(3)', 100, animateSpeed)}, 5200);

function joingBoardEffect(selector, startDelay, animateSpeed) {
  $(selector).find('div:eq(0)').delay(startDelay).animate({'top': -100 + '%'}, animateSpeed, function(){
    $(this).css({'top': 100 + '%'});
    $(this).delay(delay).animate({'top': 0 + '%'}, animateSpeed);
  });

  $(selector).find('div:eq(1)').delay(startDelay).animate({'top': 0 + '%'}, animateSpeed).delay(delay).animate({'top': -100 + '%'}, animateSpeed, function(){
      $(this).css({'top': 100 + '%'});
  });
}


  //왜 첫번째 li만 적용되는지 모르겠음

  // $('.joing-board li div:eq(1)').animate({'top': 0 + '%'}, 500);
  // $('.joing-board li div:eq(0)').animate({'top': -100 + '%'}, 500, function(){
  //   $(this).css({'top': 100 + '%'});
  // });