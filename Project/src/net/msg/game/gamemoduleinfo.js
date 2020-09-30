var WSCMsg_GameModuleInfo = WSClientMsg.extend({
    msgid: MSGID_GAMEMODULEINFO,

    onMsg: function (msgobj) {
        if (msgobj.gamemodulename == 'fls_bg' || msgobj.gamemodulename == 'fls_fg') {
            if(msgobj.gmi != undefined && msgobj.gmi.lstarr != undefined) {
                for (var y = 0; y < 3; ++y) {
                    for (var x = 0; x < 5; ++x) {
                        if (msgobj.gmi.lstarr[y][x] > 9) {
                            msgobj.gmi.lstarr[y][x] = 0
                        }
                    }
                }
            }
        }
        
        GameMgr.singleton.onGameModuleInfo(msgobj);
        // cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));
        //
        // MainClient.singleton.curSpinID = msgobj.spinid;
        //
        // //msgobj.wheelname
        //
        // if (msgobj.hasOwnProperty('gamescene')) {
        //     MainClient.singleton.curSGame = msgobj.gamescene;
        //     MainClient.singleton.curBetID = msgobj.betid;
        // }
        //
        // GameMgr.singleton.onGameInfo(msgobj);
    }
});

MainClient.singleton.addMsg(new WSCMsg_GameModuleInfo());