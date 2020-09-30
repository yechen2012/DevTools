/**
 * Created by ssscomic on 2017/11/16.
 */

var gmc = gmc || {};

//! 画布上使用的滑块
var GameCanvasProbar = GameCanvasObject.extend({
    //! 构造，slidername为画布上控件的名字，可以是string或者string数组，nums可以不使用，如果是数字表示把滑条分段数，如果是数组表示分段并且每段使用数组内的数值
    ctor : function (mgr, probarname, lstres) {
        this._super(mgr, 'probar');

        this.gmcprobar = true;

        this._lstProbar = [];

        var cnums = this._mgr.getCanvasNums();

        for(var ii = 0; ii < cnums; ++ii) {
            var canvas = this._mgr.getCanvas(ii);
            var name = gmc.getElement(probarname, ii);

            if(name) {
                var node = gmc.findChildByName(canvas, name, lstres, ii);

                if(node) {
                    this._lstProbar.push(node);
                }
                else
                    this._lstProbar.push(undefined);
            }
            else {
                this._lstProbar.push(undefined);
            }
        }
    },

    getNode : function (index) {
        if(index < 0 || index >= this._lstProbar.length)
            return undefined;

        if(!this._lstProbar[index])
            return undefined;

        return this._lstProbar[index];
    },

    //! 如果有y 则x和y是number（number数组），否则x是position（position数组）
    setPosition : function (x, y) {
        for(var ii = 0; ii < this._lstProbar.length; ++ii) {
            var node = this._lstProbar[ii];

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
        for(var ii = 0; ii < this._lstProbar.length; ++ii) {
            var node = this._lstProbar[ii];

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

    _setVisible : function (visible) {
        for(var ii = 0; ii < this._lstProbar.length; ++ii) {
            var node = this._lstProbar[ii];

            if(node)
                node.setVisible(visible);
        }
    },

    //!设置方向
    setDirection: function (dir) {
        for(var ii = 0; ii < this._lstProbar.length; ++ii) {
            var node = this._lstProbar[ii];

            if(node)
                node.setDirection(dir);
        }
    },

    //! 设置百分比
    setPercent: function (percent) {
        for(var ii = 0; ii < this._lstProbar.length; ++ii) {
            var node = this._lstProbar[ii];

            if(node)
                node.setPercent(percent);
        }
    },

    //! 获取百分比
    getPercent: function () {
        for(var ii = 0; ii < this._lstProbar.length; ++ii) {
            var node = this._lstProbar[ii];

            if(node)
                return node.getPercent();
        }

        return 0;
    },

    //! 销毁
    destory : function () {
        if(this._mgr && this._mgrname)
            this._mgr.removeSliderEx(this._mgrname);
    }
});
