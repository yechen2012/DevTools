var DisconnectDialog = cc.Layer.extend({
    ctor: function(gamelayer, type, type1, strerror) {
        this._super();

        this._gameLayer = gamelayer;
        this._iType = type;
        this._iType1 = type1;
        this._strError = strerror;
        this._iCloseTime = 0;

        this._dialog = undefined;

        this._init();
    },

    update: function(dt) {
        this._super(dt);

        if(this._iCloseTime <= 0)
            return ;

        this._iCloseTime -= dt;

        if(this._iCloseTime <= 0){
            this._iCloseTime = 0;
            this._gameLayer.ErrorLayer = undefined;
            this.removeFromParent();
        }
    },

    _init: function() {
        this._dialog = new BaseDialog(LanguageData.instance.getTextStr("common_popup_title"), "", {
            title: LanguageData.instance.getTextStr("common_popup_button_ok"),
            callfunc: this._onTouchOk,
            target: this
        });
        this.addChild(this._dialog);

        var strInfo = "";
        if(this._strError !== undefined)
            strInfo = this._strError;
        else
            strInfo = "";

        if(this._iType == 1) {
            strInfo = LanguageData.instance.getTextStr("common_popup_error_1");
        }
        else if(this._iType === 2){
            if(this._iType1 === 0)
                strInfo = LanguageData.instance.getTextStr("common_popup_error_2");
            else if(this._iType1 === 1)
                strInfo = LanguageData.instance.getTextStr("common_popup_error_6");
            else if(this._iType1 === 2)
                strInfo = LanguageData.instance.getTextStr("common_popup_error_5");
            else if(this._iType1 === -1){
                LanguageData.instance.setMapValue('TotalMax', this._strError);
                strInfo = LanguageData.instance.getTextStr("common_popup_totalMax_details");
            }
        }
        else if(this._iType === 3){
            if(this._iType1 === 0) {
                this._dialog.setInfoVisible(true);
            }
            else if(this._iType1 === 1) {
                strInfo = LanguageData.instance.getTextStr("common_popup_error_3");
            }
            else {
                strInfo = LanguageData.instance.getTextStr("common_popup_error_4");
                this._dialog.setButtonVisible(0, false);
                this._iCloseTime = 2;
            }
        }
        else if(this._iType === 4){
            this._dialog.setInfoVisible(true);
        }
        else if(this._iType === 5){
            LanguageData.instance.setMapValue('Limit', this._strError);

            if(this._iType1 === 1){
                strInfo = LanguageData.instance.getTextStr("common_popup_autoSpin_win");
            }
            else if(this._iType1 === 2){
                strInfo = LanguageData.instance.getTextStr("common_popup_autoSpin_lose");
            }
        }

        this._dialog.setInfoStr(strInfo);
    },

    _onTouchOk: function(sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this._gameLayer.playBtnSound();

        if(this._iType == 1 || this._iType == 3) {
            refurbish_main();
            return ;
        }

        this.removeFromParent();

        if(this._gameLayer.ModuleUI === undefined){
            var state = 0;
            if (this._gameLayer._getCurState("disconnect") == "show")
                state = "hide";

            this._gameLayer._setState("disconnect", state);
        }
        else{
            var state = 0;
            if (this._gameLayer.ModuleUI._getCurState("disconnect") == "show")
                state = "hide";

            this._gameLayer.ModuleUI._setState("disconnect", state);
        }

        if (this._iType == 3 || this._iType == 4) {
            this._gameLayer.ErrorLayer = undefined;
            this._gameLayer.bErrorPause = false;
        }
    }
});