var Nativep = Basep.extend({
    ctor: function () {
        Basep.prototype.ctor.call(this);
    },
    gameReadyMsg: function () {
        GamelogicMgr.instance._moduleUi._setState('gameready', 'ready');
    },
    onConfig:function(cfg){
        this.logicctrl.onConfig(cfg);
    },

    spineResultMsg: function (isok) {
        GamelogicMgr.instance.spineResultCall(isok);
    },
    messageRegister: function () {
        GameEmitterMgr.instance.on('msg_gameReady', this.gameReadyMsg,this);
        // GameEmitterMgr.instance.on('msg_onConfig', this.onConfig,this);

        GameEmitterMgr.instance.on('msg_spineResult', this.spineResultMsg);
    },
    callbackRegister: function () {
        this.registerCallFun('getGameReadyRet', this.getGameReadyRet);
        this.registerCallFun('spinActionPre', this.spinActionPre);
        this.registerCallFun('spineError', this.spineError);
        this.registerCallFun('gameCtrl2', this.gameCtrl);
        this.registerCallFun('onMyMoney', this.onMyMoney);
        this.registerCallFun('onWinAniDone', this.onWinAniDone);
        this.registerCallFun('startGameRound', this.startGameRound);
        this.registerCallFun('endGameRound', this.endGameRound);
    },
    //游戏spin动作，逻辑部分通过，开始与服务器交互，不一定成功
    spinActionPre: function (gameid, bet, times, lines, bfree, callback) {
        var _callback = callback;
        if(!_callback){
            _callback = function (isok) {
                GameEmitterMgr.instance.emit('msg_spineResult',isok);
            }
        }
        MainClient.singleton.newspin(gameid, bet, times, lines, bfree, _callback);
    },
    getGameReadyRet: function () {
        this.logicctrl.getGameReadyRet();
    },
    //runone时错误Error
    spineError: function () {
        GamelogicMgr.instance._gameLayer.setDisconnect(2, 0);
    },
    gameCtrl:function(gameid, ctrlname, ctrlparam,callback){
        if(callback==undefined){
            var backkey=ctrlparam.curkey;
            callback = function (isok) {
                if (isok) {
                    GamelogicMgr.instance._gameLayer.onShowFGInfo(backkey);
                }
            }
        }
        MainClient.singleton.gamectrl2(gameid, ctrlname, ctrlparam, callback);
    },
    onMyMoney: function (money) {
        this.logicctrl.onMyMoney(money);
        var curb=GameDataMgr.instance.getIBalance();
        if(curb==-1){
            GamelogicMgr.instance._moduleUi.setBalance(money);
        }
    },
    onWinAniDone: function (turnwin) {
        GamelogicMgr.instance._moduleUi.winAniSetBalance(turnwin);
        GamelogicMgr.instance._moduleUi._showAllMoneyAni(turnwin);
    },
    startGameRound:function(){
        this.logicctrl.startGameRound();
    },
    endGameRound:function(){
        this.logicctrl.endGameRound();
    }
});