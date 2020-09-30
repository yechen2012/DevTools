var GAMEAPI_ISAPI2;
var GAMEAPI_CONSTLINES = false;
var GAMEAPI_CONSTTIMES = false;
var login_success_time = "";
var cantouchersize = 200;

var RepeatedLoad = true;

var g_clienttype;
if (g_clienttype == undefined) {
    g_clienttype = 1;
}

var g_isguest;
if (g_isguest == undefined) {
    g_isguest = false;
}

var g_guestuname;
if (g_guestuname == undefined) {
    g_guestuname = '';
}

var g_isflblogin;
var g_flblogintoken;
if (g_isflblogin == undefined) {
    g_isflblogin = false;
}

if (g_isflblogin) {
    if (g_flblogintoken == undefined) {
        g_flblogintoken = 'vjs512m18u1bzx2ucxn4ovzdnm2pdfz7';
    }
}

//是否是公共native版本
var CommonType = false;
var CommonTypeList = [];

//是否需要显示直播
var isLive = false;
//isLive = true;

var g_pname;
if (g_pname == undefined) {
    g_pname = 'ptt';
    g_uname = 'ttt109';
    g_uname = randusername();
}

var g_servaddr;
if (g_servaddr == undefined) {
    //g_servaddr = 'ws://127.0.0.1:3710';//'ws://114.55.252.31:3712';//'ws://114.55.252.31:3716';//'ws://114.55.252.31:3712';//'ws://127.0.0.1:3710';//
    //g_servaddr = 'ws://192.168.193.17.:3710';//测试---赵本地
    //g_servaddr = 'ws://114.55.252.31:3720';//测试---外网
    //g_servaddr = 'ws://114.55.252.31:3712';//'ws://114.55.252.31:3716';//'ws://114.55.252.31:3712';//'ws://127.0.0.1:3710';//
    //g_servaddr = 'ws://210.66.177.29:3810';
    // g_servaddr = 'ws://47.90.12.179:3812';//试玩服
    //g_servaddr = 'ws://192.168.31.103:3710';//赵总内网
    //g_servaddr = 'ws://192.168.2.202:3710';//赵总内网
    //g_servaddr = 'wss://whss.dreamtech8.com';
}
var business;
var showbusiness;
if(business == undefined){

    // business = "NNTI_TESTS_G2E";
     business = "NNTI_TEST_TEST1"; //ZERO111 a123456
    // business = "NNTI_ITGO_OKBET";

    // business = "NNTI_SUN_E68Z";     // 乐虎  ejack168  admin_admin  能
    // business = "NNTI_SUN_ZBZ";       //能
    // business = "NNTI_SUN_QILEZ";        //不能
    // business = "NNTI_SUN_QY8Z";          //能
    // business = "NNTI_SUN_YOUFAZ";        //不能
    // business = "NNTI_SUN_LONG8Z";         //能
    // business = "NNTI_SUN_YAHUZ";             //能
    // business = "NNTI_SUN_YOULEZ";           //能

    //business = "NNTI_SUN_QILE";
    // business = "NNTI_SUN_YOULEZ";
    // business = "NNTI_SUN_WUSONGZ";
    //business = "NNTI_SUN_LDZ";
    //business = "NNTI_SUN_HUZ";

    // business = "NNTI_DT8_BD";   //testdt 123456
    //business = "NNTI_GSMC_BEV";
    //business = "NNTI_DT8_S666YL";
    //business = "NNTI_DCAI_LG";
    //business = "NNTI_AVIA_KLYL";
}
var isformal = false;
if(cc.sys.isNative){
    isformal = cc.director.isDisplayStats();
    var APPH5_BASEURL = "";
}
if(!isformal){
    //g_servaddr = "ws://serverapp.dreamtech8.info";
    //g_servaddr = "ws://47.90.12.179:3812";
    //g_servaddr = "ws://47.90.12.179:3816";
    // g_servaddr = 'ws://192.168.3.226:3720';
    //g_servaddr = "wss://server.dtgame-dtweb.com";

    //第一套
    // g_servaddr = "wss://server1.dreamtech8.info";
    //g2e
    // g_servaddr = "wss://server.dtgame-dtweb.com";
    //试玩
    g_servaddr = "ws://47.90.46.159:3720";
    // g_servaddr = "wss://whss.dreamtech8.com";

    //shuzhouhao
    // g_servaddr = "ws://192.168.2.254:3720";
    //g_servaddr = 'ws://127.0.0.1:3000';
    // g_servaddr = "wss://server1.dreamtech8.info";
    //g_servaddr = "ws://192.168.2.202:19000"
}else {
    g_servaddr = "ws://47.90.12.179:3812";
}

