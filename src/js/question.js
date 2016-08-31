$(document).ready(function(){

	/*----------------------------------------------------------
        question filter bar affix
	-----------------------------------------------------------*/

	var qs = $('#question-select');
    if(qs.length != 0)
    {
    	$('.question-select-wrap').height(qs.height());
        qs.affix({
            offset: { top: qs.offset().top},
            target: $('#main')
        });
    }

    /*----------------------------------------------------------
    	question select actions
	-----------------------------------------------------------*/

    function getQsTokens() {
        var filterTokens = '';
        var filters = ['category', 'quiztype', 'difficulty', 'countdown'];

        for (var i = 0; i < filters.length; i++) {
        	var filterItem = $('.qf-' + filters[i] + '.active');
        	var token = '';

	        if(filterItem.length != 1) {
	            token += '';
	        }

	        var dataId = filterItem.attr('data-id');
	        if(typeof dataId == 'undefined') {
	            token += '';
	        } else {
	        	token += (filters[i] + '-' + dataId);
	        }

            if(token.length) {
                filterTokens += (token + '__');
            }
        };

        // user record 

        var filterRecord = $('#qf-record').attr('data-filter-type');
        if(typeof filterRecord != 'undefined' && filterRecord != '' ) {
            filterTokens += ('urecord-' + filterRecord + '__');
        }

        // date

        var filterDate = $('#qf-date').attr('data-filter-type');
        if(typeof filterDate != 'undefined' && filterDate != '') {
            filterTokens += ('date-' + filterDate + '__');
        }

        // sort

        var sortItem = $('#qs-sort');
        if(sortItem.length != 1) {
            filterTokens += '';
        }

        var sortType = sortItem.attr('data-sort-type');
        if(typeof sortType == 'undefined' || sortType == '') {
            filterTokens += '';
        } else {
            filterTokens += ('sort_type-' + sortType + '__');
        }

        // remove tailing__

        filterTokens = filterTokens.replace(/(__$)/g, '');
        filterTokens = filterTokens.replace(/(^__)/g, '');

        return filterTokens;
    }

    $('#question-filter').on('click', '.qf-list > li', function(e) {
    	e.preventDefault();

    	$(this).addClass('active').siblings().removeClass('active');
    });

    $('#qf-apply').on('click', function() {
    	window.location.href = G_BASE_URL + '/question/' + getQsTokens();
    });

    $('#qs-sort').on('click', 'a', function(e) {
    	var sortItem = $('#qs-sort');

    	e.preventDefault();
    	sortItem.attr('data-sort-type', $(this).attr('data-sort-type'));
    	window.location.href = G_BASE_URL + '/question/' + getQsTokens();
    });

    $('#qf-date').on('click', 'a', function(e) {
    	var dateItem = $('#qf-date');

    	e.preventDefault();
    	dateItem.attr('data-filter-type', $(this).attr('data-filter-type'));
    	window.location.href = G_BASE_URL + '/question/' + getQsTokens();
    });

    $('#qf-record').on('click', 'a', function(e) {
    	var recordItem = $('#qf-record');
    	var filterType = $(this).attr('data-filter-type');

    	e.preventDefault();

    	if(filterType != '') {
    		if(G_USER_ID <= 0) {
	            window.location.href = G_BASE_URL + '/account/login/';
	            return;
	        }
    	}

    	recordItem.attr('data-filter-type', filterType);
    	window.location.href = G_BASE_URL + '/question/' + getQsTokens();
    });
});

