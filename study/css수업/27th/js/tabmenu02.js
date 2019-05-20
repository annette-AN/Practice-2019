$(function() {
	$('.tabMenu').each(function() {
		var gnb = $(this).find('.gnb');
		var a = gnb.find('a');
		var article = $(this).find('article');
		
		gnb.on('click','a', function(e){
			e.preventDefault(); 
			
			//클릭한 링크 a를 객체변수로 변환
			var $this = $(this);
			
			//선택된 링크 a는 마우스 클릭에 반응하지 않도록 하기
			if ($this.hasClass('on')) {
				return;
			}
			
			//모든 링크에 'on'클래스 제거해서 초기화
			//클릭된 a에 'on' 클래스 붙이기
			a.removeClass('on');
			$this.addClass('on');
			
			//모든 article 기본 숨겨서 초기화
			//클릭된 링크 a에 href 속성이 동일한 article만 보임
			article.hide();
			$($this.attr('href')).fadeIn();
		});
		a.eq(0).trigger('click');
	});
});