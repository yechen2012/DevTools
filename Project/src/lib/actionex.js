/**
 * Created by admin on 2020/8/18.
 */
var ActionEx = cc.Class.extend({
    ctor: function (data) {
        this._iState = "init";
        this._initData(data);
    },

    _initData: function (data) {
        var node = data.node;
        if(cc.isString(node))
            var ctrl = this._mgr.getCtrl(node);
        else
            ctrl = node;

        if(!ctrl)
            return;

        this._aninode = ctrl;
        this._anidata = data;
        this._callFunc = data.callFunc;
        this._target = data.target;
        this._bcall = false;

        this._playtime = 0;
        this._waittime = 0;
    },

    update: function (dt) {
        var data = this._anidata;
        if(!data)
            return;

        if(data.delaytime && data.delaytime > this._waittime){
            this._waittime += dt;
        }
        else{
            if(this._iState == "init"){
                this._playAni();
            }
            else {
                if (data.anitime && data.anitime > this._playtime)
                    this._playtime += dt;
            }
        }

        if(this._iState == "begin"){
            if(this.isEnd()){
                this.clear();
            }
        }
    },

    _playAni: function () {
        var data = this._anidata;
        var type = this._anidata.type;
        var node = this._aninode;
        switch(type){
            //!gmcarmature, gmcresource, gmcspine, gmcsprite
            case 0:
                node.play(data.aniname, data.bloop);
                break;
            //!gmcaction
            case 1:
                node.play(data.aniname, data.anidata);
                break;
            //!json
            case 2:
                node.node.runAction(node.action);
                node.action.gotoFrameAndPlay(data.aniname[0], data.aniname[1], data.bloop);
                break;
            //!默认是走多数流程
            default:
                node.play(data.aniname, data.bloop);
                break;
        }

        this._iState = "begin";
    },


    isEnd: function () {
        if(this._iState != "begin")
            return;

        var data = this._anidata;
        var type = this._anidata.type;
        var node = this._aninode;

        switch(type) {
            //!gmcarmature, gmcresource, gmcspine, gmcsprite
            case 0:
                if (node.isEnd && node.isEnd())
                    return true;
                break;
            //!gmcaction
            case 1:
                if (node.isEnd && node.isEnd())
                    return true;
                break;
            //!json
            case 2:
                if(data.anitime && data.anitime <= this._playtime){
                    if (data.callFunc && !this._bcall) {
                        data.callFunc.call(data.target);
                        this._bcall = true;
                    }
                }

                if (node.action.getCurrentFrame() == node.action.getDuration())
                    return true;
                break;
            //!默认是走多数流程
            default:
                if (node.isEnd && node.isEnd())
                    return true;
                break;
        }

        return false;
    },

    isVia: function () {
        return this._iState == "end";
    },

    clear: function () {
        if(this._callFunc && !this._bcall){
            this._callFunc.call(this._target);
            this._bcall = true;
        }

        this._anidata = undefined;
        this._iState = "end";
    }
});
