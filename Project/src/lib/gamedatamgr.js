var GameDataMgr = GameDataMgr || {};
var InFinityAutoNumber = 10000;
var gamedatamgr = function () {
    this.initConfig();
    this.initData();
    this.initMgr();
}
var gdmpro = gamedatamgr.prototype;
gdmpro.init = function (canvasMgr) {
    this._canvasMgr = canvasMgr;
}
// bcash undefined为默认没有现金显示，bseparator千位分隔符，默认fasle,decimalnums小数个数，默认0
// numberkey 为显示数值key，unitcash为服务器基本单位，数值还是带有单位，如_iBet单位是代币1，_iBalance单位为金额1，undefined默认为代币1
//bseparator
gdmpro.initConfig = function () {
    this.txtstyledata = {
        numWinAni: {numberkey: '_aniWin',nosym:true},
        numWin: {numberkey: '_iWin', bcash: true},
        numTotalWin: {numberkey: '_iTotalWin', unitcash: true, bcash: true},
        numAuto: {numberkey: '_iAutoNum'},
        numBalance: {numberkey: '_iBalance', unitcash: true, bcash: true, bseparator: true},
        numBet: {numberkey: '_iLines'},
        numTotalBet: {numberkey: '_iBet', bcash: true},
        textFreeTotalWin: {numberkey: '_iFreeTotalWin', unitcash: true, bcash: true},
        textFreeNum: {numberkey: '_iFreeNum'},
    };
    this.sliderNum = {defaultpre: 2};
}
//统一后，这里数据都是服务器给的数字(代币)
gdmpro.initData = function () {
    //! 逻辑相关默认数据
    this._bShowCash = true;                //! 当前是否显示现金
    this._iBet = 30;                        //! 下注的金额，代币固定显示30
    this._iLines = 30;                      //! 中奖的线数
    this._lstCoinValue = [1, 2, 5, 10, 20, 50, 100, 200, 300, 500, 1000];               //! 默认筹码列表
    this._lstCoinRate = 100;               //! 默认筹码代表金额比率
    this._iCurCoinIndex = 0;               //! 当前筹码的索引值
    this._iCurOrdCoinIndex = 0;           //! 上一次筹码的索引值
    this._hasInsertCoinValue = false;           //! 是否有插入特殊值，relex专用
    this._aniWin = 0;                          //! 动画中赢得金额

    this._iWin = 0;                          //! 赢得金额
    this._iTotalWin = 0;                    //! 累计赢得金额
    this._iBalance = -1;                     //! 用户结余金额

    this._iFreeTotalWin = 0;               //! 免費累计赢得金额


    this._iAutoNum = 0;                    //! 当前自动的次数
    this._bFreeGame = false;              //! 当前是否为免费
    this._iFreeNum = 0;                    //! 当前免费的次数
    this._bJustStart = false;            //! 当前是否为第一次进游戏

    this._bShowCoins = true;             //! 当前是否能转换货币显示方式
    //自动旋转相关设置
    this._AutoMinNum = 0;                //! 限制输的金额
    this._AutoMaxNum = 0;                //! 限制赢的金额
    this._iAutoStartMoney = 0;          //! 自动开始时的金额
    this._iAutoWin = 0;                 //! 自动单次赢得金额
    this._iAutoFinity = false;          //!自动无限次
}
gdmpro.initMgr = function () {
    this.timetick = new TimeTick();
    this.scrolldata = {};
    this.valuelisteners = {};
    this.attrilisteners = {};
}
gdmpro.deleteMgr = function () {
    this.timetick.clearAllTicks();
}
gdmpro.switchShowCash = function (showCash) {
    if (arguments.length == 0) {
        this._bShowCash = !this._bShowCash;
        return;
    }
    this._bShowCash = showCash;
}
gdmpro.refreshCrashNumber = function () {
    this.refreshText('numTotalBet', 'numTotalWin', 'numWin', 'numBalance', 'textFreeTotalWin');
}
gdmpro.setICurCoinIndex = function (number) {
    if (this._hasInsertCoinValue) {
        var curindex = this._iCurCoinIndex;
        var inservalue = this._lstCoinValue[curindex];
        this.removeValueInCoinList();
        this._iCurOrdCoinIndex = this._iCurCoinIndex;
        this._iCurCoinIndex = number;
        this.insertValueInCoinList(inservalue);
        return;
    }
    this._iCurOrdCoinIndex = this._iCurCoinIndex;
    this._iCurCoinIndex = number;
}
gdmpro.setTxtStyleData = function (key, objvalue) {
    if (this.txtstyledata[key] != undefined) {
        this.txtstyledata[key] = objvalue;
    }
}
gdmpro.setCoinValueList = function (lst) {
    if (this._hasInsertCoinValue) {
        var curindex = this._iCurCoinIndex;
        var inservalue = this._lstCoinValue[curindex];
        this._lstCoinValue = lst;
        this.insertValueInCoinList(inservalue);
        return;
    }

    this._lstCoinValue = lst;
}
gdmpro.setCoinValueRate = function (rate) {
    this._lstCoinRate = rate;
    this._checkAttriValue('_lstCoinRate');
}
gdmpro.setAniWin = function (number) {
    this._aniWin = number;
    this.refreshText('numWinAni');
}
gdmpro.setIWin = function (number) {
    this._iWin = number;
    this.refreshText('numWin');
}
gdmpro.setITotalWin = function (number) {
    this._iTotalWin = number;
    this.refreshText('numTotalWin');
}
gdmpro.insertValueInCoinList = function (value) {
    if (this._hasInsertCoinValue) {
        return;
    }
    this._hasInsertCoinValue = true;
    var curindex = this._iCurCoinIndex;
    this._lstCoinValue.splice(curindex, 0, value);
    this._checkAttriValue('_lstCoinValue');
}
gdmpro.removeValueInCoinList = function () {
    if (!this._hasInsertCoinValue) {
        return;
    }
    this._hasInsertCoinValue = false;
    var curindex = this._iCurCoinIndex;
    this._lstCoinValue.splice(curindex, 1);
    this._checkAttriValue('_lstCoinValue');
}


