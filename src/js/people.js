$(document).ready(function(){
	$('body').on('click', '[data-usri-act]', function (e) {
        e.preventDefault();

        var $this = $(this);
        var action = $(this).data('usri-act');

        switch (action) {
        	case 'signature-edit':
        		$('#usri-signature-dlg').addClass('open');
        	break;
        	case 'signature-close':
        		$('#usri-signature-dlg').removeClass('open');
        	break;
        	case 'signature-update':
        		if(G_USER_ID < 0)
				{
					window.location.reload();

					return;
				}

				var signature = $('#usri-signature-input').val();
				$.post(G_BASE_URL + '/account/ajax/update_signature/', {'signature': signature}, function(result) {
					if(result.errno == -1) {
						NKR.alert(result.err);
					}
					else if (result.errno == 1) {
						$('#usri-signature-content').html(signature);
						$('#usri-signature-dlg').removeClass('open');
					}
				}, 'json');
        	break;
        }
     });
});