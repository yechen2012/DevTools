var g_resources = [];

if(typeof(GameAssistant) == 'undefined' || !GameAssistant.singleton.bNative) {
    for (var i in res) {
        if(typeof(cc) != 'undefined' && typeof(cc.loader) != 'undefined' && typeof(cc.loader._fixUrl) != 'undefined')
            res[i] = cc.loader._fixUrl(res[i]);
			
        g_resources.push(res[i]);
    }
}