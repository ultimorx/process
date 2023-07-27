$(function () {
	// URLパラメータにidを含まない場合は、工場選択表示
	let url = new URL(window.location.href);
	if( ! url.searchParams.get('id') ) {
		$('#mode_select').show();
		SelectBoard();
		return;
	}

	// URLパラメータのidを各種設定のリンク先に付与
	let href = $('#menu_master').attr('href');
	$('#menu_master').attr('href', href + '?id=' + url.searchParams.get('id'));


	// 仮のデータ設定
	SetBoradData(SAMPLE_DATAS[CURRNET_SAMPLE_DATA_ID]);
	$('#mode_monitor').show();


	SetDatetime();
	ViewDatetime();
	Datepicker();
	Search();
	TimeTable();
});

const DIFF_MAX_QTY = 10;
const DIFF_MIN_QTY = -10;
var ONE_MINUTES_PX = 0; // 1分あたりのピクセル数
var TOTAL_MINUTES_PX = 0; // 時間軸のピクセル数
var TIMETABLE_START_HOUR;
var TIMETABLE_FINISH_HOUR;
var CURRNET_SAMPLE_DATA_ID = 1;
var BOARD_DATA;
var SAMPLE_DATAS = {
	1 : {
		start_time : '8:30',
		finish_time : '17:30',
		disp_plan : true, // true false
		works : [
			{
				id : 1,
				name : 'ﾀﾝｸ成形-射出成形機',
				qty1 : '10',
				qty2 : '20',
				qty3 : '33333',
				qty4 : '44444',
				plan_unit : '個',
				real_unit : '個',
				proc_label_id : 3,
				diff_qty : +10,
				plans : [
					{
						start_time : '10:30',
						work_min   : 60,
						txt        : '570Bﾀﾝｸ(成形-成形機)',
						qty        : '27',// [***]
						label_id   : '5',
						slash      : true, // true false
					},
					{
						start_time : '11:30',
						work_min   : 30,
						label_id   : '6',
					},
					{
						start_time : '17:30',
						work_min   : 60,
						txt        : '終了直前に長いテキスト終了直前に長いテキスト終了直前に長いテキスト',
						label_id   : 7,
						tooltip    : {
							name     : 'ツールチップツールチップツールチップツールチップツールチップ',
						},
					},
				],
				reals : [
					{
						start_time : '9:00',
						work_min   : 1,
						label_id   : '1',
					},
					{
						start_time : '9:02',
						work_min   : 2,
						label_id   : '1',
					},
					{
						start_time : '9:05',
						work_min   : 2,
						label_id   : '1',
					},
					{
						start_time : '9:08',
						work_min   : 1,
						label_id   : '1',
					},
					{
						start_time : '9:10',
						work_min   : 1,
						label_id   : '1',
					},
					{
						start_time : '9:12',
						work_min   : 5,
						label_id   : '1',
					},
					{
						start_time : '10:30',
						work_min   : 50,
						txt        : '実績',
						qty        : '',
						label_id   : '5',
						tooltip    : {
							name     : 'ツールチップ',
							url      : 'https://google.co.jp',
						},
					},
					{
						start_time : '11:30',
						work_min   : 30,
						txt        : 'テキストテキストテキスト',
						label_id   : '6',
						tooltip    : {
							name     : 'ツールチップのみ',
						},
					},
					{
						start_time : '13:00',
						work_min   : 270,
						txt        : '稼働<br>前のテキストが長いと被ります',
						label_id   : '1',
					},
					{
						start_time : '17:30',
						work_min   : 30,
						txt        : '終了直前に長いテキスト',
						label_id   : 6,
						tooltip    : {
							name     : 'ツールチップ',
						},
					},
				]
			},
		],
	},
	2 : {
		start_time : '14:15',
		finish_time : '25:30',
		slash : true,
		disp_plan : true,
		works : [
			{
				id : 21,
				name : 'ﾀﾝｸ成形-射出成形機21',
				proc_label_id : 1,
				qty1 : '1',
				qty2 : '2',
				qty3 : '3',
				qty4 : '4',
				diff_qty : 0,
				plan_unit : 'こ',
				real_unit : 'こ',
				plans : [
					{
						start_time : '15:00',
						work_min   : 60,
						txt        : '稼働',
						label_id   : '1',
					},
					{
						start_time : '16:00',
						work_min   : 60,
						txt        : '段替',
						label_id   : '2',
					},
					{
						start_time : '17:00',
						work_min   : 60,
						txt        : '休憩',
						label_id   : '3',
					},
					{
						start_time : '18:00',
						work_min   : 60,
						txt        : '異常停止',
						label_id   : '4',
						slash　　　 : true,
					},
					{
						start_time : '19:00',
						work_min   : 60,
						txt        : '計画停止',
						label_id   : '5',
						slash　　　 : true,
					},
					{
						start_time : '20:00',
						work_min   : 60,
						txt        : '日常点検',
						label_id   : '6',
						slash　　　 : true,
					},
					{
						start_time : '21:00',
						work_min   : 60,
						txt        : 'その他',
						label_id   : '7',
						slash　　　 : false,
					},
				],
				reals : [
					{
						start_time : '18:30',
						work_min   : 93,
						txt        : '570Bﾀﾝｸ(成形-成形機)',
						label_id   : '1',
					},
					{
						start_time : '25:30',
						work_min   : 60,
						txt        : '終了直前に長いテキスト',
						label_id   : 5,
						tooltip    : {
							name     : 'ツールチップ',
						},
					},
				],
			},
			{
				id : 22,
				name : 'ﾀﾝｸ成形-射出成形機22',
				qty1 : '11',
				qty2 : '22',
				qty3 : '33',
				qty4 : '44',
				diff_qty : +10,
				plan_unit : 'ｾｯﾄ',
				real_unit : 'ｾｯﾄ',
				plans : [
					{
						start_time : '15:30',
						work_min   : 120,
						txt        : '斜線の場合、背景が半透明の黒で視認性確保する案',
						label_id   : '5',
						slash      : true,
						qty        : 123,
					},
					{
						start_time : '17:45',
						work_min   : 30,
						label_id   : '6',
					},
					{
						start_time : '18:15',
						work_min   : 120,
						label_id   : '1',
						slash      : false,
					},
				],
				reals : [
					{
						start_time : '18:30',
						work_min   : 93,
						txt        : '実績にも斜線つけることできます（実際はつけないと思います）',
						qty        : 200,
						label_id   : '1',
						slash      : true,
					},
					{
						start_time : '25:30',
						work_min   : 60,
						txt        : '終了直前に長いテキスト',
						label_id   : 7,
						tooltip    : {
							name     : 'ツールチップ',
						},
					},
				],
			},
			{
				id : 23,
				name : 'ﾀﾝｸ成形-射出成形機23＜工程名が長い場合の表示テスト＞＜工程名が長い場合の表示テスト＞',
				qty1 : '1111',
				qty2 : '2222',
				qty3 : '3333',
				qty4 : '4444',
				diff_qty : -10,
				plans : [
					{
						start_time : '15:30',
						work_min   : 120,
						txt        : 'aiueo',
						label_id   : '5',
					},
					{
						start_time : '17:45',
						work_min   : '0:30',
						label_id   : '6',
					},
					{
						start_time : '18:15',
						work_min   : 120,
						label_id   : '1',
					},
				],
				reals : [
					{
						start_time : '18:30',
						work_min   : 93,
						txt        : '570Bﾀﾝｸ(成形-成形機)<br>[27]',
						label_id   : '1',
					},
				],
			},
		],
	},
}

