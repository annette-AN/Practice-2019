//아래 펑션이 도큐먼트 레디와 같은 의미
$(document).on('click', 'a[href="#"]', function(e){
    e.preventDefault();
});