var GameEmitterMgr = GameEmitterMgr || {};
var gameemittermgr = function () {

}
var gemitpro = gameemittermgr.prototype;
//注册事件，永续，手动删除
gemitpro.on = function (event, func,target) {
    this._callbacks = this._callbacks || {};
    if (this._callbacks[event] == undefined) {
        this._callbacks[event] = [];
    }
    var call={};
    call.func=func;
    call.target=target||this;
    this._callbacks[event].push(call);

}
// 注册事件，激活后删除
gemitpro.once = function (event, func,target) {
    this._callbacks = this._callbacks || {};
    var oldfunc=func;
    var oldtarget=target||this;
    var tempfunc = function () {
        this.off(event, tempfunc);
        oldfunc.apply(oldtarget, arguments)
    }
    tempfunc.func = func;
    this.on(event, tempfunc);
}
//移除事件，func为空，清除该event所有事件
gemitpro.off = function (event, func) {
    this._callbacks = this._callbacks || {};
    var callbacks=this._callbacks[event];
    if(callbacks==undefined){
        return;
    }
    //清除该event所有事件
    if(arguments.length==1){
        delete this._callbacks[event];
        return;
    }
    //删除指定方法
    var call=null;
    var callsl=callbacks.length;
    for(var i=callsl-1;i>=0;i--){
        call=callbacks[i];
        var callfunc=call.func;
        if(callfunc===func||callfunc.func===func){
            callbacks.splice(i,1);
            break;
        }
    }
}
//发射事件，可以给很多参数过来，argument会取值
gemitpro.emit = function (event) {
    this._callbacks = this._callbacks || {};
    var args=[].slice.call(arguments,1);
    var callbacks=this._callbacks[event];
    if(callbacks){
        callbacks = callbacks.slice(0);
        var callsl=callbacks.length;
        for(var i=callsl-1;i>=0;i--){
            var  call=callbacks[i];
            var func=call.func;
            var target=call.target;
            func.apply(target, args);
        }
    }
}
//是否有注册事件，返回事件个数
gemitpro.hasEvent=function(event){
    this._callbacks = this._callbacks || {};
    var funcs= this._callbacks[event]||[];
    return funcs.length;
}
GameEmitterMgr.instance = new gameemittermgr();