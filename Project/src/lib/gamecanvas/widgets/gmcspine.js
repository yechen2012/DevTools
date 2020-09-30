/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的导出动画
var GameCanvasSpine = GameCanvasObject.extend({
    //! 构造，pnodename为添加spine的节点，resname为播放动画的名字，是string数组，aniloop为是否循环（可不传），可以是boolean或者boolean数组
    ctor: function (mgr, resname, bsingle) {
        this._super(mgr, 'spine');

        this.gmcspine = true;
        this._gmcname = undefined;      //! 作为子节点被赋予的名字
        this._gmcparent = undefined;   //! 对应的gmc父节点
        
        this._lstSpine = [];
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

            var anode = {};

            if(name) {
                var ani = sp.SkeletonAnimation.createWithJsonFile(name[0], name[1]);

                anode.node = ani;
                anode.aloop = false;        //! 默认不循环
                anode.aname = undefined;
            }

            if(anode.node)
                this._lstSpine.push(anode);
            else
                this._lstSpine.push(undefined);
        }
    },

    getRes : function (index) {
        if (this._single) {
            if (this._lstSpine.length <= 0)
                return undefined;

            return this._lstSpine[0];
        }

        if(index < 0 || index >= this._lstSpine.length)
            return undefined;

        if(!this._lstSpine[index] || !this._lstSpine[index].node)
            return undefined;

        return this._lstSpine[index];
    },

    getState:function(index){
        if(index < 0 || index >= this._lstSpine.length)
            return undefined;

            if(!this._lstSpine[index] || !this._lstSpine[index].node)
                return undefined;

        return this._lstSpine[index].node.getCurrent(0);
    },

    update : function (dt) {
        var bnext = false;
        var ballloop = true;

        for (var ii = 0; ii < this._lstSpine.length; ++ii) {
            var node = this._lstSpine[ii];

            if (!node || !node.node)
                continue;

            if (!node.aloop) {
                ballloop = false;
                continue;
            }

            var state = this.getState(ii);
            if(state != null && !state.loop) {
                if(state.trackTime >= state.animationEnd - state.animationStart) {
                    node.setAnimation(0, node.aname, false);
                    bnext = true;
                }
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

    //! 是否循环（所有节点对应动画都循环，才返回true）
    isLoop : function () {
        for(var ii = 0; ii < this._lstSpine.length; ++ii) {
            var node = this._lstSpine[ii];

            if(!node || !node.node)
                continue ;

            if(!node.aloop)
                return false;
        }

        return true;
    },

    //! 设置动画循环
    setLoop : function (aniloop) {
        for(var ii = 0; ii < this._lstSpine.length; ++ii) {
            var node = this._lstSpine[ii];

            if(!node || !node.node)
                continue ;

            var aloop = gmc.getElement(aniloop, ii);

            if(aloop != undefined)
                node.aloop = aloop;
        }
    },

    //! 设置动画
    setAni : function (aniname, aniloop) {
        if (aniname instanceof Array) {
            var index = Math.floor(Math.random() * aniname.length);
            aniname = aniname[index];
        }

        for(var ii = 0; ii < this._lstSpine.length; ++ii) {
            var node = this._lstSpine[ii];

            if(!node || !node.node)
                continue ;

            var aname = gmc.getElement(aniname, ii);
            var aloop = gmc.getElement(aniloop, ii);

            if(aname != undefined)
                node.aname = aname;

            if(aloop != undefined)
                node.aloop = aloop;
        }
    },

    //! 是否播放完了（所有动画全部播放完，才返回true，循环播放的动画视为播放完）
    isEnd : function () {
        var bend = false;
        for(var ii = 0; ii < this._lstSpine.length; ++ii) {
            var node = this._lstSpine[ii];

            if(!node || !node.node)
                continue ;

            if(node.aloop)
                continue ;

            var state = this.getState(ii);
            if(state != null) {
                if(state.trackTime >= state.animationEnd - state.animationStart) {
                    bend = true;
                    break;
                }
            }
        }

        if(bend)
            return true;
    },

    //! 播放动画（如果动画没有改变，可以不传参数）
    play : function (aniname, aniloop) {
        this.setAni(aniname, aniloop);

        for(var ii = 0; ii < this._lstSpine.length; ++ii) {
            var node = this._lstSpine[ii];

            if(!node || !node.aname || !node.node)
                continue ;

            node.node.setAnimation(0, node.aname, node.aloop);
        }

        this.bplay = true;
        this._callFunctionEx(gmc.Ani.BEGIN);
    },

    pause : function () {

    },

    resume : function () {

    },

    stop : function () {

    },

    _setVisible : function (visible) {
        for(var ii = 0; ii < this._lstSpine.length; ++ii) {
            var node = this._lstSpine[ii];

            if(!node || !node.node)
                continue;

            node.node.setVisible(visible);
        }
    },

    setColor : function (color) {

    },

    setOpacity : function (opacity) {
        for(var ii = 0; ii < this._lstSpine.length; ++ii) {
            var node = this._lstSpine[ii];

            if(!node || !node.node)
               continue;

            node.node.setPremultipliedAlpha(opacity);
        }
    },

    //! 如果有y 则x和y是number（number数组），否则x是position（position数组）
    setPosition : function (x, y) {
        for(var ii = 0; ii < this._lstSpine.length; ++ii) {
            var node = this._lstSpine[ii];

            if(!node || !node.node)
                continue ;

            if(y != undefined) {
                var cx = gmc.getElement(x, ii);
                var cy = gmc.getElement(y, ii);

                if(cx != undefined && cy != undefined)
                    node.node.setPosition(cx, cy);
            }
            else {
                var cp = gmc.getElement(x, ii);

                if (cp != undefined)
                    node.node.setPosition(cp);
            }
        }
    },

    getPosition: function () {
        var lstpos = [];
        for(var ii = 0; ii < this._lstSpine.length; ++ii) {
            var node = this._lstSpine[ii];

            if(!node || !node.node){
                lstpos.push(undefined);
                continue;
            }

            if(node.node.getPosition){
                var pos = node.node.getPosition();
                lstpos.push(pos);
            }
            else{
                lstpos.push(undefined);
            }
        }

        return lstpos;
    },

    removeFromParent: function(cleanup) {
        var spine = undefined;
        for (var i = 0; i < this._lstSpine.length; ++i) {
            spine = this._lstSpine[i];
            if (spine && spine.node) {
                spine.node.removeFromParent(cleanup);
            }
        }
    },

    //! 销毁
    destory : function () {
        if(this._mgr && this._mgrname)
            this._mgr.removeSpine(this._mgrname);
    }
});