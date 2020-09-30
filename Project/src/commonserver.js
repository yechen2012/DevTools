//var DTSDK_URL = "ws://192.168.31.33:19000";
// var DTSDK_USER = "dttest1";
// var GAMETYPE_CURCODE = "dnp";
var DTSDK_URL;
if(DTSDK_URL == undefined){
    // DTSDK_URL = "wss://dtcomserv.dtgame-dtweb.com";
    DTSDK_URL = "ws://192.168.2.202:19000";
    // DTSDK_URL = "ws://47.75.11.61:19000";
}
var DTSDK_USER;
if(DTSDK_USER == undefined){
    DTSDK_USER = "dttest1";
}

var CLIENT_LANGUAGE;
if(typeof(lang) != 'undefined')
    CLIENT_LANGUAGE = lang;
else if(window && window.dtcfg && window.dtcfg.licenseConfig && window.dtcfg.licenseConfig.language)
    CLIENT_LANGUAGE = window.dtcfg.licenseConfig.language;

var GAMETYPE_CURCODE;
if(window && window.dtcfg && window.dtcfg.licenseConfig && window.dtcfg.licenseConfig.gamecode)
    GAMETYPE_CURCODE = window.dtcfg.licenseConfig.gamecode;

if(GAMETYPE_CURCODE == undefined){
    GAMETYPE_CURCODE = "";
}

var DTSDK_CLIENT;
if(window && window.dtcfg && window.dtcfg.clienttype)
    DTSDK_CLIENT = window.dtcfg.clienttype;
if(DTSDK_CLIENT == undefined){
    DTSDK_CLIENT = "web";
}

var DTSDK_isNative;
if(DTSDK_isNative == undefined)
    DTSDK_isNative = false;

// DTSDK_URL = "";
//g_flblogintoken = "b1bb7e681a546434e665d109c7941566";
// CLIENT_LANGUAGE = "zh_CN";
// GAMETYPE_CURCODE = "";
// DTSDK_CLIENT = "web";
// DTSDK_isNative = "";

var isHallApp;
// 协议主类型
var DTSDKMainType ={
    MainBase :0,      //主基础协议
    MainAccount :1,   // 主账号协议
    MainGame :2,      //主游戏协议
}
// 主账号协议子类型
var DTSDKSubAccountType={
    SubLoginReq :0,        // 客户端登录请求
    SubLoginRsp :1,        // 服务器登录返回
}
// 主基础协议子类型
var DTSDKSubBaseType={
    SubKeepAliveReq :0,   //客户端心跳请求
    SubKeepAliveRsp :1,   //服务器心跳返回
    SubErrRsp :2,         //服务器错误提示消息推送
    SubCmdRet :3,
    // SubUnmarshal :4,        //服务器无法解析的消息
}
// 主游戏协议子类型
var DTSDKSubGameType={
    FreeSpinRsp : 0,  //是否有免费红包的推送
    FreeSpin : 1,    //下发未使用的免费红包列表消息
    SubChangeScreenRequest : 2,     //切换横竖屏请求
}

//这是开始加载资源的时间戳
var startLoadResTime = new Date().getTime();

