/**
 * Created by ssscomic on 2016/5/24.
 */

var GAMETYPE_SLAMDUNK           =   1;
var GAMETYPE_KOF                 =   2;
var GAMETYPE_SLAMDUNK2          =   3;
var GAMETYPE_NARUTO             =   4;
var GAMETYPE_ONEPIECE           =   5;
var GAMETYPE_DBZ                 =   6;
var GAMETYPE_SAN1                =   7;
var GAMETYPE_FARM                =   8;
var GAMETYPE_SAINT               =   9;
var GAMETYPE_TGOW                =   10;
var GAMETYPE_HEROS108           =   11;
var GAMETYPE_NEWYEAR            =   12;
var GAMETYPE_TLOD                =   13;
var GAMETYPE_JTW                 =   14;
var GAMETYPE_WHITESNAKE         =   15;
var GAMETYPE_DNP                 =   16;
var GAMETYPE_CRYSTAL            =   17;
var GAMETYPE_FLS                 =   18;
var GAMETYPE_FOURSS             =   19;
var GAMETYPE_CASINO             =   20;
var GAMETYPE_MIR                 =   21;
var GAMETYPE_FOOTBALL           =   22;
var GAMETYPE_ROCKNIGHT          =   23;
var GAMETYPE_FWBRO              =   24;
var GAMETYPE_BLUESEA            =   25;
var GAMETYPE_CIRCUS             =   26;
var GAMETYPE_BIKINI             =   27;
var GAMETYPE_CRUSADER           =   28;
var GAMETYPE_CROSSING           =   29;
var GAMETYPE_HIPHOPMAN          =   30;
var GAMETYPE_PIRATETREASURE    =   31;
var GAMETYPE_SHOGUN              =   32;
var GAMETYPE_FOURBEAUTY         =   33;
var GAMETYPE_CHRISTMAS          =   34;
var GAMETYPE_SWEETHOUSE         =   35;
var GAMETYPE_ROYALSLOTS         =   36;
var GAMETYPE_VAMPIRE             =   37;
var GAMETYPE_OPERA               =   38;
var GAMETYPE_ZOMBIE              =   39;
var GAMETYPE_WRATHOFTHOR        =   40;
var GAMETYPE_DETECTIVE           =   41;
var GAMETYPE_PETHOUSE            =   42;
var GAMETYPE_GUHUOZAI            =   43;
var GAMETYPE_BIGRED              =   44;
var GAMETYPE_BOXINGARENA        =   45;
var GAMETYPE_FANTASYFOREST      =   46;
var GAMETYPE_EGYPTIAN            =   47;
var GAMETYPE_GATSBY              =   48;
var GAMETYPE_HOTPOTFEAST        =   49;
var GAMETYPE_MAGICIAN            =   50;
var GAMETYPE_EASYRIDER           =   51;
var GAMETYPE_GALAXYWARS          =   52;
var GAMETYPE_SHOKUDO             =   53;
var GAMETYPE_TRAIN               =   54;
var GAMETYPE_SHAOLIN             =   55;
var GAMETYPE_LEGENDARY           =   56;
var GAMETYPE_TOMBSHADOW          =   57;
var GAMETYPE_FRANCE               =   58;
var GAMETYPE_GENIE                =   59;
var GAMETYPE_GARDEN               =   60;
var GAMETYPE_ALCHEMIST            =   61;
var GAMETYPE_LOVEFIGHTERS         =   62;
var GAMETYPE_JUNGLE                =   63;
var GAMETYPE_MEDUSA                =   64;
var GAMETYPE_CLASH                 =   65;
var GAMETYPE_DOLLMACHINE          =   66;
var GAMETYPE_WHACKAMOLE           =   67;
var GAMETYPE_CHEEKYEMOJIS         =   68;
var GAMETYPE_ICEFIRE               =   69;
var GAMETYPE_HARDCANDY             =   70;
var GAMETYPE_STARBURST             =   71;
var GAMETYPE_NEMEANLION            =   72;
var GAMETYPE_MAGICBEAN             =   73;
var GAMETYPE_RESTAURANT            =   74;
var GAMETYPE_CANDYCRUSH            =   75;
var GAMETYPE_CASINOMAGNATES       =   76;
var GAMETYPE_SECRETDATE            =   77;
var GAMETYPE_BACTERIA              =   78;
var GAMETYPE_TRAIN2                 =   79;
var GAMETYPE_TLOD2                  =   80;
var GAMETYPE_BASEBALL               =   81;
var GAMETYPE_MYSTICALSTONES        =   82;
var GAMETYPE_HALLOWEEN              =   83;
var GAMETYPE_MUSEUM                  =   84;
var GAMETYPE_RESTAURANT2            =   85;
var GAMETYPE_WHEEL                   =   86;
var GAMETYPE_SINCITY                 =   87;
var GAMETYPE_BLOODMOON               =   88;
var GAMETYPE_CHRISTMAS2              =   89;
var GAMETYPE_WESTWILD               =   90;
var GAMETYPE_ICEFIRE2               =   91;
var GAMETYPE_CHESS                  =   92;
var GAMETYPE_NIGHTCLUB              =   93;
var GAMETYPE_TAOISTS                =   94;
var GAMETYPE_DRAGONBALL2            =   95;
var GAMETYPE_ATLANTIS               =   96;
var GAMETYPE_MUAYTHAI               =   97;
var GAMETYPE_BIRD                   =   98;
var GAMETYPE_VIKINGS                =   99;
var GAMETYPE_WEALTH                 =   100;
var GAMETYPE_SAILOR                 =   101;
var GAMETYPE_ROCKNIGHT2            =   102;
var GAMETYPE_TREASURES             =   103;
var GAMETYPE_HOTCASINO             =   104;
var GAMETYPE_PRIMAL                =   105;
var GAMETYPE_NEZHA                 =   106;
var GAMETYPE_HONOR                 =   107;
var GAMETYPE_PKCLUB1               =   108;
var GAMETYPE_PKCLUB2               =   109;
var GAMETYPE_PKCLUB3               =   110;
var GAMETYPE_CRYSTAL2               =   111;
var GAMETYPE_ELEMENTAL             =   112;
var GAMETYPE_BLOODMOON2       =   113;
var GAMETYPE_MEDUSA2               =   114;
var GAMETYPE_STEAMPUNK              =   115;
var GAMETYPE_NEWWHEEL              =   116;

//var GAMETYPE_CURTYPE    =   GAMETYPE_SLAMDUNK;

//var GAMEIDLIST = [0, 202, 104, 107, 108, 109, 110, 111, 112, 203, 113, 114, 115, 116, 117, 301, 118, 501, 119, 302, 122, 502, 121, 120, 116];
var GAMEIDLIST = [0, 205, 123, 124, 126, 125, 110, 111, 112, 203, 113,
    114, 115, 116, 117, 301, 118, 501, 119, 302, 122,
    502, 121, 120, 401, 408, 406, 402, 409, 411, 410,
    407, 404, 412, 423, 416, 205, 419, 413, 415, 422,
    418, 420, 403, 430, 429, 426, 434, 427, 424, 421,
    432, 435, 431, 438, 433, 425, 417, 436, 440, 442,
    441, 443, 444, 601, 445, 446, 447, 448, 449, 450,
    451, 602, 452, 453, 455, 456, 457, 454, 458, 701,
    460, 459, 461, 462, 20009, 463, 10077, 464, 20006, 466,
    468, 477, 471, 473, 472, 474, 480, 478, 479, 467,
    485, 483, 484, 482, 481, 487, 486, 488, 489, 490,
    495, 493, 497, 498, 499, 500];

