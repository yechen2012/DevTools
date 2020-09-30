var NoticeTimeDialog = cc.Layer.extend({
    ctor: function (time, winnum, wintype, showhis) {
        this._super();

        this._bSupportHistory = showhis;
        this._bSupportHome = false;
        this._iTimeVal = time;
        this._iLimitVal = winnum;
        this._iLimitType = wintype; // 暂定非0为赢

        this._dialog = undefined;

        this._init();
        this._refreshTextInfo();
    },

    setTime: function (time) {
        this._iTimeVal = time;
        this._refreshTextInfo();
    },

    _init: function () {
        this._dialog = new BaseDialog(undefined, "",
            {
                title: LanguageData.instance.getTextStr("common_popup_button_stop"),
                callfunc: this._onTouchStop,
                target: this
            },
            {
                title: LanguageData.instance.getTextStr("common_popup_button_continue"),
                callfunc: this._onTouchContinue,
                target: this
            },
            {
                title: LanguageData.instance.getTextStr("common_popup_button_history"),
                callfunc: this._onTouchHistory,
                target: this
            }
        );

        this._dialog.setButtonVisible(2, this._bSupportHistory);
        this.addChild(this._dialog);
    },

    _refreshTextInfo: function () {
        LanguageData.instance.setMapValue("Time", this._iTimeVal);
        LanguageData.instance.setMapValue("Limit", this._iLimitVal);

        var key = "common_popup_timeLimit_win";
        if (this._iLimitType === 0) {
            key = "common_popup_timeLimit_lose";
        }

        var str = LanguageData.instance.getTextStr(key);
        this._dialog.setInfoStr(str);
    },

    _onTouchHistory: function (sender, type) {
        if (type !== ccui.Widget.TOUCH_ENDED)
            return;

        cc.log("touch history");
        GamelogicMgr.instance.callRegistered('openHistory');
    },

    _onTouchStop: function (sender, type) {
        if (type !== ccui.Widget.TOUCH_ENDED)
            return;

        cc.log("touch stop");
        this.removeFromParent();
        GamelogicMgr.instance.callRegistered('onCloseReality',false);
    },

    _onTouchContinue: function (sender, type) {
        if (type !== ccui.Widget.TOUCH_ENDED)
            return;

        cc.log("touch continue");
        this.removeFromParent();
        GamelogicMgr.instance.callRegistered('onCloseReality',true);
    }
});