var CommonServer = cc.Class.extend({
    sendmsgarr : [],
    NetConnectTimer:null,
    NetConnectTime:3,
    NetConnectTimerDone:false,
    DtSdkNetDone:false,
    GameNetDone:false,
    //红包提醒动画是否显示
    RedPackAniShow:false,
    //红包宝箱是否点击
    isRedPacketTouch:false,
    //控制是否是红包状态，是就显示提示框，不是几不显示提示框
    isInRedPacket:false,
    //token是否登陆成功
    isTokenLoginSuccess:false,
    //是否正在显示免费红包
    isShowFreeRedPacket:false,
    //免费红包数据
    commonfreegamedata:null,
    commonfreegamedataarr:[],
    //dtsdk服务器版本号
    dtsdkServerVersion:null,
    //玩家投注额和最小限制额
    RedPacketRainBet:{
        minLimitBet: undefined,
        betPrice: undefined
    },
    //是否是第一次的登录
    isLogin:true,
    sendScreensCanvasIndex:-1,
    sendScreensInfoTimer:undefined,

    //获取玩家用户名和密码
    setUserPassWord : function (user,password) {
        this.user = user;
        this.password = password;
    },

    //2个网络连接定时器，规则在上面注释
    startNetTimer : function () {
        if(this.NetConnectTimer == null){
            var self = this;
            this.NetConnectTimer = setInterval(function () {
                var touchertime = new Date();
                cc.log("这是按下时间",touchertime.getMinutes(),":",touchertime.getSeconds(),".",touchertime.getMilliseconds()); //1495302061441
                self.NetConnectTime--;
                if(self.NetConnectTime < 0){
                    self.removeNetTimer();
                }
            },1000);
        }
    },

    //移除定时器
    removeNetTimer : function () {
        if(this.NetConnectTimer){
            clearInterval(this.NetConnectTimer);
            this.NetConnectTimer = null;
            this.NetConnectTime = 3;
            this.NetConnectTimerDone = true;
        }
        if(this.GameNetDone == true && GameMgr.singleton.curGameLayer == undefined){
            cc.director.runScene(new GameScene());
        }
        // this.startRedPacket();
    },

    //dtsdk连上并收到登录消息的处理
    onDtSdkOrGameDone : function () {

        if(this.GameNetDone == true && this.NetConnectTimerDone == false && this.DtSdkNetDone == false){
            //在定时器里，游戏服先连上，等待...

        }else if(this.GameNetDone == true && this.NetConnectTimerDone == false && this.DtSdkNetDone == true){
            //在定时器里，游戏服，dtsdk服都连上，初始化界面
            this.removeNetTimer();
        }else if(this.GameNetDone == false && this.NetConnectTimerDone == false && this.DtSdkNetDone == true){
            //在定时器里，dtsdk服先连上，保存数据，等待...

        }else if(this.GameNetDone == false && this.NetConnectTimerDone == true && this.DtSdkNetDone == true){
            //在定时器后，dtsdk连上，保存数据，等待...

        }else if(this.GameNetDone == true && this.NetConnectTimerDone == true && this.DtSdkNetDone == true){
            //在定时器后，游戏服，dtsdk服都连上，初始化界面
            if(GameMgr.singleton.curGameLayer == undefined){
                cc.director.runScene(new GameScene());
            }

        }else if(this.GameNetDone == true && this.NetConnectTimerDone == true && this.DtSdkNetDone == false){
            //在定时器后，游戏服连上，dtsdk服没有连上，初始化界面
            if(GameMgr.singleton.curGameLayer == undefined)
                cc.director.runScene(new GameScene());
        }
    },

    initCommonServer : function () {
        //var DTSDK_URL = "ws://192.168.31.33:19000";
        // var DTSDK_USER = "dttest1";
        // var GAMETYPE_CURCODE = "dnp";
        if(typeof(cc.game.config.isApp) != 'undefined' && cc.game.config.isApp){
            //g_flblogintoken = "34b66599ab74dcf33daa760fbc411681";
            DTSDK_CLIENT = "native";
            if(cc.sys.isNative){
                DTSDK_isNative = true;
            }
        }
        var isconneting = false;
        if(typeof(dtsdk) != 'undefined'){
            isconneting = dtsdk.getConneting();
        }
        cc.log("DTSDK_URL",DTSDK_URL);
        if(typeof(dtsdk) != 'undefined' && typeof(DTSDK_URL) != 'undefined' && isconneting == false && typeof(dtsdk.onWebSocketState) != 'undefined') {
            dtsdk.init(DTSDK_URL);
            dtsdk.onWebSocketState(this.onWebSocketOpen.bind(this),this.onWebSocketOnMessage.bind(this),this.onWebSocketOnError.bind(this),this.onWebSocketOnClose.bind(this));
            this.initAgreenent();
            this.startNetTimer();
        }else {
            this.DtSdkNetDone = true;
            this.isTokenLoginSuccess = true;
            this.NetConnectTimerDone = true;
        }
    },
    //协议详情
    initAgreenent : function () {
        //解析服务端的数据
        //主基础协议 -- 客户端心跳请求 0-0
        //主基础协议 -- 客户端心跳返回 0-1
        //主基础协议 -- 服务器错误提示消息推送 0-2
        this.pushCallBack(DTSDKMainType.MainBase,DTSDKSubBaseType.SubErrRsp,this.onSubErrRsp.bind(this));
        //主基础协议 -- 通用返回 0-3
        this.pushCallBack(DTSDKMainType.MainBase,DTSDKSubBaseType.SubCmdRet,this.onSubCmdRet.bind(this));
        // //主基础协议 -- 服务器无法解析的消息 0-4
        // this.pushCallBack(DTSDKMainType.MainBase,DTSDKSubBaseType.SubUnmarshal,this.onSubUnmarshal.bind(this));

        //主账号协议 -- 服务器登录请求   token登录请求 1-0      ----->onTokenLoginRequest
        //主账号协议 -- 服务器登录返回   token登录返回 1-1
        this.pushCallBack(DTSDKMainType.MainAccount,DTSDKSubAccountType.SubLoginRsp,this.onTokenLoginResponse.bind(this));
        //主游戏协议 -- 是否有免费红包的推送消息 4-27
        this.pushCallBack(DTSDKMainType.MainGame,DTSDKSubGameType.FreeSpinRsp,this.onCheckFreeRedPacketsAdd.bind(this));
        this.pushCallBack(DTSDKMainType.MainGame,DTSDKSubGameType.FreeSpin,this.onCheckFreeRedPacketAdd.bind(this));
        // this.pushCallBack(DTSDKMainType.MainGame,DTSDKSubGameType.SubChangeScreenRequest,this.onChangeScreenRequest.bind(this));
    },
    //绑定回调协议
    pushCallBack : function(maintype,subtype,callback){
        //cc.log("maintype",maintype,"subtype",subtype);
        if(typeof(dtsdk.pushCallBack) != 'undefined'){
            dtsdk.pushCallBack(maintype,subtype,callback);
        }
    },

    //网络连接成功
    onWebSocketOpen : function(evt){
        cc.log('info', 'connect dtapiserv ' + DTSDK_URL + ' ok.');
        cc.log("net open", " ");
        //网络连接成功了后，可能没有断开心跳连接，这里可以断开
        var dtsdkclient = dtsdk.getDtsdkclient();
        dtsdkclient.stopHeartTimer();
        this.onlogin();
        this.isInRedPacket = false;
        this.isTokenLoginSuccess = false;
    },
    //接受消息
    onWebSocketOnMessage : function(evt){
        cc.log("ceshiceshisss");
    },
    //网络连接错误
    onWebSocketOnError : function(evt){
    },
    //网络连接失败
    onWebSocketOnClose : function(evt){
        cc.log("ceshiceshi");
        for(var i = 0; i < this.sendmsgarr.length; i++){
            if(this.sendmsgarr[i].maintype == 1 && this.sendmsgarr[i].subtype == 0){
                this.sendmsgarr.splice(i,1);
                i--;
            }
        }
        // this.sendmsgarr = [];
        var errinfo = StringMgrSys.getString_str("StringNetError");
        //弱连接，不显示提示框
        this.showNotice(errinfo);
        this.isInRedPacket = false;
        this.isTokenLoginSuccess = false;
    },

    //创建dtsdk里的数据对象
    createObject : function(mainype,subtype){
        if(typeof(dtsdk) == 'undefined')
            return undefined;

        var obj = dtsdk.createObject(mainype,subtype);
        return obj;
    },
    //向dtsdk发送请求1
    sendMsgToDtsdk : function(maintype,subtype,msg,callback,isignore){
        if(maintype == DTSDKMainType.MainBase && subtype == DTSDKSubBaseType.SubKeepAliveReq){
            cc.log("不添加到消息队列里");
            dtsdk.sendMsgToDtsdk(maintype,subtype,msg,callback);
        }else {
            this.debugifo(maintype,subtype,msg);
            if(maintype == 1 && subtype == 0) {
                this.sendmsgarr.unshift({maintype: maintype,subtype: subtype,msgobj: msg,callback: callback,sendstate: 0,isignore: isignore});
            }else {
                this.sendmsgarr.push({maintype: maintype,subtype: subtype,msgobj: msg,callback: callback,sendstate: 0,isignore: isignore});
            }
            this._send();

        }
    },
    debugifo : function(maintype,subtype,msg) {
        var str = "";
        for(var i in msg){
            if(i != "toJSON"){
                str = str + i + ":" + msg[i] + "  ";
            }
        }
        //cc.log(str.toJSON());
        str = "dtsdk---log--->" + "maintype--" + maintype + ",subtype--" + subtype + ",msg--" + str + ".";
        cc.log("dtsdk发送请求");
        cc.log(str);
    },
    //向dtsdk发送请求2
    _send : function(){
        if(typeof(dtsdk) == 'undefined')
            return;

        if(this.sendmsgarr.length <= 0)
            return;
        if(!dtsdk.getConneting()){
            if(this.sendmsgarr[0].isignore){
                this.sendmsgarr.splice(0,1);
                return;
            }
            var errinfo = StringMgrSys.getString_str("StringErrorCode_Msg");
            this.showNotice(errinfo);
            return;
        }

        this.sendmsgarr[0].sendstate = 1;
        dtsdk.sendMsgToDtsdk(this.sendmsgarr[0].maintype,this.sendmsgarr[0].subtype,this.sendmsgarr[0].msgobj,this.sendmsgarr[0].callback);
    },

    //主基础协议 -- 服务器错误提示消息推送 0-2
    onSubErrRsp : function (msg) {
        var errinfo = StringMgrSys.getString_str("StringNetError");
        if(msg){
            //收到错误消息则断开网络连接
            if(typeof(dtsdk.getDtsdkclient) != "undefined"){
                var dtsdk_client = dtsdk.getDtsdkclient();
                if(dtsdk_client){
                    // dtsdk_client.closebyclient();
                    dtsdk_client.reconnectTimes = 5;
                    dtsdk_client.isByActive = true;
                }
            }
            cc.log("msg.errCode, timeout");
            if(msg.errCode == 6 && msg.errCodeParam){
                // var errinfo = makeErrInfodtsdk(msg.errCodeParam, null);
                var errparam = {};
                errparam.dtapierrcode = msg.errCodeParam;
                var errinfo = makeErrInfo3(msg.errCode, errparam);
                // GameMgr.singleton.onError(0, errinfo, 2);
                this.showNotice(errinfo);
                return;
            }
            //errinfo = makeErrInfodtsdk("D999_"+msg.errCode, null);
        }
        this.showNotice(errinfo);

    },
    //主基础协议 -- 通用返回 0-3
    onSubCmdRet:function(msg) {
        cc.log("dtsdk-通用返回-msg.isok",msg.isOk);
        cc.log("dtsdk-通用返回-msg.mainType",msg.mainType);
        cc.log("dtsdk-通用返回-msg.subType",msg.subType);
        for(var i = 0; i < this.sendmsgarr.length; i++){
            if(this.sendmsgarr[i].maintype == msg.mainType && this.sendmsgarr[i].subtype == msg.subType){
                var _sendmsgarr = this.sendmsgarr[i];
                this.sendmsgarr.splice(i,1);
                this._send();
                if(_sendmsgarr.callback != undefined){
                    // if(!msg.isOk){
                    //     this.showNotice();
                    // }
                    _sendmsgarr.callback(msg.isOk);
                }
            }
        }
    },
    //主基础协议 --  服务器无法解析的消息0-4
    onSubUnmarshal:function(msg) {
        cc.log("dtsdk-服务器无法解析的消息-msg.mainType",msg.mainType);
        cc.log("dtsdk-服务器无法解析的消息-msg.subType",msg.subType);

    },

    //显示提示框
    showNotice : function(errinfo,needshow) {
        cc.log("出现了错误");
        return;
        if(GameMgr.singleton.curGameLayer) {
            var layer = new DisconnectDialog(this, 1, 0, errinfo);
            GameMgr.singleton.curGameLayer.addChild(layer, 11);
            GameMgr.singleton.curGameLayer.DisconnectLayer = layer;
            GameMgr.singleton.curGameLayer.ModuleUI._setState(TAOIST_UI_STATE.STATE_DISCONNECT, 1);
        }
    },

    //重新登录成功后清理提示框
    clearNoticeByLoginSuccess : function() {

    },

    onlogin : function() {
        var self = this;
        this.onTokenLoginRequest(function (isOk) {
            if(isOk){
                cc.log("token登录成功");
                self.clearNoticeByLoginSuccess();
                self.isTokenLoginSuccess = true;
                self.DtSdkNetDone = true;
                self.onDtSdkOrGameDone();
                self.isLogin = false;
                // if(self.GameNetDone){
                //     self.addDataRedPacketData();
                // }
                //MainClient.singleton.init(g_servaddr);
            }else {
                // var errinfo = StringMgrSys.getString_str("StringErrorCode_100");
                // errinfo = errinfo.substring(4,errinfo.length);

                // cc.log("token登录失败");
            }
        })
    },

    //登录dtsdk时获取时间，在isLogin为true有效 获取加载资源到登录dtsdk间的时间
    getResourceLoadTime : function () {
        var resourceLoadTime = 0;
        if(this.isLogin == true){
            var endLoadResTime = new Date().getTime();
            resourceLoadTime = Math.ceil((endLoadResTime - startLoadResTime) / 1000);
            // resourceLoadTime 无效
            if(resourceLoadTime > 300 || resourceLoadTime < 0){
                resourceLoadTime = 0;
            }
            cc.log(resourceLoadTime);
        }
        return resourceLoadTime;
    },

    //获取设备信息
    getDeviceInfo : function () {
        var deviceInfoobj = {
            deviceType : "others",
            deviceName : "others",
            browserName : "others",
            browserVersion : "0.0.0.1",
        }
        if(typeof(getDeviceInfos) != 'undefined'){
            var obj = getDeviceInfos()
            deviceInfoobj.deviceType = obj.deviceType;
            deviceInfoobj.deviceName = obj.deviceName;
            deviceInfoobj.browserName = obj.browserName;
            deviceInfoobj.browserVersion = obj.browserVersion;
        }
        var deviceType = deviceInfoobj.deviceType.replace(/_/g, " ");
        var deviceName = deviceInfoobj.deviceName.replace(/_/g, " ");
        var browserName = deviceInfoobj.browserName.replace(/_/g, " ");
        var browserVersion = deviceInfoobj.browserVersion.replace(/_/g, " ");

        var deviceInfo = deviceType + "_" + deviceName + "_" + browserName + "_" + browserVersion;
        return deviceInfo;
    },

    //主账号协议 -- token登录请求   token登录请求 1-0
    onTokenLoginRequest : function (callback) {
        var clienttype = dtsdk.clientType();
        var version = dtsdk.getVersion();
        var msg = this.createObject(DTSDKMainType.MainAccount,DTSDKSubAccountType.SubLoginReq);
        msg.token = g_flblogintoken;
        msg.gameCode = GAMETYPE_CURCODE;
        msg.version = "1.0.6";
        msg.isLogin = this.isLogin;
        msg.deviceInfo = this.getDeviceInfo();
        msg.loadingTime = this.getResourceLoadTime();
        this.sendMsgToDtsdk(DTSDKMainType.MainAccount, DTSDKSubAccountType.SubLoginReq, msg, callback);
    },
    //主账号协议 -- token登录返回  1-1 //判断是否在直播里，若在直播里则需要重新进入频道
    onTokenLoginResponse : function (msg) {
        // cc.log("重新登陆成功后的通知");
        // cc.log("playerName",msg.playerName);
        // cc.log("platformCode",msg.platformCode);
        // cc.log("currency",msg.currency);
        // cc.log("servVersion",msg.servVersion);
        // cc.log("checkRedPackets",msg.checkRedPackets);
        //MainClient.singleton.init(g_servaddr);

        // this.DtSdkNetDone = true;
        // this.onDtSdkOrGameDone();
        //this.onCheckRedPacketToAdd(msg);
        // this.onRewardRecordListPush(dtsdktestmsg.ondenglunoticearr());
        //this.onCheckSingleRedPacketResponse(dtsdktestmsg.onFreeRedMsg());
        // setTimeout(function () {
        //     dtsdktestmsg.onRedFreeCashTest();
        //     dtsdktestmsg.onRedRainTest();
        //     dtsdktestmsg.onRedFreeGamesTest();
        // },5000)


        // if(typeof(cc.game.config.isApp) == 'undefined' && GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.ErrorLayer && typeof(GameMgr.singleton.curGameLayer.ErrorLayer.clearFromParent) != 'undefined'){
        //     GameMgr.singleton.curGameLayer.ErrorLayer.clearFromParent();
        //     GameMgr.singleton.curGameLayer.ErrorLayer = undefined;
        // }
        //
        // if(GameMgr.singleton.giftgamelayer){
        //     GameMgr.singleton.giftgamelayer.setRedPackets(msg.checkRedPackets);
        // }
        //
        // if(typeof(cc.game.config.isApp) == 'undefined' && GameMgr.singleton.curGameLayer && msg.checkRedPackets){
        //     if(GameMgr.singleton.giftgamelayer == undefined && StringMgrSys.curlanguage == "zh_CN" || StringMgrSys.curlanguage == "en_US"){
        //         var layer = new CommonGiftRainLayer();
        //         if(layer && GameMgr.singleton.giftrainlayerhasdone){
        //             GameMgr.singleton.curGameLayer.addChild(layer,10);
        //             GameMgr.singleton.giftgamelayer = layer;
        //             GameMgr.singleton.giftgamelayer.setRedPackets(msg.checkRedPackets);
        //             GameMgr.singleton.bPauseGame = true;
        //         }
        //     }
        // }
        this.dtsdkServerVersion = msg.servVersion;
    },

    //取一个靠前的红包数据
    getFirstData : function () {
        this.checkCommonFreeData();
        if(!this.commonfreegamedata) {
            if (this.commonfreegamedataarr.length > 0 && !this.isShowFreeRedPacket) {
                this.setCurCommonFreeData(this.commonfreegamedataarr[0]);
                // this.commonfreegamedataarr.shift();
            }
        }
    },

    //设置当前红包数据
    setCurCommonFreeData : function (data, isneedfix) {
        if(isneedfix) {
            var _data = {
                id: data.id,
                bet: data.bet,
                line: data.line,
                times: data.times,
                lastnums: data.lastnums,
                totalnums: data.totalnums,
                str: data.str,
                totalwin: data.totalwin,
                gifrfreeid: data.giftfreeid,
                effectiveTime: data.effectiveTime,
                ExpireTime: data.expireTime,
                ended: data.ended,
                totalwinformat: data.totalwinformat,
                betformat: data.betformat,
                hasExpired: data.hasExpired,
            }
            this.commonfreegamedata = _data;
            GameMgr.singleton.CommonFreeGame.onData(this.commonfreegamedata);
        }else {
            this.commonfreegamedata = data;
        }
        for(var i = 0; i < this.commonfreegamedataarr.length; i++){
            if(this.commonfreegamedata.id == this.commonfreegamedataarr[i].id){
                this.commonfreegamedataarr.splice(i,1);
                i--;
            }
        }
    },

    checkCommonFreeData : function () {
        if(!this.commonfreegamedata)
            return;
        for(var i = 0; i < this.commonfreegamedataarr.length; i++){
            if(this.commonfreegamedata.id == this.commonfreegamedataarr[i].id){
                this.commonfreegamedataarr.splice(i,1);
                i--;
            }
        }
    },

    //主游戏协议 -- 是否有免费红包的消息推送 4-27
    onCheckFreeRedPacketAdd : function (msg) {
        cc.log("免费红包消息来了");
        this.commonfreegamedataarr.push(msg);
        if(typeof(BaseLogic) != 'undefined' && BaseLogic.singleton && !BaseLogic.singleton.bRunning){
            this.checkShowFreeGame();
            return;
        }
        var isruning=GamelogicMgr.instance.isRoundRuning();
        if(!isruning){
            this.checkShowFreeGame();
        }
    },
    //主游戏协议 -- 是否有免费红包的消息推送 4-27
    onCheckFreeRedPacketsAdd : function (arr) {
        cc.log("免费红包数组消息来了");
        if(!arr.FSpin)
            return;
        this.commonfreegamedataarr = [];
        for(var i = 0; i < arr.FSpin.length; i++){
            this.commonfreegamedataarr.push(arr.FSpin[i]);
        }
        if(typeof(BaseLogic) != 'undefined' && BaseLogic.singleton && !BaseLogic.singleton.bRunning){
            this.checkShowFreeGame();
            return;
        }
        var isruning=GamelogicMgr.instance.isRoundRuning();
        if(!isruning){
            this.checkShowFreeGame();
        }
    },
    checkShowFreeGame : function (){
        this.getFirstData();
        if(GameMgr.singleton.curGameLayer && !this.isShowFreeRedPacket && this.commonfreegamedata){
            if(GameMgr.singleton.CommonFreeGame) {
                GameMgr.singleton.CommonFreeGame.onData(this.commonfreegamedata);
                GameMgr.singleton.CommonFreeGame.showLayer();
            }
            this.isShowFreeRedPacket = true;
        }

        if(GameMgr.singleton.curGameLayer && this.isShowFreeRedPacket) {
            if(GameMgr.singleton.CommonFreeGame) {
                GameMgr.singleton.CommonFreeGame.showLayer();
            }
        }
    },
    leftGiftGame : function () {
        this.isShowFreeRedPacket = false;
        this.commonfreegamedata = null;
        // this.commonfreegamedataarr.shift();
        this.checkShowFreeGame();
    },
    onCheckFreeRedPacketResponse : function (msg) {
        // cc.log("dtsdk-isExistFreecash",msg.isExistFreecash);
        // cc.log("dtsdk-amount",msg.amount);
        // cc.log("dtsdk-message",msg.message);

    },

    //主游戏协议 -- 切换横竖屏请求
    onChangeScreenRequest : function (canvasIndex, callback) {
        if(this.sendScreensCanvasIndex == canvasIndex){
            return;
        }
        cc.log("切换横竖屏请求");
        var ScreenType = {
            INVALIDSCREENTYPE : 0,
            // 横屏
            HORIZONTAL : 1,
            // 竖屏
            VERTICAL : 2
        }
        if(GameMgr.singleton.curGameLayer && GameMgr.singleton.curGameLayer.GameCanvasMgr) {
            // canvasIndex=0 pc横屏 canvasIndex=1 pc移动端竖屏 canvasIndex=2 移动端横屏
            var screenInfoNum = 0;
            if(canvasIndex == 0 || canvasIndex == 2){
                screenInfoNum = ScreenType.HORIZONTAL;
            }
            if(canvasIndex == 1){
                screenInfoNum = ScreenType.VERTICAL;
            }
            var msg = this.createObject(DTSDKMainType.MainGame,DTSDKSubGameType.SubChangeScreenRequest);
            msg.screen = screenInfoNum;
            if(screenInfoNum > 0) {
                this.sendMsgToDtsdk(DTSDKMainType.MainGame, DTSDKSubGameType.SubChangeScreenRequest, msg, callback, true);
            }
        }
    },

    // 给服务器发送横竖屏的定时器
    sendScreensInfo : function (canvasIndex) {
        if(typeof(dtsdk) == 'undefined')
            return;
        //token没有登录成功，则不给服务器发送消息
        if(!CommonServer.singleton.isTokenLoginSuccess){
            return;
        }
        var sendScreensInfotime = 30000;
        if(this.sendScreensInfoTimer){
            clearTimeout(this.sendScreensInfoTimer);
            this.sendScreensInfoTimer = undefined;
        }
        this.sendScreensInfoTimer = setTimeout(function () {
            CommonServer.singleton.onChangeScreenRequest(canvasIndex,function (isOk) {
                CommonServer.singleton.sendScreensInfoTimer = undefined;
                if(isOk){
                    CommonServer.singleton.sendScreensCanvasIndex = canvasIndex;
                    cc.log("sendScreensInfo success");
                }else {
                    cc.log("sendScreensInfo faile");
                }
            })
        },sendScreensInfotime);
    }

});