var GAMEJPPOS = [
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
    [0,0,0,20],
];
// var GAMEJPPOS = [
//     [0,0,0,0],
//     [0,-37,0,-37],
//     [0,0,0,0],
//     [0,-74,0,-74],
//     [0,-37,0,-37],
//     [0,0,0,0],
//     [0,0,0,20],//[0,-33,0,-33],
//     [0,0,0,0],
//     [0,0,0,0],
//     [0,0,0,0],
//     [0,0,0,0],
//     [0,76,0,-575],
//     [0,-64,0,-64],
//     [0,-132,0,-132],
//     [0,-45,0,-45],
//     [0,-37,0,-37],
//     [0,-55,0,-55],
//     [0,0,0,0],
//     [0,-133,0,0],
//     [0,-37,0,-37],
//     [0,-70,0,-70],
// ];

var CurGameScene = undefined;
var CurHallScene = undefined;

var GameMgr = cc.Class.extend ({
    halllayer : null,
    rankInfoLst : {},
    rankInfoLayer : null,
    cheaterlayer : null,
    cptinfodata:{},
    gamecodeinfo:{},
    ctor: function () {
        this.curGameLayer = undefined;
        this.bDisconnect = false;
        this.myInfo = {uid: 0, gameid: 0, isspin: false, bet: 1, times: 1, lines: 1, nickname: "", curgamecode : '', curtableid: ''};
        this.userbaseinfo = {};

        // 已发送但没确定服务器处理的消息队列
        // 目前只有spin和sgamectrl2类消息需要处理
        this.lstMsg = [];

        this.lastSpinID = 0;

        this.JackpotLayer = undefined;
        this.bJackpotWin = false;
        this.iJackpotType = -1;
        this.iJackpotNums = -1;
        this.bPauseGame = false;
        this.bPauseGame1 = false;       //! MenuBar使用

        this.JackpotGameMsg = undefined;

        this.GameMenuBar = undefined;
        this.lstUserNoticeMsg = [];
    },

    getCurGameID : function () {
        return GAMEIDLIST[GAMETYPE_CURTYPE];
        if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative)
            return this.getGameID(GAMETYPE_CURTYPE);
        else
            return this.getGameID(CurGameCode);
    },

    getGameID : function (gametype) {
        if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative)
            return GAMEIDLIST[gametype];
        else
            return gamelistinfo[gametype][0];
    },

    getCurGameCode : function () {
        if(GAMETYPE_CURCODE)
            return GAMETYPE_CURCODE;
        else
            return this.getCurGameID();
    },

    getCurGameName : function () {
        return this.getGameName(CurGameCode);
    },

    getGameName : function (gamecode) {
        return gamelistinfo[gamecode][1];
    },

    getGameNameFromcode : function (gamecode) {
        if(this.gamecodeinfo && this.gamecodeinfo[gamecode]) {
            return this.gamecodeinfo[gamecode];
        }

        return "DT Game";
        //return this.gamecodeinfo[gamecode]["zh_CN"];
    },

    getGameNameZH : function (gamecode) {
        if(gamelistinfo[gamecode])
            return gamelistinfo[gamecode][2];
        else
            return "";
    },

    newCurGameLayer : function () {
        if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative)
            return this.newGameLayer(GAMETYPE_CURTYPE);
        else
            return this.newGameLayer(CurGameCode);
    },

    newGameLayer : function (gametype) {
        var gamelayer = undefined;

        switch(gametype) {
            case GAMETYPE_SLAMDUNK:
            case 'sd':
            case 'newsd':
                gamelayer = new SlamdunkGameLayer();
                break;
            case GAMETYPE_KOF:
            case 'kof':
            case 'newkof':
                gamelayer = new KofGameLayer();
                break;
            case GAMETYPE_SLAMDUNK2:
            case 'sd5':
            case 'newsd5':
                gamelayer = new Slamdunk2GameLayer();
                break;
            case GAMETYPE_NARUTO:
            case 'naruto':
            case 'newnaruto':
                gamelayer = new NarutoGameLayer();
                break;
            case GAMETYPE_ONEPIECE:
            case 'onepiece':
            case 'newonepiece':
                gamelayer = new OnePieceGameLayer();
                break;
            case GAMETYPE_DBZ:
            case 'dragonball':
                gamelayer = new DBZGameLayer();
                break;
            case GAMETYPE_SAN1:
            case 'san':
                gamelayer = new San1GameLayer();
                break;
            case GAMETYPE_FARM:
                gamelayer = new FarmGameLayer();
                break;
            case GAMETYPE_SAINT:
            case 'seiya':
                gamelayer = new SaintGameLayer();
                break;
            case GAMETYPE_TGOW:
            case 'tgow':
                gamelayer = new TgowGameLayer();
                break;
            case GAMETYPE_HEROS108:
            case 'watermargin':
                gamelayer = new Heros108GameLayer();
                break;
            case GAMETYPE_NEWYEAR:
            case 'newyear':
                gamelayer = new NewYearGameLayer();
                break;
            case GAMETYPE_TLOD:
            case 'tlod':
                gamelayer = new TlodGameLayer();
                break;
            case GAMETYPE_JTW:
            case 'jtw':
                gamelayer = new JTWGameLayer();
                break;
            case GAMETYPE_WHITESNAKE:
            case 'whitesnake':
                gamelayer = new WhiteSnakeGameLayer();
                break;
            case GAMETYPE_DNP:
            case 'dnp':
                gamelayer = new DNPGameLayer();
                break;
            case GAMETYPE_CRYSTAL:
            case 'crystal':
                gamelayer = new CrystalGameLayer();
                break;
            case GAMETYPE_CRYSTAL2:
            case 'crystal2':
                gamelayer = new CrystalGameLayer();
                break;
            case GAMETYPE_FLS:
            case 'fls':
                gamelayer = new FLSGameLayer();
                break;
            case GAMETYPE_FOURSS:
            case 'fourss':
                gamelayer = new FourSSGameLayer();
                break;
            case GAMETYPE_CASINO:
            case 'casino':
                gamelayer = new CasinoGameLayer();
                break;
            case GAMETYPE_MIR:
            case 'mir':
                gamelayer = new MirGameLayer();
                break;
            case GAMETYPE_FOOTBALL:
            case 'football':
                gamelayer = new FootballGameLayer();
                break;
            case GAMETYPE_ROCKNIGHT:
            case 'rocknight':
                gamelayer = new RockNightGameLayer();
                break;
            case GAMETYPE_FWBRO:
            case 'dash':
                gamelayer = new FWBroGameLayer();
                break;
            case GAMETYPE_BLUESEA:
            case 'bluesea':
                gamelayer = new BlueSeaGameLayer();
                break;
            case GAMETYPE_CIRCUS:
            case 'circus':
                gamelayer = new CircusGameLayer();
                break;
            case GAMETYPE_BIKINI:
            case 'bikini':
                gamelayer = new BikiniGameLayer();
                break;
            case GAMETYPE_CRUSADER:
            case 'crusader':
                gamelayer = new CrusaderGameLayer();
                break;
            case GAMETYPE_CROSSING:
            case 'crossing':
                gamelayer = new CrossingGameLayer();
                break;
            case GAMETYPE_HIPHOPMAN:
            case 'hiphopman':
                gamelayer = new HipHopManGameLayer();
                break;
            case GAMETYPE_PIRATETREASURE:
            case 'piratetreasure':
                gamelayer = new PiratetreasureGameLayer();
                break;
            case GAMETYPE_SHOGUN:
            case 'shogun':
                gamelayer = new ShogunGameLayer();
                break;
            case GAMETYPE_FOURBEAUTY:
            case 'fourbeauty':
                gamelayer = new FourBeautyGameLayer();
                break;
            case GAMETYPE_CHRISTMAS:
            case 'merryxmas':
                gamelayer = new ChristmasGameLayer();
                break;
            case GAMETYPE_SWEETHOUSE:
            case 'sweethouse':
                gamelayer = new SweetHouseGameLayer();
                break;
            case GAMETYPE_ROYALSLOTS:
            case 'royalslots':
                gamelayer = new RoyalSlotsGameLayer();
                break;
            case GAMETYPE_VAMPIRE:
            case 'vampire':
                gamelayer = new VampireGameLayer();
                break;
            case GAMETYPE_OPERA:
            case 'opera':
                gamelayer = new OperaGameLayer();
                break;
            case GAMETYPE_ZOMBIE:
            case 'zombie':
                gamelayer = new ZombieGameLayer();
                //gamelayer = new BoxingArenaGameLayer();
                break;
            case GAMETYPE_WRATHOFTHOR:
            case 'wrathofthor':
                gamelayer = new WrathOfThorGameLayer();
                break;
            case GAMETYPE_DETECTIVE:
            case 'perfectdet':
                gamelayer = new DetectiveGameLayer();
                break;
            case GAMETYPE_PETHOUSE:
            case 'pethouse':
                gamelayer = new PetHouseGameLayer();
                break;
            case GAMETYPE_GUHUOZAI:
            case 'guhuozai':
                gamelayer = new BloodstreetGameLayer();
                break;
            case GAMETYPE_BIGRED:
            case 'bigred':
                gamelayer = new BigRedGameLayer();
                break;
            case GAMETYPE_BOXINGARENA:
            case 'boxingarena':
                gamelayer = new BoxingArenaGameLayer();
                break;
            case GAMETYPE_FANTASYFOREST:
            case 'fantasyforest':
                gamelayer = new FantasyforestGameLayer();
                break;
            case GAMETYPE_EGYPTIAN:
            case 'egyptian':
                gamelayer = new EgyptianGameLayer();
                break;
            case GAMETYPE_GATSBY:
            case 'greatgatsby':
                gamelayer = new GatsbyGameLayer();
                break;
            case GAMETYPE_HOTPOTFEAST:
            case 'hotpotfeast':
                gamelayer = new HotPotFeastGameLayer();
                break;
            case GAMETYPE_MAGICIAN:
            case 'magician':
                gamelayer = new MagicianGameLayer();
                break;
            case GAMETYPE_EASYRIDER:
            case 'easyrider':
                gamelayer = new EasyriderGameLayer();
                break;
            case GAMETYPE_GALAXYWARS:
            case 'galaxywars':
                gamelayer = new GalaxyWarsGameLayer();
                break;
            case GAMETYPE_SHOKUDO:
            case 'shokudo':
                gamelayer = new NightCanteenGameLayer();
                break;
            case GAMETYPE_TRAIN:
            case 'train':
                gamelayer = new TrainGameLayer();
                break;
            case GAMETYPE_SHAOLIN:
            case 'shaolin':
                gamelayer = new ShaoLinGameLayer();
                break;
            case GAMETYPE_LEGENDARY:
            case 'legendary':
                gamelayer = new LegendaryTalesGameLayer();
                break;
            case GAMETYPE_TOMBSHADOW:
            case 'tombshadow':
                gamelayer = new TombShadowGameLayer();
                break;
            case GAMETYPE_FRANCE:
            case 'france':
                gamelayer = new FranceGameLayer();
                break;
            case GAMETYPE_GENIE:
            case 'genie':
                gamelayer = new GenieGameLayer();
                break;
            case GAMETYPE_GARDEN:
            case 'garden':
                gamelayer = new GardenGameLayer();
                break;
            case GAMETYPE_ALCHEMIST:
            case 'alchemist':
                gamelayer = new AlchemistGameLayer();
                break;
            case GAMETYPE_LOVEFIGHTERS:
            case 'lovefighters':
                gamelayer = new LoveFightersGameLayer();
                break;
            case GAMETYPE_JUNGLE:
            case 'jungle':
                gamelayer = new JungleGameLayer();
                break;
            case GAMETYPE_MEDUSA:
            case 'medusa':
                gamelayer = new MedusaGameLayer();
                break;
            case GAMETYPE_MEDUSA2:
            case 'medusa':
                gamelayer = new MedusaGameLayer();
                break;
            case GAMETYPE_CLASH:
            case 'clash':
                gamelayer = new ClashGameLayer();
                break;
            case GAMETYPE_DOLLMACHINE:
            case 'dollmachine':
                gamelayer = new DollMachineGameLayer();
                break;
            case GAMETYPE_WHACKAMOLE:
            case 'whackamole':
                gamelayer = new WhackamoleGameLayer();
                break;
            case GAMETYPE_CHEEKYEMOJIS:
            case 'cheekyemojis':
                gamelayer = new CheekYeMoJisGameLayer();
                break;
            case GAMETYPE_ICEFIRE:
            case 'icefire':
                gamelayer = new IceFireGameLayer();
                break;
            case GAMETYPE_HARDCANDY:
            case 'hardcandy':
                gamelayer = new HardCandyGameLayer();
                break;
            case GAMETYPE_STARBURST:
            case 'starburst':
                gamelayer = new StarBurstGameLayer();
                break;
            case GAMETYPE_NEMEANLION:
            case 'nemeanlion':
                gamelayer = new NemeanLionGameLayer();
                break;
            case GAMETYPE_MAGICBEAN:
            case 'magicbean':
                gamelayer = new MagicBeanGameLayer();
                break;
            case GAMETYPE_RESTAURANT:
            case 'restaurant':
                gamelayer = new RestaurantGameLayer();
                break;
            case GAMETYPE_CANDYCRUSH:
            case 'candycrush':
                gamelayer = new CandycrushGameLayer();
                break;
            case GAMETYPE_CASINOMAGNATES:
            case 'casinomagnates':
                gamelayer = new CasinoMagnatesGameLayer();
                break;
            case GAMETYPE_SECRETDATE:
            case 'secretdate':
                gamelayer = new SecretDateGameLayer();
                break;
            case GAMETYPE_BACTERIA:
            case 'bacteria':
                gamelayer = new BacteriaGameLayer();
                break;
            case GAMETYPE_TRAIN2:
            case 'train2':
                gamelayer = new Train2GameLayer();
                break;
            case GAMETYPE_TLOD2:
            case 'tlod2':
                gamelayer = new TlodGameLayer();
                break;
            case GAMETYPE_BASEBALL:
            case 'baseball':
                gamelayer = new BaseballGameLayer();
                break;
            case GAMETYPE_MYSTICALSTONES:
            case 'mysticalstones':
                gamelayer = new MysticalStonesGameLayer();
                break;
            case GAMETYPE_HALLOWEEN:
            case 'halloween':
                gamelayer = new HalloweenGameLayer();
                break;
            case GAMETYPE_MUSEUM:
            case 'museum':
                gamelayer = new WondrousMuseumGameLayer();
                break;
            case GAMETYPE_RESTAURANT2:
            case 'restaurant2':
                gamelayer = new Restaurant2GameLayer();
                break;
            case GAMETYPE_WHEEL:
            case 'wheel':
                gamelayer = new WheelGameLayer();
                break;
            case GAMETYPE_SINCITY:
            case 'sincity':
                gamelayer = new SinCityGameLayer();
                break;
            case GAMETYPE_BLOODMOON:
            case 'bloodmoon':
                gamelayer = new BloodMoonGameLayer();
                break;
            case GAMETYPE_CHRISTMAS2:
            case 'merryxmas2':
                gamelayer = new Christmas2GameLayer();
                break;
            case GAMETYPE_WESTWILD:
            case 'westwild':
                gamelayer = new WestWildGameLayer();
                break;
            case GAMETYPE_ICEFIRE2:
            case 'icefire2':
                gamelayer = new IceFire2GameLayer();
                break;
            case GAMETYPE_CHESS:
            case 'chess':
                gamelayer = new ChessGameLayer();
                break;
            case GAMETYPE_NIGHTCLUB:
            case 'nightclub':
                gamelayer = new NightClubGameLayer();
                break;
            case GAMETYPE_TAOISTS:
            case 'taoists':
                gamelayer = new TaoistGameLayer();
                break;
            case GAMETYPE_DRAGONBALL2:
            case 'dragonball2':
                gamelayer = new DragonBall2GameLayer();
                break;
            case GAMETYPE_ATLANTIS:
            case 'atlantis':
                gamelayer = new AtlantisGameLayer();
                break;
            case GAMETYPE_MUAYTHAI:
            case 'muaythai':
                gamelayer = new MuaythaiGameLayer();
                break;
            case GAMETYPE_BIRD:
            case 'bird':
                gamelayer = new BirdGameLayer();
                break;
            case GAMETYPE_VIKINGS:
            case 'vikings':
                gamelayer = new VikingsGameLayer();
                break;
            case GAMETYPE_WEALTH:
            case 'tgow2':
                gamelayer = new WealthGameLayer();
                break;
            case GAMETYPE_SAILOR:
            case 'sailor':
                gamelayer = new SailorGameLayer();
                break;
            case GAMETYPE_ROCKNIGHT2:
            case 'rocknight2':
                gamelayer = new RockNight2GameLayer();
                break;
            case GAMETYPE_TREASURES:
            case 'treasures':
                gamelayer = new TreasuresGameLayer();
                break;
            case GAMETYPE_HOTCASINO:
            case 'hotcasino':
                gamelayer = new HotcasinoGameLayer();
                break;
            case GAMETYPE_PRIMAL:
            case 'primal':
                gamelayer = new PrimalGameLayer();
                break;
            case GAMETYPE_NEZHA:
            case 'nezha':
                gamelayer = new NeZhaGameLayer();
                break;
            case GAMETYPE_HONOR:
            case 'honor':
                gamelayer = new HonorGameLayer();
                break;
            case GAMETYPE_PKCLUB1:
            case 'pkclub1':
                gamelayer = new PKClub1GameLayer();
                break;
            case GAMETYPE_PKCLUB2:
            case 'pkclub2':
                gamelayer = new PKClub2GameLayer();
                break;
            case GAMETYPE_PKCLUB3:
            case 'pkclub3':
                gamelayer = new PKClub3GameLayer();
                break;
            case GAMETYPE_ELEMENTAL:
            case 'elemental':
                gamelayer = new ElementalGameLayer();
                break;
            case GAMETYPE_STEAMPUNK:
            case 'steampunk':
                gamelayer = new SteampunkGameLayer();
                break;
            case GAMETYPE_NEWWHEEL:
            case 'newwheel':
                gamelayer = new NewWheelGameLayer();
                break;
            case GAMETYPE_BLOODMOON2:
            case 'wolf2':
                gamelayer = new BloodMoon2GameLayer();
                break;
        }

        this.bJackpotWin = false;
        this.iJackpotType = -1;
        this.iJackpotNums = -1;
        this.bPauseGame = false;
        this.bPauseGame1 = false;

        this.curGameLayer = gamelayer;
        GamelogicMgr.instance.setGameLayer(gamelayer);
        this.initKeyboardEvent();

        return gamelayer;
    },

    initKeyboardEvent:function () {
        if ('keyboard' in cc.sys.capabilities) {
            var self = this;

            this._keylistener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    if (cc.KEY.space == key) {
                        self.onPressedSpace();
                    }
                }
            });

            cc.eventManager.addListener(this._keylistener, this.curGameLayer);
        }
    },

    releasKeyboardEvent:function () {
        if(this._keylistener) {
            cc.eventManager.removeListener(this._keylistener);
            this._keylistener = undefined;
        }
    },

    /*
    * 一些弹窗的空格键响应处理
    * GameMenuLayer
    * Setting
    * Paytable
    * GameRules
    * History
    * AutoLayer
    * MultiplierLayer
    * */
    _onDialogPressedSpace: function() {
        var ret = false;
        var gameMenuLayer = this.curGameLayer.gamemenuLayer;
        if (gameMenuLayer) {
            if (gameMenuLayer.isDisplaying()) {
                gameMenuLayer.onBtnClose();
                ret = true;
            }

            if (!ret && gameMenuLayer.isDisplaySetting()) {
                ret =  true;
            }

            if (this.curGameLayer.webView || this.curGameLayer.webView_gameRules || this.curGameLayer.webView_History) {
                ret = true;
            }

            if (!ret && this.curGameLayer.ModuleUI) {
                var moduleUI = this.curGameLayer.ModuleUI;
                if (moduleUI.multiplierLayer) {
                    moduleUI.remvoeMultiplierLayer();
                    ret = true;
                }

                if (!ret && moduleUI.autoLayer) {
                    moduleUI._onTouchAutoSelect();
                    ret = true;
                }
            }
        }

        return ret;
    },

    onPressedSpace : function () {
         if(this.curGameLayer) {
             //! 增加框架的锁定
             if(GamelogicMgr.instance.onPressedSpace())
                 return ;

             if(this.bPauseGame1)
                 return ;

             //! 红包状态不可按
             if(this.GiftGameLayer && !this.GiftGameLayer.canThrough())
                 return ;

             // 一些弹窗的空格键响应处理
             if (this._onDialogPressedSpace()) {
                 return;
             }

             //! Jackpot状态点击按钮
             if(this.bPauseGame) {
                 if(this.JackpotLayer) {
                     if(this.JackpotLayer.canTouchRun())
                        this.JackpotLayer.onTouchRun(undefined, ccui.Widget.TOUCH_ENDED);
                     else if(this.JackpotLayer.canTouchWinAniPanel())
                         this.JackpotLayer.onTouchWinAniPanel(undefined, ccui.Widget.TOUCH_ENDED);
                 }
                 return ;
             }

             //! 一组不可以按键的状态
             if(this.bShowMenuBarDlg)
                 return ;

             if(this.curGameLayer.FreeGameAni || this.curGameLayer.BoxLayer || this.curGameLayer.DoubleLayer ||
                 this.curGameLayer.SmallGameLayer || this.curGameLayer.DisconnectLayer || this.curGameLayer.ErrorLayer || this.curGameLayer.InfoLayer != undefined)
                 return ;

             //! 判断点击胜利动画
             if(this.curGameLayer.WinAni2) {
                 this.curGameLayer.onTouchExitPanel(undefined, ccui.Widget.TOUCH_ENDED);
                 return ;
             }
             else if(this.curGameLayer._winAni && !this.curGameLayer._winAni.isVia()) {
                 this.curGameLayer._winAni.touchPanel();
                 return ;
             }
             else if(this.curGameLayer.isCanTouchPanel && this.curGameLayer.onTouchExitPanel2 && this.curGameLayer.isCanTouchPanel()) {
                 this.curGameLayer.onTouchExitPanel2(undefined, ccui.Widget.TOUCH_ENDED);
                 return ;
             }
             else if (this.curGameLayer.ModuleUI.isVisible('virWin')) {
                 GameDataMgr.instance.endScrollAni('numWinAni');
                 return;
             }

             //! 判断可以转动
             if(this.curGameLayer.btnRun) {
                 var btnRun = this.curGameLayer.btnRun;
                 if(btnRun.isVisible() && btnRun.isEnabled()) {
                     this.curGameLayer.onTouchRun(btnRun, ccui.Widget.TOUCH_ENDED);
                     return ;
                 }
             }

             //! 判断可以停止
             if(this.curGameLayer.btnStop) {
                 var btnStop = this.curGameLayer.btnStop;
                 if(btnStop.isVisible() && btnStop.isEnabled()) {
                     this.curGameLayer.onTouchStop(btnStop, ccui.Widget.TOUCH_ENDED);
                     return ;
                 }
             }
        }
    },

    newHallLayer : function () {
        GetHallTitleLayer();
        this.halllayer = new HallLayer();
        return this.halllayer;
    },

    newNoticeNodeLayer : function () {
        var layer = new NoticeNode();
        layer._setPosition(22,1);
        return layer;
    },

    newrankinfolayer : function () {
        this.rankInfoLayer = new GameRankInfoLayer();
        return this.rankInfoLayer;
    },

    newCheaterLayer : function () {
        this.cheaterlayer = new CheaterLayer();
        return this.cheaterlayer;
    },

    //关闭游戏
    closeGame : function () {
        // while(CurGameScene.children.length > 0)
        // {
        //     CurGameScene.removeChild(CurGameScene.children[0]);
        // }

        this.releasKeyboardEvent();

        if(this.curGameLayer){
            this.curGameLayer.unscheduleUpdate();
            this.curGameLayer.lstWaitMusic = [];
            this.curGameLayer.lstWaitWinEfect = [];
            this.curGameLayer.removeFromParent(true);
            this.curGameLayer = undefined;
        }

        if(cc.sys.isNative) {
            cc.log(cc.director.getTextureCache().getCachedTextureInfo());
            LoaderManager.create().unloadJs();
            cc.spriteFrameCache.removeSpriteFrames();
            cc.director.getTextureCache().removeUnusedTextures();
            cc.director.getTextureCache().removeAllTextures();
            cc.log(cc.director.getTextureCache().getCachedTextureInfo());
            res = [];
        }else {
            for(var i = 0; i < H5PngCache.length; i++){
                if(H5PngCache[i]){
                    cc.spriteFrameCache.removeSpriteFramesFromFile(H5PngCache[i]);
                }
            }
            H5PngCache = [];
        }
        //GameScene.removeChild(GameMgr.singleton.curGameLayer);
        //GameMgr.singleton.curGameLayer.removeFromParent(true);
        //GameMgr.singleton.curGameLayer = undefined;
        // g_resources.forEach(function (item) {
        //     cc.log("lcs---res---release",item);
        //     cc.loader.release(item);
        // });
    },

    //! 收到用户的钱数据
    onMyMoney : function (money) {
        GamelogicMgr.instance.onMyMoney(money);

        if(this.curGameLayer != undefined) {
            this.money = money;
            this.curGameLayer.onMyMoney(money);
        }
        else
            this.money = money;
    },

    //! 收到轮子数据
    onSymbolStripes : function (arr, wname) {
        if(this.curGameLayer != undefined)
            this.curGameLayer.onSymbolStripes(arr, wname);
        else {
            if(this.arr == undefined) {
                this.arr = {};
            }

            this.arr[wname] = arr;
        }
    },

    onSymbolStripes_num : function (arr_num) {
        this.arr_num = arr_num;

        if(typeof(GAMETYPE_CURCODE) != 'undefined') {
            if(this.lstarr_num == undefined)
                this.lstarr_num = {};

            this.lstarr_num[GAMETYPE_CURCODE] = arr_num;
        }
    },

    //! 收到轮子位置
    onGenInit : function (data, lstarr) {
        //cc.director.runScene(new GameScene());

        if(this.curGameLayer != undefined)
            this.curGameLayer.onGenInit(data, lstarr);
        else {
            this.gendata = data;
            this.genlstarr = lstarr;
        }

    },

    //! 收到下注列表
    onBetList : function (lst, betnum) {
        if(this.curGameLayer != undefined) {
            if(this.curGameLayer.onBetList != undefined)
                this.curGameLayer.onBetList(lst, betnum);
        }
        else {
            this.lstbet = lst;
            this.iBetNum = betnum;
        }
    },

    //! 收到游戏模块信息
    onGameModuleInfo : function(msgobj) {
        // if(this.GiftGameLayer != undefined) {
        //     this.GiftGameLayer.onData(msgobj);
        // }

        if(msgobj.gamemodulename == 'common_jackpot') {
            this.JackpotGameMsg = msgobj;
            CommonJackpotMgr.singleton.bShowJackpot = true;
            CommonJackpotMgr.singleton.bShowJackpot1 = true;
        }
        else if(this.curGameLayer != undefined) {
            // if(msgobj.gamemodulename == 'common_jackpot') {
            //     // CommonJackpotMgr.singleton.onCommonJackpotMsg(msgobj);
            //     //
            //     // //! 测试代码
            //     // if(msgobj.gmi.award < 0)
            //     //     this.JackpotLayer.showGame(true);
            //     // else
            //     //     this.JackpotLayer.showGame(false);
            //
            //     this.JackpotGameMsg = msgobj;
            // }
            // else
            //     this.curGameLayer.onGameModuleInfo(msgobj);

            this.curGameLayer.onGameModuleInfo(msgobj);
        }
        else {
            //this.gamemoduleinfo = msgobj;

            if(this.lstgamemoduleinfo == undefined) {
                this.lstgamemoduleinfo = [];
            }

            this.lstgamemoduleinfo.push(msgobj);
        }
    },

    //! 初始化数据
    initData : function () {
        if(this.curGameLayer != undefined && this.money != undefined)
            this.curGameLayer.onMyMoney(this.money);

        if(this.arr_num == undefined) {
            if(this.lstarr_num != undefined && typeof(GAMETYPE_CURCODE) != 'undefined' && this.lstarr_num[GAMETYPE_CURCODE] != undefined) {
                this.arr_num = this.lstarr_num[GAMETYPE_CURCODE];
            }
        }

        if(this.curGameLayer != undefined) {
            if(this.arr != undefined) {
                var busejp = CommonJackpotMgr.singleton.bShowJackpot && CommonJackpotMgr.singleton.bShowJackpot1;

                for(var wname in this.arr) {
                    var jindex = wname.lastIndexOf('_jp');

                    if(jindex == -1) {
                        if(!busejp) {
                            this.curGameLayer.onSymbolStripes(this.arr[wname], wname);
                        }
                        else {
                            var jname = wname + '_jp';

                            if (this.arr[jname] == undefined)
                                this.curGameLayer.onSymbolStripes(this.arr[wname], wname);
                            else
                                this.curGameLayer.onSymbolStripes(this.arr[jname], wname);
                        }
                    }
                    else {
                        continue ;
                    }
                }

                this.arr = undefined;
            }
            else if(this.arr_num != undefined) {
                var busejp = CommonJackpotMgr.singleton.bShowJackpot && CommonJackpotMgr.singleton.bShowJackpot1;

                for(var wname in this.arr_num) {
                    var jindex = wname.lastIndexOf('_jp');

                    if(jindex == -1) {
                        if(!busejp) {
                            this.curGameLayer.onSymbolStripes_num(this.arr_num[wname], wname);
                        }
                        else {
                            var jname = wname + '_jp';

                            if (this.arr_num[jname] == undefined)
                                this.curGameLayer.onSymbolStripes_num(this.arr_num[wname], wname);
                            else
                                this.curGameLayer.onSymbolStripes_num(this.arr_num[jname], wname);
                        }
                    }
                    else {
                        continue ;
                    }
                }

                this.arr_num = undefined;
            }
        }

        if(this.curGameLayer != undefined && this.genlstarr != undefined) {
            this.curGameLayer.onGenInit(this.gendata, this.genlstarr);
            this.genlstarr = undefined;
        }

        if(this.curGameLayer != undefined && this.lstbet != undefined && this.curGameLayer.onBetList != undefined) {
            this.curGameLayer.onBetList(this.lstbet, this.iBetNum);
            this.lstbet = undefined;
        }

        if(this.curGameLayer != undefined && this.ErrorType != undefined) {
            this.curGameLayer.onError(this.ErrorType, this.ErrorString, this.ErrorNewType);
            this.ErrorType = undefined;
        }

        if(this.curGameLayer != undefined && this.curGameLayer.onGameInfo != undefined && this.gameinfo != undefined) {
            this.curGameLayer.onGameInfo(this.gameinfo);
            this.gameinfo = undefined;
        }

        if(this.gameuserinfo != undefined && this.gameuserinfo.giftfree != undefined) {
            if(this.CommonFreeGame != undefined) {
                CommonServer.singleton.setCurCommonFreeData(this.gameuserinfo.giftfree, true);
                GamelogicMgr.instance.setIsWaitCommonFreeGame(true);
            }

            this.gameuserinfo = undefined;
        }

        if(this.userbaseinfo != undefined) {
            if(this.GiftGameLayer != undefined)
                this.GiftGameLayer.onData1(this.gg1info);

            this.gg1info = undefined;
        }

        // if(this.curGameLayer != undefined && this.gamemoduleinfo != undefined)
        //     this.curGameLayer.onGameModuleInfo(this.gamemoduleinfo);

        if(this.curGameLayer != undefined && this.lstgamemoduleinfo != undefined) {
            for(var ii = 0; ii < this.lstgamemoduleinfo.length; ++ii) {
                var msgobj = this.lstgamemoduleinfo[ii];

                // if(this.GiftGameLayer != undefined) {
                //     this.GiftGameLayer.onData(msgobj);
                // }

                this.curGameLayer.onGameModuleInfo(msgobj);

                // if(msgobj.gamemodulename == 'common_jackpot') {
                //     // CommonJackpotMgr.singleton.onCommonJackpotMsg(msgobj);
                //     //
                //     // //! 测试代码
                //     // if(msgobj.gmi.award < 0)
                //     //     this.JackpotLayer.showGame(true);
                //     // else
                //     //     this.JackpotLayer.showGame(false);
                //
                //     this.JackpotGameMsg = msgobj;
                // }
                // else
                //   this.curGameLayer.onGameModuleInfo(msgobj);
            }

            this.lstgamemoduleinfo = undefined;
        }

        CommonServer.singleton.checkShowFreeGame();

        if(this.curGameLayer && this.curGameLayer.GameCanvasMgr) {
            this.curGameLayer.GameCanvasMgr.setCanvasChangedCallback(CommonServer.singleton.sendScreensInfo);
            this.curGameLayer.GameCanvasMgr.setCurCanvasIndex(this.curGameLayer.GameCanvasMgr.getCurCanvasIndex());
        }
    }


   ,

    //! 初始化的数据已经完成
    initFinish : function () {
        if(this.curGameLayer != undefined && this.curGameLayer.initFinish != undefined)
            this.curGameLayer.initFinish();
    },

    //! 收到转动结果
    onSpinResult : function (totalwin, result, winresult, winmul, lstarr) {
        if(this.curGameLayer != undefined)
            this.curGameLayer.onSpinResult(totalwin, result, winresult, winmul, lstarr);
    },

    //! 收到转动结果
    onSpinResult1 : function () {
        if(this.curGameLayer != undefined)
            this.curGameLayer.onSpinResult1();
    },

    //! 收到小游戏数据
    onSGameInfo : function (msgobj) {
        if(this.curGameLayer != undefined && this.curGameLayer.onSGameInfo != undefined)
            this.curGameLayer.onSGameInfo(msgobj);
    },

    //! 收到游戏信息
    onGameInfo : function(msgobj) {
        if(this.curGameLayer != undefined && this.curGameLayer.onGameInfo != undefined)
            this.curGameLayer.onGameInfo(msgobj);
        else
            this.gameinfo = msgobj;
    },

    onGameUserInfo : function (msgobj) {
        if(this.CommonFreeGame) {
            if(msgobj && msgobj.giftfree){
                CommonServer.singleton.setCurCommonFreeData(msgobj.giftfree, true);
                // this.CommonFreeGame.onData(msgobj.giftfree);
            }
        }
        else if(this.GiftGameLayer != undefined)
            this.GiftGameLayer.onData(msgobj);
        else
            this.gameuserinfo = msgobj;
    },

    onUserBaseInfo : function (msgobj) {
        if(this.GiftGameLayer != undefined)
            this.GiftGameLayer.onData1(msgobj);
        else
            this.gg1info = msgobj;

        if(msgobj.userbaseinfo.currency) {
            GamelogicMgr.instance.setCurrency(msgobj.userbaseinfo.currency);
        }
    },

    //! 收到断线
    onDisconnect : function () {
        var that = this;
        if(!this.bDisconnect) {
            if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative) {
                if(that.curGameLayer != undefined)
                    that.curGameLayer.onDisconnect();
                else {
                    if(typeof(confirmbtn_notice) != 'undefined')
                        confirmbtn_notice(StringMgrSys.getString_str("StringNetError"),1);
                }
            }
            else {
                ShowLoading();
                this.tempdelay = setInterval(function () {
                    HideLoading();
                    if(that.tempdelay){
                        clearInterval(that.tempdelay);
                        that.tempdelay = null;
                    }
                    if(that.curGameLayer != undefined)
                        that.curGameLayer.onDisconnect();
                    else {
                        if(typeof(confirmbtn_notice) != 'undefined')
                            confirmbtn_notice(StringMgrSys.getString_str("StringNetError"),1);
                    }
                },5000);
            }

            if(typeof(DataSys) != 'undefined') {
                DataSys.ClearNotice();
                DataSys.StopGlobalTime();
                DataSys.ClearAllData();
            }
        }

        this.bDisconnect = true;
    },

    //网络连上了之后，重启全局刷新方法

    onRestartGlobalTime : function () {
        if(this.tempdelay){
            clearInterval(this.tempdelay);
            this.tempdelay = null;
            HideLoading();
        }
        if(!GlobalTimer)
            DataSys.StartGlobalTimer();
    },

    //! 收到重连
    onReconnnect : function () {
        if(!this.bDisconnect)
            return ;

        if(this.curGameLayer != undefined)
            this.curGameLayer.onReconnnect();
        else {

            if(typeof(HideLoading) != 'undefined')
                HideLoading();

            if(GameMgr.singleton.halllayer){
                cc.log("大厅界面存在");
                if(notice_framelayer){
                    cc.log("网络连接上了删除网络断开提示");
                    notice_framelayer.removeFromParent(true);
                    notice_framelayer = null;
                }
            }else {
                cc.log("大厅界面不存在");
            }

            if(typeof(DataSys) != 'undefined') {
                DataSys.ClearNotice();
                DataSys.ClearAllData();
            }
        }

        if(typeof(GameAssistant) != 'undefined' && GameAssistant.singleton.bNative)
            this.onRestartGlobalTime();

        this.bDisconnect = false;

        if (MainClient.singleton.isapi2) {
            MainClient.singleton.__procCtrlList(true);
        }
        else {
            if (this.lstMsg.length > 0) {
                MainClient.singleton.sendex(this.lstMsg[0].msg, this.lstMsg[0].callback);
            }
        }
    },

    //! 清除游戏消息
    clearGameModuleInfo : function () {
        if (this.curGameLayer != undefined && this.curGameLayer.clearGameModuleInfo != undefined) {
            this.curGameLayer.clearGameModuleInfo();
        }
    },

    //! 收到错误信息 0其他人登陆 1无法恢复的错误 2恢复数据
    onError : function (type, strerror, newtype) {
        if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative) {
            var errortype = 0;

            if(newtype != undefined && newtype == NOTICETYPE.INFO)
                errortype = 1;

            if(this.curGameLayer == undefined) {
                if(errortype == 0)
                    cc.director.runScene(new GameScene());

                this.ErrorType = type;
                this.ErrorString = strerror;
                this.ErrorNewType = errortype;
            }
            else
                this.curGameLayer.onError(type, strerror, errortype);
        }
        else if(this.curGameLayer != undefined) {
            var errortype = 0;

            if(newtype != undefined && newtype == NOTICETYPE.INFO)
                errortype = 1;

            this.curGameLayer.onError(type, strerror, errortype);
        }
        else {
            if(typeof(DataSys) != 'undefined') {
                HideLoading();
                if(newtype == NOTICETYPE.INFO){
                    if(this.curGameLayer == undefined) {
                        showtxt(GameMgr.singleton.halllayer,strerror);
                    }
                    else{
                        showtxt(this.curGameLayer,strerror);
                    }
                }
                if(newtype == NOTICETYPE.DEBUG){
                    cc.log("调试，不显示给最终用户",strerror);
                }
                if(newtype == NOTICETYPE.ERROR){
                    confirmbtn_notice(strerror,2);
                    // DataSys.ClearNotice();
                    // DataSys.StopGlobalTime();
                    // DataSys.ClearAllData();
                    // confirmbtn_notice(strerror,1);
                }
                if(newtype == NOTICETYPE.ENDING){
                    DataSys.ClearNotice();
                    DataSys.StopGlobalTime();
                    DataSys.ClearAllData();
                    confirmbtn_notice(strerror,1);
                }
            }
        }
    },

    //! 收到Jackpot中奖
    onJackpotWin : function (type, nums) {
        this.bJackpotWin = true;
        this.iJackpotType = type;
        this.iJackpotNums = nums;
    },

    showJackpotWin : function () {
        if(!this.bJackpotWin || this.JackpotLayer == undefined)
            return false;

        this.bPauseGame = true;
        this.JackpotLayer.showJackpotWin(this.iJackpotType, this.iJackpotNums);

        this.bJackpotWin = false;
        this.iJackpotType = -1;
        this.iJackpotNums = -1;

        return true;
    },

    closeJackpotWin : function () {
        this.bPauseGame = false;
    },

    isPauseGame : function () {
        return this.bPauseGame || this.bPauseGame1;
    },

    //! Jackpot转盘游戏相关
    hasJackpotGame : function () {
        return this.JackpotGameMsg != undefined;
    },

    showJackpotGame : function (binit) {
        if(!CommonJackpotMgr.singleton.bShowJackpot || !CommonJackpotMgr.singleton.bShowJackpot1)
            this.JackpotGameMsg = undefined;

        if(this.JackpotGameMsg == undefined)
            return false;

        this.bPauseGame = true;
        this.JackpotLayer.showGame(true, binit);
        return true;
    },

    closeJackpotGame : function () {
        this.bPauseGame = false;

        if (this.curGameLayer != undefined && this.curGameLayer.refreshShowMoney != undefined)
            this.curGameLayer.refreshShowMoney(false);

        if (this.curGameLayer != undefined && this.curGameLayer.leftJackpotGame != undefined)
            this.curGameLayer.leftJackpotGame();
    },

    //! 红包相关
    initGiftGame : function () {
        if(this.GiftGameLayer == undefined)
            return false;

        return this.GiftGameLayer.initGiftGame();
    },

    showGiftGame : function (bcanshow) {
        if(this.GiftGameLayer == undefined)
            return false;

        return this.GiftGameLayer.showGiftGame(bcanshow);
    },

    addGiftTotalWin : function (num) {
        if(this.GiftGameLayer == undefined)
            return false;

        return this.GiftGameLayer.addTotalWin(num);
    },

    //! 是否显示了红包
    isShowGift : function () {
        //! 调整逻辑
        return CommonServer.singleton.isShowFreeRedPacket;
    },

    hasGiftGame : function () {
        if(this.GiftGameLayer == undefined)
            return false;

        if(!this.GiftGameLayer.isShowGift())
            return false;

        return this.GiftGameLayer.getGiftState() == 2;
    },

    //! 根据红包进行刷新
    refreshGiftGame : function () {
        if (this.curGameLayer != undefined && this.curGameLayer.refreshGiftGame != undefined)
            this.curGameLayer.refreshGiftGame();
    },

    //! 离开红包游戏
    leftGiftGame : function () {
        if (this.curGameLayer != undefined && this.curGameLayer.leftGiftGame != undefined)
            this.curGameLayer.leftGiftGame();
    },

    leftGiftGame1 : function () {
        if (this.curGameLayer != undefined && this.curGameLayer.refreshShowMoney != undefined)
            this.curGameLayer.refreshShowMoney(false);
    },

    //! 取红包数据
    getGiftData : function (ignorenum) {
        if(this.GiftGameLayer == undefined)
            return undefined;

        return this.GiftGameLayer.getGiftData(ignorenum);
    },

    getCommonFreeGameData : function () {
        if(this.CommonFreeGame == undefined)
            return undefined;

        return this.CommonFreeGame.getGiftData();
    },

    //! 使用一次红包
    runOneGift : function () {
        if(this.CommonFreeGame == undefined)
            return undefined;

        return this.CommonFreeGame.runOne();
    },

    runOne : function (bet) {
        if (this.GameMenuBar != undefined) {
            this.GameMenuBar.runOne(bet);
        }
    },

    onAutoEnd : function () {
        if (this.GameMenuBar != undefined) {
            this.GameMenuBar.onAutoEnd(this.curGameLayer);
        }
    },

    onUserNoticeMsg : function (msg) {
        if(this.GameMenuBar == undefined) {
            if(this.curGameLayer != undefined){
                this.lstUserNoticeMsg.push(msg);
            }
        }
        else {
            this.GameMenuBar.onUserNoticeMsg(msg);
        }
    },

    setGameMenuBar : function (menubar) {
        this.GameMenuBar = menubar;

        for(var ii = 0; ii < this.lstUserNoticeMsg.length; ++ii) {
            this.GameMenuBar.onUserNoticeMsg(this.lstUserNoticeMsg[ii]);
        }

        this.lstUserNoticeMsg = [];
    },

    createMenuBarDlg : function (root, gamelayer, type, type1, strerror) {
        if(this.GameMenuBar == undefined)
            return ;

        var dlglayer = new MenuBarDlg(root, gamelayer, type, type1, strerror);

        if(dlglayer)
            root.addChild(dlglayer);
    },

    createMenuBarDlg_maxbet : function (root, gamelayer, bet) {
        if(this.GameMenuBar == undefined)
            return ;

        StringMgrSys.mbDlgMaxBet = (bet / 100).toString();
        var strerror = StringMgrSys.getString_str("StringDlgMaxBet");

        var dlglayer = new MenuBarDlg(root, gamelayer, 2, -1, strerror);

        if(dlglayer)
            root.addChild(dlglayer);
    },

    onCmdRet : function (cmdid) {
        if (MainClient.singleton.isapi2) {

        }
        else {
            if (this.lstMsg.length > 0) {
                if (cmdid == this.lstMsg[0].msg.cmdid) {
                    this.lstMsg.splice(0, 1);
                }
            }
        }
    },

    onSendCmd : function (msg, callback) {
        if (MainClient.singleton.isapi2) {

        }
        else {
            this.lstMsg.push({msg: msg, callback: callback});
        }
    },

    clearAllMsg : function () {
        this.JackpotGameMsg = undefined;
        this.lstgamemoduleinfo = undefined;
        this.arr = undefined;
        this.arr_num = undefined;
        this.genlstarr = undefined;
        this.ErrorType = undefined;
        this.gameinfo = undefined;
        this.gameuserinfo = undefined;
        this.lstbet = undefined;
        if(this.tempdelay){
            clearInterval(this.tempdelay);
            this.tempdelay = null;
            HideLoading();
        }

        if(this.GiftGameLayer != undefined) {
            this.GiftGameLayer.clearGiftData();
            this.GiftGameLayer = undefined;
        }
    },
});

