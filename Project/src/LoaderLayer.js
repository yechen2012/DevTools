var LoaderLayer = cc.Layer.extend({
    _progressBar : null,
    downmoduletimes : 0,
    ctor : function()
    {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(resloadlayer.LoadlayerPng_plist);
        this.loadinglayer = ccs.load(resloadlayer.Loadlayer_json);
        this.addChild(this.loadinglayer.node);
        var progressBar = findChildByName(this.loadinglayer.node, "loadingbar");
        this.loadinglayer.node.runAction(this.loadinglayer.action);
        this.loadinglayer.action.gotoFrameAndPlay(0, this.loadinglayer.action.getDuration(), true);
        progressBar.setVisible(false);
        this.version_bussesid = findChildByName(this.loadinglayer.node,"version_bussesid");
        this.version_bussesid.setVisible(false);
        // var spritetest = cc.Sprite.create(progressBar);
        // this._progressBar = cc.ProgressTimer.create(spritetest);
        var pro_pos = progressBar.getPosition();
        var logo = new cc.Sprite(resloadlayer.LoadlayeronPng_png);
        logo.setScale(cc.contentScaleFactor());

        this._progressBar = new cc.ProgressTimer(logo);
        this._progressBar.type = cc.ProgressTimer.TYPE_BAR;
        this._progressBar.midPoint = cc.p(0, 0.5);
        this._progressBar.barChangeRate = cc.p(1, 0);
        this._progressBar.setPosition(pro_pos);
        this.addChild(this._progressBar, 20);
        this.initDownLoadHints();

        cc.log("加载loaderlayer");
        //this.init();
        if(cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID){
            cc.log("js调用java测试");
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","removeImageView","()V");
        }
    },

    initDownLoadHints : function () {
        var size = cc.view.getDesignResolutionSize();
        var progresspos = this._progressBar.getPosition();
        this.mText = cc.LabelTTF.create("", "simkai", 15, undefined, cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.addChild(this.mText);
        this.mText.setAnchorPoint(0,0.5);
        this.mText.setColor(cc.color(255, 255, 0, 255));
        this.mText.setString("");
        //this.mText.setVisible(false);
        this.mText.setPosition(cc.p(progresspos.x - this._progressBar.width/2, progresspos.y - this._progressBar.height*1.3));
    },

    initListener : function () {
        cc.log("00628loadlayer");
        // if(this.mText) this.mText.setVisible(true);
        var that = this;
        this.listener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,   //事件类型---自定义
            eventName: "module_inf",   //事件名称
            callback: function (event) {
                // that.downmoduletimes++;
                // cc.log("module文件下载次数",that.downmoduletimes);
                // if(that.downmoduletimes > 3){
                //     that.mText.setString("更新基础配置文件失败，请稍后重试。");
                //     return;
                // }
                cc.log("下载module_inf");
                that.mText.setString("module_inf");
                UpdateManager.create().update({
                    path: "module_inf",
                    progress: that._onProgress.bind(that),
                    success: that._onSuccess.bind(that),
                    error: that._onError.bind(that)
                });
            }

        });
        cc.eventManager.addListener(this.listener,1);
        this.listener1 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,   //事件类型---自定义
            eventName: "base",   //事件名称
            callback: function (event) {
                cc.log("下载base");
                that.mText.setString(StringMgrSys.getString_str("StringUpadtingBASE"));
                var str = event.getUserData();
                UpdateManager.create().update({
                    path: "base",
                    progress: that._onProgress.bind(that),
                    success: that._onSuccess.bind(that),
                    error: that._onError.bind(that)
                });
            }

        });
        cc.eventManager.addListener(this.listener1,1);
        this.listener2 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,   //事件类型---自定义
            eventName: "hall",   //事件名称
            callback: function (event) {
                cc.log("下载hall");
                that.mText.setString(StringMgrSys.getString_str("StringUpadtingHall"));
                var str = event.getUserData();
                UpdateManager.create().update({
                    path: "hall",
                    progress: that._onProgress.bind(that),
                    success: that._onSuccess.bind(that),
                    error: that._onError.bind(that)
                });
            }

        });
        cc.eventManager.addListener(this.listener2,1);
        this.listener3 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,   //事件类型---自定义
            eventName: "inithall",   //事件名称
            callback: function (event) {
                cc.log("inithall");
                that.init();
            }

        });
        cc.eventManager.addListener(this.listener3,1);

        //jsb.fileUtils.checkversion();
        this.request_version();
    },

    showversion : function (businessid) {
        var version_bussesid_str = "";
        if(nativever){
            version_bussesid_str = nativever;
        }
        if(scriptver){
            version_bussesid_str = version_bussesid_str + "." + scriptver;
        }
        if(businessid){
            var index = businessid.lastIndexOf("_");
            var str = businessid.substring(index + 1,businessid.length);
            version_bussesid_str = version_bussesid_str + "." + str;
        }
        this.version_bussesid.setVisible(true);
        this.version_bussesid.setString(version_bussesid_str);
    },

    request_version : function () {
        if(this.mText) this.mText.setVisible(true);
        this.mText.setString(StringMgrSys.getString_str("StringCheckTheVersionNeedsUpdated"));
        var busniessid = jsb.fileUtils.getAppId();
        var appversion = jsb.fileUtils.getAppVersion();
        var RequestUrl = jsb.fileUtils.getRequestUrl();
        var _language = jsb.fileUtils.getLanguage();
        nativever = appversion;
        if(_language != "main_cn"){
            StringMgrSys.curlanguage = _language;
            CLIENT_LANGUAGE = _language;
        }

        cc.log("js-->商户号是--",busniessid);
        cc.log("js-->版本号是--",appversion);
        if(busniessid == null || appversion == null){
            this.mText.setString(StringMgrSys.getString_str("StringVersionOrNumberIsError"));
            return;
        }
        var that = this;
        //http://47.90.12.179/publishr/checkver.php?businessid=123&nativever=1709050&clienttype=ios
        var str1 = "";//"http://47.90.12.179/publishr/checkver.php?businessid=";
        if(isformal){
            cc.log("************------#########这是测试版#########------************");
            //RequestUrl = "http://47.90.12.179/publishr/checkver.php";
            str1 = RequestUrl + "?businessid=";
            //busniessid = "NNTI_TEST_TEST1";

        }else {
            cc.log("************------#########这是正式版#########------************");
            str1 = RequestUrl + "?businessid=";

        }
        if(busniessid == "NNTI_TEST_TEST1" || busniessid == "NNTI_TESTS_G2E"){
            isLive = true;
        }
        showbusiness = busniessid;
        this.showversion(busniessid);
        var str2 = "&nativever=";
        var str3 = "&clienttype=";
        var clienttype = "";
        if(cc.sys.os == cc.sys.OS_ANDROID){
            clienttype = "android";
        }else if(cc.sys.os == cc.sys.OS_IOS){
            clienttype = "ios";
        }else {
            clienttype = "pc";
        }
        var _Url = str1 + busniessid + str2 + appversion + str3 + clienttype + "&language=" + CLIENT_LANGUAGE;//"http://opf3c8vyq.bkt.clouddn.com/version.json";
        cc.log("Url的地址是",_Url);
        var xhr = cc.loader.getXMLHttpRequest();
        var total = 0;
        var _md5 = "";
        var _downurl = "";
        xhr.timeout = 10000;
        xhr.open("GET", _Url, true);
        cc.log("start getpath:  ",_Url);

        //注册相关事件回调处理函数
        xhr.onload = function(e) {
            if(this.status == 200||this.status == 304){
                cc.log(this.responseText);
            }
        }.bind(this);
        xhr.ontimeout = function(e) {
            var _e = e;
            cc.log("xhr.ontimeout");
            that.mText.setString(StringMgrSys.getString_str("StringRequestVersionTimeout"));
            that.loaderlayer_notice(StringMgrSys.getString_str("StringRequestVersionTimeoutCheckNet"),"");
        }.bind(this);
        xhr.onerror = function(e) {
            var _e = e;
            cc.log("xhr.onerror");
            that.mText.setString(StringMgrSys.getString_str("StringRequestVersionFail"));
            that.loaderlayer_notice(StringMgrSys.getString_str("StringRequestVersionFailCheckNet"),"");
        }.bind(this);

        xhr.onreadystatechange = function () {
            var _readyState = xhr.readyState;
            var _status = xhr.status;
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
                var httpStatus = xhr.statusText;
                var response = xhr.responseText;
                var jsonData = JSON.parse(response);
                cc.log("analysis pathdata...");
                cc.log("jsonData:",jsonData);
                var isdownNewApp = false;
                for(var i in jsonData)
                {
                    cc.log(jsonData[i]);
                    if(i == "downloadurl"){
                        _downurl = jsonData[i];
                        cc.log("downloadurl=======",_downurl);
                    }
                    if(i == "md5"){
                        _md5 = jsonData[i];
                        cc.log("_md5=======",_md5);
                    }
                    if(i == "native"){
                        that.mText.setString(StringMgrSys.getString_str("StringTheVersionIsLow"));
                        var downappurl = jsonData[i];
                        that.loaderlayer_notice(StringMgrSys.getString_str("StringTheVersionIsLow"),downappurl);
                        isdownNewApp = true;
                    }
                    if(i == "serv"){
                        g_servaddr = jsonData[i];

                        // g_servaddr = "wss://server.dtgame-dtweb.com";        //g2e
                        // g_servaddr = "ws://47.90.46.159:3720";                  //test1
                        cc.log("服务器的地址是",g_servaddr);
                    }
                    if(i == "businesslist"){
                        CommonType = true;
                        CommonTypeList = jsonData[i];
                    }
                }
                if(isdownNewApp){
                    return;
                }
                if(total == 0){
                    cc.log("网络请求测试----》jjjjjj");
                    jsb.fileUtils.checkversion(_md5,_downurl);
                }
                total++;
                cc.log("total-->",total);
            }else
            {
                cc.log("请求失败");
                //网络地址请求失败后错误提示
                if(xhr.status == 403){
                    that.mText.setString(StringMgrSys.getString_str("StringRequestVersionFail"));
                    that.loaderlayer_notice(StringMgrSys.getString_str("StringRequestVersionBlocked"),"");
                }else {
                    that.mText.setString(StringMgrSys.getString_str("StringRequestVersionFail"));
                    that.loaderlayer_notice(StringMgrSys.getString_str("StringRequestVersionFailCheckNet"),"");
                }
            }
        }.bind(this);
        xhr.send();
    },

    init : function () {
        this.loadjs();
        return;
        HallData.setGameData("hall",1,"isdownload");
        var isload = HallData.getGameData("hall","isdownload");
        if(cc.sys.isNative && !isload){
            UpdateManager.create().update({
                path: "hall",
                progress: this._onProgress.bind(this),
                success: this._onSuccess.bind(this),
                error: this._onError.bind(this)
            });
        }else {
            this.loadjs();
        }

    },

    _onProgress: function(dt)
    {
        cc.log("xiazaijindu--->",dt);
        this._progressBar.setPercentage(dt);
    },

    _onSuccess: function(path)
    {

        cc.log("xiazaiwancheng");
        this._progressBar.setPercentage(100);
        if(path == "hall"){
            //cc.log("0623:12--2");
            //this.loadjs();
            this.mText.setVisible(false);
        }
        if(path == "base"){
            cc.log("base download success timeout");
            this.mText.setString(StringMgrSys.getString_str("StringRestartingTheClient"));
            cc.game.restart();
            //jsb.fileUtils.RefreshView();
            //setTimeout(function () {
            //    cc.log("base download success refreshview");
            //    jsb.fileUtils.RefreshView();
            //},3000)
        }

    },

    _onError: function(msg)
    {
        cc.log("尝试三次后下载失败",msg);
        var str = "下载" + msg + "失败！"
        this.mText.setString(str);
        var notice_str = "下载" + msg + "失败，请重试！";
        this.loaderlayer_notice(notice_str,"",msg);

        //this._progress.setMessage(mm.Locale.getString("DOWNLOAD_FAILED"));
    },

    loadjs : function () {
        // showRotate(cc.director.getRunningScene());
        var that = this;
        var loadManager = LoaderManager.create();
        loadManager.loadJsByModule("hall", function () {
            that.loadRes();
        });


    },

    loadservpath : function(){
        var self = this;
        cc.loader.loadJson(reshall.servpath_json,function (err,data) {
            if(err){
                cc.log("load servpath json faild");
            }
            if(data){
                ServPathArr = data;
                initservpath();
                ToLogin(self);
                //设置是否是大厅版本
                GameAssistant.singleton.setNative(true);
                // self.hide();
                if(!DTTOKEN)
                    self.hide();
            }
        })
    },

    loadgamesname : function(){
        var self = this;
        cc.loader.loadJson(reshall.slotsgame_json,function (err,data) {
            if(err){
                cc.log("load slotsgame json faild");
            }
            if(data){
                if(cc.sys.isNative){
                    ToLogin(self);
                    // self.hide();
                    if(!DTTOKEN)
                        self.hide();
                }else {
                    self.loadservpath();
                }
            }
        })
    },

    loadRes : function(){
        var self = this;
        cc.loader.load(hall_resources,
            function (result, count, loadedCount) {
                var pe = loadedCount/count*100;
                pe = Math.min(pe, 100);
                self._progressBar.setPercentage(pe);
            }, function () {
                //that.loadgamesname();
                if(cc.sys.isNative){
                    ToLogin(self);
                    // self.hide();
                    if(!DTTOKEN)
                        self.hide();
                }else {
                    self.loadservpath();
                }
            });
    },

    hide : function () {
        cc.log("close loader frame");
        this.setVisible(false);
        this.removeFromParent(true);
    },

    loaderlayer_notice : function(str,str1,str2) {
        var that = this;
        var framelayer = new MaskLayer();
        framelayer.setOpacity(100);
        foripad(framelayer);
        cc.director.getRunningScene().addChild(framelayer,998);
        var choiselayer = ccs.load(resloadlayer.Loadlayer_in_game_notice_json).node;
        var notice_str_1 = findChildByName(choiselayer, "notice_str_1");
        var notice_str_2 = findChildByName(choiselayer, "notice_str_2");
        var enterbtn = findChildByName(choiselayer,"enterbtn");
        var lookonbtn = findChildByName(choiselayer,"lookonbtn");
        notice_str_2.setVisible(false);
        enterbtn.setVisible(false);
        lookonbtn.setVisible(false);
        notice_str_1.setFontSize(18);
        notice_str_1.setString(str);

        framelayer.addChild(choiselayer);

        var confirmbtn = new ccui.Button();
        confirmbtn.setTouchEnabled(true);
        confirmbtn.loadTextures("notice_frame_queding1.png","notice_frame_queding2.png","notice_frame_queding2.png",ccui.Widget.PLIST_TEXTURE);
        confirmbtn.setPosition(enterbtn.x + enterbtn.width/2,enterbtn.y);
        choiselayer.addChild(confirmbtn);
        confirmbtn.addTouchEventListener(function (senter, type) {
            if (type != ccui.Widget.TOUCH_ENDED)
                return;
            if(framelayer){
                framelayer.removeFromParent(false);
                framelayer = null;
            }
            if(str1 == ""){
                if(str2){
                    var event = new cc.EventCustom(str2);
                    //event.setUserData(selfPointer._item1Count.toString());
                    cc.eventManager.dispatchEvent(event);
                }else {
                    that.request_version();
                }
            }else {
                var downappurl = str1;
                if(cc.sys.os == cc.sys.OS_ANDROID){
                    cc.log("下载的地址为---->",downappurl);
                    //cc.Application.getInstance().openURL("http://fir.im/dtslotsAndroid");
                    cc.sys.openURL(downappurl);
                }
                if(cc.sys.os == cc.sys.OS_IOS){
                    cc.log("下载的地址为---->",downappurl);
                    //cc.Application.getInstance().openURL("http://fir.im/dtslots");
                    cc.sys.openURL(downappurl);
                }
            }

        } ,this);
    }

})

