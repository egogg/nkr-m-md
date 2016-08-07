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

$(document).ready(function(){
	function onListLoadComplete(element, complete) {
		if(complete) {
			element.addClass('no-more');
            element.html('已加载全部内容');
		}
	}

	if(typeof PEOPLE_USER_ID != 'undefined') {
		NKR.load_list_view(G_BASE_URL + '/people/ajax/topics/uid-' + PEOPLE_USER_ID, $('#flw-topics-load-more'), $('#flw-topic-list'), 2, onListLoadComplete);
		NKR.load_list_view(G_BASE_URL + '/people/ajax/follows/type-follows__uid-' + PEOPLE_USER_ID, $('#flw-friends-load-more'), $('#flw-friend-list'), 2, onListLoadComplete);
		NKR.load_list_view(G_BASE_URL + '/people/ajax/follows/type-fans__uid-' + PEOPLE_USER_ID, $('#flw-fans-load-more'), $('#flw-fans-list'), 2, onListLoadComplete);

		NKR.load_list_view(G_BASE_URL + '/people/ajax/questions/type-answered__uid-' + PEOPLE_USER_ID, $('#usrq-answered-load-more'), $('#usrq-answered-list'), 2, onListLoadComplete);
		NKR.load_list_view(G_BASE_URL + '/people/ajax/questions/type-failed__uid-' + PEOPLE_USER_ID, $('#usrq-failed-load-more'), $('#usrq-failed-list'), 2, onListLoadComplete);
		NKR.load_list_view(G_BASE_URL + '/people/ajax/questions/type-publish__uid-' + PEOPLE_USER_ID, $('#usrq-publish-load-more'), $('#usrq-publish-list'), 2, onListLoadComplete);
		NKR.load_list_view(G_BASE_URL + '/people/ajax/answers/uid-' + PEOPLE_USER_ID, $('#usrq-answer-load-more'), $('#usrq-answer-list'), 2, onListLoadComplete);
	}

	NKR.load_list_view(G_BASE_URL + '/notifications/ajax/list/', $('#notifications-load-more'), $('#notification-list'), 1, onListLoadComplete);
});