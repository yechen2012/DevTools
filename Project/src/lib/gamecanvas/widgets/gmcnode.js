/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的节点（在每个画布上如果要使用节点，则应该放置相应的控件）
var GameCanvasNode = GameCanvasObject.extend({
    //! 构造，name为画布上控件的名字，可以是string或者string数组
    ctor: function (mgr, nodename, lstres) {
        this._super(mgr, 'node');

        this.gmcnode = true;

        this._lstNode = [];
        this._Child = {};

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var canvas = this._mgr.getCanvas(ii);
            var name = gmc.getElement(nodename, ii);

            if(name) {
                var node = gmc.findChildByName(canvas, name, lstres, ii);

                if(node)
                    this._lstNode.push(node);
                else
                    this._lstNode.push(undefined);
            }
            else {
                this._lstNode.push(undefined);
            }
        }
    },

    getNode : function (index) {
        if(index < 0 || index >= this._lstNode.length)
            return undefined;

        return this._lstNode[index];
    },

    _setVisible : function (visible) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(node)
                node.setVisible(visible);
        }
    },

    setColor : function (color) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(node)
                node.setColor(color);
        }
    },

    setOpacity: function (opacity) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(node)
                node.setOpacity(opacity);
        }
    },

    //! 如果有y 则x和y是number（number数组），否则x是position（position数组）
    setPosition : function (x, y) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(!node)
                continue ;

            if(y != undefined) {
                var cx = gmc.getElement(x, ii);
                var cy = gmc.getElement(y, ii);

                if(cx != undefined && cy != undefined)
                    node.setPosition(cx, cy);
            }
            else {
                var cp = gmc.getElement(x, ii);

                if (cp != undefined)
                    node.setPosition(cp);
            }
        }
    },

    getPosition: function () {
        var lstpos = [];
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(!node){
                lstpos.push(undefined);
                continue;
            }

            if(node.getPosition){
                var pos = node.getPosition();
                lstpos.push(pos);
            }
            else{
                lstpos.push(undefined);
            }
        }

        return lstpos;
    },

    //! 添加子节点 返回一个GameCanvasResource 这里的childs比较特殊 可以是资源名称（或者数组） 也可以是GameCanvasResource 如果有name则管理（可以通过名字找到对应的GameCanvasResource）
    addChild : function (childs, zorders, name) {
        if(!childs)
            return undefined;

        var gmcres;

        if(cc.isArray(childs) || cc.isString(childs))
            gmcres = this._mgr.initResource(undefined, childs);
        else if(childs.gmcresource)
            gmcres = childs;
        else if(childs.gmcspine)
            gmcres = childs;
        else
            return undefined;

        if(!gmcres)
            return undefined;

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var res = gmcres.getRes(ii);

            var node = this._lstNode[ii];

            if(!node || !res || !res.node)
                continue ;

            var zorder = undefined;

            if(zorders)
                zorder = gmc.getElement(zorders, ii);

            node.addChild(res.node, zorder);
        }

        if(name) {
            this._Child[name] = gmcres;
            gmcres._gmcname = name;
        }

        gmcres._gmcparent = this;

        return gmcres;
    },

    //! 取子节点 返回GameCanvasResource
    getChild : function (name) {
        if(!name)
            return undefined;

        return this._Child[name];
    },

    //! 移除子节点相关
    //! 移除所有子节点
    removeAllChildren: function (cleanup) {
        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var node = this._lstNode[ii];

            if(!node)
                continue ;

            node.removeAllChildren(cleanup);
        }

        this._Child = {};
    },

    //! 用名字移除子节点
    removeChildByName : function (name, cleanup) {
        var gmcres = this.getChild(name);

        if(!gmcres)
            return ;

        this.removeChild(gmcres, cleanup);
    },

    //! 移除子节点 这里的childs比较特殊 可以是资源名称（或者数组） 也可以是GameCanvasResource 也可以是cc.Node等相关对象
    removeChild: function (childs, cleanup) {
        if(cc.isString(childs)) {
            var cnums = this._mgr.getCanvasNums();

            for(var ii = 0; ii < cnums; ++ii) {
                var node = this._lstNode[ii];

                if(!node)
                    continue ;

                var cnode = findNodeByName(node, childs);
                cnode.removeFromParent(cleanup);
            }
        }
        else if(childs.gmcresource) {
            var gmcres = childs;

            if(gmcres._gmcname) {
                this._Child[gmcres._gmcname] = undefined;
                gmcres._gmcname = undefined;
            }

            var cnums = this._mgr.getCanvasNums();

            for(var ii = 0; ii < cnums; ++ii) {
                var res = gmcres.getRes(ii);

                if(!res || !res.node)
                    continue ;

                res.node.removeFromParent(cleanup);
            }

            gmcres._gmcparent = undefined;
        }
        else if(cc.isArray(childs)) {
            var cnums = this._mgr.getCanvasNums();

            for(var ii = 0; ii < cnums; ++ii) {
                var child = gmc.getElement(childs, ii);

                if(cc.isString(child)) {
                    var node = this._lstNode[ii];

                    if(!node)
                        continue ;

                    var cnode = findNodeByName(node, child);
                    cnode.removeFromParent(cleanup);
                }
                else if(child.removeFromParent)
                    child.removeFromParent(cleanup);
            }
        }
        else if(childs.removeFromParent) {
            childs.removeFromParent(cleanup);
        }
    },

    // //! 设置点击回调函数（callfunc为点击回调，callfuncex为通用回调）
    // setCallFunction : function (target, callfunc, callfuncex) {
    //     //! 之前没有侦听点击
    //     if(this._callfunc == undefined && this._callfuncex == undefined) {
    //         for(var ii = 0; ii < this._lstNode.length; ++ii) {
    //             var node = this._lstNode[ii];
    //
    //             if(node)
    //                 node.addTouchEventListener(this._onTouch, this);
    //         }
    //     }
    //
    //     this._target = target;
    //     this._callfunc = callfunc;
    //     this._callfuncex = callfuncex;
    // },

    //! 设置回调函数
    setCallFunction : function (callfunc, target) {
        //! 之前没有侦听点击
        if(this._callfunc == undefined && this._callfuncex == undefined) {
            for(var ii = 0; ii < this._lstNode.length; ++ii) {
                var node = this._lstNode[ii];

                if(node)
                    node.addTouchEventListener(this._onTouch, this);
            }
        }

        this._super(callfunc, target);
    },

    setCallFunctionEx : function (callfuncex, targetex) {
        //! 之前没有侦听点击
        if(this._callfunc == undefined && this._callfuncex == undefined) {
            for(var ii = 0; ii < this._lstNode.length; ++ii) {
                var node = this._lstNode[ii];

                if(node)
                    node.addTouchEventListener(this._onTouch, this);
            }
        }

        this._super(callfuncex, targetex);
    },

    _onTouch : function (sender, type) {
        if(!this._visible)
            return ;

        this._callFunctionEx(type);

        if (type == ccui.Widget.TOUCH_ENDED) {
            this._callFunction();
        }
    },

    //! 设置数据
    setData : function (data) {
        this._super(data);
    },

    //! 销毁
    destory : function () {
        if(this._mgr && this._mgrname)
            this._mgr.removeNode(this._mgrname);
    }
});