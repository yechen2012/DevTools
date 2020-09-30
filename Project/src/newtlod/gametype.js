/**
 * Created by ssscomic on 2016/6/12.
 */

var GAMETYPE_CURTYPE    =   13;
var GAMETYPE_CURCODE    =   'tlod';

//var TLOD_URLROOT = "res/tlod_en/";

var TLOD_URLROOT;
if (TLOD_URLROOT == undefined) {
    TLOD_URLROOT = "res/newtlod/";
}

var NEWTLOD_URLROOT;
if (NEWTLOD_URLROOT == undefined) {
    NEWTLOD_URLROOT = "res/newtlod/";
}

var TLOD_SRCROOT;
if (TLOD_SRCROOT == undefined) {
}
else {
    if(!cc.sys.isNative)
        cc.loader.addResMapping(NEWTLOD_URLROOT, TLOD_SRCROOT + 'resource.json');
}

var GAMEAPI_ISAPI2 = true;
var GAMEAPI_CONSTLINES = true;
var GAMEAPI_CONSTTIMES = true;