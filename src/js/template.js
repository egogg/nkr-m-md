var TEMPLATE = { 
	'inviteSearch':
		'<li class="list-group-item media {{#hide}}hide{{/hide}}">' + 
			'<div class="pull-left">' + 
				'<a href="{{url}}" class="user-tag user-img">' + 
					'<img class="qia-user-img" src="{{img}}" />' + 
				'</a>' + 
			'</div>' + 
			'<div class="media-body">' +
				'<div class="qia-invite">' +
					'<a class="btn btn-xs qia-toggle-invitation" data-id="{{uid}}">发送邀请</a>' + 
				'</div>' +
				'<div class="lgi-heading">' + 
					'<a href="{{url}}" class="user-tag user-name">{{name}}</a>' + 
				'</div>' +
				'<small class="lgi-text">' + 
					'{{intro}}' + 
				'</small>' +
			'</div>' + 
		'</li>'
};