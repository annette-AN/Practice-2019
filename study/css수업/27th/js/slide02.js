$(function() {
	/*슬라이드 요소 준비*/
	$('.slideshow').each(function() {
		//요소에 필요한 변수 선언
		var $container = $(this); //a
		var $slideGroup = $container.find('.slideshow-slides'); //b
		var $slides = $slideGroup.find('.slide'); //c
		var $nav = $container.find('.slideshow_nav'); //d
		var $indicator = $container.find('.slideshow_indicator'); //e
		/*
		a - 슬라이스쇼 전체 박스
		b - 슬라이드 이미지 그룹
		c = 슬라이드 이미지
		d = 네비게이션 (prev/next)
		e = 인디케이터
		*/	
		
		var slideCount = $slides.length; //슬라이스개수
		var indicatorHTML = ''; //인디케이터 콘텐츠 - 공란
		var currentIndex = 0; //현재 슬라이드 인덱스
		var duration = 500; //애니메이션이 넘어가는 시간
		var easing = 'easeInOutExpo'; //애니메이션 가속함수
		var interval = 2500; //자동으로 다음 슬라이드 넘어갈때까지 시간
		var timer; //타이머
		
		//html요소로 indicator 생성 삽입
		// 각 슬라이드의 위치를 결정하고, 해당 인디케이터 생성
		$slides.each(function (i) {
			$(this).css({left: 100 * i + '%'});
			indicatorHTML += '<a href="#">' + (i + 1) + '</a>';
		});
		//인디케이터 콘텐츠 삽입
		$indicator.html(indicatorHTML);
		
	//함수정의
	//모든 슬라이드를 표시하는 함수
		function goToSlide (index) {
			//슬라이드 그룹을 대상 위치에 맞게 이동
			$slideGroup.stop().animate({
				left: -100 * index + '%'
			}, duration, easing);
			//현재 슬라이드의 인덱스 덮어쓰기
			currentIndex = index;
			//네비게이션 상태 업데이트
			updateNav();
		}
		//슬라이드 상태에 따른 네비게이션 및 인디케이터 업뎃 함수
		function updateNav() {
			var $navPrev = $nav.find('.prev');
			var $navNext = $nav.find('.next');
			
			//만약 첫번째 슬라이드라면 prev 버튼을 해제
			if (currentIndex === 0) {
					$navPrev.addClass('on');
				} else {
				$navPrev.removeClass('on');
				}			
		
			//만약 마지막 슬라이드라면 next 버튼을 해제
			if (currentIndex === slideCount - 1) {
				$navNext.addClass('on');
				} else {
					$navNext.removeClass('on');
				} 
			//현재 슬라이드 표시 해제
			$indicator.find('a').removeClass('on').eq(currentIndex).addClass('on');	
		}
		
		//타이머를 시작하는 함수
		function startTimer() {
			//변수 interval에서 설정한 시간이 경과할 때마다 작업 수행
			timer = setInterval(function(){
				//현재 슬라이드의 인덱스에 따라서 다음 표시할 슬라이들 결정
				//만약 마지막 슬라이드면 첫번재 슬라이드에 타이머 적용
				var nextIndex = (currentIndex + 1) % slideCount; 
				goToSlide(nextIndex);
			}, interval);
		}
		
		//타이머 중지
		function stopTimer() {
			clearInterval(timer);
		}
		
		//네비게이션 클릭하면 슬라이드 이동
		$nav.on('click', 'a',  function(e){
			e.preventDefault();
			
			if ($(this).hasClass('prev')) {
				goToSlide(currentIndex -1);
			} else {
				goToSlide(currentIndex + 1);
			}
		});
		
		//인디케이터 링크를 클릭하면 해당 슬라이드 표시
		$indicator.on('click', 'a', function(e){
			e.preventDefault();
			if (!$(this).hasClass('on')) {
				goToSlide($(this).index());
			}
		});
		
		//마우스 오버를 하면 타이머를 정지 그렇지 않으면 시작
		$container.on({
			mouseenter: stopTimer,
			mouseleave: startTimer
		});
		
		//슬라이드쇼 시작
		//첫번째 슬라이드 표시
		goToSlide(currentIndex);
		
		//타이머 시작
		startTimer();
		
		
	});
});