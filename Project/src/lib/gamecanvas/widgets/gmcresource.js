/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的CocosStudio资源
var GameCanvasResource = GameCanvasObject.extend({
    //! 构造
    ctor: function (mgr, resname, bsingle) {
        this._super(mgr, 'resource');

        this.gmcresource = true;        //! 作为识别该控件的标注
        this._gmcname = undefined;      //! 作为子节点被赋予的名字
        this._gmcparent = undefined;   //! 对应的gmc父节点

        this._lstResource = [];
        this.bplay = false;

        var cnums = this._mgr.getCanvasNums();

        if(bsingle) {
            cnums = 1;
            this._single = true;
        }
        else {
            this._single = false;
        }

        for(var ii = 0; ii < cnums; ++ii) {
            var name = gmc.getElement(resname, ii);

            var rnode = {};

            if(name) {
                var res = ccs.load(name);

                if(res && res.node && res.action)
                    res.node.runAction(res.action);

                rnode.res = res;
                rnode.aloop = false;        //! 默认不循环
                rnode.anidata = undefined;
            }

            if(rnode.res)
                this._lstResource.push(rnode);
            else
                this._lstResource.push(undefined);
        }
    },

    update : function (dt) {
        var bnext = false;
        var ballloop = true;

        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.action)
                continue ;

            if (!node.anidata)
                continue ;

            if (!node.aloop) {
                ballloop = false;
                continue ;
            }

            if(node.res.action.getCurrentFrame() == node.anidata[1]) {
                //node.res.action.refreshCurTime();
                node.res.action.gotoFrameAndPlay(node.anidata[0], node.anidata[1], false);
                bnext = true;
            }
        }

        if (bnext)
            this._callFunctionEx(gmc.Ani.NEXT);

        if (!ballloop && this.bplay && this.isEnd()) {
            this.bplay = false;
            this._callFunctionEx(gmc.Ani.ENDED);
            this._callFunction();
        }
    },

    getNode : function (index) {
        var res =this.getRes(index);

        if(res && res.node)
            return res.node;

        return undefined;
    },

    //! 获取其中的一个资源
    getRes : function (index) {
        if(this._single) {
            if(this._lstResource.length <= 0)
                return undefined;

            return this._lstResource[0].res;
        }

        if(index < 0 || index >= this._lstResource.length)
            return undefined;

        if(!this._lstResource[index])
            return undefined;

        return this._lstResource[index].res;
    },

    //! 是否循环（所有节点对应动画都循环，才返回true）
    isLoop : function () {
        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.action)
                continue ;

            if (!node.anidata)
                continue ;

            if(!node.aloop)
                return false;
        }

        return true;
    },

    //! 设置动画循环
    setLoop : function (aniloop) {
        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.action)
                continue ;

            if (!node.anidata)
                continue ;

            var aloop = gmc.getElement(aniloop, ii);

            if(aloop != undefined)
                node.aloop = aloop;
        }
    },

    //! 设置动画 其中aniname可以是名字 也可以是[起始帧,结束帧]，如果需要播放整个动画（不确定结束帧），则传入[0，-1]
    setAni : function (aniname, aniloop) {
        //! 如果aniname只包含两个数字，则所有资源都播放对应帧的动画
        var fdata = undefined;

        if(cc.isArray(aniname) && aniname.length == 2 && cc.isNumber(aniname[0]) && cc.isNumber(aniname[1])) {
            fdata = aniname;
        }

        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if(!node || !node.res || !node.res.action)
                continue ;

            node.anidata = undefined;

            var aloop = gmc.getElement(aniloop, ii);

            if(fdata) {
                //! 所有动画统一用帧数据
                node.anidata = [fdata[0], fdata[1]];
            }
            else {
                var adata = gmc.getElement(aniname, ii);

                if(cc.isString(adata)) {
                    //! 从动画名字中取出帧信息
                    var ainfo = node.res.action.getAnimationInfo(adata);

                    if(ainfo) {
                        node.anidata = [ainfo.startIndex, ainfo.endIndex];
                    }
                }
                else if(cc.isArray(adata) && adata.length == 2 && cc.isNumber(adata[0])&& cc.isNumber(adata[1])) {
                    node.anidata = [adata[0], adata[1]];
                }
            }

            if(node.anidata) {
                if(aloop != undefined)
                    node.aloop = aloop;

                //! 调整结束帧
                if(node.anidata[1] < 0) {
                    node.anidata[1] = node.res.action.getDuration();
                }
            }
        }
    },

    //! 是否播放完了（所有动画全部播放完，才返回true，循环播放的动画视为播放完）
    isEnd : function () {
        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.action)
                continue ;

            if (!node.anidata)
                continue ;

            if(node.aloop)
                continue ;

            if(node.res.action.getCurrentFrame() != node.anidata[1])
                return false;
        }

        return true;
    },

    //! 播放动画（如果动画没有改变，可以不传参数）其中aniname可以是名字 也可以是[起始帧,结束帧]，如果需要播放整个动画（不确定结束帧），则传入[0，-1]
    play : function (aniname, aniloop) {
        if(aniname)
            this.setAni(aniname, aniloop);

        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.action)
                continue;

            if (!node.anidata)
                continue;

            node.res.action.refreshCurTime();
            node.res.action.gotoFrameAndPlay(node.anidata[0], node.anidata[1], false);
            //node.res.action.gotoFrameAndPlay(node.anidata[0], node.anidata[1], node.aloop);
        }

        this.bplay = true;
        this._callFunctionEx(gmc.Ani.BEGIN);
    },

    pause : function () {
        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.action)
                continue;

            if (!node.anidata)
                continue;

            node.res.action.pause();
        }
    },

    resume : function () {
        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.action)
                continue;

            if (!node.anidata)
                continue;

            node.res.action.refreshCurTime();
            node.res.action.resume();
        }
    },

    stop : function () {
        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.action)
                continue;

            if (!node.anidata)
                continue;

            node.res.action.pause();
        }
    },

    _setVisible : function (visible) {
        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.node)
                continue;

            node.res.node.setVisible(visible);
        }
    },

    setColor : function (color) {
        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.node)
                continue;

            node.res.node.setColor(color);
        }
    },

    setOpacity: function (opacity) {
        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.node)
                continue;

            node.res.node.setOpacity(opacity);
        }
    },

    //! 如果有y 则x和y是number（number数组），否则x是position（position数组）
    setPosition : function (x, y) {
        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if (!node || !node.res || !node.res.node)
                continue ;

            if(y != undefined) {
                var cx = gmc.getElement(x, ii);
                var cy = gmc.getElement(y, ii);

                if(cx != undefined && cy != undefined)
                    node.res.node.setPosition(cx, cy);
            }
            else {
                var cp = gmc.getElement(x, ii);

                if (cp != undefined)
                    node.res.node.setPosition(cp);
            }
        }
    },

    getPosition: function () {
        var lstpos = [];
        for(var ii = 0; ii < this._lstResource.length; ++ii) {
            var node = this._lstResource[ii];

            if(!node || !node.res || !node.res.node){
                lstpos.push(undefined);
                continue;
            }

            if(node.res.node.getPosition){
                var pos = node.res.node.getPosition();
                lstpos.push(pos);
            }
            else{
                lstpos.push(undefined);
            }
        }

        return lstpos;
    },

    //! 从父节点上进行释放
    removeFromParent: function (cleanup) {
        if(!this._gmcparent)
            return ;

        this._gmcparent.removeChild(this, cleanup);
    },

    //! 销毁（从父节点上移除，并从管理者处取消）
    destory : function () {
        if(this._mgr && this._mgrname) {
            this._mgr.removeResource(this._mgrname);
        }
        else {
            this.removeFromParent();
        }
    }
});