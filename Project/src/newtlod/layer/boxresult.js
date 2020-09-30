/**
 * Created by ssscomic on 2016/8/9.
 */

var NarutoBoxResultLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (gamelayer, num, mul) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var layer = ccs.load(res.NarutoBoxResultLayer_json);
        this.addChild(layer.node);

        this.gamelayer = gamelayer;

        var btnOK = findNodeByName(layer.node, "btnOK");
        btnOK.addTouchEventListener(this.onTouchOK, this);

        var textFreeNum = findNodeByName(layer.node, "textFreeNum");
        textFreeNum.setString(num.toString());

        var textFreeMul = findNodeByName(layer.node, "textFreeMul");
        textFreeMul.setString("X" + mul.toString());
    },

    onTouchOK : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.gamelayer.leftBoxGame();
    }
});