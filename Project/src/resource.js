var resloadlayer = {
};
var LOADLAYROOTERURL = "";
var APPH5_BASEURL;

if(APPH5_BASEURL != undefined)
    LOADLAYROOTERURL= APPH5_BASEURL;
if(CLIENT_LANGUAGE == "en_US"){
    LOADLAYROOTERURL = "res/loadlayer_en/";
    resloadlayer.string_json = "res/common_en/string.json";
}else {
    LOADLAYROOTERURL = "res/loadlayer/";
    resloadlayer.string_json = "res/common/string.json";
}
	
resloadlayer.newgamehall_impact_ttf = LOADLAYROOTERURL + "impact.ttf";
resloadlayer.Loadlayer_json = LOADLAYROOTERURL + "loading_layer.json";
resloadlayer.LoadlayerPng_png = LOADLAYROOTERURL + "loadingpng.png";
resloadlayer.LoadlayerPng_plist = LOADLAYROOTERURL + "loadingpng.plist";
resloadlayer.LoadlayeronPng_png = LOADLAYROOTERURL + "new_loading_bar.png";
resloadlayer.Loadlayer_in_game_notice_json = LOADLAYROOTERURL + "notice_frame_layer.json";
resloadlayer.toucherframe_json = LOADLAYROOTERURL + "toucherframe.json";
resloadlayer.toucherframe_png = LOADLAYROOTERURL + "toucherframe.png";
resloadlayer.toucherframe_plist = LOADLAYROOTERURL + "toucherframe.plist";


var spade_resources = [];
for (var i in resloadlayer) {
    spade_resources.push(resloadlayer[i]);
}

var res = {
};