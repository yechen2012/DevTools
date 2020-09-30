/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的单一节点（主要用于动画、对话框等较复杂和资源量较大的内容，只添加一组，根据当前显示的画布进行切换）
var GameCanvasSingleNode = GameCanvasObject.extend({
    ctor : function (mgr, nodename, lstres) {
        this._super(mgr, 'singlenode');

        this.gmcsinglenode = true;

        this._lstNode = [];

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var canvas = this._mgr.getCanvas(ii);
            var name = gmc.getElement(nodename, ii);

            if(name) {
                var node = gmc.findChildByName(canvas, name, lstres, ii);

                if(node)
                    this._lstNode.push(node);
                else
                    this._lstNode.push(undefined)
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

    //! 是否包含对应的节点
    hasNode : function (node) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            if(!this._lstNode[ii])
                continue ;

            if(this._lstNode[ii] == node)
                return true;
        }

        return false;
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

    //!设置缩放大小
    setScale: function (scalex, scaley) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(!node)
                continue ;

            if (scaley === undefined)
                scaley = scalex;

            node.setScaleX(scalex);
            node.setScaleY(scaley);
        }
    },

    //!获取缩放大小
    getScale: function () {
        var arr = [];

        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(!node)
                continue ;

            var scalex = node.getScaleX();
            var scaley = node.getScaleY();

            if(arr.length == 0){
                if(scalex === scaley)
                    arr.push(scalex);
                else
                    arr.push(cc.p(scalex, scaley));
            }
            else{
                var bhas = false;
                if(scalex === scaley){
                    for(var jj = 0; jj < arr.length; jj++){
                        if(scalex == arr[jj]){
                            bhas = true;
                            break;
                        }
                    }
                    if(!bhas)
                        arr.push(scalex);
                }
                else{
                    var newPo = cc.p(scalex, scaley);

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
            return 1;
        else if(arr.length == 1)
            return arr[0];
        else
            return arr;
    },

    //! 添加子节点
    addChild : function (child, zorder) {
        if(!child)
            return false;

        var cindex = this._mgr.getCurCanvasIndex();
        var node = null;

        if(cindex >= 0 && cindex < this._lstNode.length) {
            node = this._lstNode[cindex];
        }

        if(!node) {
            //! 加在第一个可以加的节点上
            for(var ii = 0; ii < this._lstNode.length; ++ii) {
                if(this._lstNode[ii]) {
                    node = this._lstNode[ii];
                    break;
                }
            }
        }

        if(!node)
            return false;

        //! 如果是GameCanvasResource或者GameCanvasSpine，则加载方式会有区别
        if(child.gmcresource || child.gmcspine) {
            var res = child.getRes();

            if(res && res.node) {
                node.addChild(res.node, zorder);
                child._gmcparent = this;
            }
        }
        else {
            node.addChild(child, zorder);
        }

        return true;
    },

    //! 查找子节点
    findChildByName : function (name) {
        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            var node = this._lstNode[ii];

            if(node) {
                var child = findChildByName(node, name);

                if(child)
                    return child;
            }
        }

        return null;
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
    },

    //! 移除子节点 这里的childs比较特殊 可以是资源名称（或者数组） 也可以是GameCanvasResource 也可以是cc.Node等相关对象
    removeChild: function (child, cleanup) {
        //! 如果是GameCanvasResource，则加载方式会有区别
        if(child.gmcresource) {
            var res = child.getRes();

            if(res && res.node)
                res.node.removeFromParent();

            child._gmcparent = this;
        }
        else if(cc.isString(child)) {
            var cnums = this._mgr.getCanvasNums();

            for(var ii = 0; ii < cnums; ++ii) {
                var node = this._lstNode[ii];

                if(!node)
                    continue ;

                var cnode = findNodeByName(node, child);
                cnode.removeFromParent(cleanup);
            }
        }
        else if(child.removeFromParent) {
            child.removeFromParent(cleanup);
        }
    },

    //! 刷新（当当前画布变化的时候调用）
    refresh : function () {
        this.setCurIndex(this._mgr.getCurCanvasIndex());
    },

    //! 设置当前显示的画布（把其他画布上的节点移动到显示画布上）
    setCurIndex : function (cindex) {
        if(cindex < 0 || cindex >= this._lstNode.length)
            return ;

        var cnode = this._lstNode[cindex];

        if(!cnode)
            return ;

        for(var ii = 0; ii < this._lstNode.length; ++ii) {
            if(ii == cindex)
                continue ;

            var node = this._lstNode[ii];

            if(node) {
                var children = node.getChildren();

                while(children.length > 0) {
                    var child = children[0];
                    var zorder = child.getLocalZOrder();

                    child.retain();
                    node.removeChild(child, false);
                    cnode.addChild(child, zorder);
                    child.release();
                }
            }
        }
    },

    //! 销毁
    destory : function () {
        if(this._mgr && this._mgrname)
            this._mgr.removeSingle(this._mgrname);
    }
});