var Datepicker = function() {
	$.datepicker.setDefaults( $.datepicker.regional[ "ja" ] );
	$('#datepicker').datepicker({
		dateFormat: 'yy/mm/dd'
	});
}

const NOW = {};
var SetDatetime = function() {
	var _now = new Date();
	var year = _now.getFullYear();
	var month = _now.getMonth()+1;
	var day = _now.getDate();
	var hour = _now.getHours();
	var min = _now.getMinutes();
	var sec = _now.getSeconds();
	NOW.year = year;
	NOW.month = month;
	NOW.day = day;
	NOW.date = year + '/' + PadZero(month) + '/' + PadZero(day);
	NOW.hour = hour;
	NOW.min = min;
	NOW.sec = sec;
	NOW.time = hour + ':' + min;
	NOW.datetime = NOW.date + ' ' + PadZero(hour) + ':' + PadZero(min) + ':' + PadZero(sec);
}

// 現在の縦線
var UCL_INTERVAL_ID = '';
var UpdateCurrentLine = function() {
	SetDatetime();
	// 時間見出しの時間を過ぎた
	if( TIMETABLE_FINISH_HOUR < NOW.hour) {
		StopCurrentLine();
	}
	ViewTimeLine($('#current_line'), NOW.time);
	if(NOW.sec > 55) console.log('UpdateCurrentLine', NOW.datetime, UCL_INTERVAL_ID);
}
var StartCurrentLine = function() {
	ViewTimeLine($('#current_line'), NOW.time);
	$('#current_line').show();
	if(UCL_INTERVAL_ID == '') {
		UCL_INTERVAL_ID = setInterval(UpdateCurrentLine, 2000);
	}
}
var StopCurrentLine = function() {
	$('#current_line').hide();
	clearInterval(UCL_INTERVAL_ID); // 定期実行を停止
	UCL_INTERVAL_ID = ''; //初期化
}

