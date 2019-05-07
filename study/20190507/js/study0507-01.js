$(function(){
  $('.menu').each(function(){
    var gnb = $(this).find('.gnb');
    var a = gnb.find('a');
    var article = $(this).find('article');

    gnb.on('click','a', function(e){
      e.preventDefault();

      //클릭한 링크 a를 객체변수로 변환
      var $this = $(this);

      //선택된 링크 a는 마우스 클릭에 반응하지 않도록 하기
      if ($this.hasClass('on')){
        return;
      };
      
      a.removeClass('on');
      $this.addClass('on');

      article.hide();
      $($this.attr('href')).fadeIn();
    });

    a.eq(0).trigger('click');
  });
});