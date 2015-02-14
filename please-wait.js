(function($){
	$(function(){
		if (pb.data('route').name == 'thread' && $.inArray(pb.data('board_id'), pb.plugin.get('post_rate_limit').settings.board) != '-1' && !pb.data('user').is_staff) {
			var local_date = Date.parse(new Date().toUTCString());
			var server_date = Date.parse(new Date(proboards.data('serverDate')).toUTCString());
			var diff = local_date - server_date;
			var last_post_time = (pb.data('proboards.thread')[pb.data('route').params.thread_id].last_post_time * 1000) + diff;
			var please_wait_for = pb.plugin.get('post_rate_limit').settings.time_between_posts*60000;
			var current_state = true;
			(function evaluate_time(){
				var current_local_time = Date.parse(new Date().toUTCString());
				if (current_local_time  < last_post_time + please_wait_for) {
					if (current_state) {
						current_state = false;
						$('.reply-button,.quote-button').addClass('disabled').each(function(){
							$(this).attr('data-href', $(this).attr('href'));
							$(this).attr('href', 'javascript:false');
							$(this).off('click');
							$(this).on('click', function(){
								pb.window.alert(pb.plugin.get('post_rate_limit').settings.please_wait_message);
							});
						});
						$('form.form_post_quick_reply textarea').addClass('disabled').attr('placeholder', pb.plugin.get('post_rate_limit').settings.please_wait_message).attr('disabled',true);
						$('form.form_post_quick_reply input[type="submit"]').addClass('disabled').attr('disabled',true);
					}
				} else {
					if (!current_state) {
						current_state = true;
						$('.reply-button,.quote-button').removeClass('disabled').each(function(){
							if ($(this).attr('data-href')) {
								$(this).attr('href', $(this).attr('data-href'));
								$(this).removeAttr('data-href');
								$(this).off('click');
							}
						});
						postManager.bind_reply_buttons
						$('form.form_post_quick_reply textarea').removeClass('disabled').removeAttr('placeholder').removeAttr('disabled');
						$('form.form_post_quick_reply input[type="submit"]').removeClass('disabled').removeAttr('disabled');
					}
				}
				setTimeout(evaluate_time, 60000);
			})();
		}
	});
})(jQuery);
