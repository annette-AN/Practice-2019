$(function(){
  //제이쿼리 안먹힘

  //부모님메뉴 오픈
  $(document).on('click', '#blue-gnb', function () {
    $('.menu').removeClass('menu-active');
    $('.menu.parents').addClass('menu-active');
  });

  //학생들메뉴 오픈
  $(document).on('click','#pink-gnb',function(){
    $('.menu').removeClass('menu-active');
    $('.menu.students').addClass('menu-active');
  });

  //메뉴 닫기
  $(document).on('click','.closeBtn', function(){
    $('.menu').removeClass('menu-active');
  });

});