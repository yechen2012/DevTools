/**
 * Created by ssscomic on 2016/6/12.
 */

// var COMMON_URLROOT = "https://dtresource.dtservice.org/newgame/common_en/res/";
// var COMMON_SRCROOT = "https://dtresource.dtservice.org/newgame/common_en/v4/";
//var COMMON_URLROOT = "res/common_jp/";

var COMMON_URLROOT;
if (COMMON_URLROOT == undefined) {
    COMMON_URLROOT = "res/common/";
}
var COMMON_LANG_JSON = {
    en : COMMON_URLROOT + "common_langen.json",
    en_US : COMMON_URLROOT + "common_langen.json",
    de : COMMON_URLROOT + "common_langde.json",
    fi : COMMON_URLROOT + "common_langfi.json",
    sv : COMMON_URLROOT + "common_langsv.json",
    zh_CN: COMMON_URLROOT + "common_langzh.json",
    zh: COMMON_URLROOT + "common_langzh.json",
    no: COMMON_URLROOT + "common_langno.json",
    jp: COMMON_URLROOT + "common_langjp.json",
    it: COMMON_URLROOT + "common_langit.json",
    ru: COMMON_URLROOT + "common_langru.json",
};
//Style基本逻辑是占位符，默认不存在多语言
var COMMON_LANG_STYLE = COMMON_URLROOT + "common_langstyle.json";

var COMMON_RESNAME;

var COMMON_SRCROOT;
if (COMMON_SRCROOT == undefined) {
    //COMMON_SRCROOT = "https://dtresource.dtservice.org/newgame/common/v1/";
}
else {
    if(!cc.sys.isNative) {
        if (COMMON_RESNAME == undefined)
            cc.loader.addResMapping(COMMON_URLROOT, COMMON_SRCROOT + 'resource.json');
        else
            cc.loader.addResMapping(COMMON_URLROOT, COMMON_SRCROOT + COMMON_RESNAME);
    }
}

//0 内部测试地址  1 外部地址
var MODE_CONTROL = 0;
//版本号
var MODE_VER = "v101";
