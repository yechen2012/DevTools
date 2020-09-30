var LanguageData = LanguageData || {};
//英式文本，用来给文本断句用
var DtLangZHType = false;
var languagedt = function () {
    this.ldata = {};
    //默认文本
    this.langtexts = {};
    //实际文本
    this.ctmlangtexts = {};
    //实际font style
    this.ctmlanggivens = {};
    //游戏font style
    this.langgivens = {};
    //帮助 style
    this.htmllanggivens = {};
    //设置过文本的节点数组，用于刷新
    this.langnodes = {};
    //富文本及html配置文本只有一份
    this.langStyleLoaded = false;

    //文本key对应表
    this.langrealkeys = {};

};

languagedt.prototype.loadDefaultLang = function () {
    if (!this.langStyleLoaded) {
        this.loadDefaultLangStyle();
    }
    if(typeof(LANG_REALKEY)!='undefined'){
        this.loadRealKeyMap();
    }
    if(typeof(COMMON_LANG_JSON)!='undefined'){
        var commonlang=COMMON_LANG_JSON['en'];
        this.setLanguage(commonlang);
    }
    if(typeof(LANG_JSON)!='undefined'){
        var enlang=LANG_JSON['en'];
        this.setLanguage(enlang);
        return;
    }
    if(typeof(LANG_RES)!='undefined'){
        this.setLanguage(LANG_RES);
    }
};
languagedt.prototype.loadRealKeyMap = function () {
    this.langrealkeys = cc.loader.getRes(LANG_REALKEY);
};
languagedt.prototype.loadDefaultLangStyle = function () {
    this.langStyleLoaded = true;
    if (typeof(COMMON_LANG_STYLE) != 'undefined') {
        var val = cc.loader.getRes(COMMON_LANG_STYLE);
        this._insertLoadData(this.langgivens, val);
    }

    if (typeof(LANG_STYLE) != 'undefined') {
        var val = cc.loader.getRes(LANG_STYLE);
        this._insertLoadData(this.langgivens, val);
    }

    if (typeof(LANG_HTMLSTYLE) != 'undefined') {
        this.htmllanggivens = cc.loader.getRes(LANG_HTMLSTYLE);
    }
    //todo
    //修改了默认配置，EUR默认locale为en，
    if (!this.currencyOpt) {
        var defaultsy = "EUR";
        var defaultlo = "en";

        this.currencyOpt = {currency: defaultsy,locale:defaultlo};
        // OSREC.CurrencyFormatter.checkIsInBuiltSy(defaultsy);
    }
};

/*
* 加载语言配置
* 注：1.支持加载服务器直接推送的配置文件，但需要直接传入已load的obj
*    2.支持增量加载本地配置的多个语言文件，传入文件路径,传入文本路径，仅common传入对于与game重合部分不会更改，
*    3.支持语言标识符号，如en,en_US
* @param value,
* @return none
* */
languagedt.prototype.setLanguage = function (value) {
    if (value == undefined) {
        console.log("LanguageData:loadLanguageJson value is undefined!");
        return;
    }

    if (typeof value == "object") {
        this.ctmlangtexts = value;
        return;
    }
    if (typeof value == "string") {
        if(value.indexOf('res/')==-1){
            var commonlan = this.getLangJsonRes(COMMON_LANG_JSON, value);
            var gamelan = this.getLangJsonRes(LANG_JSON, value);
            if (commonlan || gamelan) {
                if (commonlan != undefined) {
                    var loadcommon = cc.loader.getRes(commonlan);
                    this._insertLoadData(this.langtexts, loadcommon);
                }
                if (gamelan != undefined) {
                    var loadgame = cc.loader.getRes(gamelan);
                    this._insertLoadData(this.langtexts, loadgame);
                }
            }
            return;
        }
        //当作路径处理
        var loadlang = cc.loader.getRes(value);
        this._insertLoadData(this.langtexts, loadlang);
        return;
    }
};
languagedt.prototype.loadLanguageJson = function (value) {
    if (value == undefined) {
        console.log("LanguageData:loadLanguageJson value is undefined!");
        return;
    }
    if (typeof value == "object") {
        this.ctmlangtexts = value;
        return;
    }
};

