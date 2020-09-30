function FixLanguage(str) {
   
    return str;
}

var resloadlayer = {
};
var LOADLAYROOTERURL = "";
var APPH5_BASEURL;

if(APPH5_BASEURL != undefined)
    LOADLAYROOTERURL= APPH5_BASEURL;
	
resloadlayer.newgamehall_impact_ttf = LOADLAYROOTERURL + "res/loadlayer/impact.ttf";
resloadlayer.Loadlayer_json = LOADLAYROOTERURL + "res/loadlayer/loading_layer.json";
resloadlayer.LoadlayerPng_png = LOADLAYROOTERURL + "res/loadlayer/loadingpng.png";
resloadlayer.LoadlayerPng_plist = LOADLAYROOTERURL + "res/loadlayer/loadingpng.plist";
resloadlayer.LoadlayeronPng_png = LOADLAYROOTERURL + "res/loadlayer/new_loading_bar.png";
resloadlayer.Loadlayer_in_game_notice_json = LOADLAYROOTERURL + "res/loadlayer/notice_frame_layer.json";
resloadlayer.toucherframe_json = LOADLAYROOTERURL + "res/loadlayer/toucherframe.json";
resloadlayer.toucherframe_png = LOADLAYROOTERURL + "res/loadlayer/toucherframe.png";
resloadlayer.toucherframe_plist = LOADLAYROOTERURL + "res/loadlayer/toucherframe.plist";
resloadlayer.string_json = LOADLAYROOTERURL + "res/common/string.json";

var spade_resources = [];
for (var i in resloadlayer) {
    spade_resources.push(resloadlayer[i]);
}

var res = {
};