var SERVADDR;

if(!cc.sys.isNative && SERVADDR){
    g_servaddr = SERVADDR;
}

var APPH5_BASEURL;
if(APPH5_BASEURL == undefined){
    APPH5_BASEURL = "";
}

//安装包的版本号，每次更新安装包这个值需要修改
var nativever = "1812050";
//只更新文件的版本号，相当于native的md5，每次更新文件这个值需要修改
var scriptver = "1812130";

var g_mainurl;
if (g_mainurl == undefined) {
    g_mainurl = 'index.html';
}

var businessInfo = {};

var g_bkurl;
if (g_bkurl == undefined) {
    g_bkurl = '';
}

//6小游戏 5免费游戏
var g_spinstate;
if (g_spinstate == undefined) {
    g_spinstate = 0;

}


onerror = handleErr;

function handleErr (msg,url,l)
{
    //var txt = "";
    //txt="There was an error on this page.\n\n"


    //txt+="Error: " + msg + "\n"
    //txt+="URL: " + url + "\n"
    //txt+="Line: " + l + "\n\n"
    //txt+="Click OK to continue.\n\n"
    //
    //cc.log(txt);

    // if(g_clienttype != 0 && close_game) {
    //     close_game(true);
    // }
}

function randusername() {
    var result = "";
    for(var i=0;i<6;i++){
        var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
        //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
        //小写字母97--122
        //result.push(String.fromCharCode(65+ranNum));
        result = result + String.fromCharCode(97+ranNum);
    }
    cc.log(result);
    return result;
}

