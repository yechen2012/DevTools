/**
 * Created by ssscomic on 2016/6/12.
 */

var GAMETYPE_CURTYPE    =   91;
var GAMETYPE_CURCODE    =   'icefire2';

//var ICEFIRE_URLROOT = "https://om6jr1c2r.qnssl.com/newgame/icefireygg/res/";
//var ICEFIRE_SRCROOT = "https://om6jr1c2r.qnssl.com/newgame/icefireygg/v2/";

//! 是否使用压缩资源
var USE_COMPRESS = true;

var ICEFIRE_URLROOT;

if (ICEFIRE_URLROOT == undefined) {
    ICEFIRE_URLROOT = "res/icefire/";
    //ICEFIRE_URLROOT = "res/icefire_compress/";
}
var LANG_JSON = {
    en : ICEFIRE_URLROOT + "icefire_langen.json",
    en_US : ICEFIRE_URLROOT + "icefire_langen.json",
};

//Style基本逻辑是占位符，默认不存在多语言，Html同
var LANG_RES=ICEFIRE_URLROOT + "icefire_langen.json";
var LANG_STYLE=ICEFIRE_URLROOT + "icefire_langstyle.json";
var LANG_HTMLSTYLE=ICEFIRE_URLROOT + "icefire_langhtml.json";

//文本key对应表，按需定义
var LANG_REALKEY;

var ICEFIRE_SRCROOT;
var ICEFIRE_RESNAME;
var ICEFIRE_HELP;
var ICEFIRE_GAMERULES;

if (ICEFIRE_SRCROOT == undefined) {
    if(USE_COMPRESS)
        cc.loader.loadCompressImage(ICEFIRE_URLROOT + "icefire_compress_image.json", ICEFIRE_URLROOT);
}
else {
    if(!cc.sys.isNative) {
        if(ICEFIRE_RESNAME  == undefined)
            cc.loader.addResMapping(ICEFIRE_URLROOT, ICEFIRE_SRCROOT + 'resource.json');
        else
            cc.loader.addResMapping(ICEFIRE_URLROOT, ICEFIRE_SRCROOT + ICEFIRE_RESNAME);

        if(USE_COMPRESS)
            cc.loader.addCompressImage(ICEFIRE_URLROOT + "icefire_compress_image.json", ICEFIRE_URLROOT);
    }
}
var GAMEAPI_ISAPI2 = true;
var GAMEAPI_CONSTLINES = true;
var GAMEAPI_CONSTTIMES = true;