$(document).ready(function(){

	/*----------------------------------------------------------
	    load question content
	-----------------------------------------------------------*/

	function beforeCountdown() {
		$('.countdown-timer').addClass('active');
		setupCoundownTimerAffix();
	}

 	function initCountdownTimer(size) {
 		var seconds = $('#countdown-timer').attr('data-countdown');
 		timer = '<li>' +
					'<div class="easy-pie countdown-hour" data-percent="100">' +
						'<div class="dial hour">60</div>' +
						'<div class="dial-title">时</div>' +
					'</div>' +
				'</li>' +
				'<li>' +
					'<div class="easy-pie countdown-minute" data-percent="100">' +
						'<div class="dial minute">60</div>' +
						'<div class="dial-title">分</div>' +
					'</div>' +
				'</li>' +
				'<li>' +
					'<div class="easy-pie countdown-second" data-percent="100">' +
						'<div class="dial second">60</div>' +
						'<div class="dial-title">秒</div>' +
					'</div>' +
				'</li>';
		$('#countdown-timer').html(timer);

 		var hour = parseInt(seconds / 3600);
        var minute = parseInt(seconds / 60);
        var second = parseInt(seconds % 60);

        var hourElement = $('#countdown-timer .countdown-hour').attr('data-percent', (60 - hour) * 5 / 3);
        $('#countdown-timer .dial.hour').text(hour);
        $('#countdown-timer .countdown-minute').attr('data-percent', (60 - minute) * 5 / 3);
        $('#countdown-timer .dial.minute').text(minute);
       	$('#countdown-timer .countdown-second').attr('data-percent', (60 - second) * 5 / 3);
        $('#countdown-timer .dial.second').text(second);

        if(hour > 0) {
		    hourElement.parents('li').show();
		} else {
		    hourElement.parents('li').hide();
		}

		var trackColor = '#eee';
    	var scaleColor = 'rgba(255,255,255,0)';
    	var barColor = '#03A9F4';

		$('#countdown-timer .easy-pie').easyPieChart({
            trackColor: trackColor,
            scaleColor: scaleColor,
            barColor: barColor,
            lineWidth: 2,
            animate: {duration: 100},
            lineCap: 'butt',
            size: size
        });
 	}

 	function setupCoundownTimerAffix() {
		var timerElement = $('.countdown-timer.active');
	    if(timerElement.length != 0)
	    {
	        $('.countdown-timer-wrap').height(timerElement.height());

	        timerElement.on('affixed.bs.affix', function () {
	            initCountdownTimer(60);
	        });

	        timerElement.on('affixed-top.bs.affix', function() {
	            initCountdownTimer(90);
	        });

	        timerElement.affix({
	            offset: { top: timerElement.offset().top},
	            target: $('#main')
	        });
	    }
	}

	function updateCountdownTimer(countdown) {
		// 限时答题，限时时间

		$('#countdown-timer').attr('data-countdown', countdown);

		var hour = parseInt(countdown / 3600);
        var minute = parseInt(countdown / 60);
        var second = parseInt(countdown % 60);

        var hourElement = $('#countdown-timer .countdown-hour');
        var hourDial = $('#countdown-timer .dial.hour');
        var minuteElement = $('#countdown-timer .countdown-minute');
        var minuteDial = $('#countdown-timer .dial.minute');
        var secondElement = $('#countdown-timer .countdown-second');
        var secondDial = $('#countdown-timer .dial.second');

        if(hour > 0) {
		    hourElement.parents('li').show();
		} else {
		    hourElement.parents('li').hide();
		}

		var minuteBarColor = '#03A9F4';
		minuteDial.removeClass('c-red');
		if(hour == 0 && minute == 0) {
			minuteBarColor = '#f44336';
			minuteDial.addClass('c-red');
		}

		var secondBarColor = '#03A9F4';
		secondDial.removeClass('c-orange').removeClass('c-red');
		if(hour == 0 && minute == 0 && second <= 10 && second > 0) {
			secondBarColor = '#FFC107';
			secondDial.addClass('c-orange');
		} else if(hour == 0 && minute == 0 && second == 0) {
			secondBarColor = '#f44336';
			secondDial.addClass('c-red');
		}
		minuteElement.data('easyPieChart').options.barColor = minuteBarColor;
		secondElement.data('easyPieChart').options.barColor = secondBarColor;

		hourElement.data('easyPieChart').update((60 - hour) * 5 / 3);
		hourDial.text(hour);
		minuteElement.data('easyPieChart').update((60 - minute) * 5 / 3);
		minuteDial.text(minute);
		secondElement.data('easyPieChart').update((60 - second) * 5 / 3);
		secondDial.text(second);
	}

	function checkAnswer(answer, spendTime) {
		var spiner = '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
		var checking = swal({   
			title: '',   
			text: spiner + '<p class="m-t-10 f-12 c-gray">正在检查答案</p>', 
			html: true, 
			allowEscapeKey: false,
			showConfirmButton: false 
		});

		// 检查问题答案

		var QUESTION_ID = $('#q-content').attr('data-id');
		$.get(G_BASE_URL + '/question/ajax/question_quiz_submit_answer/question_id-' + QUESTION_ID + '__answer-' + answer + '__spend_time-' + spendTime + '__record_id-' + QUESTION_QUIZ_RECORD_ID, function (quiz_result) {

			// 检查是否为特殊用户

			if(quiz_result['is_special_user']) {
				return;
			}

			// 检查是否为有效答案

			if(quiz_result['internal_error']) {
				sweetAlert("系统错误", "答题无效！", "error");
				window.location.href = G_BASE_URL;
				return;
			}

			// 检查是否为正确答案

			var textInfo = '';
			if(spendTime > 0)
			{
				textInfo = '<p><i class="icon icon-countdown"></i> 答题用时 <span><strong>' + spendTime + '</strong> 秒</span></p>';
			}

            if (quiz_result['correct']) {
            	if(quiz_result.integral)
				{
					textInfo += '<p><span class="c-green"> +' + quiz_result.integral + '</span> 积分</p>';
					textInfo += '<p>你当前剩余 <span><strong>' + (quiz_result.user_integral + quiz_result.integral) + '</strong></span> 积分</p>';
				}

                swal({   
                	title: '回答正确',
                	text: textInfo,   
                	html: true,
                	confirmButtonText: "确定",
                	type: 'success'
                	},
                	function() {
                		loadQuestionContent();
                	}
                );

            } else {
            	if(quiz_result.integral)
				{
					textInfo += '<p><span class="c-red"> -' + quiz_result.integral + '</span> 积分</p>';
					textInfo += '<p>你当前剩余 <span><strong>' + (quiz_result.user_integral - quiz_result.integral) + '</strong></span> 积分</p>';
				}
				swal({   
                	title: '回答错误',   
                	text: textInfo,   
                	html: true,
                	confirmButtonText: "确定",
                	type: 'error'
                	},
                	function() {
                		loadQuestionContent();
                	}
                );
            }
		}, 'json');
	}

	function submitAnswerHandle(answer, spendTime) {
		
		// 检查用户是否登录

		if(G_USER_ID <= 0) {
			window.location.href = G_BASE_URL + '/account/login/';
			return false;
		}

		// 如果已经通过了答题，提示是否继续尝试

		var PASSED_QUIZ = $('input[name=qz-record-passed]').val();
		if(PASSED_QUIZ) {
			textInfo = '你已经通过了答题，回答正确<strong class="c-red">不加分</strong>，回答错误<strong class="c-red">仍然扣分</strong>';
			swal(
				{   
                	title: '答题提示',
                	text: textInfo,   
                	html: true,
                	confirmButtonText: "继续答题",
                	showCancelButton: true,
				    cancelButtonText: "返回问题",
                	type: 'warning'
            	},
            	function(isConfirm) {
            		if(isConfirm) {
            			setTimeout(function(){
            				checkAnswer(answer, spendTime); 
            				return true; 
            			}, 10);
            		}
            	}
            );
		} else {
			checkAnswer(answer, spendTime);
			return true;
		}	

		return false;
	}

	function answerTimeoutHandle() {
		// 检查用户是否登录

		if(G_USER_ID <= 0) {
			window.location.href = G_BASE_URL + '/account/login/';
			return;
		}

		// 提交超时请求

		var QUESTION_ID = $('#q-content').attr('data-id');
		$.get(G_BASE_URL + '/question/ajax/question_quiz_timeout/record_id-' + QUESTION_QUIZ_RECORD_ID + '__question_id-' + QUESTION_ID, function (result) {
			
			// 特殊用户

			if(result.is_special_user)
			{
				return;
			}
			
			// 超时提示

			textInfo = '<p class="c-deeporange"><i class="md md-timer-off"></i> 答题超时</p>';
			if(result.required_integral)
			{
				textInfo += '<p><span class="c-red"> -' + result.required_integral + '</span> 积分</p>';
				textInfo += '<p>你当前剩余 <span><strong>' + (result.user_integral - result.required_integral) + '</strong></span> 积分</p>';
			}

			swal({
            	title: '答题失败',
            	text: textInfo,   
            	html: true,
            	confirmButtonText: "确定",
            	type: 'error'
            	},
            	function() {
            		loadQuestionContent();
            	}
            );
		}, 'json');
	}

	function parseQuestionQuiz(enableSubmit, enableCountdown) {
		QUESTION_QUIZ = $('input[name=qz-content]').val();
		QUESTION_QUIZ_ID = $('input[name=qz-id]').val();
		QUESTION_QUIZ_RECORD_ID = $('input[name=qz-record-id]').val();

		var IS_JSON = true;
		try {
			var quizContent = $.parseJSON(QUESTION_QUIZ);	
		}
		catch (err) {
			IS_JSON = false;
		}

		if (IS_JSON) {
			$('.qz-content').nkrQuiz({
				'mode' : 'single',
				'showSubmit' : enableSubmit,
				'enableCountdown' : enableCountdown,
				'data' : quizContent,
				'enabled' : true,
				'onSubmitAnswer' : submitAnswerHandle,
				'beforeCountdown': beforeCountdown,
				'onCountdown': updateCountdownTimer,
				'onTimeout' : answerTimeoutHandle
			});
		}
	}

	function loadQuestionContent() {
		$.get(G_BASE_URL + '/question/ajax/init_question_content/id-' + QUESTION_ID, function (response) {
			$('#q-content').html(response);

			var PASSED_QUIZ = $('input[name=qz-record-passed]').val();
			var TRY_COUNT = $('input[name=qz-record-try-count]').val();

			if($('input[name=qz-content]').length) {
				parseQuestionQuiz(TRY_COUNT == 0 || (TRY_COUNT > 0 && PASSED_QUIZ), !PASSED_QUIZ);
			}

			if($('#countdown-timer').length) {
				initCountdownTimer(90);
				setupCoundownTimerAffix();
			}
		});
	}

	if(typeof QUESTION_ID != 'undefined') {
		loadQuestionContent();
	}

	/*----------------------------------------------------------
	    answer question actions
	-----------------------------------------------------------*/

	function retryQuizIntegralAction(callback)
	{
		// 检查用户是否登录

		if(G_USER_ID <= 0) {
			window.location.href = G_BASE_URL + '/account/login/';
			return;
		}

		// 获取答题积分

		var QUESTION_ID = $('#q-content').attr('data-id');
		$.get(G_BASE_URL + '/question/ajax/get_question_quiz_retry_integral/question_id-' + QUESTION_ID, function (result){
			if(result.err)
			{
				NKR.alert(result.err);

				return;
			}

			if(result.not_enough_integral)
			{
				textInfo = '<p>你当前剩余 <strong>' + result.user_integral + '</strong> 积分</p>' + '<p>重新答题需要 <span class="c-red">' + result.required_integral + '</span> 积分</p>';
				textInfo += '<div class="m-t-20 alert-get-integral"><i class="md md-help"></i> 你可以通过<a class="c-lightblue" href="' + G_BASE_URL + '/publish/' + '">分享题目</a>来获取额外积分，更多获取积分的方式可以查看<a class="c-lightblue" href="' + G_BASE_URL + '/integral/rule/' + '">积分规则</a></div>';
				swal({
					title: '积分不足',
		        	text: textInfo,
		        	html: true,
		        	confirmButtonText: "获取积分",
		        	showCancelButton: true,
				    cancelButtonText: "返回问题",
		        	type: 'info'
		        	},
		        	function() {
		        		window.location.href = G_BASE_URL + '/integral/rule/';
						return;	
		        	}
		        );

				return;
			}
				
			if(result.required_integral > 0)
			{
				swal({   
		        	title: '积分提示',
		        	text: '<p>你当前剩余 <strong>' + result.user_integral + '</strong> 积分</p>' + '<p>重新答题需要 <span class="c-red">' + result.required_integral + '</span> 积分</p>',   
		        	html: true,
		        	confirmButtonText: "继续",
		        	showCancelButton: true,
		        	cancelButtonText: "取消",
		        	type: 'info'
		        	},
		        	function() {
		        		// 添加积分记录

		        		$.get(G_BASE_URL + '/question/ajax/save_question_quiz_retry_integral/question_id-' + QUESTION_ID, function (result) {
							if (result.err)
							{
								NKR.alert(result.err);

								return;
							}
							
							callback();
						}, 'json');
		        	}
		        );
			}
		}, 'json');
	}

	function beginCountdownQuestion() {
		// 检查用户是否登录

		if(G_USER_ID <= 0) {
			window.location.href = G_BASE_URL + '/account/login/';
			return;
		}

		// 倒计时问题开始答题

		var QUESTION_ID = $('#q-content').attr('data-id');
		$.get(G_BASE_URL + '/question/ajax/begin_question_quiz_countdown/id-' + QUESTION_ID, function (response) {
			$('#q-content').html(response).css('opacity',0).animate({opacity:1}, 300);
			initCountdownTimer(90);
			setupCoundownTimerAffix();
			parseQuestionQuiz(true, true);
		});
	}

	$('body').on('click', '[data-qz-act]', function (e) {
		e.preventDefault();

        var $this = $(this);
        var action = $(this).data('qz-act');

        switch(action) {
        	case 'retry':
        		retryQuizIntegralAction(function(){
        			$('.qz-state').hide();
					parseQuestionQuiz(true, true);
				});
        	break;

        	case 'retry-countdown':
        		retryQuizIntegralAction(function(){
        			beginCountdownQuestion();
				});
        	break;

        	case 'discuss':
        		questionComment();
        	break;

        	case 'answer-countdown':
        		beginCountdownQuestion();
        	break;
        }
	});
});

