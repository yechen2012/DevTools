var WSCMsg_Geninit = WSClientMsg.extend({
    msgid: MSGID_GENINIT,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        
        var json_i = msgobj.geninit;
        var result = json_i.ReelResults;
        var lstarr = json_i.lstarr;

        GameMgr.singleton.onGenInit(result, lstarr);

        // UIMgr.singleton.curGame.Logic.singleton.lstAnswers = [];
        // for(var i = 0; i < UIMgr.singleton.curGame.WHEEL_NUMS; ++i) {
        //     UIMgr.singleton.curGame.Logic.singleton.lstAnswers.push(0);
        // }
        //
        // //var result = [{"Idx":0, "Pos":1}, {"Idx":1, "Pos":1}, {"Idx":2, "Pos":1}, {"Idx":3, "Pos":1}, {"Idx":4, "Pos":1}];
        // for(var i = 0;i < UIMgr.singleton.curGame.Logic.singleton.lstRollDatas.length;++i)
        // {
        //     if(result[i].Pos < 0)
        //     {
        //         result[i].Pos += UIMgr.singleton.curGame.Logic.singleton.lstRollDatas[i].lstBlocks.length;
        //     }
        //
        //     UIMgr.singleton.curGame.Logic.singleton.lstAnswers[result[i].Idx] = result[i].Pos;
        //
        //     if(UIMgr.singleton.curGame.Logic.singleton.lstRollDatas[i].lstBlocks.length <= result[i].Pos)
        //     {
        //         UIMgr.singleton.curGame.Logic.singleton.lstAnswers[result[i].Idx] = 0;
        //     }
        // }
        //
        // UIMgr.singleton.curGame.Logic.singleton.networkConnected();
    }


});

MainClient.singleton.addMsg(new WSCMsg_Geninit());