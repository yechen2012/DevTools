
// 客户端网络层代理，考虑到可能多项目，所以将网络层和ui交互的部分独立出来
var WSCDelegate = cc.Class.extend({
    ctor: function () {
        //this._super();
    },

    // 连接成功
    onConnected: function () {
        //! 直接登录
        MainClient.singleton.autologin(function (isok) {
        });
    },

    // 断线
    onDisconnect: function () {

    },

    // 登录成功
    onLogin: function (isok) {
        //进大厅
        CurHallScene = new HallScene();
        cc.director.runScene(CurHallScene);
    },

    // 进入游戏成功
    onComeIn: function (isok) {

    }
});

//MainClient.singleton.setDelegate(new WSCDelegate());