var platformIndex = {
    Native: 0,
    Ygg: 1,
    Relax: 2
};
//通用部分逻辑写在GameModuleLogic中
//平台差异部分写在平台实现类
var GamelogicMgr = GamelogicMgr || {};
var gamelogicmgr = function () {
    this._platformId = -1;
    this._platform = null;
    this._platformCtrl = null;
    this._gameLayer = null;
    this._moduleUi = null;
    //游戏运行相关的状态,ture or false,默认为true
    this.gamestate = {};
}
GamelogicMgr.instance = new gamelogicmgr();
var glgcpro = gamelogicmgr.prototype;
glgcpro.setPlatform = function (index) {
    if (index == platformIndex.Ygg) {
        this._platformId = platformIndex.Ygg;
        this._platform = new Yggp();
        //var ctrl = new YggPltLogic();
        var ctrl =  YggLogic.singleton;
        this._platform.attachLogic(ctrl);
        this._platformCtrl = ctrl;
        return;
    }
    if (index == platformIndex.Relax) {
        this._platformId = platformIndex.Relax;
        this._platform = new Relaxp();
        var ctrl = new RelaxPltLogic();
        this._platform.attachLogic(ctrl);
        this._platformCtrl = ctrl;
        return;
    }
    if (index == platformIndex.Native) {
        this._platformId = platformIndex.Native;
        this._platform = new Nativep();
        var ctrl = new NativePltLogic();
        this._platformCtrl = ctrl;
        this._platform.attachLogic(ctrl);
    }
}

glgcpro.getPlatformCtrl = function () {
    if (this._platformCtrl == null || this._platformCtrl == undefined)
        return false;

    return this._platformCtrl;
}

glgcpro.existFunction = function(funcName) {
    var ret = false;
    if (this._platformCtrl && this._platformCtrl[funcName]) {
        ret = true;
    }

    return ret;
}

/*
* 判断PlatformCtrl中某方法是否存在，若存在则调用并返回函数执行结果
* 若返回undefined则认为调用失败/方法不存在/平台错误
* */
glgcpro.callFuncByName = function(funcName) {
    if (!(this._platformCtrl || this.defaultP()) || !this._platformCtrl[funcName]) {
        return undefined;
    }

    var func = this._platformCtrl[funcName];

    if (arguments.length > 1) {
        var args = [].slice.call(arguments, 1);
        return func.apply(this._platformCtrl, args);
    }
    else {
        return func.apply(this._platformCtrl);
    }
}

glgcpro.setGameLayer = function (layer) {
    this._gameLayer = layer;
    this._moduleUi = layer.ModuleUI;
}
glgcpro.defaultP = function () {
    //default
    this._platformId = platformIndex.Native;
    this._platform = new Nativep();
    var ctrl = new NativePltLogic();
    this._platformCtrl = ctrl;
    this._platform.attachLogic(ctrl);
    return true;
}
glgcpro.defaultGameLayer = function () {
    //default
    var layer = GameMgr.singleton.curGameLayer;
    if (layer == undefined) {
        return false;
    }
    this._gameLayer = layer;
    this._moduleUi = layer.ModuleUI;
    return true;
}
//***************************************
//游戏调用logic部分
glgcpro.callRegistered = function (name) {
    if (!(this._platform || this.defaultP())) {
        return;
    }
    var argl = arguments.length;
    if (argl == 0) {
        return;
    }
    if (argl == 1) {
        this._platform.specialCallFun(name);
        return;
    }
    var args = [].slice.call(arguments, 1);
    this._platform.specialCallFun(name, args);
}
//update
glgcpro.update = function (dt) {
    if (!(this._platformCtrl || this.defaultP())) {
        return true;
    }
    var updatenext = this._platformCtrl.updateAndNext(dt);
    return updatenext;
}
//能否自动旋转
glgcpro.canAutoSpin = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return true;
    }
    var result = this._platformCtrl.canAutoSpin();
    return result;
}
//game.js中是否需要保存Bet下注
glgcpro.needSaveBetNum = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return true;
    }
    var result = this._platformCtrl.needSaveBetNum();
    return result;
}
//是否是YGG平台，极特殊情况会有判断
glgcpro.isYggPlatform = function () {
    if (this._platformId == platformIndex.Ygg) {
        return true;
    }
    return false;
}
//loadingscene中,loaded回调
glgcpro.isNoCofig = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return false;
    }
    var result = this._platformCtrl.isNoCofig();
    return result;
}
//info.js中是否显示Gambling
glgcpro.isShowGambling = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return true;
    }
    var result = this._platformCtrl.isShowGambling();
    return result;
}
//*****************new
glgcpro.onMyMoney = function (money) {
    if (!(this._platformCtrl || this.defaultP())) {
        return;
    }

    this._platformCtrl.onMyMoney(money);
};