var ViewDatetime = function() {
	$('.update_datetime').text(NOW.datetime);
}

var PadZero = function(v) {
	return v.toString().padStart(2, '0');
}

var Int = function(v) {
	// return parseInt(v, 10);
	// 数値変換に失敗(NaN)の場合、0を返却
	let i = parseInt(v, 10);
	return  ( ! i )? 0: i;
}

var SplitTime = function(time) {
	if( ! time) time = '';
	let a = time.split(':');
	return  {
		'h' : ( ! a[0])? 0: Int(a[0]),
		'm' : ( ! a[1])? 0: Int(a[1]),
	}
}

var Search = function() {
	$('#manual_search').on('click', function()　{
		$('#auto_search_wrap').toggle();
		$('#manual_search_wrap').toggle();
	});

	$('#workshift').on('change', function()　{
		CURRNET_SAMPLE_DATA_ID = $(this).val();
		SetBoradData(SAMPLE_DATAS[CURRNET_SAMPLE_DATA_ID]);
		ViewTimeBar();
	});

	$('#datepicker').on('change', function()　{
		console.log('日付指定変更', $(this).val());
	});
}

var SetBoradData = function(data) {
	BOARD_DATA = data;
}

var TimeTable = function() {
	ViewTimeBar();
	$(window).resize(function () {
		ViewTimeBar();
	});
	ViewTableHeaderPosition();
}

// 時間見出し表示位置調整（固定ナビ・メニューの高さ分調整）
var ViewTableHeaderPosition = function() {
	let $nav = $('nav');
	if($nav.length >= 1) {
		$('#timetable thead.fixed th').css('top', $nav.height());
	}
}

// 開始時間 00:00 から時間を返却
var StartHour = function(start_time){
	let t = SplitTime(start_time);
	return Int(t.h);
}

// 終了時間 00:00 から時間を返却
var FinishHour = function(finish_time){
	let t = SplitTime(finish_time);
	return Int(t.h) + 1;
}

var ViewTimeBar = function() {
	// 時間見出し(th.times)
	let start_hour = StartHour(BOARD_DATA.start_time);
	let finish_hour = FinishHour(BOARD_DATA.finish_time);
	ViewHours(start_hour, finish_hour);

	// 以下、時間見出し(th.times)のピクセル数を時間軸(分単位)に置き換えて各要素(縦線、計画と生産実績等)を表示
	TOTAL_MINUTES_PX = $('th.times').width();
	let hours_count = $('th.times #hours span').length;
	ONE_MINUTES_PX = TOTAL_MINUTES_PX / (hours_count * 60);
	let hours = BOARD_DATA.hours;
	TIMETABLE_START_HOUR = start_hour;
	TIMETABLE_FINISH_HOUR = finish_hour;

	// 表示しているtbodyを削除（タイムテーブルをリセット）
	$('#timetable tbody').remove();

	// タイムテーブル(tbodyは複数になり得る)
	$.each(BOARD_DATA.works, function (idx, data) {
		ViewTimeTableBody(data);
	});

	// タイムテーブル上のツールチップの動作
	ActionTimeTableTooltip();

	// 現在の縦線
	if($('#manual_search').prop('checked')) {
		StopCurrentLine();
	} else {
		StartCurrentLine();
	}
	// 開始の縦線
	ViewTimeLine($('#start_line'), BOARD_DATA.start_time);
	// 終了の縦線
	ViewTimeLine($('#finish_line'), BOARD_DATA.finish_time);
}