gdmpro.initIAutoNum = function (number, scale) {
    var ctrl = this._canvasMgr.getCtrl('numAuto');
    if (ctrl == undefined || ctrl.setString == undefined) {
        return;
    }
    if (number == InFinityAutoNumber) {
        this._iAutoFinity = true;
        ctrl.setScale(scale);
        this.refreshTextDirect('numAuto', '∞');
        return;
    }
    this._iAutoFinity = false;
    ctrl.setScale(1);
    this._iAutoNum = number;
    this.refreshText('numAuto');
}
//直接设置值，表示并不在无限模式
gdmpro.setIAutoNum = function (number) {
    this._iAutoFinity = false;
    this._iAutoNum = number;
    this.refreshText('numAuto');
}
gdmpro.setIFreeNum = function (number) {

    cc.log("GameDataMgr, setIFreeNum = ", number);

    this._iFreeNum = number;
    this.refreshText('textFreeNum');
}
gdmpro.setIFreeTotalWin = function (number) {
    this._iFreeTotalWin = number;
    this.refreshText('textFreeTotalWin');
}
gdmpro.setIAutoFinity = function (isfinity) {
    this._iAutoFinity = isfinity;
}
gdmpro.setNumberValue = function (name, value) {
    if (name === "_iFreeTotalWin") {
        cc.log(value);
    }

    this[name] = value;
}
gdmpro.getNumberValue = function (name) {
    var value = this[name];
    return value;
}
gdmpro.getIAutoFinity = function () {
    return this._iAutoFinity;
}
gdmpro.getCurCoinIndex = function () {
    return this._iCurCoinIndex;
}
gdmpro.getCoinValueSliderStr = function () {
    var defaultpre = this.sliderNum.defaultpre;
    var lst = this._lstCoinValue;
    var lstrate = this._lstCoinRate;
    var ratepre = lstrate.toString().length - 1;
    var lstCoinString = [];
    for (var ii = 0; ii < lst.length; ++ii) {
        var rate = lst[ii] / lstrate;
        var separray = rate.toString().split('.');
        var precount = separray.length > 1 ? separray[1].length : 0;
        precount = Math.min(ratepre, Math.max(precount, defaultpre))
        var fixednum = LanguageData.instance.fixedNumberWithPre(rate, precount);
        lstCoinString.push(fixednum);
    }
    return lstCoinString;
}
gdmpro.getCoinValueRate = function () {
    return this._lstCoinRate;
}