GameMgr.singleton = new GameMgr();

if(typeof(close_game) == 'undefined') {
    function close_game(parameter1) {
        if(parameter1 && parameter1 == true){
            Hall_GameByNotice();
            close_game_hall();
            var layer = new QuitGameLayer();
            cc.log("foripade    QuitGameLayer");
            foripad(layer);
            cc.director.getRunningScene().addChild(layer);
            if(cc.sys.isNative){
                cc.log("jsb.fileUtils.checkversion();++++");
                layer.initListener();
            }else {
                layer.init();
            }
            if(CurGameCode){
                MainClient.singleton.leftgame(CurGameCode, function (isok) {
                    if(isok){
                        cc.log("退出游戏成功");
                    }else
                        cc.log("退出游戏失败");

                    GameMgr.singleton.clearAllMsg();
                })
            }
        }else {
            if(GameMgr.singleton.curGameLayer){
                if(GameMgr.singleton.rankInfoLayer){
                    if(HallBtnRecord == 8){
                        if(tempjoincpt == false || cptisopen == false){
                            notice_frame_closegame(null,StringMgrSys.getString_str("StringCompetitionOver"));
                        }else {
                            notice_frame_closegame(null,StringMgrSys.getString_str("StringCompetitionGaming"));
                        }
                    }else if(HallBtnRecord == 9){
                        notice_frame_closegame(null,StringMgrSys.getString_str("StringMatchGaming"));
                    }else {
                        notice_frame_closegame(null,StringMgrSys.getString_str("StringLeavingTheRoom"));
                    }
                }else if(HallBtnRecord == 8){
                    if(tempjoincpt == false || cptisopen == false){
                        notice_frame_closegame(null,StringMgrSys.getString_str("StringCompetitionOver"));
                    }else if(CurGameTable == "cpt"){
                        notice_frame_closegame(null,StringMgrSys.getString_str("StringCompetitionGaming"));
                    }else {
                        notice_frame_closegame(null,StringMgrSys.getString_str("StringLeavingTheRoom"));
                    }
                }
                else {
                    notice_frame_closegame(null,StringMgrSys.getString_str("StringLeavingTheRoom"));
                }
            }
        }
    };
}

