// 获得当前时间戳，秒
function getCurTime() {
    return Math.floor(new Date().getTime() / 1000);
}

// 获得当前时间戳，毫秒
function getCurTimeMS() {
    return new Date().getTime();
}

// 网络时间
var NetTime = cc.Class.extend({

    ctor: function () {
        // 服务器时间，秒
        this.nettime = 0;
        // 得到服务器时间同步时的客户端时间，秒
        this.mytime = 0;

        // 每次请求的客户端时间，毫秒
        this.reqtime = 0;
        // 得到服务器响应的客户端时间，毫秒
        this.restime = 0;
        // 平均的ping值
        this.ping = -1;
        // 最后一次瞬时ping值
        this.curping = 0;
    },

    onSync: function (nettime) {
        this.nettime = nettime;
        this.mytime = getCurTime();
    },

    getCurNetTime: function () {
        return getCurTime() - this.mytime + this.nettime;
    },

    getOffNetTime: function (begintime) {
        return getCurTime() - this.mytime + this.nettime - begintime;
    },

    onReq: function () {
        this.reqtime = getCurTimeMS();
    },

    onRes: function () {
        this.restime = getCurTimeMS();

        this.curping = this.restime - this.reqtime;
        if (this.ping < 0) {
            this.ping = this.curping;
        }
        else {
            this.ping = Math.floor((this.ping + this.curping) / 2);
        }

        cc.log('ping is ' + this.ping);
        cc.log('curping is ' + this.curping);
    }
});

// 清除纹理
function removeUnusedTextures(res) {

    cc.spriteFrameCache.removeSpriteFramesFromFile(res);

    if(cc.sys.isNative)
        cc.director.getTextureCache().removeUnusedTextures();

}

function findChildByName(node, name) {
    var cn = null;
    if (node.getChildByName != undefined) {
        cn = node.getChildByName(name);
        if (cn != null) {
            return cn;
        }
    }

    if (node.getChildren != undefined) {
        var children = node.getChildren();
        for (var ii = 0; ii < children.length; ++ii) {
            cn = findChildByName(children[ii], name);
            if (cn != null) {
                return cn;
            }
        }
    }

    return null;
}

function findNodeByName(root, name) {
    var node = ccui.helper.seekWidgetByName(root, name);
    if (node == null) {
        return findChildByName(root, name);
    }

    return node;
}

NetTime.singleton = new NetTime();

// keepalive的时间
NetTime.KEEPALIVE_TIME = 30;

// timeout的时间
NetTime.TIMEOUT_TIME = 30;

// reconnect的时间
NetTime.RECONNECT_TIME = 30;