var LoaderScene = cc.Scene.extend({

    onEnter: function () {
        this._super();
        var layer = new LoaderLayer();
        cc.log("foripade    LoaderLayer");
        foripad(layer);
        this.addChild(layer);
        setTimeout(function () {
            //var _isformal = "";//ccs.load("testserver.json").node;
            //_isformal = cc.director.isDisplayStats();
            //isformal = _isformal;
            if(cc.sys.isNative){
                cc.log("jsb.fileUtils.checkversion();++++");
                //var _isformal = jsb.fileUtils.isFileExist("testserver.json");
                //isformal = _isformal;
                layer.initListener();
            }else {
                if(!isformal){
                    //g_servaddr = "ws://serverapp.dreamtech8.info";
                    //g_servaddr = "ws://47.90.12.179:3816";
                }
                showbusiness = business;
                layer.showversion(business);
                //business = "NNTI_SUN_QY8";
                //business = "NNTI_TESTS_G2E";
                layer.init();

            }
        },50);
    }

});

function findChildByName(node, name) {
    var cn = null;
    if (node.getChildByName != undefined) {
        cn = node.getChildByName(name);
        if (cn != null) {
            return cn;
        }
    }

    if (node.getChildren != undefined) {
        var children = node.getChildren();
        for (var ii = 0; ii < children.length; ++ii) {
            cn = findChildByName(children[ii], name);
            if (cn != null) {
                return cn;
            }
        }
    }

    return null;
}
