AmCharts.AmMap = AmCharts.Class({
    inherits: AmCharts.AmChart,
    construct: function(a) {
        this.cname = "AmMap";
        this.type = "map";
        this.theme = a;
        this.version = "3.13.3";
        this.svgNotSupported = "This browser doesn't support SVG. Use Chrome, Firefox, Internet Explorer 9 or later.";
        this.createEvents("rollOverMapObject", "rollOutMapObject", "clickMapObject", "selectedObjectChanged", "homeButtonClicked", "zoomCompleted", "dragCompleted", "positionChanged", "writeDevInfo", "click");
        this.zoomDuration = 1;
        this.zoomControl = new AmCharts.ZoomControl(a);
        this.fitMapToContainer = !0;
        this.mouseWheelZoomEnabled = this.backgroundZoomsToTop = !1;
        this.allowClickOnSelectedObject = this.useHandCursorOnClickableOjects = this.showBalloonOnSelectedObject = !0;
        this.showObjectsAfterZoom = this.wheelBusy = !1;
        this.zoomOnDoubleClick = this.useObjectColorForBalloon = !0;
        this.allowMultipleDescriptionWindows = !1;
        this.dragMap = this.centerMap = this.linesAboveImages = !0;
        this.colorSteps = 5;
        this.showAreasInList = !0;
        this.showLinesInList = this.showImagesInList = !1;
        this.areasProcessor = new AmCharts.AreasProcessor(this);
        this.areasSettings = new AmCharts.AreasSettings(a);
        this.imagesProcessor = new AmCharts.ImagesProcessor(this);
        this.imagesSettings = new AmCharts.ImagesSettings(a);
        this.linesProcessor = new AmCharts.LinesProcessor(this);
        this.linesSettings = new AmCharts.LinesSettings(a);
        this.showDescriptionOnHover = !1;
        AmCharts.AmMap.base.construct.call(this, a);
        this.creditsPosition = "bottom-left";
        this.product = "ammap";
        this.areasClasses = {};
        AmCharts.applyTheme(this, a, this.cname);
    },
    initChart: function() {
        this.zoomInstantly = !0;
        var a = this.container;
        if (this.sizeChanged && AmCharts.hasSVG && this.chartCreated) {
            this.freeLabelsSet && this.freeLabelsSet.remove();
            this.freeLabelsSet = a.set();
            this.container.setSize(this.realWidth, this.realHeight);
            this.resizeMap();
            this.drawBackground();
            this.redrawLabels();
            this.drawTitles();
            this.processObjects();
            this.rescaleObjects();
            a = this.container;
            this.zoomControl.init(this, a);
            this.drawBg();
            var b = this.smallMap;
            b && b.init(this, a);
            (b = this.valueLegend) && b.init(this, a);
            this.sizeChanged = !1;
            this.zoomToLongLat(this.zLevelTemp, this.zLongTemp,
                this.zLatTemp, !0);
            this.previousWidth = this.realWidth;
            this.previousHeight = this.realHeight;
            this.updateSmallMap();
            this.linkSet.toFront();
        } else
        (AmCharts.AmMap.base.initChart.call(this), AmCharts.hasSVG) ? (this.dataChanged && (this.parseData(), this.dispatchDataUpdated = !0, this.dataChanged = !1, a = this.legend) && (a.position = "absolute", a.invalidateSize()), this.createDescriptionsDiv(), this.svgAreas = [], this.svgAreasById = {}, this.drawChart()) : (document.createTextNode(this.svgNotSupported), this.chartDiv.style.textAlign =
            "", this.chartDiv.setAttribute("class", "ammapAlert"), this.chartDiv.innerHTML = this.svgNotSupported, this.fire("failed", { type: "failed", chart: this }), clearInterval(this.interval));
    },
    invalidateSize: function() {
        var a = this.zoomLongitude();
        isNaN(a) || (this.zLongTemp = a);
        a = this.zoomLatitude();
        isNaN(a) || (this.zLatTemp = a);
        a = this.zoomLevel();
        isNaN(a) || (this.zLevelTemp = a);
        AmCharts.AmMap.base.invalidateSize.call(this);
    },
    handleWheelReal: function(a) {
        if (!this.wheelBusy) {
            this.stopAnimation();
            var b = this.zoomLevel(),
                c = this.zoomControl,
                d = c.zoomFactor;
            this.wheelBusy = !0;
            a = AmCharts.fitToBounds(0 < a ? b * d : b / d, c.minZoomLevel, c.maxZoomLevel);
            d = this.mouseX / this.mapWidth;
            c = this.mouseY / this.mapHeight;
            d = (this.zoomX() - d) * (a / b) + d;
            b = (this.zoomY() - c) * (a / b) + c;
            this.zoomTo(a, d, b);
        }
    },
    addLegend: function(a, b) {
        a.position = "absolute";
        a.autoMargins = !1;
        a.valueWidth = 0;
        a.switchable = !1;
        AmCharts.AmMap.base.addLegend.call(this, a, b);
        void 0 == a.enabled && (a.enabled = !0);
        return a;
    },
    handleLegendEvent: function() {},
    createDescriptionsDiv: function() {
        if (!this.descriptionsDiv) {
            var a =
                    document.createElement("div"),
                b = a.style;
            b.position = "absolute";
            b.left = "0px";
            b.top = "0px";
            this.descriptionsDiv = a;
        }
        this.containerDiv.appendChild(this.descriptionsDiv);
    },
    drawChart: function() {
        AmCharts.AmMap.base.drawChart.call(this);
        var a = this.dataProvider;
        this.dataProvider = a = AmCharts.extend(a, new AmCharts.MapData, !0);
        this.areasSettings = AmCharts.processObject(this.areasSettings, AmCharts.AreasSettings, this.theme);
        this.imagesSettings = AmCharts.processObject(this.imagesSettings, AmCharts.ImagesSettings, this.theme);
        this.linesSettings = AmCharts.processObject(this.linesSettings, AmCharts.LinesSettings, this.theme);
        var b = this.container;
        this.mapContainer && this.mapContainer.remove();
        this.mapContainer = b.set();
        this.graphsSet.push(this.mapContainer);
        var c;
        a.map && (c = AmCharts.maps[a.map]);
        a.mapVar && (c = a.mapVar);
        c ? (this.svgData = c.svg, this.getBounds(), this.buildEverything()) : (a = a.mapURL) && this.loadXml(a);
        this.balloonsSet.toFront();
    },
    drawBg: function() {
        var a = this;
        a.background.click(function() { a.handleBackgroundClick() });
    },
    buildEverything: function() {
        var a =
            this;
        if (0 < a.realWidth && 0 < a.realHeight) {
            var b = a.container;
            a.zoomControl = AmCharts.processObject(a.zoomControl, AmCharts.ZoomControl, a.theme);
            a.zoomControl.init(this, b);
            a.drawBg();
            a.buildSVGMap();
            var c = a.smallMap;
            c && (a.smallMap = AmCharts.processObject(a.smallMap, AmCharts.SmallMap, a.theme), c = a.smallMap, c.init(a, b));
            c = a.dataProvider;
            isNaN(c.zoomX) && isNaN(c.zoomY) && isNaN(c.zoomLatitude) && isNaN(c.zoomLongitude) && (a.centerMap ? (c.zoomLatitude = a.coordinateToLatitude(a.mapHeight / 2), c.zoomLongitude = a.coordinateToLongitude(a.mapWidth /
                2)) : (c.zoomX = 0, c.zoomY = 0), a.zoomInstantly = !0);
            a.selectObject(a.dataProvider);
            a.processAreas();
            if (c = a.valueLegend)c = AmCharts.processObject(c, AmCharts.ValueLegend, a.theme), a.valueLegend = c, c.init(a, b);
            a.objectList && (a.objectList = AmCharts.processObject(a.objectList, AmCharts.ObjectList), b = a.objectList) && (a.clearObjectList(), b.init(a));
            clearInterval(a.mapInterval);
            a.mapInterval = setInterval(function() { a.update.call(a) }, AmCharts.updateRate);
            a.dispDUpd();
            a.linkSet.toFront();
            a.chartCreated = !0;
        } else a.cleanChart();
    },
    hideGroup: function(a) { this.showHideGroup(a, !1) },
    showGroup: function(a) { this.showHideGroup(a, !0) },
    showHideGroup: function(a, b) {
        this.showHideReal(this.imagesProcessor.allObjects, a, b);
        this.showHideReal(this.areasProcessor.allObjects, a, b);
        this.showHideReal(this.linesProcessor.allObjects, a, b);
    },
    showHideReal: function(a, b, c) {
        var d;
        for (d = 0; d < a.length; d++) {
            var e = a[d];
            if (e.groupId == b) {
                var f = e.displayObject;
                f && (c ? (e.hidden = !1, f.show()) : (e.hidden = !0, f.hide()));
            }
        }
    },
    update: function() { this.zoomControl.update() },
    animateMap: function() {
        var a =
            this;
        a.totalFrames = 1E3 * a.zoomDuration / AmCharts.updateRate;
        a.totalFrames += 1;
        a.frame = 0;
        a.tweenPercent = 0;
        setTimeout(function() { a.updateSize.call(a) }, AmCharts.updateRate);
    },
    updateSize: function() {
        var a = this, b = a.totalFrames;
        a.preventHover = !0;
        a.frame <= b ? (a.frame++, b = AmCharts.easeOutSine(0, a.frame, 0, 1, b), 1 <= b ? (b = 1, a.preventHover = !1, a.wheelBusy = !1) : setTimeout(function() { a.updateSize.call(a) }, AmCharts.updateRate), .8 < b && (a.preventHover = !1)) : (b = 1, a.preventHover = !1, a.wheelBusy = !1);
        a.tweenPercent = b;
        a.rescaleMapAndObjects();
    },
    rescaleMapAndObjects: function() {
        var a = this.initialScale, b = this.initialX, c = this.initialY, d = this.tweenPercent, a = a + (this.finalScale - a) * d;
        this.mapContainer.translate(b + (this.finalX - b) * d, c + (this.finalY - c) * d, a);
        if (this.areasSettings.adjustOutlineThickness)
            for (b = this.dataProvider.areas, c = 0; c < b.length; c++) {
                var e = b[c], f = e.displayObject;
                f && f.setAttr("stroke-width", e.outlineThicknessReal / a);
            }
        this.rescaleObjects();
        this.positionChanged();
        this.updateSmallMap();
        1 == d && (d = { type: "zoomCompleted", chart: this }, this.fire(d.type,
            d));
    },
    updateSmallMap: function() { this.smallMap && this.smallMap.update() },
    rescaleObjects: function() {
        var a = this.mapContainer.scale, b = this.imagesProcessor.objectsToResize, c;
        for (c = 0; c < b.length; c++) {
            var d = b[c].image;
            d.translate(d.x, d.y, b[c].scale / a, !0);
        }
        b = this.linesProcessor;
        if (d = b.linesToResize)
            for (c = 0; c < d.length; c++) {
                var e = d[c];
                e.line.setAttr("stroke-width", e.thickness / a);
            }
        b = b.objectsToResize;
        for (c = 0; c < b.length; c++)d = b[c], d.translate(d.x, d.y, 1 / a);
    },
    handleTouchStart: function(a) {
        this.handleMouseMove(a);
        this.handleMouseDown(a);
    },
    handleTouchEnd: function(a) {
        this.previousDistance = NaN;
        this.handleReleaseOutside(a);
    },
    handleMouseDown: function(a) {
        AmCharts.resetMouseOver();
        this.mouseIsOver = !0;
        a && this.mouseIsOver && a.preventDefault && this.panEventsEnabled && a.preventDefault();
        if (this.chartCreated && !this.preventHover && (this.dragMap && (this.stopAnimation(), this.isDragging = !0, this.mapContainerClickX = this.mapContainer.x, this.mapContainerClickY = this.mapContainer.y), a || (a = window.event), a.shiftKey && !0 === this.developerMode && this.getDevInfo(), a &&
            a.touches)) {
            var b = this.mouseX, c = this.mouseY, d = a.touches.item(1);
            d && (a = d.pageX - AmCharts.findPosX(this.div), d = d.pageY - AmCharts.findPosY(this.div), this.middleXP = (b + (a - b) / 2) / this.realWidth, this.middleYP = (c + (d - c) / 2) / this.realHeight);
        }
    },
    stopDrag: function() { this.isDragging = !1 },
    handleReleaseOutside: function() {
        if (AmCharts.isModern && !this.preventHover) {
            this.stopDrag();
            var a = this.zoomControl;
            a && a.draggerUp();
            this.mapWasDragged = !1;
            var a = this.mapContainer, b = this.mapContainerClickX, c = this.mapContainerClickY;
            isNaN(b) ||
                isNaN(c) || !(2 < Math.abs(a.x - b) || Math.abs(a.y - c)) || (this.mapWasDragged = !0, a = { type: "dragCompleted", zoomX: this.zoomX(), zoomY: this.zoomY(), zoomLevel: this.zoomLevel(), chart: this }, this.fire(a.type, a));
            !this.mouseIsOver || this.mapWasDragged || this.skipClick || (a = { type: "click", x: this.mouseX, y: this.mouseY, chart: this }, this.fire(a.type, a), this.skipClick = !1);
            this.mapContainerClickY = this.mapContainerClickX = NaN;
            this.objectWasClicked = !1;
            this.zoomOnDoubleClick && this.mouseIsOver && (a = (new Date).getTime(), 200 > a - this.previousClickTime &&
                20 < a - this.previousClickTime && this.doDoubleClickZoom(), this.previousClickTime = a);
        }
    },
    handleTouchMove: function(a) { this.handleMouseMove(a) },
    resetPinch: function() { this.mapWasPinched = !1 },
    handleMouseMove: function(a) {
        var b = this;
        AmCharts.AmMap.base.handleMouseMove.call(b, a);
        b.panEventsEnabled && b.mouseIsOver && a && a.preventDefault && a.preventDefault();
        var c = b.previuosMouseX, d = b.previuosMouseY, e = b.mouseX, f = b.mouseY, g = b.zoomControl;
        isNaN(c) && (c = e);
        isNaN(d) && (d = f);
        b.mouse2X = NaN;
        b.mouse2Y = NaN;
        a && a.touches && (a = a.touches.item(1)) &&
        (b.mouse2X = a.pageX - AmCharts.findPosX(b.div), b.mouse2Y = a.pageY - AmCharts.findPosY(b.div));
        if (a = b.mapContainer) {
            var k = b.mouse2X, h = b.mouse2Y;
            b.pinchTO && clearTimeout(b.pinchTO);
            b.pinchTO = setTimeout(function() { b.resetPinch.call(b) }, 1E3);
            var l = b.realHeight, p = b.realWidth, m = b.mapWidth, u = b.mapHeight;
            if (!isNaN(k)) {
                b.stopDrag();
                var k = Math.sqrt(Math.pow(k - e, 2) + Math.pow(h - f, 2)), t = b.previousDistance, h = Math.max(b.realWidth, b.realHeight);
                5 > Math.abs(t - k) && (b.isDragging = !0);
                if (!isNaN(t)) {
                    var A = 5 * Math.abs(t - k) / h,
                        h = a.scale,
                        h = AmCharts.fitToBounds(t < k ? h + h * A : h - h * A, g.minZoomLevel, g.maxZoomLevel),
                        g = b.zoomLevel(),
                        v = b.middleXP,
                        t = b.middleYP,
                        A = l / u,
                        w = p / m,
                        v = (b.zoomX() - v * w) * (h / g) + v * w,
                        t = (b.zoomY() - t * A) * (h / g) + t * A;
                    .1 < Math.abs(h - g) && (b.zoomTo(h, v, t, !0), b.mapWasPinched = !0, clearTimeout(b.pinchTO));
                }
                b.previousDistance = k;
            }
            k = a.scale;
            b.isDragging && (b.hideBalloon(), b.positionChanged(), c = a.x + (e - c), d = a.y + (f - d), b.preventDragOut && (u = -u * k + l / 2, l /= 2, c = AmCharts.fitToBounds(c, -m * k + p / 2, p / 2), d = AmCharts.fitToBounds(d, u, l)), a.translate(c, d, k), b.updateSmallMap());
            b.previuosMouseX = e;
            b.previuosMouseY = f;
        }
    },
    selectObject: function(a) {
        var b = this;
        a || (a = b.dataProvider);
        a.isOver = !1;
        var c = a.linkToObject;
        "string" == typeof c && (c = b.getObjectById(c));
        a.useTargetsZoomValues && c && (a.zoomX = c.zoomX, a.zoomY = c.zoomY, a.zoomLatitude = c.zoomLatitude, a.zoomLongitude = c.zoomLongitude, a.zoomLevel = c.zoomLevel);
        var d = b.selectedObject;
        d && b.returnInitialColor(d);
        b.selectedObject = a;
        var e = !1, f;
        "MapArea" == a.objectType && (a.autoZoomReal && (e = !0), f = b.areasSettings.selectedOutlineColor);
        if (c && !e && ("string" ==
            typeof c && (c = b.getObjectById(c)), isNaN(a.zoomLevel) && isNaN(a.zoomX) && isNaN(a.zoomY))) {
            if (b.extendMapData(c))return;
            b.selectObject(c);
            return;
        }
        b.allowMultipleDescriptionWindows || b.closeAllDescriptions();
        clearTimeout(b.selectedObjectTimeOut);
        clearTimeout(b.processObjectsTimeOut);
        c = b.zoomDuration;
        !e && isNaN(a.zoomLevel) && isNaN(a.zoomX) && isNaN(a.zoomY) ? (b.showDescriptionAndGetUrl(), b.processObjects()) : (b.selectedObjectTimeOut = setTimeout(function() { b.showDescriptionAndGetUrl.call(b) }, 1E3 * c + 200), b.showObjectsAfterZoom ?
            b.processObjectsTimeOut = setTimeout(function() { b.processObjects.call(b) }, 1E3 * c + 200) : b.processObjects());
        if (e = a.displayObject) {
            a.bringForwardOnHover && e.toFront();
            if (!a.preserveOriginalAttributes) {
                e.setAttr("stroke", a.outlineColorReal);
                var g = a.selectedColorReal;
                void 0 !== g && e.setAttr("fill", g);
                void 0 !== f && e.setAttr("stroke", f);
                if ("MapLine" == a.objectType) {
                    var k = a.lineSvg;
                    k && k.setAttr("stroke", g);
                    var h = a.arrowSvg;
                    h && (h.setAttr("fill", g), h.setAttr("stroke", g));
                }
                var l = a.imageLabel;
                l && (c = a.selectedLabelColorReal,
                    void 0 !== c && l.setAttr("fill", c));
            }
            a.selectable || (e.setAttr("cursor", "default"), l && l.setAttr("cursor", "default"));
        } else b.returnInitialColorReal(a);
        if (e = a.groupId)for (l = b.getGroupById(e), c = 0; c < l.length; c++)if (h = l[c], h.isOver = !1, e = h.displayObject)if (k = h.selectedColorReal, void 0 !== f && e.setAttr("stroke", f), void 0 !== k ? e.setAttr("fill", k) : b.returnInitialColor(h), "MapLine" == h.objectType && ((k = h.lineSvg) && k.setAttr("stroke", g), h = h.arrowSvg))h.setAttr("fill", g), h.setAttr("stroke", g);
        b.zoomToSelectedObject();
        d != a && (a = { type: "selectedObjectChanged", chart: b }, b.fire(a.type, a));
    },
    returnInitialColor: function(a, b) {
        this.returnInitialColorReal(a);
        b && (a.isFirst = !1);
        if (this.selectedObject.bringForwardOnHover) {
            var c = this.selectedObject.displayObject;
            c && c.toFront();
        }
        if (c = a.groupId) {
            var c = this.getGroupById(c), d;
            for (d = 0; d < c.length; d++)this.returnInitialColorReal(c[d]), b && (c[d].isFirst = !1);
        }
    },
    closeAllDescriptions: function() { this.descriptionsDiv.innerHTML = "" },
    returnInitialColorReal: function(a) {
        a.isOver = !1;
        var b = a.displayObject;
        if (b) {
            b.toPrevious();
            if ("MapImage" == a.objectType) {
                var c = a.tempScale;
                isNaN(c) || b.translate(b.x, b.y, c, !0);
                a.tempScale = NaN;
            }
            c = a.colorReal;
            if ("MapLine" == a.objectType) {
                var d = a.lineSvg;
                d && d.setAttr("stroke", c);
                if (d = a.arrowSvg)d.setAttr("fill", c), d.setAttr("stroke", c);
            }
            a.showAsSelected && (c = a.selectedColorReal);
            "bubble" == a.type && (c = void 0);
            void 0 !== c && b.setAttr("fill", c);
            (d = a.image) && d.setAttr("fill", c);
            b.setAttr("stroke", a.outlineColorReal);
            "MapArea" == a.objectType && (c = 1, this.areasSettings.adjustOutlineThickness &&
            (c = this.zoomLevel()), b.setAttr("fill-opacity", a.alphaReal), b.setAttr("stroke-opacity", a.outlineAlphaReal), b.setAttr("stroke-width", a.outlineThicknessReal / c));
            (c = a.pattern) && b.pattern(c, this.mapScale);
            (b = a.imageLabel) && !a.labelInactive && b.setAttr("fill", a.labelColorReal);
        }
    },
    zoomToRectangle: function(a, b, c, d) {
        var e = this.realWidth, f = this.realHeight, g = this.mapSet.scale, k = this.zoomControl, e = AmCharts.fitToBounds(c / e > d / f ? .8 * e / (c * g) : .8 * f / (d * g), k.minZoomLevel, k.maxZoomLevel);
        this.zoomToMapXY(e, (a + c / 2) * g, (b +
            d / 2) * g);
    },
    zoomToLatLongRectangle: function(a, b, c, d) {
        var e = this.dataProvider, f = this.zoomControl, g = Math.abs(c - a), k = Math.abs(b - d), h = Math.abs(e.rightLongitude - e.leftLongitude), e = Math.abs(e.topLatitude - e.bottomLatitude), f = AmCharts.fitToBounds(g / h > k / e ? .8 * h / g : .8 * e / k, f.minZoomLevel, f.maxZoomLevel);
        this.zoomToLongLat(f, a + (c - a) / 2, d + (b - d) / 2);
    },
    getGroupById: function(a) {
        var b = [];
        this.getGroup(this.imagesProcessor.allObjects, a, b);
        this.getGroup(this.linesProcessor.allObjects, a, b);
        this.getGroup(this.areasProcessor.allObjects,
            a, b);
        return b;
    },
    zoomToGroup: function(a) {
        a = "object" == typeof a ? a : this.getGroupById(a);
        var b, c, d, e, f;
        for (f = 0; f < a.length; f++) {
            var g = a[f].displayObject.getBBox(), k = g.y, h = g.y + g.height, l = g.x, g = g.x + g.width;
            if (k < b || isNaN(b))b = k;
            if (h > e || isNaN(e))e = h;
            if (l < c || isNaN(c))c = l;
            if (g > d || isNaN(d))d = g;
        }
        a = this.mapSet.getBBox();
        c -= a.x;
        d -= a.x;
        e -= a.y;
        b -= a.y;
        this.zoomToRectangle(c, b, d - c, e - b);
    },
    getGroup: function(a, b, c) {
        if (a) {
            var d;
            for (d = 0; d < a.length; d++) {
                var e = a[d];
                e.groupId == b && c.push(e);
            }
        }
    },
    zoomToStageXY: function(a, b, c, d) {
        if (!this.objectWasClicked) {
            var e =
                this.zoomControl;
            a = AmCharts.fitToBounds(a, e.minZoomLevel, e.maxZoomLevel);
            e = this.zoomLevel();
            c = this.coordinateToLatitude((c - this.mapContainer.y) / e);
            b = this.coordinateToLongitude((b - this.mapContainer.x) / e);
            this.zoomToLongLat(a, b, c, d);
        }
    },
    zoomToLongLat: function(a, b, c, d) {
        b = this.longitudeToCoordinate(b);
        c = this.latitudeToCoordinate(c);
        this.zoomToMapXY(a, b, c, d);
    },
    zoomToMapXY: function(a, b, c, d) {
        var e = this.mapWidth, f = this.mapHeight;
        this.zoomTo(a, -(b / e) * a + this.realWidth / e / 2, -(c / f) * a + this.realHeight / f / 2, d);
    },
    zoomToObject: function(a) {
        var b =
                a.zoomLatitude,
            c = a.zoomLongitude,
            d = a.zoomLevel,
            e = this.zoomInstantly,
            f = a.zoomX,
            g = a.zoomY,
            k = this.realWidth,
            h = this.realHeight;
        isNaN(d) || (isNaN(b) || isNaN(c) ? this.zoomTo(d, f, g, e) : this.zoomToLongLat(d, c, b, e));
        this.zoomInstantly = !1;
        "MapImage" == a.objectType && isNaN(a.zoomX) && isNaN(a.zoomY) && isNaN(a.zoomLatitude) && isNaN(a.zoomLongitude) && !isNaN(a.latitude) && !isNaN(a.longitude) && this.zoomToLongLat(a.zoomLevel, a.longitude, a.latitude);
        "MapArea" == a.objectType && (f = a.displayObject.getBBox(), b = this.mapScale, c = f.x *
            b, d = f.y * b, e = f.width * b, f = f.height * b, k = a.autoZoomReal && isNaN(a.zoomLevel) ? e / k > f / h ? .8 * k / e : .8 * h / f : a.zoomLevel, h = this.zoomControl, k = AmCharts.fitToBounds(k, h.minZoomLevel, h.maxZoomLevel), isNaN(a.zoomX) && isNaN(a.zoomY) && isNaN(a.zoomLatitude) && isNaN(a.zoomLongitude) && (a = this.mapSet.getBBox(), this.zoomToMapXY(k, -a.x * b + c + e / 2, -a.y * b + d + f / 2)));
    },
    zoomToSelectedObject: function() { this.zoomToObject(this.selectedObject) },
    zoomTo: function(a, b, c, d) {
        var e = this.zoomControl;
        a = AmCharts.fitToBounds(a, e.minZoomLevel, e.maxZoomLevel);
        e = this.zoomLevel();
        isNaN(b) && (b = this.realWidth / this.mapWidth, b = (this.zoomX() - .5 * b) * (a / e) + .5 * b);
        isNaN(c) && (c = this.realHeight / this.mapHeight, c = (this.zoomY() - .5 * c) * (a / e) + .5 * c);
        this.stopAnimation();
        isNaN(a) || (e = this.mapContainer, this.initialX = e.x, this.initialY = e.y, this.initialScale = e.scale, this.finalX = this.mapWidth * b, this.finalY = this.mapHeight * c, this.finalScale = a, this.finalX != this.initialX || this.finalY != this.initialY || this.finalScale != this.initialScale ? d ? (this.tweenPercent = 1, this.rescaleMapAndObjects(),
            this.wheelBusy = !1) : this.animateMap() : this.wheelBusy = !1);
    },
    loadXml: function(a) {
        var b;
        b = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
        b.overrideMimeType && b.overrideMimeType("text/xml");
        b.open("GET", a, !1);
        b.send();
        this.parseXMLObject(b.responseXML);
        this.svgData && this.buildEverything();
    },
    stopAnimation: function() { this.frame = this.totalFrames },
    processObjects: function() {
        var a = this.container, b = this.stageImagesContainer;
        b && b.remove();
        this.stageImagesContainer = b = a.set();
        this.trendLinesSet.push(b);
        var c = this.stageLinesContainer;
        c && c.remove();
        this.stageLinesContainer = c = a.set();
        this.trendLinesSet.push(c);
        var d = this.mapImagesContainer;
        d && d.remove();
        this.mapImagesContainer = d = a.set();
        this.mapContainer.push(d);
        var e = this.mapLinesContainer;
        e && e.remove();
        this.mapLinesContainer = e = a.set();
        this.mapContainer.push(e);
        this.linesAboveImages ? (d.toFront(), b.toFront(), e.toFront(), c.toFront()) : (e.toFront(), c.toFront(), d.toFront(), b.toFront());
        if (a = this.selectedObject)
            this.imagesProcessor.reset(), this.linesProcessor.reset(),
                this.linesAboveImages ? (this.imagesProcessor.process(a), this.linesProcessor.process(a)) : (this.linesProcessor.process(a), this.imagesProcessor.process(a));
        this.rescaleObjects();
    },
    processAreas: function() { this.areasProcessor.process(this.dataProvider) },
    buildSVGMap: function() {
        var a = this.svgData.g.path, b = this.container, c = b.set();
        void 0 === a.length && (a = [a]);
        var d;
        for (d = 0; d < a.length; d++) {
            var e = a[d], f = e.d, g = e.title;
            e.titleTr && (g = e.titleTr);
            f = b.path(f);
            f.id = e.id;
            if (this.areasSettings.preserveOriginalAttributes) {
                f.customAttr =
                {};
                for (var k in e)"d" != k && "id" != k && "title" != k && (f.customAttr[k] = e[k]);
            }
            this.svgAreasById[e.id] = { area: f, title: g, className: e["class"] };
            this.svgAreas.push(f);
            c.push(f);
        }
        this.mapSet = c;
        this.mapContainer.push(c);
        this.resizeMap();
    },
    addObjectEventListeners: function(a, b) {
        var c = this;
        a.mouseup(function(a) { c.clickMapObject(b, a) }).mouseover(function(a) { c.rollOverMapObject(b, !0, a) }).mouseout(function(a) { c.rollOutMapObject(b, a) }).touchend(function(a) { c.clickMapObject(b, a) }).touchstart(function(a) {
            c.rollOverMapObject(b,
                !0, a);
        });
    },
    checkIfSelected: function(a) {
        var b = this.selectedObject;
        if (b == a)return!0;
        if (b = b.groupId) {
            var b = this.getGroupById(b), c;
            for (c = 0; c < b.length; c++)if (b[c] == a)return!0;
        }
        return!1;
    },
    clearMap: function() {
        this.chartDiv.innerHTML = "";
        this.clearObjectList();
    },
    clearObjectList: function() {
        var a = this.objectList;
        a && a.div && (a.div.innerHTML = "");
    },
    checkIfLast: function(a) {
        if (a) {
            var b = a.parentNode;
            if (b && b.lastChild == a)return!0;
        }
        return!1;
    },
    showAsRolledOver: function(a) {
        var b = a.displayObject;
        if (!a.showAsSelected && b && !a.isOver) {
            b.node.onmouseout =
                function() {};
            b.node.onmouseover = function() {};
            b.node.onclick = function() {};
            !a.isFirst && a.bringForwardOnHover && (b.toFront(), a.isFirst = !0);
            var c = a.rollOverColorReal, d;
            a.preserveOriginalAttributes && (c = void 0);
            if (void 0 != c)
                if ("MapImage" == a.objectType)(d = a.image) && d.setAttr("fill", c);
                else if ("MapLine" == a.objectType) {
                    if ((d = a.lineSvg) && d.setAttr("stroke", c), d = a.arrowSvg)d.setAttr("fill", c), d.setAttr("stroke", c);
                } else b.setAttr("fill", c);
            (c = a.imageLabel) && !a.labelInactive && (d = a.labelRollOverColorReal, void 0 !=
                d && c.setAttr("fill", d));
            c = a.rollOverOutlineColorReal;
            void 0 != c && ("MapImage" == a.objectType ? (d = a.image) && d.setAttr("stroke", c) : b.setAttr("stroke", c));
            if ("MapArea" == a.objectType) {
                c = this.areasSettings;
                d = a.rollOverAlphaReal;
                isNaN(d) || b.setAttr("fill-opacity", d);
                d = c.rollOverOutlineAlpha;
                isNaN(d) || b.setAttr("stroke-opacity", d);
                d = 1;
                this.areasSettings.adjustOutlineThickness && (d = this.zoomLevel());
                var e = c.rollOverOutlineThickness;
                isNaN(e) || b.setAttr("stroke-width", e / d);
                (c = c.rollOverPattern) && b.pattern(c, this.mapScale);
            }
            "MapImage" ==
                a.objectType && (c = a.rollOverScaleReal, isNaN(c) || 1 == c || (a.tempScale = b.scale, b.translate(b.x, b.y, b.scale * c, !0)));
            this.useHandCursorOnClickableOjects && this.checkIfClickable(a) && b.setAttr("cursor", "pointer");
            this.addObjectEventListeners(b, a);
            a.isOver = !0;
        }
    },
    rollOverMapObject: function(a, b, c) {
        if (this.chartCreated) {
            this.handleMouseMove();
            var d = this.previouslyHovered;
            d && d != a ? (!1 === this.checkIfSelected(d) && (this.returnInitialColor(d, !0), this.previouslyHovered = null), this.hideBalloon()) : clearTimeout(this.hoverInt);
            if (!this.preventHover) {
                if (!1 === this.checkIfSelected(a)) {
                    if (d = a.groupId) {
                        var d = this.getGroupById(d), e;
                        for (e = 0; e < d.length; e++)d[e] != a && this.showAsRolledOver(d[e]);
                    }
                    this.showAsRolledOver(a);
                } else(d = a.displayObject) && (this.allowClickOnSelectedObject ? d.setAttr("cursor", "pointer") : d.setAttr("cursor", "default"));
                if (this.showDescriptionOnHover)this.showDescription(a);
                else if ((this.showBalloonOnSelectedObject || !this.checkIfSelected(a)) && !1 !== b && (e = this.balloon, b = a.colorReal, d = "", void 0 !== b && this.useObjectColorForBalloon ||
                (b = e.fillColor), (e = a.balloonTextReal) && (d = this.formatString(e, a)), this.balloonLabelFunction && (d = this.balloonLabelFunction(a, this)), d && "" !== d)) {
                    var f, g;
                    "MapArea" == a.objectType && (g = this.getAreaCenterLatitude(a), f = this.getAreaCenterLongitude(a), g = this.latitudeToY(g), f = this.longitudeToX(f));
                    "MapImage" == a.objectType && (f = a.displayObject.x * this.zoomLevel() + this.mapContainer.x, g = a.displayObject.y * this.zoomLevel() + this.mapContainer.y);
                    this.showBalloon(d, b, this.mouseIsOver, f, g);
                }
                c = {
                    type: "rollOverMapObject",
                    mapObject: a,
                    chart: this,
                    event: c
                };
                this.fire(c.type, c);
                this.previouslyHovered = a;
            }
        }
    },
    longitudeToX: function(a) { return this.longitudeToCoordinate(a) * this.zoomLevel() + this.mapContainer.x },
    latitudeToY: function(a) { return this.latitudeToCoordinate(a) * this.zoomLevel() + this.mapContainer.y },
    rollOutMapObject: function(a, b) {
        this.hideBalloon();
        if (this.chartCreated && a.isOver) {
            this.checkIfSelected(a) || this.returnInitialColor(a);
            var c = { type: "rollOutMapObject", mapObject: a, chart: this, event: b };
            this.fire(c.type, c);
        }
    },
    formatString: function(a,
        b) {
        var c = this.nf, d = this.pf, e = b.title;
        b.titleTr && (e = b.titleTr);
        void 0 == e && (e = "");
        var f = b.value, f = isNaN(f) ? "" : AmCharts.formatNumber(f, c), c = b.percents, c = isNaN(c) ? "" : AmCharts.formatNumber(c, d), d = b.description;
        void 0 == d && (d = "");
        var g = b.customData;
        void 0 == g && (g = "");
        return a = AmCharts.massReplace(a, { "[[title]]": e, "[[value]]": f, "[[percent]]": c, "[[description]]": d, "[[customData]]": g });
    },
    clickMapObject: function(a, b) {
        this.hideBalloon();
        if (this.chartCreated && !this.preventHover && !this.mapWasDragged && this.checkIfClickable(a) &&
            !this.mapWasPinched) {
            this.selectObject(a);
            var c = { type: "clickMapObject", mapObject: a, chart: this, event: b };
            this.fire(c.type, c);
            this.objectWasClicked = !0;
        }
    },
    checkIfClickable: function(a) {
        var b = this.allowClickOnSelectedObject;
        return this.selectedObject == a && b ? !0 : this.selectedObject != a || b ? !0 === a.selectable || "MapArea" == a.objectType && a.autoZoomReal || a.url || a.linkToObject || 0 < a.images.length || 0 < a.lines.length || !isNaN(a.zoomLevel) || !isNaN(a.zoomX) || !isNaN(a.zoomY) || a.description ? !0 : !1 : !1;
    },
    handleResize: function() {
        (AmCharts.isPercents(this.width) ||
            AmCharts.isPercents(this.height)) && this.invalidateSize();
        this.renderFix();
    },
    resizeMap: function() {
        var a = this.mapSet;
        if (a)
            if (this.fitMapToContainer) {
                var b = a.getBBox(), c = this.realWidth, d = this.realHeight, e = b.width, f = b.height, c = e / c > f / d ? c / e : d / f;
                a.translate(-b.x * c, -b.y * c, c);
                this.mapScale = c;
                this.mapHeight = f * c;
                this.mapWidth = e * c;
            } else b = group.transform.match(/([\-]?[\d.]+)/g), a.translate(b[0], b[1], b[2]);
    },
    zoomIn: function() {
        this.skipClick = !0;
        var a = this.zoomLevel() * this.zoomControl.zoomFactor;
        this.zoomTo(a);
    },
    zoomOut: function() {
        this.skipClick =
            !0;
        var a = this.zoomLevel() / this.zoomControl.zoomFactor;
        this.zoomTo(a);
    },
    moveLeft: function() {
        this.skipClick = !0;
        var a = this.zoomX() + this.zoomControl.panStepSize;
        this.zoomTo(this.zoomLevel(), a, this.zoomY());
    },
    moveRight: function() {
        this.skipClick = !0;
        var a = this.zoomX() - this.zoomControl.panStepSize;
        this.zoomTo(this.zoomLevel(), a, this.zoomY());
    },
    moveUp: function() {
        this.skipClick = !0;
        var a = this.zoomY() + this.zoomControl.panStepSize;
        this.zoomTo(this.zoomLevel(), this.zoomX(), a);
    },
    moveDown: function() {
        this.skipClick = !0;
        var a = this.zoomY() - this.zoomControl.panStepSize;
        this.zoomTo(this.zoomLevel(), this.zoomX(), a);
    },
    zoomX: function() { return this.mapSet ? Math.round(1E4 * this.mapContainer.x / this.mapWidth) / 1E4 : NaN },
    zoomY: function() { return this.mapSet ? Math.round(1E4 * this.mapContainer.y / this.mapHeight) / 1E4 : NaN },
    goHome: function() {
        this.selectObject(this.dataProvider);
        var a = { type: "homeButtonClicked", chart: this };
        this.fire(a.type, a);
    },
    zoomLevel: function() { return Math.round(1E5 * this.mapContainer.scale) / 1E5 },
    showDescriptionAndGetUrl: function() {
        var a =
            this.selectedObject;
        if (a) {
            this.showDescription();
            var b = a.url;
            if (b)AmCharts.getURL(b, a.urlTarget);
            else if (b = a.linkToObject) {
                if ("string" == typeof b) {
                    var c = this.getObjectById(b);
                    if (c) {
                        this.selectObject(c);
                        return;
                    }
                }
                b && a.passZoomValuesToTarget && (b.zoomLatitude = this.zoomLatitude(), b.zoomLongitude = this.zoomLongitude(), b.zoomLevel = this.zoomLevel());
                this.extendMapData(b) || this.selectObject(b);
            }
        }
    },
    extendMapData: function(a) {
        var b = a.objectType;
        if ("MapImage" != b && "MapArea" != b && "MapLine" != b)
            return AmCharts.extend(a,
                new AmCharts.MapData, !0), this.dataProvider = a, this.zoomInstantly = !0, this.validateData(), !0;
    },
    showDescription: function(a) {
        a || (a = this.selectedObject);
        this.allowMultipleDescriptionWindows || this.closeAllDescriptions();
        if (a.description) {
            var b = a.descriptionWindow;
            b && b.close();
            b = new AmCharts.DescriptionWindow;
            a.descriptionWindow = b;
            var c = a.descriptionWindowWidth, d = a.descriptionWindowHeight, e = a.descriptionWindowLeft, f = a.descriptionWindowTop, g = a.descriptionWindowRight, k = a.descriptionWindowBottom;
            isNaN(g) || (e =
                this.realWidth - g);
            isNaN(k) || (f = this.realHeight - k);
            var h = a.descriptionWindowX;
            isNaN(h) || (e = h);
            h = a.descriptionWindowY;
            isNaN(h) || (f = h);
            isNaN(e) && (e = this.mouseX, e = e > this.realWidth / 2 ? e - c - 20 : e + 20);
            isNaN(f) && (f = this.mouseY);
            b.maxHeight = d;
            h = a.title;
            a.titleTr && (h = a.titleTr);
            b.show(this, this.descriptionsDiv, a.description, h);
            a = b.div.style;
            a.position = "absolute";
            a.width = c + "px";
            a.maxHeight = d + "px";
            isNaN(k) || (f -= b.div.offsetHeight);
            isNaN(g) || (e -= b.div.offsetWidth);
            a.left = e + "px";
            a.top = f + "px";
        }
    },
    parseXMLObject: function(a) {
        var b =
        { root: {} };
        this.parseXMLNode(b, "root", a);
        this.svgData = b.root.svg;
        this.getBounds();
    },
    getBounds: function() {
        var a = this.dataProvider;
        try {
            var b = this.svgData.defs["amcharts:ammap"];
            a.leftLongitude = Number(b.leftLongitude);
            a.rightLongitude = Number(b.rightLongitude);
            a.topLatitude = Number(b.topLatitude);
            a.bottomLatitude = Number(b.bottomLatitude);
            a.projection = b.projection;
            var c = b.wrappedLongitudes;
            c && (a.rightLongitude += 360);
            a.wrappedLongitudes = c;
        } catch (d) {
        }
    },
    recalcLongitude: function(a) {
        var b = this.dataProvider.wrappedLongitudes;
        return void 0 != a && b ? a < this.dataProvider.leftLongitude ? Number(a) + 360 : a : a;
    },
    latitudeToCoordinate: function(a) {
        var b, c = this.dataProvider;
        if (this.mapSet) {
            b = c.topLatitude;
            var d = c.bottomLatitude;
            "mercator" == c.projection && (a = this.mercatorLatitudeToCoordinate(a), b = this.mercatorLatitudeToCoordinate(b), d = this.mercatorLatitudeToCoordinate(d));
            b = (a - b) / (d - b) * this.mapHeight;
        }
        return b;
    },
    longitudeToCoordinate: function(a) {
        a = this.recalcLongitude(a);
        var b, c = this.dataProvider;
        this.mapSet && (b = c.leftLongitude, b = (a - b) / (c.rightLongitude -
            b) * this.mapWidth);
        return b;
    },
    mercatorLatitudeToCoordinate: function(a) {
        89.5 < a && (a = 89.5);
        -89.5 > a && (a = -89.5);
        a = AmCharts.degreesToRadians(a);
        a = .5 * Math.log((1 + Math.sin(a)) / (1 - Math.sin(a)));
        return AmCharts.radiansToDegrees(a / 2);
    },
    zoomLatitude: function() { return this.coordinateToLatitude((-this.mapContainer.y + this.previousHeight / 2) / this.zoomLevel()) },
    zoomLongitude: function() { return this.coordinateToLongitude((-this.mapContainer.x + this.previousWidth / 2) / this.zoomLevel()) },
    getAreaCenterLatitude: function(a) {
        a =
            a.displayObject.getBBox();
        var b = this.mapScale;
        a = -this.mapSet.getBBox().y * b + (a.y + a.height / 2) * b;
        return this.coordinateToLatitude(a);
    },
    getAreaCenterLongitude: function(a) {
        a = a.displayObject.getBBox();
        var b = this.mapScale;
        a = -this.mapSet.getBBox().x * b + (a.x + a.width / 2) * b;
        return this.coordinateToLongitude(a);
    },
    coordinateToLatitude: function(a) {
        var b;
        if (this.mapSet) {
            var c = this.dataProvider, d = c.bottomLatitude, e = c.topLatitude;
            b = this.mapHeight;
            "mercator" == c.projection ? (c = this.mercatorLatitudeToCoordinate(d), e = this.mercatorLatitudeToCoordinate(e),
                a = 2 * Math.atan(Math.exp(2 * (a * (c - e) / b + e) * Math.PI / 180)) - .5 * Math.PI, b = AmCharts.radiansToDegrees(a)) : b = a / b * (d - e) + e;
        }
        return Math.round(1E6 * b) / 1E6;
    },
    coordinateToLongitude: function(a) {
        var b, c = this.dataProvider;
        this.mapSet && (b = a / this.mapWidth * (c.rightLongitude - c.leftLongitude) + c.leftLongitude);
        return Math.round(1E6 * b) / 1E6;
    },
    milesToPixels: function(a) {
        var b = this.dataProvider;
        return this.mapWidth / (b.rightLongitude - b.leftLongitude) * a / 69.172;
    },
    kilometersToPixels: function(a) {
        var b = this.dataProvider;
        return this.mapWidth /
        (b.rightLongitude - b.leftLongitude) * a / 111.325;
    },
    handleBackgroundClick: function(a) {
        if (this.backgroundZoomsToTop && !this.mapWasDragged) {
            var b = this.dataProvider;
            if (this.checkIfClickable(b))this.clickMapObject(b);
            else {
                a = b.zoomX;
                var c = b.zoomY, d = b.zoomLongitude, e = b.zoomLatitude, b = b.zoomLevel;
                isNaN(a) || isNaN(c) || this.zoomTo(b, a, c);
                isNaN(d) || isNaN(e) || this.zoomToLongLat(b, d, e, !0);
            }
        }
    },
    parseXMLNode: function(a, b, c, d) {
        void 0 === d && (d = "");
        var e, f, g;
        if (c) {
            var k = c.childNodes.length;
            for (e = 0; e < k; e++) {
                f = c.childNodes[e];
                var h = f.nodeName, l = f.nodeValue ? this.trim(f.nodeValue) : "", p = !1;
                f.attributes && 0 < f.attributes.length && (p = !0);
                if (0 !== f.childNodes.length || "" !== l || !1 !== p)
                    if (3 == f.nodeType || 4 == f.nodeType) {
                        if ("" !== l) {
                            f = 0;
                            for (g in a[b])a[b].hasOwnProperty(g) && f++;
                            f ? a[b]["#text"] = l : a[b] = l;
                        }
                    } else if (1 == f.nodeType) {
                        var m;
                        void 0 !== a[b][h] ? void 0 === a[b][h].length ? (m = a[b][h], a[b][h] = [], a[b][h].push(m), a[b][h].push({}), m = a[b][h][1]) : "object" == typeof a[b][h] && (a[b][h].push({}), m = a[b][h][a[b][h].length - 1]) : (a[b][h] = {}, m = a[b][h]);
                        if (f.attributes &&
                            f.attributes.length)for (l = 0; l < f.attributes.length; l++)m[f.attributes[l].name] = f.attributes[l].value;
                        void 0 !== a[b][h].length ? this.parseXMLNode(a[b][h], a[b][h].length - 1, f, d + "  ") : this.parseXMLNode(a[b], h, f, d + "  ");
                    }
            }
            f = 0;
            c = "";
            for (g in a[b])"#text" == g ? c = a[b][g] : f++;
            0 === f && void 0 === a[b].length && (a[b] = c);
        }
    },
    doDoubleClickZoom: function() {
        if (!this.mapWasDragged) {
            var a = this.zoomLevel() * this.zoomControl.zoomFactor;
            this.zoomToStageXY(a, this.mouseX, this.mouseY);
        }
    },
    getDevInfo: function() {
        var a = this.zoomLevel(),
            a = {
                chart: this,
                type: "writeDevInfo",
                zoomLevel: a,
                zoomX: this.zoomX(),
                zoomY: this.zoomY(),
                zoomLatitude: this.zoomLatitude(),
                zoomLongitude: this.zoomLongitude(),
                latitude: this.coordinateToLatitude((this.mouseY - this.mapContainer.y) / a),
                longitude: this.coordinateToLongitude((this.mouseX - this.mapContainer.x) / a),
                left: this.mouseX,
                top: this.mouseY,
                right: this.realWidth - this.mouseX,
                bottom: this.realHeight - this.mouseY,
                percentLeft: Math.round(this.mouseX / this.realWidth * 100) + "%",
                percentTop: Math.round(this.mouseY / this.realHeight * 100) + "%",
                percentRight: Math.round((this.realWidth - this.mouseX) / this.realWidth * 100) + "%",
                percentBottom: Math.round((this.realHeight - this.mouseY) / this.realHeight * 100) + "%"
            },
            b = "zoomLevel:" + a.zoomLevel + ", zoomLongitude:" + a.zoomLongitude + ", zoomLatitude:" + a.zoomLatitude + "\n",
            b = b + ("zoomX:" + a.zoomX + ", zoomY:" + a.zoomY + "\n"),
            b = b + ("latitude:" + a.latitude + ", longitude:" + a.longitude + "\n"),
            b = b + ("left:" + a.left + ", top:" + a.top + "\n"),
            b = b + ("right:" + a.right + ", bottom:" + a.bottom + "\n"),
            b = b + ("left:\"" + a.percentLeft + "\", top:\"" + a.percentTop +
                "\"\n"),
            b = b + ("right:\"" + a.percentRight + "\", bottom:\"" + a.percentBottom + "\"\n");
        a.str = b;
        this.fire(a.type, a);
        return a;
    },
    getXY: function(a, b, c) {
        void 0 !== a && (-1 != String(a).indexOf("%") ? (a = Number(a.split("%").join("")), c && (a = 100 - a), a = Number(a) * b / 100) : c && (a = b - a));
        return a;
    },
    getObjectById: function(a) {
        var b = this.dataProvider;
        if (b.areas) {
            var c = this.getObject(a, b.areas);
            if (c)return c;
        }
        if (c = this.getObject(a, b.images))return c;
        if (a = this.getObject(a, b.lines))return a;
    },
    getObject: function(a, b) {
        if (b) {
            var c;
            for (c = 0; c < b.length; c++) {
                var d =
                    b[c];
                if (d.id == a)return d;
                if (d.areas) {
                    var e = this.getObject(a, d.areas);
                    if (e)return e;
                }
                if (e = this.getObject(a, d.images))return e;
                if (d = this.getObject(a, d.lines))return d;
            }
        }
    },
    parseData: function() {
        var a = this.dataProvider;
        this.processObject(a.areas, a, "area");
        this.processObject(a.images, a, "image");
        this.processObject(a.lines, a, "line");
    },
    processObject: function(a, b, c) {
        if (a) {
            var d;
            for (d = 0; d < a.length; d++) {
                var e = a[d];
                e.parentObject = b;
                "area" == c && AmCharts.extend(e, new AmCharts.MapArea(this.theme), !0);
                "image" == c && (e =
                    AmCharts.extend(e, new AmCharts.MapImage(this.theme), !0));
                "line" == c && (e = AmCharts.extend(e, new AmCharts.MapLine(this.theme), !0));
                a[d] = e;
                e.areas && this.processObject(e.areas, e, "area");
                e.images && this.processObject(e.images, e, "image");
                e.lines && this.processObject(e.lines, e, "line");
            }
        }
    },
    positionChanged: function() {
        var a = { type: "positionChanged", zoomX: this.zoomX(), zoomY: this.zoomY(), zoomLevel: this.zoomLevel(), chart: this };
        this.fire(a.type, a);
    },
    getX: function(a, b) { return this.getXY(a, this.realWidth, b) },
    getY: function(a,
        b) { return this.getXY(a, this.realHeight, b) },
    trim: function(a) {
        if (a) {
            var b;
            for (b = 0; b < a.length; b++)
                if (-1 === " \n\r\t\f\x0B\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(b))) {
                    a = a.substring(b);
                    break;
                }
            for (b = a.length - 1; 0 <= b; b--)
                if (-1 === " \n\r\t\f\x0B\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(b))) {
                    a = a.substring(0, b + 1);
                    break;
                }
            return-1 === " \n\r\t\f\x0B\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(0)) ?
                a : "";
        }
    },
    destroy: function() {
        var a = this.svgAreas;
        if (a)for (var b = 0; b < a.length; b++);
        AmCharts.AmMap.base.destroy.call(this);
    }
});
AmCharts.ZoomControl = AmCharts.Class({
    construct: function(a) {
        this.cname = "ZoomControl";
        this.panStepSize = .1;
        this.zoomFactor = 2;
        this.maxZoomLevel = 64;
        this.minZoomLevel = 1;
        this.zoomControlEnabled = this.panControlEnabled = !0;
        this.buttonRollOverColor = "#CC0000";
        this.buttonFillColor = "#990000";
        this.buttonFillAlpha = 1;
        this.buttonBorderColor = "#FFFFFF";
        this.buttonIconAlpha = this.buttonBorderThickness = this.buttonBorderAlpha = 1;
        this.gridColor = "#FFFFFF";
        this.homeIconFile = "homeIcon.gif";
        this.gridBackgroundColor = "#000000";
        this.gridBackgroundAlpha = .15;
        this.gridAlpha = 1;
        this.buttonSize = 18;
        this.iconSize = 11;
        this.buttonCornerRadius = 0;
        this.gridHeight = 150;
        this.top = this.left = 10;
        AmCharts.applyTheme(this, a, this.cname);
    },
    init: function(a, b) {
        var c = this;
        c.chart = a;
        AmCharts.remove(c.set);
        var d = b.set();
        AmCharts.setCN(a, d, "zoom-control");
        var e = c.buttonSize,
            f = c.zoomControlEnabled,
            g = c.panControlEnabled,
            k = c.buttonFillColor,
            h = c.buttonFillAlpha,
            l = c.buttonBorderThickness,
            p = c.buttonBorderColor,
            m = c.buttonBorderAlpha,
            u = c.buttonCornerRadius,
            t =
                c.buttonRollOverColor,
            A = c.gridHeight,
            v = c.zoomFactor,
            w = c.minZoomLevel,
            F = c.maxZoomLevel,
            B = c.buttonIconAlpha,
            G = a.getX(c.left),
            q = a.getY(c.top);
        isNaN(c.right) || (G = a.getX(c.right, !0), G = g ? G - 3 * e : G - e);
        isNaN(c.bottom) || (q = a.getY(c.bottom, !0), f && (q -= A + 3 * e), q = g ? q - 3 * e : q + e);
        d.translate(G, q);
        c.previousDY = NaN;
        var r;
        if (f) {
            r = b.set();
            AmCharts.setCN(a, r, "zoom-control-zoom");
            d.push(r);
            c.set = d;
            c.zoomSet = r;
            q = AmCharts.rect(b, e + 6, A + 2 * e + 6, c.gridBackgroundColor, c.gridBackgroundAlpha, 0, 0, 0, 4);
            AmCharts.setCN(a, q, "zoom-bg");
            q.translate(-3,
                -3);
            q.mouseup(function() { c.handleBgUp() }).touchend(function() { c.handleBgUp() });
            r.push(q);
            q = new AmCharts.SimpleButton;
            q.setIcon(a.pathToImages + "plus.gif", c.iconSize);
            q.setClickHandler(a.zoomIn, a);
            q.init(b, e, e, k, h, l, p, m, u, t, B);
            AmCharts.setCN(a, q.set, "zoom-in");
            r.push(q.set);
            q = new AmCharts.SimpleButton;
            q.setIcon(a.pathToImages + "minus.gif", c.iconSize);
            q.setClickHandler(a.zoomOut, a);
            q.init(b, e, e, k, h, l, p, m, u, t, B);
            q.set.translate(0, A + e);
            AmCharts.setCN(a, q.set, "zoom-out");
            r.push(q.set);
            var G = Math.log(F / w) /
                    Math.log(v) + 1,
                f = A / G,
                n;
            for (n = 1; n < G; n++)q = e + n * f, q = AmCharts.line(b, [1, e - 2], [q, q], c.gridColor, c.gridAlpha, 1), AmCharts.setCN(a, q, "zoom-grid"), r.push(q);
            q = new AmCharts.SimpleButton;
            q.setDownHandler(c.draggerDown, c);
            q.setClickHandler(c.draggerUp, c);
            q.init(b, e, f, k, h, l, p, m, u, t);
            AmCharts.setCN(a, q.set, "zoom-dragger");
            r.push(q.set);
            c.dragger = q.set;
            c.previousY = NaN;
            A -= f;
            w = Math.log(w / 100) / Math.log(v);
            v = Math.log(F / 100) / Math.log(v);
            c.realStepSize = A / (v - w);
            c.realGridHeight = A;
            c.stepMax = v;
        }
        g && (g = b.set(), AmCharts.setCN(a,
                g, "zoom-control-pan"), d.push(g), r && r.translate(e, 4 * e), r = new AmCharts.SimpleButton, r.setIcon(a.pathToImages + "panLeft.gif", c.iconSize), r.setClickHandler(a.moveLeft, a), r.init(b, e, e, k, h, l, p, m, u, t, B), r.set.translate(0, e), AmCharts.setCN(a, r.set, "pan-left"), g.push(r.set), r = new AmCharts.SimpleButton, r.setIcon(a.pathToImages + "panRight.gif", c.iconSize), r.setClickHandler(a.moveRight, a), r.init(b, e, e, k, h, l, p, m, u, t, B), r.set.translate(2 * e, e), AmCharts.setCN(a, r.set, "pan-right"), g.push(r.set), r = new AmCharts.SimpleButton,
            r.setIcon(a.pathToImages + "panUp.gif", c.iconSize), r.setClickHandler(a.moveUp, a), r.init(b, e, e, k, h, l, p, m, u, t, B), r.set.translate(e, 0), AmCharts.setCN(a, r.set, "pan-up"), g.push(r.set), r = new AmCharts.SimpleButton, r.setIcon(a.pathToImages + "panDown.gif", c.iconSize), r.setClickHandler(a.moveDown, a), r.init(b, e, e, k, h, l, p, m, u, t, B), r.set.translate(e, 2 * e), AmCharts.setCN(a, r.set, "pan-down"), g.push(r.set), h = new AmCharts.SimpleButton, h.setIcon(a.pathToImages + c.homeIconFile, c.iconSize), h.setClickHandler(a.goHome, a), h.init(b,
                e, e, k, 0, 0, p, 0, u, t, B), h.set.translate(e, e), AmCharts.setCN(a, h.set, "pan-home"), g.push(h.set), d.push(g));
    },
    draggerDown: function() {
        this.chart.stopDrag();
        this.isDragging = !0;
    },
    draggerUp: function() { this.isDragging = !1 },
    handleBgUp: function() {
        var a = this.chart, b = 100 * Math.pow(this.zoomFactor, this.stepMax - (a.mouseY - this.zoomSet.y - this.set.y - this.buttonSize - this.realStepSize / 2) / this.realStepSize);
        a.zoomTo(b);
    },
    update: function() {
        var a,
            b = this.zoomFactor,
            c = this.realStepSize,
            d = this.stepMax,
            e = this.dragger,
            f = this.buttonSize,
            g = this.chart;
        this.isDragging ? (g.stopDrag(), a = e.y + (g.mouseY - this.previousY), a = AmCharts.fitToBounds(a, f, this.realGridHeight + f), c = 100 * Math.pow(b, d - (a - f) / c), g.zoomTo(c, NaN, NaN, !0)) : (a = Math.log(g.zoomLevel() / 100) / Math.log(b), a = (d - a) * c + f);
        this.previousY = g.mouseY;
        this.previousDY != a && e && (e.translate(0, a), this.previousDY = a);
    }
});
AmCharts.SimpleButton = AmCharts.Class({
    construct: function() {},
    init: function(a, b, c, d, e, f, g, k, h, l, p) {
        var m = this;
        m.rollOverColor = l;
        m.color = d;
        l = a.set();
        m.set = l;
        d = AmCharts.rect(a, b, c, d, e, f, g, k, h);
        l.push(d);
        if (e = m.iconPath)f = m.iconSize, a = a.image(e, (b - f) / 2, (c - f) / 2, f, f), l.push(a), a.setAttr("opacity", p), a.mousedown(function() { m.handleDown() }).mouseup(function() { m.handleUp() }).mouseover(function() { m.handleOver() }).mouseout(function() { m.handleOut() });
        d.mousedown(function() { m.handleDown() }).touchstart(function() { m.handleDown() }).mouseup(function() { m.handleUp() }).touchend(function() { m.handleUp() }).mouseover(function() { m.handleOver() }).mouseout(function() { m.handleOut() });
        m.bg = d;
    },
    setIcon: function(a, b) {
        this.iconPath = a;
        this.iconSize = b;
    },
    setClickHandler: function(a, b) {
        this.clickHandler = a;
        this.scope = b;
    },
    setDownHandler: function(a, b) {
        this.downHandler = a;
        this.scope = b;
    },
    handleUp: function() {
        var a = this.clickHandler;
        a && a.call(this.scope);
    },
    handleDown: function() {
        var a = this.downHandler;
        a && a.call(this.scope);
    },
    handleOver: function() { this.bg.setAttr("fill", this.rollOverColor) },
    handleOut: function() { this.bg.setAttr("fill", this.color) }
});
AmCharts.SmallMap = AmCharts.Class({
    construct: function(a) {
        this.cname = "SmallMap";
        this.mapColor = "#e6e6e6";
        this.rectangleColor = "#FFFFFF";
        this.top = this.right = 10;
        this.minimizeButtonWidth = 16;
        this.backgroundColor = "#9A9A9A";
        this.backgroundAlpha = 1;
        this.borderColor = "#FFFFFF";
        this.borderThickness = 3;
        this.borderAlpha = 1;
        this.size = .2;
        this.enabled = !0;
        AmCharts.applyTheme(this, a, this.cname);
    },
    init: function(a, b) {
        var c = this;
        if (c.enabled) {
            c.chart = a;
            c.container = b;
            c.width = a.realWidth * c.size;
            c.height = a.realHeight * c.size;
            AmCharts.remove(c.set);
            var d = b.set();
            c.set = d;
            AmCharts.setCN(a, d, "small-map");
            var e = b.set();
            c.allSet = e;
            d.push(e);
            c.buildSVGMap();
            var f = c.borderThickness, g = c.borderColor, k = AmCharts.rect(b, c.width + f, c.height + f, c.backgroundColor, c.backgroundAlpha, f, g, c.borderAlpha);
            AmCharts.setCN(a, k, "small-map-bg");
            k.translate(-f / 2, -f / 2);
            e.push(k);
            k.toBack();
            var h, l, k = c.minimizeButtonWidth, p = new AmCharts.SimpleButton;
            p.setIcon(a.pathToImages + "arrowDown.gif", k);
            p.setClickHandler(c.minimize, c);
            p.init(b, k, k, g, 1, 1, g, 1);
            AmCharts.setCN(a, p.set,
                "small-map-down");
            p = p.set;
            c.downButtonSet = p;
            d.push(p);
            var m = new AmCharts.SimpleButton;
            m.setIcon(a.pathToImages + "arrowUp.gif", k);
            m.setClickHandler(c.maximize, c);
            m.init(b, k, k, g, 1, 1, g, 1);
            AmCharts.setCN(a, m.set, "small-map-up");
            g = m.set;
            c.upButtonSet = g;
            g.hide();
            d.push(g);
            var u, t;
            isNaN(c.top) || (h = a.getY(c.top) + f, t = 0);
            isNaN(c.bottom) || (h = a.getY(c.bottom, !0) - c.height - f, t = c.height - k + f / 2);
            isNaN(c.left) || (l = a.getX(c.left) + f, u = -f / 2);
            isNaN(c.right) || (l = a.getX(c.right, !0) - c.width - f, u = c.width - k + f / 2);
            f = b.set();
            f.clipRect(1,
                1, c.width, c.height);
            e.push(f);
            c.rectangleC = f;
            d.translate(l, h);
            p.translate(u, t);
            g.translate(u, t);
            e.mouseup(function() { c.handleMouseUp() });
            c.drawRectangle();
        } else AmCharts.remove(c.allSet), AmCharts.remove(c.downButtonSet), AmCharts.remove(c.upButtonSet);
    },
    minimize: function() {
        this.downButtonSet.hide();
        this.upButtonSet.show();
        this.allSet.hide();
    },
    maximize: function() {
        this.downButtonSet.show();
        this.upButtonSet.hide();
        this.allSet.show();
    },
    buildSVGMap: function() {
        var a = this.chart,
            b = {
                fill: this.mapColor,
                stroke: this.mapColor,
                "stroke-opacity": 1
            },
            c = a.svgData.g.path,
            d = this.container,
            e = d.set();
        AmCharts.setCN(a, e, "small-map-image");
        var f;
        for (f = 0; f < c.length; f++) {
            var g = d.path(c[f].d).attr(b);
            e.push(g);
        }
        this.allSet.push(e);
        b = e.getBBox();
        c = this.size * a.mapScale;
        d = -b.x * c;
        f = -b.y * c;
        var k = g = 0;
        a.centerMap && (g = (this.width - b.width * c) / 2, k = (this.height - b.height * c) / 2);
        this.mapWidth = b.width * c;
        this.mapHeight = b.height * c;
        this.dx = g;
        this.dy = k;
        e.translate(d + g, f + k, c);
    },
    update: function() {
        var a = this.chart,
            b = a.zoomLevel(),
            c = this.width,
            d = a.mapContainer,
            a = c / (a.realWidth * b),
            c = c / b,
            b = this.height / b,
            e = this.rectangle;
        e.translate(-d.x * a + this.dx, -d.y * a + this.dy);
        0 < c && 0 < b && (e.setAttr("width", Math.ceil(c + 1)), e.setAttr("height", Math.ceil(b + 1)));
        this.rWidth = c;
        this.rHeight = b;
    },
    drawRectangle: function() {
        var a = this.rectangle;
        AmCharts.remove(a);
        a = AmCharts.rect(this.container, 10, 10, "#000", 0, 1, this.rectangleColor, 1);
        AmCharts.setCN(this.chart, a, "small-map-rectangle");
        this.rectangleC.push(a);
        this.rectangle = a;
    },
    handleMouseUp: function() {
        var a = this.chart, b = a.zoomLevel();
        a.zoomTo(b,
            -((a.mouseX - this.set.x - this.dx - this.rWidth / 2) / this.mapWidth) * b, -((a.mouseY - this.set.y - this.dy - this.rHeight / 2) / this.mapHeight) * b);
    }
});
AmCharts.AreasProcessor = AmCharts.Class({
    construct: function(a) { this.chart = a },
    process: function(a) {
        this.updateAllAreas();
        this.allObjects = [];
        a = a.areas;
        var b = this.chart, c, d = a.length, e, f, g = 0, k = b.svgAreasById, h = !1, l = !1, p = 0;
        for (e = 0; e < d; e++) {
            f = a[e];
            f = f.value;
            if (!1 === h || h < f)h = f;
            if (!1 === l || l > f)l = f;
            isNaN(f) || (g += Math.abs(f), p++);
        }
        isNaN(b.minValue) || (l = b.minValue);
        isNaN(b.maxValue) || (h = b.maxValue);
        b.maxValueReal = h;
        b.minValueReal = l;
        for (e = 0; e < d; e++)
            f = a[e], isNaN(f.value) ? f.percents = void 0 : (f.percents = (f.value - l) /
                g * 100, l == h && (f.percents = 100));
        for (e = 0; e < d; e++) {
            f = a[e];
            var m = k[f.id];
            c = b.areasSettings;
            m && m.className && (g = b.areasClasses[m.className]) && (c = g, c = AmCharts.processObject(c, AmCharts.AreasSettings, b.theme));
            var u = c.color, t = c.alpha, A = c.outlineThickness, v = c.rollOverColor, w = c.selectedColor, F = c.rollOverAlpha, B = c.outlineColor, G = c.outlineAlpha, q = c.balloonText, r = c.selectable, n = c.pattern, x = c.rollOverOutlineColor, z = c.bringForwardOnHover, M = c.preserveOriginalAttributes;
            this.allObjects.push(f);
            f.chart = b;
            f.baseSettings =
                c;
            f.autoZoomReal = void 0 == f.autoZoom ? c.autoZoom : f.autoZoom;
            g = f.color;
            void 0 == g && (g = u);
            p = f.alpha;
            isNaN(p) && (p = t);
            t = f.rollOverAlpha;
            isNaN(t) && (t = F);
            isNaN(t) && (t = p);
            F = f.rollOverColor;
            void 0 == F && (F = v);
            v = f.pattern;
            void 0 == v && (v = n);
            n = f.selectedColor;
            void 0 == n && (n = w);
            (w = f.balloonText) || (w = q);
            void 0 == c.colorSolid || isNaN(f.value) || (q = Math.floor((f.value - l) / ((h - l) / b.colorSteps)), q == b.colorSteps && q--, colorPercent = 1 / (b.colorSteps - 1) * q, h == l && (colorPercent = 1), f.colorReal = AmCharts.getColorFade(g, c.colorSolid, colorPercent));
            void 0 != f.color && (f.colorReal = f.color);
            void 0 == f.selectable && (f.selectable = r);
            void 0 == f.colorReal && (f.colorReal = u);
            u = f.outlineColor;
            void 0 == u && (u = B);
            B = f.outlineAlpha;
            isNaN(B) && (B = G);
            G = f.outlineThickness;
            isNaN(G) && (G = A);
            A = f.rollOverOutlineColor;
            void 0 == A && (A = x);
            void 0 == f.bringForwardOnHover && (f.bringForwardOnHover = z);
            void 0 == f.preserveOriginalAttributes && (f.preserveOriginalAttributes = M);
            f.alphaReal = p;
            f.rollOverColorReal = F;
            f.rollOverAlphaReal = t;
            f.balloonTextReal = w;
            f.selectedColorReal = n;
            f.outlineColorReal =
                u;
            f.outlineAlphaReal = B;
            f.rollOverOutlineColorReal = A;
            f.outlineThicknessReal = G;
            f.patternReal = v;
            AmCharts.processDescriptionWindow(c, f);
            if (m && (c = m.area, x = m.title, f.enTitle = m.title, x && !f.title && (f.title = x), (m = b.language) ? (x = AmCharts.mapTranslations) && (m = x[m]) && m[f.enTitle] && (f.titleTr = m[f.enTitle]) : f.titleTr = void 0, c)) {
                f.displayObject = c;
                f.mouseEnabled && b.addObjectEventListeners(c, f);
                var D;
                void 0 != g && (D = g);
                void 0 != f.colorReal && (D = f.showAsSelected || b.selectedObject == f ? f.selectedColorReal : f.colorReal);
                c.node.setAttribute("class",
                    "");
                AmCharts.setCN(b, c, "map-area");
                AmCharts.setCN(b, c, "map-area-" + c.id);
                f.preserveOriginalAttributes || (c.setAttr("fill", D), c.setAttr("stroke", u), c.setAttr("stroke-opacity", B), c.setAttr("stroke-width", G), c.setAttr("fill-opacity", p));
                v && c.pattern(v, b.mapScale);
                f.hidden && c.hide();
            }
        }
    },
    updateAllAreas: function() {
        var a = this.chart, b = a.areasSettings, c = b.unlistedAreasColor, d = b.unlistedAreasAlpha, e = b.unlistedAreasOutlineColor, f = b.unlistedAreasOutlineAlpha, g = a.svgAreas, k = a.dataProvider, h = k.areas, l = {}, p;
        for (p =
            0; p < h.length; p++)l[h[p].id] = h[p];
        for (p = 0; p < g.length; p++) {
            h = g[p];
            if (b.preserveOriginalAttributes) {
                if (h.customAttr)for (var m in h.customAttr)h.setAttr(m, h.customAttr[m]);
            } else void 0 != c && h.setAttr("fill", c), isNaN(d) || h.setAttr("fill-opacity", d), void 0 != e && h.setAttr("stroke", e), isNaN(f) || h.setAttr("stroke-opacity", f), h.setAttr("stroke-width", b.outlineThickness);
            AmCharts.setCN(a, h, "map-area-unlisted");
            if (k.getAreasFromMap && !l[h.id]) {
                var u = new AmCharts.MapArea(a.theme);
                u.parentObject = k;
                u.id = h.id;
                k.areas.push(u);
            }
        }
    }
});
AmCharts.AreasSettings = AmCharts.Class({
    construct: function(a) {
        this.cname = "AreasSettings";
        this.alpha = 1;
        this.autoZoom = !1;
        this.balloonText = "[[title]]";
        this.color = "#FFCC00";
        this.colorSolid = "#990000";
        this.unlistedAreasAlpha = 1;
        this.unlistedAreasColor = "#DDDDDD";
        this.outlineColor = "#FFFFFF";
        this.outlineAlpha = 1;
        this.outlineThickness = .5;
        this.selectedColor = this.rollOverOutlineColor = "#CC0000";
        this.unlistedAreasOutlineColor = "#FFFFFF";
        this.unlistedAreasOutlineAlpha = 1;
        this.descriptionWindowWidth = 250;
        this.adjustOutlineThickness =
            !1;
        this.bringForwardOnHover = !0;
        AmCharts.applyTheme(this, a, this.cname);
    }
});
AmCharts.ImagesProcessor = AmCharts.Class({
    construct: function(a) {
        this.chart = a;
        this.reset();
    },
    process: function(a) {
        var b = a.images, c;
        for (c = 0; c < b.length; c++)this.createImage(b[c], c);
        a.parentObject && a.remainVisible && this.process(a.parentObject);
    },
    createImage: function(a, b) {
        var c = this.chart, d = c.container, e = c.mapImagesContainer, f = c.stageImagesContainer, g = c.imagesSettings;
        a.remove && a.remove();
        var k = g.color,
            h = g.alpha,
            l = g.rollOverColor,
            p = g.selectedColor,
            m = g.balloonText,
            u = g.outlineColor,
            t = g.outlineAlpha,
            A = g.outlineThickness,
            v = g.selectedScale,
            w = g.labelPosition,
            F = g.labelColor,
            B = g.labelFontSize,
            G = g.bringForwardOnHover,
            q = g.labelRollOverColor,
            r = g.selectedLabelColor;
        a.index = b;
        a.chart = c;
        a.baseSettings = c.imagesSettings;
        var n = d.set();
        a.displayObject = n;
        var x = a.color;
        void 0 == x && (x = k);
        k = a.alpha;
        isNaN(k) && (k = h);
        void 0 == a.bringForwardOnHover && (a.bringForwardOnHover = G);
        h = a.outlineAlpha;
        isNaN(h) && (h = t);
        t = a.rollOverColor;
        void 0 == t && (t = l);
        l = a.selectedColor;
        void 0 == l && (l = p);
        (p = a.balloonText) || (p = m);
        m = a.outlineColor;
        void 0 == m && (m = u);
        void 0 ==
            m && (m = x);
        u = a.outlineThickness;
        isNaN(u) && (u = A);
        (A = a.labelPosition) || (A = w);
        w = a.labelColor;
        void 0 == w && (w = F);
        F = a.labelRollOverColor;
        void 0 == F && (F = q);
        q = a.selectedLabelColor;
        void 0 == q && (q = r);
        r = a.labelFontSize;
        isNaN(r) && (r = B);
        B = a.selectedScale;
        isNaN(B) && (B = v);
        isNaN(a.rollOverScale);
        a.colorReal = x;
        a.alphaReal = k;
        a.rollOverColorReal = t;
        a.balloonTextReal = p;
        a.selectedColorReal = l;
        a.labelColorReal = w;
        a.labelRollOverColorReal = F;
        a.selectedLabelColorReal = q;
        a.labelFontSizeReal = r;
        a.labelPositionReal = A;
        a.selectedScaleReal =
            B;
        a.rollOverScaleReal = B;
        AmCharts.processDescriptionWindow(g, a);
        a.centeredReal = void 0 == a.centered ? g.centered : a.centered;
        r = a.type;
        q = a.imageURL;
        F = a.svgPath;
        t = a.width;
        w = a.height;
        g = a.scale;
        isNaN(a.percentWidth) || (t = a.percentWidth / 100 * c.realWidth);
        isNaN(a.percentHeight) || (w = a.percentHeight / 100 * c.realHeight);
        var z;
        q || r || F || (r = "circle", t = 1, h = k = 0);
        l = v = 0;
        B = a.selectedColorReal;
        if (r) {
            isNaN(t) && (t = 10);
            isNaN(w) && (w = 10);
            "kilometers" == a.widthAndHeightUnits && (t = c.kilometersToPixels(a.width), w = c.kilometersToPixels(a.height));
            "miles" == a.widthAndHeightUnits && (t = c.milesToPixels(a.width), w = c.milesToPixels(a.height));
            if ("circle" == r || "bubble" == r)w = t;
            z = this.createPredefinedImage(x, m, u, r, t, w);
            l = v = 0;
            a.centeredReal ? (isNaN(a.right) || (v = t * g), isNaN(a.bottom) || (l = w * g)) : (v = t * g / 2, l = w * g / 2);
            z.translate(v, l, g);
        } else
            q ? (isNaN(t) && (t = 10), isNaN(w) && (w = 10), z = d.image(q, 0, 0, t, w), z.node.setAttribute("preserveAspectRatio", "none"), z.setAttr("opacity", k), a.centeredReal && (v = isNaN(a.right) ? -t / 2 : t / 2, l = isNaN(a.bottom) ? -w / 2 : w / 2, z.translate(v, l))) : F && (z =
                d.path(F), m = z.getBBox(), a.centeredReal ? (v = -m.x * g - m.width * g / 2, isNaN(a.right) || (v = -v), l = -m.y * g - m.height * g / 2, isNaN(a.bottom) || (l = -l)) : v = l = 0, z.translate(v, l, g), z.x = v, z.y = l);
        z && (n.push(z), a.image = z, z.setAttr("stroke-opacity", h), z.setAttr("fill-opacity", k), z.setAttr("fill", x), AmCharts.setCN(c, z, "map-image"), void 0 != a.id && AmCharts.setCN(c, z, "map-image-" + a.id));
        !a.showAsSelected && c.selectedObject != a || void 0 == B || z.setAttr("fill", B);
        x = null;
        void 0 !== a.label && (x = AmCharts.text(d, a.label, a.labelColorReal, c.fontFamily,
            a.labelFontSizeReal, a.labelAlign), AmCharts.setCN(c, x, "map-image-label"), void 0 !== a.id && AmCharts.setCN(c, x, "map-image-label-" + a.id), z = a.labelBackgroundAlpha, (k = a.labelBackgroundColor) && 0 < z && (h = x.getBBox(), d = AmCharts.rect(d, h.width + 16, h.height + 10, k, z), AmCharts.setCN(c, d, "map-image-label-background"), void 0 != a.id && AmCharts.setCN(c, d, "map-image-label-background-" + a.id), n.push(d), a.labelBG = d), a.imageLabel = x, n.push(x), AmCharts.setCN(c, n, "map-image-container"), void 0 != a.id && AmCharts.setCN(c, n, "map-image-container-" +
            a.id));
        isNaN(a.latitude) || isNaN(a.longitude) ? f.push(n) : e.push(n);
        n && (n.rotation = a.rotation);
        this.updateSizeAndPosition(a);
        a.mouseEnabled && c.addObjectEventListeners(n, a);
        a.hidden && n.hide();
    },
    updateSizeAndPosition: function(a) {
        var b = this.chart, c = a.displayObject, d = b.getX(a.left), e = b.getY(a.top), f = a.image.getBBox();
        isNaN(a.right) || (d = b.getX(a.right, !0) - f.width * a.scale);
        isNaN(a.bottom) || (e = b.getY(a.bottom, !0) - f.height * a.scale);
        var g = a.longitude, k = a.latitude, f = this.objectsToResize;
        this.allSvgObjects.push(c);
        this.allObjects.push(a);
        var h = a.imageLabel;
        if (!isNaN(d) && !isNaN(e))c.translate(d, e);
        else if (!isNaN(k) && !isNaN(g) && (d = b.longitudeToCoordinate(g), e = b.latitudeToCoordinate(k), c.translate(d, e, NaN, !0), a.fixedSize)) {
            d = 1;
            if (a.showAsSelected || b.selectedObject == a)d = a.selectedScaleReal;
            f.push({ image: c, scale: d });
        }
        this.positionLabel(h, a, a.labelPositionReal);
    },
    positionLabel: function(a, b, c) {
        if (a) {
            var d = b.image, e = 0, f = 0, g = 0, k = 0;
            d && (k = d.getBBox(), f = d.y, e = d.x, g = k.width, k = k.height, b.svgPath && (g *= b.scale, k *= b.scale));
            var d = a.getBBox(), h = d.width, l = d.height;
            "right" == c && (e += g + h / 2 + 5, f += k / 2 - 2);
            "left" == c && (e += -h / 2 - 5, f += k / 2 - 2);
            "top" == c && (f -= l / 2 + 3, e += g / 2);
            "bottom" == c && (f += k + l / 2, e += g / 2);
            "middle" == c && (e += g / 2, f += k / 2);
            a.translate(e + b.labelShiftX, f + b.labelShiftY);
            b.labelBG && b.labelBG.translate(e - d.width / 2 + b.labelShiftX - 9, f + b.labelShiftY - d.height / 2 - 3);
        }
    },
    createPredefinedImage: function(a, b, c, d, e, f) {
        var g = this.chart.container, k;
        switch (d) {
        case "circle":
            k = AmCharts.circle(g, e / 2, a, 1, c, b, 1);
            break;
        case "rectangle":
            k = AmCharts.polygon(g,
            [-e / 2, e / 2, e / 2, -e / 2], [f / 2, f / 2, -f / 2, -f / 2], a, 1, c, b, 1);
            break;
        case "bubble":
            k = AmCharts.circle(g, e / 2, a, 1, c, b, 1, !0);
        }
        return k;
    },
    reset: function() {
        this.objectsToResize = [];
        this.allSvgObjects = [];
        this.allObjects = [];
        this.allLabels = [];
    }
});
AmCharts.ImagesSettings = AmCharts.Class({
    construct: function(a) {
        this.cname = "ImagesSettings";
        this.balloonText = "[[title]]";
        this.alpha = 1;
        this.borderAlpha = 0;
        this.borderThickness = 1;
        this.labelPosition = "right";
        this.labelColor = "#000000";
        this.labelFontSize = 11;
        this.color = "#000000";
        this.labelRollOverColor = "#00CC00";
        this.centered = !0;
        this.rollOverScale = this.selectedScale = 1;
        this.descriptionWindowWidth = 250;
        this.bringForwardOnHover = !0;
        AmCharts.applyTheme(this, a, this.cname);
    }
});
AmCharts.LinesProcessor = AmCharts.Class({
    construct: function(a) {
        this.chart = a;
        this.reset();
    },
    process: function(a) {
        var b = a.lines, c = this.chart, d = c.linesSettings, e = this.objectsToResize, f = c.mapLinesContainer, g = c.stageLinesContainer, k = d.thickness, h = d.dashLength, l = d.arrow, p = d.arrowSize, m = d.arrowColor, u = d.arrowAlpha, t = d.color, A = d.alpha, v = d.rollOverColor, w = d.selectedColor, F = d.rollOverAlpha, B = d.balloonText, G = d.bringForwardOnHover, q = c.container, r;
        for (r = 0; r < b.length; r++) {
            var n = b[r];
            n.chart = c;
            n.baseSettings = d;
            var x =
                q.set();
            n.displayObject = x;
            this.allSvgObjects.push(x);
            this.allObjects.push(n);
            n.mouseEnabled && c.addObjectEventListeners(x, n);
            if (n.remainVisible || c.selectedObject == n.parentObject) {
                var z = n.thickness;
                isNaN(z) && (z = k);
                var M = n.dashLength;
                isNaN(M) && (M = h);
                var D = n.color;
                void 0 == D && (D = t);
                var y = n.alpha;
                isNaN(y) && (y = A);
                var C = n.rollOverAlpha;
                isNaN(C) && (C = F);
                isNaN(C) && (C = y);
                var H = n.rollOverColor;
                void 0 == H && (H = v);
                var T = n.selectedColor;
                void 0 == T && (T = w);
                var R = n.balloonText;
                R || (R = B);
                var K = n.arrow;
                if (!K || "none" == K &&
                    "none" != l)K = l;
                var N = n.arrowColor;
                void 0 == N && (N = m);
                void 0 == N && (N = D);
                var O = n.arrowAlpha;
                isNaN(O) && (O = u);
                isNaN(O) && (O = y);
                var L = n.arrowSize;
                isNaN(L) && (L = p);
                n.alphaReal = y;
                n.colorReal = D;
                n.rollOverColorReal = H;
                n.rollOverAlphaReal = C;
                n.balloonTextReal = R;
                n.selectedColorReal = T;
                n.thicknessReal = z;
                void 0 == n.bringForwardOnHover && (n.bringForwardOnHover = G);
                AmCharts.processDescriptionWindow(d, n);
                var C = this.processCoordinates(n.x, c.realWidth),
                    H = this.processCoordinates(n.y, c.realHeight),
                    J = n.longitudes,
                    R = n.latitudes,
                    I =
                        J.length,
                    P;
                if (0 < I)for (C = [], P = 0; P < I; P++)C.push(c.longitudeToCoordinate(J[P]));
                I = R.length;
                if (0 < I)for (H = [], P = 0; P < I; P++)H.push(c.latitudeToCoordinate(R[P]));
                if (0 < C.length) {
                    AmCharts.dx = 0;
                    AmCharts.dy = 0;
                    J = AmCharts.line(q, C, H, D, 1, z, M, !1, !1, !0);
                    AmCharts.setCN(c, J, "map-line");
                    void 0 != n.id && AmCharts.setCN(c, J, "map-line-" + n.id);
                    M = AmCharts.line(q, C, H, D, .001, 3, M, !1, !1, !0);
                    AmCharts.dx = .5;
                    AmCharts.dy = .5;
                    x.push(J);
                    x.push(M);
                    x.setAttr("opacity", y);
                    if ("none" != K) {
                        var E, Q, S;
                        if ("end" == K || "both" == K)
                            y = C[C.length - 1], D = H[H.length -
                                1], 1 < C.length ? (I = C[C.length - 2], E = H[H.length - 2]) : (I = y, E = D), E = 180 * Math.atan((D - E) / (y - I)) / Math.PI, Q = y, S = D, E = 0 > y - I ? E - 90 : E + 90;
                        "both" == K && (y = AmCharts.polygon(q, [-L / 2, 0, L / 2], [1.5 * L, 0, 1.5 * L], N, O, 1, N, O), x.push(y), y.translate(Q, S), y.rotate(E), AmCharts.setCN(c, J, "map-line-arrow"), void 0 != n.id && AmCharts.setCN(c, J, "map-line-arrow-" + n.id), n.fixedSize && e.push(y));
                        if ("start" == K || "both" == K)y = C[0], S = H[0], 1 < C.length ? (D = C[1], Q = H[1]) : (D = y, Q = S), E = 180 * Math.atan((S - Q) / (y - D)) / Math.PI, Q = y, E = 0 > y - D ? E - 90 : E + 90;
                        "middle" == K && (y =
                            C[C.length - 1], D = H[H.length - 1], 1 < C.length ? (I = C[C.length - 2], E = H[H.length - 2]) : (I = y, E = D), Q = I + (y - I) / 2, S = E + (D - E) / 2, E = 180 * Math.atan((D - E) / (y - I)) / Math.PI, E = 0 > y - I ? E - 90 : E + 90);
                        y = AmCharts.polygon(q, [-L / 2, 0, L / 2], [1.5 * L, 0, 1.5 * L], N, O, 1, N, O);
                        AmCharts.setCN(c, J, "map-line-arrow");
                        void 0 != n.id && AmCharts.setCN(c, J, "map-line-arrow-" + n.id);
                        x.push(y);
                        y.translate(Q, S);
                        y.rotate(E);
                        n.fixedSize && e.push(y);
                        n.arrowSvg = y;
                    }
                    n.fixedSize && J && (this.linesToResize.push({ line: J, thickness: z }), this.linesToResize.push({ line: M, thickness: 3 }));
                    n.lineSvg = J;
                    n.showAsSelected && !isNaN(T) && J.setAttr("stroke", T);
                    0 < R.length ? f.push(x) : g.push(x);
                    n.hidden && x.hide();
                }
            }
        }
        a.parentObject && a.remainVisible && this.process(a.parentObject);
    },
    processCoordinates: function(a, b) {
        var c = [], d;
        for (d = 0; d < a.length; d++) {
            var e = a[d], f = Number(e);
            isNaN(f) && (f = Number(e.replace("%", "")) * b / 100);
            isNaN(f) || c.push(f);
        }
        return c;
    },
    reset: function() {
        this.objectsToResize = [];
        this.allSvgObjects = [];
        this.allObjects = [];
        this.linesToResize = [];
    }
});
AmCharts.LinesSettings = AmCharts.Class({
    construct: function(a) {
        this.cname = "LinesSettings";
        this.balloonText = "[[title]]";
        this.thickness = 1;
        this.dashLength = 0;
        this.arrowSize = 10;
        this.arrowAlpha = 1;
        this.arrow = "none";
        this.color = "#990000";
        this.descriptionWindowWidth = 250;
        this.bringForwardOnHover = !0;
        AmCharts.applyTheme(this, a, this.cname);
    }
});
AmCharts.MapObject = AmCharts.Class({
    construct: function(a) {
        this.fixedSize = this.mouseEnabled = !0;
        this.images = [];
        this.lines = [];
        this.areas = [];
        this.remainVisible = !0;
        this.passZoomValuesToTarget = !1;
        this.objectType = this.cname;
        AmCharts.applyTheme(this, a, "MapObject");
    }
});
AmCharts.MapArea = AmCharts.Class({
    inherits: AmCharts.MapObject,
    construct: function(a) {
        this.cname = "MapArea";
        AmCharts.MapArea.base.construct.call(this, a);
        AmCharts.applyTheme(this, a, this.cname);
    }
});
AmCharts.MapLine = AmCharts.Class({
    inherits: AmCharts.MapObject,
    construct: function(a) {
        this.cname = "MapLine";
        this.longitudes = [];
        this.latitudes = [];
        this.x = [];
        this.y = [];
        this.arrow = "none";
        AmCharts.MapLine.base.construct.call(this, a);
        AmCharts.applyTheme(this, a, this.cname);
    }
});
AmCharts.MapImage = AmCharts.Class({
    inherits: AmCharts.MapObject,
    construct: function(a) {
        this.cname = "MapImage";
        this.scale = 1;
        this.widthAndHeightUnits = "pixels";
        this.labelShiftY = this.labelShiftX = 0;
        AmCharts.MapImage.base.construct.call(this, a);
        AmCharts.applyTheme(this, a, this.cname);
    },
    remove: function() {
        var a = this.displayObject;
        a && a.remove();
        (a = this.imageLabel) && a.remove();
    }
});
AmCharts.degreesToRadians = function(a) { return a / 180 * Math.PI };
AmCharts.radiansToDegrees = function(a) { return a / Math.PI * 180 };
AmCharts.getColorFade = function(a, b, c) {
    var d = AmCharts.hex2RGB(b);
    b = d[0];
    var e = d[1], d = d[2], f = AmCharts.hex2RGB(a);
    a = f[0];
    var g = f[1], f = f[2];
    a += Math.round((b - a) * c);
    g += Math.round((e - g) * c);
    f += Math.round((d - f) * c);
    return"rgb(" + a + "," + g + "," + f + ")";
};
AmCharts.hex2RGB = function(a) { return[parseInt(a.substring(1, 3), 16), parseInt(a.substring(3, 5), 16), parseInt(a.substring(5, 7), 16)] };
AmCharts.processDescriptionWindow = function(a, b) {
    isNaN(b.descriptionWindowX) && (b.descriptionWindowX = a.descriptionWindowX);
    isNaN(b.descriptionWindowY) && (b.descriptionWindowY = a.descriptionWindowY);
    isNaN(b.descriptionWindowLeft) && (b.descriptionWindowLeft = a.descriptionWindowLeft);
    isNaN(b.descriptionWindowRight) && (b.descriptionWindowRight = a.descriptionWindowRight);
    isNaN(b.descriptionWindowTop) && (b.descriptionWindowTop = a.descriptionWindowTop);
    isNaN(b.descriptionWindowBottom) && (b.descriptionWindowBottom =
        a.descriptionWindowBottom);
    isNaN(b.descriptionWindowWidth) && (b.descriptionWindowWidth = a.descriptionWindowWidth);
    isNaN(b.descriptionWindowHeight) && (b.descriptionWindowHeight = a.descriptionWindowHeight);
};
AmCharts.MapData = AmCharts.Class({
    inherits: AmCharts.MapObject,
    construct: function() {
        this.cname = "MapData";
        AmCharts.MapData.base.construct.call(this);
        this.projection = "mercator";
        this.topLatitude = 90;
        this.bottomLatitude = -90;
        this.leftLongitude = -180;
        this.rightLongitude = 180;
        this.zoomLevel = 1;
        this.getAreasFromMap = !1;
    }
});
AmCharts.DescriptionWindow = AmCharts.Class({
    construct: function() {},
    show: function(a, b, c, d) {
        var e = this, f = document.createElement("div");
        f.style.position = "absolute";
        var g = a.classNamePrefix + "-description-";
        f.className = "ammapDescriptionWindow " + g + "div";
        e.div = f;
        b.appendChild(f);
        var k = document.createElement("img");
        k.className = "ammapDescriptionWindowCloseButton " + g + "close-img";
        k.src = a.pathToImages + "xIcon.gif";
        k.style.cssFloat = "right";
        k.onclick = function() { e.close() };
        k.onmouseover = function() {
            k.src = a.pathToImages +
                "xIconH.gif";
        };
        k.onmouseout = function() { k.src = a.pathToImages + "xIcon.gif" };
        f.appendChild(k);
        b = document.createElement("div");
        b.className = "ammapDescriptionTitle " + g + "title-div";
        b.onmousedown = function() { e.div.style.zIndex = 1E3 };
        f.appendChild(b);
        d = document.createTextNode(d);
        b.appendChild(d);
        d = b.offsetHeight;
        b = document.createElement("div");
        b.className = "ammapDescriptionText " + g + "text-div";
        b.style.maxHeight = e.maxHeight - d - 20 + "px";
        f.appendChild(b);
        b.innerHTML = c;
    },
    close: function() {
        try {
            this.div.parentNode.removeChild(this.div);
        } catch (a) {
        }
    }
});
AmCharts.ValueLegend = AmCharts.Class({
    construct: function(a) {
        this.cname = "ValueLegend";
        this.enabled = !0;
        this.showAsGradient = !1;
        this.minValue = 0;
        this.height = 12;
        this.width = 200;
        this.bottom = this.left = 10;
        this.borderColor = "#FFFFFF";
        this.borderAlpha = this.borderThickness = 1;
        this.color = "#000000";
        this.fontSize = 11;
        AmCharts.applyTheme(this, a, this.cname);
    },
    init: function(a, b) {
        if (this.enabled) {
            var c = a.areasSettings.color, d = a.areasSettings.colorSolid, e = a.colorSteps;
            AmCharts.remove(this.set);
            var f = b.set();
            this.set = f;
            AmCharts.setCN(a,
                f, "value-legend");
            var g = 0, k = this.minValue, h = this.fontSize, l = a.fontFamily, p = this.color;
            void 0 == k && (k = a.minValueReal);
            void 0 !== k && (g = AmCharts.text(b, k, p, l, h, "left"), g.translate(0, h / 2 - 1), AmCharts.setCN(a, g, "value-legend-min-label"), f.push(g), g = g.getBBox().height);
            k = this.maxValue;
            void 0 === k && (k = a.maxValueReal);
            void 0 !== k && (g = AmCharts.text(b, k, p, l, h, "right"), g.translate(this.width, h / 2 - 1), AmCharts.setCN(a, g, "value-legend-max-label"), f.push(g), g = g.getBBox().height);
            if (this.showAsGradient)
                c = AmCharts.rect(b,
                    this.width, this.height, [c, d], 1, this.borderThickness, this.borderColor, 1, 0, 0), AmCharts.setCN(a, c, "value-legend-gradient"), c.translate(0, g), f.push(c);
            else for (h = this.width / e, l = 0; l < e; l++)p = AmCharts.getColorFade(c, d, 1 * l / (e - 1)), p = AmCharts.rect(b, h, this.height, p, 1, this.borderThickness, this.borderColor, 1), AmCharts.setCN(a, p, "value-legend-color"), AmCharts.setCN(a, p, "value-legend-color-" + l), p.translate(h * l, g), f.push(p);
            d = c = 0;
            e = f.getBBox();
            g = a.getY(this.bottom, !0);
            h = a.getY(this.top);
            l = a.getX(this.right, !0);
            p = a.getX(this.left);
            isNaN(h) || (c = h);
            isNaN(g) || (c = g - e.height);
            isNaN(p) || (d = p);
            isNaN(l) || (d = l - e.width);
            f.translate(d, c);
        } else AmCharts.remove(this.set);
    }
});
AmCharts.ObjectList = AmCharts.Class({
    construct: function(a) { this.divId = a },
    init: function(a) {
        this.chart = a;
        var b;
        b = this.divId;
        this.container && (b = this.container);
        this.div = b = "object" != typeof b ? document.getElementById(b) : b;
        b = document.createElement("div");
        b.className = "ammapObjectList " + a.classNamePrefix + "-object-list-div";
        this.div.appendChild(b);
        this.addObjects(a.dataProvider, b);
    },
    addObjects: function(a, b) {
        var c = this.chart, d = document.createElement("ul");
        d.className = c.classNamePrefix + "-object-list-ul";
        var e;
        if (a.areas)
            for (e = 0; e < a.areas.length; e++) {
                var f = a.areas[e];
                void 0 === f.showInList && (f.showInList = c.showAreasInList);
                this.addObject(f, d);
            }
        if (a.images)for (e = 0; e < a.images.length; e++)f = a.images[e], void 0 === f.showInList && (f.showInList = c.showImagesInList), this.addObject(f, d);
        if (a.lines)for (e = 0; e < a.lines.length; e++)f = a.lines[e], void 0 === f.showInList && (f.showInList = c.showLinesInList), this.addObject(f, d);
        0 < d.childNodes.length && b.appendChild(d);
    },
    addObject: function(a, b) {
        var c = this;
        if (a.showInList && void 0 !== a.title) {
            var d =
                    c.chart,
                e = document.createElement("li");
            e.className = d.classNamePrefix + "-object-list-li";
            var f = document.createTextNode(a.title), g = document.createElement("a");
            g.className = d.classNamePrefix + "-object-list-a";
            g.appendChild(f);
            e.appendChild(g);
            b.appendChild(e);
            this.addObjects(a, e);
            g.onmouseover = function() { c.chart.rollOverMapObject(a, !1) };
            g.onmouseout = function() { c.chart.rollOutMapObject(a) };
            g.onclick = function() { c.chart.clickMapObject(a) };
        }
    }
});