var gamelanguagelist = {};
var gamelistinfo = {
    //灌篮大师
    "sd" : ["205","slamdunk","灌篮大师","sd"],
    //赛亚烈战
    "dragonball" : ["110","dbz","赛亚烈战","dragonball"],
    //灌篮大师2
    "sd5" : ["124","slamdunk2","灌篮大师2","sd5"],
    //西游降妖
    "jtw" : ["117","jtw","西游降妖","jtw"],
    //白蛇传
    "whitesnake" : ["301","whitesnake","白蛇传","witesnake"],
    //赤壁之战
    "san" : ["111","san1","三国-赤壁之战","san"],
    //格斗之魂
    "kof" : ["123","kof","格斗之魂","kof"],
    //龙凤呈祥
    "dnp" : ["118","dnp","龙凤呈祥","dnp"],
    //海盗无双
    "onepiece" : ["125","onepiece","海盗无双","onepiece"],
    //鸣人
    "naruto" : ["126","naruto","NINJA","naruto"],
    //圣域传说
    "seiya" : ["203","saint","圣域传说","seiya"],
    //财神到
    "tgow" : ["113","tgow","财神到","tgow"],
    //武松传
    "watermargin" : ["114","heros108","武松传","watermargin"],
    //新年到
    "newyear" : ["115","newyear","新年到","newyear"],
    //封神榜
    "tlod" : ["116","tlod","封神榜","tlod"],
    //足球
    "football" : ["121","football","足球","football"],
    //3D老虎机
    "casino" : ["122","casino","3D老虎机","casino"],
    //四圣兽
    "fourss" : ["302","fourss","四圣兽","fourss"],
    //摇滚之夜
    "rocknight" : ["120","rocknight","摇滚之夜","rocknight"],
    //福禄寿
    "fls" : ["119","fls","福禄寿","fls"],
    //英雄荣耀
    "crystal" : ["501","crystal","英雄荣耀","crystal"],
    //抉择
    "flopgame" : ["","","NINJA","flopgame"],
    //疯狂马戏团
    "circus" : ["406","circus","疯狂马戏团","circus"],
    //深蓝海域
    "bluesea" : ["408","bluesea","深蓝海域","bluesea"],
    //四驱英雄
    "dash" : ["401","fwbro","四驱英雄","dash"],
    //比基尼
    "bikini" : ["402","bikini","比基尼","bikini"],
    //圣战骑士
    "crusader" : ["409","crusader","圣战骑士","crusader"],
    //十字路口
    "crossing" : ["411","crossing","十字路口","crossing"],
    //嘻哈侠
    "hiphopman" : ["410","hiphopman","嘻哈侠","hiphopman"],
    //幕府风云
    "shogun" : ["404","shogun","幕府风云","shogun"],
    //海盗宝藏
    "piratetreasure" : ["407","piratetreasure","海盗宝藏","piratetreasure"],
    //4美
    "fourbeauty" : ["412","fourbeauty","4美","fourbeauty"],
    //圣诞
    "merryxmas" : ["423","christmas","圣诞","merryxmas"],
    //糖果
    "sweethouse" : ["416","sweethouse","糖果","sweethouse"],
    //吸血鬼
    "vampire" : ["419","vampire","吸血鬼","vampire"],
    //川剧
    "opera" : ["413","opera","川剧","opera"],
    //僵尸
    "zombie" : ["415","zombie","僵尸","zombie"],
    //雷神
    "wrathofthor" : ["422","wrathofthor","雷神","wrathofthor"],
    //侦探
    "perfectdet" : ["418","detective","全能侦探","perfectdet"],
    //满堂红
    "bigred" : ["430","bigred","满堂红","bigred"],
    //热血街头
    "guhuozai" : ["403","bloodstreet","热血街头","guhuozai"],
    //铁拳擂台
    "boxingarena" : ["429","boxingarena","铁拳擂台","boxingarena"],
    //埃及帝国
    "egyptian" : ["434","egyptian","埃及帝国","egyptian"],
    //精灵王国
    "fantasyforest" : ["426","fantasyforest","精灵王国","fantasyforest"],
    //盖茨比
    "greatgatsby" : ["427","gatsby","满堂红","greatgatsby"],
    //萌宠小窝
    "pethouse" : ["420","pethouse","萌宠小窝","pethouse"],
    //火锅
    "hotpotfeast" : ["424","hotpotfeast","火锅","hotpotfeast"],
    //魔术师
    "magician" : ["","magician","魔术师","magician"],
    //逍遥骑士
    "easyrider" : ["","easyrider","逍遥骑士","easyrider"],
    //银河战争
    "galaxywars" : ["","galaxywars","银河战争","galaxywars"],
    //深夜食堂
    "shokudo" : ["","nightcanteen","深夜食堂","shokudo"],
    //法国
    "france" : ["","france","法国","france"],
    //火车
    "train" : ["","train","火车","train"],
    //阿拉丁愿望
    "genie" : ["","genie","阿拉丁愿望","genie"],
    //小小大花园
    "garden" : ["","garden","小小大花园","garden"],
    //丛林探险
    "jungle" : ["","jungle","丛林探险","jungle"],
    //仙侠情缘
    "lovefighters" : ["","lovefighters","仙侠情缘","lovefighters"],
    //荣耀风云
    "legendary" : ["","legendarytales","荣耀风云","legendary"],
    //古潼京
    "tombshadow" : ["","tombshadow","古潼京","tombshadow"],
    //疯狂炼金师
    "alchemist" : ["","alchemist","疯狂炼金师","alchemist"],
    //3D娃娃机
    "dollmachine" : ["","dollmachine","3D娃娃机","dollmachine"],
    //乱斗三国
    "clash" : ["","clash","乱斗三国","clash"],
}