gdmpro.getCoinValueList = function () {
    return this._lstCoinValue;
}
gdmpro.reduceIAutoNum = function () {
    if (!this._iAutoFinity) {
        this._iAutoNum--;
    }
}
gdmpro.reduceIFreeNum = function () {
    this._iFreeNum--;
}
gdmpro.addBalanceNum = function (diff) {
    this._iBalance += diff;
}
gdmpro.getIAutoTotalWin = function () {
    var diff = this._iAutoStartMoney - this._iBalance;
    return diff;
}
gdmpro.getIBalance = function () {
    return this._iBalance;
}
gdmpro.getILine = function () {
    return this._iLines;
}
gdmpro.getIBet = function () {
    return this._iBet;
}
gdmpro.canBetting = function (bet) {
    if (this._iBalance >= bet) {
        return true;
    }
    return false;
}
gdmpro.canMaxBet = function () {
    if (this._iCurOrdCoinIndex == this._iCurCoinIndex && this._iCurOrdCoinIndex == this._lstCoinValue.length - 1)
        return false;
    return true;
}
gdmpro.maxBetOrOld = function () {
    if (this._iCurCoinIndex != this._lstCoinValue.length - 1) {
        this.setICurCoinIndex(this._lstCoinValue.length - 1);
    } else {
        this.setICurCoinIndex(this._iCurOrdCoinIndex);
    }
    return this._iCurCoinIndex;
}
gdmpro.setAutoStartMoney = function () {
    this._iAutoStartMoney = this._iBalance;
}
gdmpro.getTotalBet = function () {
    var coinvalue = this.getCoinValue();
    return coinvalue * this._iBet;

}
gdmpro.update = function (dt) {
    this.timetick.update(dt);
}
//部分可能只处理显示并不需格式，不想改变实际数值,调用这个方法
gdmpro.refreshTextDirect = function (name, strvalue) {
    var ctrl = this._canvasMgr.getCtrl(name);
    if (ctrl == undefined || ctrl.setString == undefined) {
        return;
    }
    ctrl.setString(strvalue);
}

