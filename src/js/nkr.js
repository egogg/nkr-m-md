var NKR =
{
	notify: function(message, type, close, position, offsetx, offsety, direction) {
		var inDirection = 'animated fadeInDown';
		switch(direction) {
			case 'down':
				inDirection = 'animated fadeInDown';
			break;
			case 'up':
				inDirection = 'animated fadeInUp';
			break;
			case 'left':
				inDirection = 'animated fadeInLeft';
			break;
			case 'right':
				inDirection = 'animated fadeInRight';
			break;
		}

		$.notify({
            icon: '',
            title: '',
            message: message
        },
        {
            element: 'body',
            type: type,
            allow_dismiss: close,
            placement: {
                from: position,
                align: 'center'
            },
            offset: {
                x: offsetx,
                y: offsety
            },
            spacing: 10,
            z_index: 9999,
            delay: 2500,
            timer: 1000,
            mouse_over: false,
            newest_on_top: true,
            animate: {
                enter: inDirection,
                exit: 'animated fadeOutDown'
            },
            icon_type: 'class',
            template: '<div data-notify="container" class="alert alert-{0}" role="alert">' +
                            '<button type="button" class="close c-white" data-notify="dismiss">' +
                                '<span aria-hidden="true">&times;</span>' +
                                '<span class="sr-only">close</span>' +
                            '</button>' +
                            '<span data-notify="icon" class="c-white"></span> ' +
                            '<span data-notify="title">{1}</span>' +
                            '<span data-notify="message" class="c-white">{2}</span>' +
                        '</div>'
        });
	},

	//全局loading
	loading: function (type)
	{
		if (!$('#aw-loading').length)
		{
			// $('#aw-ajax-box').append(AW_TEMPLATE.loadingBox);
		}

		if (type == 'show')
		{
			if ($('#aw-loading').css('display') == 'block')
			{
				return false;
			}

			$('#aw-loading').fadeIn();

			NKR.G.loading_timer = setInterval(function ()
			{
				NKR.G.loading_bg_count -= 1;

				$('#aw-loading-box').css('background-position', '0px ' + NKR.G.loading_bg_count * 40 + 'px');

				if (NKR.G.loading_bg_count == 1)
				{
					NKR.G.loading_bg_count = 12;
				}
			}, 100);
		}
		else
		{
			$('#aw-loading').fadeOut();

			clearInterval(NKR.G.loading_timer);
		}
	},
	loading_mini: function (selector, type)
	{
		if (!selector.find('#aw-loading-mini-box').length)
		{
			// selector.append(AW_TEMPLATE.loadingMiniBox);
		}

		if (type == 'show')
		{
			selector.find('#aw-loading-mini-box').fadeIn();

			NKR.G.loading_timer = setInterval(function ()
			{
				NKR.G.loading_mini_bg_count -= 1;

				$('#aw-loading-mini-box').css('background-position', '0px ' + NKR.G.loading_mini_bg_count * 16 + 'px');

				if (NKR.G.loading_mini_bg_count == 1)
				{
					NKR.G.loading_mini_bg_count = 9;
				}
			}, 100);
		}
		else
		{
			selector.find('#aw-loading-mini-box').fadeOut();

			clearInterval(NKR.G.loading_timer);
		}
	},

	ajax_error_msg: function(msg)
	{
		NKR.notify(msg, 'danger', true, 'top', 0, 0, 'down');
	},

	ajax_request: function(url, params)
	{
		NKR.loading('show');

		if (params)
		{
			$.post(url, params + '&_post_type=ajax', function (result)
			{
				_callback(result);
			}, 'json').error(function (error)
			{
				_error(error);
			});
		}
		else
		{
			$.get(url, function (result)
			{
				_callback(result);
			}, 'json').error(function (error)
			{
				_error(error);
			});
		}

		function _callback (result)
		{
			NKR.loading('hide');

			if (!result)
			{
				return false;
			}

			if (result.errno == -1)
			{
				NKR.alert(result.err);
			}
			else if (result.errno == 0)
			{
				NKR.alert(result.err, 'success');
			}
			else if (result.rsm && result.rsm.url)
			{
				window.location = decodeURIComponent(result.rsm.url);
			}
			else if (result.errno == 1)
			{
				window.location.reload();
			}
		}

		function _error (error)
		{
			NKR.loading('hide');

			if ($.trim(error.responseText) != '')
			{
				alert(_t('发生错误, 返回的信息:') + ' ' + error.responseText);
			}
		}

		return false;
	},

	ajax_post: function(formEl, processer, type) // 表单对象，用 jQuery 获取，回调函数名
	{
		// 若有编辑器的话就更新编辑器内容再提交
		if (typeof CKEDITOR != 'undefined')
		{
			for ( instance in CKEDITOR.instances ) {
				CKEDITOR.instances[instance].updateElement();
			}
		}

		if (typeof (processer) != 'function')
		{
			var processer = NKR.ajax_processer;

			NKR.loading('show');
		}

		if (!type)
		{
			var type = 'default';
		}
		else if (type == 'reply_question')
		{
			NKR.loading('show');
			$('.qcmt-reply').attr('disabled', 'disabled');

			// 删除草稿绑定事件
			// if (EDITOR != undefined)
			// {
			// 	EDITOR.removeListener('blur', EDITOR_CALLBACK);
			// }
		}

		var custom_data = {
			_post_type: 'ajax'
		};

		formEl.ajaxSubmit(
		{
			dataType: 'json',
			data: custom_data,
			success: function (result)
			{
				processer(type, result);
			},
			error: function (error)
			{
				console.log(error);
				if ($.trim(error.responseText) != '')
				{
					NKR.loading('hide');

					alert(_t('发生错误, 返回的信息:') + ' ' + error.responseText);
				}
				else if (error.status == 0)
				{
					NKR.loading('hide');

					alert(_t('网络链接异常'));
				}
				else if (error.status == 500)
				{
					NKR.loading('hide');

					alert(_t('内部服务器错误'));
				}
			}
		});
	},

	// ajax提交callback
	ajax_processer: function (type, result)
	{
		NKR.loading('hide');

		if (typeof (result.errno) == 'undefined')
		{
			NKR.alert(result);
		}
		else if (result.errno == 0)
		{
			NKR.alert(result.err, 'success');
		}
		else if (result.errno != 1)
		{
			switch (type)
			{
				case 'default':
				case 'comments_form':
				case 'reply':
				case 'reply_question':
				case 'invite_friend':
					NKR.alert(result.err);

					$('.submit-comment-box, .btn-reply').removeClass('disabled');
				break;

				case 'ajax_post_alert':
				case 'ajax_post_modal':
				case 'error_message':
					// if (!$('.error_message').length)
					// {
					// 	alert(result.err);
					// }
					// else if ($('.error_message em').length)
					// {
					// 	$('.error_message em').html(result.err);
					// }
					// else
					// {
					// 	 $('.error_message').html(result.err);
					// }

					// if ($('.error_message').css('display') != 'none')
					// {
					// 	NKR.shake($('.error_message'));
					// }
					// else
					// {
					// 	$('.error_message').fadeIn();
					// }
					NKR.ajax_error_msg(result.err);

					if ($('#captcha').length)
					{
						$('#captcha').click();
					}
				break;
			}
		}
		else
		{
			if (type == 'comments_form')
			{
				NKR.reload_comments_list(result.rsm.item_id, result.rsm.item_id, result.rsm.type_name);
				$('#ci-reply-box-' + result.rsm.item_id + ' form textarea').val('');
				$('#ci-reply-box-' + result.rsm.item_id).hide();
				$('.ci-submit').removeAttr('disabled');
			}

			if (result.rsm && result.rsm.url)
			{
				// 判断返回url跟当前url是否相同
				if (window.location.href == result.rsm.url)
				{
					window.location.reload();
				}
				else
				{
					window.location = decodeURIComponent(result.rsm.url);
				}
			}
			else
			{
				switch (type)
				{
					case 'default':
					case 'ajax_post_alert':
					case 'error_message':
						window.location.reload();
					break;

					case 'ajax_post_modal':
						$('#aw-ajax-box div.modal').modal('hide');
					break;

					// 邀请朋友答题
					case 'invite_friend':
						$('#modalInviteFriend').modal('hide');
						swal({   
				        	title: '发送邀请成功',
				        	text: '',   
				        	html: true,
				        	confirmButtonText: "确定",
				        	type: 'success'
				        });
					break;

					// 问题回复
					case 'reply_question':
						NKR.loading('hide');

						if (result.rsm.ajax_html)
						{
							// $('#comment-items').append(result.rsm.ajax_html);
							$('.qcmt-load-comments').click();
							$.get(G_BASE_URL + '/question/ajax/new_post_hash/', function (result) {
								if(result.errno != -1) {
									$('#answer_form input[name="post_hash"]').val(result.rsm.post_hash);
								}
							}, 'json');
							$('.qcmt-reply-box textarea').val('');
							$('.comment-box .btn-reply').removeAttr('disabled');

							// $.scrollTo($('#' + $(result.rsm.ajax_html).attr('id')), 600, {queue:true});

							// 问题
							// $('.question_answer_form').detach();
							// if(EDITOR != 'undefined') {
							// 	EDITOR.setData('');
							// }

							// if ($('.aw-replay-box.question').length)
							// {
							// 	if (USER_ANSWERED)
							// 	{
							// 		$('.aw-replay-box').append('<p align="center">一个问题只能回复一次, 你可以在发言后 ' + ANSWER_EDIT_TIME + ' 分钟内编辑回复过的内容</p>');
							// 	}
							// }
						}
						else if(result.rsm.url)
						{
							window.location = decodeURIComponent(result.rsm.url);
						}
						else
						{
							window.location.reload();
						}
					break;
					// 文章回复
					case 'reply':
						NKR.loading('hide');

						if (result.rsm.ajax_html) {
							$('#arc-comment-list').prepend(result.rsm.ajax_html);
							$('.btn-reply').removeClass('disabled');
							$.get(G_BASE_URL + '/article/ajax/new_post_hash/', function (result) {
								if(result.errno != -1) {
									$('.arc-form input[name="post_hash"]').val(result.rsm.post_hash);
								}
							}, 'json');

							$.scrollTo($('#' + $(result.rsm.ajax_html).attr('id')).offset().top - 120, 600, {queue:true});
							$('.arc-reply-box textarea').val('');
						} else if(result.rsm.url) {
							window.location = decodeURIComponent(result.rsm.url);
						} else {
							window.location.reload();
						}
					break;
				}
			}
		}
	},

	// 加载更多
	
	load_list_view: function(url, selector, container, start_page, callback) {
	    
	    if (!selector.attr('id')) {
	        return false;
	    }

	    if (!start_page) {
	        start_page = 0
	    }

	    // 把页数绑定在元素上面

	    if (selector.attr('data-page') == undefined) {
	        selector.attr('data-page', start_page);
	    } else {
	        selector.attr('data-page', parseInt(selector.attr('data-page')) + 1);
	    }

	    selector.bind('click', function() {
	        var _this = $(this);
	        var spinner = $('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
	        spinner.insertBefore(_this.hide());

	        $.get(url + '__page-' + _this.attr('data-page'), function(result) {
	        	var complete = false;
	            spinner.remove();
	            _this.show();

	            if ($.trim(result) != '') {
	                if (_this.attr('data-page') == start_page && _this.attr('auto-load') != 'false') {
	                    container.html(result);
	                } else {
	                    container.append(result);
	                }

	                // 页数增加1

	                _this.attr('data-page', parseInt(_this.attr('data-page')) + 1);
	            } else {

	                //没有内容

	                if (_this.attr('data-page') == start_page && _this.attr('auto-load') != 'false') {
	                    container.html('<div class="list-norecord">' + '没有相关内容' + '</div>');
	                }

	                complete = true;
	                _this.addClass('disabled').unbind('click').bind('click', function(e){
	                	e.preventDefault();
	                });
	            }

	            if (callback != null) {
	                callback(_this, complete, container);
	            }
	        });

	        return false;
	    });

	    // 自动加载

	    if (selector.attr('auto-load') != 'false') {
	        selector.click();
	    }
	},

	// 重新加载评论列表
	reload_comments_list: function(item_id, element_id, type_name)
	{
		$.get(G_BASE_URL + '/question/ajax/get_' + type_name + '_comments/' + type_name + '_id-' + item_id, function (data)
		{
			$('#comment-item-' + element_id).html(data);
		});
	},

	// 消息弹窗
	alert: function (text, type)
	{
		switch(type) {
			case 'info' :
				NKR.notify(text, 'info', true, 'top', 0, 0, 'down');
			break;
			case 'warning':
				NKR.notify(text, 'warning', true, 'top', 0, 0, 'down');
			break;
			case 'success':
				NKR.notify(text, 'success', true, 'top', 0, 0, 'down');
			break;
			case 'error' :
				NKR.notify(text, 'danger', true, 'top', 0, 0, 'down');
			break;
			default:
				NKR.notify(text, 'danger', true, 'top', 0, 0, 'down');
		}
	},

	/**
	 *	公共弹窗
	 *	publish     : 发起
	 *	redirect    : 问题重定向
	 *	imageBox    : 插入图片
	 *	videoBox    : 插入视频
	 *  linkbox     : 插入链接
	 *	commentEdit : 评论编辑
	 * 	solutionEdit: 答案解析编辑
	 *  favorite    : 评论添加收藏
	 *	inbox       : 私信
	 *  report      : 举报问题
	 */
	dialog: function (type, data, callback)
	{
		switch (type)
		{
			case 'alertImg':
				var template = Hogan.compile(AW_TEMPLATE.alertImg).render(
				{
					'hide': data.hide,
					'url': data.url,
					'message': data.message
				});
			break;

			case 'publish':
				var template = Hogan.compile(AW_TEMPLATE.publishBox).render(
				{
					'category_id': data.category_id,
					'ask_user_id': data.ask_user_id
				});
			break;

			case 'redirect':
				var template = Hogan.compile(AW_TEMPLATE.questionRedirect).render(
				{
					'data_id': data
				});
			break;

			case 'commentEdit':
				var template = Hogan.compile(AW_TEMPLATE.editCommentBox).render(
				{
					'answer_id': data.answer_id,
					'attach_access_key': data.attach_access_key
				});
			break;

			case 'solutionEdit':
				var template = Hogan.compile(AW_TEMPLATE.editSolutionBox).render(
				{
					'question_id' : data.question_id,
					'solution_id': data.solution_id,
					'attach_access_key': data.attach_access_key
				});
			break;

			case 'favorite':
				var template = Hogan.compile(AW_TEMPLATE.favoriteBox).render(
				{
					 'item_id': data.item_id,
					 'item_type': data.item_type
				});
			break;

			case 'inbox':
				var template = Hogan.compile(AW_TEMPLATE.inbox).render(
				{
					'recipient': data
				});
			break;

			case 'report':
				var template = Hogan.compile(AW_TEMPLATE.reportBox).render(
				{
					'item_type': data.item_type,
					'item_id': data.item_id
				});
			break;

			case 'topicEditHistory':
				var template = AW_TEMPLATE.ajaxData.replace('{{title}}', _t('编辑记录')).replace('{{data}}', data);
			break;

			case 'ajaxData':
				var template = AW_TEMPLATE.ajaxData.replace('{{title}}', data.title).replace('{{data}}', '<div id="aw_dialog_ajax_data"></div>');
			break;

			case 'imagePreview':
				var template = AW_TEMPLATE.ajaxData.replace('{{title}}', data.title).replace('{{data}}', '<p align="center"><img src="' + data.image + '" alt="" style="max-width:520px" /></p>');
			break;

			case 'confirm':
				var template = Hogan.compile(AW_TEMPLATE.confirmBox).render(
				{
					'message': data.message
				});
			break;

			case 'recommend':
				var template = Hogan.compile(AW_TEMPLATE.recommend).render();
			break;

			// modify by wecenter 活动模块
			case 'projectEventForm':
				var template = Hogan.compile(AW_TEMPLATE.projectEventForm).render(
				{
					'project_id': data.project_id,
					'contact_name': data.contact_name,
					'contact_tel': data.contact_tel,
					'contact_email': data.contact_email
				});
			break;

			case 'projectStockForm':
				var template = Hogan.compile(AW_TEMPLATE.projectStockForm).render(
				{
					'project_id': data.project_id,
					'contact_name': data.contact_name,
					'contact_tel': data.contact_tel,
					'contact_email': data.contact_email
				});
			break;

			case 'activityBox':
				var template = Hogan.compile(AW_TEMPLATE.activityBox).render(
				{
					'contact_name': data.contact_name,
					'contact_tel': data.contact_tel,
					'contact_qq': data.contact_qq
				});

			break;

			case 'addTopic':
				var template = Hogan.compile(AW_TEMPLATE.addTopicBox).render(
				{
					'question_id': data.question_id
				});
			break;
		}

		if (template)
		{
			if ($('.alert-box').length)
			{
				$('.alert-box').remove();
			}

			$('#aw-ajax-box').html(template).show();

			switch (type)
			{
				case 'redirect' :
					NKR.Dropdown.bind_dropdown_list($('.aw-question-redirect-box #question-input'), 'redirect');
				break;

				case 'inbox' :
					NKR.Dropdown.bind_dropdown_list($('.inbox #invite-input'), 'inbox');
					//私信用户下拉点击事件
					$('body').on('click', '.inbox .lv-item', function() {
						$('.inbox #quick_publish input.form-control').val($(this).attr('data-username'));
						$(this).parents('.dropdown').removeClass('open');
					});
				break;

				case 'publish':
					NKR.Dropdown.bind_dropdown_list($('.aw-publish-box #quick_publish_question_content'), 'publish');
					NKR.Dropdown.bind_dropdown_list($('.aw-publish-box #aw_edit_topic_title'), 'topic');
					if (parseInt(data.category_enable) == 1)
					{
						$.get(G_BASE_URL + '/publish/ajax/fetch_question_category/', function (result)
						{
							NKR.Dropdown.set_dropdown_list('.aw-publish-box .dropdown', eval(result), data.category_id);

							$('.aw-publish-title .dropdown li a').click(function ()
							{
								$('.aw-publish-box #quick_publish_category_id').val($(this).attr('data-value'));
								$('.aw-publish-box #aw-topic-tags-select').html($(this).text());
							});
						});
					}
					else
					{
						$('.aw-publish-box .aw-publish-title').hide();
					}

					if (data.ask_user_id != '' && data.ask_user_id != undefined)
					{
						$('.aw-publish-box .modal-title').html('向 ' + data.ask_user_name + ' 提问');
					}

					if ($('#aw-search-query').val() && $('#aw-search-query').val() != $('#aw-search-query').attr('placeholder'))
					{
						$('#quick_publish_question_content').val($('#aw-search-query').val());
					}

					NKR.Init.init_topic_edit_box('#quick_publish .aw-edit-topic');

					$('#quick_publish .aw-edit-topic').click();

					$('#quick_publish .close-edit').hide();

					if (data.topic_title)
					{
						$('#quick_publish .aw-edit-topic').parents('.aw-topic-bar').prepend('<span class="topic-tag"><a class="text">' + data.topic_title + '</a><a class="close" onclick="$(this).parents(\'.topic-tag\').detach();"><i class="icon icon-delete"></i></a><input type="hidden" value="' + data.topic_title + '" name="topics[]" /></span>')
					}

					if (typeof(G_QUICK_PUBLISH_HUMAN_VALID) != 'undefined')
					{
						$('#quick_publish_captcha').show();
						$('#captcha').click();
					}
				break;

				case 'favorite':
					$.get(G_BASE_URL + '/favorite/ajax/get_favorite_tags/', function (result)
					{
						var html = '';

						$.each(result, function (i, e)
						{
							html += '<li><a data-value="' + e['title'] + '"><i class="md md-check"></i><span class="title">' + e['title'] + '</span></a></li>';
						});

						$('.aw-favorite-tag-list ul').append(html);

						$.post(G_BASE_URL + '/favorite/ajax/get_item_tags/', {
							'item_id' : $('#favorite_form input[name="item_id"]').val(),
							'item_type' : $('#favorite_form input[name="item_type"]').val()
						}, function (result)
						{
							if(result) {
								$.each(result, function (i, e)
								{
									var index = i;

									$.each($('.aw-favorite-tag-list ul li .title'), function (i, e)
									{
										if ($(this).text() == result[index])
										{
											$(this).parents('li').addClass('active');
										}
									});
								});
							}
						}, 'json');

						$(document).on('click', '.aw-favorite-tag-list ul li a', function()
						{
							var _this = this,
								addClassFlag = true, url = G_BASE_URL + '/favorite/ajax/update_favorite_tag/';

							if ($(this).parents('li').hasClass('active'))
							{
								url = G_BASE_URL + '/favorite/ajax/remove_favorite_tag/';

								addClassFlag = false;
							}

							$.post(url,
							{
								'item_id' : $('#favorite_form input[name="item_id"]').val(),
								'item_type' : $('#favorite_form input[name="item_type"]').val(),
								'tags' : $(_this).attr('data-value')
							}, function (result)
							{
								if (result.errno == 1)
								{
									if (addClassFlag)
									{
										$(_this).parents('li').addClass('active');
									}
									else
									{
										$(_this).parents('li').removeClass('active');
									}
								}
							}, 'json');
						});

					}, 'json');
				break;

				case 'report':
					$('.aw-report-box select option').click(function ()
					{
						$('.aw-report-box textarea').text($(this).attr('value'));
					});
				break;

				case 'commentEdit':
					$.get(G_BASE_URL + '/question/ajax/fetch_answer_data/' + data.answer_id, function (result)
					{
						$('#editor_reply').html(result.answer_content.replace('&amp;', '&'));

						var editor = CKEDITOR.replace( 'editor_reply' );

						if (UPLOAD_ENABLE == 'Y')
						{
							var fileupload = new FileUpload('file', '.aw-edit-comment-box .upload-box .btn', '.aw-edit-comment-box .upload-box .upload-container', G_BASE_URL + '/publish/ajax/attach_upload/id-answer__attach_access_key-' + ATTACH_ACCESS_KEY, {'insertTextarea': '.aw-edit-comment-box #editor_reply', 'editor' : editor});

							$.post(G_BASE_URL + '/publish/ajax/answer_attach_edit_list/', 'answer_id=' + data.answer_id, function (data) {
								if (data['err']) {
									return false;
								} else {
									$.each(data['rsm']['attachs'], function (i, v) {
										fileupload.setFileList(v);
									});
								}
							}, 'json');
						}
						else
						{
							$('.aw-edit-comment-box .file-upload-box').hide();
						}
					}, 'json');
				break;

				case 'solutionEdit':
					$.get(G_BASE_URL + '/question/ajax/get_question_solution_data/' + data.question_id, function (result)
					{
						$('#editor_solution').html(result.content.replace('&amp;', '&'));

						var editor = CKEDITOR.replace( 'editor_solution' );
						var attachAccessKey = $('#solution_edit input[name=attach_access_key]').val();

						if (UPLOAD_ENABLE == 'Y')
						{
							var fileupload = new FileUpload('file', '.edit-solution-box .upload-box .btn', '.edit-solution-box .upload-box .upload-container', G_BASE_URL + '/publish/ajax/attach_upload/id-solution__attach_access_key-' + attachAccessKey, {'insertTextarea': '.aw-edit-solution-box #editor_solution', 'editor' : editor});

							$.post(G_BASE_URL + '/publish/ajax/solution_attach_edit_list/', 'solution_id=' + data.solution_id, function (data) {
								if (data['err'] || !data['rsm']['attachs']) {
									return false;
								} else {
									$.each(data['rsm']['attachs'], function (i, v) {
										fileupload.setFileList(v);
									});
								}
							}, 'json');
						}
						else
						{
							$('.edit-solution-box .upload-box').hide();
						}
					}, 'json');
				break;

				case 'ajaxData':
					$.get(data.url, function (result) {
						$('#aw_dialog_ajax_data').html(result);
					});
				break;

				case 'confirm':
					$('.aw-confirm-box .yes').click(function()
					{
						if (callback)
						{
							callback();
						}

						$(".alert-box").modal('hide');

						return false;
					});
				break;

				case 'recommend':
					$.get(G_BASE_URL + '/help/ajax/list/', function (result)
					{
						if (result && result != 0)
						{
							var html = '';

							$.each(result, function (i, e)
							{
								html += '<li class="aw-border-radius-5"><img class="aw-border-radius-5" src="' + e.icon + '"><a data-id="' + e.id + '" class="aw-hide-txt">' + e.title + '</a><i class="icon icon-followed"></i></li>'
							});

							$('.aw-recommend-box ul').append(html);

							$.each($('.aw-recommend-box ul li'), function (i, e)
							{
								if (data.focus_id == $(this).find('a').attr('data-id'))
								{
									$(this).addClass('active');
								}
							});

							$(document).on('click', '.aw-recommend-box ul li a', function()
							{
								var _this = $(this), url = G_BASE_URL + '/help/ajax/add_data/', removeClass = false;

								if ($(this).parents('li').hasClass('active'))
								{
									url =  G_BASE_URL + '/help/ajax/remove_data/';

									removeClass = true;
								}

								$.post(url,
								{
									'item_id' : data.item_id,
									'id' : _this.attr('data-id'),
									'title' : _this.text(),
									'type' : data.type
								}, function (result)
								{
									if (result.errno == 1)
									{
										if (removeClass)
										{
											_this.parents('li').removeClass('active');
										}
										else
										{
											$('.aw-recommend-box ul li').removeClass('active');

											_this.parents('li').addClass('active');
										}
									}
								}, 'json');
							});
						}
						else
						{
							$('.error_message').html(_t('请先去后台创建好章节'));

							if ($('.error_message').css('display') != 'none')
							{
								NKR.shake($('.error_message'));
							}
							else
							{
								$('.error_message').fadeIn();
							}
						}
					}, 'json');
				break;

				case 'addTopic':
					var questionId = $('#cloud-topic-list').attr('data-question-id');

					$('body').on('click', '.cloud-topic-item', function(e) {
						e.preventDefault();

						var topicItem = $(this);
						var topicId = topicItem.attr('data-topic-id');

						$.get(G_BASE_URL + '/topic/ajax/toggle_question_topic_relation/topic_id-' + topicId + '__question_id-' + questionId, function (result) {
							topicItem.toggleClass('active', result['has_relation']);
						}, 'json');
					});

					NKR.load_list_view(G_BASE_URL + '/topic/ajax/get_question_cloud_topic_list/question_id-' + questionId, $('#topic-cloud-load-more'), $('#cloud-topic-list ul'), 2);
					$.get(G_BASE_URL + '/topic/ajax/get_question_cloud_topic_list/question_id-' + questionId, function (result) {
						$('#cloud-topic-list ul').html(result);
					});
				break;
			}

			$(".alert-box").modal('show');
		}
	},

	// 兼容placeholder
	check_placeholder: function(selector)
	{
		$.each(selector, function()
		{
			if (typeof ($(this).attr("placeholder")) != "undefined")
			{
				$(this).attr('data-placeholder', 'true');

				if ($(this).val() == '')
				{
					$(this).addClass('aw-placeholder').val($(this).attr("placeholder"));
				}

				$(this).focus(function () {
					if ($(this).val() == $(this).attr('placeholder'))
					{
						$(this).removeClass('aw-placeholder').val('');
					}
				});

				$(this).blur(function () {
					if ($(this).val() == '')
					{
						$(this).addClass('aw-placeholder').val($(this).attr('placeholder'));
					}
				});
			}
		});
	},

	// 回复背景高亮
	hightlight: function(selector, class_name)
	{
		if (selector.hasClass(class_name))
		{
			return true;
		}

		var hightlight_timer_front = setInterval(function ()
		{
			selector.addClass(class_name);
		}, 500);

		var hightlight_timer_background = setInterval(function ()
		{
			selector.removeClass(class_name);
		}, 600);

		setTimeout(function ()
		{
			clearInterval(hightlight_timer_front);
			clearInterval(hightlight_timer_background);

			selector.addClass(class_name);
		}, 1200);

		setTimeout(function ()
		{
			selector.removeClass(class_name);
		}, 6000);
	},

	nl2br: function(str)
	{
		return str.replace(new RegExp("\r\n|\n\r|\r|\n", "g"), "<br />");
	},

	content_switcher: function(hide_el, show_el)
	{
		hide_el.hide();
		show_el.removeClass('hide');
		show_el.fadeIn();
	},

	htmlspecialchars: function(text)
	{
		return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
	},

	/*
	 * 用户头像提示box效果
	 *  @params
	 *  type : user/topic
	 *	nTop    : 焦点到浏览器上边距
	 *	nRight  : 焦点到浏览器右边距
	 *	nBottom : 焦点到浏览器下边距
	 *	left    : 焦点距离文档左偏移量
	 *	top     : 焦点距离文档上偏移量
	 **
	 */
	show_card_box: function(selector, type, time) //selector -> .aw-user-name/.topic-tag
	{
		if (!time)
		{
			var time = 300;
		}

		$(document).on('mouseover', selector, function ()
		{
			clearTimeout(NKR.G.card_box_hide_timer);
			var _this = $(this);
			NKR.G.card_box_show_timer = setTimeout(function ()
			{
				//判断用户id or 话题id 是否存在
				if (_this.attr('data-id'))
				{
					 switch (type)
					{
						case 'user' :
							//检查是否有缓存
							if (NKR.G.cashUserData.length == 0)
							{
								_getdata('user', '/people/ajax/user_info/uid-');
							}
							else
							{
								var flag = 0;
								//遍历缓存中是否含有此id的数据
								_checkcash('user');
								if (flag == 0)
								{
									_getdata('user', '/people/ajax/user_info/uid-');
								}
							}
						break;

						case 'topic' :
							//检查是否有缓存
							if (NKR.G.cashTopicData.length == 0)
							{
								_getdata('topic', '/topic/ajax/topic_info/topic_id-');
							}
							else
							{
								var flag = 0;
								//遍历缓存中是否含有此id的数据
								_checkcash('topic');
								if (flag == 0)
								{
									_getdata('topic', '/topic/ajax/topic_info/topic_id-');
								}
							}
						break;
					}
				}

				//获取数据
				function _getdata(type, url)
				{
					if (type == 'user')
					{
						$.get(G_BASE_URL + url + _this.attr('data-id'), function(result)
						{
							var focus = result.focus, verified = result.verified, focusTxt;

							if (focus == 1)
							{
								focus = 'following';
								focusIcon = 'md-check'
								focusTxt = '正在关注';
							}
							else
							{
								focus = '';
								focusIcon = 'md-add';
								focusTxt = '添加关注';
							}

							if(result.verified == 'enterprise')
							{
								verified_enterprise = 'icon-v i-ve';
								verified_title = '企业认证';
							}
							else if(result.verified == 'personal')
							{
								verified_enterprise = 'icon-v';
								verified_title = '个人认证';
							}
							else
							{
								verified_enterprise = verified_title = '';
							}

							var question_count_url = (G_BASE_URL + '/people/questions/id-' + result.uid + '__type-publish');
							var quiz_count_url = (G_BASE_URL + '/people/questions/id-' + result.uid + '__type-answered');
							var answer_count_url = (G_BASE_URL + '/people/questions/id-' + result.uid + '__type-comments');
							 

							//动态插入盒子
							$('#aw-ajax-box').html(Hogan.compile(AW_TEMPLATE.userCard).render(
							{
								'verified_enterprise' : verified_enterprise,
								'verified_title' : verified_title,
								'uid': result.uid,
								'avatar_file': result.avatar_file,
								'user_name': result.user_name,
								'reputation': result.reputation,
								'agree_count': result.agree_count,
								'signature': result.signature,
								'url' : result.url,
								'category_enable' : result.category_enable,
								'focus': focus,
								'focusIcon': focusIcon,
								'focusTxt': focusTxt,
								'ask_name': "'" + result.user_name + "'",
								'fansCount': result.fans_count,
								'success_ratio': (result.success_ratio * 100).toFixed(1),
								'poft_ratio': (result.poft_ratio * 100).toFixed(1),
								'question_count': result.question_count,
								'answer_count': result.answer_count,
								'quiz_count': result.quiz_count,
								'question_count_url': question_count_url,
								'quiz_count_url': quiz_count_url,
								'answer_count_url': answer_count_url
							}));

							//判断是否为游客or自己
							if (G_USER_ID == '' || G_USER_ID == result.uid || result.uid < 0)
							{
								$('#aw-card-tips-user .mod-footer').hide();
							}
							_init();
							//缓存
							NKR.G.cashUserData.push($('#aw-ajax-box').html());
						}, 'json');
					}
					if (type == 'topic')
					{
						$.get(G_BASE_URL + url + _this.attr('data-id'), function(result)
						{
							var focus = result.focus,
								focusTxt;
								if (focus == false)
								{
									focus = '';
									focusTxt = _t('关注');
								}
								else
								{
									focus = 'active';
									focusTxt = _t('取消关注');
								}
								//动态插入盒子
								$('#aw-ajax-box').html(Hogan.compile(AW_TEMPLATE.topicCard).render(
								{
									'topic_id': result.topic_id,
									'topic_pic': result.topic_pic,
									'topic_title': result.topic_title,
									'topic_description': result.topic_description,
									'discuss_count': result.discuss_count,
									'focus_count': result.focus_count,
									'focus': focus,
									'focusTxt': focusTxt,
									'url' : result.url,
									'fansCount': result.fans_count
								}));
								//判断是否为游客
								if (G_USER_ID == '')
								{
									$('#aw-card-tips .follow').hide();
								}
								_init();
								//缓存
								NKR.G.cashTopicData.push($('#aw-ajax-box').html());
						}, 'json');
					}
				}

				//检测缓存
				function _checkcash(type)
				{
					if (type == 'user')
					{
						$.each(NKR.G.cashUserData, function (i, a)
						{
							if (a.match('data-id="' + _this.attr('data-id') + '"'))
							{
								$('#aw-ajax-box').html(a);
								$('#aw-card-tips').removeAttr('style');
								_init();
								flag = 1;
							}
						});
					}
					if (type == 'topic')
					{

						$.each(NKR.G.cashTopicData, function (i, a)
						{
							if (a.match('data-id="' + _this.attr('data-id') + '"'))
							{
								$('#aw-ajax-box').html(a);
								$('#aw-card-tips').removeAttr('style');
								_init();
								flag = 1;
							}
						});
					}
				}

				//初始化
				function _init()
				{

					if ($('.user-pie-ratio')[0]) {
			            NKR.showpie('user-pie-ratio', 100);
			        }

					var left = _this.offset().left,
						top = _this.offset().top + _this.height() + 5,
						nTop = _this.offset().top - $(window).scrollTop();

					//判断下边距离不足情况
					if (nTop + $('#aw-card-tips').innerHeight() > $(window).height())
					{
						top = _this.offset().top - ($('#aw-card-tips').innerHeight()) - 10;
					}

					//判断右边距离不足情况
					if (left + $('#aw-card-tips').innerWidth() > $(window).width())
					{
						left = _this.offset().left - $('#aw-card-tips').innerWidth() + _this.innerWidth();
					}

					$('#aw-card-tips').css(
					{
						left: left,
						top: top
					}).fadeIn();
				}
			}, time);
		});

		$(document).on('mouseout', selector, function ()
		{
			clearTimeout(NKR.G.card_box_show_timer);
			NKR.G.card_box_hide_timer = setTimeout(function ()
			{
				$('#aw-card-tips').fadeOut();
			}, 600);
		});
	},

	// @人功能
	at_user_lists: function(selector, limit) {
		$(selector).keyup(function (e) {
			var _this = $(this),
				flag = _getCursorPosition($(this)[0]).start;
			if ($(this).val().charAt(flag - 1) == '@')
			{
				_init();
				$('#aw-ajax-box .content_cursor').html($(this).val().substring(0, flag));
			} else
			{
				var lis = $('.aw-invite-dropdown li');
				switch (e.which)
				{
					case 38:
						var _index;
						if (!lis.hasClass('active'))
						{
							lis.eq(lis.length - 1).addClass('active');
						}
						else
						{
							$.each(lis, function (i, e)
							{
								if ($(this).hasClass('active'))
								{
									$(this).removeClass('active');
									if ($(this).index() == 0)
									{
										_index = lis.length - 1;
									}
									else
									{
										_index = $(this).index() - 1;
									}
								}
							});
							lis.eq(_index).addClass('active');
						}
						break;
					case 40:
						var _index;
						if (!lis.hasClass('active'))
						{
							lis.eq(0).addClass('active');
						}
						else
						{
							$.each(lis, function (i, e)
							{
								if ($(this).hasClass('active'))
								{
									$(this).removeClass('active');
									if ($(this).index() == lis.length - 1)
									{
										_index = 0;
									}
									else
									{
										_index = $(this).index() + 1;
									}
								}
							});
							lis.eq(_index).addClass('active');
						}
						break;
					case 13:
						$.each($('.aw-invite-dropdown li'), function (i, e)
						{
							if ($(this).hasClass('active'))
							{
								$(this).click();
							}
						});
						break;
					default:
						if ($('.aw-invite-dropdown')[0])
						{
							var ti = 0;
							for (var i = flag; i > 0; i--)
							{
								if ($(this).val().charAt(i) == "@")
								{
									ti = i;
									break;
								}
							}
							$.get(G_BASE_URL + '/search/ajax/search/?type=users&q=' + encodeURIComponent($(this).val().substring(flag, ti).replace('@', '')) + '&limit=' + limit, function (result)
							{
								if ($('.aw-invite-dropdown')[0])
								{
									if (result.length != 0)
									{
										var html = '';

										$('.aw-invite-dropdown').html('');

										$.each(result, function (i, a)
										{
											html += '<li><img src="' + a.detail.avatar_file + '"/><a>' + a.name + '</a></li>'
										});

										$('.aw-invite-dropdown').append(html);

										_display();

										$('.aw-invite-dropdown li').click(function ()
										{
											_this.val(_this.val().substring(0, ti) + '@' + $(this).find('a').html() + " ").focus();
											$('.aw-invite-dropdown').detach();
										});
									}
									else
									{
										$('.aw-invite-dropdown').hide();
									}
								}
								if (_this.val().length == 0)
								{
									$('.aw-invite-dropdown').hide();
								}
							}, 'json');
						}
				}
			}
		});

		$(selector).keydown(function (e) {
			var key = e.which;
			if ($('.aw-invite-dropdown').is(':visible')) {
				if (key == 38 || key == 40 || key == 13) {
					return false;
				}
			}
		});

		//初始化插入定位符
		function _init() {
			if (!$('.content_cursor')[0]) {
				$('#aw-ajax-box').append('<span class="content_cursor"></span>');
			}
			$('#aw-ajax-box').find('.content_cursor').css({
				'left': parseInt($(selector).offset().left + parseInt($(selector).css('padding-left')) + 2),
				'top': parseInt($(selector).offset().top + parseInt($(selector).css('padding-left')))
			});
			if (!$('.aw-invite-dropdown')[0])
			{
				$('#aw-ajax-box').append('<ul class="aw-invite-dropdown"></ul>');
			}
		};

		//初始化列表和三角型
		function _display() {
			$('.aw-invite-dropdown').css({
				'left': $('.content_cursor').offset().left + $('.content_cursor').innerWidth(),
				'top': $('.content_cursor').offset().top + 24
			}).show();
		};

		//获取当前textarea光标位置
		function _getCursorPosition(textarea)
		{
			var rangeData = {
				text: "",
				start: 0,
				end: 0
			};

			textarea.focus();

			if (textarea.setSelectionRange) { // W3C
				rangeData.start = textarea.selectionStart;
				rangeData.end = textarea.selectionEnd;
				rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
			} else if (document.selection) { // IE
				var i,
					oS = document.selection.createRange(),
					// Don't: oR = textarea.createTextRange()
					oR = document.body.createTextRange();
				oR.moveToElementText(textarea);

				rangeData.text = oS.text;
				rangeData.bookmark = oS.getBookmark();

				// object.moveStart(sUnit [, iCount])
				// Return Value: Integer that returns the number of units moved.
				for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
					// Why? You can alert(textarea.value.length)
					if (textarea.value.charAt(i) == '\n') {
						i++;
					}
				}
				rangeData.start = i;
				rangeData.end = rangeData.text.length + rangeData.start;
			}

			return rangeData;
		};
	},

	// 错误提示效果
	shake: function(selector)
	{
		var length = 6;
		selector.css('position', 'relative');
		for (var i = 1; i <= length; i++)
		{
			if (i % 2 == 0)
			{
				if (i == length)
				{
					selector.animate({ 'left': 0 }, 50);
				}
				else
				{
					selector.animate({ 'left': 10 }, 50);
				}
			}
			else
			{
				selector.animate({ 'left': -10 }, 50);
			}
		}
	}
}

