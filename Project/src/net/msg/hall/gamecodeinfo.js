var WSCMsg_GameCodeInfo = WSClientMsg.extend({
    msgid: MSGID_GAMECODEINFO,

    onMsg: function (msgobj) {
        // // bi               - 商户配置信息
        // // bi.cashierUrl    - 商户配置的出纳柜台地址
        //
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        GameMgr.singleton.gamecodeinfo = msgobj["map"];
    }
});

MainClient.singleton.addMsg(new WSCMsg_GameCodeInfo());