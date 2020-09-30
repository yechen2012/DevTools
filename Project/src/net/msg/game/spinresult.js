var WSCMsg_Geninit = WSClientMsg.extend({
    msgid: MSGID_SPINRESULT,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));

        var json_i = msgobj.spinresult;
        var totalwin = json_i.TotalWin;
        var result = json_i.ReelResults;
        var winresult = json_i.WinResults;
        var lstarr = json_i.lstarr;

        var winmul = 1;
        
        if(json_i.WinMultiple != undefined)
            winmul = json_i.WinMultiple;

        //MainClient.singleton.curBetID = json_i.betid;

        GameMgr.singleton.onSpinResult(totalwin, result, winresult, winmul, lstarr);

        // UIMgr.singleton.curGame.Logic.singleton.lstAnswers = [];
        // for(var i = 0; i < UIMgr.singleton.curGame.WHEEL_NUMS; ++i) {
        //     UIMgr.singleton.curGame.Logic.singleton.lstAnswers.push(0);
        // }
        //
        // var json = msgobj.spinresult;
        // var result = json.ReelResults;
        // for(var i = 0;i < result.length;++i)
        // {
        //     if(result[i].Pos < 0)
        //     {
        //         result[i].Pos += UIMgr.singleton.curGame.Logic.singleton.mainStage.lstRolls_show[i].data.lstBlocks.length;
        //     }
        //
        //     UIMgr.singleton.curGame.Logic.singleton.lstAnswers[result[i].Idx] = result[i].Pos;
        //
        //     if(UIMgr.singleton.curGame.Logic.singleton.mainStage.lstRolls_show[i].data.lstBlocks.length <= result[i].Pos)
        //     {
        //         UIMgr.singleton.curGame.Logic.singleton.lstAnswers[result[i].Idx] = 0;
        //     }
        // }
        //
        // cc.log("Answers: " + UIMgr.singleton.curGame.Logic.singleton.lstAnswers[0] + ", "  + UIMgr.singleton.curGame.Logic.singleton.lstAnswers[1] + ", "  + UIMgr.singleton.curGame.Logic.singleton.lstAnswers[2] + ", "  + UIMgr.singleton.curGame.Logic.singleton.lstAnswers[3] + ", "  + UIMgr.singleton.curGame.Logic.singleton.lstAnswers[4]);
        // //cc.log("result: " + JSON.stringify(json));
        //
        // //game101.Logic.singleton.iWinResult = json.Main.TotalWin * game101.Logic.singleton.iBetValue / 100;
        //
        // UIMgr.singleton.curGame.Logic.singleton.iWinResult = json.TotalWin / 100;
        //
        // UIMgr.singleton.curGame.Logic.singleton.lstWinResults = json.WinResults;
        //
        // UIMgr.singleton.curGame.Logic.singleton.getResult();
    }


});

MainClient.singleton.addMsg(new WSCMsg_Geninit());
