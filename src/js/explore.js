/*-------------------------------------------
    main slider
---------------------------------------------*/

$(document).ready(function() {
	var mainSlider = new Swiper ('.swiper-container', {
		pagination: '.swiper-pagination',
        paginationClickable: true,
		loop: true
    });
});

$(document).ready(function() {
	function onQuestionListLoadMore(element, complete) {
		if(complete) {
			element.removeClass('disabled')
				.addClass('end')
				.unbind('click')
				.attr('href', G_BASE_URL + '/question/');
	        element.html('更多精彩答题，进入题库');
		}
	}

	NKR.load_list_view(G_BASE_URL + '/explore/ajax/load_question_list/', $('#ql-load-more'), $('#question-list'), 2, onQuestionListLoadMore);
});