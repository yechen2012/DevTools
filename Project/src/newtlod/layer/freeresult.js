/**
 * Created by ssscomic on 2016/8/10.
 */

var TlodFreeResultLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (gamelayer, freenum, freewin, level) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////Ｔｌｏｄ
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var layer = ccs.load(res.NewTlodGameNode_FreeResult_json);
        this.addChild(layer.node);
        layer.node.runAction(layer.action);
        this.gamelayer = gamelayer;

        this.iLevel = level + 1;

        var btnOK = findNodeByName(layer.node, "areaOK");
        btnOK.addTouchEventListener(this.onTouchOK, this);

        var textFreeWin = findNodeByName(layer.node, "textFreeWin");

        if(freewin <= 0)
            textFreeWin.setString('0');
        else
            textFreeWin.setString(gamelayer.chgString(freewin));
        this.textFreeWin = textFreeWin;

        var textFreeNum = findNodeByName(layer.node, "textFreeNum");
        textFreeNum.setString(freenum.toString());
        this.textFreeNum = textFreeNum;

        this.aniResult = findNodeByName(layer.node, "aniResult");
        this.aniResult.animation.play("js" + this.iLevel + "-1", -1, 0);

        this.textFreeWin.setVisible(false);
        this.textFreeNum.setVisible(false);

        this.iState = 0;        //! 0开始 1循环 2结束
        this.scheduleUpdate();
    },

    update : function(dt) {
        if(this.aniResult.animation.getCurrentMovementID() == '') {
            if(this.iState == 0) {
                this.textFreeWin.setVisible(true);
                this.textFreeNum.setVisible(true);
                this.aniResult.animation.play("js" + this.iLevel + "-2", -1, 1);
                this.iState = 1;
            }
            else if(this.iState == 2) {
                this.gamelayer.leftFreeResult();
            }
        }
    },

    onTouchOK : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if(this.iState != 1)
            return ;

        this.textFreeWin.setVisible(false);
        this.textFreeNum.setVisible(false);
        this.aniResult.animation.play("js" + this.iLevel + "-3", -1, 0);
        this.iState = 2;
    }
});