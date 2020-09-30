var WSCMsg_MailList = WSClientMsg.extend({
    msgid: MSGID_MAILLIST,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        //GameRankInfo
        if(GameMgr.singleton.halllayer){
            GameMgr.singleton.halllayer.mailinfo = msgobj["lst"];
        }
    }
});

MainClient.singleton.addMsg(new WSCMsg_MailList());