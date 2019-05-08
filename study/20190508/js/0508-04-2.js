$(function(){
  $('.slide-wrap').each(function(){
    var $container = $(this);
    var $slideGroup = $container.find('.slide-show');
    var $slides = $slideGroup.find('.slide');
    var $nav = $container.find('.slide-show-nav');
    var $indicator = $container.find('.indicator');

    var slideCount = $slides.length;
    var indicatorHTML = '';
    var currentIndex = 0;
    var duration = 500; //sp라고 해도됌
    var easing = 'easeInOutExpo';
    var interval = 5500;

    var timer;

    //html요소로 indicator 삽입
    $slides.each(function(i){
      $(this).css({
        left: 100 * i + '%'
      });

      indicatorHTML += '<a href="#">' + (i + 1) + '</a>';
    });

    $indicator.html(indicatorHTML);

    function goToSlide (index) {
      $slideGroup.stop().animate({
        left: -100 * index + '%'
      }, duration, easing);
      currentIndex = index;
      updateNav();
    };
    
    function updateNav(){
      var $navPrev = $nav.find('.prev')
      var $navNext = $nav.find('.next')

      if (currentIndex === 0) {
        $navPrev.addClass('on');
      } else {
        $navPrev.removeClass('on');
      }

      if (currentIndex === slideCount - 1) {
        $navNext.addClass('on');
      } else {
        $navNext.removeClass('on');
      }

      $indicator.find('a').removeClass('on').eq(currentIndex).addClass('on');
    };

    function startTimer() {
      timer = setInterval(function(){
        var nextIndex = (currentIndex + 1) % slideCount;
        goToSlide(nextIndex);
      }, interval);
    };

    function stopTimer() {
      clearInterval(timer);
    };

    $nav.on('click', 'a', function(e){
      e.preventDefault();

      if ($(this).hasClass('prev')) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(currentIndex + 1);
      }
    });

    $indicator.on('click', 'a', function(e){
      e.preventDefault();
      if(!$(this).hasClass('on')) {
        goToSlide($(this).index());
      }
    });

    $container.on({
      mouseenter: stopTimer,
      mouseleave: startTimer 
    });

    goToSlide(currentIndex);

    starTimer();

  });
});