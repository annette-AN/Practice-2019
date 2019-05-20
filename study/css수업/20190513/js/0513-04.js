$(function(){
  $('header').each(function(){
    var $win = $(window);
    var $header = $(this);

    var headerOffsetTop = $header.offset().top;

    $win.on('scroll', function(){
      var scrollTop = $win.scrollTop();
      var $section = $('section');

      var scroll = math.floor(scrollTop);
      var offset = math.floor(headerOffsetTop);

      //하다 말음
    });
  });
});