/*
* 加载语言Style
* 注：1.支持加载服务器直接推送的配置文件，但需要直接传入已读取的obj
*    2.支持增量加载本地配置的多个语言文件，传入文件路径
* @param value
* @return none
* */
languagedt.prototype.loadLanguageStyle = function (value) {
    if (value == undefined) {
        console.log("LanguageData:loadLanguageStyle value is undefined!");
        return;
    }

    if (typeof value == "object") {
        this.ctmlanggivens = value;
    } else {
        console.log("load langJsonPath ", value);
        var loadVal = cc.loader.getRes(value);
        this._insertLoadData(this.langgivens, loadVal);
    }
};

languagedt.prototype.setMapValue = function (lkey, lvalue) {
    if ((typeof lkey) != 'string') {
        cc.log('lkey must be string');
        return;
    }
    this.ldata[lkey] = lvalue;
}
//! 增加判断是否存在某个文本的接口
languagedt.prototype.hasTextStr = function (textkey) {
    var value = this.ctmlangtexts[textkey] || this.langtexts[textkey];

    if(value == undefined)
        return false;

    return true;
}
languagedt.prototype.getTextRealKey = function (txtkey) {
    var value = this.langrealkeys[txtkey];
    if(value == undefined)
        return txtkey;
    var realvalue= this.ctmlangtexts[value] || this.langtexts[value];
    if(realvalue == undefined)
        return txtkey;
    return value;
}

//isgeneral=true是普通文本，里面有值需要保留，富文本格式删除
languagedt.prototype.getTextStr = function (txtkey, isgeneral) {
    var textkey=this.getTextRealKey(txtkey);
    var value = this.ctmlangtexts[textkey] || this.langtexts[textkey];
    if (value == undefined) {
        return textkey;
    }
    if (this._isRichorgiven(value)) {
        var style = this.ctmlanggivens[textkey] || this.langgivens[textkey];
        var newvalue = "";
        if (isgeneral) {
            newvalue = this._formatGeneralMsg(value, style);
        } else {
            newvalue = this._formatStringMsg(value, style);
        }
        return newvalue;
    }
    return value;
}
//单纯保存会导致保存很多重复对象（被销毁对象），还是需要外层多处理下
//三套画布，三套画布控件key相同,notrepeat=true
//界面多次初始化，导致节点多次初始,notrepeat=false
//不同节点对应同一key取值,suffix
//notrepeat默认为false
//没有清理操作，notrepeat及suffix只是为了辨识同一节点，多次出现，方便覆盖指向
// 里面应该有很多节点出现过一次，就保留了引用，js特性可能导致节点对象不会释放
languagedt.prototype.showTextStr = function (textkey, node, notrepeat, suffix) {
    if (node == undefined) {
        return;
    }
    var str = this.getTextStr(textkey);
    node.setString(str);
    var node_inId = 'rtpid';
    if (notrepeat) {
        node_inId = node.__instanceId;
    }
    if ((typeof suffix) == 'string') {
        node_inId = node_inId + suffix;
    }
    var nodekey = textkey + '&' + node_inId;
    this.langnodes[nodekey] = node;
}
languagedt.prototype.refreshShowedText = function () {
    for (var textkey in this.langnodes) {
        var node = this.langnodes[textkey];
        var tempindex = textkey.lastIndexOf('&');
        var namekey = textkey.substr(0, tempindex);
        if (node != undefined && namekey != "") {
            var str = this.getTextStr(namekey);
            node.setString(str);
        }
    }
}

/*
* 通过游戏配置的LANG_JSON和Config中的language配置获取对应语言的json配置
* @param langJson，游戏gameType.js中配置的LANG_JSON
* @param langTag, 平台config中的language tag
*
* @return 若配置存在，返回res；不存在返回undefined
* */
languagedt.prototype.getLangJsonRes = function(langJson, langTag) {
    var ret = undefined;

    if (langJson && langTag) {
        ret = langJson[langTag];

        if (!ret) {
            // 此处尝试进行朔源
            ret = this._searchLangSource(langJson, langTag);
        }

        if (!ret) {
            var lang = this.parseLanguageTag(langTag);
            ret = langJson[lang.language];
        }
    }

    return ret;
};

/*
* 解析语言标识tag。获得language和country
* 注意：若langTag解析失败会返回"en"&"US"
* @param langTag: string type
*
* @return Object{language: , country }
* */
languagedt.prototype.parseLanguageTag = function(langTag) {
    var ret = {
        language: "en",
        country: "US"
    };

    if (langTag) {
        var reg = ["_", "-", "-"];
        var result = undefined;
        var index = 0;
        while(index < reg.length) {
            if (langTag.match(reg[index])) {
                result = langTag.split(reg[index]);
                break;
            }

            ++index;
        }

        if (result && result.length > 1) {
            ret.language = result[0].toLowerCase();
            ret.country = result[1].toUpperCase();
        }
        else {
            ret.language = langTag;
            ret.country = "";
        }
    }

    return ret;
};

