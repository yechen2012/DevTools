/**
 * Created by ssscomic on 2016/5/31.
 */

var TlodDisconnectLayer = cc.Layer.extend({
    ctor:function (gamelayer, type, type1, strerror) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        GameMgr.singleton.createMenuBarDlg(this, gamelayer, type, type1, strerror);
        return ;

        var sddisconnectlayer = ccs.load(res.TlodDisconnectLayer_json);
        this.addChild(sddisconnectlayer.node);

        this.gamelayer = gamelayer;

        var btnOK = findNodeByName(sddisconnectlayer.node, "btnOK");
        btnOK.addTouchEventListener(this.onTouchOK, this);

        var sprDisconnect = sddisconnectlayer.node.getChildByName("sprDisconnect");
        sprDisconnect.setVisible(false);
        this.sprDisconnect = sprDisconnect;

        var sprNotEnough = sddisconnectlayer.node.getChildByName("sprNotEnough");
        sprNotEnough.setVisible(false);
        this.sprNotEnough = sprNotEnough;

        // var sprError = sddisconnectlayer.node.getChildByName("sprError");
        // sprError.setVisible(false);
        // this.sprError = sprError;

        var sprError1 = sddisconnectlayer.node.getChildByName("sprError1");
        sprError1.setVisible(false);
        this.sprError1 = sprError1;

        var sprError2 = sddisconnectlayer.node.getChildByName("sprError2");
        sprError2.setVisible(false);
        this.sprError2 = sprError2;

        var sprStop1 = sddisconnectlayer.node.getChildByName("sprStop1");
        if(sprStop1 != undefined && sprStop1 != null) {
            sprStop1.setVisible(false);
            this.sprStop1 = sprStop1;
        }

        var sprStop2 = sddisconnectlayer.node.getChildByName("sprStop2");
        if(sprStop2 != undefined && sprStop2 != null) {
            sprStop2.setVisible(false);
            this.sprStop2 = sprStop2;
        }

        var textError = sddisconnectlayer.node.getChildByName("textError");
        textError.setFontName("Microsoft YaHei");
        textError.setVisible(false);
        this.textError = textError;

        var layErrorBack = sddisconnectlayer.node.getChildByName("layErrorBack");
        layErrorBack.setVisible(false);
        this.layErrorBack = layErrorBack;

        this.iType = type;
        this.iTyp1 = type1;

        this.CloseTime = 0;

        if(strerror != undefined)
            this.textError.setString(strerror);
        else
            this.textError.setString("");

        if(this.iType == 1) {
            sprDisconnect.setVisible(true);
            //btnOK.setVisible(false);
        }
        else if(this.iType == 2){
            if(this.iTyp1 == 0)
                sprNotEnough.setVisible(true);
            else if(this.iTyp1 == 1 && sprStop1)
                sprStop1.setVisible(true);
            else if(this.iTyp1 == 2 && sprStop2)
                sprStop2.setVisible(true);
        }
        else if(this.iType == 3){
            if(this.iTyp1 == 0) {
                //sprError.setVisible(true);
                textError.setVisible(true);
                layErrorBack.setVisible(true);
            }
            else if(this.iTyp1 == 1) {
                sprError1.setVisible(true);
            }
            else {
                sprError2.setVisible(true);
                btnOK.setVisible(false);
                this.CloseTime = 2;
            }
        }
        else if(this.iType == 4){
            textError.setVisible(true);
            layErrorBack.setVisible(true);
        }

        this.scheduleUpdate();
    },

    onTouchOK : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.gamelayer.playBtnSound();

        if(this.iType == 1 || this.iType == 3) {
            //! 重启
            //location.reload();
            //self.location = g_mainurl;
            //cc.game.restart();
            refurbish_main();
            return ;
        }

        this.getParent().removeChild(this);

        if (this.iType == 3 || this.iType == 4) {
            this.gamelayer.ErrorLayer = undefined;
            this.gamelayer.bErrorPause = false;
        }
    },

    update : function (dt) {
        if(this.CloseTime <= 0)
            return ;

        this.CloseTime -= dt;

        if(this.CloseTime <= 0){
            this.CloseTime = 0;
            this.gamelayer.ErrorLayer = undefined;
            this.getParent().removeChild(this);
        }
    }

});
