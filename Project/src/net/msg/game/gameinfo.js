var WSCMsg_GameInfo = WSClientMsg.extend({
    msgid: MSGID_GAMEINFO,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));

        MainClient.singleton.curSpinID = msgobj.spinid;

        //msgobj.wheelname

        if (msgobj.hasOwnProperty('gamescene')) {
            MainClient.singleton.curSGame = msgobj.gamescene;
            MainClient.singleton.curBetID = msgobj.betid;
        }

        GameMgr.singleton.onGameInfo(msgobj);
    }
});

MainClient.singleton.addMsg(new WSCMsg_GameInfo());