CommonServer.singleton = new CommonServer();
function ceshihognbao() {
    var obj = {
        id : "zheshiyigeID",
        bet : 20,       //投注额
        line : 30,      //线注
        totalnums : 40, //总共次数
        times : 5,      //倍数
        lastnums : 15,  //剩余次数
        Title : "zheshibiaoti",  //标题
        Info : "zheshineirong",  //内容
        ExpireTime : 1589620505,    //过期时间

        totalwin : 430,     //累计赢得，dtsdk服默认为0，没有发过来
    }
    CommonServer.singleton.onCheckFreeRedPacketAdd(obj);
}
var dtsdktestmsg = {
    picurl : ["https://appres-s.phtdreamtech.com/test/downpicurl/menubar_img_userlogo1.png",
        "https://appres-s.phtdreamtech.com/test/downpicurl/menubar_img_userlogo2.png",
        "https://appres-s.phtdreamtech.com/test/downpicurl/menubar_img_userlogo3.png",
        "https://appres-s.phtdreamtech.com/test/downpicurl/menubar_img_userlogo4.png",
        "https://appres-s.phtdreamtech.com/test/downpicurl/menubar_img_userlogo5.png"],
    ontest1 : function () {
        var msg = {};
        msg.currency = "CNY";
        msg.platformCode = "NNTI_TEST_TEST1";
        msg.playerName = "ZERO333";
        msg.serVersion = "1.0.4.1";
        msg.checkRedPackets = "false";
        return msg;
    },

    ondenglunoticearr : function () {
        var denglunoticearr = {
            rewardRecordList:[]
        };
        for(var i = 0; i < 5; i++){
            var denglunotice = {};

            denglunotice.bet = 20;
            denglunotice.createTime = this.getNow();
            denglunotice.gameCode = "dnp";
            denglunotice.id = 22222;
            denglunotice.isme = false;
            denglunotice.playerName = "ZERO___lll";
            denglunotice.win = 223333;
            denglunotice.type = 2;
            denglunotice.tableId = "";
            denglunotice.msgId = 20887788;
            denglunotice.jpl = 1;
            denglunoticearr.rewardRecordList.push(denglunotice);
        }
        return denglunoticearr;
    },
    getNow : function () {
        var timestamp = (new Date()).getTime();
        return timestamp;
    },

    onNoticeMsg : function () {
        var noticearr = {};
    },

    onFreeRedMsg : function () {
        var msg = {};
        msg.isExistFreecash = true;
        msg.amount = 20000;
        msg.message = "这是一个现金红包测试";
        msg.minLimitBet = 3444*0.2;
        msg.betPrice = 9998;
        return msg;
    },

    //红包雨测试
    onRedRainTest : function () {
        var msg = {};
        msg.checkRedPackets = true;
        msg.message = "这是测试红包雨";
        msg.isLogin = false;
        CommonServer.singleton.onCheckRedPacketToAdd(msg);
    },
    //红包免费游戏测试
    onRedFreeGamesTest : function () {
        var msg = {
            giftfree:{}
        };
        msg.giftfree.id = "testid";
        msg.giftfree.bet = 100;
        msg.giftfree.line = 20;
        msg.giftfree.totalnums = 21;
        msg.giftfree.times = 22;
        msg.giftfree.lastnums = 21;
        msg.giftfree.str = "这是测试免费红包";
        msg.giftfree.limitwin = 1000;
        msg.giftfree.isLogin = false;
        CommonServer.singleton.onCheckFreeRedPacketAdd(msg);
    },
    //现金红包测试
    onRedFreeCashTest : function () {
        var msg = {};
        msg.isExistFreecash = true;
        msg.amount = 20;
        msg.message = "这是测试现金红包";
        msg.minLimitBet = 10000;
        msg.betPrice = 1000;
        msg.isLogin = false;
        CommonServer.singleton.onCheckSingleRedPacketAdd(msg);
    }
}