$(document).ready(function(){

	// toogle user invitation

	$('body').on('click', '.qia-toggle-invitation', function(e) {
		e.preventDefault();

    	if(G_USER_ID <= 0) {
			window.location = G_BASE_URL + '/account/login/';
			return;
		}

    	var _this = $(e.target);
    	if(_this.hasClass('invited')) {
    		$.post(G_BASE_URL + '/question/ajax/cancel_question_invite/question_id-' + QUESTION_ID + "__recipients_uid-" + _this.attr('data-id'), function (result) {
				if(result.errno == -1) {
					NKR.alert(result.err);
				} else {
					updateInvitedUsers();
					updateUserInvitations();
					_this.removeClass('invited').text('发送邀请');
				}
			}, 'json');
    		
    	} else {
    		$.post(G_BASE_URL + '/question/ajax/save_invite/question_id-' + QUESTION_ID + '__uid-' + _this.attr('data-id'), function (result) {
				if(result.errno == -1) {
					NKR.alert(result.err);
				} else {
					updateInvitedUsers();
					updateUserInvitations();
					_this.addClass('invited').text('取消邀请');
				}
			}, 'json');
    	}
	});
	
	$('body').on('click', '.qim-cancel-invitation', function(e) {
    	e.preventDefault();

    	var _this = $(this);
    	var invitedUser = $('#qia-recommend-list .qia-toggle-invitation[data-id="' + _this.attr('data-id') + '"]')[0];
    	if(invitedUser) {
    		
    		// 如果用户还在推荐列表中，直接通过点击取消	

    		invitedUser.click();
    	} else {

    		// 直接发送删除用户请求

    		$.post(G_BASE_URL + '/question/ajax/cancel_question_invite/question_id-' + QUESTION_ID + "__recipients_uid-" + _this.attr('data-id'), function (result) {
				if(result.errno == -1) {
					NKR.alert(result.err);
				} else {
					updateInvitedUsers();
					updateUserInvitations();
				}
			}, 'json');
    	}
    });

	// invited user list

	function onInvitedListLoadMore(element, complete) {
        if(complete) {
            element.addClass('no-more');
            element.html('没有更多');
        }
    }

	function updateInvitedUsers() {
		if(typeof QUESTION_ID != 'undefined') {
			$.get(G_BASE_URL + '/question/ajax/invited_users/question_id-' + QUESTION_ID + '__page-1', function (response) {
	    		if(response != '') {
	    			$('#qi-invited-list').html(response);

	    			$('#qi-invited .load-more').html('<a href="#" auto-load="false" id="qi-load-more"><i class="icon icon-load-more"></i> 加载更多</a>').show();
	    			NKR.load_list_view(G_BASE_URL + "/question/ajax/invited_users/question_id-" + QUESTION_ID, $('#qi-load-more'), $('#qi-invited-list'), 2, onInvitedListLoadMore);

	    		} else {
	    			$('#qi-invited-list').html('<div class="qia-no-invites"><p>目前还没有被邀请的用户</p><a href="#" class="qia-add-invite"><i class="icon icon-person-add"></i> 邀请答题</a></div>');
	    			$('#qi-invited .load-more').hide();
	    		}
			});
		}	
    }

    updateInvitedUsers();

    $('body').on('click', '.qia-more', function(e) {
    	var _this = $(this);
    	e.preventDefault();
    	_this.siblings().removeClass('hide');
    	_this.detach();
    });

    // my invitations

    function updateUserInvitations() {
    	if(typeof QUESTION_ID != 'undefined') {
    		$.get(G_BASE_URL + '/question/ajax/user_invited_users/uid-' + G_USER_ID + '__question_id-' + QUESTION_ID, function (response) {
				$('#qim-invites').html(response);
			});
    	}  	
    }

    updateUserInvitations();

    // invite search

    function updateInviteSearchResult() {
    	var searchInput = $('#qia-search-input');
    	var resultContainer = $('#qia-search-result');
    	var clearSearch = $('#qia-search-clear');
    	var searchText = searchInput.val().trim();
    	var recommendList = $('#qia-recommend-list');

    	if(searchText.length > 0) {
    		
    		// clear search button 

    		clearSearch.show();

    		// search

			var url = G_BASE_URL + '/search/ajax/search/?type=users&q=' + encodeURIComponent(searchText) + '&limit=10';
			var request = $.get(url, function (result) {
				if (result.length != 0 && request != undefined) {
					resultContainer.html('');
					$.each(result, function (i, a) {
						resultContainer.append(Mustache.render(TEMPLATE.inviteSearch, {
							'uid': a.uid,
							'name': a.name,
							'img': a.detail.avatar_file,
							'intro': a.detail.signature,
							'url': a.url,
							'hide': i > 2
						}));
					});
					resultContainer.append('<a class="qia-more qia-more-search" href="#">更多搜索结果</a>');
				} else {
					resultContainer.html('<div class="qia-search-none">没有找到相关用户</div>');
				}
			}, 'json');
			resultContainer.show();

			// recommend list

			recommendList.hide();
    	} else {
    		clearSearch.hide();
    		resultContainer.hide();
    		recommendList.show();
    	}
    }

    $('#qia-search-input').on('keyup', function(e) {
    	updateInviteSearchResult();
    });

    $('#qia-search-clear').on('click', function(e) {
    	e.preventDefault();

    	$('#qia-search-input').val('');
    	updateInviteSearchResult();
    });

    $('body').on('click', '.qia-add-invite', function(e) {
    	e.preventDefault();
    	$.scrollTo($('#question-invites').offset().top - 70, 300, {queue:true});
    	$('#qi-add-invite-tab').click();
    });
});