glgcpro.setCurrency = function (currency) {
    if (!(this._platformCtrl || this.defaultP())) {
        return;
    }

    this._platformCtrl.setCurrency(currency);
};

glgcpro.setIsWaitCommonFreeGame = function (bWait) {
    if (!(this._platformCtrl || this.defaultP())) {
        return;
    }

    this._platformCtrl.setIsWaitCommonFreeGame(bWait);
},

    glgcpro.onGameReadyRet = function (ret) {
        if (!(this._platformCtrl || this.defaultP())) {
            return;
        }

        this._platformCtrl.onGameReadyRet(ret);
    };

glgcpro.setPrepaid = function (amount) {
    if (!(this._platformCtrl || this.defaultP())) {
        return true;
    }

    this._platformCtrl.setPrepaid(amount);
};

glgcpro.getMinimalSpinningTime = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return 0;
    }

    var spintime = this._platformCtrl.getMinimalSpinningTime();
    return spintime;
}
glgcpro.getScQuickStopOn = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return true;
    }

    var result = this._platformCtrl.getScQuickStopOn();
    return result;
}

glgcpro.isSupportChgCoinType = function() {
    if (!(this._platformCtrl || this.defaultP())) {
        return true;
    }

    var result = this._platformCtrl.isSupportChgCoinType();
    return result;
}

//*****************new
//gamemoduleui中是否预付费
glgcpro.isPrepaid = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return false;
    }
    var result = this._platformCtrl.isPrepaid();
    return result;
}
//uilayer中是否显示home按键
glgcpro.isShowHome = function () {
    if (window && window.dtcfg && window.dtcfg.hidehome) {
        return false;
    }
    if (!(this._platformCtrl || this.defaultP())) {
        return true;
    }
    var result = this._platformCtrl.isShowHome();
    return result;
}
//game.js中是否需要弹出默认弹窗，外接平台可能会接管
glgcpro.needNativeDisconnect = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return true;
    }
    var result = this._platformCtrl.nativeDisconnect();
    return result;
}
//gamemoduleui中初始化autolayer相关数据
glgcpro.refreshAutolayer = function (autolayer) {
    if (!(this._platformCtrl || this.defaultP())) {
        return;
    }
    var spindata = this._platformCtrl.getAutoSpinData();
    var lossdata = this._platformCtrl.getAutoLossData();
    var windata = this._platformCtrl.getAutoWinData();
    var isLimit = this._platformCtrl.getHasLossLimit();
    var balance = this._platformCtrl.getRealBalance();
    var totalbet = GameDataMgr.instance.getTotalBet();
    autolayer.initData(2, spindata, lossdata, windata, isLimit, balance, totalbet);
}
//uilayer中是否显示当前时间
glgcpro.isShowUiLayerTime = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return false;
    }
    var result = this._platformCtrl.isShowTime();
    return result;
}
//uilayer中当前时间刷新
glgcpro.refreshUiLayerTime = function (txtlable) {
    if (!(this._platformCtrl || this.defaultP())) {
        return;
    }
    if (this._platformCtrl.isShowTime()) {
        var uitime = this._platformCtrl.getTime();
        txtlable.setString(uitime)
    }
}
//uilayer中是否显示在线时间
glgcpro.isShowOnlineTime = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return false;
    }
    var result = this._platformCtrl.isShowOnlineTime();
    return result;
}
//uilayer中在线时间刷新
glgcpro.refreshOnLineTime = function (txtlable) {
    if (!(this._platformCtrl || this.defaultP())) {
        return;
    }
    if (this._platformCtrl.isShowOnlineTime()) {
        var uitime = this._platformCtrl.getOnlineTime();
        txtlable.setString(uitime)
    }
}
//清除在线时间
glgcpro.clearOnlineTime = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return;
    }
    this._platformCtrl.clearOnlineTime();
}
//获取货币符号
glgcpro.getCurrency = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return 'EUR';
    }
    var result = this._platformCtrl.getCurrency();
    return result;
}
glgcpro.getDefaultCoinValue = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return 0;
    }
    var result = this._platformCtrl.getDefaultCoinValue();
    return result;
}
//是否在一轮中
glgcpro.isRoundRuning = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return false;
    }
    var result = this._platformCtrl.isRoundRuning();
    return result;
}
glgcpro.getCurRateValue = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return 100;
    }
    var result = this._platformCtrl.getCurRateValue();
    return result;
}

