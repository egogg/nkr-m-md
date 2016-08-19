$(document).ready(function(){
	if(typeof SEARCH_QUERY != 'undefined') {
		$('#s-type').on('click', 'li a', function(e){
			var _this = $(this);
			var tabContent = $(_this.attr('href'));

			if(tabContent.find('.s-result').is(':empty')) {
				tabContent.find('.load-more a').click();
			}
		});

		function noSearchResult(element, complete, container) {
			if(complete) {
				element.addClass('no-more');
	            element.html('没有更多搜索结果');
			}

			container.find('.qli-title a, .tli-title a, .ali-title a, .uli-title a').highText(SPLIT_QUERY, 'b', 's-highlight');
		}

		NKR.load_list_view(G_BASE_URL + '/search/ajax/search_result/search_type-questions' + '__q-' + encodeURIComponent(SEARCH_QUERY), $('#s-questions-load-more'), $('#s-questions'), 1, noSearchResult);
		NKR.load_list_view(G_BASE_URL + '/search/ajax/search_result/search_type-topics' + '__q-' + encodeURIComponent(SEARCH_QUERY), $('#s-topics-load-more'), $('#s-topics'), 1, noSearchResult);
		NKR.load_list_view(G_BASE_URL + '/search/ajax/search_result/search_type-articles' + '__q-' + encodeURIComponent(SEARCH_QUERY), $('#s-articles-load-more'), $('#s-articles'), 1, noSearchResult);
		NKR.load_list_view(G_BASE_URL + '/search/ajax/search_result/search_type-users' + '__q-' + encodeURIComponent(SEARCH_QUERY), $('#s-users-load-more'), $('#s-users'), 1, noSearchResult);

		$('#s-questions-load-more').click();
	}	
});

$(document).ready(function(){

	/*-------------------------------------------
        Header search action
    ---------------------------------------------*/

    $('#h-search-form').on('keydown', 'input', function(e) {
        if (e.keyCode == 13) {
            $('#h-search-form').submit();
            return false;
        }
    });

    /*-------------------------------------------
       Search action
    ---------------------------------------------*/

    $('#search-form').on('keydown', 'input', function(e) {
        if (e.keyCode == 13) {
            $('#search-form').submit();
            return false;
        }
    });
});