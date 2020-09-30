/**
 * Created by ssscomic on 2016/5/31.
 */

var IceFireDisconnectLayer = cc.Layer.extend({
    ctor:function (root, gamelayer, type, type1, strerror) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        //if(type == 2 && type1 == -1)
        //    GameMgr.singleton.createMenuBarDlg_maxbet(root, gamelayer, strerror);
        //else
        //    GameMgr.singleton.createMenuBarDlg(root, gamelayer, type, type1, strerror);
        //
        //return ;

        var disconnectlayer = ccs.load(res.IceFireGameNodeDisconnect_json);
        this.addChild(disconnectlayer.node);

        this.gamelayer = gamelayer;

        this.rootNode = root;

        var btnOK = findNodeByName(disconnectlayer.node, "btnOK");
        btnOK.addTouchEventListener(this.onTouchOK, this);

        var textError = findNodeByName(disconnectlayer.node, "textError");
        textError.setFontName("Microsoft YaHei");
        //textError.setVisible(false);
        this.textError = textError;

        this.iType = type;
        this.iTyp1 = type1;

        this.CloseTime = 0;

        if(strerror != undefined)
            this.textError.setString(strerror);
        else
            this.textError.setString("");

        if(this.iType == 1) {
            this.textError.setString(StringMgrSys.getString_str("StringDlgError1"));
            //sprDisconnect.setVisible(true);
        }
        else if(this.iType == 2){
            //this.textError.setString(StringMgrSys.getString_str("StringDlgError2"));
            //sprNotEnough.setVisible(true);

            if(this.iTyp1 == 0)
                this.textError.setString(StringMgrSys.getString_str("StringDlgError2"));
            else if(this.iTyp1 == 1)
                this.textError.setString(StringMgrSys.getString_str("StringDlgError6"));
            else if(this.iTyp1 == 2)
                this.textError.setString(StringMgrSys.getString_str("StringDlgError5"));
            else if(this.iTyp1 == -1){
                //StringMgrSys.mbDlgMaxBet = (strerror / 100).toString();
                //this.textError.setString(StringMgrSys.getString_str("StringDlgMaxBet"));

                LanguageData.instance.setMapValue('TotalMax', strerror);
                LanguageData.instance.showTextStr("uiScreen_TotalMax",this.textError);
            }
        }
        else if(this.iType == 3){
            if(this.iTyp1 == 0) {
                //sprError.setVisible(true);
                textError.setVisible(true);
                //layErrorBack.setVisible(true);
            }
            else if(this.iTyp1 == 1) {
                this.textError.setString(StringMgrSys.getString_str("StringDlgError3"));
                //sprError1.setVisible(true);
            }
            else {
                this.textError.setString(StringMgrSys.getString_str("StringDlgError4"));
                //sprError2.setVisible(true);
                btnOK.setVisible(false);
                this.CloseTime = 2;
            }
        }
        else if(this.iType == 4){
            textError.setVisible(true);
            //layErrorBack.setVisible(true);
        }
        else if(this.iType == 5){
            LanguageData.instance.setMapValue('Limit', strerror);

            if(this.iTyp1 == 1){
                LanguageData.instance.showTextStr("uiScreen_WinLimit1",this.textError);
                // if(bshowcash){
                //     //this.textError.setString("You've won €" +  strerror +"coins in this game round.");
                //     LanguageData.instance.showTextStr("uiScreen_WinLimit2",this.textError);
                // }
                // else{
                //     //this.textError.setString("You've won" +  strerror +"coins in this game round.");
                //     LanguageData.instance.showTextStr("uiScreen_WinLimit1",this.textError);
                // }
            }
            else if(this.iTyp1 == 2){
                LanguageData.instance.showTextStr("uiScreen_LossLimit1",this.textError);
                // if(bshowcash){
                //     //this.textError.setString("You've lost €" +  strerror +" already.");
                //     LanguageData.instance.showTextStr("uiScreen_LossLimit2",this.textError);
                // }
                // else{
                //     //this.textError.setString("You've lost" +  strerror +" already.");
                //     LanguageData.instance.showTextStr("uiScreen_LossLimit1",this.textError);
                // }
            }
        }

        var fsize = this.textError.getFontSize();
        var tsize = this.textError.getVirtualRendererSize();

        if(tsize.height < fsize * 2) {
            this.textError.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
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

        this.rootNode.removeChild(this);

        if(this.gamelayer.ModuleUI == undefined){
            this.gamelayer._setState('disconnect', 'hide');
        }
        else{
            this.gamelayer.ModuleUI._setState('disconnect', 'hide');
        }

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
            this.rootNode.removeChild(this);
        }
    }

});
