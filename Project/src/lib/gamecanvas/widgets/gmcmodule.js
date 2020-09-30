/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的模块
var GameCanvasModule = cc.Class.extend({
    //! 构造
    ctor: function (mgr, name, lstdata) {
        this._mgr = mgr;
        this._mgrname = name;      //! 在管理者中的名字

        this.gmctype = 'module';
        this.gmcmodule = true;

        this._lstdata = [];
        this._lstres = [];         //! 模块中涉及添加的资源

        this._StateMgr = undefined;     //! 状态管理

        if(lstdata)
            this.initCtrlList(lstdata);
    },

    initCtrlList : function (lstdata) {
        if(!lstdata || !this._mgr)
            return ;

        for(var ii = 0; ii < lstdata.length; ++ii) {
            var data = lstdata[ii];
            this.initCtrl(data);
        }
    },

    initCtrl : function (data) {
        var bfind = false;

        for(var jj = 0; jj < this._lstdata.length; ++jj) {
            if(ndata.name == this._lstdata[jj].sname) {
                bfind = true;
                break;
            }
        }

        if(bfind)
            return ;

        var ndata = this._newData(data);
        var ctrl = this._mgr.initCtrl(ndata, this._lstres);

        if(ctrl) {
            ndata.ctrl = ctrl;
            this._lstdata.push(ndata);

            //! 添加的资源要特殊保存
            if(ctrl.gmcresource) {
                this._lstres.push(ctrl);
            }
        }
    },

    //! 获取模块的名字
    getName :function () {
        return this._mgrname;
    },

    //! 获取模块中一个gmc控件在Mgr中的真实名称
    getRealCtrlName : function (name) {
        var ctrl = this.getCtrl(name);

        if(ctrl)
            return ctrl._mgrname;

        return undefined;
    },

    //! 获取一个gmc控件
    getCtrl : function (name) {
        for(var ii = 0; ii < this._lstdata.length; ++ii) {
            var data = this._lstdata[ii];

            if(data.sname == name)
                return this._mgr.getCtrl(data.name);
        }

        return undefined;
    },

    //! 添加状态（部分高级功能getStateMgr之后调用内部的接口）
    addState : function (name, data, curstate, callfunc, target) {
        this._initStateMgr();

        this._StateMgr.add(name, data, curstate, callfunc, target);
    },

    //! 移除状态（一般不用）
    removeState : function (name) {
        if(!this._StateMgr)
            return ;

        this._StateMgr.remove(name);
    },

    //! 设置一个状态的当前状态值 delay是延迟多久后起效（可选） brefresh为true则强制刷新（可选，如果强制刷新则不考虑lock、time等状态）
    setState : function (name, curstate, delay, brefresh) {
        if(!this._StateMgr)
            return ;

        this._StateMgr.setState(name, curstate, delay, brefresh);
    },

    //! 获取一个状态的当前状态值，如果不存在返回-1
    getCurState : function (name, module) {
        if(!this._StateMgr)
            return -1;

        return this._StateMgr.getCurState(name);
    },

    _initStateMgr : function () {
        if(this._StateMgr)
            return ;

        this._StateMgr = new GameCanvasStateMgr(this._mgr, this);
    },

    update : function (dt) {
        if (this._StateMgr)
            this._StateMgr.update(dt);
    },

    //! 构建新的数据（深拷贝并调整部分变量）
    _newData : function (data) {
        var ndata = this._deepClone(data);

        ndata.sname = ndata.name;
        ndata.name = this._mgrname + ndata.name;

        //! 部分gmc控件其中有需要特殊处理的
        switch(ndata.type) {
            case 'resource':
                if(ndata.parent) {
                    //! 先内部后外部
                    var rname = this._mgrname + ndata.parent;

                    if(this._mgr.getCtrl(rname) != undefined)
                        ndata.parent = rname;
                }
                break;
            case 'action':
                if(ndata.res) {
                    if(cc.isArray(ndata.res)) {
                        for(var ii = 0; ii < ndata.res.length; ++ii) {
                            var node = ndata.res[ii];

                            if(cc.isString(node)) {
                                //! 先内部后外部
                                var rname = this._mgrname + node;

                                if(this._mgr.getCtrl(rname) != undefined)
                                    ndata.res[ii] = rname;
                            }
                        }
                    }
                    else if(cc.isString(ndata.res)){
                        //! 先内部后外部
                        var rname = this._mgrname + ndata.res;

                        if(this._mgr.getCtrl(rname) != undefined)
                            ndata.res = rname;
                    }
                }
                break;
        }

        return ndata;
    },

    //! 深拷贝
    _deepClone : function (source) {
        if (!source || typeof source !== 'object') {
            return source;
        }

        var targetObj = source.constructor === Array ? [] : {};

        for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (source[key] && typeof source[key] === 'object') {
                    targetObj[key] = this._deepClone(source[key]);
                } else {
                    targetObj[key] = source[key];
                }
            }
        }

        return targetObj;
    },

    //! 销毁
    destory : function () {
        //! 销毁模块下所有的gmc控件
        //! 先销毁非资源类控件
        for(var ii = 0; ii < this._lstdata.length; ++ii) {
            var data = this._lstdata[ii];

            if(data.ctrl.gmcresource)
                continue ;

            data.ctrl.destory();
        }

        //! 销毁资源类控件
        for(var ii = 0; ii < this._lstres.length; ++ii) {
            var ctrl = this._lstres[ii];
            ctrl.destory();
        }

        if(this._mgr && this._mgrname)
            this._mgr.removeModule(this._mgrname);
    }
});