// 時間見出し　08:00|09:00| ... 17:00|18:00
var ViewHours = function(start_hour, finish_hour) {
	let elm = '';
	for (var h = start_hour; h < finish_hour; h++) {
		elm += '<span>' + PadZero(h) + ':00</span>';
	}
	$('#hours')
		.empty() // タイムテーブルの時間見出しをリセット
		.append(elm);
}

// 時間見出し　08:00|09:00| ... 17:00|18:00
var _delete_ViewHours = function(hours) {
	let elm = '';
	$.each(hours, function (idx, hour) {
		let h = Int(hour);
		elm += '<span>' + PadZero(h) + ':00</span>';
	});
	$('#hours')
		.empty() // タイムテーブルの時間見出しをリセット
		.append(elm);
}

var CalcLeftPx = function(time) {
	let t = SplitTime(time);
	// timeは00:00を想定
	// タイムテーブルの開始時と表示する時間(hour)の差を求め、表示用の時間を分単位に変換
	let view_min = (t.h - TIMETABLE_START_HOUR) * 60 + t.m;
	return CalcMinPx(view_min);
}

// var CalcWidthPx = function(time) {
// 	// timeは00:00を想定
// 	let t = SplitTime(time);
// 	// 単位を分に変換
// 	let view_min = t.h * 60 + t.m;
// 	return CalcMinPx(view_min);
// }

var CalcWidthPx = function(time) {
	return CalcMinPx(time);
}


var CalcMinPx = function(min) {
	// 時間（分）をピクセル数に変換
	return min * ONE_MINUTES_PX;
}

// タイムテーブル上の縦線
var ViewTimeLine = function($line, time) {
	let t = SplitTime(time);
	let h = $(window).height();
	if(TIMETABLE_START_HOUR <= t.h && t.h < TIMETABLE_FINISH_HOUR) {
		$line.show()
		.css('left', CalcLeftPx(time) + 'px')
		.css('height', h + 'px')
	} else {
		$line.hide();
	}
}

// 工程（tbodyタグを生成）
var ViewTimeTableBody = function(data) {
	// tbodyのテンプレートHTMLをコピー
	let clone_target = (BOARD_DATA.disp_plan) ? '.rec_plan_real': '.rec_real';
	let $tpl = $('table#template tbody'+clone_target).clone(true);

	// 名称
	$tpl.find('.name').text(data.name);
	// 名称の背景色
	if(data.proc_label_id) {
		$tpl.find('.name').addClass(CssLabelName(data.proc_label_id));
	}

	// 計画数と実績数
	$tpl.find('.main_qty.plan_qty .qty').text(data.qty1);
	$tpl.find('.sub_qty.plan_qty .qty').text(data.qty2);
	$tpl.find('.main_qty.real_qty .qty').text(data.qty3);
	$tpl.find('.sub_qty.real_qty .qty').text(data.qty4);
	// 計画数と実績数の単位
	$tpl.find('.plan_qty .unit').text(data.plan_unit);
	$tpl.find('.real_qty .unit').text(data.real_unit);

	// 進捗状況
		// 計画数と実績数の差で進捗状況を判断する場合、
		// data.diff_qtyをサーバから取得する必要はないと思う。
	if(data.diff_qty >= DIFF_MAX_QTY) {
		$tpl.find('.progress').removeClass('normal').addClass('ahead');
	} else if(data.diff_qty <= DIFF_MIN_QTY) {
		$tpl.find('.progress').removeClass('normal').addClass('behind');
	}

	// 計画と生産実績
	if(data.plans) {
		ViewJobs($tpl.find('.plan .jobs'), data.plans);
	}
	if(data.reals) {
		ViewJobs($tpl.find('.real .jobs'), data.reals);
	}

	// タイムテーブルに挿入
	$tpl.appendTo($('#timetable'));
}

