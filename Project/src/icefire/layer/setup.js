/**
 * Created by ssscomic on 2016/5/31.
 */

var IceFireSetupLayer = cc.Layer.extend({
    ctor:function (gamelayer) {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        var sdsetuplayer = ccs.load(res.IceFireSetupLayer_json);
        this.addChild(sdsetuplayer.node);

        this.gamelayer = gamelayer;

        var imgClick = findNodeByName(sdsetuplayer.node, "imgClick");
        imgClick.addTouchEventListener(this.onTouchClick, this);

        var btnHistory = findNodeByName(sdsetuplayer.node, "btnHistory");
        btnHistory.addTouchEventListener(this.onTouchHistory, this);

        var btnHelp = findNodeByName(sdsetuplayer.node, "btnHelp");
        btnHelp.addTouchEventListener(this.onTouchHelp, this);
    },

    onTouchClick : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.getParent().removeChild(this);
    },

    onTouchHistory : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.gamelayer.playBtnSound();
        //cc.sys.openURL(g_bkurl);
        open_history(g_bkurl);
        this.getParent().removeChild(this);
    },

    onTouchHelp : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        this.gamelayer.playBtnSound();
        open_help("dbz_help.html");
        //cc.sys.openURL("http://www.smzdm.com/");
        this.getParent().removeChild(this);
    },
});