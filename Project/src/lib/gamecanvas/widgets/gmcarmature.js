/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的导出动画
var GameCanvasArmature = GameCanvasObject.extend({
    //! 构造，nodename为画布上控件的名字，aniname为播放动画的名字（可不传），可以是string或者string数组，aniloop为是否循环（可不传），可以是boolean或者boolean数组
    ctor: function (mgr, nodename, aniname, aniloop, lstres) {
        this._super(mgr, 'armature');

        this.gmcarmature = true;

        this._lstAni = [];
        this.bplay = false;

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var canvas = this._mgr.getCanvas(ii);
            var name = gmc.getElement(nodename, ii);
            var aname = gmc.getElement(aniname, ii);
            var aloop = gmc.getElement(aniloop, ii);

            var anode = {};

            if(name) {
                var node = gmc.findChildByName(canvas, name, lstres, ii);

                if(node) {
                    if(node.animation) {
                        anode.node = node;

                        if(aname != undefined)
                            anode.aname = aname;
                        else if(node.animation.getCurrentMovementID() != '')
                            anode.aname = node.animation.getCurrentMovementID();

                        if(aloop != undefined)
                            anode.aloop = aloop;
                        else
                            anode.aloop = (node.animation.getLoop() == ccs.ANIMATION_TYPE_TO_LOOP_FRONT);

                        if(aname || aloop)
                            anode.node.animation.play(anode.aname, -1, 0);
                            //anode.node.animation.play(anode.aname, -1, anode.aloop ? 1 : 0);
                    }
                }
            }

            if(anode.node && anode.aname)
                this._lstAni.push(anode);
            else
                this._lstAni.push(undefined);
        }
    },

    getNode : function (index) {
        if(index < 0 || index >= this._lstAni.length)
            return undefined;

        if(!this._lstAni[index])
            return undefined;

        return this._lstAni[index].node;
    },

    update : function (dt) {
        var bnext = false;
        var ballloop = true;

        for (var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if (!node || !node.node || !node.node.animation)
                continue;

            if (!node.aloop) {
                ballloop = false;
                continue;
            }

            if (node.node.animation.getCurrentMovementID() == '') {
                node.node.animation.play(node.aname, -1, 0);
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

    //! 是否循环（所有节点对应动画都循环，才返回true）
    isLoop : function () {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node || !node.node.animation)
                continue ;

            if(!node.aloop)
                return false;
        }

        return true;
    },

    //! 设置动画循环
    setLoop : function (aniloop) {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node)
                continue ;

            var aloop = gmc.getElement(aniloop, ii);

            if(aloop != undefined)
                node.aloop = aloop;
        }
    },

    //! 设置动画
    setAni : function (aniname, aniloop) {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node)
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
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node || !node.node.animation)
                continue ;

            if(node.aloop)
                continue ;

            if(node.node.animation.getCurrentMovementID() != '')
                return false;
        }

        return true;
    },

    init: function (resname) {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node || !node.node.animation)
                continue ;

            node.node.init(resname);
        }
    },

    //!snum可以是单一数值也可以是数组
    setSpeedScale: function (snum) {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node || !node.node.animation)
                continue ;

            var snum = gmc.getElement(snum, ii);
            node.node.animation.setSpeedScale(snum);
        }
    },

    getCurrentMovementID: function () {
        var arr = [];

        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node || !node.node.animation)
                continue ;

            var name = node.node.animation.getCurrentMovementID();

            if(arr.length > 0){
                var bhas = false;
                for(var jj = 0; jj < arr.length; jj++){
                    if(name == arr[jj]){
                        bhas = true;
                        break;
                    }
                }
                if(!bhas){
                    arr.push(name);
                }
            }
            else{
                arr.push(name);
            }
        }

        if(arr.length <= 0)
            return '';
        else if(arr.length == 1)
            return arr[0];
        else
            return arr;
    },

    getLoop: function () {
        var arr = [];

        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node || !node.node.animation)
                continue ;

            var loop = node.node.animation.getLoop();

            if(arr.length > 0){
                var bhas = false;
                for(var jj = 0; jj < arr.length; jj++){
                    if(loop == arr[jj]){
                        bhas = true;
                        break;
                    }
                }
                if(!bhas){
                    arr.push(loop);
                }
            }
            else{
                arr.push(loop);
            }
        }

        if(arr.length <= 0)
            return '';
        else if(arr.length == 1)
            return arr[0];
        else
            return arr;
    },

    //! 播放动画（如果动画没有改变，可以不传参数）
    play : function (aniname, aniloop) {
        this.setAni(aniname, aniloop);

        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node || !node.node.animation || !node.aname)
                continue ;

            node.node.animation.play(node.aname, -1, 0);
            //node.node.animation.play(node.aname, -1, node.aloop ? 1 : 0);
        }

        this.bplay = true;
        this._callFunctionEx(gmc.Ani.BEGIN);
    },

    pause : function () {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node || !node.node.animation)
                continue ;

            node.node.animation.pause();
        }
    },

    resume : function () {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node || !node.node.animation)
                continue ;

            node.node.animation.resume();
        }
    },

    stop : function () {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node || !node.node.animation)
                continue ;

            node.node.animation.stop();
        }
    },

    _setVisible : function (visible) {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(node)
                node.node.setVisible(visible);
        }
    },

    setColor : function (color) {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(node) {
                node.node.setColor(color);

                //! 解决某些情况下 设置透明度无效的问题
                if(node.node.updateDisplayedColor)
                    node.node.updateDisplayedColor();
            }
        }
    },

    setOpacity : function (opacity) {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(node) {
                //node.node.setCascadeOpacityEnabled(true);
                node.node.setOpacity(opacity);

                //! 解决某些情况下 设置透明度无效的问题
                if(node.node.updateDisplayedOpacity)
                    node.node.updateDisplayedOpacity();
            }
        }
    },

    //! 如果有y 则x和y是number（number数组），否则x是position（position数组）
    setPosition : function (x, y) {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

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

    //!获取坐标
    getPosition: function () {
        var lstpos = [];
        for (var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if (!node){
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

    //!设置缩放大小
    setScale: function (scalex, scaley) {
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node)
                continue ;

            if (scaley === undefined)
                scaley = scalex;

            node.node.setScaleX(scalex);
            node.node.setScaleY(scaley);
        }
    },

    //!获取缩放大小
    getScale: function () {
        var arr = [];

        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.node)
                continue ;

            var scalex = node.node.getScaleX();
            var scaley = node.node.getScaleY();

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
    getPlayingAniName:function(){
        for(var ii = 0; ii < this._lstAni.length; ++ii) {
            var node = this._lstAni[ii];

            if(!node || !node.aname)
                continue ;
            return  node.aname;
        }

        return '';
    },
    //! 销毁
    destory : function () {
        if(this._mgr && this._mgrname)
            this._mgr.removeArmature(this._mgrname);
    }
});