//! ccs资源缓存，部分替代ccs.load
var CcsResCache = cc.Class.extend({
    ctor: function () {
        this.stackModule = [];
        this.CcsRes = {};

        this.curModuleName = "_root";
        this.stackModule.push(this.curModuleName);

        this.addModule(this.curModuleName);
        // this.CcsRes[this.curModuleName] = {};
        // this.CcsRes[this.curModuleName]._rootnode = new cc.Node();
        // this.CcsRes[this.curModuleName]._rootnode.retain();
        // this.CcsRes[this.curModuleName]._rootnode.setScale(0.001);
        // this.CcsRes[this.curModuleName]._rootnode.setOpacity(0);
        //this.CcsRes[this.curModuleName]._rootnode.setVisible(false);
    },

    //! 设置当前模块，设置后未特殊说明的加载都放在该模块内
    setCurModule : function (name, root) {
        if(this.curModuleName == name)
            return ;

        this.curModuleName = name;
        this.stackModule.push(this.curModuleName);

        this.addModule(this.curModuleName, root);

        // if(this.CcsRes[this.curModuleName] == undefined) {
        //     this.CcsRes[this.curModuleName] = {};
        //     this.CcsRes[this.curModuleName]._rootnode = new cc.Node();
        //     this.CcsRes[this.curModuleName]._rootnode.retain();
        //     this.CcsRes[this.curModuleName]._rootnode.setScale(0.001);
        //     this.CcsRes[this.curModuleName]._rootnode.setOpacity(0);
        //     //this.CcsRes[this.curModuleName]._rootnode.setVisible(false);
        // }
    },

    //! 添加一个模块
    addModule : function (name, root) {
        if(this.CcsRes[name] == undefined) {
            this.CcsRes[name] = {};

            if(root) {
                var rootnode = new cc.Node();
                rootnode.retain();
                rootnode.setScale(0.001);
                //rootnode.setOpacity(0);
                rootnode.setPosition(-100, -100);
                rootnode.setVisible(false);
                this.CcsRes[name]._rootnode = rootnode;

                root.addChild(rootnode);
            }
        }
    },

    //! 释放当前模块
    releaseCurModule : function () {
        if(this.stackModule.length <= 1)
            return ;

        this.releaseModule(this.curModuleName);
    },

    //! 释放某个模块，如果释放模块是当前模块，则当前模块恢复到上一个模块
    releaseModule : function (name) {
        if(this.CcsRes[name] == undefined)
            return ;

        if(this.curModuleName == name) {
            this.stackModule.pop();
            this.curModuleName = this.stackModule[this.stackModule.length - 1];
        }

        if(this.CcsRes[name] != undefined) {
            for(var item in this.CcsRes[name]) {
                if(this.CcsRes[name][item].lstActive != undefined) {
                    var lst = this.CcsRes[name][item].lstActive;
                    var size = lst.length;

                    for(var ii = 0; ii < size; ++ii) {
                        var res = lst[ii];

                        res.node.stopAllActions();

                        if (res.node.getParent())
                            res.node.getParent().removeChild(res.node);

                        res.node.release();
                        res.action.release();
                    }

                    this.CcsRes[name][item].lstActive = [];
                }

                if(this.CcsRes[name][item].lstFree != undefined) {
                    var lst = this.CcsRes[name][item].lstFree;
                    var size = lst.length;

                    for(var ii = 0; ii < size; ++ii) {
                        var res = lst[ii];

                        res.node.stopAllActions();

                        if (res.node.getParent())
                            res.node.getParent().removeChild(res.node);

                        res.node.release();
                        res.action.release();
                    }

                    this.CcsRes[name][item].lstFree = [];
                }
            }

            if(this.CcsRes[name]._rootnode) {
                this.CcsRes[name]._rootnode.removeAllChildren();

                if(this.CcsRes[name]._rootnode.getParent())
                    this.CcsRes[name]._rootnode.getParent().removeChild(this.CcsRes[name]._rootnode);

                this.CcsRes[name]._rootnode.release();
            }

            this.CcsRes[name] = {};
        }
    },

    //! 加载一个资源
    load : function (file) {
        return this.load_module(file, this.curModuleName);
    },

    //! 预加载一个资源
    preload : function (file) {
        return this.preload_module(file, this.curModuleName);
    },

    //! 释放一个资源
    release : function (fnode) {
        return this.release_module(fnode, this.curModuleName);
    },

    //! 如果对非当前模块进行操作，则用如下这组接口
    //! 加载一个资源
    load_module : function (file, modulename) {
        if(this.CcsRes[modulename] == undefined)
            return;

        if(this.CcsRes[modulename][file] == undefined) {
            this.CcsRes[modulename][file] = {};
            this.CcsRes[modulename][file].lstActive = [];
            this.CcsRes[modulename][file].lstFree = [];
        }

        var cres = this.CcsRes[modulename][file];

        var fnode = undefined;

        for(var ii = 0; ii < cres.lstFree.length; ++ii) {
            fnode = cres.lstFree[ii];

            if(!fnode.node.getParent() || fnode.action.getCurrentFrame() == 1) {
                cres.lstFree.splice(ii, 1);
                break;
            }

            fnode = undefined;
        }

        //! 有空闲则直接给一个空闲
        if(fnode != undefined) {
        // if(cres.lstFree.length > 0) {
        //     var fnode = cres.lstFree.pop();
        //     // var fnode = cres.lstFree[0];
        //     // cres.lstFree.splice(0, 1);
        //     cres.lstActive.push(fnode);

            cres.lstActive.push(fnode);

            fnode.node.stopAllActions();
            fnode.node.setPosition(0, 0);

            if(fnode.node.getParent())
                fnode.node.getParent().removeChild(fnode.node);

            if(cc.sys.platform == cc.sys.DESKTOP_BROWSER || cc.sys.platform == cc.sys.MOBILE_BROWSER)
                fnode.action.refreshCurTime();

            this._resumeAnimation(fnode.node);
            //fnode.node.stopAllActions();

            return fnode;
        }

        fnode = this._load(file);

        if(!fnode.node || !fnode.action)
            return fnode;

        cres.lstActive.push(fnode);
        return fnode;
    },

    //! 预加载一个资源
    preload_module : function (file, modulename) {
        if(this.CcsRes[modulename] == undefined)
            return;

        if(this.CcsRes[modulename][file] == undefined) {
            this.CcsRes[modulename][file] = {};
            this.CcsRes[modulename][file].lstActive = [];
            this.CcsRes[modulename][file].lstFree = [];
        }

        var fnode = this._load(file);

        if(!fnode.node || !fnode.action)
            return false;

        this.CcsRes[modulename][file].lstFree.push(fnode);
        return true;
    },

    //! 释放一个资源
    release_module : function (fnode, modulename) {
        if(this.CcsRes[modulename] == undefined)
            return false;

        if(!fnode || !fnode.name)
            return false;

        var file = fnode.name;

        //! 不管理不是自己load的资源
        if(this.CcsRes[modulename][file] == undefined)
            return false;

        var cres = this.CcsRes[modulename][file];

        var fi = cres.lstActive.indexOf(fnode);

        if(fi < 0)
            return false;

        var fnode = cres.lstActive[fi];
        cres.lstActive.splice(fi, 1);

        if(fnode.node.getParent())
            fnode.node.getParent().removeChild(fnode.node);

        if(this.CcsRes[modulename]._rootnode)
            this.CcsRes[modulename]._rootnode.addChild(fnode.node);

        fnode.node.runAction(fnode.action);
        fnode.action.gotoFrameAndPlay(0, 1, false);
        //fnode.node.stopAllActions();

        this._pauseAnimation(fnode.node);

        cres.lstFree.push(fnode);
        return true;
    },

    _load : function (file) {
        var fnode = ccs.load(file);

        if(!fnode.node || !fnode.action)
            return fnode;

        fnode.name = file;
        fnode.node.retain();
        fnode.action.retain();
        //fnode.action.setTimeSpeed(0.1);

        return fnode;
    },

    //! 将所有animation归回原位并暂停（回收资源时候使用）
    _pauseAnimation : function (node) {
        if (node.getChildren) {
            var children = node.getChildren();
            for (var ii = 0; ii < children.length; ++ii) {
                var child = children[ii];

                if(child.animation)
                    child.animation.gotoAndPause(0);

                this._pauseAnimation(child);
            }
        }
    },

    //! 继续播放所有animation（取出空闲资源时候使用）
    _resumeAnimation : function (node) {
        if (node.getChildren) {
            var children = node.getChildren();
            for (var ii = 0; ii < children.length; ++ii) {
                var child = children[ii];

                if(child.animation)
                    child.animation.resume();

                this._resumeAnimation(child);
            }
        }
    }
});