// 全局变量
NKR.G =
{
	cashUserData: [],
	cashTopicData: [],
	card_box_hide_timer: '',
	card_box_show_timer: '',
	dropdown_list_xhr: '',
	loading_timer: '',
	loading_bg_count: 12,
	loading_mini_bg_count: 9,
	notification_timer: '',
	user_quiz_message_timer: ''
}

NKR.User =
{
	// 关注
	
	follow: function(selector, type, data_id)
	{
		if(G_USER_ID <= 0) {
			window.location = G_BASE_URL + '/account/login/';
			return;
		}

		selector.addClass('disabled');

		switch (type)
		{
			case 'question':
				var url = '/question/ajax/focus/';

				var data = {
					'question_id': data_id
				};

				break;

			case 'topic':
				var url = '/topic/ajax/focus_topic/';

				var data = {
					'topic_id': data_id
				};

				break;

			case 'user':
				var url = '/follow/ajax/follow_people/';

				var data = {
					'uid': data_id
				};

				break;
		}

		$.post(G_BASE_URL + url, data, function (result)
		{
			if (result.errno == 1)
			{
				if (result.rsm.type == 'add')
				{
					selector.addClass('following');
				}
				else
				{
					selector.removeClass('following');
				}
			}
			else
			{
				if (result.err)
				{
					NKR.alert(result.err);
				}

				if (result.rsm.url)
				{
					window.location = decodeURIComponent(result.rsm.url);
				}
			}

			selector.removeClass('disabled');

			if (selector.html())
			{
				if (selector.hasClass('following'))
				{
					selector.text('已关注');
				}
				else
				{
					selector.text('+ 关注');
				}
			}
			else
			{
				if (selector.hasClass('following'))
				{
					selector.attr('data-original-title', '正在关注');
				}
				else
				{
					selector.attr('data-original-title', '添加关注');
				}
			}

		}, 'json');
	},

	share_out: function(options)
	{
		var url = url || window.location.href, pic = '';

		if (options.title)
		{
			var title = options.title + ' - ' + G_SITE_NAME;
		}
		else
		{
			var title = $('title').text();
		}

		shareURL = 'http://www.jiathis.com/send/?webid=' + options.webid + '&url=' + url + '&title=' + title +'';

		if (options.content)
		{
			if ($(options.content).find('img').length)
			{
				shareURL = shareURL + '&pic=' + $(options.content).find('img').eq(0).attr('src');
			}
		}

		window.open(shareURL);
	},

	// 删除草稿
	delete_draft: function(item_id, type)
	{
		if (type == 'clean')
		{
			$.post(G_BASE_URL + '/account/ajax/delete_draft/', 'type=' + type, function (result)
			{
				if (result.errno != 1)
				{
					NKR.alert(result.err);
				}
			}, 'json');
		}
		else
		{
			$.post(G_BASE_URL + '/account/ajax/delete_draft/', 'item_id=' + item_id + '&type=' + type, function (result)
			{
				if (result.errno != 1)
				{
					NKR.alert(result.err);
				}
			}, 'json');
		}
	},

	// 赞成投票
	agree_vote: function(selector, user_name, answer_id)
	{
		var $selector = $(selector);
		$.post(G_BASE_URL + '/question/ajax/answer_vote/', 'answer_id=' + answer_id + '&value=1');
		var countElement = $selector.find('.count');
		var textElement = $selector.find('span');
		var agreed = $selector.attr('data-agreed');
		var currentCount = parseInt(countElement.html());
		if(agreed > 0) {
			if(currentCount > 0) {
				countElement.html(currentCount - 1);
			}
			textElement.html('赞同');
			$selector.removeClass('active');
			$selector.attr('data-agreed', 0);
		} else {
			countElement.html(currentCount + 1);
			textElement.html('已赞同');
			$selector.addClass('active');

			$selector.attr('data-agreed', 1);
		}

		// // 判断是否投票过
		// if ($(selector).parents('.aw-item').find('.aw-agree-by').text().match(user_name))
		// {
		// 	$.each($(selector).parents('.aw-item').find('.aw-user-name'), function (i, e)
		// 	{
		// 		if ($(e).html() == user_name)
		// 		{
		// 			if ($(e).prev())
		// 			{
		// 				$(e).prev().remove();
		// 			}
		// 			else
		// 			{
		// 				$(e).next().remove();
		// 			}

		// 			$(e).remove();
		// 		}
		// 	});

		// 	$(selector).removeClass('active');

		// 	if (parseInt($(selector).parents('.operate').find('.count').html()) != 0)
		// 	{
		// 		$(selector).parents('.operate').find('.count').html(parseInt($(selector).parents('.operate').find('.count').html()) - 1);
		// 	}

		// 	if ($(selector).parents('.aw-item').find('.aw-agree-by a').length == 0)
		// 	{
		// 		$(selector).parents('.aw-item').find('.aw-agree-by').hide();
		// 	}
		// }
		// else
		// {
		// 	// 判断是否第一个投票
		// 	if ($(selector).parents('.aw-item').find('.aw-agree-by .aw-user-name').length == 0)
		// 	{
		// 		$(selector).parents('.aw-item').find('.aw-agree-by').append('<a class="aw-user-name">' + user_name + '</a>');
		// 	}
		// 	else
		// 	{
		// 		$(selector).parents('.aw-item').find('.aw-agree-by').append('<em>、</em><a class="aw-user-name">' + user_name + '</a>');
		// 	}

		// 	$(selector).parents('.operate').find('.count').html(parseInt($(selector).parents('.operate').find('.count').html()) + 1);

		// 	$(selector).parents('.aw-item').find('.aw-agree-by').show();

		// 	$(selector).parents('.operate').find('a.active').removeClass('active');

		// 	$(selector).addClass('active');
		// }
	},

	// 反对投票
	disagree_vote: function(selector, user_name, answer_id)
	{
		$.post(G_BASE_URL + '/question/ajax/answer_vote/', 'answer_id=' + answer_id + '&value=-1', function (result) {});

		if ($(selector).hasClass('active'))
		{
			$(selector).removeClass('active');
		}
		else
		{
			// 判断是否有赞同过
			if ($(selector).parents('.operate').find('.agree').hasClass('active'))
			{
				// 删除赞同操作
				$.each($(selector).parents('.aw-item').find('.aw-user-name'), function (i, e)
				{
					if ($(e).html() == user_name)
					{
						if ($(e).prev())
						{
							$(e).prev().remove();
						}
						else
						{
							$(e).next().remove();
						}

						$(e).remove();
					}
				});

				// 判断赞同来自内是否有人
				if ($(selector).parents('.aw-item').find('.aw-agree-by a').length == 0)
				{
					$(selector).parents('.aw-item').find('.aw-agree-by').hide();
				}

				$(selector).parents('.operate').find('.count').html(parseInt($(selector).parents('.operate').find('.count').html()) - 1);

				$(selector).parents('.operate').find('.agree').removeClass('active');

				$(selector).addClass('active');
			}
			else
			{
				$(selector).addClass('active');
			}
		}
	},

	// 问题不感兴趣
	question_uninterested: function(selector, question_id)
	{
		selector.fadeOut();

		$.post(G_BASE_URL + '/question/ajax/uninterested/', 'question_id=' + question_id, function (result)
		{
			if (result.errno != '1')
			{
				NKR.alert(result.err);
			}
		}, 'json');
	},

	// 回复折叠
	answer_force_fold: function(selector, answer_id)
	{
		$.post(G_BASE_URL + '/question/ajax/answer_force_fold/', 'answer_id=' + answer_id, function (result) {
			if (result.errno != 1)
			{
				NKR.alert(result.err);
			}
			else if (result.errno == 1)
			{
				if (result.rsm.action == 'fold')
				{
					selector.html(selector.html().replace(_t('折叠'), _t('撤消折叠')));
				}
				else
				{
					selector.html(selector.html().replace(_t('撤消折叠'), _t('折叠')));
				}
			}
		}, 'json');
	},

	// 删除别人邀请我回复的问题
	question_invite_delete: function(selector, question_invite_id)
	{
		$.post(G_BASE_URL + '/question/ajax/question_invite_delete/', 'question_invite_id=' + question_invite_id, function (result)
		{
			if (result.errno == 1)
			{
				selector.fadeOut();
			}
			else
			{
				NKR.alert(result.rsm.err);
			}
		}, 'json');
	},

	// 邀请用户回答问题
	invite_user: function(selector, img)
	{
		if(G_USER_ID <= 0) {
			window.location = G_BASE_URL + '/account/login/';
			return;
		}
		
		$.post(G_BASE_URL + '/question/ajax/save_invite/',
		{
			'question_id': QUESTION_ID,
			'uid': selector.attr('data-id')
		}, function (result)
		{
			if (result.errno != -1)
			{
				if (selector.parents('.aw-invite-box').find('.invite-list a').length == 0)
				{
					selector.parents('.aw-invite-box').find('.invite-list').show();
				}
				selector.parents('.aw-invite-box').find('.invite-list').append(' <a class="text-color-999 invite-list-user" data-toggle="tooltip" data-placement="bottom" data-original-title="'+ selector.attr('data-value') +'"><img src='+ img +' /></a>');
				selector.addClass('active').attr('onclick','NKR.User.disinvite_user($(this))').text('取消邀请');
				selector.parents('.aw-question-detail').find('.aw-invite-replay .badge').text(parseInt(selector.parents('.aw-question-detail').find('.aw-invite-replay .badge').text()) + 1);
			}
			else if (result.errno == -1)
			{
				NKR.alert(result.err);
			}
		}, 'json');
	},

	// 取消邀请用户回答问题
	disinvite_user: function(selector)
	{
		$.get(G_BASE_URL + '/question/ajax/cancel_question_invite/question_id-' + QUESTION_ID + "__recipients_uid-" + selector.attr('data-id'), function (result)
		{
			if (result.errno != -1)
			{
				$.each($('.aw-question-detail .invite-list a'), function (i, e)
				{
					if ($(this).attr('data-original-title') == selector.parents('.main').find('.aw-user-name').text())
					{
						$(this).detach();
					}
				});
				selector.removeClass('active').attr('onclick','NKR.User.invite_user($(this),$(this).parents(\'li\').find(\'img\').attr(\'src\'))').text('邀请');
				selector.parents('.aw-question-detail').find('.aw-invite-replay .badge').text(parseInt(selector.parents('.aw-question-detail').find('.aw-invite-replay .badge').text()) - 1);
				if (selector.parents('.aw-invite-box').find('.invite-list').children().length == 0)
				{
					selector.parents('.aw-invite-box').find('.invite-list').hide();
				}
			}
		});
	},

	// 问题感谢
	question_thanks: function(selector, question_id)
	{
		$.post(G_BASE_URL + '/question/ajax/question_thanks/', 'question_id=' + question_id, function (result)
		{
			if (result.errno != 1)
			{
				NKR.alert(result.err);
			}
			else if (result.rsm.action == 'add')
			{
				selector.html(selector.html().replace(_t('感谢'), _t('已感谢')));
				selector.removeAttr('onclick');
			}
			else
			{
				selector.html(selector.html().replace(_t('已感谢'), _t('感谢')));
			}
		}, 'json');
	},

	// 感谢评论回复者
	answer_user_rate: function(selector, type, answer_id)
	{
		$.post(G_BASE_URL + '/question/ajax/question_answer_rate/', 'type=' + type + '&answer_id=' + answer_id, function (result)
		{
			if (result.errno != 1)
			{
				NKR.alert(result.err);
			}
			else if (result.errno == 1)
			{
				switch (type)
				{
				case 'thanks':
					if (result.rsm.action == 'add')
					{
						selector.html(selector.html().replace(_t('感谢'), _t('已感谢')));
						selector.removeAttr('onclick');
					}
					else
					{
						selector.html(selector.html().replace(_t('已感谢'), _t('感谢')));
					}
					break;

				case 'uninterested':
					if (result.rsm.action == 'add')
					{
						selector.html(selector.html().replace(_t('没有帮助'), _t('撤消没有帮助')));
					}
					else
					{
						selector.html(selector.html().replace(_t('撤消没有帮助'), _t('没有帮助')));
					}
					break;
				}
			}
		}, 'json');
	},

	// 删除问题评论

	remove_answer: function(selector, answer_id) {
		$.get(G_BASE_URL + '/question/ajax/remove_answer/answer_id-' + answer_id);
		selector.parents('li.comment-item[id=comment-id-' + answer_id + ']').addClass('animated fadeOutLeft').fadeOut(300, function(){$(this).remove(); });
	},

	// 提交评论
	save_comment: function(selector)
	{
		selector.attr('disabled', 'disabled');
		NKR.ajax_post(selector.parents('form'), NKR.ajax_processer, 'comments_form');
	},

	// 删除评论
	remove_comment: function(selector, type, comment_id)
	{
		$.get(G_BASE_URL + '/question/ajax/remove_comment/type-' + type + '__comment_id-' + comment_id);
		selector.parents('.ci-subitem').fadeOut(300, function(){$(this).remove();});
	},

	// 文章赞同
	article_vote: function(selector, article_id, rating)
	{
		if(G_USER_ID <= 0) {
			window.location = G_BASE_URL + '/account/login/';
			return;
		}

		NKR.loading('show');

		if (selector.hasClass('active'))
		{
			var rating = 0;
		}

		$.post(G_BASE_URL + '/article/ajax/article_vote/', 'type=article&item_id=' + article_id + '&rating=' + rating, function (result) {

			NKR.loading('hide');

			if (result.errno != 1) {
				NKR.alert(result.err);
			}
			else {
				if (rating == 0) {
					selector.removeClass('active').find('.ar-agree-count').html(parseInt(selector.find('.ar-agree-count').html()) - 1);
				}
				else if (rating == -1) {
					if (selector.hasClass('active')) {
						selector.removeClass('active').find('.ar-agree-count').html(parseInt(selector.find('.ar-agree-count').html()) - 1);
					}
				} else {
					selector.addClass('active').find('.ar-agree-count').html(parseInt(selector.find('.ar-agree-count').html()) + 1);
				}
			}
		}, 'json');
	},

	// 文章评论赞同
	article_comment_vote: function(selector, comment_id, rating)
	{
		if(G_USER_ID <= 0) {
			window.location = G_BASE_URL + '/account/login/';
			return;
		}

		NKR.loading('show');

		var textSelector = selector.find('span');
		if (selector.hasClass('active'))
		{
			var rating = 0;
		}

		$.post(G_BASE_URL + '/article/ajax/article_vote/', 'type=comment&item_id=' + comment_id + '&rating=' + rating, function (result)
		{
			NKR.loading('hide');

			if (result.errno != 1)
			{
				NKR.alert(result.err);
			}
			else
			{
				if (rating == 0)
				{
					selector.attr('data-original-title', '赞同').removeClass('active').find('b').html(parseInt(selector.find('b').html()) - 1);;
					textSelector.html('赞同');
				}
				else
				{
					selector.attr('data-original-title', '取消赞同').addClass('active').find('b').html(parseInt(selector.find('b').html()) + 1);;
					textSelector.html('已赞同');
				}
			}
		}, 'json');
	},

	// 创建收藏标签
	add_favorite_tag: function()
	{
		$.post(G_BASE_URL + '/favorite/ajax/update_favorite_tag/', {
			'item_id' : $('#favorite_form input[name="item_id"]').val(),
			'item_type' : $('#favorite_form input[name="item_type"]').val(),
			'tags' : $('#favorite_form .add-input').val()
		}, function (result)
		{
			if(result.errno == -1)
			{
				NKR.alert(result.err);
			}
			else if (result.errno == 1)
			{
				$('.aw-favorite-box .aw-favorite-tag-list').show();
				$('.aw-favorite-box .aw-favorite-tag-add').hide();

				$('.aw-favorite-tag-list ul').prepend('<li class="active"><a data-value="' + $('#favorite_form .add-input').val() + '"><i class="md md-check"></i><span class="title">' + $('#favorite_form .add-input').val() + '</span></a></li>');
			}
		}, 'json');
	}
}

