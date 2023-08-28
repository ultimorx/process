$(function () {
	Navi();
});

var Navi = function() {
	$('#menu_open').on('click', function() {
		$('#menu_wrap').show();
	});
	$('#menu_close').on('click', function() {
		$('#menu_wrap').hide();
	});
};
