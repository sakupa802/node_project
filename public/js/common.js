$(function(){
	var $Question = $('#Question'),
		$hiragana = $('.hiragana'),
		$kana = $('.kana');

	var typing = {
		//文字を格納する配列
		romanText: {
			'A':65,
			'B':66,
			'C':67,
			'D':68,
			'E':69,
			'F':70,
			'G':71,
			'H':72,
			'I':73,
			'J':74,
			'K':75,
			'L':76,
			'M':77,
			'N':78,
			'O':79,
			'P':80,
			'Q':81,
			'R':82,
			'S':83,
			'T':84,
			'U':85,
			'V':86,
			'W':87,
			'X':88,
			'Y':89,
			'Z':90,
		},
		rnd: [],//グローバル変数群
		question: [],//問題の文字列を格納
		tCnt: 0,//何文字目か
		qCnt: 0,//何問目か
		typStart: '',
		typEnd: '',	 //開始時と終了時の時刻を格納
		hiraganaText: '',
		questionText: '',
		questionBox: [
			'あああああ',
			'あいうえお',
			'かきくけこ',
		],
		init: function(){
			typing.eventSet();
		},
		eventSet: function(){
			document.onkeydown = typing.typeGame;//キー押下時
			typing.gameSet();
		},
		//0～25までの乱数を200個作成して配列typing.rndに格納する関数
		ransu: function()
		{
			for ( var i = 0 ; i < 200 ; i++ )
			{
				typing.rnd[i] = Math.floor( Math.random() * 26 );
			}
		},
		battleData: {},
		chat: function(){
			socket.on('connected', function () {
	            socket.emit('check credential', typing.battleData);
	        });

	        // 認証成功
	        socket.on('credential ok', function (data) {
	            typing.battleData.roomId = data.roomId;
	        });

	        // ルームに同名ユーザー存在 再度生成
	        socket.on('userName exists', function () {
	            battleData.userName = 'user' + Math.floor(Math.random() * 100);
	            socket.emit('check credential', typing.battleData);
	        });

	        socket.on('battle wait', function () {
	            battleCtrl.battleWait();
	        });

	        socket.on('battle start', function (data) {
	        	
	        		console.log(data);
	        		console.log(typing.battleData.userName);
	        	

	            battleCtrl.battleStart();
	        });

	        socket.on('battle judge', function (data) {
	            battleCtrl.judge(data);
	        });

	        socket.on('battle timeout', function (result) {
	            battleCtrl.battleResult(result);
	        });

	        socket.on('update members', function (members) {
	            battleCtrl.membersSet(members);
	        });

	        socket.on('getStatus', function () {
	            battleData.enemyCommend = true;
	            battleCtrl.enemySet();
	        });
		},
		//タイピングゲームの問題をセットする関数
		gameSet: function()
		{
			if(typing.qCnt >= typing.questionBox.length){
				$Question.html('END');
				return;	
			}

			//問題文とカウント数をクリアする
			typing.question = [];
			typing.tCnt = 0;
			typing.questionText = '';
			
			typing.questionText = typing.questionBox[typing.qCnt];
			typing.hiraganaText = typing.hiraToRoman(typing.questionText);
			var splitText = typing.hiraganaText.toUpperCase().split('');

			for ( var i = 0 ; i < splitText.length ; i++)
			{
				typing.question.push(typing.romanText[splitText[i]]);
			}
			
			//問題枠に表示する
			$hiragana.html(typing.questionText);
			$kana.html(typing.hiraganaText);
		},
		//キー入力を受け取る関数
		typeGame: function(evt)
		{
			var kc;	//入力されたキーコードを格納する変数
			
			//入力されたキーのキーコードを取得
			if (document.all){
				kc = event.keyCode;
			}else{
				kc = evt.which;
			}

			if (kc == typing.question[typing.tCnt]){

				typing.tCnt++; //文字数を+1
 
	  	  	  	//最初の1文字が入力された時間を記録する
				if (typing.tCnt == 0)
				{ 
					typing.typStart = new Date();
				}
				
				//全文字入力したか確認
				if (typing.tCnt < typing.question.length)
				{
					//問題文の頭の一文字を切り取る
					typing.hiraganaText = typing.hiraganaText.substring(1, typing.hiraganaText.Length);

					$kana.html(typing.hiraganaText);
				}else{
					typing.qCnt++; //カウント数を+1

					// //全文字入力していたら、終了時間を記録する
					// typing.typEnd = new Date();
					
					// //終了時間－開始時間で掛かったミリ秒を取得する
					// var keika = typing.typEnd - typing.typStart;
					
					// //1000で割って「切捨て」、秒数を取得
					// var sec = Math.floor( keika/1000 );
					
					// //1000で割った「余り(%で取得できる）」でミリ秒を取得
					// var msec = keika % 1000;
					
					// //問題終了を告げる文字列を作成
					// var fin="GAME終了　時間："+sec+"秒"+msec;
					
					// //問題枠にゲーム終了を表示
					// $hiragana.html(fin);

					typing.gameSet();
				}
			}
		},
		/*
		* ひらがなをローマ字化
		 */
		hiraToRoman: function(str){
			hiraTable = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやいゆえよらりるれろわいうえをんー　　　がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽぁぃぅぇぉゃぃゅぇょっぃぅぇぉ";
			boinTable = "aiueo";
			siinTable = "kstnhmyrwngzdbpxy";
			reigaiTable = new Array(siinTable.length);
			for(var i = 0; i < reigaiTable.length; i++) reigaiTable[i] = new Array(5);
			reigaiTable[1][1] = "shi",
			reigaiTable[2][1] = "chi",
			reigaiTable[2][2] = "tsu",
			reigaiTable[9][0] = "n",
			reigaiTable[9][1] = "-",
			reigaiTable[11][1] = "ji",

			ret = "";
			for(var i = 0; i < str.length; i++){
				c = str[i];
				cn = str[i+1];
				buf = "";
				pos = hiraTable.indexOf(c);
				s = Math.floor(pos/5) -1;
				b = pos%5;
				posn = hiraTable.indexOf(cn);
				// 二文字目が取得できてかつ「ゃ」行なら
				if(posn >= hiraTable.indexOf("ゃ") && posn <= hiraTable.indexOf("ょ")){
					bn = posn%5;
					buf += siinTable[s] + "y" + boinTable[bn];
					i++;
				}else if(pos == hiraTable.indexOf("っ")){
					// 一文字目が取得できてかつ「っ」なら
					bn = posn%5;
					sn = Math.floor(posn/5) -1;
					buf += siinTable[sn] + siinTable[sn] + boinTable[bn];
					i++;
				}else{
					if(s > -1 && reigaiTable[s][b]){
						buf += reigaiTable[s][b];
					}else{
						if(s > -1){
							buf += siinTable[s];
						}
						buf += boinTable[b];
					}
				}
				ret += buf;
			}
			return ret;
		},
	};

	typing.init();
});
