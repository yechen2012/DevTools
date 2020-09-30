var WSCMsg_Notice = WSClientMsg.extend({
    msgid: MSGID_NOTICE,

    onMsg: function (msgobj) {
        //NoticeLayer.showNotice(msgobj.info);
        cc.log("msgobj: " + msgobj.info);

        if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative || !msgobj.hasOwnProperty('type')) {
            var newtype = 0;

            if(msgobj.ctrltype == 'notice')
                newtype = 1;

            GameMgr.singleton.onError(0, msgobj.info, newtype);
        }
        else
            GameMgr.singleton.onError(0, msgobj.info, msgobj.type);

        // if (msgobj.hasOwnProperty('type')) {
        //     GameMgr.singleton.onError(0, msgobj.info, msgobj.type);
        // }
        // else {
        //     var newtype = 0;
        //
        //     if(msgobj.ctrltype == 'notice')
        //         newtype = 1;
        //
        //     GameMgr.singleton.onError(0, msgobj.info, newtype);
        // }
        //UIMgr.singleton.showMsgUI(msgobj.info);
    }
});

MainClient.singleton.addMsg(new WSCMsg_Notice());