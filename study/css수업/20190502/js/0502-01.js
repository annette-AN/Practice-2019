$(function(){
  $('.button1 button:nth-child(-n+3)').on('mouseover',function(){
    $(this).stop().animate({
      backgroundColor: '#753193',
      color: '#fff'
    },200);
  }).on('mouseout', function(){
    $(this).stop().animate({
      backgroundColor: '#4abace'
    },200);
  });

  $('.button1 button:nth-child(n+4):nth-child(-n+6)').on('mouseover',function(){
    $(this).stop().animate({
      borderWidth: '5px'
      },200);
    }).on('mouseout', function(){
    $(this).stop().animate({
      borderWidth: '0px'
    },200);
  });

  $('.button1 button:nth-child(n+7):nth-child(-n+9)').on('mouseover',function(){
    $(this).find('> span').stop().animate({
      width: '100%'
    }, 200, 'easeOutExpo');
  }).on('mouseout', function(){
    $(this).find('> span').stop().animate({
      width: '0%'
    }, 200, 'easeOutExpo');
  });
});