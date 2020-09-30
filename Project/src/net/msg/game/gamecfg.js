var WSCMsg_GameCfg = WSClientMsg.extend({
    msgid: MSGID_GAMECFG,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));

        if(msgobj.linebets) {
            GameMgr.singleton.onBetList(msgobj.linebets);
        }
    }
});

MainClient.singleton.addMsg(new WSCMsg_GameCfg());