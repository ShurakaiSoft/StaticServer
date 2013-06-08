$(function () {
	var content = $('#content');
	content.css('background-color', 'green');
	content.children('h1').html("JavaScript files are being served.");
	
	$('img').one('load', function () {
		if ($(this).width() !== 425) {
			content.css('background-color', 'red');
		}
	}).each(function () {
		if (this.complete) {
			$(this).load();
		}
	});
});