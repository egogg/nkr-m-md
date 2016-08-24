$(document).ready(function() { 
	if(typeof ARTICLE_ID != 'undefined') {
		NKR.load_list_view(G_BASE_URL + '/article/ajax/load_more_comments/id-' + ARTICLE_ID, $('#arc-load-more'), $('#arc-comment-list'), 2, function(element, complete) {
				if(complete) {
					element.addClass('no-more');
		            element.html('已加载全部评论');
				}
			}
		);
	}

	// article comment actions

	$('body').on('click', '[data-arc-act]', function (e) {
		e.preventDefault();

        var _this = $(this);
        var action = $(this).data('arc-act');

        switch(action) {
        	case 'reply':
	        	var commentItem = _this.closest('.comment-item');
				var commentForm = commentItem.find('.arc-form');

				if(commentForm.length) {
					commentForm.fadeToggle();
					
				} else {
					commentForm = $('<form action="' + G_BASE_URL + '/article/ajax/save_comment/" onsubmit="return false;" method="post" class="arc-form"></form>');
					commentForm.append($('<input type="hidden" name="at_uid" value="' + _this.data('id')+ '"/>'));
					commentForm.append($('#arc-form').html());
					commentItem.append(commentForm.fadeIn());
				}

				var commentBox = commentForm.find('textarea');
				$.scrollTo(commentBox.offset().top - 120, 600, {queue:true});
				commentBox.focus();
        	break;

        	case 'remove':
        		NKR.ajax_request(G_BASE_URL + '/article/ajax/remove_comment/', 'comment_id=' + _this.data('id'));
        	break;

        	case 'submit':
        		var commentItem = _this.closest('.comment-item');
				var commentForm = _this.closest('.arc-form');
				NKR.ajax_post(commentForm, NKR.ajax_processer, 'reply');

				if(commentItem.length) {
					commentForm.hide();
				}
			break;
        }
	});

	// article actions

	$('body').on('click', '[data-ar-act]', function (e) {
		e.preventDefault();

        var _this = $(this);
        var action = $(this).data('ar-act');

        switch(action) {
        	case 'share':
	        	if($('.footer-share').is(':visible')) {
        			$('.footer-share').slideUp(300);
        		} else {
        			$('.footer-share').slideDown(300);
        		}
        		break;
        }
	});
});

/*----------------------------------------------------------
   Shares
-----------------------------------------------------------*/

$(document).ready(function(){
	if(typeof ARTICLE_ID != 'undefined') {
		if($('.share-items')[0]) {
	        $('.share-items').nkrShare({
	        	title : ARTICLE_SHARE_TITLE,
	        	description: ARTICLE_SHARE_DESCRIPTION,
	        	pic : ARTICLE_SHARE_PICS          
	        });
	    }
	}  
});
