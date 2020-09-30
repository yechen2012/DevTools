/**
 * Created by ssscomic on 2016/6/15.
 */

var TlodHelpLayer4 = cc.Layer.extend({
    ctor:function (gamelayer) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        this.bInit = false;

        if(res.TlodHelpLayer4_json == undefined)
            return ;

        var helplayer = ccs.load(res.TlodHelpLayer4_json);
        this.addChild(helplayer.node);

        this.gamelayer = gamelayer;

        //! 按钮相关
        var btnExit = findNodeByName(helplayer.node, "btnExit");
        btnExit.addTouchEventListener(this.onTouchExit, this);
        this.btnExit = btnExit;

        var btnNext = findNodeByName(helplayer.node, "btnFront");
        btnNext.addTouchEventListener(this.onTouchLeft, this);
        this.btnNext = btnNext;

        var btnNext = findNodeByName(helplayer.node, "btnNext");
        btnNext.addTouchEventListener(this.onTouchRight, this);
        this.btnNext = btnNext;

        this.bInit = true;
    },

    //! 按钮
    onTouchExit : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.gamelayer.playBtnSound();
        this.gamelayer.showHelp(0);
    },

    onTouchLeft : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.gamelayer.playBtnSound();
        //this.gamelayer.showHelp(1);
        this.gamelayer.beforeHelp(4);
    },

    onTouchRight : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.gamelayer.playBtnSound();
        //this.gamelayer.showHelp(1);
        this.gamelayer.nextHelp(4);
    },
});
