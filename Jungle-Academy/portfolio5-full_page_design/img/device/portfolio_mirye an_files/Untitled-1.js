//아래 펑션이 도큐먼트 레디와 같은 의미
$(function() {
    new fullpage('#fullpage', {
        navigation: true,
        scrollOverflow: true,
        anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage'],
        afterLoad: function(origin, destination, direction) {
            var loadedSection = this;

            if(origin.anchor == 'thirdPage' && direction == 'down') {
                $('.next-btn').css({display: 'none'});
            } else {
                $('.next-btn').css({display: 'inline'});
            }
        }
    });
});

$(document).on('click', 'a[href="#"]', function(e){
    e.preventDefault();
});