// 計画と生産実績の表示
var ViewJobs = function($job, jobs) {
	console.log($job)
	if( ! jobs ) return;
	let elm = '';
	$.each(jobs, function (idx, v) {
		let c = CssLabelName(v.label_id);
		let l = CalcLeftPx(v.start_time);
		let w = CalcWidthPx(v.work_min);
		let t = (! v.txt)? '': v.txt;
		let q = (! v.qty)? '': v.qty;
		let s = (! v.slash)? '': ' '+'slash';
		let ti = (! v.tooltip)? '': v.tooltip;
		let has_ti = '';
		let elm_ti = '';
		let icon = '';
		if(ti != '') {
			let ti_name = (! v.tooltip.name)? '': v.tooltip.name;
			let ti_url = (! v.tooltip.url)? '': v.tooltip.url;
			let ti_attr = 'class="tooltip" style="left:' + l + 'px;"';
			if(ti_url != '') {
				icon = '<i class="icon icon-link-ext-alt"></i>';
				elm_ti = '<a ' + ti_attr + ' href="' + ti_url + '" target="_blank">' + icon + ti_name + '</a>';
			} else {
				icon = '<i class="icon icon-info-circled"></i>';
				elm_ti = '<span ' + ti_attr + '>' + icon + ti_name + '</span>';
			}
			has_ti = ' has_tooltip';
		}
		elm += '<span class="job_wrap">';
		elm += elm_ti;
		elm += '<span class="' + c + s + has_ti + '" style="left:' + l + 'px; width:' + w + 'px;"></span>';
		elm += '<span class="job' + has_ti + '" style="left:' + l + 'px;"><span class="j_txt">' + icon + t + '</span><span class="j_qty">' + q + '</span></span>';
		elm += '</span>';
	});
	$job.append(elm);
}

// タイムテーブル上のツールチップの動作
var ActionTimeTableTooltip = function() {
	// ClickTimeTableTooltip();
	// MouseoverTimeTableTooltip();
	HoverTimeTableTooltip();

	// MouseoverTimeTableTooltip と HoverTimeTableTooltip　どちらでもほぼ同じ動作をします。
}

// タイムテーブル上のツールチップの動作(クリック)
var ClickTimeTableTooltip = function() {
	$('#timetable tbody .has_tooltip').on('click', function(e) {
		$('#timetable tbody .tooltip').hide();
		$(this).parent('.job_wrap').find('.tooltip').show();
		e.stopPropagation();
	});
	$(document).on('click' , function(){
		$('#timetable tbody .tooltip').hide();
	});
}
// タイムテーブル上のツールチップの動作(マウスオーバー／マウスアウト)
var MouseoverTimeTableTooltip = function() {
	$('#timetable tbody .has_tooltip, #timetable tbody .tooltip')
		.on('mouseover', function() {
			$(this).parent('.job_wrap').find('.tooltip').show();
		})
		.on('mouseout', function() {
			$('#timetable tbody .tooltip').hide();
		});
}
// タイムテーブル上のツールチップの動作(ホバー)
var HoverTimeTableTooltip = function() {
	$(document).on({
		'mouseenter': function () {
			$(this).parent('.job_wrap').find('.tooltip').show();
		},
		'mouseleave': function () {
			$('#timetable tbody .tooltip').hide();
		}
	}, '#timetable tbody .has_tooltip, #timetable tbody .tooltip');
}


var CssLabelName = function(label_id) {
	return (! label_id)? '': 'label' + label_id;
}

var SelectBoard = function() {
	let $select_factory_label = $('#select_factory label');
	let $select_board = $('#select_board');
	let $board_list = $('#select_board .board_list');
	$('#select_factory input').on('click', function() {
		// 工場選択の表示切替
		$select_factory_label.removeClass('checked');
		$(this).parent('label').addClass('checked');
		// 設定名選択の表示切替
		$select_board.show();
		$board_list.hide();

		// 表示対象の設定名選択一覧の有無
		let $list = $('#' + $(this).attr('ref_id'));
		if($list.length >= 1) {
			$list.show();
		} else {
			$('#notfound').show();
		}
	});
}
