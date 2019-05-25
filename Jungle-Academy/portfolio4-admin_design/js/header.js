//click 할때
$('a').on('click', function(e){
  e.preventDefault();
});

$('.menu-bar').on('click', function(){
  if ($('header').attr('open')) {
    $('header').removeAttr('open','');
  } else {
    $('header').attr('open','');
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

//focusout 할때
false && $('.user-info > ul').on('focusout', function(){
  $('.user-info > li ul').toggleClass('on');
});

false && $('header').on('focusout', function(){
  $('header').removeAttr('open','');
})
