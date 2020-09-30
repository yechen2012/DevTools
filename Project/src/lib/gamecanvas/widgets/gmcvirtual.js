/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的虚拟节点（并不真实存在，主要用于统一的状态管理，接口类似于节点或者按钮），也可以管理一组gmc控件（被管理的gmc控件是否显示和是否可用会受到影响）
var GameCanvasVirtual = GameCanvasObject.extend({
    //! 构造
    ctor: function (mgr, gmc) {
        this._super(mgr, 'virtual');

        this.gmcvirtual = true;

        this._lstCtrl = [];

        if(gmc) {
            if(cc.isArray(gmc)) {
                for(var ii = 0; ii < gmc.length; ++ii) {
                    var node = gmc[ii];

                    if(cc.isString(node))
                        this.addCtrl_name(node, true);
                    else
                        this.addCtrl(node, true);
                }
            }
            else {
                if(cc.isString(gmc))
                    this.addCtrl_name(gmc, true);
                else
                    this.addCtrl(gmc, true);
            }
        }

        this._color = cc.color(255, 255, 255, 255);
        this._opacity = 255;

        this._refreshCtrl();
    },

    addCtrl : function (ctrl, binit) {
        if(cc.isString(ctrl)) {
            this.addCtrl_name(ctrl, binit);
            return ;
        }

        this._lstCtrl.push(ctrl);

        if(!binit)
            this._refreshCtrl();
    },

    addCtrl_name : function (name, binit) {
        var ctrl = this._mgr.getCtrl(name);

        if(ctrl) {
            this._lstCtrl.push(ctrl);

            if(!binit)
                this._refreshCtrl();
        }
    },

    setColor : function (color) {
        this._color.r = color.r;
        this._color.g = color.g;
        this._color.b = color.b;

        // for(var ii = 0; ii < this._lstCtrl.length; ++ii) {
        //     var ctrl = this._lstCtrl[ii];
        //
        //     if(!ctrl || !ctrl.setColor)
        //         continue ;
        //
        //     ctrl.setColor(color);
        // }
    },

    getColor : function () {
        var rcolor = this._color;
        return cc.color(rcolor.r, rcolor.g, rcolor.b, rcolor.a);
    },

    setOpacity: function (opacity) {
        this._opacity = opacity;

        // for(var ii = 0; ii < this._lstCtrl.length; ++ii) {
        //     var ctrl = this._lstCtrl[ii];
        //
        //     if(!ctrl || !ctrl.setOpacity)
        //         continue ;
        //
        //     ctrl.setOpacity(opacity);
        // }
    },

    getOpacity : function () {
        return this._opacity;
    },

    _setVisible : function (visible) {
        for(var ii = 0; ii < this._lstCtrl.length; ++ii) {
            var ctrl = this._lstCtrl[ii];

            if(!ctrl || !ctrl.setVisible)
                continue ;

            ctrl.setVisible(visible, this._mgrname);
        }
    },

    _setEnabled : function (enabled) {
        for(var ii = 0; ii < this._lstCtrl.length; ++ii) {
            var ctrl = this._lstCtrl[ii];

            if(!ctrl || !ctrl.setEnabled)
                continue ;

            ctrl.setEnabled(enabled, this._mgrname);
        }
    },

    //! 刷新控件
    _refreshCtrl : function () {
        this._setVisible(this._visible);
        this._setEnabled(this._enabled);
    },

    //! 销毁
    destory : function () {
        if(this._mgr && this._mgrname)
            this._mgr.removeVirtual(this._mgrname);
    }
});