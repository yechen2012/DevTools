var CommonFreeGame = cc.Layer.extend({
    isshowtitle : false,
    data : null,
    ctor: function(data) {
        this._super();
        this._init();
        this.scheduleUpdate();
        this.setVisible(false);
    },

    onData : function (data) {
        //! 从两组服务器发出的数据不一致，部分数据可能需要保留
        var ExpireTime;
        var id;

        if(data && !data.ExpireTime && this.data && this.data.ExpireTime)
            ExpireTime = this.data.ExpireTime;

        if(data && !data.id && this.data && this.data.id)
            id = this.data.id;

        this.data = data;

        if(ExpireTime)
            this.data.ExpireTime = ExpireTime;

        if(id)
            this.data.id = id;

        this._parseCoin();
    },

    update: function(dt) {
        this._resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height);
    },

    _init: function() {
        var layer = ccs.load(res.CommonFreespin_json);
        this.addChild(layer.node);

        this._ccLayer = layer;
        this._panelClose = findNodeByName(layer.node, "Panel_close");
        this._panel_notice_bottom = findNodeByName(layer.node, "Panel_notice_bottom");
        this._uiLayer = findNodeByName(layer.node, "Panel_ui");
        this._panel_hor = findNodeByName(layer.node, "Panel_hor");
        this._panel_ver = findNodeByName(layer.node, "Panel_ver");
        this._panel_hor.setVisible(false);
        this._panel_ver.setVisible(false);
        this.titleobj = {
            titlestr:[findNodeByName(this._panel_hor, "freegame_title"),findNodeByName(this._panel_ver, "freegame_title")],
            timestr:[findNodeByName(this._panel_hor, "freegame_time"),findNodeByName(this._panel_ver, "freegame_time")],
            timetxt:[findNodeByName(this._panel_hor, "freegame_time_txt"),findNodeByName(this._panel_ver, "freegame_time_txt")],
            totalwinstr:[findNodeByName(this._panel_hor, "freegame_total_win"),findNodeByName(this._panel_ver, "freegame_total_win")],
            totalwintxt:[findNodeByName(this._panel_hor, "freegame_total_win_txt"),findNodeByName(this._panel_ver, "freegame_total_win_txt")],
            freegamestr:[findNodeByName(this._panel_hor, "freegame_free_game"),findNodeByName(this._panel_ver, "freegame_free_game")],
            freegametxt:[findNodeByName(this._panel_hor, "freegame_free_game_txt"),findNodeByName(this._panel_ver, "freegame_free_game_txt")],
        }
        this.freegame_start = findNodeByName(this._uiLayer, "node_title_0");
        this.freegame_nodeinfo = findNodeByName(this._uiLayer, "node_info");
        this.freegame_end = findNodeByName(this._uiLayer, "node_info_jiesuan");
        this.freegame_start.setVisible(true);
        this.freegame_nodeinfo.setVisible(true);
        this.freegame_end.setVisible(false);
        this.jiesuan_total_txt = findNodeByName(this._uiLayer, "jiesuan_total_txt");
        this.jiesuan_total = findNodeByName(this.freegame_end, "jiesuan_total");
        this.freegame_text_info = findNodeByName(this.freegame_nodeinfo, "freegame_text_info");
        this.freegame_times = findNodeByName(this._uiLayer, "freegame_times");

        this.node_btn_ok = findNodeByName(this._uiLayer, "node_btn_ok");
        this.freegame_btn_no = findNodeByName(this._uiLayer, "freegame_btn_no");
        this.freegame_btn_no.addTouchEventListener(this._touchNo, this);
        this.freegame_btn_no.setTitleText(LanguageData.instance.getTextStr("common_freeSpins_button_no"));
        this.freegame_btn_later = findNodeByName(this._uiLayer, "freegame_btn_later");
        this.freegame_btn_later.addTouchEventListener(this._touchLater, this);
        this.freegame_btn_later.setTitleText(LanguageData.instance.getTextStr("common_freeSpins_button_later"));
        this.freegame_btn_ok = findNodeByName(this._uiLayer, "freegame_btn_ok");
        this.freegame_btn_ok.addTouchEventListener(this._touchOk, this);
        this.freegame_btn_ok.setTitleText(LanguageData.instance.getTextStr("common_popup_button_ok"));

        this.node_btn_ok_L = findNodeByName(this._uiLayer, "node_btn_ok_L");
        this.freegame_btn_okL = findNodeByName(this._uiLayer, "freegame_btn_okL");
        this.freegame_btn_okL.addTouchEventListener(this._touchOk, this);

        this.refreshStaticText();
        this.refreshDisplay();
        this._resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height);
    },

    showLayer : function () {
        this.setVisible(true);

        this.refreshDisplay();
        //剩余次数为0，红包带来的所有局面都走完，红包没有过期
        if(this.data.lastnums <= 0 && this.data.ended && !this.data.hasExpired){
            this._uiLayer.setVisible(true);
            this._panel_hor.setVisible(false);
            this._panel_ver.setVisible(false);
            this._panel_notice_bottom.setVisible(true);
            this.freegame_start.setVisible(false);
            this.freegame_nodeinfo.setVisible(false);
            this.freegame_end.setVisible(true);
        }else if(this.data.hasExpired) {
            this._uiLayer.setVisible(true);
            this._panel_hor.setVisible(false);
            this._panel_ver.setVisible(false);
            this._panel_notice_bottom.setVisible(true);
            this.freegame_start.setVisible(false);
            this.freegame_nodeinfo.setVisible(false);
            this.freegame_end.setVisible(true);
            this.isshowtitle = true;
            var bet=this.data.bet;
            GameEmitterMgr.instance.emit('msg_gameReady',bet);
        }else {
            //红包次数>=0,红包带来的局面还没有走完，红包还没有过期
            this.freegame_start.setVisible(true);
            this.freegame_nodeinfo.setVisible(true);
            this.freegame_end.setVisible(false);
        }

        this._resetSize(cc.view.getFrameSize().width, cc.view.getFrameSize().height);

        // if(this.data.lastnums <= 0 && this.data.ended && !this.data.hasExpired)
        //     GamelogicMgr.instance.setPrepaid(0);
        // else
            GamelogicMgr.instance.setPrepaid(this.data.bet * this.data.line * this.data.times);
    },

    //! 使用一次
    runOne : function () {
        if (this.data == undefined)
            return;

        if(this.data.lastnums > 0)
            --this.data.lastnums;

        this.refreshDisplay();
    },

    // 静态文本多语言适配
    refreshStaticText: function() {
        // UI多语言适配
        // Panel_hor & Panel_ver
        var text = undefined;
        for (var i = 0; i < 2; ++i) {
            text =  new TextEx(this.titleobj.titlestr[i], false);
            LanguageData.instance.showTextStr("common_freeSpins_label_freeSpins", text);

            text =  new TextEx(this.titleobj.totalwinstr[i], false);
            LanguageData.instance.showTextStr("common_freeSpins_label_totalWin", text);

            text =  new TextEx(this.titleobj.freegamestr[i], false);
            LanguageData.instance.showTextStr("common_freeSpins_label_freeGames", text);

            text =  new TextEx(this.titleobj.timestr[i], false);
            LanguageData.instance.showTextStr("common_freeSpins_label_before", text);
        }

        // Panel_UI
        text = findNodeByName(this._uiLayer, "freegame_text_title");
        text = new TextEx(text, false);
        LanguageData.instance.showTextStr("common_freeSpins_label_congratulations", text);

        text = findNodeByName(this.freegame_start, "text_title");
        text = new TextEx(text, false);
        LanguageData.instance.showTextStr("common_freeSpins_label_freeSpins", text);
    },

    refreshDisplay : function () {
        if (this.data == undefined)
            return;

        // 动态文本多语言适配
        var totalWin = LanguageData.instance.formatMoney(this.data.totalwinformat);
        LanguageData.instance.setMapValue("FreeNum", this.data.lastnums);
        LanguageData.instance.setMapValue("Bet", LanguageData.instance.formatMoney(this.data.bet * this.data.line / 100));
        if(this.data.lastnums == this.data.totalnums) {
            LanguageData.instance.showTextStr("common_freeSpins_details_1", this.freegame_text_info);
        }else {
            LanguageData.instance.setMapValue("TotalWin", totalWin);
            LanguageData.instance.showTextStr("common_freeSpins_details_3", this.freegame_text_info);
        }

        LanguageData.instance.setMapValue("FreeNum", this.data.totalnums);
        if(this.data.hasExpired){
            LanguageData.instance.showTextStr("common_freeSpins_details_4", this.jiesuan_total);
        }else {
            LanguageData.instance.showTextStr("common_freeSpins_details_2", this.jiesuan_total);
        }

        this.jiesuan_total_txt.setString(totalWin);

        if(this.data.lastnums == this.data.totalnums){
            this.node_btn_ok.setVisible(true);
            this.node_btn_ok_L.setVisible(false);
        }else {
            this.node_btn_ok.setVisible(false);
            this.node_btn_ok_L.setVisible(true);
        }

        var timestrtxt;

        if(this.data.ExpireTime) {
            timestrtxt = "";
            var date = new Date(this.data.ExpireTime * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var YY = date.getFullYear() + '-';
            var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
            var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            timestrtxt = YY + MM + DD +" "+hh + mm + ss;
        }

        for (var i = 0; i < 2; i++){
            this.titleobj.totalwintxt[i].setString(totalWin);
            var timesstr = this.data.lastnums + "/" + this.data.totalnums;
            this.titleobj.freegametxt[i].setString(timesstr);

            if(timestrtxt)
                this.titleobj.timetxt[i].setString(timestrtxt);
        }
        this.freegame_times.setString(this.data.lastnums);
    },

    _parseCoin: function() {
        if (!this.data)
            return;

        var rateValue = 100;
        if (typeof(GamelogicMgr) != "undefined" && GamelogicMgr.instance && GamelogicMgr.instance.getCurRateValue) {
            rateValue = GamelogicMgr.instance.getCurRateValue();
        }

        if (this.data.totalwin != undefined) {
            this.data.totalwinformat = this.data.totalwin / rateValue;
        }

        if (this.data.bet != undefined) {
            var value = this.data.bet / rateValue;
            var separray = value.toString().split('.');
            var precount = separray.length > 1 ? separray[1].length : 0;
            precount = Math.max(precount, 2);
            var fixednum = LanguageData.instance.fixedNumberWithPre(value, precount);
            this.data.betformat = fixednum;
        }
    },

    isCanPressed : function () {
        return this.isVisible() && this._uiLayer.isVisible();
    },

    _touchNo: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;
        this._dialog = new BaseDialog(LanguageData.instance.getTextStr("common_popup_title"), LanguageData.instance.getTextStr("common_freeSpins_details_5"), {
            title: LanguageData.instance.getTextStr("common_popup_button_ok"),
            callfunc: this._cancel,
            target: this
        },{
            title: LanguageData.instance.getTextStr("common_autoSpin_label_cancel"),
            callfunc: this.removeDialog,
            target: this
        });
        this.addChild(this._dialog);
    },

    removeDialog: function (sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;
        if(this._dialog){
            this._dialog.removeFromParent(true);
            this._dialog = undefined;
        }
    },

    _cancel: function (sender,type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;
        var self = this;
        if(this.data && this.data.id) {
            MainClient.singleton.NotUsedGiftFree(this.data.id, function (isok) {
                if (isok) {
                    cc.log("not use giftfree success");
                    self._touchLater(null, ccui.Widget.TOUCH_ENDED);
                } else {
                    // this._touchLater(null, ccui.Widget.TOUCH_ENDED);
                    cc.log("not use giftfree faile");
                    self.removeDialog(null, ccui.Widget.TOUCH_ENDED);
                }
            })
        }
    },

    _touchLater: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        this.setVisible(false);
        GamelogicMgr.instance.setPrepaid(0);
        this.leftGiftGame();
    },

    _touchOk: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.isshowtitle){
            // this.setVisible(false);
            // this.leftGiftGame();
            this._touchLater(null,type);
        }else {
            this.isshowtitle = true;
            this._uiLayer.setVisible(false);
            var size = cc.view.getFrameSize();
            this._panel_hor.setVisible(size.width > size.height);
            this._panel_ver.setVisible(size.width <= size.height);
            this._panel_notice_bottom.setVisible(false);
            this.freegame_start.setVisible(false);
            this.freegame_nodeinfo.setVisible(false);
            this.freegame_end.setVisible(false);
            var bet=this.data.bet;
            GameEmitterMgr.instance.emit('msg_gameReady',bet);
            GamelogicMgr.instance.setPrepaid(this.data.bet * this.data.line * this.data.times);
        }
    },

    leftGiftGame : function () {
        this.isshowtitle = false;
        this.data = null;
        CommonServer.singleton.leftGiftGame();
        GameMgr.singleton.leftGiftGame();
    },

    getGiftData : function (ignorenum) {
        if(this.data == undefined)
            return undefined;

        // if(ignorenum == undefined || !ignorenum) {
        //     if(this.data.lastnums <= 0)
        //         return undefined;
        // }

        var data = {};

        data.bet = Math.floor(this.data.bet / this.data.line / this.data.times);
        data.line = this.data.line;
        data.times = this.data.times;
        data.lastnums = this.data.lastnums;
        data.totalnums = this.data.totalnums;
        data.id = this.data.id;

        return data;
    },

    _resetSize: function(width, height, bReset) {
        if (this._iWidth === width && this._iHeight === height && !bReset) {
            return;
        }

        this._iWidth = width;
        this._iHeight = height;

        var scale = 1;
        if (width > height) {
            scale = height / 900;
            if(!this._panel_hor.isVisible() && this.isshowtitle){
                this._panel_hor.setVisible(true);
            }
            if(this._panel_ver.isVisible()){
                this._panel_ver.setVisible(false);
            }
        } else {
            scale = width / 900;
            if(this._panel_hor.isVisible()){
                this._panel_hor.setVisible(false);
            }
            if(!this._panel_ver.isVisible() && this.isshowtitle){
                this._panel_ver.setVisible(true);
            }
        }

        this._uiLayer.setScale(scale);
        this._uiLayer.setPosition(width * 0.5, height * 0.5);
        this._panel_hor.setScale(scale);
        this._panel_hor.setPosition(width * 0.5, height * 1);
        this._panel_ver.setScale(scale);
        this._panel_ver.setPosition(width * 0.5, height * 1);
        this._panelClose.setContentSize(width, height);
        this._panel_notice_bottom.setContentSize(width, height);

        this._anchorPoint = cc.p(0,0);
        if (this._anchorPoint !== undefined) {
            var rw = -this._iWidth * this._anchorPoint.x;
            var ry = -this._iHeight * this._anchorPoint.y;

            this._ccLayer.node.setPosition(rw, ry);
        }
    }
});
