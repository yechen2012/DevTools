var WSCMsg_CompetitionInfo = WSClientMsg.extend({
    msgid: MSGID_COMPETITIONINFO,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));

        // gamecode
        // tableid
        // lst
        // lst[i].uname
        // lst[i].uid
        // lst[i].win
        GameMgr.singleton.rankInfoLst = msgobj;
        if(GameMgr.singleton.rankInfoLayer){
            GameMgr.singleton.rankInfoLayer.initdata(msgobj);
        }
        //在游戏里面并且比赛排行榜界面不存在
        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.rankInfoLayer == null){
            var time = NetTime.singleton.getCurNetTime();
            var endtime = msgobj.endtime - time;
            if(endtime <= 0){
                cc.log("比赛已经结束");
                return;
            }
             var rankLayer = GameMgr.singleton.newrankinfolayer();
             cc.log("foripade    rankLayer");
             //foripad(rankLayer);
             GameMgr.singleton.rankInfoLayer.initdata(msgobj);
             GameMgr.singleton.curGameLayer.addChild(rankLayer,1);
             //cc.director.getRunningScene().addChild(rankLayer,997);
        }
    }
});

MainClient.singleton.addMsg(new WSCMsg_CompetitionInfo());