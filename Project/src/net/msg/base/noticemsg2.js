var WSCMsg_NoticeMsg2 = WSClientMsg.extend({
    msgid: MSGID_NOTICEMSG2,

    onMsg: function (msgobj) {
        // var errinfo = makeErrInfo2(msgobj.msgcode, msgobj.msgparam);
        var errinfo = makeErrInfo3(msgobj.msgcode, msgobj.msgparam);
        GameMgr.singleton.onError(0, errinfo, msgobj.type);
    },

});

MainClient.singleton.addMsg(new WSCMsg_NoticeMsg2());

function makeErrInfo2 (errcode, errparam) {

    var errorstr = "";

    var str1 = "";
    var str2 = "";
    if(errcode != undefined){
        StringMgrSys.ErrorMsgCode = errcode;
        str1 = "StringErrorCode_" + errcode;
    }else {
        StringMgrSys.ErrorMsgCode = 0;
    }

    if(errparam && errparam.dtapierrcode){
        str2 = "StringErrorCode_" + errcode + "_" + errparam.dtapierrcode;
        StringMgrSys.ErrorDtCode = errparam.dtapierrcode;
    }
    else {
        str2 = "StringErrorCode_" + errcode + "_null";
    }

    if(errparam && errparam.httpcode){
        StringMgrSys.ErrorHttpCode = errparam.httpcode;
    }
    if(errparam && errparam.curgamecode){
        var gameName = GameMgr.singleton.getGameNameFromcode(errparam.curgamecode);
        StringMgrSys.ErrorGameCode = gameName;
    }
    if(str2 && StringMgrSys.Strings[str2]){
        errorstr = StringMgrSys.getString_str(str2);
        return errorstr;
    }

    if(StringMgrSys.Strings[str1]){
        errorstr = StringMgrSys.getString_str(str1);
        return errorstr;
    }
    errorstr = StringMgrSys.getString_str("StringErrorCode_Msg")
    return errorstr;
}

function makeErrInfo3 (errcode, errparam) {
    var errorstr = undefined;
    //errparam.dtapierrcode = 890;
    if(errcode != undefined && errparam) {
        var strname = undefined;

        if(errparam.dtapierrcode)
            strname = 'common_popup_error_code' + errcode + '_' + errparam.dtapierrcode;
        else if(errparam.httpcode)
            strname = 'common_popup_error_code' + errcode + '_' + errparam.httpcode;

        if(strname && LanguageData.instance.hasTextStr(strname))
            errorstr = LanguageData.instance.getTextStr(strname);
    }

    if(errorstr == undefined) {
        errorstr = '';

        if(errcode != undefined){
            LanguageData.instance.setMapValue('Code1', errcode);
            if(errparam && errparam.dtapierrcode){
                LanguageData.instance.setMapValue('Code2', errparam.dtapierrcode);
                errorstr = LanguageData.instance.getTextStr("common_popup_error_9");
            }else if(errparam && errparam.httpcode){
                LanguageData.instance.setMapValue('Code2', errparam.httpcode);
                errorstr = LanguageData.instance.getTextStr("common_popup_error_9");
            }else {
                errorstr = LanguageData.instance.getTextStr("common_popup_error_10");
            }
        }
        else {
            LanguageData.instance.setMapValue('Code1', 0);
            errorstr = LanguageData.instance.getTextStr("common_popup_error_10");
        }
    }

    return errorstr;
}

