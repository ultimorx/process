$(function () {
	Submit();
	Master();
	Modal();
	MstTable();
	Color();
	ExportFile();
	ImportFile();
});

var SAMPLE_RES_S = {
	result : 'success', // success or error
	message : ['保存に成功'],
	id : 999,
}
var SAMPLE_RES_S2 = {
	result : 'success', // success or error
	message : ['ファイル取込に成功'],
	id : 999,
}
var SAMPLE_RES_E = {
	result : 'error', // success or error
	message : [
		'１〇〇を入力してください。',
		'２〇〇を入力してください。',
		'３〇〇を入力してください。'
	],
	id : 999,
}

const DELETE_TRUE = '1'; // 削除フラグ

var Int = function(v) {
	// return parseInt(v, 10);
	// 数値変換に失敗(NaN)の場合、0を返却
	let i = parseInt(v, 10);
	return  ( ! i )? 0: i;
}

var Submit = function() {
	$('form').on('submit', function (e) {
		// $('form').submit() など、
		// 直接submitを実行した時のみ有効
		// <button>タグなどバブリングによるsubmitは無効とする
		if(e.bubbles) e.preventDefault();

		// 全submitを無効化
		// e.preventDefault();
	});

	$('.test_post').on('click', function () {
		let $form = $('#' + $(this).attr('ref_id'));
		InputNumbering($form);
		$form.attr('action', 'https://ultimorx.com/sample/post.php');
		$form.submit();
	});
}

var Master = function() {

	// 更新を無効
	let _DisableUpdate = function() {
		// $('#mode_update').addClass('hide');
		$('#mode_update').attr('disabled', true).prop('disabled', true);
	}
	// 更新を有効
	let _EnableUpdate = function() {
		// $('#mode_update').removeClass('hide');
		$('#mode_update').removeAttr('disabled').prop('disabled', false);
	}
	// idを設定
	// この処理を行う想定タイミング
	// 1. 初回urlパラメータでidを受け取った時
	// 2. 保存後　新規処理後idを受け取り、その後は更新にする!?
	let _SetUpdateId = function(id) {
		$('#mode_update').val(id);
		// id設定時に同時に選択状態にする
		$('#mode_update').attr('checked', true).prop('checked', true);
	}

	// URLパラメータにidがあれば、更新にする
	let url = new URL(window.location.href);
	if( ! url.searchParams.get('id') ) {
		_DisableUpdate();
	} else {
		_SetUpdateId(url.searchParams.get('id'));
	}

	$('#master_save').on('click', function () {
		InputNumbering($('#form_master'));

		// マスタ情報保存後に行う（個別処理）
		let _callbackFormSaved = function(res) {
			if( ! IsResultSuccess(res)) return;

			let $next = $('#modal_result .next_wrap');
			if( res.id != '') {
				$next.show();

				// OKボタンのリンク先にid付与
				let $ok = $next.find('a.ok');
				let href = $ok.attr('org_href');
				$ok.attr('href', href + '?id=' + res.id);

				// 更新ラジオの値にidを設定、選択
				_EnableUpdate();
				_SetUpdateId(res.id);
			}
		}

		Ajax($('#form_master'), _callbackFormSaved);

		// memo TEST
		// CallbackAjaxSuccess(SAMPLE_RES_S);
		// CallbackAjaxSuccess(SAMPLE_RES_E);

		// memo TEST
		// setTimeout(function(){$('#modal_result').fadeIn(200)}, 500);
	});

}

var Ajax = function($form, callbackFormSaved) {
	$.ajax({
		type : $form.attr('method'),
		url : $form.attr('action'),
		data : new FormData( $form.get()[0] ),
		dataType : 'json',
		processData : false,
		contentType : false,
		success : function (res) {
			console.log('Ajax res : ', res);
			// let res = JSON.parse(res); // dataType : 'json',を明示する場合は不要
			CallbackAjaxSuccess(res);
			if (typeof callbackFormSaved == 'function') callbackFormSaved(res);
		},
		error : function (e) {
			console.log('error',e);
			alert('サーバとの通信に失敗しました。');
		}
	});
}

