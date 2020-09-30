/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! gmc控件，动画的一些状态
gmc.Ani = gmc.Ani || {};

gmc.Ani.BEGIN = 0;          //! 动画开始播放
gmc.Ani.ENDED = 1;          //! 动画播放完成
gmc.Ani.NEXT = 2;           //! 循环动画开始一个新的循环


//! 用于游戏画布的控件基础对象
var GameCanvasObject = cc.Class.extend({
    //! 构造，name为画布上控件的名字，可以是string或者string数组
    ctor: function (mgr, gmctype) {
        this._mgr = mgr;
        this.gmctype = gmctype;

        this._mgrname = undefined;      //! 在管理者中的名字
        this._ctrlstate = {};            //! 控件状态管理

        this._visible = true;
        this._enabled = true;

        this._defaulthide = false;
        this._defaultdisable = false;
    },

    //! 获取控件类型
    getGmcType : function () {
        return this.gmctype;
    },

    //! 设置数据（尽量放到子类该函数的末尾去调用）
    setData : function (data) {
        if(!data)
            return ;

        if(data.callfunc)
            this.setCallFunction(data.callfunc, data.target);

        if(data.callfuncex)
            this.setCallFunctionEx(data.callfuncex, data.targetex);

        if(data.defaulthide)
            this._defaulthide = true;

        if(data.defaultdisable)
            this._defaultdisable = true;

        this._refreshCtrl();
    },

    //! 增加控件状态
    _addCtrlState : function (statename, eventname) {
        if(!this._ctrlstate[statename])
            this._ctrlstate[statename] = {};

        this._ctrlstate[statename][eventname] = true;
    },

    //! 移除控件状态
    _removeCtrlState : function (statename, eventname) {
        if(!this._ctrlstate[statename] || !this._ctrlstate[statename][eventname])
            return ;

        delete this._ctrlstate[statename][eventname];
    },

    //! 判断控件是否有某个状态
    _hasCtrlState : function (statename) {
        if(!this._ctrlstate[statename])
            return false;

        for(var ii in this._ctrlstate[statename])
            return true;

        return false;
    },

    //! 设置是否显示
    setVisible : function (visible, eventname) {
        var ename = eventname;

        if(!ename)
            ename = '_default';

        if(this._defaulthide) {
            if(visible)
                this._addCtrlState('show', ename);
            else
                this._removeCtrlState('show', ename);
        }
        else {
            if(!visible)
                this._addCtrlState('hide', ename);
            else
                this._removeCtrlState('hide', ename);
        }

        this._refreshVisible();
    },

    isVisible : function () {
        return this._visible;
    },

    _refreshVisible : function () {
        if(this._defaulthide)
            this._visible = this._hasCtrlState('show');
        else
            this._visible = !this._hasCtrlState('hide');

        if(this._setVisible) {
            this._setVisible(this._visible);
        }
    },

    //! 设置是否可以使用
    setEnabled : function (enabled, eventname) {
        var ename = eventname;

        if(!ename)
            ename = '_default';

        if(this._defaultdisable) {
            if(enabled)
                this._addCtrlState('enabled', ename);
            else
                this._removeCtrlState('enabled', ename);
        }
        else {
            if(!enabled)
                this._addCtrlState('disable', ename);
            else
                this._removeCtrlState('disable', ename);
        }

        this._refreshEnabled();
    },

    isEnabled : function () {
        return this._enabled;
    },

    _refreshEnabled : function () {
        if(this._defaultdisable)
            this._enabled = this._hasCtrlState('enabled');
        else
            this._enabled = !this._hasCtrlState('disable');

        if(this._setEnabled) {
            this._setEnabled(this._enabled);
        }
    },

    //! 整体刷新控件状态
    _refreshCtrl : function () {
        this._refreshVisible();
        this._refreshEnabled();
    },

    //! 获取一个gmc控件
    _getMgrCtrl : function (ctrl) {
        if(!this._mgr)
            return undefined;

        if(ctrl && cc.isString(ctrl))
            return this._mgr.getCtrl(ctrl);

        if(!ctrl.gmctype)
            return undefined;

        return ctrl;
    },

    //! 回调函数相关
    //! 设置回调函数
    setCallFunction : function (callfunc, target) {
        this._target = target;
        this._callfunc = callfunc;
    },

    //! 设置高级回调函数
    setCallFunctionEx : function (callfuncex, targetex) {
        this._targetex = targetex;
        this._callfuncex = callfuncex;
    },

    //! 调用回调函数
    _callFunction : function () {
        if(!this._callfunc)
            return ;

        var ci = this._mgr.getCurCanvasIndex();

        var target = gmc.getElement(this._target, ci);
        var callfunc = gmc.getElement(this._callfunc, ci);

        if(target)
            callfunc.call(target, this);
        else
            callfunc.call(this);
    },

    //! 调用高级回调函数
    _callFunctionEx : function () {
        if(!this._callfuncex)
            return ;


        var ci = this._mgr.getCurCanvasIndex();

        var targetex = gmc.getElement(this._targetex, ci);
        var callfuncex = gmc.getElement(this._callfuncex, ci);

        //! 两套回调函数可能共用target
        if(!targetex)
            targetex = gmc.getElement(this._target, ci);

        var nums = arguments.length;

        if(targetex) {
            switch(nums) {
                case 0:
                    callfuncex.call(targetex, this);
                    break;
                case 1:
                    callfuncex.call(targetex, this, arguments[0]);
                    break;
                case 2:
                    callfuncex.call(targetex, this, arguments[0], arguments[1]);
                    break;
                case 3:
                    callfuncex.call(targetex, this, arguments[0], arguments[1], arguments[2]);
                    break;
                case 4:
                    callfuncex.call(targetex, this, arguments[0], arguments[1], arguments[2], arguments[3]);
                    break;
                case 5:
                    callfuncex.call(targetex, this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                    break;
                case 6:
                    callfuncex.call(targetex, this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                    break;
                case 7:
                    callfuncex.call(targetex, this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                    break;
                case 8:
                    callfuncex.call(targetex, this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                    break;
                case 9:
                    callfuncex.call(targetex, this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                    break;
                case 10:
                    callfuncex.call(targetex, this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                    break;
            }
        }
        else {
            switch(nums) {
                case 0:
                    callfuncex.call(this);
                    break;
                case 1:
                    callfuncex.call(this, arguments[0]);
                    break;
                case 2:
                    callfuncex.call(this, arguments[0], arguments[1]);
                    break;
                case 3:
                    callfuncex.call(this, arguments[0], arguments[1], arguments[2]);
                    break;
                case 4:
                    callfuncex.call(this, arguments[0], arguments[1], arguments[2], arguments[3]);
                    break;
                case 5:
                    callfuncex.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                    break;
                case 6:
                    callfuncex.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                    break;
                case 7:
                    callfuncex.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                    break;
                case 8:
                    callfuncex.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                    break;
                case 9:
                    callfuncex.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                    break;
                case 10:
                    callfuncex.call(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                    break;
            }
        }
    },

});