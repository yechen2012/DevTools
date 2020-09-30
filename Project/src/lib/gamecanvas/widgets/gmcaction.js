/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 用于游戏画布的动作（动画）
var GameCanvasAction = GameCanvasObject.extend({
    //! 构造，gmcname为使用这个动作的gmc控件的名称，可以是string或者string数组，也可以是gmc对象或者gmc对象数组
    ctor: function (mgr, gmc) {
        this._super(mgr, 'action');

        this.gmcaction = true;

        this._lstCtrl = [];
        this._lstAction = [];   //! 0透明度
        this._type = -1;         //!动画类型

        if(gmc) {
            if(cc.isArray(gmc)) {
                for(var ii = 0; ii < gmc.length; ++ii) {
                    var node = gmc[ii];

                    if(cc.isString(node))
                        this.addCtrl_name(node);
                    else
                        this.addCtrl(node);
                }
            }
            else {
                if(cc.isString(gmc))
                    this.addCtrl_name(gmc);
                else
                    this.addCtrl(gmc);
            }
        }

        this.bPause = false;
    },

    update : function (dt) {
        if(this.bPause)
            return ;

        if(this._hasActionType(this._type)){
            switch (this._type){
                case 0:
                    this._update_FadeAction(dt);
                    break;
                case 1:
                    this._update_DelayAction(dt);
                    break;
                case 2:
                    this._update_MoveAction(dt);
                    break;
            }
        }
    },

    //! 是否循环（所有节点对应动画都循环，才返回true）
    isLoop : function () {
        //! 暂时完全不循环
        return false;
    },

    //! 设置动画循环
    setLoop : function (aniloop) {
        //! 暂时不可设置
    },

    addCtrl : function (ctrl) {
        if(cc.isString(ctrl)) {
            this.addCtrl_name(ctrl);
            return ;
        }

        this._lstCtrl.push(ctrl);
    },

    addCtrl_name : function (name) {
        var ctrl = this._mgr.getCtrl(name);

        if(ctrl)
            this._lstCtrl.push(ctrl);
    },

    //! 是否播放完了（所有动画全部播放完，才返回true，循环播放的动画视为播放完）
    isEnd : function () {
        //! 目前暂时不考虑循环动画
        for(var ii = 0; ii < this._lstAction.length; ++ii) {

            if(this._lstAction[ii].length > 0)
                return false;
        }

        return true;
    },

    //! 播放动画，可以设置的类型包括：
    //! aniname为'fade'改变透明度 data包括bopa起始透明度 eopa结束透明度 time时间
    play : function (aniname, data) {
        switch(aniname) {
            case 'fade':
                this._addFadeAction(data);
                break;
            case "delayTime":
                this._addDelayAction(data);
                break;
            case 'move':
                this._addMoveAction(data);
                break
        }
    },

    pause : function () {
        this.bPause = true;
    },

    resume : function () {
        this.bPause = false;
    },

    stop : function () {
        for(var ii = 0; ii < this._lstAction.length; ++ii) {
            this._lstAction[ii] = [];
        }
    },

    // setVisible : function (visible) {
    // },
    //
    // setColor : function (color) {
    // },

    setOpacity: function (opacity) {
        for(var ii = 0; ii < this._lstCtrl.length; ++ii) {
            var ctrl = this._lstCtrl[ii];

            if(ctrl.setOpacity)
                ctrl.setOpacity(opacity);
        }
    },

    setPosition: function (lstpos) {
        for(var ii = 0; ii < this._lstCtrl.length; ++ii) {
            var ctrl = this._lstCtrl[ii];

            if(ctrl.setPosition){
                ctrl.setPosition(lstpos[ii]);
            }
        }
    },

    //!设置目标的真实坐标
    setRealPosition: function (data) {
        if(!data.lsttpos)
            return;
        else{
            var lsttpos = data.lsttpos;
        }

        var lstpos = [];
        if(data.bparent && data.cparent && data.bparent != data.cparent){
            if(cc.isString(data.allparent)){
                var bpos = this._mgr.getPositionToParent(data.bparent, data.allparent);
                var cpos = this._mgr.getPositionToParent(data.cparent, data.allparent);
            }
            else{
                var bpos = this._mgr.getPositionToParent(data.bparent, data.allparent.bnode);
                var cpos = this._mgr.getPositionToParent(data.cparent, data.allparent.cnode);
            }

            for(var ii = 0; ii < lsttpos.length; ii++){
                var tpos = lsttpos[ii];

                var lstdispos = [];
                for(var jj = 0; jj < cpos.length; jj++){
                    if(cpos[jj] && bpos[jj] && tpos[jj]){
                        var disx = bpos[jj].x - cpos[jj].x;
                        var disy = bpos[jj].y - cpos[jj].y;
                        var x = tpos[jj].x + disx;
                        var y = tpos[jj].y + disy;
                        lstdispos.push(cc.p(x,y));
                    }
                    else{
                        lstdispos.push(undefined);
                    }
                }

                lstpos.push(lstdispos);
            }
        }
        else{
            lstpos = lsttpos;
        }

        this.setPosition(lstpos);
    },

    getPosition: function () {
        var lstpos = [];
        for(var ii = 0; ii < this._lstCtrl.length; ++ii) {
            var ctrl = this._lstCtrl[ii];

            if(ctrl.getPosition){
                var pos = ctrl.getPosition();
                lstpos.push(pos);
            }
            else{
                lstpos.push(undefined);
            }
        }

        return lstpos;
    },

    // //! 设置回调函数（当有动画结束的时候会调用）
    // setCallFunction : function (callfunc, target) {
    //     this._target = target;
    //     this._callfunc = callfunc;
    // },
    //
    // //! 设置高级回调函数
    // setCallFunctionEx : function (callfuncex, target) {
    //     this._target = target;
    //     this._callfuncex = callfuncex;
    // },

    //! 判断是否存在一种类型的动作
    _hasActionType : function (type) {
        if(type < 0 || type >= this._lstAction.length)
            return false;

        return this._lstAction[type].length > 0;
    },

    //! 取得一种类型的动作
    _getActionType : function (type) {
        if(type < 0)
            return undefined;

        while(type >= this._lstAction.length) {
            var lst = [];
            this._lstAction.push(lst);
        }

        return this._lstAction[type];
    },

    //! 透明度相关
    //! 添加透明度动画（透明动画type为0）
    _addFadeAction : function (data) {
        if(!data)
            return false;

        if(data.bopa == undefined || data.eopa == undefined || data.time == undefined)
            return false;

        var node = {};

        node.time = 0;
        node.data = data;

        this._type = 0;
        var lst = this._getActionType(this._type);
        lst.push(node);

        this._callFunctionEx(gmc.Ani.BEGIN, 'fade');


        this._update_FadeAction(0);
        return true;
    },

    _addDelayAction: function(data) {
        if (!data || data.time === undefined)
            return false;

        var node = {};

        node.time = 0;
        node.data = data;

        this._type = 1;
        var lst = this._getActionType(this._type);
        lst.push(node);

        this._callFunctionEx(gmc.Ani.BEGIN, "delayTime");
        this._update_DelayAction(0);

        return true;
    },

    //!添加移动动画 end是目标位置（可以是gmc节点，可以是位置数组）
    _addMoveAction: function (data) {
        if(!data)
            return false;

        if(data.target == undefined || data.time == undefined)
            return false;

        var node = {};

        node.time = 0;
        node.data = data;

        if(cc.isString(data.target))
            var ctrl = this._mgr.getCtrl(data.target);
        else
            ctrl = data.target;
        node.target = ctrl;

        this.setRealPosition(node.data);

        this._type = 2;
        var lst = this._getActionType(this._type);
        lst.push(node);

        this._callFunctionEx(gmc.Ani.BEGIN, 'move');

        this._update_MoveAction(0);
        return true;
    },

    _getOpacity_FadeAction : function (node) {
        if(node.time <= 0)
            return node.data.bopa;

        if(node.time >= node.data.time)
            return node.data.eopa;

        return node.data.bopa + (node.data.eopa - node.data.bopa) * node.time / node.data.time;
    },

    _getPosition_MoveAction: function (node, cpos) {
        var tpos = node.target.getPosition();

        if(node.data.cparent && node.data.eparent && node.data.cparent != node.data.eparent){
            if(cc.isString(node.data.allparent)){
                var curpos = this._mgr.getPositionToParent(node.data.cparent, node.data.allparent);
                var epos = this._mgr.getPositionToParent(node.data.eparent, node.data.allparent);
            }
            else{
                var curpos = this._mgr.getPositionToParent(node.data.cparent, node.data.allparent.cnode);
                var epos = this._mgr.getPositionToParent(node.data.eparent, node.data.allparent.enode);
            }

            for(var ii = 0; ii < tpos.length; ii++){
                if(curpos[ii] && epos[ii] && tpos[ii]){
                    var disx = epos[ii].x - curpos[ii].x;
                    var disy = epos[ii].y - curpos[ii].y;
                    tpos[ii].x += disx;
                    tpos[ii].y += disy;

                }
            }
        }

        if(node.time <= 0){
            return cpos;
        }

        if(node.time >= node.data.time){
            return tpos;
        }

        var obj = {};
        var lstchgpos = [];
        var bend = true;
        for(var ii = 0; ii < cpos.length; ii++){
            if(cpos[ii] && tpos[ii]){
                var dis = Math.sqrt(Math.abs((cpos[ii].x - tpos[ii].x) * (cpos[ii].x - tpos[ii].x)) + Math.abs((cpos[ii].y - tpos[ii].y) * (cpos[ii].y - tpos[ii].y)));
                if(dis <= 0){
                    lstchgpos.push(cpos[ii]);
                    continue;
                }

                var speed = dis / ((node.data.time - node.time) * 60);

                var chgpos = cc.p(0,0);
                chgpos.x = cpos[ii].x - (speed / dis * (cpos[ii].x - tpos[ii].x));
                chgpos.y = cpos[ii].y - (speed / dis * (cpos[ii].y - tpos[ii].y));

                var movedis = Math.sqrt(Math.abs((cpos[ii].x - chgpos.x) * (cpos[ii].x - chgpos.x)) + Math.abs((cpos[ii].y - chgpos.y) * (cpos[ii].y - chgpos.y)));

                if(movedis >= dis){
                    chgpos = tpos[ii];
                }
                else{
                    bend = false;
                }

                lstchgpos.push(chgpos);
            }
            else{
                lstchgpos.push(undefined);
            }
        }

        obj.arr = lstchgpos;
        obj.bend = bend;
        return obj;
    },

    _update_FadeAction : function (dt) {
        if(this._lstAction[this._type].length <= 0)
            return ;

        var bend = false;
        var curopa = 0;

        for(var ii = 0; ii < this._lstAction[this._type].length; ++ii) {
            var node = this._lstAction[this._type][ii];
            node.time += dt;

            curopa += this._getOpacity_FadeAction(node);
        }

        curopa /= this._lstAction[this._type].length;
        this.setOpacity(curopa);

        for(var ii = 0; ii < this._lstAction[this._type].length; ++ii) {
            var node = this._lstAction[this._type][ii];

            if(node.time >= node.data.time) {
                this._lstAction[this._type].splice(ii, 1);
                bend = true;
                --ii;
            }
        }

        if(bend) {
            this._callFunctionEx(gmc.Ani.ENDED, 'fade');
            this._callFunction();
        }
    },

    _update_DelayAction: function(dt) {
        if(this._lstAction[this._type].length <= 0)
            return;

        var bEnd = false;

        for (var i = 0; i < this._lstAction[this._type].length; ++i) {
            var node = this._lstAction[this._type][i];
            node.time += dt;

            if (node.time >= node.data.time) {
                this._lstAction[this._type].splice(i, 1);
                bEnd = true;
                --i;
            }
        }

        if (bEnd) {
            this._callFunctionEx(gmc.Ani.ENDED, "delayTime");
            this._callFunction();
        }
    },

    _update_MoveAction: function (dt) {
        if(this._lstAction[this._type].length <= 0)
            return;

        var bend = true;
        for(var ii = 0; ii < this._lstAction[this._type].length; ++ii) {
            var node = this._lstAction[this._type][ii];
            var lstcurpos = this.getPosition();
            var lstchgpos = [];
            var bhas = true;
            bend = false;

            if(node.data.delaytime && node.data.delaytime > 0){
                this.setRealPosition(node.data);
                node.data.delaytime -= dt;
                bhas = false;
                continue;
            }

            node.time += dt;

            var binend = true;
            for(var jj = 0; jj < lstcurpos.length; jj++){
                var obj = this._getPosition_MoveAction(node, lstcurpos[jj]);
                lstchgpos.push(obj.arr);

                if(!obj.bend)
                    binend = false;
            }

            if(bhas)
                this.setPosition(lstchgpos);

            if(binend || node.time >= node.data.time){
                this._lstAction[this._type].splice(ii, 1);
                bend = true;
                --ii;
            }
        }

        if(bend) {
            this._callFunctionEx(gmc.Ani.ENDED, 'move');
            this._callFunction();
        }
    },

    //! 销毁
    destory : function () {
        if(this._mgr && this._mgrname)
            this._mgr.removeAction(this._mgrname);
    }
});