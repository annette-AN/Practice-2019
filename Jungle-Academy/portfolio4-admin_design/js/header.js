//click 할때
$('a').on('click', function(e){
  e.preventDefault();
});

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

$('header').on('click', function(e){
  e.stopPropagation();
});