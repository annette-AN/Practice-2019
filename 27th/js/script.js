$(function(){
	$('li').on('click', function() {
		var i = $(this).index(); //현재 클릭한 li의 번호를 index()구문으로 읽어옴.
		$('li').removeClass('on'); //li에 적용되어있는 on 클래스를 제거
		$('li').eq(i).addClass('on');
		
		$('section > div').removeClass('on');
		$('section > div').eq(i).addClass('on');
		
		//hasClass()는 조건문과 함께 사용하는 경우가 많음
		if ($('li').hasClass('on')) {
			//li요소에 on 클래스 명이 있는지 체크
			$('section > div').eq(i).css({
				textShadow: '2px 2px 5px #333'
			});
		};
	});
	
	//section >div가 클릭이 되면 현재 선택된 div에 .color 클래스가 적용되도록 toggleClass()로 선언
	$('section > div').on('click', function() {
		$(this).toggleClass('color');
	})
});