var businessconfig = {
    "NNTI_SUN_LONG8Z" : "L",
    "NNTI_SUN_YOUFAZ" : "B",
    "NNTI_SUN_ZBZ" : "ZB",
    "NNTI_SUN_E68Z" : "E",
    "NNTI_SUN_MZCZ" : "D",
    "NNTI_SUN_WUSONGZ" : "W",
    "NNTI_SUN_QY8Z" : "Q",
    "NNTI_SUN_HUZ" : "T",
    "NNTI_SUN_QILEZ" : "C",
    "NNTI_SUN_YAHUZ" : "G",
    "NNTI_SUN_LDZ" : "K",
    "NNTI_SUN_YOULEZ" : "A",
}

function isgameinlanguage(name){
    for(var i in gamelanguagelist){
        if(gamelistinfo[name] && gamelistinfo[name][1] == gamelanguagelist[i]){
            return true;
        }
    }
    return false;
}

function testgamelistinfo(){
    var _gamelistinfo = {};
    var index = 0;
    for(var i in gamelistinfo){
        index++;
        if(index > 3){
            index = 0;
            gamelistinfo = [];
            gamelistinfo = _gamelistinfo;
            return;
        }
        _gamelistinfo[i] = gamelistinfo[i];
    }
}

//testgamelistinfo();

function isgameeixt(name) {
    var b = false;
    for(var i in gamelistinfo){
        if(i == name){
            var b_language_game = isgameinlanguage(name);
            b = b_language_game;
            return b;
        }
    }
    //b = isgameinlanguage(name);
    return b;
}

function isgameeixtforbill(name) {
    var b = false;
    for(var i in gamelistinfo){
        if(i == name){
            b = true;
            return b;
        }
    }
    //b = isgameinlanguage(name);
    return b;
}

var viewlist = {
    //
    "hallview" : [0,0,0],
    //普通厅，贵宾厅，pageview
    "gameview" : [0,0,0],
    //普通厅，贵宾厅，pageview
    "machineview" : [0,0,0],
    //我的游戏，我的机台
    "loveview" : [0,0,0],
    //争霸赛
    "fightview" : [0,0,0],
}
var orderlist = [];
var viewlist1 = {
    //
    "hallview" : [0,0,0],
    //普通厅，贵宾厅，超级争霸赛，pageview
    "gameview" : [0,0,0,0],
    //普通厅，贵宾厅，pageview
    "machineview" : [0,0,0],
    //我的游戏，我的机台
    "loveview" : [0,1,0]
}
var orderlist1 = ["hallview","loverview"];
var viewlist2 = {
    //
    "hallview" : [0,0,0],
    //普通厅，贵宾厅，pageview
    "gameview" : [0,1,0],
    //普通厅，贵宾厅，pageview
    "machineview" : [0,0,0],
    //我的游戏，我的机台
    "loveview" : [0,1,0]
}
var orderlist2 = ["hallview","gameview","loverview"];

function sortNumber(a,b)
{
    return a - b
}

if(cc.sys.isNative){
    var HallReleaseUrl = "";
}

var HallData = {
    _gameData:null,
    _versionData: null,

    initGameData: function () {
        this._gameData = {};
        var localStorage = cc.sys.localStorage;
        var data = localStorage.getItem("GameData");
        if(data)
            this._gameData = JSON.parse(data);
        //this._initVersionJson();
    },

    _savaData : function(){
        cc.sys.localStorage.setItem("GameData", JSON.stringify(this._gameData));
    },

    setGameData : function (id, model, name) {
        this._gameData[id] = this._gameData[id] || {};
        this._gameData[id][name] = model;
        this._savaData();
    },

    getGameData : function(id, name){
        if (this._gameData[id] == null || this._gameData[id][name] == null) {
            return false;
        }
        return this._gameData[id][name];
    },

    _initVersionJson: function () {
        this._versionData = {};
        var that = this;
        cc.loader.loadJson("res/local_version.json", function (err, data) {
            if(data)
                cc.log("本地jsonversion-->",data);
            else
                cc.log("获取本地version数据失败");
            for (var k in data) {
                that._versionData[k] = data[k];
            }
        });
        HallData.setGameData("sd",1,"isdownload");
        HallData.setGameData("dragonball",1,"isdownload");
        HallData.setVersionData("sd", "1.0.1");
        HallData.setVersionData("dragonball", "1.0.1");
        HallData.setVersionData("hall", "1.0.1");
    },

    setVersionData: function (gamecode, version) {
        this._versionData[gamecode] = version;
        if(cc.sys.isNative){
            jsb.fileUtils.writeStringToFile(JSON.stringify(this._versionData), "res/local_version.json");
        }
    },

    getVersionData: function (gamecode) {
        if (gamecode != null)
            return this._versionData[gamecode];
        else
            return this._versionData;
    },


}