var IsResultSuccess = function(res) {
	return (res.result == 'success');
}
var IsResultError = function(res) {
	return (res.result == 'error');
}
var CallbackAjaxSuccess = function(res) {
	let modal = '#modal_result';
	let $ul = $(modal + ' ul');

	// 表示リセット
	$ul.removeClass('success').removeClass('error');

	// 結果表示
	if(IsResultSuccess(res)) {
		$ul.addClass('success');
	} else if(IsResultError(res)) {
		$ul.addClass('error');
	}

	// メッセージ表示
	if( res.message.length > 0 ) {
		let li = '';
		$.each(res.message, function (idx, msg) {
			li += '<li>' + msg + '</li>';
		});
		$ul.html(li);
	}

	// リンク先
	$(modal + ' .next_wrap').hide();

	$(modal).fadeIn(200);
}

var InputNumbering = function($form) {
	$.each($form.find('.mst_table'), function () {
		let $mst_table = $(this);
		$.each($mst_table.find('.list tr, .cache tr'), function (idx) {
			let $tr = $(this);
			$.each($tr.find('input[name]'), function () {
				let $input = $(this);
				let name = $input.attr('name');
				$input.attr('name', name.replace('[]', '[' + idx + ']'));
			});
		});
	});
}


var Modal = function() {
	$('.modal.close').on('click', function () {
		$(this).fadeOut(1000);
	});
	$('.modal .close').on('click', function () {
		$(this).parents('.modal').fadeOut(1000);
	});
}

var ExportFile = function() {
	// POST送信してエクスポートする場合
	// $('#export_stop_code').on('click', function () {
	// 	$('#from_export_stop_code').submit();
	// });
};

var ImportFile = function() {
	let $import_file = $('input[type="file"]#import_file');
	let $save_import_file = $('#save_import_file');

	// 「停止コード振り分け取込」ボタン押下
	$('#import_drop').on('click', function () {
		UnsetFile();
		$import_file.trigger('click');
	});

	// ブラウザデフォルトのファイル選択
	$import_file.on('change', function () {
		let files = $(this)[0].files;
		if( files.length <= 0 ) return;

		SetFile(files[0].name);
	});

	// ファイルをドラック&ドロップ
	$('#import_drop').on('drop', function (e) {
		e.stopPropagation();
		e.preventDefault();
		let $input = $import_file;
		let files = e.originalEvent.dataTransfer.files; //ドロップしたファイルを取得
		if (files.length > 1) return alert('アップロードできるファイルは1つだけです。');

		$input[0].files = files;
		SetFile(files[0].name);
	});

	let SetFile = function(name) {
		ViewFilename(name);
		$save_import_file.addClass('save').removeClass('disabled');
	}

	let UnsetFile = function() {
		ViewFilename('');
		$save_import_file.removeClass('save').addClass('disabled');
	}

	let ViewFilename = function(name) {
		$('#import_filename').text(name);
	}

	//ドロップエリア以外のドロップ禁止
	$(document).on('dragenter dragover drop', function (e) {
		e.stopPropagation();
		e.preventDefault();
	});

	// 取込処理
	$('#save_import_file').on('click', function () {
		if( ! $(this).hasClass('save')) {
			return;
		}

		// ファイル取込後に行う（個別処理）
		let _callbackFormSaved = function(res) {
			if( ! IsResultSuccess(res)) return;

			// ファイル選択を初期化
			UnsetFile();
		}

		Ajax($('#from_import_stop_code'), _callbackFormSaved);
	});
};

