$(document).ready(function() {

  $('.btn-opener').on('click', function(){
    $('.btn-opener').fadeOut();
    $('nav').addClass('nav-on');
    $('section').addClass('section-on');
  });

  $('.gnb li').on('click', function(){
    $('.btn-opener').fadeIn();
    $('nav').removeClass('nav-on');
    $('section').removeClass('section-on');

    var i = $(this).index();
    $('section > div').removeClass('section-on');
    $('section > div').removeClass('div-on');
    $('section > div').eq(i).addClass('div-on');
  });

});



