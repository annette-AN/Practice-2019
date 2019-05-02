$(function(){

  function isDesktop() {
    return window.innerWidth > 768;
  }

  function toggleMenuOpenClose() {
    if ($('.main-header').is('[open]')) {
        $('.main-header').removeAttr('open');
    } else {
        $('.main-header').attr('open', '');
    }
  };



  //메뉴열기
  $(document).on('click', '.menu-opener', toggleMenuOpenClose);
  $(document).on('click', 'li.menu-item', function () {
    if (isDesktop() === true) {
        toggleMenuOpenClose();
    } else {
      if ($(this).is('.sub-menu-open')) {
      $(this).removeClass('sub-menu-open');
      } else {
      $(this).addClass('sub-menu-open');
      }
    }
  });

  //top btn 활성화

  var autoFadeoutTopButton = function(){
    if($(window).scrollTop() === 0){
      $('.logo-Top').fadeOut();
    } else {
      $('.logo-Top').fadeIn();
    };
  };

  $(window).on('scroll', autoFadeoutTopButton);
  autoFadeoutTopButton();
    
  $('.logo-Top').on('click', function(){
    $(window).scrollTop(0);
  });
});

