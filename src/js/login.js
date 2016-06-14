/*-------------------------------------------
    submit actions
---------------------------------------------*/

$(document).ready(function() {
	$('#login_form input').keydown(function(e) {
        if (e.keyCode == 13) {
	        $('#login_submit').click();
	        return false;
        }
    });
});

/*-------------------------------------------
    register actions
---------------------------------------------*/

$(document).ready(function () {
	$('#captcha').attr('src', G_BASE_URL + '/account/captcha/');
});

$(document).ready(function () {
    function is_valid_user_name(inputValue) {
        return (inputValue.length >= 2 && inputValue.length <= 16);
    }

    function is_valid_email(inputValue) {
        var emailreg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;

        return emailreg.test(inputValue);
    }

    function is_valid_password(inputValue) {
        return (inputValue.length >= 6 && inputValue.length <= 17);
    }

    function is_valid_register_form(){
        return (is_valid_user_name($('#register_form input[name=user_name]').val()) && is_valid_email($('#register_form input[name=email]').val()) && is_valid_password($('#register_form input[name=password]').val()));
    }

    function is_valid_sns_register_form(){
        return (is_valid_user_name($('#register_form input[name=user_name]').val()) && is_valid_email($('#register_form input[name=email]').val()));
    }

    /* 注册页面验证 */
        
    function verify_register_form(element)
    {
        $(element).find('[type=text], [type=password]').on({
            focus : function()
            {
                var _this = $(this);
                var inputWrap = _this.parent();
                var tips = _this.attr('tips');
                
                inputWrap.find('.help-block').detach();
                inputWrap.find('.form-control-feedback').detach();
                inputWrap.removeClass('has-error').removeClass('has-success').removeClass('has-feedback');
                if (typeof tips != 'undefined' && tips != '')
                {
                	inputWrap.append('<small class="help-block">' + _this.attr('tips') + '</small>');
                }
            },
            blur : function() {
                var _this = $(this);
                var inputWrap = _this.parent();
                var inputValue = _this.val();
                var errorTips = _this.attr('errortips');
                var isValidValue = false;

                function updateCheckResult() {
                    var helpBlock = inputWrap.find('.help-block');
                    var feedbackBlock = inputWrap.find('.form-control-feedback');

                    helpBlock.detach();
                    feedbackBlock.detach();
                    inputWrap.removeClass('has-error').removeClass('has-warning').removeClass('has-success').removeClass('has-feedback');

                    if(!isValidValue) {
                    	if (typeof errorTips != 'undefined' && errorTips != '') {
                    		inputWrap.addClass('has-error');
                        	inputWrap.append('<small class="help-block">' + errorTips + '</small>');
                    	}
                    } else {
                        inputWrap.addClass('has-feedback');
                        inputWrap.append('<span class="icon icon-check form-control-feedback"></span>');
                    }
                }

                switch (_this.attr('name')){
                    case 'user_name' :
                        isValidValue = is_valid_user_name(inputValue);
                        if(isValidValue){
                            $.get(G_BASE_URL + '/account/ajax/check_username/username' + '-' + encodeURIComponent(inputValue), function (result)
                            {
                                if (result.errno == -1)
                                {
                                    isValidValue = false;
                                    errorTips = result.err;
                                    updateCheckResult();
                                }
                            }, 'json');
                        }
                    break;

                    case 'email' :
                        isValidValue = is_valid_email(inputValue);
                        if(isValidValue) {
                        	$.get(G_BASE_URL + '/account/ajax/check_email/email' + '-' + encodeURIComponent(inputValue), function (result)
                            {
                                if (result.errno == -1)
                                {
                                    isValidValue = false;
                                    errorTips = result.err;
                                    updateCheckResult();
                                }
                            }, 'json');
                        }
                    break;

                    case 'password' :
                        isValidValue = is_valid_password(inputValue);
                    break;
                    default :
                        errorTips = '';
                }

                updateCheckResult();
            }
        });
    }

    verify_register_form('#register_form');

    $('#submit-form').on('click', function(e){
        e.preventDefault();
        if(is_valid_register_form()) {
            NKR.ajax_post($('#register_form'), NKR.ajax_processer, 'error_message'); 
        }
    });

    $('#sns-register-submit').on('click', function(e){
        e.preventDefault();
        if(is_valid_sns_register_form()) {
            NKR.ajax_post($('#register_form'), NKR.ajax_processer, 'error_message');
        }
    });
});

/*-------------------------------------------
    valid email actions
---------------------------------------------*/

$(document).ready(function () {
	$('.change-email').on('click', function(e){
		e.preventDefault();

		$('.lcb-resend-email').hide();
		$('.lcb-change-email').show();
	});
});