var WSCMsg_HallGameList = WSClientMsg.extend({
    msgid: MSGID_HALLGAMEINFO,

    onMsg: function (msgobj) {
        cc.log('onMsg ' + this.msgid + ':' + JSON.stringify(msgobj));

        //GameMgr.singleton.setGameList(msgobj.gamelist);
        if(msgobj.viewlevel == 0){
            //WholeChampionshipinfo = msgobj.championship;
        }
        if(GameMgr.singleton.halllayer && msgobj.viewlevel == 1){
            GameMgr.singleton.halllayer.hallgameinfo = msgobj;
            if(msgobj["normal"]){
                Wholehallgameinfo = msgobj["normal"];
                for (var i = 0; i < Wholehallgameinfo.length; i++){
                    var iseixt = isgameeixt(Wholehallgameinfo[i].gamecode);
                    if(!iseixt){
                        Wholehallgameinfo.splice(i,1);
                        i--;
                    }
                }
            }else if(msgobj["vip"]){
                Wholehallgameinfo = msgobj["vip"];
            }
            var temparr = [];

            for(var i = 0; i < Wholehallgameinfo.length;i++){
                if(Wholehallgameinfo[i].gamecode == "guhuozai"){
                    temparr.push(Wholehallgameinfo[i]);
                    Wholehallgameinfo.splice(i,1);
                    i--;
                }
                if(Wholehallgameinfo[i].gamecode == "boxingarena"){
                    temparr.push(Wholehallgameinfo[i]);
                    Wholehallgameinfo.splice(i,1);
                    i--;
                }
                if(Wholehallgameinfo[i].gamecode == "egyptian"){
                    temparr.push(Wholehallgameinfo[i]);
                    Wholehallgameinfo.splice(i,1);
                    i--;
                }
                if(Wholehallgameinfo[i].gamecode == "fantasyforest"){
                    temparr.push(Wholehallgameinfo[i]);
                    Wholehallgameinfo.splice(i,1);
                    i--;
                }
                if(Wholehallgameinfo[i].gamecode == "pethouse"){
                    temparr.push(Wholehallgameinfo[i]);
                    Wholehallgameinfo.splice(i,1);
                    i--;
                }
            }
            for(var i = 0; i < temparr.length; i++){
                Wholehallgameinfo.push(temparr[i]);
            }
            if(GameMgr.singleton.halllayer.gamenodelist && GameMgr.singleton.halllayer.gamenodelist.length>0){
                //GameMgr.singleton.halllayer.AnalysisRoomData(WholeCurViewType,WholeCurRoomType);
                if(Wholehallgameinfo && Wholehallgameinfo.length>0){
                    for (var i = 0; i < Wholehallgameinfo.length; i++){
                        if(GameMgr.singleton.halllayer.gamenodelist[i])
                            GameMgr.singleton.halllayer.gamenodelist[i].initdata(Wholehallgameinfo[i]);
                        //cc.log("全局定时器游戏--->",i);
                    }
                }
            }
            if(cc.sys.isNative) return;
            var datanormal = msgobj.normal ? msgobj.normal : {};
            var datavip = msgobj.vip ? msgobj.vip : {};
            var data = {};
            if(datanormal.length > 0) data = datanormal;
            if(datavip.length > 0) data = datavip;
            for(var i = 0; i < data.length; i++){
                HallData.setGameData(data[i].gamecode, 1, "isdownload");
            }

        }
        if(GameMgr.singleton.halllayer && msgobj.viewlevel == 2){
            Wholegamemachineinfo = msgobj;
            var data = GameMgr.singleton.halllayer.getGameMachineInfo(WholeCurViewType,WholeCurRoomType);
            if(GameMgr.singleton.halllayer.gamemachinelist && GameMgr.singleton.halllayer.gamemachinelist.length > 0){
                for(var i = 0; i < data.length; i++){
                    if(GameMgr.singleton.halllayer.gamemachinelist[i]){
                        GameMgr.singleton.halllayer.gamemachinelist[i].initdata(data[i],data[i].gamecode,i);
                        cc.log("全局定时器机台--->",i);
                    }
                }
            }
        }
        if(GameMgr.singleton.halllayer && msgobj.viewlevel == 3){
            Wholemylovergameinfo = msgobj;
            for (var i = 0; i < Wholemylovergameinfo["mylover"].length; i++){
                var iseixt = isgameeixt(Wholemylovergameinfo["mylover"][i].gamecode);
                if(!iseixt){
                    Wholemylovergameinfo["mylover"].splice(i,1);
                    i--;
                }
            }
            GameMgr.singleton.halllayer.AnalysisMyLoverData(3,2);
            if(GameMgr.singleton.halllayer.gamenodemyloverlist.length>0){

                for (var i = 0; i < GameMgr.singleton.halllayer.gamemylovedata.length; i++){
                    if(GameMgr.singleton.halllayer.gamenodemyloverlist[i]){
                        GameMgr.singleton.halllayer.gamenodemyloverlist[i].initdata(GameMgr.singleton.halllayer.gamemylovedata[i],true);
                        cc.log("全局定时器我的最爱游戏--->",i);
                    }
                }
            }
        }
        if(GameMgr.singleton.halllayer && msgobj.viewlevel == 4){
            Wholemylovermachineinfo = msgobj;
            var data = GameMgr.singleton.halllayer.getGameMachineMyLoveInfo(WholeCurViewType,WholeCurRoomType);
            if(GameMgr.singleton.halllayer.gamemachinemyloverlist.length > 0){
                for(var i = 0; i < data.length; i++){
                    if(GameMgr.singleton.halllayer.gamemachinemyloverlist[i]){
                        GameMgr.singleton.halllayer.gamemachinemyloverlist[i].initdata(data[i],data[i].gamecode,i);
                        cc.log("全局定时器我的最爱机台--->",i);
                    }
                }
            }
        }
    }
});

MainClient.singleton.addMsg(new WSCMsg_HallGameList());