var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;

var WSClientCmd = cc.Class.extend({
	cmdid: '',
	wsc: null
});

var WSClientMsg = cc.Class.extend({
	msgid: ''
});

var WSClientState = {};

WSClientState.NULL 			= 0;	// 未初始化
WSClientState.INIT 			= 1;	// 初始化
WSClientState.CONNECTED 	= 2;	// 连接上
WSClientState.CONNECTING 	= 3;	// 连接中
WSClientState.CLOSE 		= 4;	// 主动断开
WSClientState.DISCONNECTION = 5;	// 被动断开

var WSClient = cc.Class.extend({
	_host: '',
	_ws: null,

	_funcOpen: null,
	_funcError: null,
	_funcClose: null,

	lstCmdCallback: [],		// {cmdid, msgobj, callback}

	mapCmd: {},
	_mapMsg: {},

	//lstCmdCache: [],

	ctor: function () {
		cc.log('WSClient.ctor');
		this.wscstate = WSClientState.NULL;

		this._curCmd = undefined;
	},

	init: function (host, funcOpen, funcError, funcClose) {
		if (this.wscstate != WSClientState.NULL) {
			cc.log('WSClient.init fail!');

			return ;
		}

        var selfwebsocket = this;

		selfwebsocket.timerOnSecond = setInterval(function () {
			selfwebsocket.onSecond();
		}, 1000);

        selfwebsocket.timerOnUpdate = setInterval(function () {
            selfwebsocket.onUpdate();
        }, 5);

		selfwebsocket.timeKeepalive = 0;
		selfwebsocket.timeReconnect = 0;
		selfwebsocket.numsReconnect = 0;
		selfwebsocket.timeTimeOut = getCurTime();

		selfwebsocket.lstCmdCallback = [];
		selfwebsocket._host = host;
		//self._ws = new WebSocket(host);

		if (funcOpen) {
			selfwebsocket._funcOpen = funcOpen;
		}

		if (funcError) {
			selfwebsocket._funcError = funcError;
		}

		if (funcClose) {
			selfwebsocket._funcClose = funcClose;
		}

        //self._ws.onopen = function(evt) {
			//self.onOpen(evt);
        //};
        //
        //self._ws.onmessage = function(evt) {
			//cc.log('onmessage ' + evt.data);
        //	self.onMessage(evt.data);
        //};
        //
        //self._ws.onerror = function(evt) {
        //	self.onError(evt);
        //};
        //
        //self._ws.onclose = function(evt) {
        //	self.onClose(evt);
        //};

		selfwebsocket.wscstate = WSClientState.INIT;

		cc.log('WSClient init ' + host + ' ...');

		selfwebsocket.connect();
	},

	//onProcCmd_cmdret: function (cmdid) {
	//	if (this.lstCmdCache.length > 0) {
	//		if (this.lstCmdCache[0].cmdid == cmdid) {
	//			this.lstCmdCache.shift();
	//		}
	//	}
	//},
    //
	//onProcCmd_connected: function () {
	//	if (this.lstCmdCache.length > 0) {
    //
	//	}
	//},

	// 底层发现网络确实连不上了，才调用这个接口，提示客户端
	onDisconnection: function () {

	},

	reconnect: function () {
		var ct = getCurTime();
		if (this.timeReconnect == 0) {
			this.timeReconnect = ct;
		}

		this.numsReconnect++;

		if (this.numsReconnect > 3 && ct - this.timeReconnect > NetTime.RECONNECT_TIME) {
			this.onDisconnection();
		}
		else {
			this.connect();
		}
	},

	connect: function () {
		var selfwebsocket = this;

		selfwebsocket.wscstate = WSClientState.CONNECTING;

		cc.log('WSClient connect ' + selfwebsocket._host + ' ...');
		if(cc.sys.isNative){
            selfwebsocket._ws = new WebSocket(selfwebsocket._host,null,"cacert.pem");
		}else {
            selfwebsocket._ws = new WebSocket(selfwebsocket._host);
		}
		selfwebsocket._ws.onopen = function(evt) {
			selfwebsocket.onOpen(evt);
		};

		selfwebsocket._ws.onmessage = function(evt) {
			cc.log('onmessage ' + evt.data);
			selfwebsocket.onMessage(evt.data);
		};

		selfwebsocket._ws.onerror = function(evt) {
			selfwebsocket.onError(evt);
		};

		selfwebsocket._ws.onclose = function(evt) {
			selfwebsocket.onClose(evt);
		};

		if(typeof(CommonServer) != 'undefined') {
			CommonServer.singleton.initCommonServer();
		}
	},

	onOpen: function (evt) {
		var selfwebsocket = this;

		selfwebsocket.wscstate = WSClientState.CONNECTED;

		cc.log('WSClient open ' + selfwebsocket._host);

		// selfwebsocket.onCmdCallback_connected();

		if (selfwebsocket._funcOpen) {
			selfwebsocket._funcOpen(evt);
		}

		// selfwebsocket.onCmdCallback_connected();
	},

	onMessage: function (evt) {
        this.timeTimeOut = 0;

		var selfwebsocket = this;

		cc.log(evt);

		var msgobj = JSON.parse(evt);
		if (msgobj && msgobj.hasOwnProperty('msgid')) {
			if (selfwebsocket._mapMsg.hasOwnProperty(msgobj.msgid)) {
				selfwebsocket._mapMsg[msgobj.msgid].onMsg(msgobj);
			}
		}
	},

	onError: function (evt) {
        var selfwebsocket = this;

		cc.log('WSClient error.');

		if (selfwebsocket._funcError) {
			selfwebsocket._funcError(evt);
		}
	},

	onClose: function (evt) {
		// if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative)
		this.clearCmd();

        var selfwebsocket = this;

		cc.log('WSClient close.');

		if (selfwebsocket._funcClose) {
			selfwebsocket._funcClose(evt);
		}

		selfwebsocket._ws = null;

		if (selfwebsocket.wscstate != WSClientState.NULL) {
			selfwebsocket.wscstate = WSClientState.DISCONNECTION;

			selfwebsocket.reconnect();
		}
	},

	send: function (msgobj, callback) {
		//if (callback == undefined) {
		//	callback = function (isok) {};
		//}

		if (this.wscstate != WSClientState.CONNECTED) {
			this.onError(undefined);

			return ;
		}

		this._addCmdCallback(msgobj.cmdid, msgobj, callback);
		this._send(msgobj);
	},

	clearCmd: function () {
		this.lstCmdCallback.splice(0, this.lstCmdCallback.length);
		this._curCmd = undefined;
	},

	_send: function (msgobj) {
		// if (this._ws != null) {
		// 	this._ws.send(JSON.stringify(msgobj));
        //
		// 	//cc.log(JSON.stringify(msgobj));
		// }
        //
		// cc.log(JSON.stringify(msgobj));
        //
		// if (this.timeTimeOut == 0) {
		// 	this.timeTimeOut = getCurTime();
		// }

        if (this._ws != null) {
        	if(this._curCmd == undefined && this.lstCmdCallback.length > 0) {
				for(var ii = 0; ii < this.lstCmdCallback.length; ++ii) {
                    if(this.lstCmdCallback[ii].sendstate == 0) {
                        this._curCmd = this.lstCmdCallback[ii];
                        this._curCmd.sendstate = 1;

                        var cmsg = this._curCmd.msgobj;
                        this._ws.send(JSON.stringify(cmsg));

                        cc.log(JSON.stringify(cmsg));

                        if (this.timeTimeOut == 0) {
                            this.timeTimeOut = getCurTime();
                        }

                        this._bSendMsg = true;
                        return ;
					}
				}
			}
        }
	},

	addCmd: function (cmd) {
		cmd.wsc = this;

		this.mapCmd[cmd.cmdid] = cmd;
	},

	addMsg: function (msg) {
		this._mapMsg[msg.msgid] = msg;
	},

	_addCmdCallback: function (cmdid, msgobj, callback) {
		//if (cmdid == 'keepalive') {
		//	return ;
		//}
		cc.log('_addCmdCallback ' + cmdid);
		this.lstCmdCallback.push({cmdid: cmdid, msgobj: msgobj, callback: callback, sendstate: 0});
	},

	onCmdCallback: function (cmdid, isok) {
		if (this.lstCmdCallback.length > 0) {
			cc.log('onCmdCallback1 ' + cmdid);
			cc.log('onCmdCallback2 ' + this.lstCmdCallback[0].cmdid);

			if (this.lstCmdCallback[0].cmdid == cmdid) {
				if (this.lstCmdCallback[0].callback != undefined) {
					this.lstCmdCallback[0].callback(isok);
				}

				if(this.lstCmdCallback[0].sendstate != 2) {
                    this.onMsgSendComplete(this.lstCmdCallback[0]);
					this._curCmd = undefined;
					this._send();
				}

				this.lstCmdCallback.shift();

				this.timeTimeOut = 0;
			}
		}
	},

	onCmdCallback_connected: function () {
		for (var ii = 0; ii < this.lstCmdCallback.length; ++ii) {
			if (this.lstCmdCallback[ii].cmdid == CMDID_CHECKVER || this.lstCmdCallback[ii].cmdid == CMDID_DTLOGIN) {
				continue ;
			}

			this._send(this.lstCmdCallback[ii].msgobj);
		}
	},

	// 每秒执行
	onSecond: function () {
		if (this.wscstate == WSClientState.CONNECTED) {
			var ct = getCurTime();

			if (this.timeTimeOut > 0) {
                if (ct - this.timeTimeOut > NetTime.TIMEOUT_TIME) {
                    this.timeTimeOut = 0;

                    this.closeWS();
                    //this._ws.close();
                }
            }

			if (ct - this.timeKeepalive > NetTime.KEEPALIVE_TIME) {
				this.onKeepalive();

				this.timeKeepalive = ct;
			}
		}
		else if (this.wscstate == WSClientState.DISCONNECTION) {

		}
	},

	onUpdate : function () {
		if(this._curCmd == undefined)
			return ;

        if (this._ws != null) {
			if(this._ws.bufferedAmount === 0) {
                this._curCmd.sendstate = 2;
                this.onMsgSendComplete(this._curCmd.msgobj);

                this._curCmd = undefined;
                this._send();
			}
        }
    },

    onMsgSendComplete : function (msgobj) {
	},

	onKeepalive: function () {

	},

	closeWS: function () {
        this.onError(undefined);
		if(this._ws)
			this._ws.close();
	},

	// logout时调用，不会重连，接下来会需要init才能正常
	forceClose: function () {
		var self = this;
		self.wscstate = WSClientState.NULL;
		if(this._ws)
			this._ws.close();
	}
});

WSClient.create = function (host, funcOpen, funcError, funcClose) {
	var wsclient = new WSClient();
	wsclient.init(host, funcOpen, funcError, funcClose);
	return wsclient;
};