$(document).ready(function(){
	window.questionComment = function() {
		$.scrollTo($('#question-comments').offset().top - 70, 300, {queue:true});
		if($('.qcmt-reply-box').is(':visible')) {
			$('.qcmt-reply-box textarea').focus();
		}
	}

	function loadComments(callback) {
		if(typeof QUESTION_ID != 'undefined') {
			$.get(G_BASE_URL + '/question/ajax/load_answers/question_id-' + QUESTION_ID, function (response) {
				$('#qcmt-comment-list').html(response);
				$('.qcmt-comments').removeClass('hide');
				if(typeof callback == 'function') {
					callback();
				}
			});
		}
	}

	if($('#qcmt-comment-list').attr('data-show-comments') == 1) {
		loadComments();
	}

	$('.qcmt-load-comments').on('click', function (e){
		e.preventDefault();

		// 检查用户是否登录

		if(G_USER_ID <= 0) {
			window.location.href = G_BASE_URL + '/account/login/';
			return;
		}

		loadComments(function() {
			$('.qcmt-load-hint').hide();
			questionComment();
		});
	});

	$('body').on('click', '.qcmt-reply',function(e) {
		e.preventDefault();

		var replyButton = $(this);
		var targetUser = replyButton.attr('data-user-name');
		var index = replyButton.attr('data-index');
		var commentBox = $('#ci-reply-box-' + replyButton.attr('data-answer-id'));
		var commentInput = commentBox.find('textarea');
		var currentIndex = commentInput.attr('data-index');

		var atUser = '@' + targetUser + ' ';
		if(typeof targetUser == 'undefined') {
			atUser = '';
		}

		if(commentBox.is(":visible")){
			if(index != currentIndex) {
				commentInput.attr('data-index', index);
				commentInput.val(atUser);
				commentInput.focus();
			} else {
				commentInput.removeAttr('data-index');
				commentBox.hide();
				commentInput.val('');
			}
			
		} else {
			commentBox.show();
			commentInput.attr('data-index', index);
			commentInput.insertAtCaret(atUser);
			commentInput.focus();
			$.scrollTo(commentInput.offset().top - 250, 300, {queue:true});
		}
	});

	if(typeof QUESTION_ID != 'undefined') {
		NKR.load_list_view(G_BASE_URL + '/question/ajax/load_answers/question_id-' + QUESTION_ID, $('#qcmt-load-more'), $('#qcmt-comment-list'), 2, function(element, complete) {
				if(complete) {
					element.addClass('no-more');
		            element.html('已加载全部讨论');
				}
			}
		);
	}
});


