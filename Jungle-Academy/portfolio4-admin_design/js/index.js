//click 할때
  //일부에서 튐
$(document).on('click', 'a[href="#"]', function(e){
  e.preventDefault();
});

//header js
$('.menu-bar').on('click', function(){
  if ($('header').hasClass('open')) {
    $('header').removeClass('open','');
  } else {
    $('header').addClass('open','');
  }

  if ($('.main-gnb-menu > li > ul').hasClass('show')) {
    $('ul').removeClass('show');
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

setInterval(joingBoardEffect);

function joingBoardEffect() {
}

  //왜 첫번째 li만 적용되는지 모르겠음
$('.joing-board li div:eq(1)').animate({'top': 0 + '%'}, 500);
$('.joing-board li div:eq(0)').animate({'top': -100 + '%'}, 500, function(){
   $(this).css({'top': 100 + '%'});
});