NKR.Dropdown =
{
	// 下拉菜单功能绑定
	bind_dropdown_list: function(selector, type)
	{
		if (type == 'search')
		{
			$(selector).focus(function()
			{
				// $(selector).parent().find('.aw-dropdown').show();
				$(selector).closest('.dropdown').addClass('open');
			});
		}

		$(selector).keyup(function(e)
		{
			$(selector).closest('.dropdown').addClass('open');

			if (type == 'search')
			{
				$(selector).parent().find('.search').show().children('a').text($(selector).val());
			}

			if ($(selector).val().length >= 1)
			{
				if (e.which != 38 && e.which != 40 && e.which != 188 && e.which != 13)
				{
					NKR.Dropdown.get_dropdown_list($(this), type, $(selector).val());
				}
			}
			else
			{
			   $(selector).closest('.dropdown').removeClass('open');
			}

			if (type == 'topic')
			{
				// 逗号或回车提交
				if (e.which == 188)
				{
					if ($('.aw-edit-topic-box #aw_edit_topic_title').val() != ',')
					{
						$('.aw-edit-topic-box #aw_edit_topic_title').val( $('.aw-edit-topic-box #aw_edit_topic_title').val().substring(0,$('.aw-edit-topic-box #aw_edit_topic_title').val().length-1));
						$('.aw-edit-topic-box .aw-dropdown').hide();
						$('.aw-edit-topic-box .add').click();
					}
					return false;
				}

				// 回车提交
				if (e.which == 13)
				{
					$('.aw-edit-topic-box .aw-dropdown').hide();
					$('.aw-edit-topic-box .add').click();
					return false;
				}

				var lis = $(selector).parent().find('.aw-dropdown-list li');

				//键盘往下
				if (e.which == 40 && lis.is(':visible'))
				{
					var _index;
					if (!lis.hasClass('active'))
					{
						lis.eq(0).addClass('active');
					}
					else
					{
						$.each(lis, function (i, e)
						{
							if ($(this).hasClass('active'))
							{
								$(this).removeClass('active');
								if ($(this).index() == lis.length - 1)
								{
									_index = 0;
								}
								else
								{
									_index = $(this).index() + 1;
								}
							}
						});
						lis.eq(_index).addClass('active');
						$(selector).val(lis.eq(_index).text());
					}
				}

				//键盘往上
				if (e.which == 38 && lis.is(':visible'))
				{
					var _index;
					if (!lis.hasClass('active'))
					{
						lis.eq(lis.length - 1).addClass('active');
					}
					else
					{
						$.each(lis, function (i, e)
						{
							if ($(this).hasClass('active'))
							{
								$(this).removeClass('active');
								if ($(this).index() == 0)
								{
									_index = lis.length - 1;
								}
								else
								{
									_index = $(this).index() - 1;
								}
							}
						});
						lis.eq(_index).addClass('active');
						$(selector).val(lis.eq(_index).text());
					}

				}
			}
		});

		$(selector).blur(function()
		{
			// $(selector).closest('.dropdown').removeClass('open');
		});
	},

	// 插入下拉菜单
	set_dropdown_list: function(selector, data, selected)
	{
		$(selector).append(Hogan.compile(AW_TEMPLATE.dropdownList).render(
		{
			'items': data
		}));

		$(selector + ' .aw-dropdown-list li a').click(function ()
		{
			$('#aw-topic-tags-select').html($(this).text());
		});

		if (selected)
		{
			$(selector + " .dropdown-menu li a[data-value='" + selected + "']").click();
		}
	},

	/* 下拉菜单数据获取 */
	/*
	*    type : search, publish, redirect, invite, inbox, topic_question, topic
	*/
	get_dropdown_list: function(selector, type, data)
	{
		if (NKR.G.dropdown_list_xhr != '')
		{
			NKR.G.dropdown_list_xhr.abort(); // 中止上一次ajax请求
		}
		var url;
		var noresult = '没有找到相关结果';
		switch (type)
		{
			case 'search' :
				url = G_BASE_URL + '/search/ajax/search/?q=' + encodeURIComponent(data) + '&limit=5';
			break;

			case 'publish' :
				url = G_BASE_URL + '/search/ajax/search/?type=questions&q=' + encodeURIComponent(data) + '&limit=5';
			break;

			case 'redirect' :
				url = G_BASE_URL + '/search/ajax/search/?q=' + encodeURIComponent(data) + '&type=questions&limit=30&is_question_id=1';
			break;

			case 'invite' :
				url = G_BASE_URL + '/search/ajax/search/?type=users&q=' + encodeURIComponent(data) + '&limit=10';
				noresult = '没有找到你想邀请的人';
				break;
			case 'inbox' :
				url = G_BASE_URL + '/search/ajax/search/?type=users&q=' + encodeURIComponent(data) + '&limit=10';
				noresult = '没有找到相关的人';
			break;

			case 'topic_question' :
				url = G_BASE_URL + '/search/ajax/search/?type=questions,articles&q=' + encodeURIComponent(data) + '&topic_ids=' + CONTENTS_RELATED_TOPIC_IDS + '&limit=50';
			break;

			case 'topic' :
				url = G_BASE_URL + '/search/ajax/search/?type=topics&q=' + encodeURIComponent(data) + '&limit=10';
			break;

			case 'questions' :
				url = G_BASE_URL + '/search/ajax/search/?type=questions&q=' + encodeURIComponent(data) + '&limit=10';
			break;

			case 'articles' :
				url = G_BASE_URL + '/search/ajax/search/?type=articles&q=' + encodeURIComponent(data) + '&limit=10';
			break;

		}

		NKR.G.dropdown_list_xhr = $.get(url, function (result)
		{
			if (result.length != 0 && NKR.G.dropdown_list_xhr != undefined)
			{
				$(selector).parent().find('.aw-dropdown-list').html(''); // 清空内容
				switch (type)
				{
					case 'search' :
						$.each(result, function (i, a)
						{
							switch (a.type)
							{
								case 'questions':
									if (a.detail.best_answer > 0)
									{
										var active = 'active';
									}
									else
									{
										var active = ''
									}

									$(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.searchDropdownListQuestions).render(
									{
										'url': a.url,
										'active': active,
										'content': a.name,
										'discuss_count': a.detail.answer_count
									}));
								break;

								case 'articles':
									$(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.searchDropdownListArticles).render(
									{
										'url': a.url,
										'content': a.name,
										'comments': a.detail.comments
									}));
								break;

								case 'topics':
									$(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.searchDropdownListTopics).render(
									{
										'url': a.url,
										'name': a.name,
										'focus_count': a.detail.focus_count,
										'topic_id': a.detail.topic_id
									}));
								break;

								case 'users':
									var signature = a.detail.signature;

									$(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.searchDropdownListUsers).render(
									{
										'url': a.url,
										'img': a.detail.avatar_file,
										'name': a.name,
										'intro': signature
									}));
								break;
							}
						});
					break;

					case 'publish' :
					case 'topic_question' :
						$.each(result, function (i, a)
						{
							$(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.questionDropdownList).render(
							{
								'url': a.url,
								'name': a.name
							}));
						});
						break;

					case 'topic' :
						$.each(result, function (i, a)
						{
							$(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.editTopicDorpdownList).render(
							{
								'name': a['name']
							}));
						});
						break;

					case 'redirect' :
						$.each(result, function (i, a)
						{
							$(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.questionRedirectList).render(
							{
								'url': "'" + G_BASE_URL + "/question/ajax/redirect/', 'item_id=" + $(selector).attr('data-id') + "&target_id=" + a['search_id'] + "'",
								'name': a['name']
							}));
						});
						break;

					case 'questions' :
					case 'articles' :
						$.each(result, function (i, a)
						{
							$(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.questionDropdownList).render(
							{
								'url': '#',
								'name': a['name']
							}));
						});
						break;

						$(selector).parent().find('.aw-dropdown-list li').click(function()
						{
							$('.aw-question-list').append('<li data-id="'+$(this).attr('data-id')+'"><div class="col-sm-9">' + $(this).html() + '</div> <div class="col-sm-3"><a class="btn btn-danger btn-xs">删除</a></div></li>');

							$('.aw-question-list li').find("a").attr('href',function(){
								return $(this).attr("_href")

							});

							if ($('.question_ids').val() == '')
							{
								$('.question_ids').val($(this).attr('data-id') + ',');
							}
							else
							{
								$('.question_ids').val($('.question_ids').val() + $(this).attr('data-id') + ',');
							}
							$(".alert-box").modal('hide');
						});

						break;

					case 'inbox' :
						$.each(result, function (i, a)
							{
								var signature = a.detail.signature;

								$(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.inboxDropdownList).render(
								{
									'uid': a.uid,
									'name': a.name,
									'img': a.detail.avatar_file,
									'intro': signature
								}));
							});
						break;
					case 'invite' :
						$.each(result, function (i, a)
						{
							var signature = a.detail.signature;

							$(selector).parent().find('.aw-dropdown-list').append(Hogan.compile(AW_TEMPLATE.inviteDropdownList).render(
							{
								'uid': a.uid,
								'name': a.name,
								'img': a.detail.avatar_file,
								'intro': signature,
								'url': a.url
							}));
						});
						break;
				}

				if (type == 'publish')
				{
					$(selector).parent().find('.aw-publish-suggest-question, .aw-publish-suggest-question .aw-dropdown-list').show();
				}
				else
				{
					$(selector).parent().find('.aw-dropdown, .aw-dropdown-list').show().children().show();
					$(selector).parent().find('.title').hide();
					// 关键词高亮
					$(selector).parent().find('.aw-dropdown-list li.question a').highText(data, 'b', 'active');
				}
			}else
			{
				$(selector).parent().find('.aw-dropdown').show().end().find('.title').html(noresult).show();
				$(selector).parent().find('.aw-dropdown-list, .aw-publish-suggest-question').hide();
			}
		}, 'json');

	}
}

