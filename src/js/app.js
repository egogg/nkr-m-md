$(document).ready(function () {

    /*-------------------------------------------
        User email validation messages
    ---------------------------------------------*/

    if(G_USER_INVALID_EMAIL.length) {
        var msg = '你的邮箱 <strong>' + G_USER_INVALID_EMAIL + '</strong> 还未验证, 如果没有收到邮件<a class="alert-link" onclick="NKR.ajax_request(G_BASE_URL + \'/account/ajax/send_valid_mail/\');"> 点击重新发送</a>';
        NKR.notify(msg, 'warning', false, 'bottom', 0, 0, 'up');
    }

    /*-------------------------------------------
        Site announce
    ---------------------------------------------*/
        
    if (G_SITE_ANNOUNCE_CLOSE != $.cookie('announce_close'))
    {
        $('#site-announce').show();
    }

    /*-------------------------------------------
        Load notification list
    ---------------------------------------------*/

    NKR.Notifcation.load();

    /*-------------------------------------------
        Header events
    ---------------------------------------------*/

    $('body').on('click', '[data-ma-action]', function (e) {
        e.preventDefault();

        var $this = $(this);
        var action = $(this).data('ma-action');

        switch (action) {

            /*-------------------------------------------
                Sidebar Open/Close
            ---------------------------------------------*/
            case 'sidebar-open':
                var target = $this.data('ma-target');
                var backdrop = '<div data-ma-action="sidebar-close" class="ma-backdrop" />';

                $('body').addClass('sidebar-toggled');
                $('#header, #header-alt, #main').append(backdrop);
                $this.addClass('toggled');
                $(target).addClass('toggled');

                break;

            case 'sidebar-close':
                $('body').removeClass('sidebar-toggled');
                $('.ma-backdrop').remove();
                $('.sidebar, .ma-trigger').removeClass('toggled')

                break;

            /*-------------------------------------------
                Mainmenu Submenu Toggle
            ---------------------------------------------*/
            case 'submenu-toggle':
                $this.next().slideToggle(200);
                $this.parent().toggleClass('toggled');

                break;


            /*-------------------------------------------
                Top Search Open/Close
            ---------------------------------------------*/
            //Open
            case 'search-open':
                $('#header').addClass('search-toggled');
                $('#top-search-wrap input').focus();

                break;

            //Close
            case 'search-close':
                $('#header').removeClass('search-toggled');

                break;

            case 'check-all-notifications':
                // NKR.Notifcation.read_notification(true, 0, false);
                var x = $this.closest('.list-group');
                var y = x.find('.list-group-item');
                var z = y.size();

                $this.parent().fadeOut();

                x.find('.list-group').prepend('<i class="grid-loading hide-it"></i>');
                x.find('.grid-loading').fadeIn(1500);


                var w = 0;
                y.each(function(){
                    var z = $(this);
                    setTimeout(function(){
                        z.addClass('animated fadeOutRightBig').delay(1000).queue(function(){
                            z.remove();
                        });
                    }, w += 150);
                })

                //Popup empty message
                setTimeout(function(){
                    $('.him-notification').addClass('empty').find('.lg-body').html('<p class="no-notification">没有未读消息</p>');
                }, (z * 150) + 200);

                break;


            /*-------------------------------------------
                Action Header Open/Close
            ---------------------------------------------*/
            //Open
            case 'action-header-open':
                ahParent = $this.closest('.action-header').find('.ah-search');

                ahParent.fadeIn(300);
                ahParent.find('.ahs-input').focus();

                break;

            //Close
            case 'action-header-close':
                ahParent.fadeOut(300);
                setTimeout(function(){
                    ahParent.find('.ahs-input').val('');
                }, 350);

                break;
        }
    });
});

