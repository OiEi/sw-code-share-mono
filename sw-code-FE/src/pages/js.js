"use strict";

function _slicedToArray(a, b) {
    return _arrayWithHoles(a) ||
        _iterableToArrayLimit(a, b) ||
        _nonIterableRest()
}

function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance")
}

function _iterableToArrayLimit(a, b) {
    var c = [], d = !0, e = !1, f = void 0;
    try {
        for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !(b && c.length === b)); d = !0) ;
    } catch (a) {
        e = !0, f = a
    } finally {
        try {
            d || null == h["return"] || h["return"]()
        } finally {
            if (e) throw f
        }
    }
    return c
}

function _arrayWithHoles(a) {
    if (Array.isArray(a)) return a
}

function _objectSpread(a) {
    for (var b = 1; b < arguments.length; b++) {
        var c = null == arguments[b] ? {} : arguments[b], d = Object.keys(c);
        "function" == typeof Object.getOwnPropertySymbols && (d = d.concat(Object.getOwnPropertySymbols(c).filter(function (a) {
            return Object.getOwnPropertyDescriptor(c, a).enumerable
        }))), d.forEach(function (b) {
            _defineProperty(a, b, c[b])
        })
    }
    return a
}

function _defineProperty(a, b, c) {
    return b in a ? Object.defineProperty(a, b, {
        value: c,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[b] = c, a
}/* Автоматически генерируемый файл */
(function (a) {
    function b(a) {
        var b = d.reduce(function (b, c) {
            return a[c] && "null" !== a[c] && (b[c] = a[c]), b
        }, {});
        return e(b)
    }

    var c = a.dist, d = a.stubbedFlags, e = a.getObjectHash, f = a.getKeys;
    exports.checkIfBundleExists = function (a) {
        var d = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "base", e = b(a);
        return e && (d += "-" + e), void 0 !== c[d]
    }, exports.getContent = function (a) {
        var d = a.expFlags, e = void 0 === d ? {} : d, g = a.content, h = void 0 === g ? "all" : g, i = a.ctx,
            j = void 0 === i ? {} : i, k = a.tld, l = void 0 === k ? "ru" : k, m = a.lang, n = void 0 === m ? "ru" : m,
            o = a.nonce, p = void 0 === o ? "" : o, q = a.key, r = void 0 === q ? "base" : q;
        j = _objectSpread({}, j), j.keyTld = l ? l.split(".").pop() : "ru", j.tld = l, j.lang = n, j.nonce = p;
        var s = b(e);// Такое может случиться, если, например, передан флаг,
        s && c["".concat(r, "-").concat(s)] ? r = "".concat(r, "-").concat(s) : !c[r] && (r = "base");
        var t = c[r], u = t.html, v = t.css, w = t.js, x = f(c[r].i18n, j.lang), y = x.i18n, z = x.i18nDefault,
            A = _objectSpread({}, y, j, {i18nDefault: z});
        return "html" === h ? u(A) : "css" === h ? v : "js" === h ? w : "<style nonce=\"".concat(j.nonce, "\">").concat(v, "</style>") + u(A)
    }, exports.getFlagsHash = b
})({
    dist: {
        base: {
            html: function html(d) {
                var e = {"<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;", "&": "&amp;"}, a = function (b) {
                    return b ? (b + "").replace(/["'&<>]/g, function (b) {
                        return e[b]
                    }) : ""
                };
                return "<a class=\"tools-lamp tools-lamp_side_right\" href=\"" + a(d.url || "") + "\" target=\"_blank\" title=\"" + (a(d.i18n_tools__lamp_title || Object(d.i18nDefault).i18n_tools__lamp_title) || "") + "\" style=\"z-index: " + (d.zIndex || 1e3 || "") + "\"></a>"
            },
            params: [],
            css: ".tools-lamp{position:fixed;bottom:0;display:block;width:36px;height:36px;border-width:1px;border-color:rgba(0,0,0,.2);border-top-style:solid;background-color:#fff;-webkit-transition:border-color .4s;transition:border-color .4s}.tools-lamp::before{position:relative;top:0;display:block;width:100%;height:100%;content:'';opacity:.7;background:url(//yastatic.net/s3/frontend/yandex-lego/serp-header/_/2HDAxgwB.svg) no-repeat top left;-webkit-transition:opacity .4s,-webkit-transform .4s;transition:transform .4s,opacity .4s;transition:transform .4s,opacity .4s,-webkit-transform .4s}.tools-lamp:hover{border-color:rgba(0,0,0,.3)}.tools-lamp:hover::before{opacity:1;-webkit-transform:translateY(-1px);transform:translateY(-1px)}.tools-lamp_side_right{right:0;border-left-style:solid;border-top-left-radius:3px}",
            js: "",
            hash: "base",
            i18n: {
                be: {},
                en: {i18n_tools__lamp_title: "Send an idea"},
                kk: {},
                ru: {i18n_tools__lamp_title: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0438\u0434\u0435\u044E"},
                tr: {},
                tt: {},
                uk: {},
                uz: {}
            },
            key: "base"
        }, left: {
            html: function html(d) {
                var e = {"<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;", "&": "&amp;"}, a = function (b) {
                    return b ? (b + "").replace(/["'&<>]/g, function (b) {
                        return e[b]
                    }) : ""
                };
                return "<a class=\"tools-lamp tools-lamp_side_left\" href=\"" + a(d.url || "") + "\" target=\"_blank\" title=\"" + (a(d.i18n_tools__lamp_title || Object(d.i18nDefault).i18n_tools__lamp_title) || "") + "\" style=\"z-index: " + (d.zIndex || 1e3 || "") + "\"></a>"
            },
            params: [],
            css: ".tools-lamp{position:fixed;bottom:0;display:block;width:36px;height:36px;border-width:1px;border-color:rgba(0,0,0,.2);border-top-style:solid;background-color:#fff;-webkit-transition:border-color .4s;transition:border-color .4s}.tools-lamp::before{position:relative;top:0;display:block;width:100%;height:100%;content:'';opacity:.7;background:url(//yastatic.net/s3/frontend/yandex-lego/serp-header/_/2HDAxgwB.svg) no-repeat top left;-webkit-transition:opacity .4s,-webkit-transform .4s;transition:transform .4s,opacity .4s;transition:transform .4s,opacity .4s,-webkit-transform .4s}.tools-lamp:hover{border-color:rgba(0,0,0,.3)}.tools-lamp:hover::before{opacity:1;-webkit-transform:translateY(-1px);transform:translateY(-1px)}.tools-lamp_side_left{left:0;border-right-style:solid;border-top-right-radius:3px}",
            js: "",
            hash: "left",
            i18n: {
                be: {},
                en: {i18n_tools__lamp_title: "Send an idea"},
                kk: {},
                ru: {i18n_tools__lamp_title: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0438\u0434\u0435\u044E"},
                tr: {},
                tt: {},
                uk: {},
                uz: {}
            },
            key: "left"
        }, staff: {
            html: function html(d) {
                var e = {"<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;", "&": "&amp;"}, a = function (b) {
                    return b ? (b + "").replace(/["'&<>]/g, function (b) {
                        return e[b]
                    }) : ""
                };
                return "<a class=\"tools-lamp tools-lamp_side_right tools-lamp_service_staff\" href=\"" + a(d.url || "") + "\" target=\"_blank\" title=\"" + (a(d.i18n_tools__lamp_title || Object(d.i18nDefault).i18n_tools__lamp_title) || "") + "\" style=\"z-index: " + (d.zIndex || 1e3 || "") + "\" data-goal=\"lamp\"></a>"
            },
            params: [],
            css: ".tools-lamp{position:fixed;bottom:0;display:block;width:36px;height:36px;border-width:1px;border-color:rgba(0,0,0,.2);border-top-style:solid;background-color:#fff;-webkit-transition:border-color .4s;transition:border-color .4s}.tools-lamp::before{position:relative;top:0;display:block;width:100%;height:100%;content:'';opacity:.7;background:url(//yastatic.net/s3/frontend/yandex-lego/serp-header/_/2HDAxgwB.svg) no-repeat top left;-webkit-transition:opacity .4s,-webkit-transform .4s;transition:transform .4s,opacity .4s;transition:transform .4s,opacity .4s,-webkit-transform .4s}.tools-lamp:hover{border-color:rgba(0,0,0,.3)}.tools-lamp:hover::before{opacity:1;-webkit-transform:translateY(-1px);transform:translateY(-1px)}.tools-lamp_side_right{right:0;border-left-style:solid;border-top-left-radius:3px}",
            js: "",
            hash: "staff",
            i18n: {
                be: {},
                en: {i18n_tools__lamp_title: "Send an idea"},
                kk: {},
                ru: {i18n_tools__lamp_title: "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0438\u0434\u0435\u044E"},
                tr: {},
                tt: {},
                uk: {},
                uz: {}
            },
            key: "staff"
        }
    }, stubbedFlags: [], getObjectHash: function getObjectHash(a) {
        return Object.entries(a).sort(function (c, d) {
            var e = _slicedToArray(c, 1), f = e[0], a = _slicedToArray(d, 1), g = a[0];
            return f > g ? 1 : -1
        }).map(function (a) {
            return a.join("_")
        }).join("-")
    }, getKeys: function (a, b) {
        var c = ["en", "et", "fi", "id", "lt", "lv", "pl", "tr", "uz"].includes(b) ? "en" : "ru";
        return {i18n: a[b], i18nDefault: a[c]}
    }
});