glgcpro.onPressedSpace = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return false;
    }
    var result = this._platformCtrl.onPressedSpace();
    return result;
}
glgcpro.getRealBalance = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return -1;
    }
    var result = this._platformCtrl.getRealBalance();
    return result;
}
//给服务器发统计数据用
glgcpro.getUserAutoNums = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return -1;
    }
    var result = this._platformCtrl.getUserAutoNums();
    return result;
}
glgcpro.setUserAutoNums = function (value) {
    if (!(this._platformCtrl || this.defaultP())) {
        return;
    }
    this._platformCtrl.setUserAutoNums(value);
}
//主要处理language及一些初始化
glgcpro.initPlatCtrl = function () {
    if (!(this._platformCtrl || this.defaultP())) {
        return;
    }
    this._platformCtrl.init();
}
//***************************************logic调用其他接口，公用或者通用接口，差异的平台内处理
//服务器消息处理
glgcpro.spineResultCall = function (isok) {
    if (!(this._gameLayer || this.defaultGameLayer())) {
        return;
    }
    if (isok) {
        this._gameLayer.onGameModuleInfo1();
    }
}


//***************************************状态相关，处理流程判断
glgcpro._initAttr = function (attrname) {
    if (this.gamestate[attrname] == undefined) {
        this.gamestate[attrname] = {};
        this.gamestate[attrname].attrstate = true;
    }
}
glgcpro._checkAttr = function (attrname) {
    if (this.gamestate[attrname] == undefined) {
        return true;
    }
    var state = this.gamestate[attrname].attrstate;
    return state;
}
glgcpro._changeAttr = function (attrname, eventname, state) {
    if ("default" == eventname) {
        this.gamestate[attrname].attrstate = state;
        return;
    }
    this.gamestate[attrname][eventname] = state;
    this.gamestate[attrname].attrstate = true;
    var states = this.gamestate[attrname];
    for (var i in states) {
        var state = states[i];
        if (!state) {
            this.gamestate[attrname].attrstate = false;
            return;
        }
    }
}
//默认true不用设置
glgcpro.setDefaultState = function (attrname, state) {
    if (state) {
        return;
    }
    this._initAttr(attrname);
    this._changeAttr(attrname, "default", state);
}
glgcpro.setStateAttr = function (attrname, eventname, state) {
    this._initAttr(attrname);
    this._changeAttr(attrname, eventname, state);
}
glgcpro.getStateAttr = function (attrname) {
    var state = this._checkAttr(attrname);
    return state;
}
