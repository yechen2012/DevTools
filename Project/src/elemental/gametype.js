/**
 * Created by ssscomic on 2016/6/12.
 */

var GAMETYPE_CURTYPE    =   112;
var GAMETYPE_CURCODE    =   'elemental';

// var GAME_DEV_VERSION = "Version: 2.1.3"; // 第二套UI，第一次反馈，第二次修改

// var ELEMENTAL_URLROOT = FixLanguage("res/elemental_en/");

//! 是否使用压缩资源
var USE_COMPRESS = false;

var ELEMENTAL_DEBUG_FG_FIRE = false;
var ELEMENTAL_DEBUG_FG_WIND = false;
var ELEMENTAL_DEBUG_FG_SOIL = false;
var ELEMENTAL_DEBUG_FG_WATER = false;

var ELEMENTAL_URLROOT;
if (ELEMENTAL_URLROOT == undefined) {
    // ELEMENTAL_URLROOT = FixLanguage("res/elemental/");
    ELEMENTAL_URLROOT = "res/elemental/";
}

var LANG_JSON = {
    en : ELEMENTAL_URLROOT + "elemental_langen.json",
    en_US : ELEMENTAL_URLROOT + "elemental_langen.json",
};

var LANG_STYLE = ELEMENTAL_URLROOT + "elemental_langstyle.json";
var LANG_HTMLSTYLE = ELEMENTAL_URLROOT + "elemental_langhtml.json";

var ELEMENTAL_SRCROOT;
var ELEMENTAL_RESNAME;
var ELEMENTAL_HELP;
var ELEMENTAL_GAMERULES;
var ELEMENTAL_HISTORY;

if (ELEMENTAL_SRCROOT == undefined) {
    if(USE_COMPRESS)
        cc.loader.loadCompressImage(ELEMENTAL_URLROOT + "compress_image.json", ELEMENTAL_URLROOT);
}
else {
    if(!cc.sys.isNative) {
        if(ELEMENTAL_RESNAME  == undefined)
            cc.loader.addResMapping(ELEMENTAL_URLROOT, ELEMENTAL_SRCROOT + 'resource.json');
        else
            cc.loader.addResMapping(ELEMENTAL_URLROOT, ELEMENTAL_SRCROOT + ELEMENTAL_RESNAME);

        if(USE_COMPRESS)
            cc.loader.addCompressImage(ELEMENTAL_URLROOT + "compress_image.json", ELEMENTAL_URLROOT);
    }
}

var GAMEAPI_ISAPI2 = true;
var GAMEAPI_CONSTLINES = true;
var GAMEAPI_CONSTTIMES = false;
