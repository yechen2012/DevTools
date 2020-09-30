var WSCMsg_CompetitionResult = WSClientMsg.extend({
    msgid: MSGID_COMPETITIONRESULT,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        GlobalCompetitionTesultData = msgobj;
        // GlobalMatchData = [];
        // for(var i in msgobj.ccfg){
        //     var temparr = [];
        //     temparr = [i,msgobj.ccfg[i]];
        //     GlobalMatchData.push(temparr);
        // }
        // //GlobalMatchData = msgobj.ccfg;
        // DataSys.ClearAllData();
        // DataSys.CheckMatchTime();
        // if(!GameMgr.singleton.halllayer){
        //     cc.log("WSCMsg_CompetitionInfo非大厅界面");
        //
        // }//大厅界面
        // else if(WholeCurViewType == 0){
        //     cc.log("大厅界面");
        //
        // }//游戏界面
        // else if(WholeCurViewType == 1){
        //     cc.log("游戏界面");
        //     return;
        // }//机台界面
        // else if(WholeCurViewType == 2){
        //     cc.log("机台界面");
        //     return;
        //
        // }//我的最爱游戏界面
        // else if(WholeCurViewType == 3){
        //     cc.log("我的最爱游戏界面");
        //     return;
        // }//我的最爱机台界面
        // else if(WholeCurViewType == 4){
        //     cc.log("我的最爱机台界面");
        //     return;
        // }
        //
        // if(WholeCurViewType == 1 && GameMgr.singleton.halllayer && GameMgr.singleton.halllayer.gamenodelist.length > 0){
        //
        // }
        // // ji
    }
});

MainClient.singleton.addMsg(new WSCMsg_CompetitionResult());