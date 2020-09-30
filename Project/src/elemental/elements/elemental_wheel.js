var ElementalWheel = Wheel.extend({
    ctor: function(laynode, lsticon, lstbicon, iconw, iconh, iconsp, lstwheeldata, bindex, laytop, lsticonani, spy, glayer) {

        this._iWheelIndex = 0;
        this._lstIconDisplayAni = [];
        this._layTouchNode = undefined;
        this._bChgSpeed = false;

        this._super(laynode, lsticon, lstbicon, iconw, iconh, iconsp, lstwheeldata, bindex, laytop, lsticonani, spy, glayer);
    },

    setIconImg: function(lst) {
        this.lsticon = lst;
    },

    setIndex: function(index) {
        this._iWheelIndex = index;
    },

    setIconBlurImg: function(lst) {
        this.lstbicon = lst;
    },

    setIconRunAni: function(lst) {
        this.lsticonani = lst;
    },

    setIconDisplayAni: function(lst) {
        this._lstIconDisplayAni = lst;
    },

    setTouchNode: function(layTouchNode) {
        if (layTouchNode) {
            this._layTouchNode = layTouchNode;
            this._layTouchNode.addTouchEventListener(this.onTouchIcon, this);

            if (this.layTopWheel) {
                // 删除基类添加到TopWheel的Touch事件
                this.layTopWheel.addTouchEventListener(undefined, this);
            }
        }
    },

    setIsChgSpeed: function(bChg) {
        this._bChgSpeed = bChg;
    },

    getWheelIndex: function() {
        return this._iWheelIndex;
    },

    /*
    * 立刻停止轮子，并显示最终局面
    * 注意：长图标未进行验证
    * @param data Array, 当前局面显示的icon数据数组
    * @return undefined
    * */
    stopWheelAtOnce: function (data) {
        if (this.bRun) {
            this.stopWheel(true);
            var bi = Math.floor(this.lsticonnode.length / 2) - Math.floor(this.iLogicNum / 2);
            this.setWheelIndex(bi, true, data);
        }
    },

    playIconDisplayAni: function(data) {
        if (!this._lstIconDisplayAni)
            return;

        var bi = Math.floor(this.lsticonnode.length / 2) - Math.floor(this.iLogicNum / 2);
        var ei = bi + this.iLogicNum - 1;

        var iconNode = undefined;
        for (var i = 0; i < this.lsticonnode.length; i++) {
            if (i < bi || i > ei)
                continue;

            iconNode = this.lsticonnode[i];
            if (!iconNode || iconNode.displayAni !== undefined)
                continue;

            if (data != undefined && iconNode.idata !== data) {
                continue;
            }

            var file = this._lstIconDisplayAni[iconNode.idata];
            if (!file)
                continue;

            var iconAni = CcsResCache.singleton.load(file);
            iconNode.spr.addChild(iconAni.node, 1);
            var contentSize = iconNode.spr.getContentSize();
            iconAni.node.setPosition(contentSize.width * 0.5, contentSize.height * 0.5);
            iconNode.displayAni = iconAni;

            iconAni.node.runAction(iconAni.action);
            // iconAni.action.gotoFrameAndPlay(0, iconAni.action.getDuration(), 0, true);

            var ctrlAni = findNodeByName(iconAni.node, "ctrlAni");
            if (ctrlAni) {
                ctrlAni.animation.play("huo_dianran", 0, 0);
                ctrlAni.animation.setMovementEventCallFunc(function(sender, type, movementID) {
                    if (type === ccs.MovementEventType.complete && movementID === "huo_dianran") {
                        ctrlAni.animation.play("huo_xunhuan", 0, 1);
                    }
                })
            }
        }
    },

    clearIconDisplayAni: function() {
        for (var i = 0; i < this.lsticonnode.length; i++) {
            var iconNode = this.lsticonnode[i];
            if (iconNode.displayAni) {
                CcsResCache.singleton.release(iconNode.displayAni);
                iconNode.displayAni =  undefined;
            }
        }
    },

    //! 显示某个结果的块 正中是0 上面是正数 下面是负数
    showTop: function (index, bpause) {
        if (this.layTopWheel == undefined)
            return;

        var ii = Math.floor(this.lsttopnode.length / 2) + index;

        this.lsticonnode[ii].spr.setVisible(false);

        return;

        var tspr = this.lsttopnode[ii];

        var idata = this.lsticonnode[ii].idata;
        var icon = this.lsticon[idata];

        if (icon != undefined && icon != 0) {
            var inode = this.lsticonnode[ii];

            if (inode.bigspr != undefined) {
                this.showTop_bigicon(index, bpause);
            } else if (inode.bbig) {
                ++ii;

                while (ii >= 0 && ii < this.lsticonnode.length) {
                    if (this.lsticonnode[ii].bigspr != undefined) {
                        var ni = ii - Math.floor(this.lsttopnode.length / 2);
                        this.showTop_bigicon(ni, bpause);
                        break;
                    }

                    ++ii;
                }
            } else {
                var frame = cc.spriteFrameCache.getSpriteFrame(icon);
                //var fsize = frame.getOriginalSizeInPixels();

                if (!this.bShowTopIcon) {
                    frame = cc.spriteFrameCache.getSpriteFrame("empty.png");
                }

                tspr.setSpriteFrame(frame);
                this.refreshIconColor(idata, tspr);

                // tspr.setBlendFunc(gl.ONE, gl.ONE);
                // tspr.setOpacity(128);

                if (this.lsticonexani != undefined) {
                    var node = this.lsticonexani['icon' + idata];

                    if (node != undefined) {
                        if (node.bplay) {
                            var aniname = node.iconani;
                            var iconani = CcsResCache.singleton.load(aniname);

                            tspr.addChild(iconani.node, 2);
                            var fsize = frame.getOriginalSizeInPixels();
                            iconani.node.setPosition(fsize.width / 2, fsize.height / 2);
                            iconani.node.runAction(iconani.action);
                            iconani.action.gotoFrameAndPlay(0, iconani.action.getDuration(), false);

                            if (this.iconexsound)
                                cc.audioEngine.playEffect(this.iconexsound, false);
                        }
                    }
                }

                if (this.lsticonani != undefined) {
                    var aniname = this.lsticonani[idata];

                    if (aniname != undefined && aniname != 0) {
                        if ( this.lsticonnode[ii].iconAni === undefined) {
                            var iconani = CcsResCache.singleton.load(aniname);

                            tspr.addChild(iconani.node, 1);
                            var fsize = frame.getOriginalSizeInPixels();
                            iconani.node.setPosition(fsize.width / 2, fsize.height / 2);
                            iconani.node.runAction(iconani.action);
                            iconani.action.gotoFrameAndPlay(0, iconani.action.getDuration(), true);
                            this.lsticonnode[ii].iconAni = iconani;

                            if (bpause)
                                iconani.action.pause();

                            this.lsttopani.push(iconani);
                        }
                    } else {
                        this.showTopIcon(index);
                    }
                } else {
                    this.showTopIcon(index);
                }
            }
        }

        tspr.setVisible(true);
    },

    clearTop: function() {
        this._super();

        for (var i = 0; i < this.lsticonnode.length; i++) {
            var iconNode = this.lsticonnode[i];
            iconNode.iconAni = undefined;
        }
    },

    update: function (dt) {
        if (!this.bRun)
            return;

        if (this._bChgSpeed) {
            if(this.speed > 500){
                this.speed -= 38 * (dt / 0.0167);
            }else{
                this.speed = 800;
            }
        }

        if (this.BeginAniTime > 0) {
            this.BeginAniTime -= dt;

            if (this.BeginAniTime > 0)
                return;

            this.BeginAniTime = 0;

            if (this.RunSoundName != undefined)
                cc.audioEngine.playEffect(this.RunSoundName, false);

            //! 所有都刷成模糊图片
            if (this.lstbicon != undefined) {
                for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
                    if (this.lsticonnode[ii].bbig) {
                        if (this.lsticonnode[ii].bigspr != undefined) {
                            var inode = this.lsticonnode[ii];

                            var bdata = this.lstBigIconData['icon' + inode.bigicon];
                            var frame = cc.spriteFrameCache.getSpriteFrame(bdata.bicon);
                            inode.bigspr.setSpriteFrame(frame);
                        }
                    } else {
                        var spr = this.lsticonnode[ii].spr;
                        var idata = this.lsticonnode[ii].idata;
                        var icon = this.lstbicon[idata];

                        if (icon != undefined && icon != 0) {
                            var frame = cc.spriteFrameCache.getSpriteFrame(icon);

                            if (frame)
                                spr.setSpriteFrame(frame);

                            this.refreshIconColor(idata, spr);
                            // spr.setBlendFunc(gl.ONE, gl.ONE);
                            // spr.setOpacity(128);

                            this.clearIconDisplayAni();
                        }
                    }
                }
            }

            //this.showLightAni(true);
        }

        if (this.RunTime > 0) {
            this.RunTime -= dt;
        }

        this.curpos -= this.speed * dt;
        var ny = Math.floor(this.curpos);

        for (var ii = 0; ii < this.lsticonnode.length; ++ii) {
            this.lsticonnode[ii].spr.setPositionY(ny + this.spy);
            this.fixAlpha(this.lsticonnode[ii].spr);

            ny += this.iconsp;
        }

        //! 最下方的节点是否消失了
        while (this.lsticonnode[0].spr.getPositionY() <= this.sby - this.iconsp) {
            // var spr = this.lsticonspr[0];
            // var espr = this.lsticonspr[this.lsticonspr.length - 1];

            var bnode = this.lsticonnode[0];
            var enode = this.lsticonnode[this.lsticonnode.length - 1];
            var spr = bnode.spr;
            var espr = enode.spr;

            // var idata = this.getNewData();
            // bnode.idata = idata;

            var ndata = this.getNewData();
            var idata = ndata.idata;
            bnode.idata = ndata.idata;

            for (var ii = 0; ii < this.lsticonnode.length - 1; ++ii) {
                this.lsticonnode[ii] = this.lsticonnode[ii + 1];
            }

            this.lsticonnode[this.lsticonnode.length - 1] = bnode;

            var icon;

            if (this.lstbicon == undefined)
                icon = this.lsticon[idata];
            else
                icon = this.lstbicon[idata];

            spr.setPositionY(espr.getPositionY() + this.iconsp);

            if (icon == undefined || icon == 0) {
                spr.setVisible(false);
            } else {
                var frame = cc.spriteFrameCache.getSpriteFrame(icon);

                if (frame)
                    spr.setSpriteFrame(frame);

                spr.setVisible(true);
                this.refreshIconColor(idata, spr);

                // spr.setBlendFunc(gl.ONE, gl.ONE);
                // spr.setOpacity(128);

                if (bnode.append != undefined) {
                    spr.removeChild(bnode.append);
                    bnode.append = undefined;
                }

                if (ndata.index >= 0) {
                    if (this.lsticonappend != undefined && ndata.index < this.lsticonappend.length && this.lsticonappend[ndata.index] != undefined) {
                        if (this.lsticonappend[ndata.index].getParent() == null) {
                            bnode.append = this.lsticonappend[ndata.index];
                            spr.addChild(bnode.append);

                            var fsize = frame.getOriginalSizeInPixels();
                            bnode.append.setPosition(fsize.width / 2, fsize.height / 2);
                        } else {
                            cc.log("is error");
                        }
                    }
                } else {
                    var si = -ndata.index - 1;

                    if (this.lststopappend != undefined && si < this.lststopappend.length && this.lststopappend[si] != undefined) {
                        bnode.append = this.lststopappend[si];
                        spr.addChild(bnode.append);

                        var fsize = frame.getOriginalSizeInPixels();
                        bnode.append.setPosition(fsize.width / 2, fsize.height / 2);
                    }
                }
            }

            bnode.bbig = false;
            if (bnode.bigspr != undefined) {
                bnode.bigspr.getParent().removeChild(bnode.bigspr);
                bnode.bigspr = undefined;
                bnode.bigicon = 0;
            }

            this.curpos += this.iconsp;

            if (this.RunTime <= 0 && this.StopIndex >= 0) {
                if (this.curdataindex == this.StopIndex) {
                    this.stopWheel(true);
                    break;
                }

                // if (this.StopDataIndex >= this.StopData.length) {
                //     this.stopWheel(true);
                //     break;
                // }
            }

            if (this.StepSoundName != undefined) {
                cc.audioEngine.playEffect(this.StepSoundName, false);
            }
        }
    },

    run: function(speed, beginanitime, runtime, delaybegintime) {
        this.setIsChgSpeed(false);

        this._super(speed, beginanitime, runtime, delaybegintime);
    },

    stopWheel: function(bplayeff) {
        this._bChgSpeed = false;

        this._super(bplayeff);
    },

    //! 点击轮子
    onTouchIcon : function (sender, type) {
        if (type != ccui.Widget.TOUCH_ENDED)
            return ;

        if(this.bRun || this.lstwheeldata == undefined)
            return ;

        var lsize = sender.getLayoutSize();

        var pos = sender.getTouchEndPosition();
        var touchPoint = sender.convertToNodeSpace(pos);

        for(var ii = 0; ii < this.lsticonnode.length; ++ii) {
            var inode = this.lsticonnode[ii];

            var spr = inode.spr;
            var sx = spr.getPositionX();
            var sy = spr.getPositionY();

            if (sy < 0 || sy > lsize.height) {
                continue;
            }

            if(touchPoint.y >= sy - this.iconh / 2 && touchPoint.y <= sy + this.iconh / 2) {
                var idata = inode.idata;

                // 因spr是放置在layWheel上的，而layWheel与TouchWheel宽度不同，因此此处需将sender参数修改为this.layWheel，已方便游戏层进行坐标转换计算
                if(this.GameLayer.showIconTips)
                    this.GameLayer.showIconTips(idata, this.layWheel, spr, this);

                return;
            }
        }
    }
});