//目前部分数值节点不适用，隐藏通过很多状态决定，并不单纯设置隐藏
gdmpro.nodeVisiableListener = function (nodename, keyvalue) {
    var name = nodename;
    var ctrl = this._canvasMgr.getCtrl(name);
    if (ctrl == undefined || ctrl.setVisible == undefined) {
        return;
    }
    var nodecss = this.txtstyledata[nodename];
    if (typeof nodecss === 'undefined') {
        return;
    }
    var visiablefun = function () {
        this.setVisible(false);
    }
    this.addNumberValueListener(nodecss.numberkey, keyvalue, ctrl, visiablefun);
}
gdmpro.removeNumberValueListener = function (keyname) {
    var listeners = this.valuelisteners[keyname];
    if (listeners != undefined) {
        this.valuelisteners[keyname] = undefined;
    }
}
//通过refreshText处理显示的数值节点指定值回调触发
gdmpro.addNumberValueListener = function (keyname, keyvalue, target, callfunc, firstvalue) {
    var listeners = this.valuelisteners[keyname];
    if (listeners == undefined) {
        this.valuelisteners[keyname] = [];
        listeners = this.valuelisteners[keyname];
    }
    var temp = {};
    temp.keyname = keyname;
    temp.keyvalue = keyvalue;
    temp.firstcall = false;
    temp.firstvalue = firstvalue;
    temp.target = target;
    temp.callfunc = callfunc;
    listeners.push(temp);
}
//属性值变动触发
gdmpro.addAttriValueListener = function (keyname, target, callfunc) {
    var listener = this.attrilisteners[keyname];
    if (listener != undefined) {
        listener.target = target;
        listener.callfunc = callfunc;
        return;
    }
    var temp = {};
    temp.keyname = keyname;
    temp.target = target;
    temp.callfunc = callfunc;
    this.attrilisteners[keyname] = temp;
}
//并没有处理所有属性的触发，按需todo
gdmpro._checkAttriValue = function (keyname) {
    if (this.attrilisteners == undefined) {
        return;
    }
    var listener = this.attrilisteners[keyname];
    if (listener != undefined) {
        var target = listener.target;
        var callfunc = listener.callfunc;
        callfunc.call(target);
    }
}
gdmpro.refreshText = function (names) {
    var length = arguments.length;
    if (length == 0) {
        return;
    }
    if (length > 1) {
        for (var index in arguments) {
            var nodename = arguments[index];
            this.refreshText(nodename);
        }
        return;
    }
    var name = names;
    var ctrl = this._canvasMgr.getCtrl(name);
    if (ctrl == undefined || ctrl.setString == undefined) {
        return;
    }
    var nodecss = this.txtstyledata[name];
    if (typeof nodecss === 'undefined') {
        console.log("nodecss must no undefined");
        return;
    }
    if (nodecss.bcash != undefined) {
        nodecss.bcash = this._bShowCash;
    }
    var number = this._nodeAttriNumber(name);
    var realnumber = this._getCoinOrCashNumber(number, nodecss.unitcash, nodecss.bcash, nodecss.decimalnums);

    var str = this._formatByConfig(realnumber, nodecss);
    ctrl.setString(str);
    this._checkNumberKeys(nodecss.numberkey, number);

}
gdmpro.getCoinValue = function () {
    if (this._iCurCoinIndex < 0 || this._iCurCoinIndex >= this._lstCoinValue.length) {
        return 1;
    }
    return this._lstCoinValue[this._iCurCoinIndex];
}