function close_game_hall() {
    if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative)
        return ;

    if(GameMgr.singleton.rankInfoLayer){
        GameMgr.singleton.rankInfoLayer.removeFromParent(true);
        GameMgr.singleton.rankInfoLayer = null;
    }
    if(GameMgr.singleton.cheaterlayer){
        GameMgr.singleton.cheaterlayer.removeFromParent(true);
        GameMgr.singleton.cheaterlayer = null;
    }
    if(halltitle){
        halltitle.removeFromParent(true);
        halltitle.release();
        halltitle = null;
    }
    //DataSys.DataSysNoticeArr = [];
    //if(GameMgr.singleton.halllayer&&GameMgr.singleton.halllayer.notice_act_interval){
    //    clearInterval(GameMgr.singleton.halllayer.notice_act_interval);
    //}
    //if(GameMgr.singleton.halllayer&&GameMgr.singleton.halllayer.noticetime) {
    //    clearInterval(GameMgr.singleton.halllayer.noticetime);
    //    GameMgr.singleton.halllayer.noticetime = null;
    //}

    ccs.armatureDataManager.clear();
    GameMgr.singleton.rankInfoLst = [];
    if(GameMgr.singleton.curGameLayer){
        GameMgr.singleton.curGameLayer.unscheduleUpdate();
        GameMgr.singleton.curGameLayer.lstWaitMusic = [];
        GameMgr.singleton.curGameLayer.lstWaitWinEfect = [];
        GameMgr.singleton.curGameLayer.removeFromParent(true);
        GameMgr.singleton.curGameLayer = undefined;
        //GameMgr.singleton.closeGame();
    }
    GameMgr.singleton.closeGame();
    cc.audioEngine.stopAllEffects();
    cc.audioEngine.stopMusic();

    GameMgr.singleton.myInfo.gameid = 0;
    GameMgr.singleton.gendata = undefined;
    GameMgr.singleton.arr = undefined;
    GameMgr.singleton.lstgamemoduleinfo = [];

    GameMgr.singleton.myInfo.curgamecode = '';
}