$(document).ready(function(){
	function showQuestionSolution() {
		$('#dlg-solution').modal();
		$.get(G_BASE_URL + '/question/ajax/get_question_solution/question_id-' + QUESTION_ID, function (response) {
			if (!response) {
				AWS.alert('获取答案解析失败！');

				return;
			}

			$('#solution-content').html(response);
		});
	}

	$('body').on('click', '[data-qtb-act]', function (e) {
        e.preventDefault();

        var _this = $(this);
        var action = _this.data('qtb-act');

        switch (action) {
        	case 'solution' :
				if (G_USER_ID <= 0) {
				    window.location.href = G_BASE_URL + '/account/login/';
				    return;
				}

				$.get(G_BASE_URL + '/question/ajax/get_question_solution_record/question_id-' + QUESTION_ID, function(result) {
				    if (result.err) {
				        AWS.alert(result.err);

				        return;
				    }

				    // 没有答案

				    if (result.solution_not_exist) {
				        swal({
				            title: '系统提示',
				            text: '该问题目前还没有答案解析！',
				            html: true,
				            confirmButtonText: "确定",
				            type: 'info'
				        });

				        return;
				    }

				    if (result.record_exist) {
				        // 直接获取答案

				        showQuestionSolution();
				    } else {

				        // 发送购买答案请求

				        $.get(G_BASE_URL + '/question/ajax/get_question_view_solution_integral/question_id-' + QUESTION_ID, function(result) {
				            if (result.err) {
				                AWS.alert(result.err);

				                return;
				            }

				            if (result.not_enough_integral) {
				                textInfo = '<p>你当前剩余 <strong>' + result.user_integral + '</strong> 积分</p>' + '<p>查看答案解析需要 <span class="required-integral c-red">' + result.required_integral + '</span> 积分</p>';
				                textInfo += '<div class="m-t-20 alert-get-integral"><i class="md md-help"></i> 你可以通过<a class="c-lightblue" href="' + G_BASE_URL + '/publish/' + '">分享题目</a>来获取额外积分，更多获取积分的方式可以查看<a class="c-lightblue" href="' + G_BASE_URL + '/integral/rule/' + '">积分规则</a></div>';
				                swal({
				                        title: '积分不足',
				                        text: textInfo,
				                        html: true,
				                        confirmButtonText: "获取积分",
				                        showCancelButton: true,
				                        cancelButtonText: "返回问题",
				                        type: 'info'
				                    },
				                    function() {
				                        window.location.href = G_BASE_URL + '/integral/rule/';
				                        return;
				                    }
				                );

				                return;
				            }

				            // 提示并查看答案

				            if (result.required_integral > 0) {
				                swal({
				                        title: '积分提示',
				                        text: '<p>你当前剩余 <strong>' + result.user_integral + '</strong> 积分</p>' + '<p>查看答案解析需要 <span class="c-red">' + result.required_integral + '</span> 积分</p>',
				                        html: true,
				                        confirmButtonText: "继续",
				                        showCancelButton: true,
				                        cancelButtonText: "取消",
				                        type: 'info'
				                    },
				                    function() {
				                        $.get(G_BASE_URL + '/question/ajax/save_question_view_solution_integral/question_id-' + QUESTION_ID, function(result) {
				                            if (result.err) {
				                                AWS.alert(result.err);
				                            }

				                            // 添加答案解析查看记录

				                            $.get(G_BASE_URL + '/question/ajax/save_question_solution_record/question_id-' + QUESTION_ID, function(result) {
				                                if (result.err) {
				                                    AWS.alert(result.err);
				                                } else {
				                                    // 获取答案

				                                    showQuestionSolution();
				                                }
				                            }, 'json');
				                        });
				                    }
				                );
				            }
				        }, 'json');
				    }
				}, 'json');

		        break;

        	case 'comment' :
        		questionComment();
        		break;

        	case 'invite' :
        		$.scrollTo($('#question-invites').offset().top - 70, 300, {queue:true});
    			$('#qi-add-invite-tab').click();
        		break;

        	case 'share' :
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
   User records
-----------------------------------------------------------*/

$(document).ready(function(){
    if($('#qur-load-more').length) {
        function onUserQuizRecordLoadMore(element, complete) {
            if(complete) {
                element.addClass('no-more');
                element.html('没有更多记录');
            }
        }

        // 加载更多

        NKR.load_list_view(G_BASE_URL + "/question/ajax/load_more_question_quiz_record_user/question_id-<?php echo $this->question_info['question_id']; ?>__uid-<?php echo $this->quiz_user_info['uid']; ?>", $('#qur-load-more'), $('#qur-records'), 2, onUserQuizRecordLoadMore);
    }
});

/*----------------------------------------------------------
   Shares
-----------------------------------------------------------*/

$(document).ready(function(){
	if(typeof QUESTION_ID != 'undefined') {
		if($('.share-items')[0]) {
	        $('.share-items').nkrShare({
	        	title : QUESTION_SHARE_TITLE,
	        	description: QUESTION_SHARE_DESCRIPTION,
	        	pic : QUESTION_SHARE_PICS 
	        });
	    }
	}
});