gdmpro.insertTickCallback = function (tickname, delay, interval, target, callfun, pause, once) {
    var pause = (pause == undefined || null ? false : pause);
    var once = (once == undefined || null ? true : once);
    this.timetick.insertTick(tickname, delay, interval, target, callfun, pause, once)
}
gdmpro.removeTickCallback = function (tickname) {
    this.timetick.removeTickByName(tickname);
}
gdmpro.addScrollAniBy = function (nodename, changevalue, scrolldata) {
    var oldvalue = this._nodeAttriNumber(nodename);
    var targetnum = this._hasScrollAniNow(nodename);
    if (targetnum != undefined) {
        oldvalue = targetnum;
    }
    var newvalue = oldvalue + changevalue;
    this.addScrollAni(nodename, newvalue, scrolldata);
}
//! 增加一个取当前值得接口
gdmpro.getRealNumber = function (nodename) {
    var oldvalue = this._nodeAttriNumber(nodename);
    var targetnum = this._hasScrollAniNow(nodename);
    if (targetnum != undefined) {
        oldvalue = targetnum;
    }
    return oldvalue;
}
//数字滚动,固定时间减少至固定值
//数字滚动datamgr处理，callfunc为处理关键数值节点回调，如需每次滚动回掉另外处理，todo
gdmpro.addScrollAni = function (nodename, targetnum, scrolldata) {
    var name = nodename;
    var ctrl = this._canvasMgr.getCtrl(name);
    if (ctrl == undefined || ctrl.setString == undefined) {
        return;
    }
    this._parseScrollData(name, targetnum, scrolldata);
}
gdmpro.endScrollAni = function (nodename) {
    var name = nodename;
    var data = this.scrolldata[name];
    if (data != undefined) {
        data.skiptoend = true;
    }
}
gdmpro._checkNumberKeys = function (numberkey, numbervalue) {
    var listeners = this.valuelisteners[numberkey];
    if (listeners == undefined) {
        return;
    }
    for (var lst in listeners) {
        var listener = listeners[lst];
        if(listener.target==undefined||listener.callfunc==undefined){
            continue;
        }
        if(listener.keyvalue==undefined){
            var target = listener.target;
            var callfunc = listener.callfunc;
            callfunc.call(target, numbervalue);
            continue;
        }
        if (numbervalue == listener.keyvalue) {
            listener.firstcall = false;
            var target = listener.target;
            var callfunc = listener.callfunc;
            callfunc.call(target, numbervalue);
            continue;
        }
        if (!listener.firstcall && listener.firstvalue) {
            listener.firstcall = true;
            var target = listener.target;
            var callfunc = listener.callfunc;
            callfunc.call(target, numbervalue);
            continue;
        }
    }
}
gdmpro._hasScrollAniNow = function (name) {
    var tempdata = this.scrolldata[name];
    if (tempdata != undefined) {
        var targetnum = tempdata.targetnum;
        return targetnum;
    }
    return undefined;

}
//syn是一对多，notsyn只能是一对一
//notsyn 处理相反显示
gdmpro._parseScrollData = function (name, targetnum, data) {
    var delay = 0;
    if (data.delay != undefined) {
        delay = data.delay;
    }

    var number = this._nodeAttriNumber(name);
    var temp = {};

    if (data.beforechgkey) {
        var lstKeyNum = [];
        for (var i = 0; i < data.lstkeynum.length; ++i) {
            lstKeyNum.push(data.lstkeynum[i]);
        }

        this._parseListKeyNum(targetnum, lstKeyNum);
        temp.lstkeynum = lstKeyNum;
    }
    else {
        temp.lstkeynum = data.lstkeynum;
    }

    temp.callfunc = data.callfunc;
    temp.percallfunc = data.percallfunc;
    temp.target = data.target;
    temp.speed = data.speed;
    temp.addspeed = data.addspeed;
    temp.syn = data.syn;
    temp.notsyn = data.notsyn;
    temp.time = data.time;
    if (targetnum == number) {
        console.log('_parseScrollData targetnum==number');
        return;
    }
    if (temp.time != undefined && temp.time != 0) {
        temp.speed = Math.abs((targetnum - number) / temp.time);
    }
    if (temp.notsyn != undefined) {
        var notsynnumber = this._nodeAttriNumber(temp.notsyn);
        temp.notsyntargetnum = notsynnumber + number;
    }
    temp.targetnum = targetnum;
    temp.addorRed = number > targetnum ? -1 : 1;
    temp.lstkeyindex = 0;
    this.scrolldata[name] = temp;
    this.timetick.insertTick(name, delay, 0, this, this._scrollTickCall, false, false)
}
gdmpro._scrollTickCall = function (dt, name) {
    var data = this.scrolldata[name];
    if (data == undefined) {
        return;
    }
    var number = this._nodeAttriNumber(name);
    var targetNum = data.targetnum;
    var lstkeynum = data.lstkeynum;
    var callfunc = data.callfunc;
    var percallfunc = data.percallfunc;
    var target = data.target;
    var addorRed = data.addorRed;
    var speed = data.speed;
    var addspeed = data.addspeed;
    var lstkeyindex = data.lstkeyindex;
    var syn = data.syn;
    var notsyn = data.notsyn;
    var notsynnumber = data.notsyntargetnum;
    var skipend = data.skiptoend;
    if (speed == undefined) {
        speed = 1;
    }
    if (addspeed == undefined) {
        addspeed = 0;
    }
    if (skipend) {
        number = targetNum;
    }
    speed += addspeed * dt;
    data.speed = speed;
    number = number + speed * dt * addorRed;

    if (percallfunc != undefined && target != undefined) {
        percallfunc.call(target);
    }
    var checkedIndex = this._checkScrollKeynum(addorRed, number, lstkeyindex, lstkeynum);
    var hasend = this._checkScrollEndnum(addorRed, number, targetNum);
    var hascheckedIndex = (hasend && checkedIndex == 0) ? lstkeyindex : checkedIndex;
    if (hascheckedIndex != 0 || hasend) {
        data.lstkeyindex = hascheckedIndex;
        if (hasend) {
            this._setNodeAttriNumber(name, targetNum);
            this.refreshText(name);
            this._checkSynNode(syn, targetNum);
            this._checkNotSynNode(notsyn, notsynnumber, targetNum);
            this._clearScrollData(name);
            this.timetick.removeTickByName(name);
            if (callfunc != undefined && target != undefined) {
                callfunc.call(target, hascheckedIndex, hasend, skipend);
            }
            return;
        }
        if (callfunc != undefined && target != undefined) {
            callfunc.call(target, hascheckedIndex, hasend, skipend);
        }
    }
    this._setNodeAttriNumber(name, number);
    this.refreshText(name);
    this._checkSynNode(syn, number);
    this._checkNotSynNode(notsyn, notsynnumber, number);
}

