var WSCMsg_SymbolStripes = WSClientMsg.extend({
    msgid: MSGID_SYMBOLSTRIPES,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));


        var wheelname = 'normal';
        if (msgobj.hasOwnProperty('wheelname')) {
            wheelname = msgobj.wheelname;
        }

        var json_s = msgobj.symbolstripes;

        var arr = json_s.Stripes;

        GameMgr.singleton.onSymbolStripes(arr, wheelname);

        // UIMgr.singleton.curGame.Logic.singleton.lstRollDatas = [];
        // for(var i = 0;i < UIMgr.singleton.curGame.WHEEL_NUMS;++i)
        // {
        //     var obj = arr[i];
        //     UIMgr.singleton.curGame.Logic.singleton.lstRolls[i] = [];
        //
        //     var rollData = new MyRollData();
        //     UIMgr.singleton.curGame.Logic.singleton.lstRollDatas.push(rollData);
        //     rollData.lstBlocks = [];
        //     rollData.iRoll = i;
        //     for(var j = 0;j < obj.Symbols.length;++j)
        //     {
        //         UIMgr.singleton.curGame.Logic.singleton.lstRolls[i].push(obj.Symbols[j]);
        //
        //         rollData.lstBlocks.push(obj.Symbols[j]);
        //
        //         rollData.lstIndex.push(j);
        //     }
        // }

        return;








        UIMgr.singleton.curGame.Logic.singleton.lstAnswers = [];
        for(var i = 0; i < UIMgr.singleton.curGame.WHEEL_NUMS; ++i) {
            UIMgr.singleton.curGame.Logic.singleton.lstAnswers.push(0);
        }

        var result = [{"Idx":0, "Pos":1}, {"Idx":1, "Pos":1}, {"Idx":2, "Pos":1}, {"Idx":3, "Pos":1}, {"Idx":4, "Pos":1}];
        for(var i = 0;i < UIMgr.singleton.curGame.Logic.singleton.lstRollDatas.length;++i)
        {
            if(result[i].Pos < 0)
            {
                result[i].Pos += UIMgr.singleton.curGame.Logic.singleton.lstRollDatas[i].lstBlocks.length;
            }

            UIMgr.singleton.curGame.Logic.singleton.lstAnswers[result[i].Idx] = result[i].Pos + 1;

            if(UIMgr.singleton.curGame.Logic.singleton.lstRollDatas[i].lstBlocks.length <= result[i].Pos + 1)
            {
                UIMgr.singleton.curGame.Logic.singleton.lstAnswers[result[i].Idx] = 0;
            }
        }

        UIMgr.singleton.curGame.Logic.singleton.networkConnected();
    }

});

MainClient.singleton.addMsg(new WSCMsg_SymbolStripes());