var Color = function() {
	// <inut type="color">属性によりブラウザがサポートしているカラーピッカーを使用
	$(document).on('blur', 'input[type="color"].color_picker', function () {
		$(this).prev('input.color_code').val($(this).val());
	});
	// カラーコードを直接入力した時
	$(document).on('blur', 'input.color_code', function () {
		// 大文字に変換（f0f0f0 → F0F0F0）
		$(this).val( $(this).val().toUpperCase() );
		// 3桁の省略コードを6桁コードに変換(AAA → AAAAAA)
		_Short2Full($(this));
		// #をつける
		_AddPrefix($(this));
		// ピッカーに反映
		$(this).next('input.color_picker').val( $(this).val() );
	});

	let short_color_codes = ['000','111','222','333','444','555','666','777','888','999','AAA','BBB','CCC','DDD','EEE','FFF'];
	let _Short2Full = function($color_code) {
		let cc = $color_code.val().replace('#', '');
		$.each(short_color_codes, function (idx, scc) {
			if(cc == scc) {
				$color_code.val('#' + scc + scc);
				return false;
			}
		});
	}

	let _AddPrefix = function($color_code) {
		let color_code = $color_code.val().replace('#', '');
		$color_code.val('#' + color_code);
	}
};

var MstTable = function() {
	// 行追加
	$(document).on('click', '.mst_table .insert', function () {
		let $mst_table = $(this).parents('.mst_table');
		let $list = $mst_table.find('.list');

		// テンプレートHTMLをコピー
		$tpl = $mst_table.find('.template tr').clone(true);

		// name属性を生成
		// レコード数を算出
		// 0始まりの連番になるようにする。
		let rec_num = $list.find('tr').length;
		let KEY = '_KEY_';
		$.each($tpl.find('input[org_name]'), function () {
			$(this).attr('name', $(this).attr('org_name'));
			$(this).removeAttr('org_name');
		});

		// 一覧テーブルに挿入
		$tpl.appendTo($list);

		// 挿入後の最新の.listを引き渡す
		_Numbering($mst_table.find('.list'));
	});

	// 行削除
	$(document).on('click', '.mst_table .list .delete', function () {
		let $tr = $(this).parents('tr');
		let $list = $(this).parents('.list');
		let $cache = $(this).parents('.mst_table').find('.cache');
		$tr.addClass('confirm');
		setTimeout(() => {
			if(window.confirm('削除してもよろしいですか？')) {
				_Delete($tr, $cache);
				_Numbering($list);
			} else {
				$tr.removeClass('confirm');
			}
		}, '200');
	});

	let _Delete = function($tr, $cache) {
		let rec_id = $tr.find('input.rec_id').val();
		// DB未登録データ（idが空）の削除はHTML要素ごと消す。POSTしない。
		if(rec_id == '') {
			$tr.remove();
			return;
		}

		// 削除フラグをtrue
		$tr.find('input.del_flg').val(DELETE_TRUE);
		// $tr.removeClass('confirm');
		$tr.find('.sort').remove();
		// 隠し要素に移動（POSTデータとして保持）
		$tr.appendTo($cache);
	}

	let _Numbering = function($list) {
		let num = 0;
		$.each($list.find('input.sort'), function () {
			num++;
			$(this).val(num);
		});
	}

	// memo
	// _SetNewNumberは行追加時に対象行のみ表示番号をセットする時に使用。
	// 行追加時に、_Numberingを実行しても番号を振ることができる。
	// _Numberingは一覧内の全番号を振り直すので、行追加時では無駄な処理も実行される感がある。
	let _SetNewNumber = function($list, $tpl) {
		let num = $list.find('input.sort').length + 1;
		$tpl.find('input.sort').val(num);
	}

	// 上へ
	$(document).on('click', '.mst_table .list .up', function () {
		let $tr = $(this).parents('tr');
		$tr.prev().before($tr);
		let $list = $(this).parents('.list');
		_Numbering($list);
	});

	// 下へ
	$(document).on('click', '.mst_table .list .down', function () {
		let $tr = $(this).parents('tr');
		$tr.next().after($tr);
		let $list = $(this).parents('.list');
		_Numbering($list);
	});

}