HallData.initGameData();

function refurbish_main()
{
    if(cc.sys.isNative){
        // if(MainClient.singleton.wscstate == WSClientState.CONNECTED){
        //     GameMgr.singleton.onReconnnect();
        // }else {
            // ToLogin();
            // MainClient.singleton.forceClose();
            close_game_hall();
            cc.game.restart();
            return;
        //}
    }else {
        window.location.href = g_mainurl;
    }
}

function foripad(under_layer) {
    var _size = cc.view.getFrameSize();
    var _conSize = cc.winSize;
    var layer = new cc.Node();
    //layer.setColor(cc.color(53, 55, 123, 255));
    var ratio = _size.width/_size.height;
    if(ratio < 1.5 && ratio >1.1&& cc.sys.isNative){

        var Pos_deviation = 0;
        if(cc.sys.os == cc.sys.OS_ANDROID){
            Pos_deviation = 120;//_size.height*0.125;
        }
        if(cc.sys.os == cc.sys.OS_IOS){
            Pos_deviation = 120;//_size.height*0.125;
        }
        if(cc.sys.os == cc.sys.OS_WINDOWS){
            Pos_deviation = 120;//_size.height*0.125;
        }

        layer.setPosition(0,0 + Pos_deviation);
        under_layer.setPosition(under_layer.x, under_layer.y + Pos_deviation);


        var black_frame = new ccui.ImageView();
        black_frame.loadTexture("h_kuang.jpg",1);
        black_frame.setAnchorPoint(cc.p(0,0));
        black_frame.setScale9Enabled(true);
        black_frame.setScale(1300/50,120/40);
        black_frame.setPosition(-10,718);
        layer.addChild(black_frame);

        var sp = new cc.Sprite();
        //cc.log("setSpriteFrame---pad_line.png   1");
        sp.setSpriteFrame("pad_line.png");
        sp.setPosition(sp.width/2,718);
        //sp.setLocalZOrder(layer.getLocalZOrder() - 1);
        layer.addChild(sp);
        var sp1 = new cc.Sprite();
        //cc.log("setSpriteFrame---pad_line.png    2");
        sp1.setSpriteFrame("pad_line.png");
        sp1.setPosition(sp1.width/2*3,718);
        sp1.setFlipX ? sp1.setFlipX(true) : sp1.setFlippedX(true)
        //sp1.setLocalZOrder(layer.getLocalZOrder() - 1);
        layer.addChild(sp1);

        //cc.spriteFrameCache.addSpriteFrames(reshall.gamehall_gameiconpng_plist);
        var black_frame1 = new ccui.ImageView();
        black_frame1.loadTexture("h_kuang.jpg",1);
        black_frame1.setAnchorPoint(cc.p(0,0));
        black_frame1.setScale9Enabled(true);
        black_frame1.setScale(1300/50,120/50);
        black_frame1.setPosition(-10,-120);
        layer.addChild(black_frame1);

        var sp2 = new cc.Sprite();
        //cc.log("setSpriteFrame---pad_line.png    3");
        sp2.setSpriteFrame("pad_line.png");
        sp2.setPosition(sp2.width/2,0);
        //sp2.setLocalZOrder(layer.getLocalZOrder() - 1);
        layer.addChild(sp2);

        var sp3 = new cc.Sprite();
        //cc.log("setSpriteFrame---pad_line.png    4");
        sp3.setSpriteFrame("pad_line.png");
        sp3.setPosition(sp3.width/2*3, 0);
        sp3.setFlipX ? sp3.setFlipX(true) : sp3.setFlippedX(true)
        //sp3.setLocalZOrder(layer.getLocalZOrder() - 1);
        layer.addChild(sp3);

        cc.director.getRunningScene().addChild(layer,998);
    }
    if(cc.director.getRunningScene().getChildByName("toucher")){
        return;
    }
    // if(ToucherLayer.singleton){
    //     ToucherLayer.singleton.removeFromParent(false);
    //     ToucherLayer.singleton = null;
    // }
    ToucherLayer.singleton = new ToucherLayer();
    ToucherLayer.singleton.setName("toucher");
    cc.director.getRunningScene().addChild(ToucherLayer.singleton,999);
}

