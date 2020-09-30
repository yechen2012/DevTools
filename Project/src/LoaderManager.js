/*
 * 管理加载js文件用的
 * */
var halljslist = [];
var gamearr = [];
var LoaderManager = cc.Class.extend({
	_moduleMap: null,
	
	// ctor: function(module){
	// 	this._resources = this._resetResource();
	// },
	
	loadJsByModule: function(moduleName, cb, dir, json){

		var self = this;
		var isyasuojs = false;
		//var moduleminfile = APPH5_BASEURL + "/" + moduleName + ".min.js";
		//var tempArr = [moduleminfile];
        self.unloadJs();
        if(moduleName != "hall" && CLIENT_LANGUAGE == "en_US"){
            json = json || (HallReleaseUrl + "src/" + moduleName + "/project_en.json");
        }else {
            json = json || (HallReleaseUrl + "src/" + moduleName + "/project.json");
        }
        if(cc.sys.isNative){
            //json = json || (HallReleaseUrl + "src/" + moduleName + "/project.json");
            var _json = json;
            cc.log("json =========== ", json);
            var isjsonexist = jsb.fileUtils.isFileExist(json);
            if(isjsonexist == false){
                cc.log("lcs_test   文件不存在");
                json = HallReleaseUrl + "src/" + moduleName + "/project.json";
            }else {
                cc.log("lcs_test   文件存在");
            }
            cc.loader.loadJson(json, function (err, data) {
                self._moduleMap = data;

                var tempArr = self._moduleMap["jsList"];
                if (moduleName == "hall")
                    halljslist = tempArr;
                else {
                    tempArr = self.pickjsforhall(tempArr);
                    gamearr = tempArr;
                }
                cc.loader.loadJs(tempArr, function () {
                    //self.addPlist(hall_resources);
                    if (cc.isFunction(cb)) cb();
                });
            });
		}else {
            var moduleminfile = APPH5_BASEURL + "/" + moduleName + ".min.js";
            tempArr = [moduleminfile];
            cc.loader.loadJs(tempArr, function (err, data) {
                //self.addPlist(hall_resources);
                if (data.length > 0) {
                    isyasuojs = true;
                    gamearr = tempArr;
                    if (cc.isFunction(cb)) cb();
                } else {
                    var moduleNameDoc = moduleName;
                    //json = json || (HallReleaseUrl + "src/" + moduleName + "/project.json");
                    var _json = json;
                    cc.log("json =========== ", json);
                    cc.loader.loadJson(json, function (err, data) {
                        self._moduleMap = data;

                        var tempArr = self._moduleMap["jsList"];
                        if (moduleName == "hall")
                            halljslist = tempArr;
                        else {
                            tempArr = self.pickjsforhall(tempArr);
                            gamearr = tempArr;
                        }
                        cc.loader.loadJs(tempArr, function () {
                            //self.addPlist(hall_resources);
                            if (cc.isFunction(cb)) cb();
                        });
                    });
                }
            });
        }
        // if(moduleName == "bigred"){
        //     var tempArr = ["bigred.min.js"];
        //     cc.loader.loadJs(tempArr, function (err,data) {
        //         //self.addPlist(hall_resources);
        //         if(data.length > 0){
        //             isyasuojs = true;
        //             if(cc.isFunction(cb)) cb();
        //         }
        //     });
        // }
	},

	pickjsforhall : function (arr) {
		var _arr = [];
		var isin = false;
		for(var i = 0; i < arr.length; i++){
			for(var j = 0; j < halljslist.length; j++){
				if(arr[i] == halljslist[j]){
					//cc.log(arr[i],"in halljslist");
					isin = true;
                    break;
				}else
					isin = false;
			}
			if(!isin){
                //cc.log(arr[i],"is not in halljslist");
				if(arr[i] != "src/resource.js"){
				    if(arr[i] != "src/strings.js")
                        _arr.push(arr[i]);
                }
			}
		}
		return _arr;
    },

    addPlist : function (res) {
        if (res == null) return null;
        for (var i in res) {
            if (typeof res[i] == "string") {
                if (res[i].indexOf(".plist")>0) {
                    //tempArr.push(res[i]);
                    cc.spriteFrameCache.addSpriteFrames(res[i]);
                }
            }
        }
    },

	unloadJs: function(){
		if(!gamearr) return ;

		for(var i in gamearr){
			var js = gamearr[i];
			cc.log("unloadjs:  ", js);
			cc.loader.release(js);
			cc.sys.cleanScript(js);
		}
        gamearr = [];
	}
});

LoaderManager.create = function(){
	cc.log("LoaderManager.create ...................................");
	LoaderManager._it = LoaderManager._it || new LoaderManager();
	return LoaderManager._it;
};

// var LoaderResManager = cc.Class.extend({
// 	loadRes : function(){
//         var that = this;
//         g_resources = [];
//         for (var i in res) {
//             g_resources.push(res[i]);
//         }
//         cc.loader.load(g_resources,
//             function (result, count, loadedCount) {
//
//                 cc.log(loadedCount/count);
//             }, function () {
//                 if (that._onEnterGame) that._onEnterGame();
//         });
//     }
// });
//
// LoaderResManager.create = function(){
// 	cc.log("LoaderResManager.create ...................................");
// 	LoaderResManager._it = LoaderResManager._it || new LoaderResManager();
// 	return LoaderResManager._it;
// };
