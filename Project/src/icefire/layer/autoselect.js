/**
 * Created by ssscomic on 2016/6/12.
 */

var IceFireAutoSelectLayer = cc.Layer.extend({
    ctor:function (gamelayer) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var autoselectlayer = ccs.load(res.IceFireSelectAutoLayer_json);
        this.addChild(autoselectlayer.node);

        this.gamelayer = gamelayer;
        this.AutoSelectLayer = autoselectlayer;

        this.bEX = false;

        var nodeEX = findNodeByName(autoselectlayer.node, "nodeEX");

        if(nodeEX != undefined && nodeEX != null) {
            this.initEx();
            return ;
        }

        var imgClick = findNodeByName(autoselectlayer.node, "Panel_1");
        imgClick.addTouchEventListener(this.onTouchClick, this);

        var btnAuto = findNodeByName(autoselectlayer.node, "btnAuto");
        btnAuto.addTouchEventListener(this.onTouchClick, this);

        var btnAuto25 = findNodeByName(autoselectlayer.node, "btn25");
        btnAuto25.addTouchEventListener(this.onTouchAuto25, this);

        var btnAuto50 = findNodeByName(autoselectlayer.node, "btn50");
        btnAuto50.addTouchEventListener(this.onTouchAuto50, this);

        var btnAuto100 = findNodeByName(autoselectlayer.node, "btn100");
        btnAuto100.addTouchEventListener(this.onTouchAuto100, this);

        var btnAuto200 = findNodeByName(autoselectlayer.node, "btn200");
        btnAuto200.addTouchEventListener(this.onTouchAuto200, this);

        var btnAuto500 = findNodeByName(autoselectlayer.node, "btn500");
        btnAuto500.addTouchEventListener(this.onTouchAuto500, this);

        // this.AutoSelectLayer.node.runAction(this.AutoSelectLayer.action);
        // this.AutoSelectLayer.action.gotoFrameAndPlay(0, 15, false);

        //this.scheduleUpdate();
        this.bClose = false;
    },

    update : function(dt) {
        if(this.bClose) {
            if(this.AutoSelectLayer.action.getCurrentFrame() == this.AutoSelectLayer.action.getDuration()) {
                this.AutoSelectLayer.node.stopAllActions();
                this.getParent().removeChild(this);
            }
        }
    },

    onTouchClick : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        //this.getParent().removeChild(this);
        this.setAuto(0);
    },

    onTouchAuto25 : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setAuto(25);
    },

    onTouchAuto50 : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setAuto(50);
    },

    onTouchAuto100 : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setAuto(100);
    },

    onTouchAuto200 : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setAuto(200);
    },

    onTouchAuto500 : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.setAuto(500);
    },

    setAuto : function (num) {
        this.gamelayer.AutoSelectLayer = undefined;
        this.gamelayer.playBtnSound();
        this.gamelayer.setAuto(num);
        //this.getParent().removeChild(this);
        this.closeLayer();
    },

    closeLayer : function () {
        // if(this.bClose)
        //     return ;
        //
        // this.bClose = true;
        // this.AutoSelectLayer.action.gotoFrameAndPlay(17, this.AutoSelectLayer.action.getDuration(), false);

        this.getParent().removeChild(this);
    },

    initEx : function () {
        this.bEX = true;

        this.imgClick = findNodeByName(this.AutoSelectLayer.node, "Panel_1");
        this.imgClick.addTouchEventListener(this.onTouchCloseEx, this);

        // this.btnAuto = findNodeByName(this.AutoSelectLayer.node, "btnAuto");
        // this.btnAuto.addTouchEventListener(this.onTouchCloseEx, this);

        this.btnExit = findNodeByName(this.AutoSelectLayer.node, "btnExit");
        this.btnExit.addTouchEventListener(this.onTouchCloseEx, this);

        this.btnOk = findNodeByName(this.AutoSelectLayer.node, "btnOk");
        this.btnOk.addTouchEventListener(this.onTouchOKEx, this);

        //this.btnOk.setVisible(false);

        this.lstAuto = [];
        this.lstLoss = [];
        this.lstWin = [];

        this.lstbtnnums = [0, 10, 20, 50, 100];

        for(var ii = 0; ii < this.lstbtnnums.length; ++ii) {
            var anode = {};

            anode.btn = findNodeByName(this.AutoSelectLayer.node, "btnAuto" + this.lstbtnnums[ii]);
            anode.btn.addTouchEventListener(this.onTouchAutoEx, this);
            anode.nums = this.lstbtnnums[ii];

            this.lstAuto.push(anode);

            var lnode = {};

            lnode.btn = findNodeByName(this.AutoSelectLayer.node, "btnLoss" + this.lstbtnnums[ii]);
            lnode.btn.addTouchEventListener(this.onTouchLossEx, this);
            lnode.nums = this.lstbtnnums[ii];

            this.lstLoss.push(lnode);

            var wnode = {};

            wnode.btn = findNodeByName(this.AutoSelectLayer.node, "btnWin" + this.lstbtnnums[ii]);
            wnode.btn.addTouchEventListener(this.onTouchWinEx, this);
            wnode.nums = this.lstbtnnums[ii];

            this.lstWin.push(wnode);

            if(ii == 0) {
                anode.btn.setEnabled(false);
                anode.btn.setBright(false);

                lnode.btn.setEnabled(false);
                lnode.btn.setBright(false);

                wnode.btn.setEnabled(false);
                wnode.btn.setBright(false);
            }
        }

        this.curAutoNums = 0;
        this.curLossNums = 0;
        this.curWinNums = 0;
    },

    onTouchCloseEx : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        //this.closeLayer();
        this.removeFromParent(true);
    },

    onTouchOKEx : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.gamelayer.setAutoEx(this.curAutoNums, this.curLossNums, this.curWinNums);
        //this.closeLayer();
        this.removeFromParent(true);
    },

    onTouchAutoEx : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        for(var ii = 0; ii < this.lstAuto.length; ++ii) {
            var anode = this.lstAuto[ii];

            if(sender == anode.btn) {
                anode.btn.setEnabled(false);
                anode.btn.setBright(false);

                // if (anode.nums == 0) {
                //     this.btnOk.setVisible(false);
                //     //this.btnAuto.setVisible(true);
                // }
                // else {
                //     this.btnOk.setVisible(true);
                //     //this.btnAuto.setVisible(false);
                // }

                this.curAutoNums = anode.nums;
            }
            else {
                anode.btn.setEnabled(true);
                anode.btn.setBright(true);
            }
        }
    },

    onTouchLossEx : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        for(var ii = 0; ii < this.lstLoss.length; ++ii) {
            var lnode = this.lstLoss[ii];

            if(sender == lnode.btn) {
                lnode.btn.setEnabled(false);
                lnode.btn.setBright(false);

                this.curLossNums = lnode.nums;
            }
            else {
                lnode.btn.setEnabled(true);
                lnode.btn.setBright(true);
            }
        }
    },

    onTouchWinEx : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        for(var ii = 0; ii < this.lstWin.length; ++ii) {
            var wnode = this.lstWin[ii];

            if(sender == wnode.btn) {
                wnode.btn.setEnabled(false);
                wnode.btn.setBright(false);

                this.curWinNums = wnode.nums;
            }
            else {
                wnode.btn.setEnabled(true);
                wnode.btn.setBright(true);
            }
        }
    },
});
