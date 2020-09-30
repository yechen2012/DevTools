var WSCMsg_WinCommonJackpot = WSClientMsg.extend({
    msgid: MSGID_WINCOMMONJACKPOT,

    onMsg: function (msgobj) {
        var type = msgobj.jpl;
        var nums = msgobj.jpwin;

        GameMgr.singleton.onJackpotWin(type, nums);
        // CommonJackpotMgr.singleton.onMsg(msgobj.lstpool, msgobj.lstwin);
    }
});

MainClient.singleton.addMsg(new WSCMsg_WinCommonJackpot());