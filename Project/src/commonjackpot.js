var CommonJackpotMgr = cc.Class.extend ({
    ctor: function () {
        this.lstPool = [];
        this.lstWin = [];
        this.bShowJackpot = false;

        this.callback = undefined;
        this.timerReq = undefined;
    },

    // 设置回调函数，在数据更新时，会调用该函数
    // callback(lstpool, lstwin)
    setCallback: function (callback) {
        this.callback = callback;
    },

    addWin: function (winnode) {
        var bi = 0;
        for (var ii = 0; ii < this.lstWin.length; ++ii) {
            if (winnode.id == this.lstWin[ii].id) {
                //bi = ii;
                return ;
            }
        }

        //winnode.isme = true;
        winnode.curnums = 0;
        this.lstWin.splice(0, 0, winnode);
    },

    // 收到消息时处理
    onMsg: function (lstpool, lstwin, bopen, bopen1) {
        this.lstPool = lstpool;

        // for (var ii = lstwin.length - 1; ii >= 0; --ii) {
        //     this.addWin(lstwin[ii]);
        // }
        //聊天服务器奖池开关
        if(isOpenReword){
            this.TalkServerAddWin(lstwin);
        }else {
            for (var ii = lstwin.length - 1; ii >= 0; --ii) {
                this.addWin(lstwin[ii]);
            }
        }

        if(this.lstWin.length > 10)
            this.lstWin.splice(10, this.lstWin.length - 10);

        if (this.callback != undefined) {
            this.callback(lstpool, lstwin);
        }

        this.bShowJackpot = bopen;
        this.bShowJackpot1 = bopen1;
    },

    TalkServerAddWin : function (lstwin) {
        for (var ii = lstwin.length - 1; ii >= 0; --ii) {
            this.addWin(lstwin[ii]);
        }
    },

    // 开始计时
    startTimer: function (offTime) {
        if (this.timerReq != undefined) {
            clearInterval(this.timerReq);

            this.timerReq = undefined;
        }

        this.timerReq = setInterval(function () {
            MainClient.singleton.reqCommonJackpot(function () {});

        }, offTime);
    },

    // //! 收到抽奖消息
    // onCommonJackpotMsg : function (msgobj) {
    //
    // },
});

CommonJackpotMgr.singleton = new CommonJackpotMgr();
