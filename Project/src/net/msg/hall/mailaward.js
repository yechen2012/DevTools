var WSCMsg_MailAward = WSClientMsg.extend({
    msgid: MSGID_MAILAWARD,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        mailawardlst = msgobj["lst"];
        // //GameRankInfo
        // if(GameMgr.singleton.halllayer){
        //     GameMgr.singleton.halllayer.GameRankInfo = msgobj;
        // }
    }
});

MainClient.singleton.addMsg(new WSCMsg_MailAward());