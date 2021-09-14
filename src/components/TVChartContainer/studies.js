export const MANami = function (PineJS) {
    return {
        // Replace the <study name> with your study name
        // The name will be used internally by the Charting Library
        name: 'Moving Average Nami',
        metainfo: {
            _metainfoVersion: 27,
            isTVScript: false,
            isTVScriptStub: false,
            is_hidden_study: false,
            defaults: {
                styles: {
                    plot_0: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#ceb917',
                    },
                    plot_1: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#ee02ee',
                    },
                    plot_2: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#b7035e',
                    },
                    // plot_3: {
                    //     linestyle: 0,
                    //     linewidth: 1,
                    //     plottype: 0,
                    //     trackPrice: !1,
                    //     transparency: 0,
                    //     visible: !0,
                    //     color: '#00cccc',
                    // },
                },
                precision: 4,
                inputs: {
                    in_0: 7,
                    in_1: 'close',
                    in_2: 34,
                    in_3: 'close',
                    in_4: 89,
                    in_5: 'close',
                    // in_6: 168,
                    // in_7: 'close',
                },
                text: 'MA',
            },
            plots: [
                {
                    id: 'plot_0',
                    type: 'line',
                }, {
                    id: 'plot_1',
                    type: 'line',
                }, {
                    id: 'plot_2',
                    type: 'line',
                },
                // {
                //     id: 'plot_3',
                //     type: 'line',
                // }
            ],
            styles: {
                plot_0: {
                    title: 'Line 1',
                    histogramBase: 0,
                    joinPoints: false,
                },
                plot_1: {
                    title: 'Line 2',
                    histogramBase: 0,
                    joinPoints: false,
                },
                plot_2: {
                    title: 'Line 3',
                    histogramBase: 0,
                    joinPoints: false,
                },
                // plot_3: {
                //     title: 'Line 4',
                //     histogramBase: 0,
                //     joinPoints: false,
                // },
            },
            description: 'Moving Average Nami',
            shortDescription: 'MA',
            is_price_study: true,
            inputs: [
                {
                    id: 'in_0',
                    name: 'Length',
                    defval: 7,
                    type: 'integer',
                    min: 1,
                    max: 1e4,
                }, {
                    id: 'in_1',
                    name: 'Source',
                    defval: 'close',
                    type: 'source',
                    options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                }, {
                    id: 'in_2',
                    name: 'Length 2',
                    defval: 34,
                    type: 'integer',
                    min: 1,
                    max: 1e4,
                }, {
                    id: 'in_3',
                    name: 'Source 2',
                    defval: 'close',
                    type: 'source',
                    options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                }, {
                    id: 'in_4',
                    name: 'Length 3',
                    defval: 89,
                    type: 'integer',
                    min: 1,
                    max: 1e4,
                }, {
                    id: 'in_5',
                    name: 'Source 3',
                    defval: 'close',
                    type: 'source',
                    options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                },
                // {
                //     id: 'in_6',
                //     name: 'Length 4',
                //     defval: 168,
                //     type: 'integer',
                //     min: 1,
                //     max: 1e4,
                // }, {
                //     id: 'in_7',
                //     name: 'Source 4',
                //     defval: 'close',
                //     type: 'source',
                //     options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                // }
            ],
            id: 'Moving Average Nami@tv-basicstudies-1',
            scriptIdPart: '',
            name: 'Moving Average Nami',
        },

        constructor() {
            this.main = function (context, inputCallback) {
                this._context = context;
                this._input = inputCallback;

                const i0 = PineJS.Std[this._input(1)](this._context);
                const r0 = this._input(0);
                const s0 = this._context.new_var(i0);

                const i1 = PineJS.Std[this._input(3)](this._context);
                const r1 = this._input(2);
                const s1 = this._context.new_var(i1);

                const i2 = PineJS.Std[this._input(5)](this._context);
                const r2 = this._input(4);
                const s2 = this._context.new_var(i2);

                // const i3 = PineJS.Std[this._input(7)](this._context);
                // const r3 = this._input(6);
                // const s3 = this._context.new_var(i3);
                return [{
                    value: PineJS.Std.sma(s0, r0, this._context),
                }, {
                    value: PineJS.Std.sma(s1, r1, this._context),
                }, {
                    value: PineJS.Std.sma(s2, r2, this._context),
                },
                // {
                //     value: PineJS.Std.sma(s3, r3, this._context),
                // }
                ];
            };
        },
    };
};
export const EMANami = function (PineJS) {
    return {
        // Replace the <study name> with your study name
        // The name will be used internally by the Charting Library
        name: 'Moving Average Exponential Nami',
        metainfo: {
            _metainfoVersion: 27,
            isTVScript: false,
            isTVScriptStub: false,
            is_hidden_study: false,
            defaults: {
                styles: {
                    plot_0: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#ceb917',
                    },
                    plot_1: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#ee02ee',
                    },
                    plot_2: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#b7035e',
                    },
                    // plot_3: {
                    //     linestyle: 0,
                    //     linewidth: 1,
                    //     plottype: 0,
                    //     trackPrice: !1,
                    //     transparency: 0,
                    //     visible: !0,
                    //     color: '#00cccc',
                    // },
                },
                precision: 4,
                inputs: {
                    in_0: 7,
                    in_1: 'close',
                    in_2: 34,
                    in_3: 'close',
                    in_4: 89,
                    in_5: 'close',
                    // in_6: 168,
                    // in_7: 'close',
                },
                text: 'MA',
            },
            plots: [
                {
                    id: 'plot_0',
                    type: 'line',
                }, {
                    id: 'plot_1',
                    type: 'line',
                }, {
                    id: 'plot_2',
                    type: 'line',
                },
                // {
                //     id: 'plot_3',
                //     type: 'line',
                // }
            ],
            styles: {
                plot_0: {
                    title: 'Line 1',
                    histogramBase: 0,
                    joinPoints: false,
                },
                plot_1: {
                    title: 'Line 2',
                    histogramBase: 0,
                    joinPoints: false,
                },
                plot_2: {
                    title: 'Line 3',
                    histogramBase: 0,
                    joinPoints: false,
                },
                // plot_3: {
                //     title: 'Line 4',
                //     histogramBase: 0,
                //     joinPoints: false,
                // },
            },
            description: 'Moving Average Exponential Nami',
            shortDescription: 'EMA',
            is_price_study: true,
            inputs: [
                {
                    id: 'in_0',
                    name: 'Length',
                    defval: 7,
                    type: 'integer',
                    min: 1,
                    max: 1e4,
                }, {
                    id: 'in_1',
                    name: 'Source',
                    defval: 'close',
                    type: 'source',
                    options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                }, {
                    id: 'in_2',
                    name: 'Length 2',
                    defval: 34,
                    type: 'integer',
                    min: 1,
                    max: 1e4,
                }, {
                    id: 'in_3',
                    name: 'Source 2',
                    defval: 'close',
                    type: 'source',
                    options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                }, {
                    id: 'in_4',
                    name: 'Length 3',
                    defval: 89,
                    type: 'integer',
                    min: 1,
                    max: 1e4,
                }, {
                    id: 'in_5',
                    name: 'Source 3',
                    defval: 'close',
                    type: 'source',
                    options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                },
                // {
                //     id: 'in_6',
                //     name: 'Length 4',
                //     defval: 168,
                //     type: 'integer',
                //     min: 1,
                //     max: 1e4,
                // }, {
                //     id: 'in_7',
                //     name: 'Source 4',
                //     defval: 'close',
                //     type: 'source',
                //     options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
                // }
            ],
            id: 'Moving Average Exponential Nami@tv-basicstudies-1',
            scriptIdPart: '',
            name: 'Moving Average Exponential Nami',
        },

        constructor() {
            this.main = function (context, inputCallback) {
                this._context = context;
                this._input = inputCallback;

                const i0 = PineJS.Std[this._input(1)](this._context);
                const r0 = this._input(0);
                const s0 = this._context.new_var(i0);

                const i1 = PineJS.Std[this._input(3)](this._context);
                const r1 = this._input(2);
                const s1 = this._context.new_var(i1);

                const i2 = PineJS.Std[this._input(5)](this._context);
                const r2 = this._input(4);
                const s2 = this._context.new_var(i2);

                // const i3 = PineJS.Std[this._input(7)](this._context);
                // const r3 = this._input(6);
                // const s3 = this._context.new_var(i3);
                // return [];
                return [{
                    value: PineJS.Std.ema(s0, r0, this._context),
                }, {
                    value: PineJS.Std.ema(s1, r1, this._context),
                }, {
                    value: PineJS.Std.ema(s2, r2, this._context),
                },
                //     {
                //     value: PineJS.Std.ema(s3, r3, this._context),
                // }
                ];
            };
        },
    };
};
export const WMANami = function (PineJS) {
    return {
        name: 'Moving Average Weighted Nami',
        metainfo: {
            _metainfoVersion: 27,
            isTVScript: !1,
            isTVScriptStub: !1,
            is_hidden_study: !1,
            defaults: {
                styles: {
                    plot_0: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#2196F3',
                    },
                },
                precision: 4,
                inputs: {
                    in_0: 9,
                    in_1: 'close',
                    in_2: 0,
                },
            },
            plots: [{
                id: 'plot_0',
                type: 'line',
            }],
            styles: {
                plot_0: {
                    title: 'Plot',
                    histogramBase: 0,
                    joinPoints: !1,
                },
            },
            description: 'Moving Average Weighted Nami',
            shortDescription: 'WMA',
            is_price_study: !0,
            inputs: [{
                id: 'in_0',
                name: 'Length',
                defval: 9,
                type: 'integer',
                min: 1,
                max: 2e3,
            }, {
                id: 'in_1',
                name: 'Source',
                defval: 'close',
                type: 'source',
                options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
            }, {
                id: 'in_2',
                name: 'Offset',
                defval: 0,
                type: 'integer',
                min: -1e4,
                max: 1e4,
            }],
            id: 'Moving Average Weighted Nami@tv-basicstudies-1',
            scriptIdPart: '',
            name: 'Moving Average Weighted Nami',
        },
        constructor() {
            this.main = function (e, t) {
                this._context = e;
                this._input = t;
                const i = PineJS.Std[this._input(1)](this._context);
                const r = this._input(0);
                const o = this._input(2);
                const s = this._context.new_var(i);
                return [{
                    value: PineJS.Std.wma(s, r, this._context),
                    offset: o,
                }];
            };
        },
    };
};
export const BOLLNami = function (PineJS) {
    return {
        name: 'Bollinger Bands Nami',
        metainfo: {
            _metainfoVersion: 27,
            isTVScript: !1,
            isTVScriptStub: !1,
            is_hidden_study: !1,
            defaults: {
                styles: {
                    plot_0: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#FF6D00',
                    },
                    plot_1: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#2196F3',
                    },
                    plot_2: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#2196F3',
                    },
                },
                precision: 4,
                filledAreasStyle: {
                    fill_0: {
                        color: '#2196F3',
                        transparency: 95,
                        visible: !0,
                    },
                },
                inputs: {
                    in_0: 20,
                    in_1: 2,
                },
            },
            plots: [{
                id: 'plot_0',
                type: 'line',
            }, {
                id: 'plot_1',
                type: 'line',
            }, {
                id: 'plot_2',
                type: 'line',
            }],
            styles: {
                plot_0: {
                    title: 'Median',
                    histogramBase: 0,
                    joinPoints: !1,
                },
                plot_1: {
                    title: 'Upper',
                    histogramBase: 0,
                    joinPoints: !1,
                },
                plot_2: {
                    title: 'Lower',
                    histogramBase: 0,
                    joinPoints: !1,
                },
            },
            description: 'Bollinger Bands Nami',
            shortDescription: 'BB',
            is_price_study: !0,
            filledAreas: [{
                id: 'fill_0',
                objAId: 'plot_1',
                objBId: 'plot_2',
                type: 'plot_plot',
                title: 'Plots Background',
            }],
            inputs: [{
                id: 'in_0',
                name: 'length',
                defval: 20,
                type: 'integer',
                min: 1,
                max: 1e4,
            }, {
                id: 'in_1',
                name: 'mult',
                defval: 2,
                type: 'float',
                min: 0.001,
                max: 50,
            }],
            id: 'Bollinger Bands Nami@tv-basicstudies-1',
            scriptIdPart: '',
            name: 'Bollinger Bands Nami',
        },
        constructor() {
            this.f_0 = function (e, t) {
                return e * t;
            };
            this.f_1 = function (e, t) {
                return e + t;
            };
            this.f_2 = function (e, t) {
                return e - t;
            };
            this.main = function (e, t) {
                this._context = e;
                this._input = t;
                const i = PineJS.Std.close(this._context);
                const r = this._input(0);
                const o = this._input(1);
                const s = this._context.new_var(i);
                const a = PineJS.Std.sma(s, r, this._context);
                const l = this._context.new_var(i);
                const c = PineJS.Std.stdev(l, r, this._context);
                const u = this.f_0(o, c);
                return [a, this.f_1(a, u), this.f_2(a, u)];
            };
        },
    };
};
export const VWAPNami = function (PineJS) {
    return {
        name: 'VWAP Nami',
        metainfo: {
            _metainfoVersion: 27,
            isTVScript: !1,
            isTVScriptStub: !1,
            is_hidden_study: !1,
            defaults: {
                styles: {
                    plot_0: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: 0,
                        transparency: 0,
                        visible: !0,
                        color: '#2196F3',
                    },
                },
                precision: 4,
            },
            plots: [{
                id: 'plot_0',
                type: 'line',
            }],
            styles: {
                plot_0: {
                    title: 'VWAP',
                    histogramBase: 0,
                    joinPoints: !1,
                    isHidden: !1,
                },
            },
            description: 'VWAP Nami',
            shortDescription: 'VWAP',
            is_price_study: !0,
            inputs: [],
            id: 'VWAP Nami@tv-basicstudies-1',
            scriptIdPart: '',
            name: 'VWAP Nami',
        },
        constructor() {
            this.f_1 = function (e) {
                e.hist = null;
                e.add_hist();
            };
            this.init = function (e, t) {
                this._isNewSession = null;
            };
            this.main = function (e, t) {
                this._context = e;
                this._input = t;
                const i = e.new_var();
                const r = e.new_var();
                const o = this._context.symbol.time;
                // eslint-disable-next-line no-return-assign,no-sequences
                return o && (this._isNewSession === null && (this._isNewSession = PineJS.Std.createNewSessionCheck(e)), this._isNewSession(o) && (this.f_1(i), this.f_1(r))), i.set(PineJS.Std.nz(i.get(1)) + PineJS.Std.hlc3(this._context) * PineJS.Std.volume(this._context)), r.set(PineJS.Std.nz(r.get(1)) + PineJS.Std.volume(this._context)), [i.get(0) / r.get(0)];
            };
        },
    };
};
export const MACDNami = function (PineJS) {
    return {
        name: 'Moving Average Convergence/Divergence Nami',
        metainfo: {
            _metainfoVersion: 27,
            isTVScript: !1,
            isTVScriptStub: !1,
            is_hidden_study: !1,
            defaults: {
                styles: {
                    plot_0: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 5,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#FF5252',
                    },
                    plot_1: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#2196F3',
                    },
                    plot_2: {
                        linestyle: 0,
                        linewidth: 1,
                        plottype: 0,
                        trackPrice: !1,
                        transparency: 0,
                        visible: !0,
                        color: '#FF6D00',
                    },
                },
                precision: 4,
                palettes: {
                    palette_0: {
                        colors: {
                            0: {
                                color: '#26A69A',
                                width: 1,
                                style: 0,
                            },
                            1: {
                                color: '#B2DFDB',
                                width: 1,
                                style: 0,
                            },
                            2: {
                                color: '#FFCDD2',
                                width: 1,
                                style: 0,
                            },
                            3: {
                                color: '#FF5252',
                                width: 1,
                                style: 0,
                            },
                        },
                    },
                },
                inputs: {
                    in_0: 12,
                    in_1: 26,
                    in_3: 'close',
                    in_2: 9,
                },
            },
            plots: [{
                id: 'plot_0',
                type: 'line',
            }, {
                id: 'plot_1',
                type: 'line',
            }, {
                id: 'plot_2',
                type: 'line',
            }, {
                id: 'plot_3',
                palette: 'palette_0',
                target: 'plot_0',
                type: 'colorer',
            }],
            styles: {
                plot_0: {
                    title: 'Histogram',
                    histogramBase: 0,
                    joinPoints: !1,
                },
                plot_1: {
                    title: 'MACD',
                    histogramBase: 0,
                    joinPoints: !1,
                },
                plot_2: {
                    title: 'Signal',
                    histogramBase: 0,
                    joinPoints: !1,
                },
            },
            description: 'MACD Nami',
            shortDescription: 'MACD',
            is_price_study: !1,
            palettes: {
                palette_0: {
                    colors: {
                        0: {
                            name: 'Color 0',
                        },
                        1: {
                            name: 'Color 1',
                        },
                        2: {
                            name: 'Color 2',
                        },
                        3: {
                            name: 'Color 3',
                        },
                    },
                },
            },
            inputs: [{
                id: 'in_0',
                name: 'fastLength',
                defval: 12,
                type: 'integer',
                min: 1,
                max: 2e3,
            }, {
                id: 'in_1',
                name: 'slowLength',
                defval: 26,
                type: 'integer',
                min: 1,
                max: 2e3,
            }, {
                id: 'in_3',
                name: 'Source',
                defval: 'close',
                type: 'source',
                options: ['open', 'high', 'low', 'close', 'hl2', 'hlc3', 'ohlc4'],
            }, {
                id: 'in_2',
                name: 'signalLength',
                defval: 9,
                type: 'integer',
                min: 1,
                max: 50,
            }],
            id: 'Moving Average Convergence/Divergence Nami@tv-basicstudies-1',
            scriptIdPart: '',
            name: 'MACD Nami',
        },
        constructor() {
            this.f_0 = function (e, t) {
                return e - t;
            };
            this.f_1 = function (e) {
                const t = e > 0 ? 1 : 3;
                const i = PineJS.Std.change(this._context.new_var(e));
                return t - (PineJS.Std.le(i, 0) ? 0 : 1);
            };
            this.main = function (e, t) {
                this._context = e;
                this._input = t;
                const i = PineJS.Std[this._input(2)](this._context);
                const r = this._input(0);
                const o = this._input(1);
                const s = this._input(3);
                const a = this._context.new_var(i);
                const l = PineJS.Std.ema(a, r, this._context);
                const c = this._context.new_var(i);
                const u = PineJS.Std.ema(c, o, this._context);
                const h = this.f_0(l, u);
                const d = this._context.new_var(h);
                const p = PineJS.Std.ema(d, s, this._context);
                const f = this.f_0(h, p);
                return [f, h, p, this.f_1(f)];
            };
        },
    };
};