$(document).ready(function(){

    /*----------------------------------------------------------
        Dropdown Menu
    -----------------------------------------------------------*/

    if($('.dropdown')[0]) {
    	//Propagate
    	$('body').on('click', '.dropdown.open .dropdown-menu', function(e){
    	    e.stopPropagation();
        });

    	$('.dropdown').on('shown.bs.dropdown', function (e) {
    	    if($(this).attr('data-animation')) {
    		$animArray = [];
    		$animation = $(this).data('animation');
    		$animArray = $animation.split(',');
    		$animationIn = 'animated '+$animArray[0];
    		$animationOut = 'animated '+ $animArray[1];
    		$animationDuration = ''
    		if(!$animArray[2]) {
    		    $animationDuration = 500; //if duration is not defined, default is set to 500ms
    		}
    		else {
    		    $animationDuration = $animArray[2];
    		}

    		$(this).find('.dropdown-menu').removeClass($animationOut)
    		$(this).find('.dropdown-menu').addClass($animationIn);
    	    }
    	});

    	$('.dropdown').on('hide.bs.dropdown', function (e) {
    	    if($(this).attr('data-animation')) {
        		e.preventDefault();
        		$this = $(this);
        		$dropdownMenu = $this.find('.dropdown-menu');

        		$dropdownMenu.addClass($animationOut);
        		setTimeout(function(){
        		    $this.removeClass('open')

        		}, $animationDuration);
        	}
        });
    }

    /*----------------------------------------------------------
        Bootstrap Accordion Fix
    -----------------------------------------------------------*/
    if ($('.collapse')[0]) {

        //Add active class for opened items
        $('.collapse').on('show.bs.collapse', function (e) {
            $(this).closest('.panel').find('.panel-heading').addClass('active');
        });

        $('.collapse').on('hide.bs.collapse', function (e) {
            $(this).closest('.panel').find('.panel-heading').removeClass('active');
        });

        //Add active class for pre opened items
        $('.collapse.in').each(function(){
            $(this).closest('.panel').find('.panel-heading').addClass('active');
        });
    }

    /*----------------------------------------------------------
        Bootstrap modal scroll Fix
    -----------------------------------------------------------*/
    
    if($('.modal')[0]) {
        var cPosition = false;

        $('.modal').on('show.bs.modal', function(){
            cPosition = $(window).scrollTop();
        })
        .on('shown.bs.modal', function(){
            $('body').css({
                position:'fixed'
            });
        })
        .on('hide.bs.modal', function(){
            $('body').css({
                position:'relative'
            });

            window.scrollTo(0, cPosition);
        });
    }
        
    /*----------------------------------------------------------
        Text Field
    -----------------------------------------------------------*/

    //Add blue animated border and remove with condition when focus and blur

    if($('.fg-line')[0]) {
        $('body').on('focus', '.fg-line .form-control', function(){
            $(this).closest('.fg-line').addClass('fg-toggled');
        })

        $('body').on('blur', '.form-control', function(){
            var p = $(this).closest('.form-group, .input-group');
            var i = p.find('.form-control').val();

            if (p.hasClass('fg-float')) {
                if (i.length == 0) {
                    $(this).closest('.fg-line').removeClass('fg-toggled');
                }
            }
            else {
                $(this).closest('.fg-line').removeClass('fg-toggled');
            }
        });
    }

    //Add blue border for pre-valued fg-flot text feilds
    if($('.fg-float')[0]) {
        $('.fg-float .form-control').each(function(){
            var i = $(this).val();

            if (!i.length == 0) {
                $(this).closest('.fg-line').addClass('fg-toggled');
            }

        });
    }

    /*-----------------------------------------------------------
        Tooltips
    -----------------------------------------------------------*/
    // if ($('[data-toggle="tooltip"]')[0]) {
    //     $('[data-toggle="tooltip"]').tooltip();
    // }


    /*-----------------------------------------------------------
        Popover
    -----------------------------------------------------------*/
    // if ($('[data-toggle="popover"]')[0]) {
    //     $('[data-toggle="popover"]').popover();
    // }


    /*-----------------------------------------------------------
        IE 9 Placeholder
    -----------------------------------------------------------*/
    if($('html').hasClass('ie9')) {
        $('input, textarea').placeholder({
            customClass: 'ie9-placeholder'
        });
    }
});