languagedt.prototype._searchLangSource = function(langJson, langTag) {
    var sourceDef = undefined;

    // TODO: 临时性放一个表试试，具体应该有个配置表
    // var sourceDef = {
    //     "zh_TW" : {
    //         root: "zh", // 根
    //         source : ["zh_HK", "zh-CN"] // 逐级源，优先级逐渐降低
    //     }
    // };

    var ret = undefined;
    if (sourceDef && langJson && langTag) {
        ret = langJson[langTag];

        if (!ret) {
            var def = sourceDef[langTag];
            if (def) {
                var lstSource = def.source;
                for (var i = 0; i < lstSource.length; ++i) {
                    ret = langJson[lstSource[i]];
                    if (ret)
                        break;
                }

                if (!ret && def.root) {
                    ret = langJson[def.root];
                }
            }
        }
    }

    return ret;
};

languagedt.prototype._insertLoadData = function (langTexts, loadData) {
    if (!langTexts || !loadData)
        return;

    var gamename_ = GAMETYPE_CURCODE + "_";
    var common_ = 'common_';

    for (var key in loadData) {
        var keyname = key;
        var keyvalue = loadData[key];
        if (keyname.indexOf(gamename_) != -1) {
            var commonkey = keyname.replace(gamename_, common_);
            var oldcommonvalue = langTexts[commonkey];
            if (oldcommonvalue != undefined) {
                langTexts[keyname] = keyvalue;
                langTexts[commonkey] = keyvalue;
                continue;
            }
        }

        if (keyname.indexOf(common_) != -1) {
            var gamekey = keyname.replace(common_, gamename_);
            var oldgamevalue = langTexts[gamekey];
            if (oldgamevalue != undefined) {
                langTexts[keyname] = oldgamevalue;
                continue;
            }
        }
        langTexts[keyname] = keyvalue;
    }
};