NKR.Notifcation =
{
	load: function() {
		if (G_USER_ID > 0 && $("#header-notifications").length) {
			$.get(G_BASE_URL + '/notifications/ajax/header_list/flag-0__limit-5', function (result) {
				if (result.length) {
					$("#header-notifications").html(result);
				}
				else {
					$("#header-notifications").html('<p class="no-notification">没有未读消息</p>');
				}
			});
		}
	},

	// 检测通知

	check_notifications: function()
	{
		// 检测登录状态
		if (G_USER_ID == 0)
		{
			clearInterval(NKR.G.notification_timer);
			return false;
		}

		$.get(G_BASE_URL + '/home/ajax/notifications/', function (result)
		{
			$('#inbox_unread').html(Number(result.rsm.inbox_num));
			$('#inbox_unread_mobile').html(Number(result.rsm.inbox_num));

			var last_unread_notification = G_UNREAD_NOTIFICATION;

			G_UNREAD_NOTIFICATION = Number(result.rsm.notifications_num);

			if (G_UNREAD_NOTIFICATION > 0)
			{
				if (G_UNREAD_NOTIFICATION != last_unread_notification)
				{
					// 加载消息列表
					NKR.Message.load_notification_list();

					// 给导航label添加未读消息数量
					$('#notifications_unread').html(G_UNREAD_NOTIFICATION);

					// 给移动版增加未读消息数量
					$('#notifications_unread_mobile').html(G_UNREAD_NOTIFICATION);
				}

				var total_unreads = (Number(result.rsm.notifications_num) + Number(result.rsm.inbox_num));

				document.title = '(' + total_unreads + ') ' + document_title;

				$('#notifications_unread').show();
				$('#notifications_unread_mobile').show();
			}
			else
			{
				if ($('#header_notification_list').length)
				{
					$("#header_notification_list").html('');
				}

				if ($("#index_notification").length)
				{
					$("#index_notification").fadeOut();
				}

				document.title = document_title;

				$('#notifications_unread').hide();
				$('#notifications_unread_mobile').hide();
			}

			// 私信
			if (Number(result.rsm.inbox_num) > 0)
			{
				$('#inbox_unread').removeClass('hide');
				$('#inbox_unread_mobile').removeClass('hide');
			}
			else
			{
				$('#inbox_unread').addClass('hide');
				$('#inbox_unread_mobile').addClass('hide');
			}

		}, 'json');
	},

	// 阅读通知
	read_notification: function(selector, notification_id , reload)
	{
		if (notification_id)
		{
			selector.remove();

			var url = G_BASE_URL + '/notifications/ajax/read_notification/notification_id-' + notification_id;
		}
		else
		{
			if ($("#index_notification").length)
			{
				$("#index_notification").fadeOut();
			}

			var url = G_BASE_URL + '/notifications/ajax/read_notification/';
		}

		$.get(url, function (result)
		{
			NKR.Message.check_notifications();

			if (reload)
			{
				window.location.reload();
			}
		});
	},

	// // 重新加载通知列表
	// load_notification_list: function()
	// {
	// 	if ($("#index_notification").length)
	// 	{
	// 		// 给首页通知box内label添加未读消息数量
	// 		$("#index_notification").fadeIn().find('[name=notification_unread_num]').html(G_UNREAD_NOTIFICATION);

	// 		$('#index_notification ul#notification_list').html('<p align="center" style="padding: 15px 0"><img src="' + G_STATIC_URL + '/common/loading_b.gif"/></p>');

	// 		$.get(G_BASE_URL + '/notifications/ajax/list/flag-0__page-0', function (result)
	// 		{
	// 			$('#index_notification ul#notification_list').html(result);

	// 			NKR.Message.notification_show(5);
	// 		});
	// 	}

	// 	if ($("#header_notification_list").length)
	// 	{
	// 		$.get(G_BASE_URL + '/notifications/ajax/list/flag-0__limit-5__template-header_list', function (result)
	// 		{
	// 			if (result.length)
	// 			{
	// 				$("#header_notification_list").html(result);
	// 			}
	// 			else
	// 			{
	// 				$("#header_notification_list").html('<div class="aw-padding10" align="center">' + _t('没有未读通知') + '</div>');
	// 			}
	// 		});
	// 	}
	// },

	// 控制通知数量
	notification_show: function(length)
	{
		if ($('#index_notification').length > 0)
		{
			if ($('#index_notification ul#notification_list li').length == 0)
			{
				$('#index_notification').fadeOut();
			}
			else
			{
				$('#index_notification ul#notification_list li').each(function (i, e)
				{
					if (i < length)
					{
						$(e).show();
					}
					else
					{
						$(e).hide();
					}
				});
			}
		}
	}
}

