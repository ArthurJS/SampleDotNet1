(function(h) {
    function p() { return Array.prototype.slice.call(arguments, 1) }

    var q = h.pick, n = h.wrap, r = h.extend, o = HighchartsAdapter.fireEvent, j = h.Axis, s = h.Series;
    r(j.prototype, {
        isInBreak: function(g, d) {
            var a = g.repeat || Infinity, c = g.from, b = g.to - g.from, a = d >= c ? (d - c) % a : a - (c - d) % a;
            return g.inclusive ? a <= b : a < b && a !== 0;
        },
        isInAnyBreak: function(g, d) {
            if (!this.options.breaks)return!1;
            for (var a = this.options.breaks, c = a.length, b = !1, e = !1; c--;)this.isInBreak(a[c], g) && (b = !0, e || (e = q(a[c].showPoints, this.isXAxis ? !1 : !0)));
            return b &&
                d ? b && !e : b;
        }
    });
    n(j.prototype, "setTickPositions", function(g) {
        g.apply(this, Array.prototype.slice.call(arguments, 1));
        if (this.options.breaks) {
            var d = this.tickPositions, a = this.tickPositions.info, c = [], b;
            if (!(a && a.totalRange >= this.closestPointRange)) {
                for (b = 0; b < d.length; b++)this.isInAnyBreak(d[b]) || c.push(d[b]);
                this.tickPositions = c;
                this.tickPositions.info = a;
            }
        }
    });
    n(j.prototype, "init", function(g, d, a) {
        if (a.breaks && a.breaks.length)a.ordinal = !1;
        g.call(this, d, a);
        if (this.options.breaks) {
            var c = this;
            c.doPostTranslate =
                !0;
            this.val2lin = function(b) {
                var e = b, a, d;
                for (d = 0; d < c.breakArray.length; d++)
                    if (a = c.breakArray[d], a.to <= b)e -= a.len;
                    else if (a.from >= b)break;
                    else if (c.isInBreak(a, b)) {
                        e -= b - a.from;
                        break;
                    }
                return e;
            };
            this.lin2val = function(b) {
                var e, a;
                for (a = 0; a < c.breakArray.length; a++)
                    if (e = c.breakArray[a], e.from >= b)break;
                    else e.to < b ? b += e.to - e.from : c.isInBreak(e, b) && (b += e.to - e.from);
                return b;
            };
            this.setExtremes = function(b, c, a, d, g) {
                for (; this.isInAnyBreak(b);)b -= this.closestPointRange;
                for (; this.isInAnyBreak(c);)c -= this.closestPointRange;
                j.prototype.setExtremes.call(this, b, c, a, d, g);
            };
            this.setAxisTranslation = function(b) {
                j.prototype.setAxisTranslation.call(this, b);
                var a = c.options.breaks, b = [], d = [], g = 0, h, f, k = c.userMin || c.min, l = c.userMax || c.max, i, m;
                for (m in a)f = a[m], c.isInBreak(f, k) && (k += f.to % f.repeat - k % f.repeat), c.isInBreak(f, l) && (l -= l % f.repeat - f.from % f.repeat);
                for (m in a) {
                    f = a[m];
                    i = f.from;
                    for (h = f.repeat || Infinity; i - h > k;)i -= h;
                    for (; i < k;)i += h;
                    for (; i < l; i += h)b.push({ value: i, move: "in" }), b.push({ value: i + (f.to - f.from), move: "out", size: f.breakSize });
                }
                b.sort(function(a,
                    b) { return a.value === b.value ? (a.move === "in" ? 0 : 1) - (b.move === "in" ? 0 : 1) : a.value - b.value });
                a = 0;
                i = k;
                for (m in b) {
                    f = b[m];
                    a += f.move === "in" ? 1 : -1;
                    if (a === 1 && f.move === "in")i = f.value;
                    a === 0 && (d.push({ from: i, to: f.value, len: f.value - i - (f.size || 0) }), g += f.value - i - (f.size || 0));
                }
                c.breakArray = d;
                o(c, "afterBreaks");
                c.transA *= (l - c.min) / (l - k - g);
                c.min = k;
                c.max = l;
            };
        }
    });
    n(s.prototype, "generatePoints", function(g) {
        g.apply(this, p(arguments));
        var d = this.xAxis, a = this.yAxis, c = this.points, b, e = c.length;
        if (d && a && (d.options.breaks || a.options.breaks))
            for (; e--;)
                if (b =
                    c[e], d.isInAnyBreak(b.x, !0) || a.isInAnyBreak(b.y, !0))c.splice(e, 1), this.data[e].destroyElements();
    });
    n(h.seriesTypes.column.prototype, "drawPoints", function(g) {
        g.apply(this);
        var g = this.points, d = this.yAxis, a = d.breakArray || [], c, b, e, h, j;
        for (e = 0; e < g.length; e++) {
            c = g[e];
            j = c.stackY || c.y;
            for (h = 0; h < a.length; h++)
                if (b = a[h], j < b.from)break;
                else j > b.to ? o(d, "pointBreak", { point: c, brk: b }) : o(d, "pointInBreak", { point: c, brk: b });
        }
    });
})(Highcharts);