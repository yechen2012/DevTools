/**
 * Created by ssscomic on 2016/5/23.
 */
var Wheel2 = cc.Node.extend({
    ctor: function (laynode, lsticon, lstexicon, iconnum, iconw, iconh, iconsp, lstdownani, lstappearani, disappearani, endani, exani, appearsp, bdelay, edelay, ddelay, sdelay, lstNode, reverse, scales, xyOff, isAppearDelayTime) {

        this.isAppearDelayTime = isAppearDelayTime;
        //! 放到初始位置
        this.lsticonnode = [];
        this.lstnewicon = [];
        this.lsttopnode = [];
        //this.lsttopani = [];

        var arrNode = [];
        var nIndex = 0;
        var rnode = undefined;

        if (lstNode && lstNode.length === 3) {

            arrNode = lstNode;

            for (nIndex = 0; nIndex < iconnum; ++nIndex) {
                lstNode[nIndex].setCascadeOpacityEnabled(true);
            }
        }
        else {

            var lsize = laynode.getLayoutSize();

            var sbx = lsize.width / 2;
            var sby = Math.floor(lsize.height / 2 + (iconnum - 1) / 2 * iconsp);
            if (reverse) {
                sby = Math.floor(lsize.height / 2 - (iconnum - 1) / 2 * iconsp);
            }

            for (nIndex = 0; nIndex < iconnum; ++nIndex) {

                rnode = new cc.Node();
                if (scales && scales[nIndex]) {
                    rnode.scale = scales[nIndex];
                }
                laynode.addChild(rnode, nIndex);
                if (xyOff && xyOff[nIndex]) {
                    rnode.setPosition(sbx + xyOff[nIndex].x, sby + xyOff[nIndex].y);
                } else {
                    rnode.setPosition(sbx, sby);
                }
                rnode.setCascadeOpacityEnabled(true);
                if (reverse) {
                    rnode.setLocalZOrder(iconnum - nIndex);
                    sby += iconsp;
                } else {
                    sby -= iconsp;
                }
                arrNode.push(rnode);
            }

            this.lsize = lsize;
        }

        for (var ii = 0; ii < iconnum; ++ii) {
            var inode = {};

            // var rnode = new cc.Node();
            // laynode.addChild(rnode, ii);
            // rnode.setPosition(sbx, sby);
            // rnode.setCascadeOpacityEnabled(true);
            //rnode.setCascadeColorEnabled(true);

            rnode = arrNode[ii];

            var spr = new cc.Sprite();
            rnode.addChild(spr);
            // spr.setCascadeOpacityEnabled(true);
            // spr.setCascadeColorEnabled(true);

            inode.rnode = rnode;
            inode.spr = spr;
            inode.idata = -1;
            inode.newdelay = 0;
            inode.disappeardelay = 0;
            inode.enddelay = 0;
            inode.exdelay = 0;
            inode.bshowani = false;
            inode.showaninum = 0;
            inode.showiconanidelay = 0;
            inode.showexiconanidelay = 0;

            inode.chgdelay = 0;
            inode.newdata = -1;
            inode.chgindex = -1;
            inode.bchg = false;
            inode.bdischg = false;

            inode.adddata = -1;
            inode.adddelay = 0;

            inode.bkeep = false;

            // inode.chgiconanidelay = 0;
            // inode.chgdata = -1;
            // inode.chgdata = 0;

            this.lsticonnode.push(inode);

            // if (laytop != undefined) {
            //     var tspr = new cc.Sprite();
            //     laytop.addChild(tspr, 1);
            //     tspr.setPosition(sbx, sby);
            //     tspr.setVisible(false);
            //     //tspr.setBlendFunc(gl.ONE, gl.ONE);
            //
            //     this.lsttopnode.push(tspr);
            // }

            //sby -= iconsp;

            this.lstnewicon.push(-1);
        }

        this.laynode = laynode;
        this.iconnum = iconnum;
        this.iconw = iconw;
        this.iconh = iconh;
        this.iconsp = iconsp;
        this.appearsp = appearsp;
        this.bdelay = bdelay;
        this.edelay = edelay;
        this.ddelay = ddelay;
        this.sdelay = sdelay;
        this.lstNode = lstNode;
        this.reverse = reverse;
        this.scales = scales;
        this.xyOff = xyOff;
        this.lsticon = lsticon;
        this.lstexicon = lstexicon;
        this.lstdownani = lstdownani;
        this.lstappearani = lstappearani;
        this.disappearani = disappearani;
        this.endani = endani;
        this.exani = exani;

        this.lsticonlight = undefined;
        this.lstexiconlight = undefined;
        this.lsticonani = undefined;
        this.lstexiconani = undefined;

        this.lstalwaysshowani = [];

        this.iexstate = -1;      //! -1是不使用ex状态 >=0是使用哪种ex状态
        this.curstate = 0;       //! 轮子当前处于的状态 0等待补充 1全满 2等待下落 3补充动画中 4消除动画中 5下落动画中 6结束动画中 7显示ex 8展示图标中 9增加图标中　10变换图标中 11展示特殊图标动画

        this.iShowIconAniTime = 0;
        this.bPauseDisappearIcon = false;

        this.lstSoundOverlap = {};
        this.disappearSoundOverlap = undefined;
        this.disappearExSoundOverlap = undefined;

        this.laytopnode = undefined;

        // this.lstbicon = lstbicon;
        // this.lsticonani = lsticonani;

        // if (lstwheeldata != undefined)
        //     this.setWheelData(lstwheeldata, bindex, false);
        //
        // this.bRun = false;
        // this.RunTime = 0;
        // this.BeginAniTime = 0;
        // this.speed = 0;
        // this.StopIndex = -1;
        // this.bStoping = false;
        // this.layWheel = laynode;
        // this.layTopWheel = laytop;
        //
        // this.bShowTopIcon = true;
    },

    //!设置点击图标
    setTouchIcon: function (laywheel, glayer) {
        if (laywheel != undefined && glayer != undefined) {
            laywheel.addTouchEventListener(this.onTouchIcon, this);

            this.GameLayer = glayer;
            this.layWheel = laywheel;
        }
    },

    //!上层轮子
    setTopWheel: function (laytopnode, glayer) {
        if (laytopnode == undefined || laytopnode == null)
            return;

        var arrNode = [];
        var nIndex = 0;
        var rnode = undefined;

        if (this.lstNode && this.lstNode.length === 3) {

            arrNode = this.lstNode;

            for (nIndex = 0; nIndex < this.iconnum; ++nIndex) {
                this.lstNode[nIndex].setCascadeOpacityEnabled(true);
            }
        }
        else {

            var ltopsize = laytopnode.getLayoutSize();

            var sbx = ltopsize.width / 2;
            var sby = Math.floor(ltopsize.height / 2 + (this.iconnum - 1) / 2 * this.iconsp);
            if (this.reverse) {
                sby = Math.floor(ltopsize.height / 2 - (this.iconnum - 1) / 2 * this.iconsp);
            }

            for (nIndex = 0; nIndex < this.iconnum; ++nIndex) {

                rnode = new cc.Node();
                if (this.scales && this.scales[nIndex]) {
                    rnode.scale = this.scales[nIndex];
                }
                laytopnode.addChild(rnode, nIndex);
                if (this.xyOff && this.xyOff[nIndex]) {
                    rnode.setPosition(sbx + this.xyOff[nIndex].x, sby + this.xyOff[nIndex].y);
                } else {
                    rnode.setPosition(sbx, sby);
                }
                rnode.setCascadeOpacityEnabled(true);
                if (this.reverse) {
                    rnode.setLocalZOrder(this.iconnum - nIndex);
                    sby += this.iconsp;
                } else {
                    sby -= this.iconsp;
                }
                arrNode.push(rnode);
            }

            this.ltopsize = ltopsize;
        }

        for (var ii = 0; ii < this.iconnum; ++ii) {
            var tnode = {};
            rnode = arrNode[ii];

            var tspr = new cc.Sprite();
            rnode.addChild(tspr);

            tnode.rnode = rnode;
            tnode.tspr = tspr;
            tnode.idata = -1;
            tnode.tani = undefined;
            this.lsttopnode.push(tnode);
        }

        if (laytopnode != undefined && glayer != undefined) {
            laytopnode.addTouchEventListener(this.onTouchIcon, this);

            this.GameLayer = glayer;
        }

        this.laytopnode = laytopnode;
    },

    //!设置最上层轮子图标
    setTopWheelIcon: function (lsttopicon) {
        if (this.laytopnode == undefined)
            return;

        this.lstTopIcon = lsttopicon;
    },

    //!设置上层轮子动画
    setTopWheelAni: function (fgdaijiani) {
        this.AniFgDaiji = fgdaijiani;
    },

    //! 新增方法
    //! 每种图标使用特殊的出现动画
    addAppearAniEX: function (icon, lstappearaniex, soundname) {
        if (this.lstappearaniex == undefined) {
            this.lstappearaniex = {};
        }

        if (this.lstappearsoundex == undefined) {
            this.lstappearsoundex = {};
        }

        this.lstappearaniex['icon' + icon] = lstappearaniex;
        this.lstappearsoundex['icon' + icon] = soundname;
    },

    setDownAniEX: function (icon, lstdownaniex, soundname) {
        if (this.lstdownaniex == undefined) {
            this.lstdownaniex = {};
        }

        if (this.lstdownsoundex == undefined) {
            this.lstdownsoundex = {};
        }

        this.lstdownaniex['icon' + icon] = lstdownaniex;
        this.lstdownsoundex['icon' + icon] = soundname;
    },

    setWinSound: function (icon, soundname) {
        if (!this.lstwinsoundex) {
            this.lstwinsoundex = {};
        }

        this.lstwinsoundex['icon' + icon] = soundname;
    },

    setDownAni: function (icon, downAni, lstdownsound) {
        this._aniDown = downAni;

        if (this.lstdownsound == undefined) {
            this.lstdownsound = {};
        }

        this.lstdownsound['icon' + icon] = lstdownsound;
    },

    showDownAni: function (inode, icon, di) {
        if (!this._aniDown)
            return;

        inode.anidown = CcsResCache.singleton.load(this._aniDown);

        var sprIcon = findNodeByName(inode.anidown.node, "Sprite_1");
        sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
        this.addIconLightSprite(inode, sprIcon);

        inode.rnode.addChild(inode.anidown.node);
        inode.anidown.node.runAction(inode.anidown.action);
        inode.anidown.action.gotoFrameAndPlay(0, inode.anidown.action.getDuration(), false);

        if (this.lstdownsound || this.lstdownsound[icon]) {
            cc.audioEngine.playEffect(this.lstdownsound["icon" + icon][di], false);
        }
    },

    //! 设置图标展示动画
    setShowIconAni: function (lstshowiconani) {
        this.lstshowiconani = lstshowiconani;
    },

    //! 设置图标展示动画结束后是否显示图片
    setShowIconAniType: function (lstshowiconanitype) {
        this.lstshowiconanitype = lstshowiconanitype;
    },

    setDaiJiIconAni: function (lstdaijiiconani) {
        this.lstdaijiiconani = lstdaijiiconani;
    },

    setDisappearAni: function (disappearani) {
        this.disappearani = disappearani;
    },

    //! 显示某个图标的动画
    beginShowIconAni: function (index) {
        if (this.lstshowiconani == undefined) {
            this.disappearIcon(index);
            return;
        }

        if (index < 0 || index >= this.lsticonnode.length)
            return;

        var inode = this.lsticonnode[index];

        if (inode.idata < 0)
            return;

        if (this.curstate != 8)
            this.curstate = 8;

        inode.showiconanidelay = this.sdelay + 0.01;
    },

    //!显示特殊图标动画
    showExIconAni: function (index) {
        if (this.lstshowiconani == undefined) {
            this.disappearIcon(index);
            return;
        }

        if (index < 0 || index >= this.lsticonnode.length)
            return;

        var inode = this.lsticonnode[index];

        if (inode.idata < 0)
            return;

        if (this.curstate != 11)
            this.curstate = 11;

        inode.showexiconanidelay = this.sdelay + 0.01;
    },

    setSDelay: function (value) {
        this.sdelay = value;
    },

    //! 判断是否展示动画结束
    isShowIconAniEnd: function () {
        if (this.curstate != 8)
            return false;

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if (inode.bchg)
                continue;

            if (inode.ani != undefined) {
                if (inode.ani.action.getCurrentFrame() != inode.ani.action.getDuration())
                    return false;
            }

            if (inode.showiconanidelay > 0)
                return false;
        }

        return true;
    },

    //! 设置展示时间
    setShowIconAniTime: function (dtime) {
        this.iShowIconAniTime = dtime;
    },

    //! 设置图标数据
    setIconData: function (index, idata) {
        var inode = this.lsticonnode[index];
        inode.idata = idata;
    },

    //! 获取图标数据
    getIconData: function (index) {
        var inode = this.lsticonnode[index];
        return inode.idata;
    },

    //! 获取轮子上存在图标的数量
    getIconNum: function () {
        var num = 0;

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if (inode.idata < 0 || inode.disappeardelay > 0)
                continue;

            ++num;
        }

        return num;
    },

    //! 设置会被保留的图标
    keepIcon: function (index) {
        var inode = this.lsticonnode[index];

        if (inode.idata < 0)
            return;

        inode.bkeep = true;
    },

    //! 暂停下落
    pauseDisappearIcon: function (bpause) {
        this.bPauseDisappearIcon = bpause;
    },

    //! 是否还有图标动画在播放（雷神特殊使用）
    hasIconAni: function () {
        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if (inode.showiconanidelay > 0)
                return true;

            if (inode.chgdelay > 0)
                return true;

            if (inode.ani != undefined && inode.ani.action.getCurrentFrame() != inode.ani.action.getDuration())
                return true;
        }

        return false;
    },

    // //! 设置图标变化的动画，其中的每个node包括bicon、eicon和ani
    // setChgIconAni : function (lstchgiconani) {
    //     this.lstchgiconani = lstchgiconani;
    // },
    //
    // chgIcon : function (index) {
    //     if(this.lstchgiconani == undefined)
    //         return ;
    //
    //     if(index < 0 || index >= this.lsticonnode.length)
    //         return ;
    //
    //     var inode = this.lsticonnode[index];
    //
    //     if(inode.idata < 0)
    //         return ;
    //
    //     for(var ii = 0; ii < this.lstchgiconani.length; ++ii) {
    //         var cnode = this.lstchgiconani[ii];
    //
    //         if(inode.idata == cnode.bicon) {
    //
    //         }
    //     }
    //
    //     inode.chgiconanidelay = this.sdelay + 0.01;
    // },

    //! 设置增加图标的动画
    setAddIconAni: function (addani, sound) {
        this.addani = addani;
        this.addaniSound = sound;
    },

    //! 设置增加的icon
    setAddIcon: function (index, icon) {
        if (this.addani == undefined)
            return;

        if (index < 0 || index >= this.lsticonnode.length)
            return;

        var inode = this.lsticonnode[index];

        inode.adddata = icon;
    },

    //! 刷新增加
    refreshAddIcon: function () {
        if (this.addani == undefined) {
            this.curstate = 2;
            return;
        }

        var badd = false;

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if (inode.adddata >= 0) {
                inode.adddelay = 0.01;
                badd = true;
            }
        }

        if (badd)
            this.curstate = 9;
        else
            this.curstate = 2;
    },

    //! 设置消除图标回调函数
    setDisappearFunc: function (layer, func) {
        this.layDisappear = layer;
        this.funcDisappear = func;
    },

    createDaiJiAni: function (inode, icon) {

        if (inode.anidaiji) {
            CcsResCache.singleton.release(inode.anidaiji);
            inode.anidaiji = undefined;
        }

        var resani = this.getDaiJiIconRes(icon);

        inode.anidaiji = CcsResCache.singleton.load(resani);
        inode.anidaiji.node.setVisible(true);

        inode.rnode.addChild(inode.anidaiji.node);
        // inode.anidaiji.node.runAction(inode.anidaiji.action);
        // inode.anidaiji.action.gotoFrameAndPlay(0, inode.anidaiji.action.getDuration(), false);
    },

    //! 设置某个位置上的icon
    setIcon: function (index, icon) {
        if (index >= this.lsticonnode.length)
            return;

        var inode = this.lsticonnode[index];
        var tnode = this.lsttopnode[index];

        if (icon < 0) {
            inode.spr.setVisible(false);

            if (tnode != undefined && tnode.tspr != undefined)
                tnode.tspr.setVisible(tnode.idata == inode.idata && inode.spr.isVisible());

            if (inode.anidaiji) {
                inode.anidaiji.node.setVisible(false);
            }

            inode.idata = -1;
            return;
        }

        if (icon >= this.lsticon.length)
            return;

        inode.spr.setVisible(true);
        inode.idata = icon;

        var iconres = this.getIconRes(icon);
        var frame = cc.spriteFrameCache.getSpriteFrame(iconres);

        if (frame != undefined && frame != null) {
            inode.spr.setSpriteFrame(frame);

            var lres = this.getIconLightRes(icon);

            if (lres != undefined) {
                var frame = cc.spriteFrameCache.getSpriteFrame(lres);

                if (frame != undefined && frame != null) {
                    if (inode.sprlight == undefined) {
                        inode.sprlight = new cc.Sprite();
                        inode.spr.addChild(inode.sprlight);
                        inode.sprlight.setPosition(this.iconw / 2, this.iconh / 2);
                        inode.sprlight.setCascadeOpacityEnabled(true);
                    }

                    inode.sprlight.setSpriteFrame(frame);
                    inode.sprlight.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
                }
            }
        }

        if (this.lstdaijiiconani) {
            inode.spr.setVisible(false);
            this.createDaiJiAni(inode, icon);
        }

        if (this.laytopnode != undefined && tnode != undefined) {
            if (this.lstTopIcon != undefined) {
                for (var ii = 0; ii < this.lstTopIcon.length; ii++) {
                    if (icon == this.lstTopIcon[ii]) {
                        tnode.idata = icon;
                        tnode.tspr.setVisible(tnode.idata == inode.idata && inode.spr.isVisible());

                        var iconres = this.getIconRes(icon);
                        var frame = cc.spriteFrameCache.getSpriteFrame(iconres);

                        if (frame != undefined && frame != null) {
                            tnode.tspr.setSpriteFrame(frame);
                        }

                        break;
                    }
                    else {
                        tnode.tspr.setVisible(false);
                        tnode.idata = -1;
                    }
                }
            }
        }

        // else {
        //     inode.spr.setSpriteFrame(frame);
        // }
    },

    //! 设置展示图标回调函数
    setShowIconFunc: function (layer, func) {
        this.layShowIcon = layer;
        this.funcShowIcon = func;
    },

    //! 调整图标位置
    adjust: function () {
        this.clearIconAni();

        //! 下落
        var hasdown = false;

        for (var ii = this.iconnum - 1; ii > 0; --ii) {
            var inode = this.lsticonnode[ii];

            if (inode.idata < 0) {
                for (var jj = ii - 1; jj >= 0; --jj) {
                    var jnode = this.lsticonnode[jj];

                    if (jnode.idata >= 0) {
                        this.downIcon(jj, ii);
                        hasdown = true;
                        break;
                    }
                }
            }
        }

        if (hasdown)
            this.curstate = 5;
        else
            this.curstate = 0;
    },

    //! 图标下落
    downIcon: function (bindex, eindex) {
        if (bindex < 0 || eindex < 0)
            return;

        if (bindex >= this.lsticonnode.length || eindex >= this.lsticonnode.length)
            return;

        if (bindex >= eindex)
            return;

        var icon = this.lsticonnode[bindex].idata;

        this.setIcon(bindex, -1);
        this.setIcon(eindex, icon);

        var di = eindex - bindex;

        if (this.lstdownani != undefined && di < this.lstdownani.length) {
            var inode = this.lsticonnode[eindex];
            var tnode = this.lsttopnode[eindex];
            var bnode = this.lsttopnode[bindex];

            if (inode.bshowani) {
                inode.bshowani = false;
                inode.showaninum = 0;

                if (inode.ani != undefined) {
                    // inode.ani.node.stopAllActions();
                    // inode.rnode.removeChild(inode.ani.node);
                    this.removeIconLightSprite(inode.ani);
                    CcsResCache.singleton.release(inode.ani);
                    inode.ani = undefined;
                }
            }

            if (bnode != undefined && bnode.tani != undefined) {
                CcsResCache.singleton.release(bnode.tani);
                bnode.tani = undefined;

                if (bnode != undefined && bnode.tspr != undefined)
                    bnode.tspr.setVisible(false);
            }

            inode.spr.setVisible(false);

            if (tnode != undefined && tnode.tspr != undefined)
                tnode.tspr.setVisible(inode.spr.isVisible());

            if (inode.anidaiji) {
                inode.anidaiji.node.setVisible(false);
            }

            inode.ani = CcsResCache.singleton.load(this.lstdownani[di]);

            var sprIcon = findNodeByName(inode.ani.node, "sprIcon");
            sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
            this.addIconLightSprite(inode, sprIcon);

            inode.rnode.addChild(inode.ani.node);
            inode.ani.node.runAction(inode.ani.action);
            inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

            if (tnode != undefined) {
                if (tnode.tani != undefined) {
                    this.removeIconLightSprite(tnode.tani);
                    CcsResCache.singleton.release(tnode.tani);
                    tnode.tani = undefined;
                }

                tnode.tani = CcsResCache.singleton.load(this.lstdownani[di]);
                tnode.baniloop = false;

                var sprIcon = findNodeByName(tnode.tani.node, "sprIcon");
                sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                this.addIconLightSprite(inode, sprIcon);

                tnode.rnode.addChild(tnode.tani.node);
                tnode.tani.node.runAction(tnode.tani.action);
                tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
            }
        }
    },

    adjustEX: function () {
        //this.clearIconAni();

        //! 下落
        var hasdown = false;

        for (var ii = this.iconnum - 1; ii > 0; --ii) {
            var inode = this.lsticonnode[ii];

            if (inode.idata < 0) {
                for (var jj = ii - 1; jj >= 0; --jj) {
                    var jnode = this.lsticonnode[jj];

                    if (jnode.idata >= 0) {
                        this.downIconEX(jj, ii);
                        hasdown = true;
                        break;
                    }
                }
            }
        }

        if (hasdown)
            this.curstate = 5;
        else
            this.curstate = 0;
    },

    downIconEX: function (bindex, eindex) {
        if (bindex < 0 || eindex < 0)
            return;

        if (bindex >= this.lsticonnode.length || eindex >= this.lsticonnode.length)
            return;

        if (bindex >= eindex)
            return;

        var icon = this.lsticonnode[bindex].idata;

        var di = eindex - bindex;

        this.setIcon(bindex, -1);
        this.showDownAni(this.lsticonnode[bindex], icon, di);
        this.setIcon(eindex, icon);

        if (this.lstdownaniex) {
            var inode = this.lsticonnode[eindex];
            var tnode = this.lsttopnode[eindex];

            if (inode.bshowani) {
                inode.bshowani = false;
                inode.showaninum = 0;

                if (inode.ani != undefined) {
                    // inode.ani.node.stopAllActions();
                    // inode.rnode.removeChild(inode.ani.node);
                    this.removeIconLightSprite(inode.ani);
                    CcsResCache.singleton.release(inode.ani);
                    inode.ani = undefined;
                }
            }

            inode.spr.setVisible(false);

            if (tnode != undefined && tnode.tspr != undefined)
                tnode.tspr.setVisible(inode.spr.isVisible());

            if (inode.anidaiji) {
                inode.anidaiji.node.setVisible(false);
            }

            inode.ani = CcsResCache.singleton.load(this.lstdownaniex["icon" + icon][di]);

            // var sprIcon = findNodeByName(inode.ani.node, "sprIcon");
            // sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
            // this.addIconLightSprite(inode, sprIcon);

            inode.rnode.addChild(inode.ani.node);
            inode.ani.node.runAction(inode.ani.action);
            inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

            if (this.lstdownsoundex || this.lstdownsoundex[icon]) {
                cc.audioEngine.playEffect(this.lstdownsoundex["icon" + icon][di], false);
            }

            if (tnode != undefined) {
                if (tnode.tani != undefined) {
                    this.removeIconLightSprite(tnode.tani);
                    CcsResCache.singleton.release(tnode.tani);
                    tnode.tani = undefined;
                }

                tnode.tani = CcsResCache.singleton.load(this.lstdownaniex["icon" + icon][di]);
                tnode.baniloop = false;

                tnode.rnode.addChild(tnode.tani.node);
                tnode.tani.node.runAction(tnode.tani.action);
                tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
            }
        }
    },

    //! 设置新的局面
    setNewIcon: function (index, icon) {
        if (index < 0 || index >= this.lstnewicon.length)
            return;

        this.lstnewicon[index] = icon;
    },

    //! 清空新的局面
    clearNewIcon: function () {
        for (var ii = 0; ii < this.lstnewicon.length; ++ii)
            this.lstnewicon[ii] = -1;
    },

    //!　判断当前局面是否可以变成新局面
    canChgNew: function () {
        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            if (this.lsticonnode[ii].idata >= 0 && this.lsticonnode[ii].idata != this.lstnewicon[ii])
                return false;
        }

        return true;
    },

    //! 补充图标（之前应该检查局面是否可以变换）
    appearIcon: function () {
        this.clearIconAni();

        var delaytime = 0.01 + this.bdelay;
        var hasappear = false;

        for (var ii = this.lsticonnode.length - 1; ii >= 0; --ii) {
            var inode = this.lsticonnode[ii];
            var tnode = this.lsttopnode[ii];

            if (inode.idata >= 0) {
                if (inode.idata != this.lstnewicon[ii]) {
                    this.setIcon(ii, this.lstnewicon[ii]);
                }
            }
            else {
                if (this.lstnewicon[ii] >= 0) {
                    this.setIcon(ii, this.lstnewicon[ii]);

                    inode.spr.setVisible(false);

                    if (tnode != undefined && tnode.tspr != undefined)
                        tnode.tspr.setVisible(inode.spr.isVisible());

                    if (inode.anidaiji) {
                        inode.anidaiji.node.setVisible(false);
                    }

                    if (this.appearexdata == undefined)
                        inode.newdelay = delaytime;
                    else
                        inode.newdelay = this.getAppearDelayTime(ii);

                    delaytime += this.appearsp;
                    hasappear = true;
                }
            }
        }

        //this.clearNewIcon();

        if (hasappear)
            this.curstate = 3;
        else
            this.curstate = 1;
    },

    //!生成新局面图标（无需动画）
    appearNewIcon: function () {
        this.clearIconAni();

        for (var ii = this.lsticonnode.length - 1; ii >= 0; --ii) {
            var inode = this.lsticonnode[ii];

            if (inode.idata >= 0) {
                if (inode.idata != this.lstnewicon[ii]) {
                    this.setIcon(ii, this.lstnewicon[ii]);
                }
            }
            else {
                if (this.lstnewicon[ii] >= 0) {
                    this.setIcon(ii, this.lstnewicon[ii]);

                    //inode.spr.setVisible(false);
                }
            }
        }

        if (this.curstate != 1)
            this.curstate = 1;
    },

    //! 设置特殊补充参数
    setAppearEx: function (data, index) {
        this.appearexdata = data;
        this.appearexindex = index;
    },

    //! 取补充延时
    getAppearDelayTime: function (index) {
        if (this.appearexdata == undefined) {
            return 0.01 + this.bdelay + this.appearsp * (this.lsticonnode.length - 1 - index);
        }
        else {
            var xd = this.appearexdata.xb + this.appearexdata.xsp * this.appearexindex;
            var yd = this.appearexdata.yb + this.appearexdata.ysp * index;

            return Math.abs(xd) + Math.abs(yd) + 0.01;
        }
    },

    setDisAppear: function (data, index) {
        this.appearexDisdata = data;
        this.appearexDisindex = index;
    },

    getAppearDisDelayTime: function (index) {
        if (this.appearexDisdata == undefined) {
            return 0.01 + this.bdelay + this.appearsp * (this.lsticonnode.length - 1 - index);
        }
        else {
            var xd = this.appearexDisdata.xb + this.appearexDisdata.xsp * this.appearexDisindex;
            var yd = this.appearexDisdata.yb + this.appearexDisdata.ysp * index;

            return Math.abs(xd) + Math.abs(yd) + 0.01;
        }
    },

    quickAppearIcon: function () {
        this.clearIconAni();

        for (var ii = this.lsticonnode.length - 1; ii >= 0; --ii) {
            var inode = this.lsticonnode[ii];
            var tnode = this.lsttopnode[ii];

            this.setIcon(ii, this.lstnewicon[ii]);

            if (inode.anidaiji) {
                inode.anidaiji.node.setVisible(true);
            }
            else {
                inode.spr.setVisible(true);

                if (tnode != undefined && tnode.tspr != undefined)
                    tnode.tspr.setVisible(tnode.idata == inode.idata && inode.spr.isVisible());
            }
        }

        this.curstate = 1;
    },

    //! 设置当前的ex状态， 不使用传-1
    setExState: function (exstate) {
        if (exstate >= 0 && (this.lstexicon == undefined || exstate >= this.lstexicon.length))
            return;

        this.iexstate = exstate;
    },

    //! 取一个图标当前对应的资源
    getIconRes: function (icon) {
        if (this.iexstate < 0 || this.lstexicon == undefined || this.lstexicon.length <= this.iexstate)
            return this.lsticon[icon];

        var ires = this.lstexicon[this.iexstate][icon];

        if (ires == 0 || ires == undefined)
            return this.lsticon[icon];

        return ires;
    },

    getDaiJiIconRes: function (icon) {
        return this.lstdaijiiconani[icon];
    },

    //! 是否正在运行
    isRun: function () {
        return this.curstate == 3 || this.curstate == 4 || this.curstate == 5 || this.curstate == 6 || this.curstate == 8 || this.curstate == 11;
    },

    //! 取当前的状态
    getCurState: function () {
        return this.curstate;
    },

    //! 设置当前的状态
    setCurState: function (state) {
        this.curstate = state;

        if (!this.canAddIconAni())
            this.clearIconAni();
    },

    //! 消除相关
    disappearIcon: function (index) {
        if (index < 0 || index >= this.lsticonnode.length)
            return;

        var inode = this.lsticonnode[index];

        if (inode.idata < 0)
            return;

        if (inode.bkeep) {
            inode.bkeep = false;
            return;
        }

        if (this.curstate != 4)
            this.curstate = 4;

        inode.disappeardelay = this.ddelay + 0.01;

        if (this.bQuickDisappear != undefined && this.bQuickDisappear)
            this.disappearIcon_quick(index);
    },

    setQuickDisappear: function (bquick) {
        this.bQuickDisappear = bquick;
    },

    disappearIcon_quick: function (index) {
        var inode = this.lsticonnode[index];
        var tnode = this.lsttopnode[index];

        inode.disappeardelay = 0;

        inode.bshowani = false;
        inode.showaninum = 0;

        if (inode.ani != undefined) {
            this.removeIconLightSprite(inode.ani);
            CcsResCache.singleton.release(inode.ani);
            inode.ani = undefined;
        }

        inode.ani = CcsResCache.singleton.load(this.disappearani);
        inode.baniloop = false;

        var sprIcon = findNodeByName(inode.ani.node, "sprIcon");

        if (sprIcon) {
            sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
            this.addIconLightSprite(inode, sprIcon);
        }

        inode.rnode.addChild(inode.ani.node);
        inode.ani.node.runAction(inode.ani.action);
        inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

        if (tnode != undefined) {
            if (tnode.tani != undefined) {
                this.removeIconLightSprite(tnode.tani);
                CcsResCache.singleton.release(tnode.tani);
                tnode.tani = undefined;
            }

            tnode.tani = CcsResCache.singleton.load(this.disappearani);
            tnode.baniloop = false;

            var sprIcon2 = findNodeByName(tnode.tani.node, "sprIcon");
            if (sprIcon2) {
                sprIcon2.setSpriteFrame(inode.spr.getSpriteFrame());
                this.addIconLightSprite(inode, sprIcon2);
            }

            tnode.rnode.addChild(tnode.tani.node);
            tnode.tani.node.runAction(tnode.tani.action);
            tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
        }

        this.playDissappearSound(inode.idata);

        if (this.funcDisappear != undefined) {
            this.funcDisappear(this.layDisappear, this, index);
        }

        this.setIcon(index, -1);
    },

    //! 清空所有的图标
    clearIcon: function () {
        this.clearIconAni();

        var hasend = false;

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if (inode.idata >= 0) {

                //inode.enddelay = this.edelay + 0.01;

                if (this.appearexDisdata == undefined)
                    inode.enddelay = this.isAppearDelayTime ? (this.edelay + 0.01) * (this.lsticonnode.length - ii) : (this.edelay + 0.01);
                else
                    inode.enddelay = this.getAppearDisDelayTime(ii);

                hasend = true;
            }
        }

        if (hasend)
            this.curstate = 6;
        else
            this.curstate = 0;
    },

    //! 清空所有的图标
    clearAllIcon: function () {
        this.clearIconAni();

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            if (inode.idata >= 0) {

                this.setIcon(ii, -1);

            }
        }
    },

    //! 设置图标显示ex效果
    exIcon: function (index) {
        if (index < 0 || index >= this.lsticonnode.length)
            return;

        var inode = this.lsticonnode[index];

        if (inode.idata < 0)
            return;

        if (this.curstate != 4)
            this.curstate = 4;

        inode.exdelay = this.bdelay + 0.01;
    },

    //! 设置图标变化动画
    setChgIconAni: function (lst) {
        this.lstchgiconani = lst;
    },

    //!设置音效播放重叠
    setSoundOverlap: function (disappearSoundOverlap, disappearExSoundOverlap) {
        this.disappearSoundOverlap = disappearSoundOverlap;
        this.disappearExSoundOverlap = disappearExSoundOverlap;
    },

    //! 进行图标变化
    chgIcon: function (index, newicon, anindex, delay, bshowicon, bdischg) {
        if (index < 0 || index >= this.lsticonnode.length)
            return;

        if (this.lstchgiconani == undefined)
            return;

        if (anindex < 0 || anindex >= this.lstchgiconani.length)
            return;

        var inode = this.lsticonnode[index];

        inode.chgdelay = delay + 0.01;
        inode.newdata = newicon;
        inode.chgindex = anindex;

        if (bdischg != undefined)
            inode.bdischg = bdischg;

        if (bshowicon != undefined && bshowicon) {
            if (this.curstate != 8)
                this.curstate = 8;
        }
        else {
            if (this.curstate != 3)
                this.curstate = 3;
        }
    },

    update: function (dt) {
        this.refreshAlwaysShowAni();

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];
            if (inode.anidown != undefined) {
                if (inode.anidown.action.getCurrentFrame() === inode.anidown.action.getDuration()) {
                    CcsResCache.singleton.release(inode.anidown);
                    inode.anidown = undefined;
                }
            }
        }

        if (this.lstSoundOverlap != undefined) {
            this.lstSoundOverlap = {};
        }

        //! 停止掉落的情况下特殊处理图标变换的动画
        if (this.curstate == 8 && this.isShowIconAniEnd() && this.iShowIconAniTime <= 0 && this.bPauseDisappearIcon) {
            for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                var inode = this.lsticonnode[ii];

                if (inode.chgdelay > 0) {
                    bcanchg = false;
                    inode.chgdelay -= dt;

                    if (inode.chgdelay <= 0) {
                        inode.chgdelay = 0;

                        if (inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }

                        inode.ani = CcsResCache.singleton.load(this.lstchgiconani[inode.chgindex]);
                        inode.baniloop = false;

                        var sprIcon1 = findNodeByName(inode.ani.node, "sprIcon1");

                        if (sprIcon1)
                            sprIcon1.setSpriteFrame(inode.spr.getSpriteFrame());

                        var sprIcon2 = findNodeByName(inode.ani.node, "sprIcon2");

                        if (sprIcon2) {
                            var iconres2 = this.getIconRes(inode.newdata);
                            var frame2 = cc.spriteFrameCache.getSpriteFrame(iconres2);
                            sprIcon2.setSpriteFrame(frame2);
                        }

                        inode.rnode.addChild(inode.ani.node);
                        inode.ani.node.runAction(inode.ani.action);
                        inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
                        inode.spr.setVisible(false);

                        if (tnode != undefined) {
                            if (tnode.tani != undefined) {
                                this.removeIconLightSprite(tnode.tani);
                                CcsResCache.singleton.release(tnode.tani);
                                tnode.tani = undefined;
                            }

                            tnode.tani = CcsResCache.singleton.load(this.lstchgiconani[inode.chgindex]);
                            tnode.baniloop = false;

                            tnode.rnode.addChild(tnode.tani.node);
                            tnode.tani.node.runAction(tnode.tani.action);
                            tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
                            tnode.tspr.setVisible(false);

                            var sprIcon1 = findNodeByName(tnode.tani.node, "sprIcon1");

                            if (sprIcon1)
                                sprIcon1.setSpriteFrame(inode.spr.getSpriteFrame());

                            var sprIcon2 = findNodeByName(tnode.tani.node, "sprIcon2");

                            if (sprIcon2) {
                                var iconres2 = this.getIconRes(inode.newdata);
                                var frame2 = cc.spriteFrameCache.getSpriteFrame(iconres2);
                                sprIcon2.setSpriteFrame(frame2);
                            }

                        }

                        this.setIcon(ii, inode.newdata);

                        if (tnode != undefined && tnode.tspr != undefined)
                            tnode.tspr.setVisible(inode.spr.isVisible());

                        if (inode.anidaiji) {
                            inode.anidaiji.node.setVisible(false);
                        }

                        inode.newdata = -1;
                        inode.chgindex = -1;
                    }
                }

                // if(inode.ani != undefined) {
                //     if(!inode.baniloop && inode.ani.action.getCurrentFrame() == inode.ani.action.getDuration()) {
                //         this.removeIconLightSprite(inode.ani);
                //         CcsResCache.singleton.release(inode.ani);
                //         inode.ani = undefined;
                //
                //         inode.spr.setVisible(inode.idata >= 0);
                //     }
                // }

            }

            return;
        }

        var bcanchg = true;    //! 状态是否可以改变

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];
            var tnode = this.lsttopnode[ii];

            if (tnode != undefined && tnode.tani != undefined) {
                if (this.curstate != 8) {
                    if (!tnode.baniloop) {
                        bcanchg = false;
                        if (tnode.tani.action.getCurrentFrame() == tnode.tani.action.getDuration()) {
                            if (tnode.tani != undefined) {
                                this.removeIconLightSprite(tnode.tani);
                                CcsResCache.singleton.release(tnode.tani);
                                tnode.tani = undefined;
                            }
                        }
                    }
                }
            }

            if (inode.ani != undefined) {
                if (inode.bshowani) {
                    //! 是图标动画
                    if (inode.ani.action.getCurrentFrame() == inode.ani.action.getDuration()) {
                        if (inode.showaninum > 0) {
                            inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
                            --inode.showaninum;
                        }
                        else {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;

                            inode.bshowani = false;
                            inode.showaninum = 0;
                            if (inode.anidaiji) {
                                inode.anidaiji.node.setVisible(true);
                            }
                            else {
                                inode.spr.setVisible(true);

                                if (tnode != undefined && tnode.tspr != undefined)
                                    tnode.tspr.setVisible(tnode.idata == inode.idata && inode.spr.isVisible());
                            }
                        }
                    }
                }
                else {
                    if (this.curstate != 8) {
                        bcanchg = false;

                        if (!inode.baniloop && inode.ani.action.getCurrentFrame() == inode.ani.action.getDuration()) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;

                            var node = undefined;

                            if (inode.anidaiji) {
                                if (this.curstate != 4) {
                                    inode.anidaiji.node.setVisible(inode.idata >= 0);
                                }
                                else {
                                    if (this.lstshowiconanitype && this.lstshowiconanitype[inode.idata]) {
                                        inode.spr.setVisible(inode.idata >= 0);
                                    }
                                }
                            }
                            else {
                                inode.spr.setVisible(inode.idata >= 0);

                                if (tnode != undefined && tnode.tspr != undefined)
                                    tnode.tspr.setVisible(tnode.idata == inode.idata && inode.spr.isVisible());
                            }

                            //inode.spr.setVisible(inode.idata >= 0);

                            // if(this.curstate == 3 || this.curstate == 5) {
                            //     if(this.StopSoundName != undefined) {
                            //         cc.audioEngine.playEffect(this.StopSoundName, false);
                            //     }
                            // }
                            if (this.curstate == 3) {
                                if (this.C1SoundName instanceof Array) {
                                    if (inode.idata < this.C1SoundName.length && this.C1SoundName[inode.idata] != undefined && this.C1SoundName[inode.idata] != 0) {
                                        cc.audioEngine.playEffect(this.C1SoundName[inode.idata], false);
                                    }
                                }
                                else {
                                    if (this.C1SoundName != undefined && inode.idata == this.C1Num) {
                                        cc.audioEngine.playEffect(this.C1SoundName, false);
                                    }
                                }
                            }

                            if (inode.bchg) {
                                this.disappearIcon(ii);
                                inode.bchg = false;
                            }
                        }
                    }
                }
            }
            else if (inode.newdelay > 0) {
                bcanchg = false;
                inode.newdelay -= dt;

                if (inode.newdelay <= 0) {
                    inode.newdelay = 0;

                    if (inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if (inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    if (this.lstappearaniex != undefined && this.lstappearaniex['icon' + inode.idata] != undefined) {
                        inode.ani = CcsResCache.singleton.load(this.lstappearaniex['icon' + inode.idata][ii]);
                    }
                    else {
                        inode.ani = CcsResCache.singleton.load(this.lstappearani[ii]);
                    }

                    inode.baniloop = false;

                    var sprIcon = findNodeByName(inode.ani.node, "sprIcon");

                    if (sprIcon) {
                        sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                        this.addIconLightSprite(inode, sprIcon);
                    }

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

                    if (tnode != undefined) {
                        if (tnode.tani != undefined) {
                            this.removeIconLightSprite(tnode.tani);
                            CcsResCache.singleton.release(tnode.tani);
                            tnode.tani = undefined;
                        }

                        if (this.lstappearaniex != undefined && this.lstappearaniex['icon' + inode.idata] != undefined) {
                            tnode.tani = CcsResCache.singleton.load(this.lstappearaniex['icon' + inode.idata][ii]);
                        }
                        else {
                            tnode.tani = CcsResCache.singleton.load(this.lstappearani[ii]);
                        }

                        tnode.baniloop = false;

                        var sprIcon = findNodeByName(tnode.tani.node, "sprIcon");

                        if (sprIcon) {
                            sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                            this.addIconLightSprite(inode, sprIcon);
                        }

                        tnode.rnode.addChild(tnode.tani.node);
                        tnode.tani.node.runAction(tnode.tani.action);
                        tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
                    }

                    if (this.lstappearsoundex != undefined && this.lstappearsoundex['icon' + inode.idata] != undefined) {
                        cc.audioEngine.playEffect(this.lstappearsoundex['icon' + inode.idata], false);
                    }
                    else if (this.StopSoundName != undefined) {
                        cc.audioEngine.playEffect(this.StopSoundName, false);
                    }
                }
            }
            else if (inode.disappeardelay > 0) {
                bcanchg = false;
                inode.disappeardelay -= dt;

                if (inode.disappeardelay <= 0) {
                    inode.disappeardelay = 0;

                    if (inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if (inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    if (this.disappearani instanceof Array) {
                        inode.ani = CcsResCache.singleton.load(this.disappearani[inode.idata]);
                    } else {
                        inode.ani = CcsResCache.singleton.load(this.disappearani);
                    }
                    inode.baniloop = false;

                    var sprIcon = findNodeByName(inode.ani.node, "sprIcon");

                    if (sprIcon) {
                        sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                        this.addIconLightSprite(inode, sprIcon);
                    }

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

                    if (tnode != undefined) {
                        if (tnode.tani != undefined) {
                            this.removeIconLightSprite(tnode.tani);
                            CcsResCache.singleton.release(tnode.tani);
                            tnode.tani = undefined;
                        }

                        if (this.disappearani instanceof Array) {
                            tnode.tani = CcsResCache.singleton.load(this.disappearani[inode.idata]);
                        } else {
                            tnode.tani = CcsResCache.singleton.load(this.disappearani);
                        }

                        tnode.baniloop = false;

                        tnode.rnode.addChild(tnode.tani.node);
                        tnode.tani.node.runAction(tnode.tani.action);
                        tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
                    }

                    this.playDissappearSound(inode.idata);

                    if (this.funcDisappear != undefined) {
                        this.funcDisappear(this.layDisappear, this, ii);
                    }

                    this.setIcon(ii, -1);
                }
            }
            else if (inode.enddelay > 0) {
                bcanchg = false;
                inode.enddelay -= dt;

                if (inode.enddelay <= 0) {
                    inode.enddelay = 0;

                    if (inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if (inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    if (this.endani instanceof Array) {
                        inode.ani = CcsResCache.singleton.load(this.endani[inode.idata]);
                    } else {
                        inode.ani = CcsResCache.singleton.load(this.endani);
                    }
                    inode.baniloop = false;

                    var sprIcon = findNodeByName(inode.ani.node, "sprIcon");
                    if (sprIcon) {
                        sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                        this.addIconLightSprite(inode, sprIcon);
                    } else {
                        var aniIcon = findNodeByName(inode.ani.node, "aniIcon");
                        if (aniIcon) {
                            aniIcon.animation.play(aniIcon.animation.getCurrentMovementID(), -1, 0);
                        }
                    }

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

                    if (tnode != undefined) {
                        if (tnode.tani != undefined) {
                            this.removeIconLightSprite(tnode.tani);
                            CcsResCache.singleton.release(tnode.tani);
                            tnode.tani = undefined;
                        }

                        if (this.endani instanceof Array) {
                            tnode.tani = CcsResCache.singleton.load(this.endani[inode.idata]);
                        } else {
                            tnode.tani = CcsResCache.singleton.load(this.endani);
                        }
                        tnode.baniloop = false;

                        var sprIcon = findNodeByName(tnode.tani.node, "sprIcon");
                        if (sprIcon) {
                            sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                            this.addIconLightSprite(inode, sprIcon);
                        } else {
                            var aniIcon = findNodeByName(tnode.tani.node, "aniIcon");
                            if (aniIcon) {
                                aniIcon.animation.play(aniIcon.animation.getCurrentMovementID(), -1, 0);
                            }
                        }

                        tnode.rnode.addChild(tnode.tani.node);
                        tnode.tani.node.runAction(tnode.tani.action);
                        tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
                        tnode.tspr.setVisible(false);
                    }

                    this.setIcon(ii, -1);
                }
            }
            else if (inode.exdelay > 0) {
                bcanchg = false;
                inode.exdelay -= dt;

                if (inode.exdelay <= 0) {
                    inode.exdelay = 0;

                    if (inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if (inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }
                    if (this.exani instanceof Array) {
                        inode.ani = CcsResCache.singleton.load(this.exani[inode.idata]);
                    } else {
                        inode.ani = CcsResCache.singleton.load(this.exani);
                    }
                    inode.baniloop = false;

                    var sprIcon = findNodeByName(inode.ani.node, "sprIcon");

                    if (sprIcon) {
                        sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                        this.addIconLightSprite(inode, sprIcon);
                    }

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

                    if (tnode != undefined) {
                        if (tnode.tani != undefined) {
                            this.removeIconLightSprite(tnode.tani);
                            CcsResCache.singleton.release(tnode.tani);
                            tnode.tani = undefined;
                        }

                        if (this.exani instanceof Array) {
                            tnode.tani = CcsResCache.singleton.load(this.exani[inode.idata]);
                        } else {
                            tnode.tani = CcsResCache.singleton.load(this.exani);
                        }
                        tnode.baniloop = false;

                        tnode.rnode.addChild(tnode.tani.node);
                        tnode.tani.node.runAction(tnode.tani.action);
                        tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
                        tnode.tspr.setVisible(false);

                        var sprIcon = findNodeByName(tnode.tani.node, "sprIcon");

                        if (sprIcon) {
                            sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                            this.addIconLightSprite(inode, sprIcon);
                        }
                    }

                    //this.setIcon(ii, -1);
                }
            }
            else if (inode.showiconanidelay > 0) {
                bcanchg = false;
                inode.showiconanidelay -= dt;

                if (inode.showiconanidelay <= 0) {
                    inode.showiconanidelay = 0;

                    if (inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if (inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    inode.ani = CcsResCache.singleton.load(this.lstshowiconani[inode.idata]);
                    inode.baniloop = false;

                    // if(this.lstshowiconanitype && this.lstshowiconanitype[inode.idata])
                    // {
                    //     var sprIcon = findNodeByName(inode.ani.node, "sprIcon");
                    //     sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                    //     this.addIconLightSprite(inode, sprIcon);
                    // }

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
                    inode.spr.setVisible(false);

                    if (tnode != undefined) {
                        if (tnode.tani != undefined) {
                            this.removeIconLightSprite(tnode.tani);
                            CcsResCache.singleton.release(tnode.tani);
                            tnode.tani = undefined;
                        }

                        tnode.tani = CcsResCache.singleton.load(this.lstshowiconani[inode.idata]);
                        tnode.baniloop = false;

                        tnode.rnode.addChild(tnode.tani.node);
                        tnode.tani.node.runAction(tnode.tani.action);
                        tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
                        tnode.tspr.setVisible(false);
                    }

                    if (inode.anidaiji) {
                        inode.anidaiji.node.setVisible(false);
                    }

                    if (this.funcShowIcon != undefined) {
                        this.funcShowIcon(this.layShowIcon, this, ii);
                    }

                    if (this.lstwinsoundex != undefined && this.lstwinsoundex['icon' + inode.idata] != undefined) {
                        cc.audioEngine.playEffect(this.lstwinsoundex['icon' + inode.idata], false);
                    }
                    else if (this.RunSoundName != undefined) {
                        cc.audioEngine.playEffect(this.RunSoundName, false);
                    }

                    // this.setIcon(ii, -1);
                    //
                    // this.playDissappearSound();
                }
            }
            else if (inode.showexiconanidelay > 0) {
                bcanchg = false;
                inode.showexiconanidelay -= dt;

                if (inode.showexiconanidelay <= 0) {
                    inode.showexiconanidelay = 0;

                    if (inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if (inode.ani != undefined) {
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    inode.ani = CcsResCache.singleton.load(this.lstshowiconani[inode.idata]);
                    inode.baniloop = false;

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
                    inode.spr.setVisible(false);

                    if (tnode != undefined) {
                        if (tnode.tani != undefined) {
                            this.removeIconLightSprite(tnode.tani);
                            CcsResCache.singleton.release(tnode.tani);
                            tnode.tani = undefined;
                        }

                        tnode.tani = CcsResCache.singleton.load(this.lstshowiconani[inode.idata]);
                        tnode.baniloop = false;

                        tnode.rnode.addChild(tnode.tani.node);
                        tnode.tani.node.runAction(tnode.tani.action);
                        tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
                        tnode.tspr.setVisible(false);
                    }

                    if (inode.anidaiji) {
                        inode.anidaiji.node.setVisible(false);
                    }

                    if (this.lstwinsoundex != undefined && this.lstwinsoundex['icon' + inode.idata] != undefined) {
                        cc.audioEngine.playEffect(this.lstwinsoundex['icon' + inode.idata], false);
                    }
                    else if (this.RunSoundName != undefined) {
                        cc.audioEngine.playEffect(this.RunSoundName, false);
                    }
                }
            }
            else if (inode.chgdelay > 0/* && (!this.bPauseDisappearIcon || (this.isShowIconAniEnd() && this.iShowIconAniTime <= 0))*/) {
                bcanchg = false;
                inode.chgdelay -= dt;

                if (inode.chgdelay <= 0) {
                    inode.chgdelay = 0;

                    if (inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if (inode.ani != undefined) {
                            // inode.ani.node.stopAllActions();
                            // inode.rnode.removeChild(inode.ani.node);
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    this.setIcon(ii, inode.newdata);

                    inode.ani = CcsResCache.singleton.load(this.lstchgiconani[inode.chgindex]);
                    inode.baniloop = false;

                    var sprIcon1 = findNodeByName(inode.ani.node, "sprIcon1");

                    if (sprIcon1)
                        sprIcon1.setSpriteFrame(inode.spr.getSpriteFrame());

                    var sprIcon2 = findNodeByName(inode.ani.node, "sprIcon2");

                    if (sprIcon2) {
                        var iconres2 = this.getIconRes(inode.newdata);
                        var frame2 = cc.spriteFrameCache.getSpriteFrame(iconres2);
                        sprIcon2.setSpriteFrame(frame2);
                    }

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
                    inode.spr.setVisible(false);

                    if (tnode != undefined) {
                        if (tnode.tani != undefined) {
                            this.removeIconLightSprite(tnode.tani);
                            CcsResCache.singleton.release(tnode.tani);
                            tnode.tani = undefined;
                        }

                        tnode.tani = CcsResCache.singleton.load(this.lstchgiconani[inode.chgindex]);
                        tnode.baniloop = false;

                        tnode.rnode.addChild(tnode.tani.node);
                        tnode.tani.node.runAction(tnode.tani.action);
                        tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
                        tnode.tspr.setVisible(false);

                        var sprIcon1 = findNodeByName(tnode.tani.node, "sprIcon1");

                        if (sprIcon1)
                            sprIcon1.setSpriteFrame(inode.spr.getSpriteFrame());

                        var sprIcon2 = findNodeByName(tnode.tani.node, "sprIcon2");

                        if (sprIcon2) {
                            var iconres2 = this.getIconRes(inode.newdata);
                            var frame2 = cc.spriteFrameCache.getSpriteFrame(iconres2);
                            sprIcon2.setSpriteFrame(frame2);
                        }

                    }

                    if (inode.anidaiji) {
                        inode.anidaiji.node.setVisible(false);
                    }

                    inode.newdata = -1;
                    inode.chgindex = -1;

                    if (inode.bdischg) {
                        inode.bchg = true;
                        inode.bdischg = false;
                    }
                }
            }
            else if (inode.adddelay > 0) {
                bcanchg = false;
                inode.adddelay -= dt;

                if (inode.adddelay <= 0) {
                    inode.adddelay = 0;

                    if (inode.bshowani) {
                        inode.bshowani = false;
                        inode.showaninum = 0;

                        if (inode.ani != undefined) {
                            this.removeIconLightSprite(inode.ani);
                            CcsResCache.singleton.release(inode.ani);
                            inode.ani = undefined;
                        }
                    }

                    this.setIcon(ii, inode.adddata);
                    inode.adddata = -1;

                    inode.ani = CcsResCache.singleton.load(this.addani);
                    inode.baniloop = false;

                    var sprIcon = findNodeByName(inode.ani.node, "sprIcon");
                    sprIcon.setSpriteFrame(inode.spr.getSpriteFrame());
                    this.addIconLightSprite(inode, sprIcon);

                    inode.rnode.addChild(inode.ani.node);
                    inode.ani.node.runAction(inode.ani.action);
                    inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
                    inode.spr.setVisible(false);

                    if (tnode != undefined) {
                        if (tnode.tani != undefined) {
                            this.removeIconLightSprite(tnode.tani);
                            CcsResCache.singleton.release(tnode.tani);
                            tnode.tani = undefined;
                        }

                        tnode.tani = CcsResCache.singleton.load(this.addani);
                        tnode.baniloop = false;

                        tnode.rnode.addChild(tnode.tani.node);
                        tnode.tani.node.runAction(tnode.tani.action);
                        tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), false);
                        tnode.tspr.setVisible(false);
                    }

                    if (inode.anidaiji) {
                        inode.anidaiji.node.setVisible(false);
                    }

                    if (this.addaniSound != undefined) {
                        cc.audioEngine.playEffect(this.addaniSound, false);
                    }
                }
            }
        }

        //! 状态之间切换
        if (bcanchg) {
            if (this.curstate == 3)
                this.curstate = 1;
            else if (this.curstate == 4) {
                this.refreshAddIcon();
                //this.curstate = 2;
            }
            else if (this.curstate == 5)
                this.curstate = 0;
            else if (this.curstate == 6)
                this.curstate = 0;
            else if (this.curstate == 7)
                this.curstate = 0;
            else if (this.curstate == 9)
                this.curstate = 2;
            else if (this.curstate == 11)
                this.curstate = 1;
        }

        if (this.curstate == 8 && this.isShowIconAniEnd()) {
            if (this.iShowIconAniTime > 0) {
                this.iShowIconAniTime -= dt;

                if (this.iShowIconAniTime <= 0)
                    this.iShowIconAniTime = 0;
            }
            else if (!this.bPauseDisappearIcon) {
                for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                    var inode = this.lsticonnode[ii];

                    if (inode.ani != undefined && !inode.bchg) {
                        this.disappearIcon(ii);
                    }
                }

                if (this.curstate == 8) {
                    this.curstate = 4;
                }
            }
        }
    },

    //! 点击轮子
    onTouchIcon: function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return;

        if (this.isRun())
            return;

        if (!this.laytopnode && !this.layWheel)
            return;

        var lsize = sender.getLayoutSize();

        var pos = sender.getTouchEndPosition();
        var touchPoint = sender.convertToNodeSpace(pos);

        var apoint = sender.getAnchorPoint();

        var layx = sender.x - sender.width * apoint.x;
        var layy = sender.y - sender.height * apoint.y;

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            var spr = inode.rnode;
            var sx = spr.getPositionX();
            var sy = spr.getPositionY();

            if (touchPoint.x >= sx - lsize.width / 2 && touchPoint.x <= sx + lsize.width / 2 && touchPoint.y >= sy - this.iconh / 2 && touchPoint.y <= sy + this.iconh / 2) {
                var idata = inode.idata;

                //var wordPoint = this.layWheel.convertToWorldSpace(cc.p(0,0));   //转换为全局坐标
                //var tx = layx;
                //var ty = layy + sy;

                if (this.GameLayer.showIconTips)
                    this.GameLayer.showIconTips(idata, sender, spr);

                return;
            }
        }
    },

    //! 设置图标光效
    setIconLight: function (lsticonlight, lstexiconlight) {
        this.lsticonlight = lsticonlight;
        this.lstexiconlight = lstexiconlight;
    },

    //! 取一个图标当前对应的光效
    getIconLightRes: function (icon) {
        if (this.lsticonlight == undefined)
            return undefined;

        if (this.iexstate < 0 || this.lstexiconlight == undefined)
            return this.lsticonlight[icon];

        var ires = this.lstexiconlight[this.iexstate][icon];

        if (ires == 0)
            return this.lsticonlight[icon];

        return ires;
    },

    //! 添加图标对应的光效
    addIconLightSprite: function (inode, sprIcon) {
        var lres = this.getIconLightRes(inode.idata);

        if (lres == undefined)
            return;

        if (inode.sprlight == undefined || sprIcon == undefined || sprIcon == null)
            return;

        var sprlight = new cc.Sprite();
        sprIcon.addChild(sprlight);
        sprlight.setPosition(inode.sprlight.getPosition());
        sprlight.setSpriteFrame(inode.sprlight.getSpriteFrame());
        sprlight.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    },

    removeIconLightSprite: function (ani) {
        if (this.lsticonani == undefined)
            return;

        if (ani.node != undefined) {
            var sprIcon = findNodeByName(ani.node, "sprIcon");

            if (sprIcon)
                sprIcon.removeAllChildren();
        }
    },

    //! 设置图标动画
    setIconAni: function (lsticonani, lstexiconani) {
        this.lsticonani = lsticonani;
        this.lstexiconani = lstexiconani;
    },

    //! 取一个图标当前对应的动画
    getIconAniRes: function (icon) {
        if (this.lsticonani == undefined)
            return undefined;

        if (this.iexstate < 0 || this.lstexiconani == undefined)
            return this.lsticonani[icon];

        var ires = this.lstexiconani[this.iexstate][icon];

        if (ires == 0)
            return this.lsticonani[icon];

        return ires;
    },

    //! 清除所有的图标动画
    clearIconAni: function () {
        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];
            var tnode = this.lsttopnode[ii];

            if (inode.anidaiji) {
                inode.anidaiji.node.setVisible(true);
                continue;
            }

            if (inode.idata < 0 || !inode.bshowani)
                continue;

            inode.bshowani = false;
            inode.showaninum = 0;
            inode.spr.setVisible(true);

            if (tnode != undefined && tnode.tspr != undefined)
                tnode.tspr.setVisible(tnode.idata == inode.idata && inode.spr.isVisible());

            if (inode.ani != undefined) {
                // inode.ani.node.stopAllActions();
                // inode.rnode.removeChild(inode.ani.node);
                this.removeIconLightSprite(inode.ani);
                CcsResCache.singleton.release(inode.ani);
                inode.ani = undefined;
            }
        }
    },

    //! 判断是否可以添加图标动画
    canAddIconAni: function () {
        if (this.lsticonani == undefined && this.lstdaijiiconani == undefined)
            return false;

        if (this.curstate != 0 && this.curstate != 1)
            return false;

        return true;
    },

    //! 随机显示一个图标动画，如果没有可以显示的则返回false
    randomIconAni: function (num) {
        if (this.lsticonani == undefined)
            return false;

        if (this.curstate != 0 && this.curstate != 1)
            return false;

        var lstr = [];

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];
            var tnode = this.lsttopnode[ii];

            if (inode.idata < 0 || inode.bshowani)
                continue;

            if (inode.ani != undefined)
                continue;

            // if(this.lsticonani[inode.idata] == undefined || this.lsticonani[inode.idata] == 0)
            //     continue ;

            var ares = this.getIconAniRes(inode.idata);

            if (ares == undefined || ares == 0)
                continue;

            lstr.push(ii);
        }

        if (lstr.length <= 0)
            return false;

        var ri = Math.floor(Math.random() * lstr.length);
        var inode = this.lsticonnode[lstr[ri]];

        inode.bshowani = true;
        inode.showaninum = num - 1;
        inode.spr.setVisible(false);

        if (tnode != undefined && tnode.tspr != undefined)
            tnode.tspr.setVisible(tnode.idata == inode.idata && inode.spr.isVisible());

        var ares = this.getIconAniRes(inode.idata);
        inode.ani = CcsResCache.singleton.load(ares);

        inode.rnode.addChild(inode.ani.node);
        inode.ani.node.runAction(inode.ani.action);
        inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);

        return true;
    },

    //! 设置显示一个图标动画
    showIconAni: function (index, num) {
        if (this.lsticonani == undefined && this.lstdaijiiconani == undefined)
            return;

        if (this.curstate != 0 && this.curstate != 1)
            return;

        var inode = this.lsticonnode[index];
        var tnode = this.lsttopnode[index];

        if (inode.idata < 0 || inode.bshowani)
            return;

        if (inode.ani != undefined)
            return;

        var ares = this.getIconAniRes(inode.idata);

        if (ares == undefined || ares == 0)
            return;

        inode.bshowani = true;
        inode.showaninum = num - 1;
        inode.spr.setVisible(false);

        if (tnode != undefined && tnode.tspr != undefined)
            tnode.tspr.setVisible(tnode.idata == inode.idata && inode.spr.isVisible());

        if (inode.anidaiji) {
            inode.anidaiji.node.setVisible(false);
        }

        inode.ani = CcsResCache.singleton.load(ares);

        inode.rnode.addChild(inode.ani.node);
        inode.ani.node.runAction(inode.ani.action);
        inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
    },

    //! 某种图标全部显示动画
    showIconAni_data: function (data, num) {
        if (this.lsticonani == undefined)
            return;

        if (this.curstate != 0 && this.curstate != 1)
            return;

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];
            var tnode = this.lsttopnode[ii];

            if (inode.idata < 0 || inode.bshowani)
                continue;

            if (inode.ani != undefined)
                continue;

            if (inode.idata != data)
                continue;

            if (inode.newdelay > 0 || inode.disappeardelay > 0 || inode.enddelay > 0 || inode.exdelay > 0)
                continue;

            var ares = this.getIconAniRes(inode.idata);

            if (ares == undefined || ares == 0)
                continue;

            inode.bshowani = true;
            inode.showaninum = num - 1;
            inode.spr.setVisible(false);

            if (tnode != undefined && tnode.tspr != undefined)
                tnode.tspr.setVisible(tnode.idata == inode.idata && inode.spr.isVisible());

            if (this.AniFgDaiji && tnode != undefined) {
                if (tnode.tani == undefined) {
                    tnode.baniloop = true;
                    tnode.tani = CcsResCache.singleton.load(this.AniFgDaiji);

                    tnode.rnode.addChild(tnode.tani.node);
                    tnode.tani.node.runAction(tnode.tani.action);
                    tnode.tani.action.gotoFrameAndPlay(0, tnode.tani.action.getDuration(), true);
                }
            }
            else {
                inode.ani = CcsResCache.singleton.load(ares);

                inode.rnode.addChild(inode.ani.node);
                inode.ani.node.runAction(inode.ani.action);
                inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
            }
        }
    },

    //! 添加一直显示动画的图标
    addAlwaysShowAniIcon: function (data) {
        for (var ii = 0; ii < this.lstalwaysshowani.length; ++ii) {
            if (this.lstalwaysshowani[ii] == data)
                return;
        }

        this.lstalwaysshowani.push(data);
    },

    //! 刷新一直显示动画的图标
    refreshAlwaysShowAni: function () {
        if (this.lstalwaysshowani.length <= 0)
            return;

        if (this.lsticonani == undefined)
            return;

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];
            var tnode = this.lsttopnode[ii];

            if (inode.idata < 0 || inode.bshowani)
                continue;

            if (inode.ani != undefined)
                continue;

            if (!inode.spr.isVisible())
                continue;

            if (inode.newdelay > 0 || inode.disappeardelay > 0 || inode.enddelay > 0 || inode.exdelay > 0)
                continue;

            var bshow = false;

            for (var jj = 0; jj < this.lstalwaysshowani.length; ++jj) {
                if (inode.idata == this.lstalwaysshowani[jj]) {
                    bshow = true;
                    break;
                }
            }

            if (!bshow)
                continue;

            var ares = this.getIconAniRes(inode.idata);

            if (ares == undefined || ares == 0)
                continue;

            inode.bshowani = true;
            inode.showaninum = 9999;
            inode.spr.setVisible(false);

            if (tnode != undefined && tnode.tspr != undefined)
                tnode.tspr.setVisible(tnode.idata == inode.idata && inode.spr.isVisible());

            if (inode.anidaiji) {
                inode.anidaiji.node.setVisible(false);
            }

            inode.ani = CcsResCache.singleton.load(ares);

            inode.rnode.addChild(inode.ani.node);
            inode.ani.node.runAction(inode.ani.action);
            inode.ani.action.gotoFrameAndPlay(0, inode.ani.action.getDuration(), false);
        }
    },

    //! 取一个图标对应的真实
    getRealPosition: function (index) {
        var pos = {x: 0, y: 0};

        var inode = this.lsticonnode[index];

        if (this.laynode) {
            pos.x = this.laynode.getPositionX() + inode.rnode.getPositionX();
            pos.y = this.laynode.getPositionY() + inode.rnode.getPositionY();
        }
        else {
            pos = inode.rnode.getParent().convertToWorldSpace(inode.rnode.getPosition());
        }

        return pos;
    },

    // // getNewData : function() {
    // //     if(this.lstwheeldata == undefined)
    // //         return 0;
    // //
    // //     var anum = Math.floor(this.lsticonnode.length / 2) + 1;
    // //     var nindex = this.curdataindex + anum;
    // //
    // //     while(nindex >= this.lstwheeldata.length)
    // //         nindex -= this.lstwheeldata.length;
    // //
    // //     ++this.curdataindex;
    // //
    // //     while(this.curdataindex >= this.lstwheeldata.length)
    // //         this.curdataindex -= this.lstwheeldata.length;
    // //
    // //     //! 如果可以停止，则尝试快速停止
    // //     if(this.RunTime <= 0 && this.StopIndex >= 0) {
    // //         var bfind = false;
    // //
    // //         for(var ii = 0; ii <= anum; ++ii) {
    // //             var sindex = this.curdataindex + ii;
    // //
    // //             while(sindex < 0 )
    // //                 sindex += this.lstwheeldata.length;
    // //
    // //             while(sindex >= this.lstwheeldata.length)
    // //                 sindex -= this.lstwheeldata.length;
    // //
    // //             if(sindex == this.StopIndex) {
    // //                 bfind = true;
    // //                 break;
    // //             }
    // //         }
    // //
    // //         if(!bfind) {
    // //             if((this.lstwheeldata[nindex] == 0 && this.lstwheeldata[this.StopIndex] == 0) || (this.lstwheeldata[nindex] != 0 && this.lstwheeldata[this.StopIndex] != 0)) {
    // //                 nindex = this.StopIndex;
    // //                 this.curdataindex = nindex - anum + 1;
    // //
    // //                 while(this.curdataindex < 0 )
    // //                     this.curdataindex += this.lstwheeldata.length;
    // //
    // //                 while(this.curdataindex >= this.lstwheeldata.length)
    // //                     this.curdataindex -= this.lstwheeldata.length;
    // //             }
    // //             else {
    // //                 nindex = this.StopIndex - 1;
    // //
    // //                 while(nindex < 0 )
    // //                     nindex += this.lstwheeldata.length;
    // //
    // //                 while(nindex >= this.lstwheeldata.length)
    // //                     nindex -= this.lstwheeldata.length;
    // //
    // //                 this.curdataindex = nindex - anum + 1;
    // //
    // //                 while(this.curdataindex < 0 )
    // //                     this.curdataindex += this.lstwheeldata.length;
    // //
    // //                 while(this.curdataindex >= this.lstwheeldata.length)
    // //                     this.curdataindex -= this.lstwheeldata.length;
    // //             }
    // //         }
    // //     }
    // //
    // //     return this.lstwheeldata[nindex];
    // // },
    //
    // getNewData: function () {
    //     if (this.lstwheeldata == undefined)
    //         return 0;
    //
    //     var anum = Math.floor(this.lsticonnode.length / 2) + 1;
    //     var nindex = this.curdataindex + anum;
    //
    //     while (nindex >= this.lstwheeldata.length)
    //         nindex -= this.lstwheeldata.length;
    //
    //     ++this.curdataindex;
    //
    //     while (this.curdataindex >= this.lstwheeldata.length)
    //         this.curdataindex -= this.lstwheeldata.length;
    //
    //     //! 如果可以停止，则尝试快速停止
    //     if (this.RunTime <= 0 && this.StopIndex >= 0) {
    //         var bfind = false;
    //
    //         for (var ii = 0; ii <= anum + 1; ++ii) {
    //             var sindex = this.curdataindex + ii;
    //
    //             while (sindex < 0)
    //                 sindex += this.lstwheeldata.length;
    //
    //             while (sindex >= this.lstwheeldata.length)
    //                 sindex -= this.lstwheeldata.length;
    //
    //             if (sindex == this.StopIndex) {
    //                 bfind = true;
    //                 break;
    //             }
    //         }
    //
    //         if (!bfind) {
    //             if ((this.lstwheeldata[nindex] == 0 && this.lstwheeldata[this.StopIndex] == 0) || (this.lstwheeldata[nindex] != 0 && this.lstwheeldata[this.StopIndex] != 0)) {
    //                 nindex = this.StopIndex - 2;
    //
    //                 while (nindex < 0)
    //                     nindex += this.lstwheeldata.length;
    //
    //                 while (nindex >= this.lstwheeldata.length)
    //                     nindex -= this.lstwheeldata.length;
    //
    //                 this.curdataindex = nindex - anum + 1;
    //
    //                 while (this.curdataindex < 0)
    //                     this.curdataindex += this.lstwheeldata.length;
    //
    //                 while (this.curdataindex >= this.lstwheeldata.length)
    //                     this.curdataindex -= this.lstwheeldata.length;
    //             }
    //             else {
    //                 nindex = this.StopIndex - 1;
    //
    //                 while (nindex < 0)
    //                     nindex += this.lstwheeldata.length;
    //
    //                 while (nindex >= this.lstwheeldata.length)
    //                     nindex -= this.lstwheeldata.length;
    //
    //                 this.curdataindex = nindex - anum + 1;
    //
    //                 while (this.curdataindex < 0)
    //                     this.curdataindex += this.lstwheeldata.length;
    //
    //                 while (this.curdataindex >= this.lstwheeldata.length)
    //                     this.curdataindex -= this.lstwheeldata.length;
    //             }
    //         }
    //     }
    //
    //     return this.lstwheeldata[nindex];
    // },
    //
    // //! 设置轮子数据
    // setWheelData: function (lstwheeldata, bindex, brefresh) {
    //     this.lstwheeldata = lstwheeldata;
    //
    //     this.setWheelIndex(bindex, brefresh);
    // },
    //
    // //! 设置当前轮子的位置
    // setWheelIndex: function (bindex, brefresh) {
    //     this.curdataindex = bindex;
    //
    //     while (this.curdataindex < 0)
    //         this.curdataindex += this.lstwheeldata.length;
    //
    //     while (this.curdataindex >= this.lstwheeldata.length)
    //         this.curdataindex -= this.lstwheeldata.length;
    //
    //     if (brefresh)
    //         this.refreshWheelDisplay();
    // },
    //
    // //! 刷新轮子显示
    // refreshWheelDisplay: function () {
    //     var inum = this.lsticonnode.length;
    //
    //     var cindex = this.curdataindex - Math.floor(inum / 2);
    //
    //     while (cindex < 0)
    //         cindex += this.lstwheeldata.length;
    //
    //     while (cindex >= this.lstwheeldata.length)
    //         cindex -= this.lstwheeldata.length;
    //
    //     for (var ii = 0; ii < inum; ++ii) {
    //         var idata = this.lstwheeldata[cindex];
    //         var icon = this.lsticon[idata];
    //
    //         this.lsticonnode[ii].idata = idata;
    //
    //         if (icon == undefined || icon == 0) {
    //             this.lsticonnode[ii].spr.setVisible(false);
    //         }
    //         else {
    //             var frame = cc.spriteFrameCache.getSpriteFrame(icon);
    //             this.lsticonnode[ii].spr.setSpriteFrame(frame);
    //             this.lsticonnode[ii].spr.setVisible(true);
    //             // this.lsticonnode[ii].spr.setBlendFunc(gl.ONE, gl.ONE);
    //             // this.lsticonnode[ii].spr.setOpacity(128);
    //         }
    //
    //         ++cindex;
    //
    //         if (cindex >= this.lstwheeldata.length)
    //             cindex = 0;
    //     }
    // },
    //
    // stopWheel: function (bplayeff) {
    //     this.showLightAni(false);
    //
    //     if (this.StopSoundName != undefined && bplayeff)
    //         cc.audioEngine.playEffect(this.StopSoundName, false);
    //
    //     for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //         var spr = this.lsticonnode[ii].spr;
    //         spr.stopAllActions();
    //     }
    //
    //     var snum = Math.floor(this.lsticonnode.length / 2);
    //     var bindex = this.StopIndex - snum;
    //
    //     for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //         var sindex = bindex + ii;
    //
    //         while (sindex < 0)
    //             sindex += this.lstwheeldata.length;
    //
    //         while (sindex >= this.lstwheeldata.length)
    //             sindex -= this.lstwheeldata.length;
    //
    //         this.lsticonnode[ii].idata = this.lstwheeldata[sindex];
    //     }
    //
    //     this.bRun = false;
    //     this.RunTime = 0;
    //     this.BeginAniTime = 0;
    //     this.speed = 0;
    //     this.StopIndex = -1;
    //
    //     this.curpos = this.sby;
    //
    //     var bc1 = false;
    //     var bi = -1;
    //     var ei = -1;
    //
    //     if(this.iLogicNum != undefined && this.C1Num != undefined && this.C1SoundName != undefined) {
    //         bc1 = true;
    //         bi = Math.floor(this.lsttopnode.length / 2) - Math.floor(this.iLogicNum / 2);
    //         ei = bi + this.iLogicNum - 1;
    //     }
    //
    //     var ny = Math.floor(this.curpos);
    //
    //     for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //         var spr = this.lsticonnode[ii].spr;
    //         var idata = this.lsticonnode[ii].idata;
    //         var icon = this.lsticon[idata];
    //
    //         if(bc1 && ii >= bi && ii <= ei && idata == this.C1Num) {
    //             cc.audioEngine.playEffect(this.C1SoundName, false);
    //         }
    //
    //         if (icon != undefined && icon != 0) {
    //             var frame = cc.spriteFrameCache.getSpriteFrame(icon);
    //             spr.setSpriteFrame(frame);
    //             spr.setVisible(true);
    //             // spr.setBlendFunc(gl.ONE, gl.ONE);
    //             // spr.setOpacity(128);
    //         }
    //         else {
    //             spr.setVisible(false);
    //         }
    //
    //         spr.setPositionY(ny);
    //
    //         ny += this.iconsp;
    //     }
    // },
    //
    //! 设置音效
    setSound: function (runsound, stopsound, disappearsound, c1num, c1sound) {
        this.RunSoundName = runsound;
        this.StopSoundName = stopsound;
        this.DisappearSoundName = disappearsound;

        this.C1Num = c1num;
        this.C1SoundName = c1sound;
    },

    //! 设置特出的消除音效
    setDisappearSoundEx: function (lst) {
        this.lstDisappearSoundEx = lst;
        this.iDisappearSoundIndex = 0;
    },

    //! 设置当前消除音效的索引
    setDisappearSoundIndex: function (index) {
        this.iDisappearSoundIndex = index;

        if (this.lstDisappearSoundEx != undefined) {
            if (this.iDisappearSoundIndex < 0)
                this.iDisappearSoundIndex = 0;

            if (this.iDisappearSoundIndex >= this.lstDisappearSoundEx.length)
                this.iDisappearSoundIndex = this.lstDisappearSoundEx.length - 1;
        }
    },

    //! 播放消除音效
    playDissappearSound: function (index) {
        var bplaysound = true;

        if (this.lstSoundOverlap != undefined) {
            if (index == this.C1Num) {
                if (this.lstSoundOverlap.disappearExSoundOverlap != undefined && !this.lstSoundOverlap.disappearExSoundOverlap)
                    bplaysound = false;
                else
                    this.lstSoundOverlap.disappearExSoundOverlap = this.disappearExSoundOverlap;
            }
            else {
                if (this.lstSoundOverlap.disappearSoundOverlap != undefined && !this.lstSoundOverlap.disappearSoundOverlap)
                    bplaysound = false;
                else
                    this.lstSoundOverlap.disappearSoundOverlap = this.disappearSoundOverlap;
            }
        }

        if (!bplaysound)
            return;

        if (this.lstDisappearSoundEx != undefined) {
            cc.audioEngine.playEffect(this.lstDisappearSoundEx[this.iDisappearSoundIndex], false);
        }
        else if (this.DisappearSoundName != undefined) {
            if (this.DisappearSoundName instanceof Array) {
                if (index >= 0 && index < this.DisappearSoundName.length)
                    cc.audioEngine.playEffect(this.DisappearSoundName[index], false);
            }
            else {
                cc.audioEngine.playEffect(this.DisappearSoundName, false);
            }
        }
    },

    //! 设置状态 0亮 1暗
    setState: function (state, index) {
        if (state == 0) {
            // if(this.layWheel != undefined) {
            //     this.layWheel.setColor(cc.color(255, 255, 255));
            // }
            var ccolor = cc.color(255, 255, 255);

            if (index >= 0) {
                this.lsticonnode[index].spr.setColor(ccolor);
                this.lsticonnode[index].spr.setOpacity(255);

                if (this.lsttopnode[index] && this.lsttopnode[index].tspr != undefined) {
                    this.lsttopnode[index].tspr.setColor(ccolor);
                    this.lsttopnode[index].tspr.setOpacity(255);
                }

                if (this.lsttopnode[index] && this.lsttopnode[index].rnode != undefined) {
                    this.lsttopnode[index].rnode.setOpacity(255);
                }
            }
            else {
                for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                    this.lsticonnode[ii].spr.setColor(ccolor);
                    this.lsticonnode[ii].spr.setOpacity(255);

                    if (this.lsttopnode[ii] && this.lsttopnode[ii].tspr != undefined) {
                        this.lsttopnode[ii].tspr.setColor(ccolor);
                        this.lsttopnode[ii].tspr.setOpacity(255);
                    }

                    if (this.lsttopnode[ii] && this.lsttopnode[ii].rnode != undefined) {
                        this.lsttopnode[ii].rnode.setOpacity(255);
                    }
                }
            }
        }
        else if (state == 1) {
            var a = 255;

            var ccolor = cc.color(120, 120, 120);
            if (index >= 0) {
                this.lsticonnode[index].spr.setColor(ccolor);
                this.lsticonnode[index].spr.setOpacity(a);

                if (this.lsttopnode[index] && this.lsttopnode[index].tspr != undefined) {
                    this.lsttopnode[index].tspr.setColor(ccolor);
                    this.lsttopnode[index].tspr.setOpacity(a);
                }

                if (this.lsttopnode[index] && this.lsttopnode[index].tani != undefined) {
                    this.lsttopnode[index].rnode.setOpacity(120);
                }
            }
            else {
                for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                    this.lsticonnode[ii].spr.setOpacity(a);
                    this.lsticonnode[ii].spr.setColor(ccolor);

                    if (this.lsttopnode[ii] && this.lsttopnode[ii].tspr != undefined) {
                        this.lsttopnode[ii].tspr.setColor(ccolor);
                        this.lsttopnode[ii].tspr.setOpacity(a);
                    }

                    if (this.lsttopnode[ii] && this.lsttopnode[ii].tani != undefined) {
                        this.lsttopnode[ii].rnode.setOpacity(120);
                    }
                }
            }
        }
    },
    
    setLayerNodeClipping : function (isEnabled) {
        if (this.laynode) {
            this.laynode.setClippingEnabled(isEnabled);
        }
    },

    //
    // //! 设置结果状态的颜色
    // setResultColor : function(r, g, b, a) {
    //     this.ResultR = r;
    //     this.ResultG = g;
    //     this.ResultB = b;
    //     this.ResultA = a;
    // },
    //
    // //! 设置逻辑数量
    // setLogicNum : function(num) {
    //   this.iLogicNum = num;
    // },
    //
    // //! 设置显示动画的同时是否显示下面的图标
    // setShowTopIcon : function(bshow) {
    //     this.bShowTopIcon = bshow;
    // },
    //
    // //! 开始转
    // run: function (speed, beginanitime, runtime, delaybegintime) {
    //     if (this.bRun)
    //         return;
    //
    //     this.bRun = true;
    //     this.RunTime = runtime;
    //     this.BeginAniTime = beginanitime + delaybegintime;
    //     this.speed = speed;
    //     this.bStoping = false;
    //
    //     if (cc.game.bhide == undefined || !cc.game.bhide) {
    //         var inum = this.lsticonnode.length;
    //
    //         for (var ii = 0; ii < inum; ++ii) {
    //             var spr = this.lsticonnode[ii].spr;
    //             var pos = cc.p(spr.getPositionX(), spr.getPositionY() + 30);
    //             var dt = cc.delayTime(delaybegintime);
    //             var mt = cc.moveTo(beginanitime, pos);
    //             var st = cc.sequence(dt, mt);
    //             spr.runAction(st);
    //         }
    //     }
    //
    //     this.curpos += 30;
    // },
    //
    // //! 停止
    // stop_index: function (eindex) {
    //     this.StopIndex = eindex;
    //     this.bStoping = true;
    // },
    //
    // //! 设置状态 0普通 1结果
    // setState : function (state) {
    //     if(state == 0) {
    //         // if(this.layWheel != undefined) {
    //         //     this.layWheel.setColor(cc.color(255, 255, 255));
    //         // }
    //
    //         var ccolor = cc.color(255, 255, 255);
    //
    //         for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //             this.lsticonnode[ii].spr.setColor(ccolor);
    //             this.lsticonnode[ii].spr.setOpacity(255);
    //         }
    //
    //         this.clearTop();
    //     }
    //     else if(state == 1){
    //         // if(this.layWheel != undefined) {
    //         //     this.layWheel.setColor(cc.color(128, 128, 128));
    //         // }
    //
    //         var r = 64;
    //         var g = 64;
    //         var b = 64;
    //         var a = 255;
    //
    //         if(this.ResultR != undefined)
    //             r = this.ResultR;
    //
    //         if(this.ResultG != undefined)
    //             g = this.ResultG;
    //
    //         if(this.ResultB != undefined)
    //             b = this.ResultB;
    //
    //         if(this.ResultA != undefined)
    //             a = this.ResultA;
    //
    //         var ccolor = cc.color(r, g, b);
    //
    //         for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //             this.lsticonnode[ii].spr.setColor(ccolor);
    //         }
    //
    //         for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
    //             this.lsticonnode[ii].spr.setOpacity(a);
    //         }
    //     }
    // },
    //
    // // //! 清除所有显示结果的块
    // // clearTop : function () {
    // //     return ;
    // //
    // //     for(var ii = 0; ii < this.lsttopani.length; ++ii) {
    // //         var ani = this.lsttopani[ii];
    // //         ani.node.stopAllActions();
    // //         ani.node.getParent().removeChild(ani.node);
    // //     }
    // //
    // //     this.lsttopani = [];
    // //
    // //     for(var ii = 0; ii < this.lsttopnode.length; ++ii) {
    // //         this.lsttopnode[ii].setVisible(false);
    // //         this.lsticonnode[ii].spr.setVisible(true);
    // //     }
    // // },
    //
    // //! 显示某个结果的块 正中是0 上面是正数 下面是负数
    // showTop : function (index) {
    //     if(this.layTopWheel == undefined)
    //         return ;
    //
    //     var ii = Math.floor(this.lsttopnode.length / 2) + index;
    //
    //     this.lsticonnode[ii].spr.setVisible(false);
    //
    //     var tspr = this.lsttopnode[ii];
    //
    //     var idata = this.lsticonnode[ii].idata;
    //     var icon = this.lsticon[idata];
    //
    //     if (icon != undefined && icon != 0) {
    //         var frame = cc.spriteFrameCache.getSpriteFrame(icon);
    //
    //         if(!this.bShowTopIcon) {
    //             frame = cc.spriteFrameCache.getSpriteFrame("empty.png");
    //         }
    //
    //         tspr.setSpriteFrame(frame);
    //         // tspr.setBlendFunc(gl.ONE, gl.ONE);
    //         // tspr.setOpacity(128);
    //
    //         if(this.lsticonani != undefined) {
    //             var aniname = this.lsticonani[idata];
    //
    //             if(aniname != undefined && aniname != 0) {
    //                 var iconani = ccs.load(aniname);
    //
    //                 tspr.addChild(iconani.node, 1);
    //                 var fsize = frame.getOriginalSizeInPixels();
    //                 iconani.node.setPosition(fsize.width / 2, fsize.height / 2);
    //                 iconani.node.runAction(iconani.action);
    //                 iconani.action.gotoFrameAndPlay(0, iconani.action.getDuration(), true);
    //
    //                 this.lsttopani.push(iconani);
    //             }
    //         }
    //     }
    //
    //     tspr.setVisible(true);
    // },
    //
    // //! 显示上层的icon
    // showTopIcon : function (index) {
    //     if(this.layTopWheel == undefined)
    //         return ;
    //
    //     var ii = Math.floor(this.lsttopnode.length / 2) + index;
    //
    //     this.lsticonnode[ii].spr.setVisible(false);
    //
    //     var tspr = this.lsttopnode[ii];
    //
    //     if(tspr.isVisible())
    //         return ;
    //
    //     var idata = this.lsticonnode[ii].idata;
    //     var icon = this.lsticon[idata];
    //
    //     if (icon != undefined && icon != 0) {
    //         var frame = cc.spriteFrameCache.getSpriteFrame(icon);
    //         tspr.setSpriteFrame(frame);
    //     }
    //
    //     tspr.setVisible(true);
    // },
    //
    // //! 取一个上面显示的节点
    // getTopSprite : function(index) {
    //     if(this.layTopWheel == undefined)
    //         return undefined;
    //
    //     var ii = Math.floor(this.lsttopnode.length / 2) + index;
    //     return this.lsttopnode[ii];
    // },
    //
    // //! 改变某个图标的资源
    // chgIcon : function (index, icon, bicon, iconani) {
    //     if(index < 0)
    //         return ;
    //
    //     if(this.lsticon != undefined && index < this.lsticon.length) {
    //         this.lsticon[index] = icon;
    //     }
    //
    //     if(this.lstbicon != undefined && index < this.lstbicon.length) {
    //         this.lstbicon[index] = bicon;
    //     }
    //
    //     if(this.lsticonani != undefined && index < this.lsticonani.length) {
    //         this.lsticonani[index] = iconani;
    //     }
    // },
    //
    // //! 亮光相关
    // //! 设置亮光动画
    // setLightAni : function (aniname, topname, soundname) {
    //     this.lightaniname = aniname;
    //     this.lighttopname = topname;
    //     this.lightsoundname = soundname;
    // },
    //
    // //! 设置是否显示亮光
    // showLightAni : function (bshow) {
    //     if(this.lightaniname == undefined && this.lighttopname == undefined)
    //         return ;
    //
    //     //! 停止的时候不闪光
    //     if(!this.bRun && bshow)
    //         return ;
    //
    //     if(bshow) {
    //         if(this.LightAni == undefined && this.lightaniname != undefined) {
    //             this.LightAni = ccs.load(this.lightaniname);
    //
    //             this.layWheel.addChild(this.LightAni.node, 0);
    //
    //             this.LightAni.node.runAction(this.LightAni.action);
    //             this.LightAni.action.gotoFrameAndPlay(0, this.LightAni.action.getDuration(), true);
    //         }
    //
    //         if(this.LightTop == undefined && this.lighttopname != undefined) {
    //             this.LightTop = ccs.load(this.lighttopname);
    //
    //             this.layTopWheel.addChild(this.LightTop.node, 2);
    //
    //             this.LightTop.node.runAction(this.LightTop.action);
    //             this.LightTop.action.gotoFrameAndPlay(0, this.LightTop.action.getDuration(), true);
    //         }
    //
    //         if(this.lightsoundname != undefined)
    //             cc.audioEngine.playEffect(this.lightsoundname, false);
    //     }
    //     else {
    //         if(this.LightAni != undefined) {
    //             this.LightAni.node.stopAllActions();
    //             this.layWheel.removeChild(this.LightAni.node);
    //
    //             this.LightAni = undefined;
    //         }
    //
    //         if(this.LightTop != undefined) {
    //             this.LightTop.node.stopAllActions();
    //             this.layTopWheel.removeChild(this.LightTop.node);
    //
    //             this.LightTop = undefined;
    //         }
    //     }
    // },
    //
    // //! 判断是否有某个符号
    // hasIcon : function (icon, bindex, eindex) {
    //     if(bindex > eindex) {
    //         var tmp = bindex;
    //         bindex = eindex;
    //         eindex = bindex;
    //     }
    //
    //     var bi = Math.floor(this.lsttopnode.length / 2) + bindex;
    //     var ei = Math.floor(this.lsttopnode.length / 2) + eindex;
    //
    //     for(var ii = bi; ii <= ei; ++ii) {
    //         if(this.lsticonnode[ii].idata == icon)
    //             return true;
    //     }
    //
    //     return false;
    // }
});