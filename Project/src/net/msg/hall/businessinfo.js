var WSCMsg_BusinessInfo = WSClientMsg.extend({
    msgid: MSGID_BUSINESSINFO,

    onMsg: function (msgobj) {
        // bi               - 商户配置信息
        // bi.cashierUrl    - 商户配置的出纳柜台地址

        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        businessInfo = msgobj;
    }
});

MainClient.singleton.addMsg(new WSCMsg_BusinessInfo());