NKR.Init =
{
	// 初始化问题评论框
	init_comment_box: function(selector)
	{
		$(document).on('click', selector, function ()
		{
			$(this).parents('.aw-question-detail').find('.aw-invite-box, .aw-question-related-box').hide();
			if (typeof COMMENT_UNFOLD != 'undefined')
			{
				if (COMMENT_UNFOLD == 'all' && $(this).attr('data-comment-count') == 0 && $(this).attr('data-first-click') == 'hide')
				{
					$(this).removeAttr('data-first-click');
					return false;
				}
			}

			if (!$(this).attr('data-type') || !$(this).attr('data-id'))
			{
				return true;
			}

			var comment_box_id = '#aw-comment-box-' + $(this).attr('data-type') + '-' + 　$(this).attr('data-id');

			if ($(comment_box_id).length)
			{
				if ($(comment_box_id).css('display') == 'none')
				{
					$(this).addClass('active');

					$(comment_box_id).fadeIn();
				}
				else
				{
					$(this).removeClass('active');
					$(comment_box_id).fadeOut();
				}
			}
			else
			{
				// 动态插入commentBox
				switch ($(this).attr('data-type'))
				{
					case 'question':
						var comment_form_action = G_BASE_URL + '/question/ajax/save_question_comment/question_id-' + $(this).attr('data-id');
						var comment_data_url = G_BASE_URL + '/question/ajax/get_question_comments/question_id-' + $(this).attr('data-id');
						break;

					case 'answer':
						var comment_form_action = G_BASE_URL + '/question/ajax/save_answer_comment/answer_id-' + $(this).attr('data-id');
						var comment_data_url = G_BASE_URL + '/question/ajax/get_answer_comments/answer_id-' + $(this).attr('data-id');
						break;
				}

				if (G_USER_ID)
				{
					$(this).parents('.aw-item').find('.mod-footer').append(Hogan.compile(AW_TEMPLATE.commentBox).render(
					{
						'comment_form_id': comment_box_id.replace('#', ''),
						'comment_form_action': comment_form_action
					}));

					$(comment_box_id).find('.aw-comment-txt').bind(
					{
						focus: function ()
						{
							$(comment_box_id).find('.aw-comment-box-btn').show();
						},

						blur: function ()
						{
							if ($(this).val() == '')
							{
								$(comment_box_id).find('.aw-comment-box-btn').hide();
							}
						}
					});

					$(comment_box_id).find('.close-comment-box').click(function ()
					{
						$(comment_box_id).fadeOut();
						$(comment_box_id).find('.aw-comment-txt').css('height', $(this).css('line-height'));
					});
				}
				else
				{
					$(this).parents('.aw-item').find('.mod-footer').append(Hogan.compile(AW_TEMPLATE.commentBoxClose).render(
					{
						'comment_form_id': comment_box_id.replace('#', ''),
						'comment_form_action': comment_form_action
					}));
				}

				// 判断是否有评论数据
				$.get(comment_data_url, function (result)
				{
					if ($.trim(result) == '')
					{
						result = '<div align="center" class="aw-padding10">' + _t('暂无评论') + '</div>';
					}

					$(comment_box_id).find('.aw-comment-list').html(result);
				});

				// textarae自动增高
				$(comment_box_id).find('.aw-comment-txt').autosize();

				$(this).addClass('active');

				NKR.at_user_lists(comment_box_id + ' .aw-comment-txt', 5);
			}

			NKR.at_user_lists($(this).parents('.aw-item').find('.aw-comment-txt'));
		});
	}
}

