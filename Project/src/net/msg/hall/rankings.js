var WSCMsg_Rankings = WSClientMsg.extend({
    msgid: MSGID_RANKINGS,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        //GameRankInfo
        if(GameMgr.singleton.halllayer){
            GameMgr.singleton.halllayer.GameRankInfo = msgobj;
        }
    }
});

MainClient.singleton.addMsg(new WSCMsg_Rankings());