function showtxt(node,str) {
    var size = cc.view.getDesignResolutionSize();
    var _mText = cc.LabelTTF.create("", "Arial", 22, undefined, cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
    cc.director.getRunningScene().addChild(_mText,998);
    _mText.setColor(cc.color(255, 255, 0, 255));
    _mText.setString(str);
    _mText.setPosition(cc.p(size.width/2, size.height/2 + 200));
    _mText.runAction(cc.sequence(cc.fadeTo(2, 0), cc.callFunc(function () {
        _mText.removeFromParent(true);
    }, node)));
}

function getTimeBySecond(sec) {
    var h = parseInt(sec/3600);
    var m = parseInt((sec - h*3600)/60);
    var s = (sec - h*3600)%60;
    var str = "";
    if(h<=0) h = "00";
    else if(h<=9) h = "0" + h;
    if(m<=0) m = "00";
    else if(m<=9) m = "0" + m;
    if(s<=0) s = "00";
    else if(s<=9) s = "0" + s;
    str = h + ":" + m + ":" + s;

    return str;
}

function   formatDate(now)   {
    var   year=now.getYear();
    var   month=now.getMonth()+1;
    var   date=now.getDate();
    var   hour=now.getHours();
    var   minute=now.getMinutes();
    var   second=now.getSeconds();
    return   year+"-"+month+"-"+date+"   "+hour+":"+minute+":"+second;
}

function NumberToNumber(num) {
    if(num < 0)
        num = -num;
    var _num = num;
    if(_num >= 10000 && _num < 10000000){
        _num = _num/1000;// + "K";
        if(_num < 10){
            //小于10要显示3位小数
            _num = _num.toFixed(3) + "K";
        }else if(_num >=10 && _num < 100){
            //大于等于10且小于100要显示2位小数
            _num = _num.toFixed(2) + "K";
        }else if(_num >=100 && _num < 1000){
            //大于等于100且小于1000要显示3位小数
            _num = _num.toFixed(1) + "K";
        }else if(_num >=1000){
            //大于1000不显示小数
            _num = parseInt(_num) + "K"
        }
    }else if (_num >= 10000000){
        _num = _num/10000;
        //除以10000之后最小也是1000以上了
        _num = parseInt(_num) + "M";
    }else {
        _num = _num.toFixed(2);
    }
    // else if(_num >= 1000000000){
    //     _num = _num/10000;
    //     //除以10000之后最小也是100000以上了
    //     //47792000
    //     _num = _num;
    // }
    return _num;
    if(_num >= 0 && _num < 999.99){
        _num = _num;
    }else if(_num >= 999.99 && _num < 10000000){
        _num = _num/1000;
        _num = _num.toFixed(2);
        if(_num>99){
            _num = parseInt(_num);
        }
        _num =  _num + "K";
    }else if(_num >= 10000000 && _num < 100000000){
        _num = _num/10000;
        _num = parseInt(_num) + "M";
    }else if(_num >= 100000000 && _num < 100000000000){
        _num = _num/100000000;
        _num = _num.toFixed(2);
        if(_num >= 99){
            _num = parseInt(_num);
        }
        _num = _num + "B";
    }else {
        _num = _num/100000000000;
        if(_num>99){
            _num = 99;
        }
        _num = "＞" + parseInt(_num) + "KB";
    }
    return _num;
}

//总和，最大个数
function getround(allsum,maxcount) {

    var arr = [];
    while(allsum>0 && maxcount>0){
        var r = Math.round(Math.random()*allsum*0.1);
        allsum -= r;
        arr.push(r);
        --maxcount;
    }
    if(allsum>0)
        arr.push(allsum);
    return arr;

}

function randomSort(a, b) {
    return Math.random() > 0.5 ? -1 : 1;
}
var noticelayer = null;
var ClearNotice = function(){

    CommonNoticeMgr.clearcommonnotice();
    if(!noticelayer) return;
    cc.log("this is a test!!!!!$$$4");
    DataSys.DataSysNoticeArr = [];
    noticelayer.notice_act_running = false;
    if(noticelayer.notice_act_interval){
        clearInterval(noticelayer.notice_act_interval);
        noticelayer.notice_act_interval = null;
    }
    if(noticelayer.noticetime) {
        clearInterval(noticelayer.noticetime);
        noticelayer.noticetime = null;
    }
    noticelayer.notice.setVisible(false);


    //noticelayer.removeFromParent(false);
    //cc.director.getRunningScene().removeChild(noticelayer);
    //noticelayer.release();
    //noticelayer = null;
}
var tempRichX = 100000;
var Hall_GameByNotice = function () {
    if(noticelayer){
        if(noticelayer.richText)
            tempRichX = noticelayer.richText.x;
        if(noticelayer.noticetime) {
            clearInterval(noticelayer.noticetime);
            noticelayer.noticetime = null;
        }
        if(noticelayer.richText){
            noticelayer.richText.stopAllActions();
            noticelayer.richText.removeFromParent(true);
            noticelayer.richText = null;
        }
        if(noticelayer.btn){
            noticelayer.btn.stopAllActions();
            noticelayer.btn.removeFromParent(true);
            noticelayer.btn = null;
        }
        noticelayer.removeFromParent(false);
    }
    CommonNoticeMgr.clearcommonnotice();
}

var AddNotice = function () {
    if(!noticelayer){
        GetNoticeLayer();
    }
    if(cc.director.getRunningScene().getChildByName("notice")){
        return;
    }
    else {
        if(GameMgr.singleton.halllayer){
            cc.log("0915测试显示通知");
            noticelayer._setPosition(22,1);
            noticelayer.startNoticeTimer();
            noticelayer.setName("notice");
            foripad(noticelayer);
            cc.director.getRunningScene().addChild(noticelayer,996);
        }else {
            cc.log("不在大厅界面收到通知消息不显示");
        }
    }
}

var RemoveNotice = function () {
    if(cc.director.getRunningScene().getChildByName("notice")){
        if(noticelayer && noticelayer.noticetime){
            clearInterval(noticelayer.noticetime);
            noticelayer.noticetime = null;
            if(noticelayer.richText){
                noticelayer.richText.stopAllActions();
                noticelayer.richText.removeFromParent(true);
                noticelayer.richText = null;
            }
            if(noticelayer.btn){
                noticelayer.btn.stopAllActions();
                noticelayer.btn.removeFromParent(true);
                noticelayer.btn = null;
            }
        }
        cc.director.getRunningScene().removeChild(noticelayer);
        noticelayer = null;
    }
}

var HideLayerByChangeScene = function () {
    ccs.armatureDataManager.clear();
    Hall_GameByNotice();
    if(halltitle){
        halltitle.removeFromParent(true);
        halltitle.release();
        halltitle = null;
    }
    if(GameMgr.singleton.halllayer && GameMgr.singleton.halllayer.my_lover_node){
        GameMgr.singleton.halllayer.my_lover_node.removeFromParent(false);
        GameMgr.singleton.halllayer.my_lover_node = null;
        CurHallScene = null;
    }
    if (GameMgr.singleton.halllayer){
        if(this.setting_layer){
            this.setting_layer.setVisible(false);
            this.setting_layer.removeFromParent(true);
            this.setting_layer = null;
        }
        //GameMgr.singleton.halllayer.removeFromParent(true);
        //GameMgr.singleton.halllayer = undefined;
    }
    if(GameMgr.singleton.halllayer){
        GameMgr.singleton.halllayer.removeFromParent(false);
        GameMgr.singleton.halllayer = null;
        CurHallScene = null;
    }
}

function playtoucherframe(layer,pos){
    var toucherframe = ccs.load(resloadlayer.toucherframe_json);
    toucherframe.node.runAction(toucherframe.action);
    toucherframe.action.play("animation0", false);
    toucherframe.action.setLastFrameCallFunc(function () {
        toucherframe.action.clearLastFrameCallFunc();
        toucherframe.node && toucherframe.node.removeFromParent(false);
    });
    toucherframe.node.setPosition(pos.x,pos.y);
    ToucherLayer.singleton.addChild(toucherframe.node);
}

var iscantouchSwallow = false;

var ToucherLayer = cc.LayerColor.extend({
    _opacity: 0,
    ismove: false,
    ctor: function() {
        this._super();
        var _size = cc.view.getFrameSize();
        this.setOpacity(this._opacity);
        this.setContentSize(_size);
        this._initTouchListener();
    },
    _initTouchListener : function()
    {
        var that = this;
        Toucher_listener = cc.EventListener.create(
            {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: iscantouchSwallow,
                onTouchBegan: function (touch, event)
                {
                    var pos = touch.getLocation();
                    //var pos = touch["_point"];
                    cc.log("170927----x",pos.x);
                    cc.log("170927----y",pos.y);
                    playtoucherframe(that,pos);
                    return true;
                },

                onTouchEnded: function (touch, event)
                {
                    Toucher_listener.swallowTouches = iscantouchSwallow;
                    Toucher_listener.setSwallowTouches(iscantouchSwallow);
                    if(that.visible == false) return false;
                },
            })
        cc.eventManager.addListener(Toucher_listener, this);
        //this.listener = Toucher_listener;
    },

    setSwallow : function (b) {
        iscantouchSwallow = b;
        Toucher_listener.swallowTouches = b;
        Toucher_listener.setSwallowTouches(iscantouchSwallow);
    },
    onExit : function () {
        if(this.listener){
            cc.eventManager.removeListener(this.listener);
            this.listener = null;
        }
        cc.log("onExit退出测试ToucherLayer");
        //this.removeFromParent(false);
        this._super();
    }

})
ToucherLayer.singleton = null;
var Toucher_listener = null;

function hall_common_notice(wight,str) {
    var that = this;
    var framelayer = new MaskLayer();
    framelayer.setOpacity(100);
    foripad(framelayer);
    cc.director.getRunningScene().addChild(framelayer,998);
    var choiselayer = ccs.load(resloadlayer.Loadlayer_in_game_notice_json).node;
    var notice_str_1 = findChildByName(choiselayer, "notice_str_1");
    var notice_str_2 = findChildByName(choiselayer, "notice_str_2");
    var enterbtn = findChildByName(choiselayer,"enterbtn");
    var lookonbtn = findChildByName(choiselayer,"lookonbtn");
    notice_str_2.setVisible(false);
    enterbtn.setVisible(false);
    lookonbtn.setVisible(false);
    notice_str_1.setFontSize(18);
    notice_str_1.setString(str);

    framelayer.addChild(choiselayer);

    var confirmbtn = new ccui.Button();
    confirmbtn.setTouchEnabled(true);
    confirmbtn.loadTextures("notice_frame_queding1.png","notice_frame_queding2.png","notice_frame_queding2.png",ccui.Widget.PLIST_TEXTURE);
    confirmbtn.setPosition(enterbtn.x + enterbtn.width/2,enterbtn.y);
    choiselayer.addChild(confirmbtn);
    confirmbtn.addTouchEventListener(function (senter, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;
        if(framelayer){
            framelayer.removeFromParent(false);
            framelayer = null;
        }

    } ,this);
}