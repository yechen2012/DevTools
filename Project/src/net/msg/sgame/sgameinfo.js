var WSCMsg_SGameInfo = WSClientMsg.extend({
    msgid: MSGID_SGAMEINFO,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));

        GameMgr.singleton.onSGameInfo(msgobj);
    }
});

MainClient.singleton.addMsg(new WSCMsg_SGameInfo());