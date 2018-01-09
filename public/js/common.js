$(function(){
	$question = $('#Question');

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
		cnt: 0,//何問目か格納
		typStart: '',
		typEnd: '',	 //開始時と終了時の時刻を格納
		questionText: '',
		init: function(){
			typing.eventSet();
		},
		eventSet: function(){
			document.onkeydown = typing.typeGame;	//キー押下時に関数typeGame()を呼び出す
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
		//タイピングゲームの問題をセットする関数
		gameSet: function()
		{
			//問題文とカウント数をクリアする
			typing.question = [];
			typing.cnt = 0;
			typing.questionText = '';
			
			typing.questionText = 'あいうえお';
			var splitText = typing.hiraToRoman('あいうえお').toUpperCase().split('');

			for ( var i = 0 ; i < splitText.length ; i++)
			{
				typing.question.push(typing.romanText[splitText[i]]);
			}
			
			//問題枠に表示する
			$question.html(typing.questionText);
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

			//入力されたキーコードと、問題文のキーコードを比較
			if (kc == typing.question[typing.cnt]){
				//以下、キーコードが一致した時の処理

				//最初の1文字が入力された時間を記録する
				if (typing.cnt==0)
				{ 
					typing.typStart = new Date();
				}
				
				typing.cnt++; //カウント数を＋１にする
				
				//全文字入力したか確認
				if ( typing.cnt < typing.question.length)
				{
					//問題文の頭の一文字を切り取る
					typing.questionText = typing.questionText.substring(1, typing.questionText.Length);

					//問題枠に表示する
					$question.html(typing.questionText);
				}else{
					//全文字入力していたら、終了時間を記録する
					typing.typEnd = new Date();
					
					//終了時間－開始時間で掛かったミリ秒を取得する
					var keika = typing.typEnd - typing.typStart;
					
					//1000で割って「切捨て」、秒数を取得
					var sec = Math.floor( keika/1000 );
					
					//1000で割った「余り(%で取得できる）」でミリ秒を取得
					var msec = keika % 1000;
					
					//問題終了を告げる文字列を作成
					var fin="GAME終了　時間："+sec+"秒"+msec;
					
					//問題枠にゲーム終了を表示
					$question.html(fin);
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