gdmpro._parseListKeyNum = function(targetNum, lstKeyNum) {
    if (!lstKeyNum || targetNum === undefined)
        return;

    var limit = 0;
    var chgVal = 0;
    for (var i = lstKeyNum.length - 1; i >= 0; --i) {
        if (targetNum >= lstKeyNum[i]) {

            if (i === 0) {
                limit = (lstKeyNum[i] - 0) * 0.3;
            }
            else {
                limit = (lstKeyNum[i] - lstKeyNum[i - 1]) * 0.3;
            }

            if (limit < 100) {
                // 如果限制过小，则采用差值的50%作为调整值
                limit = limit / 3 * 5;
            }

            if (targetNum - lstKeyNum[i] < limit) {
                chgVal = lstKeyNum[i] - (targetNum - limit);
                lstKeyNum[i] = targetNum - limit;
            }

            break;
        }
    }


    var str = "";
    for (var i = 0; i < lstKeyNum.length; ++i) {
        str += lstKeyNum[i] + ", ";
    }

    cc.log("_parseListKeyNum, lstKeyNum = ", str);
};

gdmpro._clearScrollData = function (name) {
    this.scrolldata[name] = undefined;
}
gdmpro._checkNotSynNode = function (notsyn, notsynnumber, newvalue) {
    if (notsyn == undefined || notsynnumber == undefined) {
        return;
    }
    var value = notsynnumber - newvalue;
    this._setNodeAttriNumber(notsyn, value);
    this.refreshText(notsyn);
}
gdmpro._checkSynNode = function (syns, newvalue) {
    if (syns == undefined) {
        return;
    }
    for (var index in syns) {
        var name = syns[index];
        this._setNodeAttriNumber(name, newvalue);
        this.refreshText(name);
    }
}
gdmpro._checkScrollEndnum = function (addorRed, curnumber, targetnum) {
    if ((addorRed > 0 && curnumber > targetnum) || (addorRed < 0 && curnumber < targetnum)) {
        return true;
    }
    return false;
}
gdmpro._checkScrollKeynum = function (addorRed, curnumber, keyindex, lstkeynum) {
    if (lstkeynum == undefined) {
        return 0;
    }
    var length = lstkeynum.length;
    for (var i = length - 1; i >= keyindex; i--) {
        var keynum = lstkeynum[i];
        if ((addorRed > 0 && curnumber > keynum) || (addorRed < 0 && curnumber < keynum)) {
            return i + 1;
        }
    }
    return 0;
}
gdmpro._nodeAttriNumber = function (nodename) {
    var nodecss = this.txtstyledata[nodename];
    if (typeof nodecss === 'undefined') {
        return 0;
    }
    var numberkey = nodecss.numberkey;
    if (typeof numberkey === 'undefined') {
        return 0;
    }
    var number = this[numberkey];
    if (number == undefined) {
        return 0;
    }
    return number;
}
gdmpro._setNodeAttriNumber = function (nodename, number) {
    var nodecss = this.txtstyledata[nodename];
    if (typeof nodecss === 'undefined') {
        return;
    }
    var numberkey = nodecss.numberkey;
    if (typeof numberkey === 'undefined') {
        return;
    }
    var oldnum = this[numberkey];
    if (oldnum == undefined) {
        return;
    }
    this[numberkey] = number;
}
// 根据显示需求处理
//显示代币，服务器值永远是getCoinValue=1时，具体显示需要处理
// 显示金额，服务器值永远是getCoinValue=1时，具体显示需要处理
gdmpro._getCoinOrCashNumber = function (number, unitcash, showcash, decimalnums) {
    var coinvalue = this.getCoinValue();
    var rate = this._lstCoinRate;
    if (unitcash && showcash) {
        var num = LanguageData.instance.fixedNumberWithPre(number / rate, decimalnums == undefined ? 2 : decimalnums);
        return num;
    }
    if (unitcash && !showcash) {
        var num = number / coinvalue;
        if (decimalnums > 0) {
            var result = LanguageData.instance.fixedNumberWithPre(num, decimalnums);
            return result;
        } else {
            return Math.floor(num);
        }
    }
    if (!unitcash && !showcash) {
        if (decimalnums > 0) {
            var result = LanguageData.instance.fixedNumberWithPre(number, decimalnums);
            return result;
        } else {
            return Math.floor(number);
        }
    }
    if (!unitcash && showcash) {
        var tempnum = number * coinvalue;
        var num = tempnum / rate;
        return num;
    }
    return number;
}
gdmpro._formatByConfig = function (number, tcfg) {
    var cfg = tcfg || {};
    var bcash = cfg.bcash || false;
    var nosym= cfg.nosym || false;
    var str = '';
    if (bcash) {
        if(nosym){
            str = LanguageData.instance.formatMoneyNoSym(number);
        }else{
            str = LanguageData.instance.formatMoney(number);
        }
        return str;
    }
    var bseparator = '';
    if (cfg.bseparator) {
        bseparator = ",";
    }
    var decimalnums = 0;
    if (cfg.decimalnums) {
        decimalnums = cfg.decimalnums;
    }
    str = LanguageData.instance.formatNumber(number, decimalnums, bseparator, '.');
    return str;
}
//强制返回带货币符号字符串
gdmpro.getCashStr = function (number) {
    var cashnumber = this._getCoinOrCashNumber(number, true, true);
    var cfg = {};
    cfg.bcash = true;
    var str = GameDataMgr.instance._formatByConfig(cashnumber, cfg);
    return str;
}
//返回Number字符串(根据_bShowCash转换值)
gdmpro.getCashStrByConfig = function (number) {
    var cfg = {};
    cfg.bcash = this._bShowCash;

    var cashnumber = this._getCoinOrCashNumber(number, true, cfg.bcash);
    var str = GameDataMgr.instance._formatByConfig(cashnumber, cfg);
    return str;
}
gdmpro.refreshCashWithNoPrecision = function (name,keynum) {
    var nodecss = this.txtstyledata[name];
    if (typeof nodecss === 'undefined') {
        return;
    }
    var keynumber=keynum==undefined?1000:keynum;
    if (nodecss.bcash != undefined) {
        nodecss.bcash = this._bShowCash;
    }
    var number = this._nodeAttriNumber(name);
    var realnumber = this._getCoinOrCashNumber(number, nodecss.unitcash, nodecss.bcash, 0);
    var str='';
    if(nodecss.bcash&&realnumber>keynumber){
        str=LanguageData.instance.formatCustomMoney(realnumber,0);
    }else{
        str = this._formatByConfig(realnumber, nodecss);
    }
    this.refreshTextDirect(name, str);

}
gdmpro._haskeyNode = function (nodename) {

}
GameDataMgr.instance = new gamedatamgr();
