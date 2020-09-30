var Yggp = Basep.extend({
    ctor: function () {
        Basep.prototype.ctor.call(this);
    },
    setPrepaidMsg:function(amount,iRateValue){
        if(amount <= 0) {
            GamelogicMgr.instance._moduleUi._setState('prepaid', 'close');
        }
        else {
            var bnum = Math.round(amount * iRateValue / 30);
            GamelogicMgr.instance._moduleUi.setCoinValue(bnum);
            GamelogicMgr.instance._moduleUi._setState('prepaid', 'open');
        }

    },
    waitAppearMsg:function(state){
        GamelogicMgr.instance._moduleUi._setState('waitappear', state);
    },
    setSelectTypeMsg:function(stype){
        GamelogicMgr.instance._gameLayer.setSelectType(stype);
    },
    disconnectShowMsg:function(state){
        GamelogicMgr.instance._moduleUi._setState('disconnect', state);
    },
    stopAutoSpinMsg:function(count){
        GameDataMgr.instance.setIAutoNum(count);
        GamelogicMgr.instance._moduleUi._setState('auto', count);
    },
    adaptiveAdjustMsg:function(top){
        GamelogicMgr.instance._gameLayer.GameCanvasMgr.setAdaptiveAdjustValue('boost/top-bar', top, 0, 0, 0);
    },
    updateBalance:function(val){
        this.logicctrl.updateBalance(val);
    },
    setSlotGameSize:function(val){
        this.logicctrl.setSlotGameSize(val);
    },
    onConfig:function(cfg){
        this.logicctrl.onConfig(cfg);
    },
    spineResultMsg: function (isok) {
        GamelogicMgr.instance.spineResultCall(isok);
    },
    gameReadyMsg: function (ret) {
        this.logicctrl.onGameReadyRet(ret);
    },
    messageRegister: function () {
        GameEmitterMgr.instance.on('ygg_setPrepaid', this.setPrepaidMsg);
        GameEmitterMgr.instance.on('ygg_waitAppear', this.waitAppearMsg);
        GameEmitterMgr.instance.on('ygg_setSelectType', this.setSelectTypeMsg);
        GameEmitterMgr.instance.on('ygg_disconnectShow', this.disconnectShowMsg);
        GameEmitterMgr.instance.on('ygg_adaptiveAdjust', this.adaptiveAdjustMsg);

        GameEmitterMgr.instance.on('ygg_updateBalance', this.updateBalance,this);
        GameEmitterMgr.instance.on('ygg_setSlotGameSize', this.setSlotGameSize,this);

        GameEmitterMgr.instance.on('msg_gameReady', this.gameReadyMsg,this);
        GameEmitterMgr.instance.on('msg_stopAutoSpin', this.stopAutoSpinMsg);
        // GameEmitterMgr.instance.on('msg_onConfig', this.onConfig,this);

        // GameEmitterMgr.instance.on('msg_gameRoundStarted', this.gameRoundStartedMsg);
        // GameEmitterMgr.instance.on('msg_gameRoundStartedSucc', this.gameRoundStartedSuccMsg);
        // GameEmitterMgr.instance.on('msg_spin', this.spinMsg);
        // GameEmitterMgr.instance.on('msg_spinSucc', this.spinSuccMsg);
        // GameEmitterMgr.instance.on('msg_spinFail', this.spinFailMsg);
        // GameEmitterMgr.instance.on('msg_gameRoundEnded', this.gameRoundEndedMsg);
        // GameEmitterMgr.instance.on('msg_gameRoundEndedSucc', this.gameRoundEndedSuccMsg);
        GameEmitterMgr.instance.on('msg_spineResult', this.spineResultMsg);

    },
    //***************************注册接口
    //可以和native同样写法传入回调(冰火已经实现)
    //也可以，通过等待接收服务器广播回调实现，多平台接入，消息会比较直接，按照接入文档给发消息，建议第二种
    callbackRegister: function () {
        this.registerCallFun('spinActionPre', this.spinActionPre);
        this.registerCallFun('spineError', this.spineError);
        this.registerCallFun('gameCtrl2', this.gameCtrl);
        this.registerCallFun('getGameReadyRet', this.getGameReadyRet);
        this.registerCallFun('onChgCoinValue', this.onChgCoinValue);
        this.registerCallFun('onMyMoney', this.onMyMoney);
        this.registerCallFun('onWinAniDone', this.onWinAniDone);
        this.registerCallFun('setDisconnect', this.setDisconnect);
        this.registerCallFun('sendSpinEnd', this.sendSpinEnd);
        this.registerCallFun('onClickHome', this.onClickHome);
        this.registerCallFun('onBtnHits', this.onBtnHits);
    },
    spinActionPre: function (gameid, bet, times, lines, bfree, callback) {
        var _callback = callback;
        if(!_callback){
            _callback = function (isok) {
                GameEmitterMgr.instance.emit('msg_spineResult',isok);
            }
        }
        this.logicctrl.newspin(gameid, bet, times, lines, bfree, _callback);
    },
    gameCtrl: function (gameid, ctrlname, ctrlparam, callback) {
        if (callback == undefined) {
            var backkey = ctrlparam.curkey;
            callback = function (isok) {
                if (isok) {
                    GamelogicMgr.instance._gameLayer.onShowFGInfo(backkey);
                }
            }
        }
        this.logicctrl.gamectrl2(gameid, ctrlname, ctrlparam, callback);
    },
    setDisconnect: function (type, type1, strerror, bshowcash) {
        this.logicctrl.showDlg(type, type1, strerror, bshowcash)
    },
    onMyMoney: function (money) {
        this.logicctrl.onMyMoney(money);
        var curb=GameDataMgr.instance.getIBalance();
        //原逻辑，balance没值时才更新
        if(curb==-1){
            GamelogicMgr.instance._moduleUi.setBalance(money);
        }
        if(this.logicctrl.isPrepaid()){
            return;
        }
        //这里会是ygg的强制刷新
        if (this.logicctrl.isWaitRoundEnded()) {
            GamelogicMgr.instance._moduleUi.setBalance(money);
            return;
        }
    },
    onWinAniDone: function (turnwin) {
        if(this.logicctrl.isPrepaid()){
            return;
        }
        GamelogicMgr.instance._moduleUi.winAniSetBalance(turnwin);
    },
    onChgCoinValue: function () {
        var totalbet = GameDataMgr.instance.getTotalBet();
        this.logicctrl.sendTotalBetChanged(totalbet);
    },
    getGameReadyRet: function () {
        this.logicctrl.startOnlineTime();
        var self=this;
        gameEmitter.gameReady()
            .then((ret) => {
                GameEmitterMgr.instance.emit("msg_gameReady", ret);
            })
            .catch((err) => {
                console.log('gameReady Error ', err);
            });
    },
    //runone时错误Error
    spineError: function () {
        var bnum = GameDataMgr.instance.getCoinValue();
        var bfree = GameDataMgr.instance.getNumberValue('_bFreeGame');
        var gameid = GameMgr.singleton.getCurGameID();
        var bet = GamelogicMgr.instance._moduleUi.getBet();
        var callback = function (isok) {
            GamelogicMgr.instance.spineResultCall(isok);
        };
        this.logicctrl.newspin(gameid, bnum, 1, bet, bfree, callback);
    },
    sendSpinEnd: function () {
        this.logicctrl.sendSpinEnd();
    },
    onClickHome: function () {
        if (this.logicctrl.isShowHome()) {
            this.logicctrl.onClickHome();
        }
    },
    onBtnHits:function(){
        if (this.logicctrl.getIsGameHistoryEnabled() && typeof (slot) != 'undefined' && slot.uiComponents) {
            var data = {theme:'DARK'};
            var slotUiComponents = slot.uiComponents();
            slotUiComponents.showGameHistory(data);
        }
    },

    getMinimalSpinningTime: function () {
        return this.logicctrl.getMinimalSpinningTime();
    },
});
