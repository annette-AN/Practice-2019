$(function(){
  var slideTime = 1000;

  $('.slide-show').each(function(){
    var $container = $(this);

    function switchImage(){
      var $img = $container.find('img');
      var first = $img.eq(0);
      var second = $img.eq(1);

      first.appendTo($container).fadeOut();
      second.fadeIn();
    }

    setInterval(switchImage, slideTime);
  });
});