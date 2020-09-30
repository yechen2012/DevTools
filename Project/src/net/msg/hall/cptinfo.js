var WSCMsg_CPTInfo = WSClientMsg.extend({
    msgid: MSGID_CPTINFO,

    onMsg: function (msgobj) {
        // bi               - 商户配置信息
        // bi.cashierUrl    - 商户配置的出纳柜台地址

        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        GameMgr.singleton.cptinfodata = msgobj;
        tempjoincpt = msgobj["isjoincpt"];
        if(msgobj["cpt"]){
            cptisopen = true;
        }else {
            cptisopen = false;
        }
        if(GameMgr.singleton.halllayer){
            GameMgr.singleton.halllayer.setSignUpStatu(tempjoincpt);
            var isv = GameMgr.singleton.halllayer.cpt_game_layer.isVisible();
            if(GameMgr.singleton.halllayer.cpt_game_layer && isv == true){
                GameMgr.singleton.halllayer.cpt_game_layer.initfordata(msgobj["cpt"]);
            }
        }
    }
});

MainClient.singleton.addMsg(new WSCMsg_CPTInfo());