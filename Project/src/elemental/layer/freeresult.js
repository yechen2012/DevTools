/**
 * Created by ssscomic on 2016/8/10.
 */

var ElementalFreeResultLayer = cc.Layer.extend({
    sprite: null,
    ctor: function (gamelayer, freewin, cnum) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        this._bExit = false;

        var layer = ccs.load(res.ElementalGameNode_FreeResult_json);
        layer.node.runAction(layer.action);
        this.addChild(layer.node);

        this.gamelayer = gamelayer;
        this.layer = layer;

        var textInfo1 = findNodeByName(layer.node, "textInfo1");
        textInfo1 = new TextEx(textInfo1, false);
        LanguageData.instance.showTextStr("fs_summary_amount_won1", textInfo1);
        if (cnum <= 5) {
            textInfo1.setVisible(false);
        }

        var textInfo2 = findNodeByName(layer.node, "textInfo2");
        textInfo2 = new TextEx(textInfo2, false);
        LanguageData.instance.showTextStr("fs_summary_amount_won2", textInfo2);

        var str = LanguageData.instance.getTextStr("common_popup_button_ok");
        var btnOK = findNodeByName(layer.node, "btnOk");
        btnOK.addTouchEventListener(this.onTouchOK, this);
        btnOK.setTitleFontName("NotoSans-R");
        btnOK.setTitleText(str);

        this._btnOK = btnOK;

        var textAllWin = findNodeByName(layer.node, "textAllWin");

        if (freewin <= 0) {
            textAllWin.setString('0');
        } else {
            var coinsnumber = GameDataMgr.instance.getCashStrByConfig(freewin);
            textAllWin.setString(coinsnumber);
        }

        layer.action.play("wait_1", false);

        var aniCtrlBack = findNodeByName(layer.node, "aniCtrlBack");
        aniCtrlBack.animation.play("wait_1", 0, false);
        aniCtrlBack.animation.setMovementEventCallFunc(function(sender, type, movementID) {
            if (type === ccs.MovementEventType.complete && movementID === "wait_1") {
                aniCtrlBack.animation.play("wait_2", 0, false);
                layer.action.play("wait_2", false);
            }
        });

        this._aniCtrlBack = aniCtrlBack;
        this._layer = layer;

        if (GamelogicMgr.instance.isYggPlatform())
            this.refreshBtnState();
    },

    refreshBtnState: function() {
        if (this._btnOK) {
            this._btnOK.setEnabled(!this.gamelayer.bCollect);
        }
    },

    onTouchOK : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED || this._bExit)
            return;

        this.gamelayer.playBtnSound();

        this._bExit = true;

        this._aniCtrlBack.animation.play("wait_3", 0, false);
        this._layer.action.play("wait_3", false);

        this.gamelayer.leftFreeResult();
    }
});