function _t(string, replace)
{
	if (typeof (aws_lang) != 'undefined')
	{
		if (typeof (aws_lang[string]) != 'undefined')
		{
			string = aws_lang[string];
		}
	}

	if (replace)
	{
		string = string.replace('%s', replace);
	}

	return string;
};

// jQuery扩展
(function ($)
{
	$.fn.extend(
	{
		insertAtCaret: function (textFeildValue)
		{
			var textObj = $(this).get(0);
			if (document.all && textObj.createTextRange && textObj.caretPos)
			{
				var caretPos = textObj.caretPos;
				caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == '' ?
					textFeildValue + '' : textFeildValue;
			}
			else if (textObj.setSelectionRange)
			{
				var rangeStart = textObj.selectionStart,
					rangeEnd = textObj.selectionEnd,
					tempStr1 = textObj.value.substring(0, rangeStart),
					tempStr2 = textObj.value.substring(rangeEnd);
				textObj.value = tempStr1 + textFeildValue + tempStr2;
				textObj.focus();
				var len = textFeildValue.length;
				textObj.setSelectionRange(rangeStart + len, rangeStart + len);
				textObj.blur();
			}
			else
			{
				textObj.value += textFeildValue;
			}
		},

		highText: function (searchWords, htmlTag, tagClass)
		{
			return this.each(function ()
			{
				$(this).html(function high(replaced, search, htmlTag, tagClass)
				{
					var pattarn = search.replace(/\b(\w+)\b/g, "($1)").replace(/\s+/g, "|");

					return replaced.replace(new RegExp(pattarn, "ig"), function (keyword)
					{
						return $("<" + htmlTag + " class=" + tagClass + ">" + keyword + "</" + htmlTag + ">").outerHTML();
					});
				}($(this).text(), searchWords, htmlTag, tagClass));
			});
		},

		outerHTML: function (s)
		{
			return (s) ? this.before(s).remove() : jQuery("<p>").append(this.eq(0).clone()).html();
		}
	});

	$.extend(
	{
		// 滚动到指定位置
		scrollTo : function (offset, duration, options)
		{
			$('html, body').animate({
				scrollTop: offset
			}, {
				duration: duration,
				queue: options.queue
			});
		}
	})

})(jQuery);
