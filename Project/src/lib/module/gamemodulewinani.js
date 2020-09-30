var GameModuleWinAni = cc.Class.extend({
    ctor: function (mouduleui, anidata) {
        this.initDefault();
        this.initData(mouduleui, anidata)
    },
    initDefault: function () {
        this.mouduleui = null;
        this.windata = {};
        this.speed = 1;
        this.addspeed = 0;
        this.skipani = false;
        this.winstateticks = [];
        this.mdata = {};
    },
    initData: function (mouduleui, anidata) {
        this.mouduleui = mouduleui;
        if (anidata.speed != undefined) {
            this.windata.speed = anidata.speed;
            this.speed = anidata.speed;
        }
        if (anidata.addspeed != undefined) {
            this.windata.addspeed = anidata.addspeed;
            this.addspeed = anidata.addspeed;
        }
        if (anidata.syn != undefined) {
            this.windata.syn = anidata.syn;
        }
        if (anidata.addurl != undefined) {
            this.mdata.addurl = anidata.addurl;
            this.windata.percallfunc = this.iwinChangeStep;
            this.windata.target = this;
        }
        if (anidata.lstkeynum != undefined) {
            this.mdata.lstkeynum = anidata.lstkeynum;
        }
        if (anidata.endcallback != undefined) {
            this.mdata.endcallback = anidata.endcallback;
        }
        if (anidata.endcalltarget != undefined) {
            this.mdata.endcalltarget = anidata.endcalltarget;
        }
        if (anidata.cashnopre != undefined) {
            this.mdata.cashnopre = anidata.cashnopre;
        }
    },
    //显示动画
    showWinAni: function (wincoin) {
        this.skipani = false;
        this.mdata.wincoin = wincoin;
        GameDataMgr.instance.addScrollAni('numWinAni', wincoin, this.windata);
        this.changeWinAni(1);
        this.parseAnikeyNums();
    },
    //传入关键值起始动画index
    setAniIndex: function (indexs) {
        this.mdata.aniIndex = indexs;
    },
    //传入不同阶段动画结束等待时间，可以数组或统一值
    setAniEndWait: function (time) {
        this.mdata.endwait = time;
    },
    //传入跳过动画
    skipWinAni: function () {
        if (this.skipani) {
            return;
        }
        this.skipani = true;
        for (var name of this.winstateticks) {
            GameDataMgr.instance.removeTickCallback(name)
        }
        GameDataMgr.instance.endScrollAni('numWinAni');
        GameDataMgr.instance.timetick.updateTick('numwinaniover', 0.1)
        GameDataMgr.instance.timetick.updateTick('numwinaniend', 0.6)
    },
    parseAnikeyNums: function () {
        var keysnum = this.mdata.lstkeynum;
        var wincoin = this.mdata.wincoin;
        var lastanistate = 1;
        var startvalue = 0;
        var lastaniindex = 0;
        if (keysnum) {
            for (var i = 0; i < keysnum.length; i++) {
                var value = keysnum[i];
                if (value < wincoin) {
                    var scrtime = this.getNumScrollTime(0, value, this.speed, this.addspeed);
                    var temState = 3 * (i + 1);//，开始动画index:3,6,9...
                    if (this.mdata.aniIndex) {
                        temState = this.mdata.aniIndex[i];
                    }
                    lastaniindex = i;
                    lastanistate = temState;
                    startvalue = value;
                    var tickname = 'iwinscroll_' + temState;
                    this.winstateticks.push(tickname);
                    GameDataMgr.instance.insertTickCallback(tickname, scrtime, 0, this, this.changeWinCallfun, false, true)
                }
            }
        }
        var endanistate = lastanistate == 1 ? 2 : lastanistate + 2;//结算动画index
        var waittime = lastaniindex * 0.3 + 0.4;
        if (this.mdata.endwait != undefined) {
            var endwait = this.mdata.endwait;
            if (cc.isArray(endwait)) {
                waittime = endwait[lastaniindex];
            } else {
                waittime = endwait;
            }
        }
        var screndtime = this.getNumScrollTime(0, wincoin, 30, 10) + waittime;
        var winovercallfun = function () {
            this.changeWinAni(endanistate);
            var cashnopre= this.mdata.cashnopre;
            if(cashnopre){
                GameDataMgr.instance.refreshCashWithNoPrecision('numWinAni');
            }
        }
        GameDataMgr.instance.insertTickCallback('numwinaniover', screndtime, 0, this, winovercallfun, false, true);

        if (this.mdata.endcallback) {
            var winendcallback = function () {
                var callb = this.mdata.endcallback;
                var target = this.mdata.endcalltarget;
                callb.call(target);

            }
            GameDataMgr.instance.insertTickCallback('numwinaniend', screndtime + 0.5, 0, this, winendcallback, false, true)
        }


    },
    changeWinCallfun: function (dt, tickname) {
        var lastindex = tickname.lastIndexOf('_') + 1;
        var aniindex = tickname.substr(lastindex);
        this.changeWinAni(aniindex);
    },
    changeWinAni: function (aniindex) {
        if (this.mouduleui) {
            this.mouduleui._setState('winani', aniindex);
        }
    },
    iwinChangeStep: function () {
        var addurl = this.mdata.addurl;
        cc.audioEngine.playEffect(addurl, false);
    },
    //和GameDataMgr中滚动计算方式对应
    getNumScrollTime: function (start, end, speed, addspeed) {
        if (addspeed == 0) {
            var time = Math.abs((end - start) / (speed));
            return time;

        }
        var endtime = Math.sqrt((2 * addspeed * end + speed * speed) / (addspeed * addspeed)) - speed / addspeed;
        var starttime = Math.sqrt((2 * addspeed * start + speed * speed) / (addspeed * addspeed)) - speed / addspeed;
        var diff = endtime - starttime;
        return diff;
    }
});