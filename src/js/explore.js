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

/*-------------------------------------------
    recommend lists
---------------------------------------------*/

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

	function onTopicListLoadMore(element, complete) {
		if(complete) {
			element.removeClass('disabled')
				.addClass('end')
				.unbind('click')
				.attr('href', G_BASE_URL + '/topic/');
	        element.html('获取更多专题');
		}
	}

	function onArticleListLoadMore(element, complete) {
		if(complete) {
			element.removeClass('disabled')
				.addClass('end')
				.unbind('click')
				.attr('href', G_BASE_URL + '/article/');
	        element.html('获取更多知识');
		}
	}

	NKR.load_list_view(G_BASE_URL + '/explore/ajax/load_question_list/', $('#ql-load-more'), $('#question-list'), 2, onQuestionListLoadMore);

	NKR.load_list_view(G_BASE_URL + '/explore/ajax/load_topic_list/', $('#tl-load-more'), $('#topic-list'), 1, onTopicListLoadMore);

	NKR.load_list_view(G_BASE_URL + '/explore/ajax/load_article_list/', $('#al-load-more'), $('#article-list'), 1, onArticleListLoadMore);

	$('.mr-tab').on('click', function(){
		var tabContent = $($(this).attr('href'));

		if(tabContent.find('.tc-list').is(':empty')) {
			tabContent.find('.load-more a').click();
		}
	});
});