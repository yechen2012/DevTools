/**
 * Created by ssscomic on 2016/6/1.
 */

var TlodSoundTipsLayer = cc.Layer.extend({
    ctor:function (gamelayer) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var soundtipslayer = ccs.load(res.TlodSoundTipsLayer_json);
        this.addChild(soundtipslayer.node);

        this.gamelayer = gamelayer;

        var layClick = findNodeByName(soundtipslayer.node, "layClick");
        layClick.addTouchEventListener(this.onTouchClick, this);

        var btnCloseSound = findNodeByName(soundtipslayer.node, "btnCloseSound");
        btnCloseSound.addTouchEventListener(this.onTouchCloseSound, this);
    },

    onTouchClick : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.getParent().removeChild(this);
    },

    onTouchCloseSound : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.gamelayer.setPlaySound(true);
        this.getParent().removeChild(this);
    },
});