languagedt.prototype._isRichorgiven = function (msg) {
    var reg = /{[0-9]}/;
    if (reg.test(msg)) {
        return true;
    }
    return false;
}
languagedt.prototype._formatGeneralMsg = function (msg, tempary) {
    if (arguments.length <= 1 || tempary == undefined) {
        return msg;
    }
    var replaces = tempary.concat();
    var replacel = replaces.length;
    for (var i = 0; i < replacel; i++) {
        var text = replaces[i];
        var givenreg = /&(.+)&/;
        if (givenreg.test(text)) {
            var givenresult = givenreg.exec(text);
            var keystr = givenresult[1];
            var count = this.ldata[keystr];
            if (count == undefined) {
                count = 0;
            }
            count = count.toString();
            var newtext = count;
            replaces[i] = newtext;
        } else {
            replaces[i] = "";
        }
        msg = msg.replace(new RegExp("\\{" + i + "\\}", "g"), replaces[i])
    }
    return msg;
}
languagedt.prototype._formatStringMsg = function (msg, tempary) {
    if (arguments.length <= 1 || tempary == undefined) {
        return msg;
    }
    var replaces = tempary.concat();
    var replacel = replaces.length;
    for (var i = 0; i < replacel; i++) {
        var text = replaces[i];
        var givenreg = /&(.+)&/;
        if (givenreg.test(text)) {
            var givenresult = givenreg.exec(text);
            var oldstr = givenresult[0];
            var keystr = givenresult[1];
            var count = this.ldata[keystr];
            if (count == undefined) {
                count = 0;
            }
            count = count.toString();
            var newtext = text.replace(oldstr, count);
            replaces[i] = newtext;
        }
        msg = msg.replace(new RegExp("\\{" + i + "\\}", "g"), replaces[i])
    }
    return msg;
}
// 放入语言
languagedt.prototype.changeCurrencyLan = function (currencylocal,currencytype) {
    if (!this.currencyOpt)
        this.currencyOpt = {};

    if (currencytype != undefined) {
        this.currencyOpt.currency = currencytype;
        OSREC.CurrencyFormatter.checkIsInBuiltSy(currencytype);
    }
    if (currencylocal != undefined) {
        this.currencyOpt.locale = currencylocal;
        this.checkLangEnType(currencylocal);
    }
}
// 货币单位
languagedt.prototype.changeCurrency = function (currencytype, currencylocal) {
    if (!this.currencyOpt)
        this.currencyOpt = {};

    if (currencytype != undefined) {
        this.currencyOpt.currency = currencytype;
        OSREC.CurrencyFormatter.checkIsInBuiltSy(currencytype);
    }
    if (currencylocal != undefined) {
        this.currencyOpt.locale = currencylocal;
        this.checkLangEnType(currencylocal);
    }
}
//返回格式货币串
languagedt.prototype.formatMoney = function (number) {
    if (typeof(yggCurrencyFormatter) != 'undefined' && yggCurrencyFormatter.format) {
        var nnum = parseFloat(number);
        return yggCurrencyFormatter.format(nnum);
    }
    var reuslt = OSREC.CurrencyFormatter.format(number, this.currencyOpt);
    return reuslt;
}
languagedt.prototype.formatMoneyNoSym = function (number) {
    if (typeof(yggCurrencyFormatter) != 'undefined' && yggCurrencyFormatter.formatDecimal) {
        var nnum = parseFloat(number);
        return yggCurrencyFormatter.formatDecimal(nnum);
    }
    var reuslt = OSREC.CurrencyFormatter.formatWithNoSym(number, this.currencyOpt);
    return reuslt;
}
//返回自定义小数位货币串
languagedt.prototype.formatCustomMoney = function (number, precision) {
    if (typeof(yggCurrencyFormatter) != 'undefined' && yggCurrencyFormatter.formatWithCurrency) {
        var nnum = parseFloat(number);
        var withsym = yggCurrencyFormatter.formatWithCurrency(nnum,precision);
        return withsym;
    }

    var reuslt = OSREC.CurrencyFormatter.formatCustomMoney(number, this.currencyOpt, precision);
    return reuslt;
}
//返回自定义number字符串，precision小数点位数，thousand千位分隔符，decimal，小数点符号
//这里特殊注意，formatNumber用来处理代币相关的显示，其他数值使用fixedformatNumber
languagedt.prototype.formatNumber = function (number, tprecision, tthousand, tdecimal) {
    if (typeof(yggCurrencyFormatter) != 'undefined' && yggCurrencyFormatter.formatNumber) {
        var nnum = parseFloat(number);
        return yggCurrencyFormatter.formatNumber(nnum);
    }

    var reuslt = OSREC.CurrencyFormatter.formatNumber(number, tprecision, tthousand, tdecimal);
    return reuslt;
}
languagedt.prototype.fixedformatNumber = function (number, tprecision, tthousand, tdecimal) {
    var reuslt = OSREC.CurrencyFormatter.formatNumber(number, tprecision, tthousand, tdecimal);
    return reuslt;
}

//返回自定义number数值
languagedt.prototype.fixedNumberWithPre = function (number, precision) {
    var pre = precision == undefined ? 2 : precision;
    var result = (Math.round(Number(number) * Math.pow(10, pre)) / Math.pow(10, pre)).toFixed(pre);
    return result;
}
//年月日时分星期
languagedt.prototype.FormatTimeYMDHMW = function () {
    // var result=this.timeMoment.format('llll');
    // return result;
    return "";
}
//时分
languagedt.prototype.FormatTimeHM = function () {
    // var result=this.timeMoment.format('LT');
    // return result;
    return "";
}
//年月日
languagedt.prototype.FormatTimeYMD = function () {
    // var result=this.timeMoment.format('ll');
    // return result;
    return "";
}
languagedt.prototype.checkLangEnType = function (lang) {
    if(lang=='ja'||lang=='zh_hans'||lang=='zh_hant'){
        DtLangZHType=true;
    }
    DtLangZHType=false;
};
//换个js写法
var instance = new languagedt();
LanguageData.instance = instance;
LanguageData.languageForHtml = function () {
    var htmljson = {};
    var that = LanguageData.instance;
    for (var textkey in that.langtexts) {
        var textvalue = that.ctmlangtexts[textkey] || that.langtexts[textkey];
        if (that.htmllanggivens[textkey] != undefined && that._isRichorgiven(textvalue)) {
            textvalue = that._formatStringMsg(textvalue, that.htmllanggivens[textkey]);
        }
        htmljson[textkey] = textvalue;
    }
    //return JSON.stringify(htmljson);
    return htmljson;
}
