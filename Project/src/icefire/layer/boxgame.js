/**
 * Created by ssscomic on 2016/8/9.
 */

var OnePieceBoxLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (gamelayer) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var boxlayer = ccs.load(res.OnePieceBoxLayer_json);
        this.addChild(boxlayer.node);

        this.gamelayer = gamelayer;

        this.lstBoxBtn = [];

        for(var ii = 1; ii <= 5; ++ii) {
            for(var jj = 1; jj <= 4; ++jj) {
                var btn = findNodeByName(boxlayer.node, "btnBox" + ii + "_" + jj);
                btn.addTouchEventListener(this.onTouchBox, this);
                this.lstBoxBtn.push(btn);
            }
        }

        this.bWaitResult = false;
        this.bInit = false;

        this.TransAni = ccs.load(res.OnePieceTransAni1_json);

        this.addChild(this.TransAni.node, 10);
        this.TransAni.node.runAction(this.TransAni.action);
        this.TransAni.action.gotoFrameAndPlay(0, this.TransAni.action.getDuration(), false);

        this.scheduleUpdate();
    },

    update : function(dt) {
        if(this.TransAni != undefined) {
            if(this.TransAni.action.getCurrentFrame() == this.TransAni.action.getDuration()) {
                this.TransAni.node.stopAllActions();
                this.removeChild(this.TransAni.node);
                this.TransAni = undefined;
            }
        }
    },

    onTouchBox : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if(!this.bInit)
            return ;

        if(this.bWaitResult)
            return ;

        if(this.ShowResultTime > 0)
            return ;

        var index = -1;

        for(var ii = 0; ii < this.lstBoxBtn.length; ++ii) {
            if(this.lstBoxBtn[ii] == sender) {
                index = ii;
                break;
            }
        }

        if(index < 0)
            return ;

        this.playBtnSound();

        this.bWaitResult = true;

        index = Math.floor(index / 4);

        for(var ii = 0; ii < this.lstBoxBtn.length; ++ii) {
            this.lstBoxBtn[ii].setVisible(Math.floor(ii / 4) == index);
        }

        MainClient.singleton.sgamectrl(GameMgr.singleton.getCurGameID(), "fivedragon", "play", index, function(isok) {
        });
    },

    playBtnSound : function () {
        this.gamelayer.playBtnSound();
    },

    onSGameInfo : function (msgobj) {
        this.bInit = true;

        if(msgobj.ctrl == "play")
            this.gamelayer.leftBoxGame();
    }
});