$(function() {
	$('.tabset').each(function() {
		//사용할 요소 분류
		var tabDiv = $(this);
		var anchors = tabDiv.find('.tabs a');
		var panelDivs = tabDiv.find('.panel');
		
		//마지막에 클릭된 a요소, 패널 div를 저장하기 위한 변수
		var lastAnchor;
		var lastPanel;
		
		//탭부분을 화면에 표시
		anchors.show();
		
		//처음부터 활성화되어있는 탭과 패널
		lastAnchor = anchors.filter('.on');
		lastPanel = $(lastAnchor.attr('href'));
		
		//패널을 전부 숨기고 활성화되어있는 패널만 열기
		panelDivs.hide();
		lastPanel.show();
		
		//이벤트 설정
		anchors.click(function(e) {
			//a요소의 클릭 기본 동작을 모두 비활성화
			e.preventDefault();
			
			//클릭하는 a요소와 대응하는 패널
			var currentAnchor = $(this);
			var currentPanel = $(currentAnchor.attr('href'));
			
			//만약 같은 탭이면 반응이 없도록
			if (currentAnchor.get(0) === lastAnchor.get(0)) {
				return; // 현재 선택한 a와 이미 선택되어있는 a가 똑같으면 아무것도 수행하지않음.
			}
			
			//마지막에 열린 패널 닫기
			lastPanel.slideUp(200, function() {
				//애니메이션이 끝나면 직전에 열려있던 패널이 가진 on클래스를 버림
				lastAnchor.removeClass('on');
				
				//방금 클릭한 탭 활성화
				currentAnchor.addClass('on');
				
				//클릭한 탭과 매칭되는 div 패널 열기
				currentPanel.slideDown(200);
				
				//마지막으로 클릭한 패널 숨김
				lastPanel.hide();
				
				//다음 작업을 위해서 현재 열려있는 a, div를 저장
				lastAnchor = currentAnchor;
				lastPanel = currentPanel;
			});
		});		
	});
});