function notice_frame_closegame(wight,str) {
    if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative)
        return ;

    var framelayer = new MaskLayer();
    framelayer.setOpacity(100);
    framelayer.setIsMove(true);
    //
    foripad(framelayer);
    cc.director.getRunningScene().addChild(framelayer,997);
    var choiselayer = ccs.load(resloadlayer.Loadlayer_in_game_notice_json).node;
    var notice_str_1 = findChildByName(choiselayer, "notice_str_1");
    var notice_str_2 = findChildByName(choiselayer, "notice_str_2");
    var enterbtn = findChildByName(choiselayer,"enterbtn");
    var lookonbtn = findChildByName(choiselayer,"lookonbtn");
    notice_str_2.setVisible(false);
    enterbtn.setVisible(false);
    lookonbtn.setVisible(false);
    notice_str_1.setString(str);
    cc.log("foripade    choiselayer");
    //foripad(choiselayer);
    framelayer.addChild(choiselayer);
    //var panel = findChildByName(choiselayer, "panel");
    //var closeBtn = findChildByName(choiselayer, "close");
    //closeBtn.setVisible(false);
    //panel.setTouchEnabled(false);

    var confirmbtn = new ccui.Button();
    confirmbtn.setTouchEnabled(true);
    confirmbtn.loadTextures("notice_frame_queding1.png","notice_frame_queding2.png","notice_frame_queding2.png",ccui.Widget.PLIST_TEXTURE);
    confirmbtn.setPosition(enterbtn.getPosition());
    choiselayer.addChild(confirmbtn);

    var cancelbtn = new ccui.Button();
    cancelbtn.setTouchEnabled(true);
    cancelbtn.loadTextures("notice_frame_quxiao1.png","notice_frame_quxiao2.png","notice_frame_quxiao2.png",ccui.Widget.PLIST_TEXTURE);
    cancelbtn.setPosition(lookonbtn.getPosition());
    choiselayer.addChild(cancelbtn);

    //closeBtn.addTouchEventListener(function (sender, type) {
    //    if (type != ccui.Widget.TOUCH_ENDED)
    //        return;
    //    //cc.log("close ...");
    //    framelayer.removeFromParent(true);
    //} ,this);

    confirmbtn.addTouchEventListener(function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;
        close_game(true);
        framelayer.removeFromParent(true);
    } ,this);

    cancelbtn.addTouchEventListener(function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;
        //cc.log("取消");
        framelayer.removeFromParent(true);
    } ,this);
}

function stopActions(obj)
{
    if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative)
        return ;

    for(var i = 0; i < obj.children.length; ) {
        var c1 = obj.children[i];
        c1.stopAllActions();

        if(c1.children != undefined) {
            if (c1.children.length > 0) {
                stopActions(c1);
            }
        }

        obj.removeChild(c1);
    }
};
