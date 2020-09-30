/**
 * Created by ssscomic on 2016/5/24.
 */
var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = GameMgr.singleton.newCurGameLayer();

        if (typeof(foripad) == 'function') {
            cc.log("foripade    newCurGameLayer");
            foripad(layer);
        }

        this.addChild(layer);
        if(cc.sys.isMobile && !cc.sys.isNative && (typeof(isFullscreen) == 'undefined' || isFullscreen())){
            setTimeout(function () {
                StartFullScreen();
            },10);
        }
        //this.gamemenuLayer = new GamemenuLayer();
        //this.addChild(this.gamemenuLayer, 100);

        //var infolayer = new TlodInfoLayer();
        //
        //this.addChild(infolayer, 1);

        if(GameMgr.singleton.rankInfoLst && GameMgr.singleton.rankInfoLst.mylst && GameMgr.singleton.rankInfoLst.mylst.length > 0){
            var rankLayer = GameMgr.singleton.newrankinfolayer();

            // if (typeof(foripad) == 'function') {
            //     cc.log("foripade    newrankinfolayer");
            //     foripad(rankLayer);
            // }

            rankLayer.initdata(GameMgr.singleton.rankInfoLst);
            layer.addChild(rankLayer,1);
            //GameMgr.singleton.curGameLayer.addChild(rankLayer);
        }else{
            GameMgr.singleton.rankInfoLayer = null;
        }

        if(typeof(GameAssistant) != 'undefined' && GameAssistant.singleton.bNative) {
            if(business == "NNTI_TEST_TEST1"){
                var cheaterlayer = GameMgr.singleton.newCheaterLayer();
                layer.addChild(cheaterlayer,999);
            }else {
                GameMgr.singleton.cheaterlayer = null;
            }
        }

        var jackpotlayer = new CommonJackpotLayer(GAMEJPPOS[GAMETYPE_CURTYPE]);

        if(layer.nodeCommonJackpot)
            layer.nodeCommonJackpot.addChild(jackpotlayer);
        else
            this.addChild(jackpotlayer);

        GameMgr.singleton.JackpotLayer = jackpotlayer;

        // if(typeof(CommonGiftGameLayer) != 'undefined') {
        //     var giftgamelayer = new CommonGiftGameLayer();
        //
        //     if(layer.nodeCommonJackpot)
        //         layer.nodeCommonJackpot.addChild(giftgamelayer);
        //     else
        //         this.addChild(giftgamelayer);
        //
        //     GameMgr.singleton.GiftGameLayer = giftgamelayer;
        // }
        if(typeof(CommonFreeGame) != 'undefined') {
            var layer = new CommonFreeGame();
            GameMgr.singleton.curGameLayer.addChild(layer, 10);
            GameMgr.singleton.CommonFreeGame = layer;
        }

        GameMgr.singleton.initData();
        GameMgr.singleton.initFinish();

        //! 测试，直接连服务器
        //MainClient.singleton.init("ws://121.41.86.183:3710");

        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){

            //cc.director.pause();

        });
        //恢复显示
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){

            //cc.director.resume();

        });
    },
});

var HallScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = GameMgr.singleton.newHallLayer();
        cc.log("foripade    newHallLayer");
        foripad(layer);
        this.addChild(layer);
    }
});