CcsResCache.singleton = new CcsResCache();

//! 游戏相关辅助功能
var GameAssistant = cc.Class.extend({
    ctor: function () {
        this.bNative = false;
        this.refreshState();
    },

    //! 判断是否显示声音提示
    isShowSoundTips : function () {
        //return true;
        return cc.sys.platform == cc.sys.MOBILE_BROWSER;
    },

    //! 设置是否是Native版本（如果需要用H5测试App则设置true）
    setNative : function (bnative) {
        this.bNative = bnative;
        this.refreshState();
    },

    //! 根据是否是Native刷新一些状态
    refreshState : function () {
        if(this.bNative) {
            NetTime.TIMEOUT_TIME = 5;
        }
        else {
            NetTime.TIMEOUT_TIME = 30;
        }
    },

    //! 取音乐开关 返回"0"表示关 "1"表示开
    getMusicType : function (gamename) {
        var itemname = this._getItemName(gamename);
        itemname += "soundopen";

        var soundopen = cc.sys.localStorage.getItem(itemname);

        if(soundopen)
            return soundopen;

        return "";
    },

    //! 设置音乐开关 0表示关 1表示开
    setMusicType : function (gamename, type) {
        var itemname = this._getItemName(gamename);
        itemname += "soundopen";

        cc.sys.localStorage.setItem(itemname, type);
    },

    //! 取音效开关 返回"0"表示关 "1"表示开
    getEffectType : function (gamename) {
        var itemname = this._getItemName(gamename);
        itemname += "effectopen";

        var effectopen = cc.sys.localStorage.getItem(itemname);

        if(effectopen)
            return effectopen;

        return "";
    },

    //! 设置音效开关 0表示关 1表示开
    setEffectType : function (gamename, type) {
        var itemname = this._getItemName(gamename);
        itemname += "effectopen";

        cc.sys.localStorage.setItem(itemname, type);
    },

    //! 取音量开关 返回"0"表示关 "1"表示开
    getVolumeType : function (gamename) {
        var itemname = this._getItemName(gamename);
        itemname += "volumeopen";

        var volumeopen = cc.sys.localStorage.getItem(itemname);

        if(volumeopen)
            return volumeopen;

        return "";
    },

    //! 设置音量开关 0表示关 1表示开
    setVolumeType : function (gamename, type) {
        var itemname = this._getItemName(gamename);
        itemname += "volumeopen";

        cc.sys.localStorage.setItem(itemname, type);
    },

    //! 取音量值
    getVolumeValue : function (gamename) {
        var itemname = this._getItemName(gamename);
        itemname += "volumevalue";

        var volumeopen = cc.sys.localStorage.getItem(itemname);

        if(volumeopen)
            return volumeopen;

        return 1;
    },

    //! 设置音量值
    setVolumeValue : function (gamename, type) {
        var itemname = this._getItemName(gamename);
        itemname += "volumevalue";

        cc.sys.localStorage.setItem(itemname, type);
    },

    //! 取名字
    _getItemName : function (gamename) {
        if((cc.sys.platform == cc.sys.DESKTOP_BROWSER || cc.sys.platform == cc.sys.MOBILE_BROWSER) && !this.bNative)
            return gamename;
        else
            return "game";
    },

    //! 取设备类型
    getClientType : function () {
        //! 如果有指定类型则返回指定类型
        if(window && window.dtcfg && window.dtcfg.clienttype)
            return window.dtcfg.clienttype;

        var tstr = 'wap';

        if(cc.sys.isNative) {
            tstr = 'web';

            if(cc.sys.os == cc.sys.OS_IOS)
                tstr = 'ios';
            else if(cc.sys.os == cc.sys.OS_ANDROID)
                tstr = 'android';
        }
        else {
            if(cc.sys.platform == cc.sys.DESKTOP_BROWSER)
                tstr = 'web';
            else if(cc.sys.os == cc.sys.OS_IOS)
                tstr = 'wapI';
            else if(cc.sys.os == cc.sys.OS_ANDROID)
                tstr = 'wapA';
        }

        return tstr;
    },
});

GameAssistant.singleton = new GameAssistant();

var NOTICETYPE = {
    INFO: 0,                // 普通提示，一般来说，需要客户端显示给用户的
    DEBUG: 1,               // 调试，一般来说，不需要显示给最终用户
    ERROR: 2,               // 错误，一般来说，这种错误需要强制用户确定才可以进一步操作
    ENDING: 3,              // 结束，收到这个提示，表示该连接将终止
};