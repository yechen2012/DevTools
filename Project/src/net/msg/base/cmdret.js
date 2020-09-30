var WSCMsg_CmdRet = WSClientMsg.extend({
    msgid: MSGID_CMDRET,

    onMsg: function (msgobj) {

        GameMgr.singleton.onCmdRet(msgobj.cmdid);

        //if (msgobj.cmdid == CMDID_LOGIN || msgobj.cmdid == CMDID_REG) {
        //    if (msgobj.isok) {
        //        //cc.director.getRunningScene().toHall();
        //    }
        //}
        //else

        if(msgobj.cmdid == CMDID_TOKENLOGIN) {
            if(!msgobj.isok) {
                SceneMgr.singleton.initLogin();
            }
        }

        if (msgobj.cmdid == CMDID_SPIN || msgobj.cmdid == CMDID_FLBSPIN || msgobj.cmdid == CMDID_SPIN2 || msgobj.cmdid == CMDID_GAMECTRL2 || msgobj.cmdid == CMDID_GAMECTRL3) {
            GameMgr.singleton.myInfo.isspin = false;

            MainClient.singleton.clearSpinTimer();

            MainClient.singleton.startNoSpinTimer();
        }

        if (msgobj.cmdid == CMDID_COMEINGAME || msgobj.cmdid == CMDID_COMEINGAMEEX || msgobj.cmdid == CMDID_COMEINGAME2 || msgobj.cmdid == CMDID_COMEINGAME3) {
            MainClient.singleton.startNoSpinTimer();
        }

        if (msgobj.cmdid == CMDID_GAMECTRL3) {
            MainClient.singleton.__onCtrlRet(msgobj.isok);
        }

        MainClient.singleton.onCmdCallback(msgobj.cmdid, msgobj.isok);

        //else if (msgobj.cmdid == CMDID_GETREGCODE) {
        //}
        //else if (msgobj.cmdid == CMDID_COMEINGAME) {
        //    if (msgobj.isok) {
        //        cc.director.getRunningScene().toGame();
        //    }
        //}
    }
});

MainClient.singleton.addMsg(new WSCMsg_CmdRet());