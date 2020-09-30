var MaskLayer = cc.LayerColor.extend({
	_opacity: 50,
	ismove: false,
	
	ctor: function() {
		this._super();
		
		this.setOpacity(this._opacity);
		this.setContentSize(1280,960);
		this._initTouchListener();
	},
	_initTouchListener : function()
	{
		var that = this;
		var listener = cc.EventListener.create(
		{
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event)
			{
				if(that.visible == false) 
					return false;
				return true;
			},
			
			onTouchEnded: function (touch, event)
			{
				if(that.visible == false) return false;
				that._onTouchEnd();
			}
		})
		cc.eventManager.addListener(listener, this);
		this.listener = listener;
	},
	
	_onTouchEnd : function()
	{
		var that = this;
		//cc.log("点击面板");
		if(this.ismove){
			this.removeFromParent(true);
		}
	},

	setIsMove : function (b) {
		this.ismove = b;
    },

    // onExit : function () {
		// if(notice_framelayer){
    //         notice_framelayer.removeFromParent(true);
    //         notice_framelayer = null;
		// }
    //     this._super();
    // }
})