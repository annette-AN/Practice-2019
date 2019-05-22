$('.user-info > li > a').on('click', function(){
  $('.user-info > li > ul').toggleClass('on');
});

false && $('#main-gnb-menu > li > a').on('click', function(){

  var subMenu = $('#main-gnb-menu > li > ul');

  if($(this).next() === subMenu) {
    subMenu.toggleClass('show');
  };
});
