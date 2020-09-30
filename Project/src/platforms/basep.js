//基础类
//callbackRegister，框架platform自身注册回调，用来响应游戏层操作
//messageRegister，接受服务器私有消息，不同外接服务器中间流程可能有差异化的中间状态,命名不要通用化
var Basep = cc.Class.extend({
    ctor: function () {
        this.callFuncs = {};
        this.logicctrl = null;
        this.callbackRegister();
        this.messageRegister();
    },
    specialCallFun: function (funname,args) {
        var callfunc = this.callFuncs[funname];
        if (callfunc != undefined) {
            if(args!=undefined){
                callfunc.apply(this, args);
                return;
            }
            callfunc.apply(this);
        }
    },
    registerCallFun: function (funname, callback) {
        if (typeof (funname) != 'string' || typeof (callback) != 'function') {
            return;
        }
        this.callFuncs[funname] = callback;
    },
    attachLogic: function (logicobj) {
        this.logicctrl = logicobj;
    },
});