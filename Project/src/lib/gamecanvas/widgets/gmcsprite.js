/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的图片精灵（在每个画布上如果要使用精灵，则应该放置相应的控件）
var GameCanvasSprite = GameCanvasObject.extend({
    //! 构造，name为画布上控件的名字，可以是string或者string数组
    ctor: function (mgr, spritename, lstres) {
        this._super(mgr, 'sprite');

        this.gmcsprite = true;

        this._lstSprite = [];
        this._Child = {};

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var canvas = this._mgr.getCanvas(ii);
            var name = gmc.getElement(spritename, ii);

            if(name) {
                var node = gmc.findChildByName(canvas, name, lstres, ii);

                if(node)
                    this._lstSprite.push(node);
                else
                    this._lstSprite.push(undefined);
            }
            else {
                this._lstSprite.push(undefined);
            }
        }
    },

    getNode : function (index) {
        if(index < 0 || index >= this._lstSprite.length)
            return undefined;

        return this._lstSprite[index];
    },

    //! 设置图片 newFrame可以是frame（frame数组），也可以是字符串（字符串数组）
    setSpriteFrame : function (newFrame) {
        if(!newFrame)
            return ;

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var node = this._lstSprite[ii];

            if(!node)
                continue ;

            var sframe = undefined;

            if(cc.isArray(newFrame)) {
                sframe = newFrame[ii];

                if(sframe && cc.isString(sframe))
                    sframe = cc.spriteFrameCache.getSpriteFrame(sframe);
            }
            else if(cc.isString(newFrame)){
                sframe = cc.spriteFrameCache.getSpriteFrame(newFrame);
            }
            else {
                sframe = newFrame;
            }

            if(!sframe)
                continue ;

            node.setSpriteFrame(sframe);
        }
    },

    getSpriteFrame: function () {
        var lstsprite = [];

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var node = this._lstSprite[ii];

            if(!node) {
                lstsprite.push(undefined);
                continue ;
            }

            var sframe = node.getSpriteFrame();
            lstsprite.push(sframe);
        }

        return lstsprite;
    },

    //!设置角度
    setRotation: function (rotationx, rotationy) {
        for(var ii = 0; ii < this._lstSprite.length; ++ii) {
            var node = this._lstSprite[ii];

            if(!node)
                continue ;

            if (rotationy === undefined)
                rotationy = rotationx;

            node.setRotationX(rotationx);
            node.setRotationY(rotationy);
        }
    },

    //!获取角度
    getRotation: function () {
        var arr = [];

        for(var ii = 0; ii < this._lstSprite.length; ++ii) {
            var node = this._lstSprite[ii];

            if(!node)
                continue ;

            var rotationx = node.getRotationX();
            var rotationy = node.getRotationY();

            if(arr.length == 0){
                if(rotationx === rotationy)
                    arr.push(rotationx);
                else
                    arr.push(cc.p(rotationx, rotationy));
            }
            else{
                var bhas = false;
                if(rotationx === rotationy){
                    for(var jj = 0; jj < arr.length; jj++){
                        if(rotationx == arr[jj]){
                            bhas = true;
                            break;
                        }
                    }
                    if(!bhas)
                        arr.push(rotationx);
                }
                else{
                    var newPo = cc.p(rotationx, rotationy);

                    for(var jj = 0; jj < arr.length; jj++){
                        if(cc.pSameAs(newPo,arr[jj])){
                            bhas = true;
                            break;
                        }
                    }
                    if(!bhas)
                        arr.push(newPo);
                }
            }
        }

        if(arr.length == 0)
            return 0;
        else if(arr.length == 1)
            return arr[0];
        else
            return arr;
    },

    //! 动画相关（给图片精灵一组动画接口，可以用播放动画的方式改变图片）
    //! 是否循环
    isLoop : function () {
        //! 完全不循环
        return false;
    },

    //! 设置动画循环
    setLoop : function (aniloop) {
    },

    //! 是否播放完了
    isEnd : function () {
        return true;
    },

    //! 播放动画 aninam其实是setSpriteFrame里面的newFrame
    play : function (aniname) {
        this.setSpriteFrame(aniname);
    },

    _setVisible : function (visible) {
        for(var ii = 0; ii < this._lstSprite.length; ++ii) {
            var node = this._lstSprite[ii];

            if(node)
                node.setVisible(visible);
        }
    },

    setColor : function (color) {
        for(var ii = 0; ii < this._lstSprite.length; ++ii) {
            var node = this._lstSprite[ii];

            if(node)
                node.setColor(color);
        }
    },

    setOpacity: function (opacity) {
        for(var ii = 0; ii < this._lstSprite.length; ++ii) {
            var node = this._lstSprite[ii];

            if(node)
                node.setOpacity(opacity);
        }
    },

    //! 如果有y 则x和y是number（number数组），否则x是position（position数组）
    setPosition : function (x, y) {
        for(var ii = 0; ii < this._lstSprite.length; ++ii) {
            var node = this._lstSprite[ii];

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
        for(var ii = 0; ii < this._lstSprite.length; ++ii) {
            var node = this._lstSprite[ii];

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
        else
            return undefined;

        if(!gmcres)
            return undefined;

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var res = gmcres.getRes(ii);
            var node = this._lstSprite[ii];

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
            var node = this._lstSprite[ii];

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
                var node = this._lstSprite[ii];

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
                    var node = this._lstSprite[ii];

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
            for(var ii = 0; ii < this._lstSprite.length; ++ii) {
                var node = this._lstSprite[ii];

                if(node)
                    node.addTouchEventListener(this._onTouch, this);
            }
        }

        this._super(callfunc, target);
    },

    setCallFunctionEx : function (callfuncex, targetex) {
        //! 之前没有侦听点击
        if(this._callfunc == undefined && this._callfuncex == undefined) {
            for(var ii = 0; ii < this._lstSprite.length; ++ii) {
                var node = this._lstSprite[ii];

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
            this._mgr.removeSprite(this._mgrname);
    }
});