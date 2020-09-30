var Relaxp = Basep.extend({
    ctor: function () {
        Basep.prototype.ctor.call(this);
    },
    update: function (dt) {
        this.logicctrl.update(dt);

        if (this.logicctrl.isWaitRoundEnded()) {
            return false;
        }
        return true;
    },
    gameReadyMsg: function (bet) {
        this.logicctrl.setIsWaitCommonFreeGame(false);
        this.logicctrl.onGameReadyRet();
        this.logicctrl.setFreeSpinCoinValue(bet);
    },
    onConfig:function(cfg){
        this.logicctrl.onConfig(cfg);
    },

    spineResultMsg: function (isok) {
        GamelogicMgr.instance.spineResultCall(isok);
    },
    messageRegister: function () {
        GameEmitterMgr.instance.on('msg_onConfig', this.onConfig,this);
        GameEmitterMgr.instance.on('msg_gameReady', this.gameReadyMsg,this);

        GameEmitterMgr.instance.on('msg_spineResult', this.spineResultMsg);
    },
    callbackRegister: function () {
        // todo
        this.registerCallFun('spinActionPre', this.spinActionPre);
        this.registerCallFun('getGameReadyRet', this.getGameReadyRet);
        this.registerCallFun('onChgCoinValue', this.onChgCoinValue);
        this.registerCallFun('onMyMoney', this.onMyMoney);
        this.registerCallFun('onWinAniDone', this.onWinAniDone);
        this.registerCallFun('spineError', this.spineError);
        this.registerCallFun('onClickHome', this.onClickHome);
        this.registerCallFun('openHistory', this.openHistory);
        this.registerCallFun('onCloseReality', this.onCloseReality);
        this.registerCallFun('startGameRound', this.startGameRound);
        this.registerCallFun('endGameRound', this.endGameRound);
    },
    //***************************注册接口
    //可以和native同样写法传入回调(冰火已经实现)
    //也可以，通过等待接收服务器广播回调实现，多平台接入，消息会比较直接，按照接入文档给发消息，建议第二种
    spinActionPre: function (gameid, bet, times, lines, bfree, callback) {
        var _callback = callback;
        if(!_callback){
            _callback = function (isok) {
                GameEmitterMgr.instance.emit('msg_spineResult',isok);
            }
        }
        this.logicctrl.newspin(gameid, bet, times, lines, bfree, _callback);
    },
    onMyMoney: function (money) {
        this.logicctrl.onMyMoney(money);
        var curb = GameDataMgr.instance.getIBalance();
        if (curb == -1) {
            GamelogicMgr.instance._moduleUi.setBalance(money);
        }
    },
    onWinAniDone: function (turnwin) {
        if (this.logicctrl.isPrepaid()) {
            return;
        }
        GamelogicMgr.instance._moduleUi.winAniSetBalance(turnwin);
        GamelogicMgr.instance._moduleUi._showAllMoneyAni(turnwin);
    },
    onChgCoinValue: function () {
        var totalbet = GameDataMgr.instance.getTotalBet();
        this.logicctrl.sendTotalBetChanged(totalbet);
    },
    getGameReadyRet: function () {
        this.logicctrl.getGameReadyRet();
        this.logicctrl.startOnlineTime();
    },
    //runone时错误Error,同native
    spineError: function () {
        GamelogicMgr.instance._gameLayer.setDisconnect(2, 0);
    },
    onClickHome: function () {
        this.logicctrl.goHome();
    },
    openHistory: function () {
        this.logicctrl.openHistory();
    },
    onCloseReality: function (value) {
        this.logicctrl.onCloseReality(value);
    },
    startGameRound: function () {
        this.logicctrl.startGameRound();
    },
    endGameRound: function () {
        this.logicctrl.endGameRound();
    }
});