var CLIENT_LANGUAGE = "";

var StringMgrSys = {
    CurGameName : "",
    UpdateGameSize : "",
    ActiveName : "",
    NoticeUser : "",
    NoticeGameName : "",
    NoticeReward : "",
    MailGameName : "",
    MailTime : "",
    MailRank : "",
    ErrorDtCode : "",
    ErrorHttpCode : "",
    ErrorGameCode : "",
    ErrorMsgCode : "",

    curlanguage : "",
    Strings : [],
    NoticeBet : "",

    gg1CurBet : "",
    gg1MaxBet : "",

    mbDlgMaxBet : "",

    NoticeImage : "",
    NoticeFontType : "Microsoft YaHei",

    RichTextFontType : "Microsoft YaHei",
    RichTextFontSize : 20,

    getloadString : function(key) {
        if (!StringMgrSys.curlanguage) {
            StringMgrSys.curlanguage = StringMgrSys.Strings["language"];
            CLIENT_LANGUAGE = StringMgrSys.curlanguage;
        }
        if(!StringMgrSys.Strings[key]){
            cc.log("string is not exit!!!");
        }
        return StringMgrSys.Strings[key] || key;
    },

    getString_str : function(key) {
        var str = StringMgrSys.getloadString(key);
        return StringMgrSys.template_string(str);
    },

    template_string : function(string, data) {
        var strarr = [];
        strarr = string.split("@$");
        var tempstr = "";
        for (var i = 0; i < strarr.length; i++) {
            if (i % 2) {
                tempstr = tempstr + eval(strarr[i]);
            } else {
                tempstr = tempstr + strarr[i];
            }
        }
        return tempstr;
    },

    //! 设置RichText
    setRichTextFont : function (fontname, fontsize) {
        if(fontname)
            StringMgrSys.RichTextFontType = fontname;

        if(fontsize)
            StringMgrSys.RichTextFontSize = fontsize;
    },

    //! 恢复默认RichText参数
    restoreDefaultRichTextFont : function () {
        StringMgrSys.RichTextFontType = "Microsoft YaHei";
        StringMgrSys.RichTextFontSize = 20;
    },

    //! 根据string生成RichText的内容，如果需要使用特殊字体和设定字体大小，需要在之前调用setRichText（每次都要设置）
    setRichText : function (richText, key) {
        var enums = 0;
        var longstr = StringMgrSys.getString_str(key);

        var strarr = [];
        strarr = longstr.split("#");

        var content = [];
        var str1, str2;
        var fontsize = StringMgrSys.RichTextFontSize;
        for(var i = 0; i < strarr.length; i++){
            str1 = strarr[i];
            str2 = strarr[i+1];
            if(str2){
                var index_str = str2.indexOf(",");
                if(index_str > 0){
                    fontsize = str2.slice(index_str + 1,str2.length);
                }
            }
            var str3 = [str1,str2,fontsize];
            content.push(str3);
            i++;
        }

        var reText = "";
        for (var nIndex = 0; nIndex < content.length; nIndex++) {
            var index_str = 0;
            index_str = content[nIndex][0].indexOf(".png");
            if(index_str > 0){
                reText = new ccui.RichElementImage(nIndex,cc.color.WHITE, 255, content[nIndex][0]);
                richText.pushBackElement(reText);
            }else {
                reText = new ccui.RichElementText(nIndex, cc.hexToColor("#" + content[nIndex][1]), 255, content[nIndex][0], StringMgrSys.RichTextFontType, content[nIndex][2]);
                richText.pushBackElement(reText);
            }

            ++enums;
        }

        StringMgrSys.restoreDefaultRichTextFont();
        return enums;
    }
};

function testrichtxt() {

    StringMgrSys.NoticeUser = "lcstest";
    StringMgrSys.NoticeGameName = "sd";
    StringMgrSys.NoticeReward = 30000;
    StringMgrSys.NoticeBet = 300;
    StringMgrSys.NoticeImage = reshall.testimage_png;

    var longstr = StringMgrSys.getString_str("StringNoticeImageInfo");


    cc.log("请求比赛开始后的倒计时时间##",longstr);
    var msgobj = {
        "msgid":"noticemsg",
        "info":longstr,
        "type":"notice",
        "timeid":1500109452143
    };
    // CommonNoticeMgr.analysisdata(msgobj);

    var strarr = [];
    strarr = msgobj.info.split("#");

    var content = [];
    var str1, str2;
    var fontsize = 20;
    for(var i = 0; i < strarr.length; i++){
        str1 = strarr[i];
        str2 = strarr[i+1];
        if(str2){
            var index_str = str2.indexOf(",");
            if(index_str > 0){
                fontsize = str2.slice(index_str + 1,str2.length);
            }
        }
        var str3 = [str1,str2,fontsize];
        content.push(str3);
        i++;
    }

    var richText = new ccui.RichText();
    richText.setAnchorPoint(cc.p(0,0.5));
    var reText = "";
    for (var nIndex = 0; nIndex < content.length; nIndex++) {
        var index_str = 0;
        index_str = content[nIndex][0].indexOf(".png");
        if(index_str > 0){
            reText = new ccui.RichElementImage(nIndex,cc.color.WHITE, 255, content[nIndex][0]);
            // reText.setContentSize(20,20);
            richText.pushBackElement(reText);
        }else {
            reText = new ccui.RichElementText(nIndex, cc.hexToColor("#" + content[nIndex][1]), 255, content[nIndex][0], "Microsoft YaHei", content[nIndex][2]);
            richText.pushBackElement(reText);
        }

    }
    richText.x = 240;
    richText.y = 320;
    richText.ignoreContentAdaptWithSize(true);
    richText.formatText();
    cc.director.getRunningScene().addChild(richText);

}