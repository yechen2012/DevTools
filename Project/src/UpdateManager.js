var UpdateManager = cc.Class.extend({
	_packagePath: null,
	_festPath: null,
    _managerList: null,
    _listenerList: null,

	ctor: function(){
		var config = cc.game.config;
		this._packagePath = config["packagePath"];
		this._festPath = "res/manifests/";

		this._managerList = [];
		this._listenerList = [];
	},

	update: function(params){
		this._initParams(params);

		var that = this;
		args = arguments;
		var path = params.path;
		var type = "";
		if(params.type){
			type = params.type;
		}
		var manifestPath = this._festPath + path + ".manifest";
		var storagePath = cc.path.join(jsb.fileUtils.getWritablePath(), "games", path);
        cc.log("***********20170717*************12");
		//var manager = new jsb.AssetsManager(manifestPath, storagePath, this._packagePath);
        var manager = new jsb.AssetsManager("", "", path);
        cc.log("***********20170717*************13");
        if(path == "module_info_language" || path == "resource_language"){
            cc.log("***********20170508*************1");
            manager.batchDownloadLanguage(path,type);
            cc.log("***********20180508*************2");
		}else {
            manager.batchDownload(path,type);
		}
        cc.log("***********20170717*************14");
		//cc.log("manifestPath, storagePath, this._packagePath = ", manifestPath, storagePath, this._packagePath);
		var listener = new jsb.EventListenerAssetsManager(manager, function(event){
			switch (event.getEventCode())
			{
			case jsb.EventAssetsManager.UPDATE_PROGRESSION:
				var percent = event.getPercent();
				//var filePercent = event.getPercentByFile();
				//cc.log("Download percent : " + percent + " | File percent : " + filePercent,event.getAssetId());
				//if("@version"==event.getAssetId() || "@manifest"==event.getAssetId())	break; //一开始加载version.manifest和game.manifest为100的时候不显示
				params.progress(percent*100);
				break;
			case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
			case jsb.EventAssetsManager.UPDATE_FINISHED:
				//cc.log("Update finished.",event.getEventCode()," ****");
				
				//manager.decompressZipFile();
				that.removeManagerByName(path);
				params.success(path);
				break;
			case jsb.EventAssetsManager.UPDATE_FAILED:
				//manager.downloadFailedAssets();
				//break;

                that.removeManagerByName(path);
                var count = args[1] || 0;
                count ++;
                if(count > 2){
                    params.error(path);
                }
                else {
                    cc.log("下载失败尝试重新下载");
                    that.update(params, count);
                }

                break;
			case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
			case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
			case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
			case jsb.EventAssetsManager.ERROR_UPDATING:
			case jsb.EventAssetsManager.ERROR_DECOMPRESS:
				cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
				that.removeManagerByName(path);   //event.getMessage()

				var count = args[1] || 0;
				count ++;
				if(count > 2){
					
				}
				else {
					that.update(params, count);
				}
				break;
			default:
				break;
			}
		});

		//this._initSearchPaths(path);
		cc.eventManager.addListener(listener, 1);
		//manager.update();
		manager.retain();
		manager.setName(path);
		this._managerList.push(manager);
		this._listenerList.push(listener);
	},

	_initSearchPaths: function(path){
		var sPath = cc.path.join(jsb.fileUtils.getWritablePath(), "games", path);
		var sPath1 = cc.path.join(sPath, path);
		var searchPaths = jsb.fileUtils.getSearchPaths();
		searchPaths.push(sPath);
		searchPaths.push(sPath1);
		jsb.fileUtils.setSearchPaths(searchPaths);
	},

	_initParams: function(params){
		params = params || {};
		var fn = function(){};
		params.progress = cc.isFunction(params.progress) ? params.progress : fn;
		params.success = cc.isFunction(params.success) ? params.success : fn;
		params.error = cc.isFunction(params.error) ? params.error : fn;
		return params;
	},
	/*
	 * 删除加载
	 */
	_clearAssets : function(manager, listener)
	{
		manager.release();
		manager = null;
		cc.eventManager.removeListener(listener);
		listener = null;
		if (this._managerList.length > 0 && this._listenerList.length > 0) {
			this._managerList.shift();
			this._listenerList.shift();
		}
	},

	unUpdate: function () 	//取消下载
	{
        if (this._managerList.length > 0) {
			for (var i in this._managerList) {
				this._managerList[i].release();
				this._managerList[i] = null;
				cc.eventManager.removeListener(this._listenerList[i]);
			}
		}else {
		}
		this._listenerList = [];
		this._managerList = [];
	},

	removeManagerByName: function (name) {
		var manager = null;
		var listener = null;
		var num = 0;
		for (var i = 0; i < this._managerList.length; i++){
			if(this._managerList[i] && this._managerList[i].getName() == name){
				manager = this._managerList[i];
				listener = this._listenerList[i];
				num = i;
				break;
			}
		}
		if(manager && listener){//splice
            manager.release();
            manager = null;
            cc.eventManager.removeListener(listener);
            listener = null;
            cc.log("remove download game--->",name);
            if (this._managerList.length > 0 && this._listenerList.length > 0) {
				this._managerList.splice(num,1);
                this._listenerList.splice(num,1);
            }
            //this._clearAssets(manager,listener);
		}
    },

	getUpdateManager : function (name) {
		var manager = null;
        for (var i = 0; i < this._managerList.length; i++){
            if(this._managerList[i] && this._managerList[i].getName() == name){
                manager = this._managerList[i];

                return manager;
            }
        }
        return manager;
    },

	getManagerListSize : function () {
		return this._managerList.length;
    },

	getManagerName : function (num) {
		if(this._managerList.length>0 && this._managerList[num]){
			return this._managerList[num].getName();
		}
		return null;
    }


});


UpdateManager.create = function(){
	UpdateManager.it = UpdateManager.it || new UpdateManager();
	return UpdateManager.it;
};