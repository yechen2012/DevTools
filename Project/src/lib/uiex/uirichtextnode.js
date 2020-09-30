//目前只考虑文本
var UiRichTextNode = ccui.RichText.extend({
    ctor: function () {
        ccui.RichText.prototype.ctor.call(this);
        this._containerHeight = 0;
        this.lineveralignment = 1;
        this._strokeEnabled=false;
        this._strokeColor=null;
        this._strokeSize=0;
    },
    //重写父类渲染，基本啥也没干，只是赋值出来
    formatRenderers: function () {
        var newContentSizeHeight = 0, locRenderersContainer = this._elementRenderersContainer;
        var locElementRenders = this._elementRenders;
        var i, j, row, nextPosX, l;
        var lineHeight, offsetX;
        // _ignoreSize=true,位置显示bug，暂不处理这种情况
        if (this._ignoreSize) {
            var newContentSizeWidth = 0;
            row = locElementRenders[0];
            nextPosX = 0;

            for (j = 0; j < row.length; j++) {
                l = row[j];
                l.setAnchorPoint(cc.p(0, 0));
                l.setPosition(nextPosX, 0);
                locRenderersContainer.addChild(l, 1, j);

                lineHeight = l.getLineHeight ? l.getLineHeight() : newContentSizeHeight;

                var iSize = l.getContentSize();
                newContentSizeWidth += iSize.width;
                newContentSizeHeight = Math.max(Math.min(newContentSizeHeight, lineHeight), iSize.height);
                nextPosX += iSize.width;
            }

            //Text flow horizontal alignment:
            if (this._textHorizontalAlignment !== cc.TEXT_ALIGNMENT_LEFT) {
                offsetX = 0;
                if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_RIGHT)
                    offsetX = this._contentSize.width - nextPosX;
                else if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_CENTER)
                    offsetX = (this._contentSize.width - nextPosX) / 2;

                for (j = 0; j < row.length; j++)
                    row[j].x += offsetX;
            }

            locRenderersContainer.setContentSize(newContentSizeWidth, newContentSizeHeight);
        } else {
            var maxHeights = [];
            for (i = 0; i < locElementRenders.length; i++) {
                row = locElementRenders[i];
                var maxHeight = 0;
                for (j = 0; j < row.length; j++) {
                    l = row[j];
                    // lineHeight = l.getLineHeight ? l.getLineHeight() : l.getContentSize().height;
                    if (typeof (l.getLineHeight) === 'undefined') {
                        var scalel = l.getScale();
                        lineHeight = l.getContentSize().height * scalel;
                    } else {
                        lineHeight = l.getLineHeight();
                    }
                    maxHeight = Math.max(Math.min(l.getContentSize().height, lineHeight), maxHeight);
                }
                maxHeights[i] = maxHeight;
                newContentSizeHeight += maxHeights[i];
            }
            var nextPosY = this._customSize.height;
            // var nextPosY = newContentSizeHeight;
            for (i = 0; i < locElementRenders.length; i++) {
                row = locElementRenders[i];
                nextPosX = 0;
                var tempNextPosY = nextPosY - (maxHeights[i] + this._verticalSpace);
                for (j = 0; j < row.length; j++) {

                    l = row[j];
                    l.setAnchorPoint(this.getLineAnchorPointY());
                    l.setPosition(this.getLinePosition(nextPosX, nextPosY, tempNextPosY));
                    locRenderersContainer.addChild(l, 1);
                    nextPosX += l.getContentSize().width * l.getScale();
                }
                nextPosY = tempNextPosY;
                //Text flow alignment(s)
                if (this._textHorizontalAlignment !== cc.TEXT_ALIGNMENT_LEFT || this._textVerticalAlignment !== cc.VERTICAL_TEXT_ALIGNMENT_TOP) {
                    offsetX = 0;
                    if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_RIGHT)
                        offsetX = this._contentSize.width - nextPosX;
                    else if (this._textHorizontalAlignment === cc.TEXT_ALIGNMENT_CENTER)
                        offsetX = (this._contentSize.width - nextPosX) / 2;

                    var offsetY = 0;
                    if (this._textVerticalAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM)
                        offsetY = this._customSize.height - newContentSizeHeight;
                    else if (this._textVerticalAlignment === cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
                        offsetY = (this._customSize.height - newContentSizeHeight) / 2;

                    for (j = 0; j < row.length; j++) {
                        l = row[j];
                        l.x += offsetX;
                        l.y -= offsetY;
                    }
                }
            }
            locRenderersContainer.setContentSize(this._contentSize);
        }
        this._containerHeight = newContentSizeHeight;

        var length = locElementRenders.length;
        for (i = 0; i < length; i++) {
            locElementRenders[i].length = 0;
        }
        this._elementRenders.length = 0;

        this.setContentSize(this._ignoreSize ? this.getVirtualRendererSize() : this._customSize);
        this._updateContentSizeWithTextureSize(this._contentSize);

        locRenderersContainer.setPosition(this._contentSize.width * 0.5, this._contentSize.height * 0.5);
    },
    getLineAnchorPointY: function () {
        var lineAlign = this.lineveralignment;
        if (lineAlign == cc.VERTICAL_TEXT_ALIGNMENT_CENTER) {
            return cc.p(0, 0.5);
        }
        if (lineAlign == cc.VERTICAL_TEXT_ALIGNMENT_TOP) {
            return cc.p(0, 1);
        }
        if (lineAlign == cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM) {
            return cc.p(0, 0);
        }
        return cc.p(0, 0.5);
    },
    getLinePosition: function (posix, topy, bottomy) {
        var lineAlign = this.lineveralignment;
        if (lineAlign == cc.VERTICAL_TEXT_ALIGNMENT_CENTER) {
            return cc.p(posix, (topy + bottomy) * 0.5);
        }
        if (lineAlign == cc.VERTICAL_TEXT_ALIGNMENT_TOP) {
            return cc.p(posix, topy);
        }
        if (lineAlign == cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM) {
            return cc.p(posix, bottomy);
        }
        return cc.p(posix, (topy + bottomy) * 0.5);
    },

    setLineAlignment: function (alignment) {
        this.lineveralignment = alignment;
    },
    getMinFontSize:function(){
        var locRichElements = this._richElements;
        var size=256;//默认很大字符，防止纯图片
        for (var index in locRichElements) {
            var element = locRichElements[index];
            if (element._type == ccui.RichElement.TEXT) {
                var fontsize=element._fontSize;
                size=Math.min(fontsize,size);
            }
        }
        return size;
    },
    setMinFontSize:function(fontsize){
        var minsize=this.getMinFontSize();
        if(fontsize>=minsize){
            return
        }
        var diff=minsize-fontsize;
        var locRichElements = this._richElements;
        for (var index in locRichElements) {
            var element = locRichElements[index];
            if (element._type == ccui.RichElement.TEXT) {
                element._fontSize=element._fontSize-diff;
            }
        }
        return;
    },
    getContainerSize: function () {
        // var consize = this.getContentSize();
        var conwidth = this._customSize.width;
        var conhight = this.reckonAllElements();
        return cc.size(conwidth, conhight);
    },
    smallAllElements: function () {
        // var consize = this.getContentSize();
        // if ( this._customSize.height <= 0 || this._containerHeight <= 0) {
        if (this._customSize.height <= 0) {
            return;
        }
        var conheight = this._customSize.height;
        var rekonH = this.reckonAllElements();
        while (rekonH > conheight) {
            var rate = rekonH / conheight;
            var locRichElements = this._richElements;
            //比例太大，直接等比缩放 todo
            if (false) {
                // if (rate > 1.05) {
                var smalrate = 0.9;
                for (var index in locRichElements) {
                    var element = locRichElements[index];
                    if (element._type == ccui.RichElement.TEXT) {
                        element._fontSize = Math.floor(element._fontSize * smalrate);
                    } else if (element._type == ccui.RichElement.CUSTOM) {
                        var nodescale = element._customNode.getScale();
                        element._customNode.setScale(nodescale * smalrate);
                    }
                }
            } else {
                for (var index in locRichElements) {
                    var element = locRichElements[index];
                    if (element._type == ccui.RichElement.TEXT) {
                        element._fontSize = element._fontSize - 1;
                        element._fontSize = Math.max(element._fontSize, 1);
                    } else if (element._type == ccui.RichElement.CUSTOM) {
                        var nodescale = element._customNode.getScale();
                        element._customNode.setScale(nodescale * 0.95);
                    }
                }
            }
            rekonH = this.reckonAllElements();
        }
    },
    //! 整体缩放，改变字体大小
    reckonAllElements: function () {
        var i, element, locRichElements = this._richElements;

        this.m_leftSpaceWidth = this._customSize.width;
        this.m_elementRenders = [];
        this.m_elementRenders.push([]);

        this.m_onelinebig = false;

        for (i = 0; i < locRichElements.length; i++) {
            element = locRichElements[i];
            if (element._type == ccui.RichElement.TEXT) {
                this.m_handleTextRenderer(element._text, element._fontName, element._fontSize, element._color);
            } else if (element._type == ccui.RichElement.CUSTOM) {
                this.m_handleCustomRenderer(element._customNode);
            }
        }
        //如果有超长，直接返回极大值，等被缩放
        if (this.m_onelinebig) {
            return 10000;
        }
        var newContentSizeHeight = 0;
        var locElementRenders = this.m_elementRenders;
        var i, j, row, l;
        var lineHeight;
        var maxHeights = [];
        for (i = 0; i < locElementRenders.length; i++) {
            row = locElementRenders[i];
            var maxHeight = 0;
            for (j = 0; j < row.length; j++) {
                l = row[j];
                if (typeof (l.getLineHeight) === 'undefined') {
                    var scalel = l.getScale();
                    lineHeight = l.getContentSize().height * scalel;
                } else {
                    lineHeight = l.getLineHeight();
                }
                maxHeight = Math.max(Math.min(l.getContentSize().height, lineHeight), maxHeight);
            }
            maxHeights[i] = maxHeight;
            newContentSizeHeight += maxHeights[i];
        }
        var length = locElementRenders.length;
        for (i = 0; i < length; i++) {
            locElementRenders[i].length = 0;
        }
        this.m_elementRenders.length = 0;
        return newContentSizeHeight;
    },

    m_handleTextRenderer: function (text, fontNameOrFontDef, fontSize, color) {
        if (text === "")
            return;

        if (text === "\n") { //Force Line Breaking
            this.m_leftSpaceWidth = this._customSize.width;
            this.m_elementRenders.push([]);
            return;
        }
        var langentype = (!DtLangZHType) ? true : false;

        var textRenderer = new cc.LabelTTF(text, fontNameOrFontDef, fontSize);
        var textRendererWidth = textRenderer.getContentSize().width;
        var templeftSpaceWidth = this.m_leftSpaceWidth - textRendererWidth;
        if (templeftSpaceWidth < 0) {
            var overstepPercent = (-templeftSpaceWidth) / textRendererWidth;
            var curText = text;
            var stringLength = curText.length;
            var leftLength = Math.floor(stringLength * (1 - overstepPercent));
            var leftWords = curText.substr(0, leftLength);
            if (langentype) {
                var firstSpaceIndex = curText.indexOf(' ');
                if (firstSpaceIndex == -1) {
                    var theoneRenderer = new cc.LabelTTF(curText, fontNameOrFontDef, fontSize);
                    var theoneRendererWidth = theoneRenderer.getContentSize().width;
                    if (theoneRendererWidth < this._customSize.width) {
                        this.m_leftSpaceWidth = this._customSize.width;
                        this.m_elementRenders.push([]);
                        this.m_handleTextRenderer(curText, fontNameOrFontDef, fontSize, color);
                    } else {
                        this.m_onelinebig = true;
                    }
                    return;
                }
                if (leftLength < firstSpaceIndex) {
                    var firstword = curText.substr(0, firstSpaceIndex);
                    var firstRenderer = new cc.LabelTTF(firstword, fontNameOrFontDef, fontSize);
                    var firstRendererWidth = firstRenderer.getContentSize().width;
                    if (firstRendererWidth < this._customSize.width) {
                        this.m_leftSpaceWidth = this._customSize.width;
                        this.m_elementRenders.push([]);
                        this.m_handleTextRenderer(curText, fontNameOrFontDef, fontSize, color);
                    } else {
                        this.m_onelinebig = true;
                    }
                    return;
                }

                // var leftWordsTemp = curText.substr(0, leftLength);
                // var cutIndex = leftLength;
                // var leftRenderer = new cc.LabelTTF(leftWordsTemp, fontNameOrFontDef, fontSize);
                // var leftRendererWidth = leftRenderer.getContentSize().width;
                // while (leftRendererWidth > (this.m_leftSpaceWidth)) {
                //     cutIndex = cutIndex - 1;
                //     leftWordsTemp = curText.substr(0, cutIndex);
                //     leftRenderer = new cc.LabelTTF(leftWordsTemp, fontNameOrFontDef, fontSize);
                //     leftRendererWidth = leftRenderer.getContentSize().width;
                // }
                // if (cutIndex != leftLength) {
                //     leftLength = cutIndex;
                //     leftWords = curText.substr(0, leftLength);
                // }


                var cutWords = curText.substr(leftLength);
                var numberreg = /(\d+)$/;
                if (numberreg.test(leftWords)) {
                    var nmresult = numberreg.exec(leftWords);
                    var numberindex = leftWords.indexOf(nmresult[1]);
                    leftWords = curText.substr(0, numberindex);
                    cutWords = curText.substr(numberindex);
                    leftLength = numberindex;
                }

                // var breakreg = /([^\w\s]+)(\w)/;
                // var lastCharreg = /\w$/;
                // if (lastCharreg.test(leftWords) && breakreg.test(leftWords)) {
                //     var templeftWords = leftWords;
                //     leftWords = leftWords.replace(breakreg, '$1 $2');
                //     curText = curText.replace(templeftWords, leftWords);
                // }
                //必然用空格做分割了
                var lastSpaceIndex = leftWords.lastIndexOf(' ');
                leftLength = (lastSpaceIndex == -1) ? leftLength : lastSpaceIndex + 1;
                leftWords = curText.substr(0, leftLength);
                cutWords = curText.substr(leftLength);
                var validLeftLength = leftLength > 0;

                if (validLeftLength) {
                    var newleftRenderer = new cc.LabelTTF(leftWords, fontNameOrFontDef, fontSize);
                    newleftRenderer.setColor(color);
                    newleftRenderer.setOpacity(color.a);
                    this.m_pushToContainer(newleftRenderer);
                }

                this.m_leftSpaceWidth = this._customSize.width;
                this.m_elementRenders.push([]);
                this.m_handleTextRenderer(cutWords, fontNameOrFontDef, fontSize, color);
            } else {

                var cutWords = curText.substr(leftLength);
                var numberreg = /(\d+)$/;
                if (numberreg.test(leftWords)) {
                    var nmresult = numberreg.exec(leftWords);
                    var numberindex = leftWords.indexOf(nmresult[1]);
                    leftWords = curText.substr(0, numberindex);
                    cutWords = curText.substr(numberindex);
                    leftLength = numberindex;
                }

                var cutIndex = leftLength;
                var leftRenderer = new cc.LabelTTF(leftWords, fontNameOrFontDef, fontSize);
                var leftRendererWidth = leftRenderer.getContentSize().width;
                while (leftRendererWidth > (this.m_leftSpaceWidth)) {
                    cutIndex = cutIndex - 1;
                    leftWords = curText.substr(0, cutIndex);
                    leftRenderer = new cc.LabelTTF(leftWords, fontNameOrFontDef, fontSize);
                    leftRendererWidth = leftRenderer.getContentSize().width;
                }
                if (cutIndex != leftLength) {
                    leftWords = curText.substr(0, cutIndex);
                    cutWords = curText.substr(cutIndex);
                    leftLength = cutIndex;
                }


                var startCharreg = /^[\.。,，]+/;
                if (startCharreg.test(cutWords)) {
                    var tempre = startCharreg.exec(cutWords);
                    var douhao=tempre[0];
                    cutWords = cutWords.replace(startCharreg, '');
                    leftWords= leftWords+douhao;
                }

                //必然用空格做分割了
                var validLeftLength = leftLength > 0;

                if (validLeftLength) {
                    var newleftRenderer = new cc.LabelTTF(leftWords, fontNameOrFontDef, fontSize);
                    newleftRenderer.setColor(color);
                    newleftRenderer.setOpacity(color.a);
                    this.m_pushToContainer(newleftRenderer);
                }

                this.m_leftSpaceWidth = this._customSize.width;
                this.m_elementRenders.push([]);
                this.m_handleTextRenderer(cutWords, fontNameOrFontDef, fontSize, color);
            }
        } else {
            textRenderer.setColor(color);
            textRenderer.setOpacity(color.a);
            this.m_pushToContainer(textRenderer);
            this.m_leftSpaceWidth -= textRendererWidth;
        }
    },

    m_handleCustomRenderer: function (renderer) {
        var imgSize = renderer.getContentSize();
        var imgSizeScaled = imgSize.width * renderer.getScale();
        this.m_leftSpaceWidth -= imgSizeScaled;
        if (this.m_leftSpaceWidth < 0) {
            this.m_leftSpaceWidth = this._customSize.width;
            this.m_elementRenders.push([]);
            this.m_pushToContainer(renderer);
            this.m_leftSpaceWidth -= imgSizeScaled;
        } else
            this.m_pushToContainer(renderer);
    },
    // 适配需要重写下
    _handleCustomRenderer: function (renderer) {
        var imgSize = renderer.getContentSize();
        var imgSizeScaled = imgSize.width * renderer.getScale();
        this._leftSpaceWidth -= imgSizeScaled;
        if (this._leftSpaceWidth < 0) {
            this._addNewLine();
            this._pushToContainer(renderer);
            this._leftSpaceWidth -= imgSizeScaled;
        } else
            this._pushToContainer(renderer);
    },
    //原引擎有点bug，重写下
    _handleTextRenderer: function (text, fontNameOrFontDef, fontSize, color) {
        if (text === "")
            return;

        if (text === "\n") { //Force Line Breaking
            this._addNewLine();
            return;
        }
        var langentype = (!DtLangZHType) ? true : false;

        var textRenderer = new cc.LabelTTF(text, fontNameOrFontDef, fontSize);
        var textRendererWidth = textRenderer.getContentSize().width;
        var templeftSpaceWidth = this._leftSpaceWidth - textRendererWidth;
        if (templeftSpaceWidth < 0) {
            var overstepPercent = (-templeftSpaceWidth) / textRendererWidth;
            var curText = text;
            var stringLength = curText.length;
            var leftLength = Math.floor(stringLength * (1 - overstepPercent));
            var leftWords = curText.substr(0, leftLength);

            if (langentype) {
                var firstSpaceIndex = curText.indexOf(' ');
                if (firstSpaceIndex == -1) {
                    var theoneRenderer = new cc.LabelTTF(curText, fontNameOrFontDef, fontSize);
                    var theoneRendererWidth = theoneRenderer.getContentSize().width;
                    if (theoneRendererWidth < this._customSize.width) {
                        this._addNewLine();
                        this._handleTextRenderer(curText, fontNameOrFontDef, fontSize, color);
                    }
                    return;
                }
                if (leftLength < firstSpaceIndex) {
                    var firstword = curText.substr(0, firstSpaceIndex);
                    var firstRenderer = new cc.LabelTTF(firstword, fontNameOrFontDef, fontSize);
                    var firstRendererWidth = firstRenderer.getContentSize().width;
                    if (firstRendererWidth < this._customSize.width) {
                        this._addNewLine();
                        this._handleTextRenderer(curText, fontNameOrFontDef, fontSize, color);

                    }
                    return;
                }


                //while处理下临界值，待中文才才处理
                // var leftWordsTemp = curText.substr(0, leftLength);
                // var cutIndex = leftLength;
                // var leftRenderer = new cc.LabelTTF(leftWordsTemp, fontNameOrFontDef, fontSize);
                // var leftRendererWidth = leftRenderer.getContentSize().width;
                // while (leftRendererWidth > (this._leftSpaceWidth)) {
                //     cutIndex = cutIndex - 1;
                //     leftWordsTemp = curText.substr(0, cutIndex);
                //     leftRenderer = new cc.LabelTTF(leftWordsTemp, fontNameOrFontDef, fontSize);
                //     leftRendererWidth = leftRenderer.getContentSize().width;
                // }
                // if (cutIndex != leftLength) {
                //     leftLength = cutIndex;
                //     leftWords = curText.substr(0, leftLength);
                // }

                var cutWords = curText.substr(leftLength);

                var numberreg = /(\d+)$/;
                if (numberreg.test(leftWords)) {
                    var nmresult = numberreg.exec(leftWords);
                    var numberindex = leftWords.indexOf(nmresult[1]);
                    leftWords = curText.substr(0, numberindex);
                    cutWords = curText.substr(numberindex);
                    leftLength = numberindex;
                }

                // var breakreg = /([^\w\s]+)(\w)/;
                // var lastCharreg = /\w$/;
                // if (lastCharreg.test(leftWords) && breakreg.test(leftWords)) {
                //     var templeftWords = leftWords;
                //     var tempre = breakreg.exec(leftWords);
                //     leftWords = leftWords.replace(breakreg, '$1 $2');
                //     curText = curText.replace(templeftWords, leftWords);
                // }
                //必然用空格做分割了
                var lastSpaceIndex = leftWords.lastIndexOf(' ');
                leftLength = (lastSpaceIndex === -1) ? leftLength : lastSpaceIndex + 1;
                leftWords = curText.substr(0, leftLength);
                cutWords = curText.substr(leftLength);
                var validLeftLength = leftLength > 0;


                if (validLeftLength) {
                    var newleftRenderer = new cc.LabelTTF(leftWords, fontNameOrFontDef, fontSize);
                    newleftRenderer.setColor(color);
                    newleftRenderer.setOpacity(color.a);
                    if(this._strokeEnabled){
                        newleftRenderer.enableStroke(this._strokeColor,this._strokeSize);
                    }

                    this._pushToContainer(newleftRenderer);
                }

                this._addNewLine();
                this._handleTextRenderer(cutWords, fontNameOrFontDef, fontSize, color);
            }else{
                var cutWords = curText.substr(leftLength);
                var numberreg = /(\d+)$/;
                if (numberreg.test(leftWords)) {
                    var nmresult = numberreg.exec(leftWords);
                    var numberindex = leftWords.indexOf(nmresult[1]);
                    leftWords = curText.substr(0, numberindex);
                    cutWords = curText.substr(numberindex);
                    leftLength = numberindex;
                }

                var cutIndex = leftLength;
                var leftRenderer = new cc.LabelTTF(leftWords, fontNameOrFontDef, fontSize);
                var leftRendererWidth = leftRenderer.getContentSize().width;
                while (leftRendererWidth > (this._leftSpaceWidth)) {
                    cutIndex = cutIndex - 1;
                    leftWords = curText.substr(0, cutIndex);
                    leftRenderer = new cc.LabelTTF(leftWords, fontNameOrFontDef, fontSize);
                    leftRendererWidth = leftRenderer.getContentSize().width;
                }
                if (cutIndex != leftLength) {
                    leftWords = curText.substr(0, cutIndex);
                    cutWords = curText.substr(cutIndex);
                    leftLength = cutIndex;
                }

                var startCharreg = /^[\.。,，]+/;
                if (startCharreg.test(cutWords)) {
                    var tempre = startCharreg.exec(cutWords);
                    var douhao=tempre[0];
                    cutWords = cutWords.replace(startCharreg, '');
                    leftWords= leftWords+douhao;
                }

                var validLeftLength = leftLength > 0;


                if (validLeftLength) {
                    var newleftRenderer = new cc.LabelTTF(leftWords, fontNameOrFontDef, fontSize);
                    newleftRenderer.setColor(color);
                    newleftRenderer.setOpacity(color.a);
                    if(this._strokeEnabled){
                        newleftRenderer.enableStroke(this._strokeColor,this._strokeSize);
                    }
                    this._pushToContainer(newleftRenderer);
                }

                this._addNewLine();
                this._handleTextRenderer(cutWords, fontNameOrFontDef, fontSize, color);
            }
        } else {
            textRenderer.setColor(color);
            textRenderer.setOpacity(color.a);
            if(this._strokeEnabled){
                textRenderer.enableStroke(this._strokeColor,this._strokeSize);
            }
            this._leftSpaceWidth -= textRendererWidth;
            this._pushToContainer(textRenderer);
        }
    },
    m_pushToContainer: function (renderer) {
        if (this.m_elementRenders.length <= 0)
            return;
        this.m_elementRenders[this.m_elementRenders.length - 1].push(renderer);
    },
    clearAllEles: function () {
        this._richElements = [];
    },
    enableOutline: function (outlineColor, outlineSize) {
        if(outlineSize<=0){
            return;
        }
        this._strokeEnabled=true;
        this._strokeColor=outlineColor;
        this._strokeSize=outlineSize;
    },
});