//onepause执行一次暂停，计时为0执行一次，其他逻辑更新计时为0再次执行
var TickEntry = function (tickname, starttime, interval, target, callfun, pause, once, onepause) {
    var _t = this;
    _t.tname = tickname;
    _t.stime = starttime;
    _t.interval = interval;
    _t.target = target;
    _t.callfun = callfun;
    _t.pause = pause;
    _t.isonce = once;
    _t.onepuse = onepause;
    _t.precall = null;
}

var TimeTick = cc.Class.extend({
    ctor: function () {
        this.initData();
    },
    initData: function () {
        //hash保存
        this.hasCallFuns = {};
        //用来遍历
        this.arrayCallFuns = [];
        this.dttime = 0;
    },
    update: function (dt) {
        this.dttime += dt;
        var arr = this.arrayCallFuns;
        var curtime = this.dttime;
        for (var i = arr.length - 1; i >= 0; i--) {
            var entry = arr[i];
            if(!entry){
                continue;
            }
            if (entry.pause) {
                entry.stime += dt;
                continue;
            }
            if (entry.precall!=null) {
                var target = entry.target;
                var precall = entry.precall;
                var result=precall.call(target);
                if(result){
                    entry.stime += dt;
                    continue;
                }
            }
            if (curtime >= entry.stime) {
                entry.stime = curtime + entry.interval;
                var target = entry.target;
                var callfun = entry.callfun;
                var tickname= entry.tname;
                if (entry.onepuse) {
                    entry.pause = true;
                }
                if (entry.isonce) {
                    arr.splice(i, 1);
                    delete this.hasCallFuns[entry.tname];
                }
                callfun.call(target, dt,tickname);
            }
        }
    },
    //插入tick，这里用来注册永续，或者一次(执行后会删除)
    //游戏中有很多种情况，计时开始，为0执行一次，其他逻辑更新计时为0再次执行，使用insertWaitTick注册
    insertTick: function (tickname, delay, interval, target, callfun, pause, once) {
        var stime = this.dttime + delay;
        var hasTick = this.containTickName(tickname);
        if (hasTick) {
            var entry = this.hasCallFuns[tickname];
            entry.stime = stime;
            entry.interval = interval;
            entry.target = target;
            entry.callfun = callfun;
            entry.pause = pause;
            entry.isonce = once;
            entry.onepuse = false;
            return;
        }
        var tick = new TickEntry(tickname, stime, interval, target, callfun, pause, once, false);
        this.arrayCallFuns.push(tick);
        this.hasCallFuns[tickname] = tick;
    },
    //计时为0时执行，执行完，tick暂停
    insertWaitTick: function (tickname, delay, target, callfun, pause) {
        var pause = (pause == undefined || null ? false : pause);
        var stime = this.dttime + delay;
        var hasTick = this.containTickName(tickname);
        if (hasTick) {
            var entry = this.hasCallFuns[tickname];
            entry.stime = stime;
            entry.interval = 0;
            entry.target = target;
            entry.callfun = callfun;
            entry.pause = pause;
            entry.isonce = false;
            entry.onepuse = true;
            return;
        }
        var tick = new TickEntry(tickname, stime, 0, target, callfun, pause, false, true);
        this.arrayCallFuns.push(tick);
        this.hasCallFuns[tickname] = tick;
    },
    //给callfun添加一个前置判断，如果precall返回值为true，代表执行没处理逻辑，不减时间dt(honor/waitAutoTime)
    inserPreCallfun: function (tickname,preCallfun) {
        var hasTick = this.containTickName(tickname);
        if (!hasTick) {
            return;
        }
        var entry = this.hasCallFuns[tickname];
        entry.precall=preCallfun;
    },

    //更新时间，默认更新时间会强制恢复，如果更新了还需要暂停todo
    //once也可以更新，但如果已执行，则找不到
    updateTick: function (tickname, time) {
        var hasTick = this.containTickName(tickname);
        if (!hasTick) {
            return;
        }
        var entry = this.hasCallFuns[tickname];
        entry.stime = this.dttime + time;
        entry.pause = false;
    },
    //删除
    removeTickByName: function (tickname) {
        var entry = this.hasCallFuns[tickname];
        var arr = this.arrayCallFuns;
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === entry) {
                arr.splice(i, 1);
                break;
            }
        }
        delete this.hasCallFuns[tickname];
    },
    //暂停
    pauseTickByName: function (tickname) {
        var hasTick = this.containTickName(tickname);
        if (hasTick) {
            var entry = this.hasCallFuns[tickname];
            entry.pause = true;
        }
    },
    isTickPause:function(tickname){
        var hasTick = this.containTickName(tickname);
        if (hasTick) {
            var entry = this.hasCallFuns[tickname];
            return  entry.pause;
        }
        return true;
    },
    //恢复
    resumeTickByName: function (tickname) {
        var hasTick = this.containTickName(tickname);
        if (hasTick) {
            var entry = this.hasCallFuns[tickname];
            entry.pause = false;
        }
    },
    //清理所有
    clearAllTicks: function () {
        var arr = this.arrayCallFuns;
        for (var i = 0, l = arr.length; i < l; i++) {
            var entry = arr[i];
            var tickname = entry.tname;
            delete this.hasCallFuns[tickname];
        }
        this.arrayCallFuns = [];
    },
    //是否注册
    containTickName: function (tickname) {
        return (tickname in this.hasCallFuns);
    },

});