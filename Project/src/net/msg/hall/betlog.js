var WSCMsg_BetLog = WSClientMsg.extend({
    msgid: MSGID_BETLOG,

    onMsg: function (msgobj) {
        //cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        if(GameMgr.singleton.halllayer){
            GameMgr.singleton.halllayer.GameTradeInfo = msgobj;
        }
    }
});

MainClient.singleton.addMsg(new WSCMsg_BetLog());