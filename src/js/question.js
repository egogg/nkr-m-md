	

$(document).ready(function(){

	/*----------------------------------------------------------
	        question filter bar affix
	-----------------------------------------------------------*/

	var qs = $('#question-select');
    if(qs.length != 0)
    {
        qs.affix({
            offset: { top: qs.offset().top}
        });
    }
});

	