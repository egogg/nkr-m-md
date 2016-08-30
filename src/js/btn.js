(function($) {
    $(document).ready(function() {

        // jQuery reverse

        $.fn.reverse = [].reverse;

        // Hover behaviour: make sure this doesn't work on .click-to-toggle FABs!

        $(document).on('mouseenter', '.fixed-action-btn:not(.toggle)', function(e) {
            var $this = $(this);
            openFABMenu($this);
        });
        $(document).on('mouseleave', '.fixed-action-btn:not(.toggle)', function(e) {
            var $this = $(this);
            closeFABMenu($this);
        });

        // Toggle-on-click behaviour.

        $(document).on('click', '.fixed-action-btn.toggle > a', function(e) {
            var $this = $(this);
            var $menu = $this.parent();
            if ($menu.hasClass('active')) {
                closeFABMenu($menu);
            } else {
                openFABMenu($menu);
            }
        });

    });

    $.fn.extend({
        openFAB: function() {
            openFABMenu($(this));
        },
        closeFAB: function() {
            closeFABMenu($(this));
        }
    });


    var openFABMenu = function(btn) {
        $this = btn;
        if ($this.hasClass('active') === false) {

            // Get direction option

            var horizontal = $this.hasClass('horizontal');
            var offsetY, offsetX;

            if (horizontal === true) {
                offsetX = 40;
            } else {
                offsetY = 40;
            }

            $this.addClass('active');
            $this.find('ul .btn').velocity({ scaleY: ".4", scaleX: ".4", translateY: offsetY + 'px', translateX: offsetX + 'px' }, { duration: 0 });

            var time = 0;
            $this.find('ul .btn').reverse().each(function() {
                $(this).velocity({ opacity: "1", scaleX: "1", scaleY: "1", translateY: "0", translateX: '0' }, { duration: 80, delay: time });
                time += 40;
            });
        }
    };

    var closeFABMenu = function(btn) {
        $this = btn;

        // Get direction option

        var horizontal = $this.hasClass('horizontal');
        var offsetY = 0; 
        var offsetX = 0;

        if (horizontal === true) {
            offsetX = 40;
        } else {
            offsetY = 40;
        }

        var time = 0;
        $this.find('ul .btn').velocity("stop", true);
        $this.find('ul .btn').velocity({ opacity: "0", scaleX: ".4", scaleY: ".4", translateY: offsetY + 'px', translateX: offsetX + 'px' }, { duration: 80 });
        $this.removeClass('active');
    };
}(jQuery));
