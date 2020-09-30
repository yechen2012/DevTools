var WSCMsg_GameUserInfo = WSClientMsg.extend({
    msgid: MSGID_GAMEUSERINFO,

    onMsg: function (msgobj) {
        //cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));

        MainClient.singleton.curctrlid = msgobj.ctrlid;
        MainClient.singleton.lastctrlid = msgobj.lastctrlid;
        MainClient.singleton.refreshCtrlID();

        // //msgobj.wheelname
        //
        // if (msgobj.hasOwnProperty('gamescene')) {
        //     MainClient.singleton.curSGame = msgobj.gamescene;
        //     MainClient.singleton.curBetID = msgobj.betid;
        // }
        //
        GameMgr.singleton.onGameUserInfo(msgobj);
    }
});

MainClient.singleton.addMsg(new WSCMsg_GameUserInfo());