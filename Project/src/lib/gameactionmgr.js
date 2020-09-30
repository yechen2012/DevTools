/**
 * Created by admin on 2020/8/17.WJH
 */
//! 游戏特效管理者
var GameActionMgr = cc.Class.extend({
    ctor: function (root, mgr) {
        this._root = root;

        this._mgr = this._root.GameCanvasMgr;
        if(mgr)
            this._mgr = mgr;

        this._lstAction = [];      //!动画数组
        this._lstActionData = {}; //!初始化添加的动画群数据
        this._lstCallFunc = {};   //!初始化添加的动画群回调函数
    },

    //!根据名字播放某组动画
    play: function (name) {
        var data = this._lstActionData[name];

        var lst;
        if(cc.isArray(data)){
            lst = data;
        }
        else if(data.ani){
            lst = data.ani;
        }

        var obj = {};
        var lstani = [];
        for(var ii = 0; ii < lst.length; ii++){
            var ani = new ActionEx(lst[ii]);

            lstani.push(ani);
        }
        obj.ani = lstani;
        obj.name = name;
        this._lstAction.push(obj);
    },

    update: function (dt) {
        if(this._lstAction.length <= 0)
            return;

        for(var ii = 0; ii < this._lstAction.length; ii++){
            var node = this._lstAction[ii];
            for(var jj = 0; jj < node.ani.length; jj++){
                var ani = node.ani[jj];
                ani.update(dt);

                if(ani.isVia()){
                    node.ani.splice(jj, 1);
                    jj--;
                }
            }

            if(node.ani.length <= 0){
                this._lstAction.splice(ii, 1);
                ii--;

                if(this._lstCallFunc[node.name] && this._lstCallFunc[node.name].length > 0){
                    this._lstCallFunc[node.name][0].call(this._lstCallFunc[node.name][1]);
                }
            }
        }
    },

    //!注册某个动画群
    addActionData: function (anidata, aniname) {
        var name = aniname ? aniname : anidata.aniname;

        if(!name){
            cc.log('注册没有命名动画群');
            return;
        }
        this._lstActionData[name] = anidata;

        if(anidata.callFunc){
            var lstcall = [];
            lstcall.push(anidata.callFunc);
            lstcall.push(anidata.target);

            this._lstCallFunc[name] = lstcall;
        }
    },

    //!移除某个动画群
    removeAction:function(name){
        if(!name || !this._lstActionData[name])
            return false;

        this._lstActionData[name] = undefined;
        this._lstCallFunc[name] = undefined;
    },

    //!设置某个动画群回调函数
    setCallFunc: function (name, callFunc, target) {
        if(!callFunc)
            return;

        var lst = [];
        lst.push(callFunc);
        lst.push(target);

        this._lstCallFunc[name] = lst;
    }
});
