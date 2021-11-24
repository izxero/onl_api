/*
@license
Webix DocManager v.8.0.0
This software is covered by Webix Commercial License.
Usage without proper license is prohibited.
(c) XB Software Ltd.
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.docManager = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var filemanager = createCommonjsModule(function (module, exports) {
        (function (global, factory) {
             factory(exports) ;
        }(commonjsGlobal, (function (exports) {
            var extendStatics = function (d, b) {
                extendStatics = Object.setPrototypeOf ||
                    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                    function (d, b) { for (var p in b)
                        if (b.hasOwnProperty(p))
                            d[p] = b[p]; };
                return extendStatics(d, b);
            };
            function __extends(d, b) {
                extendStatics(d, b);
                function __() { this.constructor = d; }
                d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
            }
            var __assign = function () {
                __assign = Object.assign || function __assign(t) {
                    for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                            if (Object.prototype.hasOwnProperty.call(s, p))
                                t[p] = s[p];
                    }
                    return t;
                };
                return __assign.apply(this, arguments);
            };
            var NavigationBlocked = (function () {
                function NavigationBlocked() {
                }
                return NavigationBlocked;
            }());
            var JetBase = (function () {
                function JetBase(webix, config) {
                    this.webixJet = true;
                    this.webix = webix;
                    this._events = [];
                    this._subs = {};
                    this._data = {};
                    if (config && config.params)
                        webix.extend(this._data, config.params);
                }
                JetBase.prototype.getRoot = function () {
                    return this._root;
                };
                JetBase.prototype.destructor = function () {
                    this._detachEvents();
                    this._destroySubs();
                    this._events = this._container = this.app = this._parent = this._root = null;
                };
                JetBase.prototype.setParam = function (id, value, url) {
                    if (this._data[id] !== value) {
                        this._data[id] = value;
                        this._segment.update(id, value, 0);
                        if (url) {
                            return this.show(null);
                        }
                    }
                };
                JetBase.prototype.getParam = function (id, parent) {
                    var value = this._data[id];
                    if (typeof value !== "undefined" || !parent) {
                        return value;
                    }
                    var view = this.getParentView();
                    if (view) {
                        return view.getParam(id, parent);
                    }
                };
                JetBase.prototype.getUrl = function () {
                    return this._segment.suburl();
                };
                JetBase.prototype.getUrlString = function () {
                    return this._segment.toString();
                };
                JetBase.prototype.getParentView = function () {
                    return this._parent;
                };
                JetBase.prototype.$$ = function (id) {
                    if (typeof id === "string") {
                        var root_1 = this.getRoot();
                        return root_1.queryView((function (obj) {
                            return (obj.config.id === id || obj.config.localId === id) &&
                                (obj.$scope === root_1.$scope);
                        }), "self");
                    }
                    else {
                        return id;
                    }
                };
                JetBase.prototype.on = function (obj, name, code) {
                    var id = obj.attachEvent(name, code);
                    this._events.push({ obj: obj, id: id });
                    return id;
                };
                JetBase.prototype.contains = function (view) {
                    for (var key in this._subs) {
                        var kid = this._subs[key].view;
                        if (kid === view || kid.contains(view)) {
                            return true;
                        }
                    }
                    return false;
                };
                JetBase.prototype.getSubView = function (name) {
                    var sub = this.getSubViewInfo(name);
                    if (sub) {
                        return sub.subview.view;
                    }
                };
                JetBase.prototype.getSubViewInfo = function (name) {
                    var sub = this._subs[name || "default"];
                    if (sub) {
                        return { subview: sub, parent: this };
                    }
                    if (name === "_top") {
                        this._subs[name] = { url: "", id: null, popup: true };
                        return this.getSubViewInfo(name);
                    }
                    if (this._parent) {
                        return this._parent.getSubViewInfo(name);
                    }
                    return null;
                };
                JetBase.prototype._detachEvents = function () {
                    var events = this._events;
                    for (var i = events.length - 1; i >= 0; i--) {
                        events[i].obj.detachEvent(events[i].id);
                    }
                };
                JetBase.prototype._destroySubs = function () {
                    for (var key in this._subs) {
                        var subView = this._subs[key].view;
                        if (subView) {
                            subView.destructor();
                        }
                    }
                    this._subs = {};
                };
                JetBase.prototype._init_url_data = function () {
                    var url = this._segment.current();
                    this._data = {};
                    this.webix.extend(this._data, url.params, true);
                };
                JetBase.prototype._getDefaultSub = function () {
                    if (this._subs.default) {
                        return this._subs.default;
                    }
                    for (var key in this._subs) {
                        var sub = this._subs[key];
                        if (!sub.branch && sub.view && key !== "_top") {
                            var child = sub.view._getDefaultSub();
                            if (child) {
                                return child;
                            }
                        }
                    }
                };
                JetBase.prototype._routed_view = function () {
                    var parent = this.getParentView();
                    if (!parent) {
                        return true;
                    }
                    var sub = parent._getDefaultSub();
                    if (!sub && sub !== this) {
                        return false;
                    }
                    return parent._routed_view();
                };
                return JetBase;
            }());
            function parse(url) {
                if (url[0] === "/") {
                    url = url.substr(1);
                }
                var parts = url.split("/");
                var chunks = [];
                for (var i = 0; i < parts.length; i++) {
                    var test = parts[i];
                    var result = {};
                    var pos = test.indexOf(":");
                    if (pos === -1) {
                        pos = test.indexOf("?");
                    }
                    if (pos !== -1) {
                        var params = test.substr(pos + 1).split(/[\:\?\&]/g);
                        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                            var param = params_1[_i];
                            var dchunk = param.split("=");
                            result[dchunk[0]] = decodeURIComponent(dchunk[1]);
                        }
                    }
                    chunks[i] = {
                        page: (pos > -1 ? test.substr(0, pos) : test),
                        params: result,
                        isNew: true
                    };
                }
                return chunks;
            }
            function url2str(stack) {
                var url = [];
                for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
                    var chunk = stack_1[_i];
                    url.push("/" + chunk.page);
                    var params = obj2str(chunk.params);
                    if (params) {
                        url.push("?" + params);
                    }
                }
                return url.join("");
            }
            function obj2str(obj) {
                var str = [];
                for (var key in obj) {
                    if (typeof obj[key] === "object")
                        continue;
                    if (str.length) {
                        str.push("&");
                    }
                    str.push(key + "=" + encodeURIComponent(obj[key]));
                }
                return str.join("");
            }
            var Route = (function () {
                function Route(route, index) {
                    this._next = 1;
                    if (typeof route === "string") {
                        this.route = {
                            url: parse(route),
                            path: route
                        };
                    }
                    else {
                        this.route = route;
                    }
                    this.index = index;
                }
                Route.prototype.current = function () {
                    return this.route.url[this.index];
                };
                Route.prototype.next = function () {
                    return this.route.url[this.index + this._next];
                };
                Route.prototype.suburl = function () {
                    return this.route.url.slice(this.index);
                };
                Route.prototype.shift = function (params) {
                    var route = new Route(this.route, this.index + this._next);
                    route.setParams(route.route.url, params, route.index);
                    return route;
                };
                Route.prototype.setParams = function (url, params, index) {
                    if (params) {
                        var old = url[index].params;
                        for (var key in params)
                            old[key] = params[key];
                    }
                };
                Route.prototype.refresh = function () {
                    var url = this.route.url;
                    for (var i = this.index + 1; i < url.length; i++) {
                        url[i].isNew = true;
                    }
                };
                Route.prototype.toString = function () {
                    var str = url2str(this.suburl());
                    return str ? str.substr(1) : "";
                };
                Route.prototype._join = function (path, kids) {
                    var url = this.route.url;
                    if (path === null) {
                        return url;
                    }
                    var old = this.route.url;
                    var reset = true;
                    url = old.slice(0, this.index + (kids ? this._next : 0));
                    if (path) {
                        url = url.concat(parse(path));
                        for (var i = 0; i < url.length; i++) {
                            if (old[i]) {
                                url[i].view = old[i].view;
                            }
                            if (reset && old[i] && url[i].page === old[i].page) {
                                url[i].isNew = false;
                            }
                            else if (url[i].isNew) {
                                reset = false;
                            }
                        }
                    }
                    return url;
                };
                Route.prototype.append = function (path) {
                    var url = this._join(path, true);
                    this.route.path = url2str(url);
                    this.route.url = url;
                    return this.route.path;
                };
                Route.prototype.show = function (path, view, kids) {
                    var _this = this;
                    var url = this._join(path.url, kids);
                    this.setParams(url, path.params, this.index + (kids ? this._next : 0));
                    return new Promise(function (res, rej) {
                        var redirect = url2str(url);
                        var obj = {
                            url: url,
                            redirect: redirect,
                            confirm: Promise.resolve()
                        };
                        var app = view ? view.app : null;
                        if (app) {
                            var result = app.callEvent("app:guard", [obj.redirect, view, obj]);
                            if (!result) {
                                rej(new NavigationBlocked());
                                return;
                            }
                        }
                        obj.confirm.catch(function (err) { return rej(err); }).then(function () {
                            if (obj.redirect === null) {
                                rej(new NavigationBlocked());
                                return;
                            }
                            if (obj.redirect !== redirect) {
                                app.show(obj.redirect);
                                rej(new NavigationBlocked());
                                return;
                            }
                            _this.route.path = redirect;
                            _this.route.url = url;
                            res();
                        });
                    });
                };
                Route.prototype.size = function (n) {
                    this._next = n;
                };
                Route.prototype.split = function () {
                    var route = {
                        url: this.route.url.slice(this.index + 1),
                        path: ""
                    };
                    if (route.url.length) {
                        route.path = url2str(route.url);
                    }
                    return new Route(route, 0);
                };
                Route.prototype.update = function (name, value, index) {
                    var chunk = this.route.url[this.index + (index || 0)];
                    if (!chunk) {
                        this.route.url.push({ page: "", params: {} });
                        return this.update(name, value, index);
                    }
                    if (name === "") {
                        chunk.page = value;
                    }
                    else {
                        chunk.params[name] = value;
                    }
                    this.route.path = url2str(this.route.url);
                };
                return Route;
            }());
            var JetView = (function (_super) {
                __extends(JetView, _super);
                function JetView(app, config) {
                    var _this = _super.call(this, app.webix) || this;
                    _this.app = app;
                    _this._children = [];
                    return _this;
                }
                JetView.prototype.ui = function (ui, config) {
                    config = config || {};
                    var container = config.container || ui.container;
                    var jetview = this.app.createView(ui);
                    this._children.push(jetview);
                    jetview.render(container, this._segment, this);
                    if (typeof ui !== "object" || (ui instanceof JetBase)) {
                        return jetview;
                    }
                    else {
                        return jetview.getRoot();
                    }
                };
                JetView.prototype.show = function (path, config) {
                    config = config || {};
                    if (typeof path === "object") {
                        for (var key in path) {
                            this.setParam(key, path[key]);
                        }
                        path = null;
                    }
                    else {
                        if (path.substr(0, 1) === "/") {
                            return this.app.show(path, config);
                        }
                        if (path.indexOf("./") === 0) {
                            path = path.substr(2);
                        }
                        if (path.indexOf("../") === 0) {
                            var parent_1 = this.getParentView();
                            if (parent_1) {
                                return parent_1.show(path.substr(3), config);
                            }
                            else {
                                return this.app.show("/" + path.substr(3));
                            }
                        }
                        var sub = this.getSubViewInfo(config.target);
                        if (sub) {
                            if (sub.parent !== this) {
                                return sub.parent.show(path, config);
                            }
                            else if (config.target && config.target !== "default") {
                                return this._renderFrameLock(config.target, sub.subview, {
                                    url: path,
                                    params: config.params,
                                });
                            }
                        }
                        else {
                            if (path) {
                                return this.app.show("/" + path, config);
                            }
                        }
                    }
                    return this._show(this._segment, { url: path, params: config.params }, this);
                };
                JetView.prototype._show = function (segment, path, view) {
                    var _this = this;
                    return segment.show(path, view, true).then(function () {
                        _this._init_url_data();
                        return _this._urlChange();
                    }).then(function () {
                        if (segment.route.linkRouter) {
                            _this.app.getRouter().set(segment.route.path, { silent: true });
                            _this.app.callEvent("app:route", [segment.route.path]);
                        }
                    });
                };
                JetView.prototype.init = function (_$view, _$) {
                };
                JetView.prototype.ready = function (_$view, _$url) {
                };
                JetView.prototype.config = function () {
                    this.app.webix.message("View:Config is not implemented");
                };
                JetView.prototype.urlChange = function (_$view, _$url) {
                };
                JetView.prototype.destroy = function () {
                };
                JetView.prototype.destructor = function () {
                    this.destroy();
                    this._destroyKids();
                    if (this._root) {
                        this._root.destructor();
                        _super.prototype.destructor.call(this);
                    }
                };
                JetView.prototype.use = function (plugin, config) {
                    plugin(this.app, this, config);
                };
                JetView.prototype.refresh = function () {
                    var url = this.getUrl();
                    this.destroy();
                    this._destroyKids();
                    this._destroySubs();
                    this._detachEvents();
                    if (this._container.tagName) {
                        this._root.destructor();
                    }
                    this._segment.refresh();
                    return this._render(this._segment);
                };
                JetView.prototype.render = function (root, url, parent) {
                    var _this = this;
                    if (typeof url === "string") {
                        url = new Route(url, 0);
                    }
                    this._segment = url;
                    this._parent = parent;
                    this._init_url_data();
                    root = root || document.body;
                    var _container = (typeof root === "string") ? this.webix.toNode(root) : root;
                    if (this._container !== _container) {
                        this._container = _container;
                        return this._render(url);
                    }
                    else {
                        return this._urlChange().then(function () { return _this.getRoot(); });
                    }
                };
                JetView.prototype._render = function (url) {
                    var _this = this;
                    var config = this.config();
                    if (config.then) {
                        return config.then(function (cfg) { return _this._render_final(cfg, url); });
                    }
                    else {
                        return this._render_final(config, url);
                    }
                };
                JetView.prototype._render_final = function (config, url) {
                    var _this = this;
                    var slot = null;
                    var container = null;
                    var show = false;
                    if (!this._container.tagName) {
                        slot = this._container;
                        if (slot.popup) {
                            container = document.body;
                            show = true;
                        }
                        else {
                            container = this.webix.$$(slot.id);
                        }
                    }
                    else {
                        container = this._container;
                    }
                    if (!this.app || !container) {
                        return Promise.reject(null);
                    }
                    var response;
                    var current = this._segment.current();
                    var result = { ui: {} };
                    this.app.copyConfig(config, result.ui, this._subs);
                    this.app.callEvent("app:render", [this, url, result]);
                    result.ui.$scope = this;
                    if (!slot && current.isNew && current.view) {
                        current.view.destructor();
                    }
                    try {
                        if (slot && !show) {
                            var oldui = container;
                            var parent_2 = oldui.getParentView();
                            if (parent_2 && parent_2.name === "multiview" && !result.ui.id) {
                                result.ui.id = oldui.config.id;
                            }
                        }
                        this._root = this.app.webix.ui(result.ui, container);
                        var asWin = this._root;
                        if (show && asWin.setPosition && !asWin.isVisible()) {
                            asWin.show();
                        }
                        if (slot) {
                            if (slot.view && slot.view !== this && slot.view !== this.app) {
                                slot.view.destructor();
                            }
                            slot.id = this._root.config.id;
                            if (this.getParentView() || !this.app.app)
                                slot.view = this;
                            else {
                                slot.view = this.app;
                            }
                        }
                        if (current.isNew) {
                            current.view = this;
                            current.isNew = false;
                        }
                        response = Promise.resolve(this._init(this._root, url)).then(function () {
                            return _this._urlChange().then(function () {
                                _this._initUrl = null;
                                return _this.ready(_this._root, url.suburl());
                            });
                        });
                    }
                    catch (e) {
                        response = Promise.reject(e);
                    }
                    return response.catch(function (err) { return _this._initError(_this, err); });
                };
                JetView.prototype._init = function (view, url) {
                    return this.init(view, url.suburl());
                };
                JetView.prototype._urlChange = function () {
                    var _this = this;
                    this.app.callEvent("app:urlchange", [this, this._segment]);
                    var waits = [];
                    for (var key in this._subs) {
                        var frame = this._subs[key];
                        var wait = this._renderFrameLock(key, frame, null);
                        if (wait) {
                            waits.push(wait);
                        }
                    }
                    return Promise.all(waits).then(function () {
                        return _this.urlChange(_this._root, _this._segment.suburl());
                    });
                };
                JetView.prototype._renderFrameLock = function (key, frame, path) {
                    if (!frame.lock) {
                        var lock = this._renderFrame(key, frame, path);
                        if (lock) {
                            frame.lock = lock.then(function () { return frame.lock = null; }, function () { return frame.lock = null; });
                        }
                    }
                    return frame.lock;
                };
                JetView.prototype._renderFrame = function (key, frame, path) {
                    var _this = this;
                    if (key === "default") {
                        if (this._segment.next()) {
                            var params = path ? path.params : null;
                            if (frame.params) {
                                params = this.webix.extend(params || {}, frame.params);
                            }
                            return this._createSubView(frame, this._segment.shift(params));
                        }
                        else if (frame.view && frame.popup) {
                            frame.view.destructor();
                            frame.view = null;
                        }
                    }
                    if (path !== null) {
                        frame.url = path.url;
                        if (frame.params) {
                            path.params = this.webix.extend(path.params || {}, frame.params);
                        }
                    }
                    if (frame.route) {
                        if (path !== null) {
                            return frame.route.show(path, frame.view).then(function () {
                                return _this._createSubView(frame, frame.route);
                            });
                        }
                        if (frame.branch) {
                            return;
                        }
                    }
                    var view = frame.view;
                    if (!view && frame.url) {
                        if (typeof frame.url === "string") {
                            frame.route = new Route(frame.url, 0);
                            if (path)
                                frame.route.setParams(frame.route.route.url, path.params, 0);
                            if (frame.params)
                                frame.route.setParams(frame.route.route.url, frame.params, 0);
                            return this._createSubView(frame, frame.route);
                        }
                        else {
                            if (typeof frame.url === "function" && !(view instanceof frame.url)) {
                                view = new (this.app._override(frame.url))(this.app, "");
                            }
                            if (!view) {
                                view = frame.url;
                            }
                        }
                    }
                    if (view) {
                        return view.render(frame, (frame.route || this._segment), this);
                    }
                };
                JetView.prototype._initError = function (view, err) {
                    if (this.app) {
                        this.app.error("app:error:initview", [err, view]);
                    }
                    return true;
                };
                JetView.prototype._createSubView = function (sub, suburl) {
                    var _this = this;
                    return this.app.createFromURL(suburl.current()).then(function (view) {
                        return view.render(sub, suburl, _this);
                    });
                };
                JetView.prototype._destroyKids = function () {
                    var uis = this._children;
                    for (var i = uis.length - 1; i >= 0; i--) {
                        if (uis[i] && uis[i].destructor) {
                            uis[i].destructor();
                        }
                    }
                    this._children = [];
                };
                return JetView;
            }(JetBase));
            var JetViewRaw = (function (_super) {
                __extends(JetViewRaw, _super);
                function JetViewRaw(app, config) {
                    var _this = _super.call(this, app, config) || this;
                    _this._ui = config.ui;
                    return _this;
                }
                JetViewRaw.prototype.config = function () {
                    return this._ui;
                };
                return JetViewRaw;
            }(JetView));
            var SubRouter = (function () {
                function SubRouter(cb, config, app) {
                    this.path = "";
                    this.app = app;
                }
                SubRouter.prototype.set = function (path, config) {
                    this.path = path;
                    var a = this.app;
                    a.app.getRouter().set(a._segment.append(this.path), { silent: true });
                };
                SubRouter.prototype.get = function () {
                    return this.path;
                };
                return SubRouter;
            }());
            var _once = true;
            var JetAppBase = (function (_super) {
                __extends(JetAppBase, _super);
                function JetAppBase(config) {
                    var _this = this;
                    var webix = (config || {}).webix || window.webix;
                    config = webix.extend({
                        name: "App",
                        version: "1.0",
                        start: "/home"
                    }, config, true);
                    _this = _super.call(this, webix, config) || this;
                    _this.config = config;
                    _this.app = _this.config.app;
                    _this.ready = Promise.resolve();
                    _this._services = {};
                    _this.webix.extend(_this, _this.webix.EventSystem);
                    return _this;
                }
                JetAppBase.prototype.getUrl = function () {
                    return this._subSegment.suburl();
                };
                JetAppBase.prototype.getUrlString = function () {
                    return this._subSegment.toString();
                };
                JetAppBase.prototype.getService = function (name) {
                    var obj = this._services[name];
                    if (typeof obj === "function") {
                        obj = this._services[name] = obj(this);
                    }
                    return obj;
                };
                JetAppBase.prototype.setService = function (name, handler) {
                    this._services[name] = handler;
                };
                JetAppBase.prototype.destructor = function () {
                    this.getSubView().destructor();
                    _super.prototype.destructor.call(this);
                };
                JetAppBase.prototype.copyConfig = function (obj, target, config) {
                    if (obj instanceof JetBase ||
                        (typeof obj === "function" && obj.prototype instanceof JetBase)) {
                        obj = { $subview: obj };
                    }
                    if (typeof obj.$subview != "undefined") {
                        return this.addSubView(obj, target, config);
                    }
                    var isArray = obj instanceof Array;
                    target = target || (isArray ? [] : {});
                    for (var method in obj) {
                        var point = obj[method];
                        if (typeof point === "function" && point.prototype instanceof JetBase) {
                            point = { $subview: point };
                        }
                        if (point && typeof point === "object" &&
                            !(point instanceof this.webix.DataCollection) && !(point instanceof RegExp) && !(point instanceof Map)) {
                            if (point instanceof Date) {
                                target[method] = new Date(point);
                            }
                            else {
                                var copy = this.copyConfig(point, (point instanceof Array ? [] : {}), config);
                                if (copy !== null) {
                                    if (isArray)
                                        target.push(copy);
                                    else
                                        target[method] = copy;
                                }
                            }
                        }
                        else {
                            target[method] = point;
                        }
                    }
                    return target;
                };
                JetAppBase.prototype.getRouter = function () {
                    return this.$router;
                };
                JetAppBase.prototype.clickHandler = function (e, target) {
                    if (e) {
                        target = target || (e.target || e.srcElement);
                        if (target && target.getAttribute) {
                            var trigger_1 = target.getAttribute("trigger");
                            if (trigger_1) {
                                this._forView(target, function (view) { return view.app.trigger(trigger_1); });
                                e.cancelBubble = true;
                                return e.preventDefault();
                            }
                            var route_1 = target.getAttribute("route");
                            if (route_1) {
                                this._forView(target, function (view) { return view.show(route_1); });
                                e.cancelBubble = true;
                                return e.preventDefault();
                            }
                        }
                    }
                    var parent = target.parentNode;
                    if (parent) {
                        this.clickHandler(e, parent);
                    }
                };
                JetAppBase.prototype.getRoot = function () {
                    return this.getSubView().getRoot();
                };
                JetAppBase.prototype.refresh = function () {
                    var _this = this;
                    if (!this._subSegment) {
                        return Promise.resolve(null);
                    }
                    return this.getSubView().refresh().then(function (view) {
                        _this.callEvent("app:route", [_this.getUrl()]);
                        return view;
                    });
                };
                JetAppBase.prototype.loadView = function (url) {
                    var _this = this;
                    var views = this.config.views;
                    var result = null;
                    if (url === "") {
                        return Promise.resolve(this._loadError("", new Error("Webix Jet: Empty url segment")));
                    }
                    try {
                        if (views) {
                            if (typeof views === "function") {
                                result = views(url);
                            }
                            else {
                                result = views[url];
                            }
                            if (typeof result === "string") {
                                url = result;
                                result = null;
                            }
                        }
                        if (!result) {
                            if (url === "_hidden") {
                                result = { hidden: true };
                            }
                            else if (url === "_blank") {
                                result = {};
                            }
                            else {
                                url = url.replace(/\./g, "/");
                                result = this.require("jet-views", url);
                            }
                        }
                    }
                    catch (e) {
                        result = this._loadError(url, e);
                    }
                    if (!result.then) {
                        result = Promise.resolve(result);
                    }
                    result = result
                        .then(function (module) { return module.__esModule ? module.default : module; })
                        .catch(function (err) { return _this._loadError(url, err); });
                    return result;
                };
                JetAppBase.prototype._forView = function (target, handler) {
                    var view = this.webix.$$(target);
                    if (view) {
                        handler(view.$scope);
                    }
                };
                JetAppBase.prototype._loadViewDynamic = function (url) {
                    return null;
                };
                JetAppBase.prototype.createFromURL = function (chunk) {
                    var _this = this;
                    var view;
                    if (chunk.isNew || !chunk.view) {
                        view = this.loadView(chunk.page)
                            .then(function (ui) { return _this.createView(ui, name, chunk.params); });
                    }
                    else {
                        view = Promise.resolve(chunk.view);
                    }
                    return view;
                };
                JetAppBase.prototype._override = function (ui) {
                    var over = this.config.override;
                    if (over) {
                        var dv = void 0;
                        while (ui) {
                            dv = ui;
                            ui = over.get(ui);
                        }
                        return dv;
                    }
                    return ui;
                };
                JetAppBase.prototype.createView = function (ui, name, params) {
                    ui = this._override(ui);
                    var obj;
                    if (typeof ui === "function") {
                        if (ui.prototype instanceof JetAppBase) {
                            return new ui({ app: this, name: name, params: params, router: SubRouter });
                        }
                        else if (ui.prototype instanceof JetBase) {
                            return new ui(this, { name: name, params: params });
                        }
                        else {
                            ui = ui(this);
                        }
                    }
                    if (ui instanceof JetBase) {
                        obj = ui;
                    }
                    else {
                        obj = new JetViewRaw(this, { name: name, ui: ui });
                    }
                    return obj;
                };
                JetAppBase.prototype.show = function (url, config) {
                    if (url && this.app && url.indexOf("//") == 0)
                        return this.app.show(url.substr(1), config);
                    return this.render(this._container, url || this.config.start, config);
                };
                JetAppBase.prototype.trigger = function (name) {
                    var rest = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        rest[_i - 1] = arguments[_i];
                    }
                    this.apply(name, rest);
                };
                JetAppBase.prototype.apply = function (name, data) {
                    this.callEvent(name, data);
                };
                JetAppBase.prototype.action = function (name) {
                    return this.webix.bind(function () {
                        var rest = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            rest[_i] = arguments[_i];
                        }
                        this.apply(name, rest);
                    }, this);
                };
                JetAppBase.prototype.on = function (name, handler) {
                    this.attachEvent(name, handler);
                };
                JetAppBase.prototype.use = function (plugin, config) {
                    plugin(this, null, config);
                };
                JetAppBase.prototype.error = function (name, er) {
                    this.callEvent(name, er);
                    this.callEvent("app:error", er);
                    if (this.config.debug) {
                        for (var i = 0; i < er.length; i++) {
                            console.error(er[i]);
                            if (er[i] instanceof Error) {
                                var text = er[i].message;
                                if (text.indexOf("Module build failed") === 0) {
                                    text = text.replace(/\x1b\[[0-9;]*m/g, "");
                                    document.body.innerHTML = "<pre style='font-size:16px; background-color: #ec6873; color: #000; padding:10px;'>" + text + "</pre>";
                                }
                                else {
                                    text += "<br><br>Check console for more details";
                                    this.webix.message({ type: "error", text: text, expire: -1 });
                                }
                            }
                        }
                        debugger;
                    }
                };
                JetAppBase.prototype.render = function (root, url, config) {
                    var _this = this;
                    this._container = (typeof root === "string") ?
                        this.webix.toNode(root) :
                        (root || document.body);
                    var firstInit = !this.$router;
                    var path = null;
                    if (firstInit) {
                        if (_once && "tagName" in this._container) {
                            this.webix.event(document.body, "click", function (e) { return _this.clickHandler(e); });
                            _once = false;
                        }
                        if (typeof url === "string") {
                            url = new Route(url, 0);
                        }
                        this._subSegment = this._first_start(url);
                        this._subSegment.route.linkRouter = true;
                    }
                    else {
                        if (typeof url === "string") {
                            path = url;
                        }
                        else {
                            if (this.app) {
                                path = url.split().route.path || this.config.start;
                            }
                            else {
                                path = url.toString();
                            }
                        }
                    }
                    var params = config ? config.params : this.config.params || null;
                    var top = this.getSubView();
                    var segment = this._subSegment;
                    var ready = segment
                        .show({ url: path, params: params }, top)
                        .then(function () { return _this.createFromURL(segment.current()); })
                        .then(function (view) { return view.render(root, segment); })
                        .then(function (base) {
                        _this.$router.set(segment.route.path, { silent: true });
                        _this.callEvent("app:route", [_this.getUrl()]);
                        return base;
                    });
                    this.ready = this.ready.then(function () { return ready; });
                    return ready;
                };
                JetAppBase.prototype.getSubView = function () {
                    if (this._subSegment) {
                        var view = this._subSegment.current().view;
                        if (view)
                            return view;
                    }
                    return new JetView(this, {});
                };
                JetAppBase.prototype.require = function (type, url) { return null; };
                JetAppBase.prototype._first_start = function (route) {
                    var _this = this;
                    this._segment = route;
                    var cb = function (a) {
                        return setTimeout(function () {
                            _this.show(a).catch(function (e) {
                                if (!(e instanceof NavigationBlocked))
                                    throw e;
                            });
                        }, 1);
                    };
                    this.$router = new (this.config.router)(cb, this.config, this);
                    if (this._container === document.body && this.config.animation !== false) {
                        var node_1 = this._container;
                        this.webix.html.addCss(node_1, "webixappstart");
                        setTimeout(function () {
                            _this.webix.html.removeCss(node_1, "webixappstart");
                            _this.webix.html.addCss(node_1, "webixapp");
                        }, 10);
                    }
                    if (!route) {
                        var urlString = this.$router.get();
                        if (!urlString) {
                            urlString = this.config.start;
                            this.$router.set(urlString, { silent: true });
                        }
                        route = new Route(urlString, 0);
                    }
                    else if (this.app) {
                        var now = route.current().view;
                        route.current().view = this;
                        if (route.next()) {
                            route.refresh();
                            route = route.split();
                        }
                        else {
                            route = new Route(this.config.start, 0);
                        }
                        route.current().view = now;
                    }
                    return route;
                };
                JetAppBase.prototype._loadError = function (url, err) {
                    this.error("app:error:resolve", [err, url]);
                    return { template: " " };
                };
                JetAppBase.prototype.addSubView = function (obj, target, config) {
                    var url = obj.$subview !== true ? obj.$subview : null;
                    var name = obj.name || (url ? this.webix.uid() : "default");
                    target.id = obj.id || "s" + this.webix.uid();
                    var view = config[name] = {
                        id: target.id,
                        url: url,
                        branch: obj.branch,
                        popup: obj.popup,
                        params: obj.params
                    };
                    return view.popup ? null : target;
                };
                return JetAppBase;
            }(JetBase));
            var HashRouter = (function () {
                function HashRouter(cb, config) {
                    var _this = this;
                    this.config = config || {};
                    this._detectPrefix();
                    this.cb = cb;
                    window.onpopstate = function () { return _this.cb(_this.get()); };
                }
                HashRouter.prototype.set = function (path, config) {
                    var _this = this;
                    if (this.config.routes) {
                        var compare = path.split("?", 2);
                        for (var key in this.config.routes) {
                            if (this.config.routes[key] === compare[0]) {
                                path = key + (compare.length > 1 ? "?" + compare[1] : "");
                                break;
                            }
                        }
                    }
                    if (this.get() !== path) {
                        window.history.pushState(null, null, this.prefix + this.sufix + path);
                    }
                    if (!config || !config.silent) {
                        setTimeout(function () { return _this.cb(path); }, 1);
                    }
                };
                HashRouter.prototype.get = function () {
                    var path = this._getRaw().replace(this.prefix, "").replace(this.sufix, "");
                    path = (path !== "/" && path !== "#") ? path : "";
                    if (this.config.routes) {
                        var compare = path.split("?", 2);
                        var key = this.config.routes[compare[0]];
                        if (key) {
                            path = key + (compare.length > 1 ? "?" + compare[1] : "");
                        }
                    }
                    return path;
                };
                HashRouter.prototype._detectPrefix = function () {
                    var sufix = this.config.routerPrefix;
                    this.sufix = "#" + ((typeof sufix === "undefined") ? "!" : sufix);
                    this.prefix = document.location.href.split("#", 2)[0];
                };
                HashRouter.prototype._getRaw = function () {
                    return document.location.href;
                };
                return HashRouter;
            }());
            var isPatched = false;
            function patch(w) {
                if (isPatched || !w) {
                    return;
                }
                isPatched = true;
                var win = window;
                if (!win.Promise) {
                    win.Promise = w.promise;
                }
                var version = w.version.split(".");
                if (version[0] * 10 + version[1] * 1 < 53) {
                    w.ui.freeze = function (handler) {
                        var res = handler();
                        if (res && res.then) {
                            res.then(function (some) {
                                w.ui.$freeze = false;
                                w.ui.resize();
                                return some;
                            });
                        }
                        else {
                            w.ui.$freeze = false;
                            w.ui.resize();
                        }
                        return res;
                    };
                }
                var baseAdd = w.ui.baselayout.prototype.addView;
                var baseRemove = w.ui.baselayout.prototype.removeView;
                var config = {
                    addView: function (view, index) {
                        if (this.$scope && this.$scope.webixJet && !view.queryView) {
                            var jview_1 = this.$scope;
                            var subs_1 = {};
                            view = jview_1.app.copyConfig(view, {}, subs_1);
                            baseAdd.apply(this, [view, index]);
                            var _loop_1 = function (key) {
                                jview_1._renderFrame(key, subs_1[key], null).then(function () {
                                    jview_1._subs[key] = subs_1[key];
                                });
                            };
                            for (var key in subs_1) {
                                _loop_1(key);
                            }
                            return view.id;
                        }
                        else {
                            return baseAdd.apply(this, arguments);
                        }
                    },
                    removeView: function () {
                        baseRemove.apply(this, arguments);
                        if (this.$scope && this.$scope.webixJet) {
                            var subs = this.$scope._subs;
                            for (var key in subs) {
                                var test = subs[key];
                                if (!w.$$(test.id)) {
                                    test.view.destructor();
                                    delete subs[key];
                                }
                            }
                        }
                    }
                };
                w.extend(w.ui.layout.prototype, config, true);
                w.extend(w.ui.baselayout.prototype, config, true);
                w.protoUI({
                    name: "jetapp",
                    $init: function (cfg) {
                        this.$app = new this.app(cfg);
                        var id = w.uid().toString();
                        cfg.body = { id: id };
                        this.$ready.push(function () {
                            this.callEvent("onInit", [this.$app]);
                            this.$app.render({ id: id });
                        });
                    }
                }, w.ui.proxy, w.EventSystem);
            }
            var JetApp = (function (_super) {
                __extends(JetApp, _super);
                function JetApp(config) {
                    var _this = this;
                    config.router = config.router || HashRouter;
                    _this = _super.call(this, config) || this;
                    patch(_this.webix);
                    return _this;
                }
                JetApp.prototype.require = function (type, url) {
                    return commonjsRequire();
                };
                return JetApp;
            }(JetAppBase));
            var UrlRouter = (function (_super) {
                __extends(UrlRouter, _super);
                function UrlRouter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                UrlRouter.prototype._detectPrefix = function () {
                    this.prefix = "";
                    this.sufix = this.config.routerPrefix || "";
                };
                UrlRouter.prototype._getRaw = function () {
                    return document.location.pathname + (document.location.search || "");
                };
                return UrlRouter;
            }(HashRouter));
            var EmptyRouter = (function () {
                function EmptyRouter(cb, _$config) {
                    this.path = "";
                    this.cb = cb;
                }
                EmptyRouter.prototype.set = function (path, config) {
                    var _this = this;
                    this.path = path;
                    if (!config || !config.silent) {
                        setTimeout(function () { return _this.cb(path); }, 1);
                    }
                };
                EmptyRouter.prototype.get = function () {
                    return this.path;
                };
                return EmptyRouter;
            }());
            function UnloadGuard(app, view, config) {
                view.on(app, "app:guard", function (_$url, point, promise) {
                    if (point === view || point.contains(view)) {
                        var res_1 = config();
                        if (res_1 === false) {
                            promise.confirm = Promise.reject(new NavigationBlocked());
                        }
                        else {
                            promise.confirm = promise.confirm.then(function () { return res_1; });
                        }
                    }
                });
            }
            function has(store, key) {
                return Object.prototype.hasOwnProperty.call(store, key);
            }
            function forEach(obj, handler, context) {
                for (var key in obj) {
                    if (has(obj, key)) {
                        handler.call((context || obj), obj[key], key, obj);
                    }
                }
            }
            function trim(str) {
                return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
            }
            function warn(message) {
                message = 'Warning: ' + message;
                if (typeof console !== 'undefined') {
                    console.error(message);
                }
                try {
                    throw new Error(message);
                }
                catch (x) { }
            }
            var replace = String.prototype.replace;
            var split = String.prototype.split;
            var delimiter = '||||';
            var russianPluralGroups = function (n) {
                var end = n % 10;
                if (n !== 11 && end === 1) {
                    return 0;
                }
                if (2 <= end && end <= 4 && !(n >= 12 && n <= 14)) {
                    return 1;
                }
                return 2;
            };
            var pluralTypes = {
                arabic: function (n) {
                    if (n < 3) {
                        return n;
                    }
                    var lastTwo = n % 100;
                    if (lastTwo >= 3 && lastTwo <= 10)
                        return 3;
                    return lastTwo >= 11 ? 4 : 5;
                },
                bosnian_serbian: russianPluralGroups,
                chinese: function () { return 0; },
                croatian: russianPluralGroups,
                french: function (n) { return n > 1 ? 1 : 0; },
                german: function (n) { return n !== 1 ? 1 : 0; },
                russian: russianPluralGroups,
                lithuanian: function (n) {
                    if (n % 10 === 1 && n % 100 !== 11) {
                        return 0;
                    }
                    return n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 11 || n % 100 > 19) ? 1 : 2;
                },
                czech: function (n) {
                    if (n === 1) {
                        return 0;
                    }
                    return (n >= 2 && n <= 4) ? 1 : 2;
                },
                polish: function (n) {
                    if (n === 1) {
                        return 0;
                    }
                    var end = n % 10;
                    return 2 <= end && end <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
                },
                icelandic: function (n) { return (n % 10 !== 1 || n % 100 === 11) ? 1 : 0; },
                slovenian: function (n) {
                    var lastTwo = n % 100;
                    if (lastTwo === 1) {
                        return 0;
                    }
                    if (lastTwo === 2) {
                        return 1;
                    }
                    if (lastTwo === 3 || lastTwo === 4) {
                        return 2;
                    }
                    return 3;
                }
            };
            var pluralTypeToLanguages = {
                arabic: ['ar'],
                bosnian_serbian: ['bs-Latn-BA', 'bs-Cyrl-BA', 'srl-RS', 'sr-RS'],
                chinese: ['id', 'id-ID', 'ja', 'ko', 'ko-KR', 'lo', 'ms', 'th', 'th-TH', 'zh'],
                croatian: ['hr', 'hr-HR'],
                german: ['fa', 'da', 'de', 'en', 'es', 'fi', 'el', 'he', 'hi-IN', 'hu', 'hu-HU', 'it', 'nl', 'no', 'pt', 'sv', 'tr'],
                french: ['fr', 'tl', 'pt-br'],
                russian: ['ru', 'ru-RU'],
                lithuanian: ['lt'],
                czech: ['cs', 'cs-CZ', 'sk'],
                polish: ['pl'],
                icelandic: ['is'],
                slovenian: ['sl-SL']
            };
            function langToTypeMap(mapping) {
                var ret = {};
                forEach(mapping, function (langs, type) {
                    forEach(langs, function (lang) {
                        ret[lang] = type;
                    });
                });
                return ret;
            }
            function pluralTypeName(locale) {
                var langToPluralType = langToTypeMap(pluralTypeToLanguages);
                return langToPluralType[locale]
                    || langToPluralType[split.call(locale, /-/, 1)[0]]
                    || langToPluralType.en;
            }
            function pluralTypeIndex(locale, count) {
                return pluralTypes[pluralTypeName(locale)](count);
            }
            function escape(token) {
                return token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
            function constructTokenRegex(opts) {
                var prefix = (opts && opts.prefix) || '%{';
                var suffix = (opts && opts.suffix) || '}';
                if (prefix === delimiter || suffix === delimiter) {
                    throw new RangeError('"' + delimiter + '" token is reserved for pluralization');
                }
                return new RegExp(escape(prefix) + '(.*?)' + escape(suffix), 'g');
            }
            var dollarRegex = /\$/g;
            var dollarBillsYall = '$$';
            var defaultTokenRegex = /%\{(.*?)\}/g;
            function transformPhrase(phrase, substitutions, locale, tokenRegex) {
                if (typeof phrase !== 'string') {
                    throw new TypeError('Polyglot.transformPhrase expects argument #1 to be string');
                }
                if (substitutions == null) {
                    return phrase;
                }
                var result = phrase;
                var interpolationRegex = tokenRegex || defaultTokenRegex;
                var options = typeof substitutions === 'number' ? { smart_count: substitutions } : substitutions;
                if (options.smart_count != null && result) {
                    var texts = split.call(result, delimiter);
                    result = trim(texts[pluralTypeIndex(locale || 'en', options.smart_count)] || texts[0]);
                }
                result = replace.call(result, interpolationRegex, function (expression, argument) {
                    if (!has(options, argument) || options[argument] == null) {
                        return expression;
                    }
                    return replace.call(options[argument], dollarRegex, dollarBillsYall);
                });
                return result;
            }
            function Polyglot(options) {
                var opts = options || {};
                this.phrases = {};
                this.extend(opts.phrases || {});
                this.currentLocale = opts.locale || 'en';
                var allowMissing = opts.allowMissing ? transformPhrase : null;
                this.onMissingKey = typeof opts.onMissingKey === 'function' ? opts.onMissingKey : allowMissing;
                this.warn = opts.warn || warn;
                this.tokenRegex = constructTokenRegex(opts.interpolation);
            }
            Polyglot.prototype.locale = function (newLocale) {
                if (newLocale)
                    this.currentLocale = newLocale;
                return this.currentLocale;
            };
            Polyglot.prototype.extend = function (morePhrases, prefix) {
                forEach(morePhrases, function (phrase, key) {
                    var prefixedKey = prefix ? prefix + '.' + key : key;
                    if (typeof phrase === 'object') {
                        this.extend(phrase, prefixedKey);
                    }
                    else {
                        this.phrases[prefixedKey] = phrase;
                    }
                }, this);
            };
            Polyglot.prototype.unset = function (morePhrases, prefix) {
                if (typeof morePhrases === 'string') {
                    delete this.phrases[morePhrases];
                }
                else {
                    forEach(morePhrases, function (phrase, key) {
                        var prefixedKey = prefix ? prefix + '.' + key : key;
                        if (typeof phrase === 'object') {
                            this.unset(phrase, prefixedKey);
                        }
                        else {
                            delete this.phrases[prefixedKey];
                        }
                    }, this);
                }
            };
            Polyglot.prototype.clear = function () {
                this.phrases = {};
            };
            Polyglot.prototype.replace = function (newPhrases) {
                this.clear();
                this.extend(newPhrases);
            };
            Polyglot.prototype.t = function (key, options) {
                var phrase, result;
                var opts = options == null ? {} : options;
                if (typeof this.phrases[key] === 'string') {
                    phrase = this.phrases[key];
                }
                else if (typeof opts._ === 'string') {
                    phrase = opts._;
                }
                else if (this.onMissingKey) {
                    var onMissingKey = this.onMissingKey;
                    result = onMissingKey(key, opts, this.currentLocale, this.tokenRegex);
                }
                else {
                    this.warn('Missing translation for key: "' + key + '"');
                    result = key;
                }
                if (typeof phrase === 'string') {
                    result = transformPhrase(phrase, opts, this.currentLocale, this.tokenRegex);
                }
                return result;
            };
            Polyglot.prototype.has = function (key) {
                return has(this.phrases, key);
            };
            Polyglot.transformPhrase = function transform(phrase, substitutions, locale) {
                return transformPhrase(phrase, substitutions, locale);
            };
            var webixPolyglot = Polyglot;
            function Locale(app, _view, config) {
                config = config || {};
                var storage = config.storage;
                var lang = storage ? (storage.get("lang") || "en") : (config.lang || "en");
                function setLangData(name, data, silent) {
                    if (data.__esModule) {
                        data = data.default;
                    }
                    var pconfig = { phrases: data };
                    if (config.polyglot) {
                        app.webix.extend(pconfig, config.polyglot);
                    }
                    var poly = service.polyglot = new webixPolyglot(pconfig);
                    poly.locale(name);
                    service._ = app.webix.bind(poly.t, poly);
                    lang = name;
                    if (storage) {
                        storage.put("lang", lang);
                    }
                    if (config.webix) {
                        var locName = config.webix[name];
                        if (locName) {
                            app.webix.i18n.setLocale(locName);
                        }
                    }
                    if (!silent) {
                        return app.refresh();
                    }
                    return Promise.resolve();
                }
                function getLang() { return lang; }
                function setLang(name, silent) {
                    if (config.path === false) {
                        return;
                    }
                    var path = (config.path ? config.path + "/" : "") + name;
                    var data = app.require("jet-locales", path);
                    setLangData(name, data, silent);
                }
                var service = {
                    getLang: getLang, setLang: setLang, setLangData: setLangData, _: null, polyglot: null
                };
                app.setService("locale", service);
                setLang(lang, true);
            }
            function show(view, config, value) {
                var _a;
                if (config.urls) {
                    value = config.urls[value] || value;
                }
                else if (config.param) {
                    value = (_a = {}, _a[config.param] = value, _a);
                }
                view.show(value);
            }
            function Menu(app, view, config) {
                var frame = view.getSubViewInfo().parent;
                var ui = view.$$(config.id || config);
                var silent = false;
                ui.attachEvent("onchange", function () {
                    if (!silent) {
                        show(frame, config, this.getValue());
                    }
                });
                ui.attachEvent("onafterselect", function () {
                    if (!silent) {
                        var id = null;
                        if (ui.setValue) {
                            id = this.getValue();
                        }
                        else if (ui.getSelectedId) {
                            id = ui.getSelectedId();
                        }
                        show(frame, config, id);
                    }
                });
                view.on(app, "app:route", function () {
                    var name = "";
                    if (config.param) {
                        name = view.getParam(config.param, true);
                    }
                    else {
                        var segment = frame.getUrl()[1];
                        if (segment) {
                            name = segment.page;
                        }
                    }
                    if (name) {
                        silent = true;
                        if (ui.setValue && ui.getValue() !== name) {
                            ui.setValue(name);
                        }
                        else if (ui.select && ui.exists(name) && ui.getSelectedId() !== name) {
                            ui.select(name);
                        }
                        silent = false;
                    }
                });
            }
            var baseicons = {
                good: "check",
                error: "warning",
                saving: "refresh fa-spin"
            };
            var basetext = {
                good: "Ok",
                error: "Error",
                saving: "Connecting..."
            };
            function Status(app, view, config) {
                var status = "good";
                var count = 0;
                var iserror = false;
                var expireDelay = config.expire;
                if (!expireDelay && expireDelay !== false) {
                    expireDelay = 2000;
                }
                var texts = config.texts || basetext;
                var icons = config.icons || baseicons;
                if (typeof config === "string") {
                    config = { target: config };
                }
                function refresh(content) {
                    var area = view.$$(config.target);
                    if (area) {
                        if (!content) {
                            content = "<div class='status_" +
                                status +
                                "'><span class='webix_icon fa-" +
                                icons[status] + "'></span> " + texts[status] + "</div>";
                        }
                        area.setHTML(content);
                    }
                }
                function success() {
                    count--;
                    setStatus("good");
                }
                function fail(err) {
                    count--;
                    setStatus("error", err);
                }
                function start(promise) {
                    count++;
                    setStatus("saving");
                    if (promise && promise.then) {
                        promise.then(success, fail);
                    }
                }
                function getStatus() {
                    return status;
                }
                function hideStatus() {
                    if (count === 0) {
                        refresh(" ");
                    }
                }
                function setStatus(mode, err) {
                    if (count < 0) {
                        count = 0;
                    }
                    if (mode === "saving") {
                        status = "saving";
                        refresh();
                    }
                    else {
                        iserror = (mode === "error");
                        if (count === 0) {
                            status = iserror ? "error" : "good";
                            if (iserror) {
                                app.error("app:error:server", [err.responseText || err]);
                            }
                            else {
                                if (expireDelay) {
                                    setTimeout(hideStatus, expireDelay);
                                }
                            }
                            refresh();
                        }
                    }
                }
                function track(data) {
                    var dp = app.webix.dp(data);
                    if (dp) {
                        view.on(dp, "onAfterDataSend", start);
                        view.on(dp, "onAfterSaveError", function (_id, _obj, response) { return fail(response); });
                        view.on(dp, "onAfterSave", success);
                    }
                }
                app.setService("status", {
                    getStatus: getStatus,
                    setStatus: setStatus,
                    track: track
                });
                if (config.remote) {
                    view.on(app.webix, "onRemoteCall", start);
                }
                if (config.ajax) {
                    view.on(app.webix, "onBeforeAjax", function (_mode, _url, _data, _request, _headers, _files, promise) {
                        start(promise);
                    });
                }
                if (config.data) {
                    track(config.data);
                }
            }
            function Theme(app, _view, config) {
                config = config || {};
                var storage = config.storage;
                var theme = storage ?
                    (storage.get("theme") || "flat-default")
                    :
                        (config.theme || "flat-default");
                var service = {
                    getTheme: function () { return theme; },
                    setTheme: function (name, silent) {
                        var parts = name.split("-");
                        var links = document.getElementsByTagName("link");
                        for (var i = 0; i < links.length; i++) {
                            var lname = links[i].getAttribute("title");
                            if (lname) {
                                if (lname === name || lname === parts[0]) {
                                    links[i].disabled = false;
                                }
                                else {
                                    links[i].disabled = true;
                                }
                            }
                        }
                        app.webix.skin.set(parts[0]);
                        app.webix.html.removeCss(document.body, "theme-" + theme);
                        app.webix.html.addCss(document.body, "theme-" + name);
                        theme = name;
                        if (storage) {
                            storage.put("theme", name);
                        }
                        if (!silent) {
                            app.refresh();
                        }
                    }
                };
                app.setService("theme", service);
                service.setTheme(theme, true);
            }
            function copyParams(data, url, route) {
                for (var i = 0; i < route.length; i++) {
                    data[route[i]] = url[i + 1] ? url[i + 1].page : "";
                }
            }
            function UrlParam(app, view, config) {
                var route = config.route || config;
                var data = {};
                view.on(app, "app:urlchange", function (subview, segment) {
                    if (view === subview) {
                        copyParams(data, segment.suburl(), route);
                        segment.size(route.length + 1);
                    }
                });
                var os = view.setParam;
                var og = view.getParam;
                view.setParam = function (name, value, show) {
                    var index = route.indexOf(name);
                    if (index >= 0) {
                        data[name] = value;
                        this._segment.update("", value, index + 1);
                        if (show) {
                            return view.show(null);
                        }
                    }
                    else {
                        return os.call(this, name, value, show);
                    }
                };
                view.getParam = function (key, mode) {
                    var val = data[key];
                    if (typeof val !== "undefined") {
                        return val;
                    }
                    return og.call(this, key, mode);
                };
                copyParams(data, view.getUrl(), route);
            }
            function User(app, _view, config) {
                config = config || {};
                var login = config.login || "/login";
                var logout = config.logout || "/logout";
                var afterLogin = config.afterLogin || app.config.start;
                var afterLogout = config.afterLogout || "/login";
                var ping = config.ping || 5 * 60 * 1000;
                var model = config.model;
                var user = config.user;
                var service = {
                    getUser: function () {
                        return user;
                    },
                    getStatus: function (server) {
                        if (!server) {
                            return user !== null;
                        }
                        return model.status().catch(function () { return null; }).then(function (data) {
                            user = data;
                        });
                    },
                    login: function (name, pass) {
                        return model.login(name, pass).then(function (data) {
                            user = data;
                            if (!data) {
                                throw new Error("Access denied");
                            }
                            app.callEvent("app:user:login", [user]);
                            app.show(afterLogin);
                        });
                    },
                    logout: function () {
                        user = null;
                        return model.logout().then(function (res) {
                            app.callEvent("app:user:logout", []);
                            return res;
                        });
                    }
                };
                function canNavigate(url, obj) {
                    if (url === logout) {
                        service.logout();
                        obj.redirect = afterLogout;
                    }
                    else if (url !== login && !service.getStatus()) {
                        obj.redirect = login;
                    }
                }
                app.setService("user", service);
                app.attachEvent("app:guard", function (url, _$root, obj) {
                    if (config.public && config.public(url)) {
                        return true;
                    }
                    if (typeof user === "undefined") {
                        obj.confirm = service.getStatus(true).then(function () { return canNavigate(url, obj); });
                    }
                    return canNavigate(url, obj);
                });
                if (ping) {
                    setInterval(function () { return service.getStatus(true); }, ping);
                }
            }
            var webix$1 = window.webix;
            if (webix$1) {
                patch(webix$1);
            }
            var plugins = {
                UnloadGuard: UnloadGuard, Locale: Locale, Menu: Menu, Theme: Theme, User: User, Status: Status, UrlParam: UrlParam
            };
            var w = window;
            if (!w.Promise) {
                w.Promise = w.webix.promise;
            }
            var index = 1;
            function uid() {
                return index++;
            }
            var empty = undefined;
            var context = null;
            function link(source, target, key) {
                Object.defineProperty(target, key, {
                    get: function () { return source[key]; },
                    set: function (value) { return (source[key] = value); },
                });
            }
            function createState(data, config) {
                config = config || {};
                var handlers = {};
                var out = {};
                var observe = function (mask, handler) {
                    var key = uid();
                    handlers[key] = { mask: mask, handler: handler };
                    if (mask === "*")
                        handler(out, empty, mask);
                    else
                        handler(out[mask], empty, mask);
                    return key;
                };
                var observeEnd = function (id) {
                    delete handlers[id];
                };
                var queue = [];
                var waitInQueue = false;
                var batch = function (code) {
                    if (typeof code !== "function") {
                        var values_1 = code;
                        code = function () {
                            for (var key in values_1)
                                out[key] = values_1[key];
                        };
                    }
                    waitInQueue = true;
                    code(out);
                    waitInQueue = false;
                    while (queue.length) {
                        var obj = queue.shift();
                        notify.apply(this, obj);
                    }
                };
                var notify = function (key, old, value, meta) {
                    if (waitInQueue) {
                        queue.push([key, old, value, meta]);
                        return;
                    }
                    var list = Object.keys(handlers);
                    for (var i = 0; i < list.length; i++) {
                        var obj = handlers[list[i]];
                        if (!obj)
                            continue;
                        if (obj.mask === "*" || obj.mask === key) {
                            obj.handler(value, old, key, meta);
                        }
                    }
                };
                for (var key2 in data) {
                    if (data.hasOwnProperty(key2)) {
                        var test = data[key2];
                        if (config.nested && typeof test === "object" && test) {
                            out[key2] = createState(test, config);
                        }
                        else {
                            reactive(out, test, key2, notify);
                        }
                    }
                }
                Object.defineProperty(out, "$changes", {
                    value: {
                        attachEvent: observe,
                        detachEvent: observeEnd,
                    },
                    enumerable: false,
                    configurable: false,
                });
                Object.defineProperty(out, "$observe", {
                    value: observe,
                    enumerable: false,
                    configurable: false,
                });
                Object.defineProperty(out, "$batch", {
                    value: batch,
                    enumerable: false,
                    configurable: false,
                });
                return out;
            }
            function reactive(obj, val, key, notify) {
                Object.defineProperty(obj, key, {
                    get: function () {
                        return val;
                    },
                    set: function (value) {
                        var changed = false;
                        if (val === null || value === null) {
                            changed = val !== value;
                        }
                        else {
                            changed = val.valueOf() != value.valueOf();
                        }
                        if (changed) {
                            var old = val;
                            val = value;
                            notify(key, old, value, context);
                        }
                    },
                    enumerable: true,
                    configurable: false,
                });
            }
            function handler(view) {
                return {
                    attachEvent: function (key, handler) {
                        webix.UIManager.addHotKey(key, handler, view);
                        return { key: key, handler: handler };
                    },
                    detachEvent: function (_a) {
                        var key = _a.key, handler = _a.handler;
                        return webix.UIManager.removeHotKey(key, handler, view);
                    },
                };
            }
            var folderIcon = "<span class='webix_icon wxi-folder'></span>";
            var backIcon = "<span class='webix_icon wxi-angle-double-left webix_fmanager_back_icon'></span>";
            var folderCardIcon = "<span class='webix_icon wxi-folder webix_fmanager_folder_icon'></span>";
            var menuIcon = "<span class='webix_icon wxi-dots webix_fmanager_menu_icon'></span>";
            var gridMode = "<span class='webix_fmanager_icon fmi-view-list webix_fmanager_mode_icon'></span>";
            var cardMode = "<span class='webix_fmanager_icon fmi-view-grid webix_fmanager_mode_icon'></span>";
            var doubleMode = "<span class='webix_fmanager_icon fmi-view-array webix_fmanager_mode_icon'></span>";
            var FOLDER = 0x01;
            var MANY = 0x02;
            var TEXT = 0x04;
            var VIEW = 0x08;
            var FULL = 0x10;
            var TREE = 0x20;
            var SEARCH = 0x40;
            var MenuBodyView = (function (_super) {
                __extends(MenuBodyView, _super);
                function MenuBodyView(app, name, config) {
                    var _this = _super.call(this, app, name) || this;
                    _this.compact = !!config.compact;
                    _this.tree = !!config.tree;
                    return _this;
                }
                MenuBodyView.prototype.config = function () {
                    var _this = this;
                    var _ = this.app.getService("locale")._;
                    var options = [
                        {
                            id: "download",
                            value: _("Download"),
                            icon: "wxi-download",
                            show: TREE,
                            hotkey: "Ctrl+D",
                        },
                        {
                            $template: "Separator",
                            show: TREE,
                        },
                        {
                            id: "toggle-preview",
                            value: _("Preview"),
                            icon: "wxi-eye",
                            show: FULL | FOLDER,
                        },
                        {
                            id: "locate",
                            value: _("Open item location"),
                            icon: "wxi-folder",
                            hotkey: "Ctrl+Alt+O",
                            show: FOLDER | SEARCH,
                        },
                        {
                            id: "open",
                            value: _("Open"),
                            icon: "wxi-folder-open",
                            hotkey: "Ctrl+O",
                            show: VIEW,
                        },
                        {
                            $template: "Separator",
                            show: VIEW,
                        },
                        {
                            id: "copy",
                            value: _("Copy"),
                            hotkey: "Ctrl+C",
                            icon: "fmi-content-copy",
                            show: FOLDER | MANY | TREE,
                        },
                        {
                            id: "cut",
                            value: _("Cut"),
                            hotkey: "Ctrl+X",
                            icon: "fmi-content-cut",
                            show: FOLDER | MANY | TREE,
                        },
                        {
                            id: "paste",
                            value: _("Paste"),
                            hotkey: "Ctrl+V",
                            icon: "fmi-content-paste",
                            show: FOLDER | TREE,
                        },
                        {
                            $template: "Separator",
                            show: FOLDER | MANY | TREE,
                        },
                        {
                            id: "rename",
                            value: _("Rename"),
                            icon: "fmi-rename-box",
                            hotkey: "Ctrl+R",
                            show: FOLDER,
                        },
                        {
                            id: "delete",
                            value: _("Delete"),
                            icon: "wxi-close",
                            hotkey: "Del / &#8592;",
                            show: FOLDER | MANY,
                        },
                    ];
                    if (this.app.config.editor) {
                        options.splice(5, 0, {
                            id: "edit",
                            value: _("Edit"),
                            icon: "wxi-pencil",
                            hotkey: "Ctrl+E",
                            show: TEXT,
                        });
                    }
                    var menu = {
                        view: "menu",
                        css: "webix_fmanager_menu",
                        layout: "y",
                        autoheight: true,
                        data: options,
                        template: function (obj) {
                            return ((obj.icon
                                ? "<span class=\"webix_list_icon webix_icon " + obj.icon + "\"></span>"
                                : "") +
                                obj.value +
                                (obj.hotkey
                                    ? "<span class=\"webix_fmanager_context-menu-hotkey\">" + obj.hotkey + "</span>"
                                    : ""));
                        },
                        on: {
                            onMenuItemClick: function (id) {
                                _this.app.callEvent("app:action", [id, _this.Files]);
                                _this.app.callEvent("app:filemenu:click");
                            },
                        },
                    };
                    return menu;
                };
                MenuBodyView.prototype.FilterOptions = function (files) {
                    var _this = this;
                    this.Files = files;
                    var file = files[0];
                    var many = files.length > 1;
                    var vtypes = ["image", "audio", "video", "code", "pdf"];
                    var viewable = vtypes.find(function (t) { return t === file.type || t === file.$ext; });
                    var search = this.app.getState().search;
                    this.getRoot().define("width", search && !many ? 270 : 200);
                    this.getRoot().filter(function (o) {
                        return !((many && !(o.show & MANY)) ||
                            (file.type === "folder" && !(o.show & FOLDER)) ||
                            (o.show & TEXT && file.type !== "code") ||
                            (o.show & VIEW && !viewable) ||
                            (o.show & FULL && !_this.compact) ||
                            (o.show & TREE && _this.tree) ||
                            (o.show & SEARCH && !search));
                    });
                };
                return MenuBodyView;
            }(JetView));
            var ContextMenuView = (function (_super) {
                __extends(ContextMenuView, _super);
                function ContextMenuView(app, name, config) {
                    var _this = _super.call(this, app, name) || this;
                    _this._config = config;
                    return _this;
                }
                ContextMenuView.prototype.config = function () {
                    var _this = this;
                    return {
                        view: "context",
                        body: {
                            $subview: new (this.app.dynamic(MenuBodyView))(this.app, "", __assign({}, this._config)),
                            name: "options",
                        },
                        on: {
                            onBeforeShow: function (e) {
                                var files = _this._Locate(e);
                                if (files)
                                    _this.getSubView("options").FilterOptions(files);
                                else
                                    return false;
                            },
                        },
                    };
                };
                ContextMenuView.prototype.init = function () {
                    var _this = this;
                    this.on(this.app, "app:filemenu:click", function () { return _this.getRoot().hide(); });
                };
                ContextMenuView.prototype.AttachTo = function (master, locate) {
                    this._Locate = locate;
                    this.getRoot().attachTo(master);
                };
                ContextMenuView.prototype.Show = function (trg) {
                    this.getRoot().show(trg, {
                        x: -trg.offsetX,
                        y: trg.target.offsetHeight - trg.offsetY,
                    });
                };
                return ContextMenuView;
            }(JetView));
            var DataViewBase = (function (_super) {
                __extends(DataViewBase, _super);
                function DataViewBase() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                DataViewBase.prototype.init = function () {
                    var _this = this;
                    this.State = this.getParam("state");
                    this._Track = true;
                    this.WTable.attachEvent("onAfterSelect", function () { return _this.ShiftFocus(); });
                    this.WTable.attachEvent("onSelectChange", function () {
                        if (_this._Track) {
                            var newIDs = []
                                .concat(_this.WTable.getSelectedId(true).map(function (a) { return _this.WTable.getItem(a); }))
                                .filter(function (a) { return a.value !== ".."; });
                            if (newIDs.length || _this.State.selectedItem.length) {
                                if (!newIDs.length)
                                    newIDs.$noSelect = true;
                                _this.State.selectedItem = newIDs;
                            }
                        }
                    });
                    this.on(this.State.$changes, "path", function (v, o) {
                        if (!_this.State.search) {
                            v = _this.State.source === "files" ? v : _this.State.source;
                            if (!o)
                                _this.LoadData(v);
                            else
                                _this.app
                                    .getService("local")
                                    .folders()
                                    .then(function (hierarchy) {
                                    _this.State.selectedItem = _this.GetPrevLocation(hierarchy, v, o);
                                    _this.LoadData(v);
                                });
                        }
                        else if (o) {
                            _this.State.$batch({
                                search: "",
                                searchStats: null,
                            });
                        }
                    });
                    this.on(this.WTable.data, "onStoreUpdated", function (i, o, m) {
                        if (!m && _this.WTable.count() && _this.State.selectedItem.length) {
                            _this.SelectActive();
                        }
                    });
                    this.AddHotkeys();
                    var compact = this.getParam("compact", true);
                    this.Menu = this.ui(new (this.app.dynamic(ContextMenuView))(this.app, "", {
                        compact: compact,
                        state: this.State,
                    }));
                    this.Menu.AttachTo(this.WTable, function (e) {
                        var id = _this.WTable.locate(e);
                        if (!id)
                            return false;
                        var item = _this.WTable.getItem(id);
                        if (item.value == "..")
                            return false;
                        if (!_this.WTable.isSelected(id))
                            _this.WTable.select(id);
                        var sel = _this.WTable.getSelectedId(true);
                        if (sel.length === 1)
                            return [item];
                        return sel.map(function (s) { return _this.WTable.getItem(s); });
                    });
                    this.on(this.WTable, "onAfterScroll", function () { return webix.callEvent("onClick"); });
                };
                DataViewBase.prototype.ShiftFocus = function () {
                    if (this.getParam("trackActive", true))
                        this.State.isActive = true;
                };
                DataViewBase.prototype.Activate = function (item) {
                    if (!item)
                        return;
                    if (item.type === "folder") {
                        this.ShowSubFolder(item.value === ".." ? item.value : item.id);
                    }
                    else if (item.type === "code" && this.app.config.editor) {
                        this.app.callEvent("app:action", ["edit", [item]]);
                    }
                    else {
                        this.app.callEvent("app:action", ["open", [item]]);
                    }
                };
                DataViewBase.prototype.ShowSubFolder = function (id) {
                    var path;
                    if (id == "..") {
                        var t = this.State.path.split("/");
                        path = "/" + t.slice(1, t.length - 1).join("/");
                    }
                    else {
                        path = id;
                    }
                    this.State.path = path;
                };
                DataViewBase.prototype.GetPrevLocation = function (h, v, o) {
                    if (o === "/" || !h.exists(o))
                        return [];
                    if (v === "/")
                        v = "../files";
                    var id;
                    while (o) {
                        id = o;
                        o = h.getParentId(o);
                        if (o === v) {
                            var obj = h.getItem(id);
                            return [
                                {
                                    id: obj.id,
                                    value: obj.value,
                                    type: "folder",
                                    date: new Date(obj.date),
                                },
                            ];
                        }
                    }
                    return [];
                };
                DataViewBase.prototype.GetTargetFolder = function (target) {
                    var targetItem = target ? this.WTable.getItem(target) : null;
                    var invalidTarget = !targetItem || targetItem.type !== "folder" || targetItem.value === "..";
                    var targetFolder = invalidTarget ? this.State.path : targetItem.id;
                    return targetFolder;
                };
                DataViewBase.prototype.SelectActive = function () {
                    var table = this.WTable;
                    if (this.State.isActive !== false && !table.getSelectedId()) {
                        var sel = this.State.selectedItem;
                        for (var i = 0; i < sel.length; i++) {
                            if (table.exists(sel[i].id))
                                table.select(sel[i].id, true);
                        }
                        if (!sel.$noSelect && !table.getSelectedId()) {
                            var id = table.getFirstId();
                            if (id) {
                                table.select(id);
                                sel.$noSelect = false;
                            }
                        }
                        webix.delay(function () { return webix.UIManager.setFocus(table); });
                    }
                };
                DataViewBase.prototype.GetSelection = function () {
                    return this.WTable.getItem(this.WTable.getSelectedId());
                };
                DataViewBase.prototype.LoadData = function (path, search) {
                    var _this = this;
                    this._Track = false;
                    var table = this.WTable;
                    if (search) {
                        table.clearAll();
                        this.app
                            .getService("backend")
                            .search(path, search)
                            .then(function (data) {
                            for (var i = 0; i < data.length; ++i)
                                if (typeof data[i].date === "number")
                                    data[i].date = new Date(data[i].date * 1000);
                            table.parse(data);
                            _this.GetSearchStats(data);
                        });
                    }
                    else {
                        if (table.data.url !== path) {
                            table.clearAll();
                            this.app
                                .getService("local")
                                .files(path)
                                .then(function (data) {
                                _this.RenderData(data);
                                _this.SelectActive();
                            });
                        }
                    }
                    this._Track = true;
                };
                DataViewBase.prototype.MoveFiles = function (source, target) {
                    this.app
                        .getService("operations")
                        .move(source, this.GetTargetFolder(target));
                    return false;
                };
                DataViewBase.prototype.Icon = function (obj) {
                    return "<img class=\"webix_fmanager_file-type-icon\" src=\"" + this.app
                        .getService("backend")
                        .icon(obj) + "\" />";
                };
                DataViewBase.prototype.DragMarker = function (ctx) {
                    var list = this.WTable;
                    var parent = list.find(function (f) { return f.value === ".."; }, true);
                    if (parent) {
                        var parentInd = ctx.source.indexOf(parent.id);
                        if (parentInd !== -1)
                            ctx.source.splice(parentInd, 1);
                    }
                    var files = ctx.source.length;
                    if (!files)
                        return false;
                    if (files === 1)
                        list.select(ctx.source[0]);
                    var firstDragged = list.getItem(ctx.source[0]);
                    var icon;
                    if (firstDragged.type === "folder") {
                        icon = folderIcon;
                    }
                    else {
                        icon = this.Icon(firstDragged);
                    }
                    var html = "<div class='webix_fmanager_grid_drag_zone_list'>";
                    html += "<div class=\"webix_fmanager_inner_drag_zone_list\">" + icon + firstDragged.value + "</div>";
                    html += "</div>";
                    if (files > 1) {
                        html = "<div class='webix_drag_main'>" + html + "</div>";
                        html += "<div class='webix_badge'>" + files + "</div>";
                        var multiple = "<div class='webix_drag_multiple'></div>";
                        if (files > 2)
                            multiple = "<div class='webix_drag_multiple_last'></div>" + multiple;
                        html = multiple + html;
                    }
                    ctx.html = html;
                };
                DataViewBase.prototype.AddHotkeys = function () {
                    var _this = this;
                    var ctrlKey = webix.env.isMac ? "COMMAND" : "CTRL";
                    var operations = [
                        { key: "DELETE", oper: "delete" },
                        { key: "BACKSPACE", oper: "delete" },
                        { key: ctrlKey + "+C", oper: "copy" },
                        { key: ctrlKey + "+X", oper: "cut" },
                        { key: ctrlKey + "+V", oper: "paste" },
                        { key: ctrlKey + "+R", oper: "rename" },
                        { key: ctrlKey + "+O", oper: "open" },
                        { key: ctrlKey + "+D", oper: "download" },
                        { key: ctrlKey + "+Alt+O", oper: "locate" },
                    ];
                    if (this.app.config.editor) {
                        operations.push({ key: ctrlKey + "+E", oper: "edit" });
                    }
                    var _loop_1 = function (i) {
                        this_1.on(handler(this_1.getRoot()), operations[i].key, function (v, e) {
                            var params = [operations[i].oper];
                            _this.app.callEvent("app:action", params);
                            webix.html.preventEvent(e);
                        });
                    };
                    var this_1 = this;
                    for (var i = 0; i < operations.length; ++i) {
                        _loop_1(i);
                    }
                    this.on(handler(this.getRoot()), ctrlKey + "+A", function (v, e) {
                        _this.WTable.selectAll();
                        webix.html.preventEvent(e);
                    });
                };
                DataViewBase.prototype.GetSearchStats = function (data) {
                    var all = data.length;
                    var folders = data.filter(function (i) { return i.type === "folder"; });
                    this.State.searchStats = {
                        folders: folders ? folders.length : 0,
                        files: all - folders.length,
                    };
                };
                DataViewBase.prototype.EmptyClick = function () {
                    if (this.State.isActive !== false)
                        this.WTable.unselectAll();
                    else
                        this.ShiftFocus();
                };
                return DataViewBase;
            }(JetView));
            var CardsView = (function (_super) {
                __extends(CardsView, _super);
                function CardsView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CardsView.prototype.config = function () {
                    var _this = this;
                    var compact = this.getParam("compact", true);
                    var smallSkin = webix.skin.$name === "mini" || webix.skin.$name === "compact";
                    var itemSize = smallSkin
                        ? {
                            height: 149,
                            width: 181,
                            padding: 16,
                        }
                        : {
                            height: 197,
                            width: 236,
                            padding: 20,
                        };
                    return {
                        view: "dataview",
                        localId: "cards",
                        drag: !compact,
                        select: true,
                        multiselect: true,
                        css: "webix_noselect webix_fmanager_cards",
                        template: function (obj) { return _this.CardTemplate(obj); },
                        type: __assign(__assign({}, itemSize), { type: "tiles" }),
                        on: {
                            onItemDblClick: function () { return _this.Activate(_this.GetSelection()); },
                            onEnter: function () { return _this.Activate(_this.GetSelection()); },
                            onBeforeDrag: function (ctx) { return _this.DragMarker(ctx); },
                            onBeforeDrop: function (ctx) { return _this.MoveFiles(ctx.source, ctx.target); },
                        },
                        onClick: {
                            webix_fmanager_menu_icon: function (e) {
                                _this.Menu.Show(e);
                            },
                            webix_dataview: function (e, id) {
                                if (!id)
                                    _this.EmptyClick();
                            },
                        },
                        onContext: {},
                    };
                };
                CardsView.prototype.init = function () {
                    this.WTable = this.$$("cards");
                    _super.prototype.init.call(this);
                };
                CardsView.prototype.RenderData = function (data) {
                    var _this = this;
                    this.WTable.sync(data, function () { return _this.WTable.filter(function (f) { return f.value !== ".."; }); });
                };
                CardsView.prototype.CardTemplate = function (obj) {
                    var _ = this.app.getService("locale")._;
                    var preview, panel;
                    if (obj.type === "folder") {
                        preview = "<div class=\"webix_fmanager_card_preview\">" + folderCardIcon + "</div>";
                        panel = "<div class=\"webix_fmanager_card_panel\">\n\t\t<span class=\"webix_fmanager_card_label\">" + _("Folder") + "</span>\n\t\t<span class=\"webix_fmanager_card_name folder\">" + this.SearchTemplate(obj.value) + "</span>" + menuIcon + "\n\t\t</div>";
                    }
                    else {
                        var skin = webix.skin.$active;
                        var picSize = skin.listItemHeight < 29 ? [163, 92] : [214, 124];
                        var origin_1 = this.app
                            .getService("backend")
                            .previewURL(obj, picSize[0], picSize[1]);
                        var img = "<img height=\"" + picSize[1] + "\" width=\"" + picSize[0] + "\" src=\"" + origin_1 + "\" onerror='this.style.display=\"none\"'/>";
                        preview = "<div class=\"webix_fmanager_card_preview file\">" + img + "</div>";
                        var fileIcon = this.Icon(obj);
                        panel = "<div class=\"webix_fmanager_card_panel file\">\n\t\t<span class=\"webix_fmanager_card_name\">" + fileIcon + "<span class=\"file_name_text\">" + this.SearchTemplate(obj.value) + "</span></span>" + menuIcon + "\n\t\t</div>";
                    }
                    return preview + panel;
                };
                CardsView.prototype.SearchTemplate = function (name) {
                    if (this.State.search) {
                        var rex = new RegExp("(" + this.State.search + ")", "gi");
                        return name.replace(rex, "<span class='webix_fmanager_search_mark'>$1</span>");
                    }
                    return name;
                };
                return CardsView;
            }(DataViewBase));
            webix.protoUI({
                name: "codemirror-editor",
                defaults: {
                    mode: "javascript",
                    lineNumbers: true,
                    matchBrackets: true,
                    theme: "default"
                },
                $init: function (config) {
                    this.$view.innerHTML = "<textarea style='width:100%;height:100%;'></textarea>";
                    this._textarea = this.$view.firstChild;
                    this._waitEditor = webix.promise.defer();
                    this.$ready.push(this._render_cm_editor);
                },
                complex_types: {
                    php: {
                        mode: ["xml", "javascript", "css", "htmlmixed", "clike"]
                    },
                    htmlembedded: {
                        mode: ["xml", "javascript", "css", "htmlmixed"],
                        addon: ["mode/multiplex"]
                    },
                    htmlmixed: {
                        mode: ["xml", "javascript", "css"]
                    },
                    dockerfile: {
                        addon: ["mode/simple"]
                    }
                },
                _render_cm_editor: function () {
                    if (this.config.cdn === false) {
                        this._render_when_ready;
                        return;
                    }
                    var cdn = this.config.cdn || "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/";
                    var sources = [
                        cdn + "/codemirror.css",
                        cdn + "/codemirror.js"
                    ];
                    var mode = this.config.mode ? this.config.mode : "javascript";
                    var extras = this.complex_types[mode];
                    if (extras) {
                        if (extras["mode"]) {
                            extras["mode"].forEach(function (name) {
                                var path = "/mode/" + name + "/" + name + ".js";
                                sources.push(cdn + path);
                            });
                        }
                        if (extras["addon"]) {
                            extras["addon"].forEach(function (name) {
                                var path = "/addon/" + name + ".js";
                                sources.push(cdn + path);
                            });
                        }
                    }
                    sources.push(cdn + "/mode/" + mode + "/" + mode + ".js");
                    if (this.config.theme && this.config.theme !== "default") {
                        sources.push(cdn + "/theme/" + this.config.theme + ".css");
                    }
                    if (this.config.matchBrackets) {
                        sources.push(cdn + "/addon/edit/matchbrackets.js");
                    }
                    webix.require(sources)
                        .then(webix.bind(this._render_when_ready, this))
                        .catch(function (e) {
                        console.log(e);
                    });
                },
                _render_when_ready: function () {
                    this._editor = CodeMirror.fromTextArea(this._textarea, {
                        mode: this.config.mode,
                        lineNumbers: this.config.lineNumbers,
                        matchBrackets: this.config.matchBrackets,
                        theme: this.config.theme
                    });
                    this._waitEditor.resolve(this._editor);
                    this.setValue(this.config.value);
                    if (this._focus_await)
                        this.focus();
                },
                _set_inner_size: function () {
                    if (!this._editor || !this.$width)
                        return;
                    this._updateScrollSize();
                    this._editor.scrollTo(0, 0);
                },
                _updateScrollSize: function () {
                    var box = this._editor.getWrapperElement();
                    var height = (this.$height || 0) + "px";
                    box.style.height = height;
                    box.style.width = (this.$width || 0) + "px";
                    var scroll = this._editor.getScrollerElement();
                    if (scroll.style.height != height) {
                        scroll.style.height = height;
                        this._editor.refresh();
                    }
                },
                $setSize: function (x, y) {
                    if (webix.ui.view.prototype.$setSize.call(this, x, y)) {
                        this._set_inner_size();
                    }
                },
                setValue: function (value) {
                    if (!value && value !== 0)
                        value = "";
                    this.config.value = value;
                    if (this._editor) {
                        this._editor.setValue(value);
                        if (!this.config.preserveUndoHistory)
                            this._editor.clearHistory();
                        this._updateScrollSize();
                    }
                },
                getValue: function () {
                    return this._editor ? this._editor.getValue() : this.config.value;
                },
                focus: function () {
                    this._focus_await = true;
                    if (this._editor)
                        this._editor.focus();
                },
                getEditor: function (waitEditor) {
                    return waitEditor ? this._waitEditor : this._editor;
                },
                undo: function () {
                    this._editor.undo();
                },
                redo: function () {
                    this._editor.redo();
                },
                undoLength: function () {
                    return this._editor.historySize().undo;
                }
            }, webix.ui.view);
            var typeHash = {
                css: ["css", "less"],
                go: ["go"],
                htmlmixed: ["html", "xml", "svg"],
                javascript: ["js", "mjs", "json", "ts", "coffee"],
                markdown: ["md"],
                php: ["php", "phtml", "php3", "php4", "php5", "php7", "php-s", "pht", "phar"],
                python: ["py", "pyc", "pyd", "pyo", "pyw", "pyz"],
                sql: ["sql", "sqlite3", "sqlite", "db"],
                yaml: ["yaml", "yml"],
                shell: ["sh"],
            };
            var EditorView = (function (_super) {
                __extends(EditorView, _super);
                function EditorView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                EditorView.prototype.config = function () {
                    var _this = this;
                    var _ = this.app.getService("locale")._;
                    this.File = this.getParam("file");
                    var fileType = this.GetFileType(this.File);
                    return {
                        type: "wide",
                        rows: [
                            {
                                view: "toolbar",
                                padding: { left: 28, right: 4 },
                                cols: [
                                    {
                                        view: "button",
                                        localId: "saveBtn",
                                        type: "icon",
                                        label: _("Save"),
                                        icon: "wxi-check",
                                        css: "webix_primary webix_fmanager_editor_save",
                                        width: 90,
                                        hotkey: "Ctrl+S",
                                        click: function () { return _this.Save(); },
                                    },
                                    { width: 10 },
                                    {
                                        view: "label",
                                        label: " ",
                                        localId: "name",
                                        css: "webix_fmanager_editor_name",
                                    },
                                    { gravity: 0.3 },
                                    {
                                        view: "icon",
                                        icon: "wxi-close",
                                        hotkey: "esc",
                                        click: function () { return _this.Confirm(); },
                                    },
                                ],
                            },
                            {
                                view: "codemirror-editor",
                                localId: "editor",
                                mode: fileType,
                                theme: webix.skin.$name === "contrast" ? "monokai" : "default",
                            },
                        ],
                    };
                };
                EditorView.prototype.init = function () {
                    var _this = this;
                    this.$$("name").setValue("<div class=\"filename\">" + this.ClipName(this.File.id) + "</div><span class=\"extension\">." + this.File.$ext + "</span>");
                    var editor = this.$$("editor");
                    webix.extend(editor, webix.ProgressBar);
                    editor.showProgress({
                        type: "top",
                    });
                    this.app
                        .getService("operations")
                        .read(this.File.id)
                        .then(function (text) {
                        _this._oldValue = text;
                        editor.getEditor(true).then(function () {
                            editor.setValue(text);
                        });
                    })
                        .finally(function () {
                        editor.hideProgress();
                    });
                    editor.getEditor(true).then(function (editorObj) {
                        editorObj.on("changes", function () { return _this.TextChanged(editor); });
                    });
                };
                EditorView.prototype.Back = function () {
                    this.show("/top", { params: { state: this.getParam("state") } });
                };
                EditorView.prototype.Confirm = function () {
                    var _this = this;
                    var _ = this.app.getService("locale")._;
                    if (this._changed)
                        webix
                            .confirm({
                            text: _("Are you sure you want to exit without saving?"),
                        })
                            .then(function () { return _this.Back(); });
                    else
                        this.Back();
                };
                EditorView.prototype.Save = function () {
                    var content = this.$$("editor").getValue();
                    this.app.getService("operations").write(this.File.id, content);
                    this._oldValue = content;
                    this.ChangeTextState(false);
                };
                EditorView.prototype.GetFileType = function (file) {
                    if (file.value === "Dockerfile")
                        return "dockerfile";
                    if (file.$ext) {
                        for (var type in typeHash) {
                            if (typeHash[type].indexOf(file.$ext) !== -1) {
                                return type;
                            }
                        }
                    }
                    return "htmlmixed";
                };
                EditorView.prototype.TextChanged = function (editor) {
                    var isEqual = editor.getValue() == this._oldValue;
                    this.ChangeTextState(!isEqual);
                };
                EditorView.prototype.ChangeTextState = function (state) {
                    if (state === !!this._changed)
                        return;
                    this._changed = state;
                    var button = this.$$("saveBtn");
                    button.config.icon = state ? "webix_fmanager_icon fmi-circle" : "wxi-check";
                    button.refresh();
                };
                EditorView.prototype.ClipName = function (path) {
                    if (!path)
                        return "";
                    var parts = path.split(".");
                    return parts.slice(0, parts.length - 1).join(".");
                };
                return EditorView;
            }(JetView));
            function fileNameSelectMask(input) {
                var extIndex = input.value.lastIndexOf(".");
                if (extIndex > -1)
                    input.setSelectionRange(0, extIndex);
                else
                    input.select();
            }
            function iterateAsync(arr, code, ctx) {
                ctx = ctx || { i: 0, cancel: false };
                if (ctx.i >= arr.length)
                    return;
                return code(arr[ctx.i], ctx.i).then(function () {
                    ctx.i += 1;
                    if (!ctx.cancel)
                        return iterateAsync(arr, code, ctx);
                });
            }
            function formatTemplate(size) {
                if (size >= 1000000000)
                    return (size / 1000000000).toFixed(1) + " Gb";
                if (size >= 1000000)
                    return (size / 1000000).toFixed(1) + " Mb";
                if (size >= 1000)
                    return (size / 1000).toFixed(1) + " kb";
                return size + " b";
            }
            function ext(path) {
                if (!path)
                    return "";
                var parts = path.split(".");
                if (parts.length < 2)
                    return "";
                return parts[parts.length - 1];
            }
            function getLastSelected(files) {
                return files.length
                    ? files[files.length - 1]
                    : { type: "empty", value: "Nothing is selected" };
            }
            function safeName(str) {
                str = str.replace(/[/\\:*?"<>|]/g, "").trim();
                while (str[0] === ".")
                    str = str.substr(1).trim();
                return str;
            }
            function capitalize(str) {
                if (!str)
                    return "";
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
            function prompt(config) {
                var result = new webix.promise.defer();
                var p = webix.ui({
                    view: "window",
                    css: "webix_fmanager_prompt",
                    modal: true,
                    move: true,
                    head: {
                        view: "toolbar",
                        padding: { left: 12, right: 4 },
                        borderless: true,
                        elements: [
                            { view: "label", label: config.text },
                            {
                                view: "icon",
                                icon: "wxi-close",
                                hotkey: "esc",
                                click: function () {
                                    result.reject("prompt cancelled");
                                    p.close();
                                },
                            },
                        ],
                    },
                    position: config.master ? "" : "center",
                    body: {
                        view: "form",
                        padding: { top: 0, left: 12, right: 12, bottom: 12 },
                        rows: [
                            {
                                margin: 10,
                                cols: [
                                    {
                                        view: "text",
                                        name: "name",
                                        value: config.value,
                                        width: 230,
                                        validate: safeName,
                                        css: "webix_fmanager_prompt_input",
                                    },
                                    {
                                        view: "button",
                                        value: config.button,
                                        css: "webix_primary",
                                        width: 100,
                                        hotkey: "enter",
                                        click: function () {
                                            var popup = this.getTopParentView();
                                            var form = popup.getBody();
                                            if (form.validate()) {
                                                var newname = form.getValues().name;
                                                result.resolve(newname);
                                                popup.close();
                                            }
                                            else {
                                                webix.UIManager.setFocus(form);
                                            }
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    on: {
                        onShow: function () {
                            var input = this.getBody().elements.name.getInputNode();
                            input.focus();
                            if (config.selectMask)
                                config.selectMask(input);
                            else
                                input.select();
                        },
                    },
                });
                var position = config.master ? { x: 50 } : null;
                webix.delay(function () { return p.show(config.master, position); });
                return result;
            }
            var AddNewMenuView = (function (_super) {
                __extends(AddNewMenuView, _super);
                function AddNewMenuView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                AddNewMenuView.prototype.config = function () {
                    var _this = this;
                    var _ = this.app.getService("locale")._;
                    return {
                        view: "popup",
                        width: 198,
                        body: {
                            view: "menu",
                            autoheight: true,
                            layout: "y",
                            css: "webix_fmanager_add_new_menu",
                            data: [
                                {
                                    id: "makefile",
                                    value: _("Add new file"),
                                    icon: "webix_fmanager_icon fmi-file-plus-outline",
                                },
                                {
                                    id: "makedir",
                                    value: _("Add new folder"),
                                    icon: "webix_fmanager_icon fmi-folder-plus-outline",
                                },
                                {
                                    id: "upload",
                                    value: _("Upload file"),
                                    icon: "webix_fmanager_icon fmi-file-upload-outline",
                                },
                            ],
                            on: {
                                onMenuItemClick: function (id) {
                                    if (id === "makefile" || id === "makedir") {
                                        var _1 = _this.app.getService("locale")._;
                                        prompt({
                                            text: _1("Enter a new name"),
                                            button: _1("Add"),
                                            selectMask: fileNameSelectMask,
                                            value: "New " + (id === "makefile" ? "file.txt" : "folder"),
                                        }).then(function (name) {
                                            _this.app.callEvent("app:action", [id, safeName(name)]);
                                        });
                                    }
                                    else {
                                        _this.app.callEvent("app:action", [id]);
                                    }
                                    _this.getRoot().hide();
                                },
                            },
                        },
                    };
                };
                AddNewMenuView.prototype.Show = function (target) {
                    this.getRoot().show(target, { x: 20 });
                };
                return AddNewMenuView;
            }(JetView));
            var FoldersView = (function (_super) {
                __extends(FoldersView, _super);
                function FoldersView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                FoldersView.prototype.config = function () {
                    var _this = this;
                    var _ = this.app.getService("locale")._;
                    var button = {
                        view: "button",
                        value: _("Add New"),
                        inputWidth: 210,
                        css: "webix_primary",
                        align: "center",
                        click: function () {
                            this.$scope.Menu.Show(this.$view);
                        },
                    };
                    var navbar = {
                        view: "tree",
                        localId: "tree",
                        css: "webix_fmanager_tree",
                        select: true,
                        drag: "target",
                        type: {
                            template: function (o, common) {
                                return "" + common.icon(o) + common.folder(o) + " <span>" + (o.$level === 1 ? _(o.value) : o.value) + "</span>";
                            },
                            folder: function (o) { return "<div class='webix_icon wxi-" + (o.icon || "folder") + "'></div>"; },
                        },
                        borderless: true,
                        on: {
                            onBeforeDrop: function (ctx) { return _this.MoveFiles(ctx.source, ctx.target); },
                            onBeforeContextMenu: function (id) {
                                if (id.substr(0, 2) !== "..")
                                    _this.Tree.select(id);
                                else
                                    return false;
                            },
                        },
                    };
                    var FSStats = {
                        localId: "fs:stats",
                        borderless: true,
                        height: 68,
                        css: "webix_fmanager_fsstats",
                        template: function (obj) {
                            var used = Math.floor((obj.used / obj.total) * 100);
                            var activeSkinAccentColor = webix.skin.$active.timelineColor;
                            var svg = "<svg width=\"100%\" height=\"20px\">\n<rect y=\"1\" rx=\"4\" width=\"100%\" height=\"8\" style=\"fill:#DFE2E6;\" />\n<rect y=\"1\" rx=\"4\" width=\"" + (used ||
                                0) + "%\" height=\"8\" style=\"fill:" + activeSkinAccentColor + ";\" /></svg>";
                            var label = "<div class=\"webix_fmanager_fsstats_label\">" + formatTemplate(obj.used || 0) + " " + _("of") + " " + formatTemplate(obj.total || 0) + " " + _("used") + "</div>";
                            return svg + label;
                        },
                    };
                    var navpanel = {
                        view: "proxy",
                        body: {
                            rows: [button, navbar, FSStats],
                            padding: { top: 8, bottom: 4 },
                        },
                    };
                    return navpanel;
                };
                FoldersView.prototype.init = function () {
                    var _this = this;
                    this.State = this.getParam("state");
                    this.Tree = this.$$("tree");
                    this.Ready = this.app
                        .getService("local")
                        .folders()
                        .then(function (h) {
                        _this.Tree.sync(h);
                        _this.Subscribe();
                        _this.GetFsStats();
                    });
                    this.Menu = this.ui(AddNewMenuView);
                    this.ContextMenu = this.ui(new (this.app.dynamic(ContextMenuView))(this.app, "", {
                        compact: false,
                        tree: true,
                    }));
                    this.ContextMenu.AttachTo(this.Tree, function (e) {
                        var id = _this.Tree.locate(e);
                        return id ? [_this.Tree.getItem(id)] : null;
                    });
                    this.on(this.app, "reload:fs:stats", function () { return _this.GetFsStats(true); });
                };
                FoldersView.prototype.Subscribe = function () {
                    var _this = this;
                    this.Tree.attachEvent("onAfterSelect", function () {
                        var v = _this.Tree.getSelectedId();
                        if (v.substr(0, 2) == "..") {
                            _this.State.$batch({
                                source: v.slice(3),
                                path: "/",
                            });
                        }
                        else {
                            _this.State.$batch({
                                source: _this.GetRootId(v).slice(3),
                                path: v,
                            });
                        }
                    });
                    this.on(this.State.$changes, "path", function (v) {
                        _this.State.path = v;
                        if (_this.Tree.exists(v)) {
                            _this.Tree.select(v);
                            var parent = _this.Tree.getParentId(v);
                            if (parent)
                                _this.Tree.open(parent);
                            _this.Tree.showItem(v);
                        }
                        else
                            _this.Tree.select("../" + _this.State.source);
                    });
                };
                FoldersView.prototype.GetFsStats = function (force) {
                    var _this = this;
                    this.app
                        .getService("backend")
                        .getInfo(force)
                        .then(function (data) {
                        _this.$$("fs:stats").setValues(data.stats);
                    });
                };
                FoldersView.prototype.MoveFiles = function (source, target) {
                    if (target === "../files")
                        target = "/";
                    this.app.getService("operations").move(source, target);
                    return false;
                };
                FoldersView.prototype.GetRootId = function (path) {
                    var root;
                    while (path) {
                        root = path;
                        path = this.Tree.getParentId(path);
                    }
                    return root;
                };
                return FoldersView;
            }(JetView));
            var GridView = (function (_super) {
                __extends(GridView, _super);
                function GridView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                GridView.prototype.config = function () {
                    var _this = this;
                    var _ = this.app.getService("locale")._;
                    var compact = this.getParam("compact", true);
                    var grid = {
                        view: "datatable",
                        localId: "table",
                        css: "webix_noselect webix_header_border webix_fmanager_filelist",
                        select: "row",
                        multiselect: true,
                        drag: true,
                        resizeColumn: { headerOnly: true },
                        sort: "multi",
                        type: {
                            backIcon: function () { return backIcon; },
                            backLabel: function () { return _("back to parent folder"); },
                        },
                        on: {
                            onItemDblClick: function () { return _this.Activate(_this.GetSelection()); },
                            onEnter: function () { return _this.Activate(_this.GetSelection()); },
                            onBeforeDrag: function (ctx) { return _this.DragMarker(ctx); },
                            onBeforeDrop: function (ctx) { return _this.MoveFiles(ctx.source, ctx.target); },
                            onBeforeSort: function (_by, dir) { return (sortDir = dir === "asc" ? 1 : -1); },
                        },
                        onClick: {
                            webix_ss_center_scroll: function () { return _this.EmptyClick(); },
                            webix_column: function () { return false; },
                        },
                        columns: [
                            {
                                id: "value",
                                header: "",
                                template: function (obj) { return _this.NameTemplate(obj); },
                                sort: sort("value"),
                                fillspace: true,
                            },
                            {
                                id: "size",
                                header: _("Size"),
                                template: function (obj) {
                                    return obj.type !== "folder" ? formatTemplate(obj.size) : "";
                                },
                                sort: sort("size"),
                            },
                            {
                                id: "date",
                                header: _("Date"),
                                sort: sort("date"),
                                format: function (date) {
                                    if (date instanceof Date && !isNaN(date))
                                        return webix.i18n.longDateFormatStr(date);
                                    else
                                        return "";
                                },
                                width: 150,
                            },
                        ],
                    };
                    if (compact) {
                        grid.columns.splice(1, 2);
                    }
                    return grid;
                };
                GridView.prototype.init = function () {
                    var _this = this;
                    this.WTable = this.$$("table");
                    _super.prototype.init.call(this);
                    this.on(this.State.$changes, "isActive", function (v) {
                        if (!v) {
                            _this._Track = false;
                            _this.WTable.unselect();
                            _this._Track = true;
                        }
                        else {
                            _this.SelectActive();
                            webix.delay(function () { return webix.UIManager.setFocus(_this.WTable); });
                        }
                    });
                    this.on(handler(this.getRoot()), "TAB", function () {
                        if (_this.getParam("trackActive", true))
                            _this.State.isActive = false;
                    });
                };
                GridView.prototype.RenderData = function (data) {
                    this.WTable.sync(data);
                };
                GridView.prototype.NameTemplate = function (obj) {
                    return obj.type === "folder"
                        ? folderIcon + obj.value
                        : this.Icon(obj) + "<span class=\"file-name\">" + obj.value + "</span>";
                };
                return GridView;
            }(DataViewBase));
            var sortDir;
            function sort(by) {
                return function (a, b) {
                    if (a.value === ".." || (a.type === "folder" && b.type !== "folder"))
                        return -1 * sortDir;
                    if (b.value === ".." || (b.type === "folder" && a.type !== "folder"))
                        return 1 * sortDir;
                    return a[by] < b[by] ? -1 : a[by] > b[by] ? 1 : 0;
                };
            }
            var PreviewPopupView = (function (_super) {
                __extends(PreviewPopupView, _super);
                function PreviewPopupView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PreviewPopupView.prototype.config = function () {
                    return {
                        view: "window",
                        head: false,
                        fullscreen: true,
                        body: { $subview: true, branch: true, name: "preview" },
                    };
                };
                PreviewPopupView.prototype.IsVisible = function () {
                    return this.getRoot().isVisible();
                };
                PreviewPopupView.prototype.Show = function (params) {
                    this.show("preview", {
                        target: "preview",
                        params: { state: params.state, compact: true },
                    });
                    this.getRoot().show();
                };
                PreviewPopupView.prototype.Hide = function () {
                    this.show("_blank", {
                        target: "preview",
                    });
                    this.getRoot().hide();
                };
                return PreviewPopupView;
            }(JetView));
            var SideTreeView = (function (_super) {
                __extends(SideTreeView, _super);
                function SideTreeView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                SideTreeView.prototype.config = function () {
                    return {
                        view: "sidemenu",
                        width: 300,
                        state: function (state) {
                            var toolbarHeight = webix.skin.$active.toolbarHeight + 14;
                            state.top = toolbarHeight;
                            state.height -= toolbarHeight;
                        },
                        body: FoldersView,
                    };
                };
                SideTreeView.prototype.IsVisible = function () {
                    return this.getRoot().isVisible();
                };
                SideTreeView.prototype.Show = function () {
                    this.getRoot().show();
                };
                return SideTreeView;
            }(JetView));
            var DoublePanelView = (function (_super) {
                __extends(DoublePanelView, _super);
                function DoublePanelView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                DoublePanelView.prototype.config = function () {
                    var panels = {
                        type: "wide",
                        cols: [
                            { $subview: true, branch: true, name: "left" },
                            { view: "resizer" },
                            { $subview: true, branch: true, name: "right" },
                        ],
                    };
                    return panels;
                };
                DoublePanelView.prototype.init = function () {
                    this.State = this.getParam("state");
                    var left = createState({
                        selectedItem: [].concat(this.State.selectedItem),
                        path: this.State.path,
                        source: this.GetSource("left"),
                        mode: "list",
                        isActive: true,
                    });
                    left.selectedItem.$noSelect = this.State.selectedItem.$noSelect;
                    var right = createState({
                        selectedItem: [],
                        path: this.State.path,
                        source: this.GetSource("right"),
                        mode: "list",
                        isActive: false,
                    });
                    this._TrackChanges(left, right);
                    this._TrackChanges(right, left);
                    this.show("panel/list", {
                        target: "left",
                        params: { trackActive: true, state: left },
                    });
                    this.show("panel/list", {
                        target: "right",
                        params: { trackActive: true, state: right },
                    });
                };
                DoublePanelView.prototype._TrackChanges = function (state, next) {
                    var _this = this;
                    this.on(state.$changes, "path", function (v) {
                        if (state.isActive)
                            _this.State.path = v;
                    });
                    this.on(state.$changes, "source", function (v) { return (_this.State.source = v); });
                    this.on(state.$changes, "selectedItem", function (v) {
                        if (state.isActive)
                            _this.State.selectedItem = v;
                    });
                    this.on(state.$changes, "isActive", function (v) {
                        if (v)
                            _this.State.$batch({
                                path: state.path,
                                source: state.source,
                            });
                        next.isActive = !v;
                    });
                    this.on(this.app, "pathChanged", function (opath, npath) {
                        if (!state.isActive &&
                            (state.path === opath || state.path.indexOf(opath + "/") === 0)) {
                            state.path = state.path.replace(opath, npath);
                        }
                    });
                };
                DoublePanelView.prototype.GetSource = function () {
                    return this.State.source;
                };
                return DoublePanelView;
            }(JetView));
            var PanelSearchView = (function (_super) {
                __extends(PanelSearchView, _super);
                function PanelSearchView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PanelSearchView.prototype.config = function () {
                    var _this = this;
                    this.State = this.getParam("state");
                    var _ = this.app.getService("locale")._;
                    var back = {
                        view: "icon",
                        icon: "wxi-angle-left",
                        click: function () {
                            _this.State.$batch({
                                search: "",
                                searchStats: null,
                            });
                        },
                    };
                    var toolbar = {
                        view: "toolbar",
                        cols: [
                            back,
                            {
                                localId: "header",
                                type: "header",
                                borderless: true,
                                css: "webix_fmanager_path",
                                template: function (obj) {
                                    var text = _("Search results in");
                                    var root = _this.app.getService("backend").getRootName();
                                    var path = "";
                                    if (obj && obj.path && obj.path !== "/") {
                                        path = webix.template.escape(obj.path);
                                    }
                                    return text + " " + root + path;
                                },
                            },
                            {},
                        ],
                    };
                    return {
                        rows: [toolbar, { $subview: true, params: { state: this.State } }],
                    };
                };
                PanelSearchView.prototype.init = function () {
                    this.$$("header").setValues({ path: this.State.path });
                };
                PanelSearchView.prototype.ready = function () {
                    var _this = this;
                    this.on(this.State.$changes, "search", function (v) {
                        v = v.trim();
                        if (v) {
                            _this.State.selectedItem = [];
                            _this.getSubView().LoadData(_this.State.path, v);
                        }
                    });
                };
                return PanelSearchView;
            }(JetView));
            var PanelView = (function (_super) {
                __extends(PanelView, _super);
                function PanelView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PanelView.prototype.config = function () {
                    var _this = this;
                    var path = {
                        view: "template",
                        localId: "path",
                        type: "header",
                        borderless: true,
                        css: "webix_fmanager_path",
                        template: function (obj) { return _this.RenderPath(obj); },
                        onClick: {
                            webix_fmanager_path_chunk: function (e) { return _this.ChangePath(e); },
                        },
                    };
                    var refresh = {
                        view: "icon",
                        icon: "wxi-sync",
                        css: "webix_fmanager_spec_icon",
                        tooltip: "Refresh",
                        click: function () {
                            _this.app.getService("local").refresh(_this.State.path);
                        },
                    };
                    var toolbar = {
                        view: "toolbar",
                        paddingX: 4,
                        cols: [refresh, path],
                    };
                    return {
                        rows: [
                            toolbar,
                            { $subview: true, params: { state: this.getParam("state") } },
                        ],
                    };
                };
                PanelView.prototype.init = function () {
                    var _this = this;
                    this.State = this.getParam("state");
                    this.on(this.State.$changes, "path", function (v) { return _this.ProcessPath(v); });
                    var uapi = this.app.getService("upload").getUploader();
                    uapi.addDropZone(this.getRoot().$view);
                    this.on(uapi, "onBeforeFileDrop", function (files, e) {
                        if (_this.getRoot().$view.contains(e.target))
                            uapi.config.tempUrlData = { id: _this.State.path };
                    });
                };
                PanelView.prototype.ProcessPath = function (v) {
                    var _this = this;
                    this.app
                        .getService("local")
                        .folders()
                        .then(function (dirs) {
                        var path = ["/"];
                        if (v !== "/") {
                            var p = v.split("/");
                            for (var i = 1, id = ""; i < p.length; ++i) {
                                id += "/" + p[i];
                                path.push(dirs.getItem(id).value);
                            }
                        }
                        _this.$$("path").setValues({ path: path });
                    });
                };
                PanelView.prototype.RenderPath = function (obj) {
                    if (obj.path && obj.path.length) {
                        var icon_1 = "<span class='webix_icon wxi-angle-right'></span>";
                        var rootName_1 = this.app.getService("backend").getRootName();
                        var htmlPath_1 = "";
                        obj.path.forEach(function (chunk, index) {
                            htmlPath_1 += "<span class=\"webix_fmanager_path_chunk\" data-path=\"" + index + "\">" + (index ? chunk : rootName_1) + "</span>";
                            if (index < obj.path.length - 1)
                                htmlPath_1 += icon_1;
                        });
                        return htmlPath_1;
                    }
                    return "";
                };
                PanelView.prototype.ChangePath = function (e) {
                    var chunkInd = e.target.getAttribute("data-path") * 1;
                    var path = this.State.path.split("/");
                    path.splice(chunkInd + 1, path.length - 1);
                    var newPath = path.join("/") || "/";
                    this.State.path = newPath;
                };
                return PanelView;
            }(JetView));
            var InfoPreview = (function (_super) {
                __extends(InfoPreview, _super);
                function InfoPreview() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                InfoPreview.prototype.config = function () {
                    var _this = this;
                    var _ = this.app.getService("locale")._;
                    var dateTimeFormat = webix.Date.dateToStr("%M %j, %Y&nbsp;&nbsp;&nbsp;&nbsp;%H:%i:%s");
                    var mainInfo = {
                        css: "webix_fmanager_preview_info",
                        localId: "info",
                        borderless: true,
                        autoheight: true,
                        template: function (obj) {
                            if (!obj.id)
                                return "";
                            var _ = _this.app.getService("locale")._;
                            var keys = (obj.type === "folder"
                                ? ["Type", "Date"]
                                : ["Type", "Size", "Date"]).map(function (k) { return "<div class='key_value_cell''>" + _(k) + "</div>"; });
                            var keyCol = "<div class='key_col'>" + keys.join("") + "</div>";
                            var values = (obj.type === "folder"
                                ? [capitalize(_(obj.type)), dateTimeFormat(obj.date)]
                                : [
                                    capitalize(_(obj.type)),
                                    formatTemplate(obj.size),
                                    dateTimeFormat(obj.date),
                                ]).map(function (v) { return "<div class='key_value_cell'>" + v + "</div>"; });
                            var valueCol = "<div class=\"value_col\">" + values.join("") + "</div>";
                            return "<div>" + keyCol + valueCol + "</div>";
                        },
                    };
                    var extraInfo = {
                        css: "webix_fmanager_preview_info extra",
                        localId: "extra:info",
                        hidden: true,
                        autoheight: true,
                        template: function (obj) {
                            var tags = Object.keys(obj);
                            var keyCol = "<div class='key_col'>";
                            for (var i = 0; i < tags.length; ++i) {
                                keyCol += "<div class='key_value_cell key'>" + tags[i] + "</div>";
                            }
                            keyCol += "</div>";
                            var valueCol = "<div class='value_col'>";
                            for (var val in obj) {
                                var value = obj[val].trim();
                                valueCol += "<div class='key_value_cell'>" + (value && value != "0"
                                    ? value
                                    : "<span class='webix_fmanager_id3tags-unknown'>Unknown</span>") + "</div>";
                            }
                            valueCol += "</div>";
                            return "<div><div class=\"webix_fmanager_info_header\">\n<span class=\"webix_fmanager_icon fmi-information-outline\"></span>\n<span class=\"webix_fmanager_info_title\">Extra info</span>\n</div>" + keyCol + valueCol + "</div>";
                        },
                    };
                    var counter = {
                        localId: "search:counter",
                        css: "webix_fmanager_preview_info",
                        height: 104,
                        borderless: true,
                        template: function (o) {
                            var keys = [_("Folders"), _("Files")].map(function (k) { return "<div class='key_value_cell''>" + _(k) + "</div>"; });
                            var keyCol = "<div class='key_col search'>" + keys.join("") + "</div>";
                            var values = [o.folders, o.files].map(function (v) { return "<div class='key_value_cell'>" + v + "</div>"; });
                            var valueCol = "<div class=\"value_col search\">" + values.join("") + "</div>";
                            return "<div>" + keyCol + valueCol + "</div>";
                        },
                    };
                    var infoTabs = {
                        localId: "info:tabs",
                        view: "tabview",
                        css: "webix_fmanager_info_tab",
                        cells: [
                            {
                                header: _("Information"),
                                body: {
                                    padding: 14,
                                    margin: 14,
                                    rows: [mainInfo, extraInfo, {}],
                                },
                            },
                            {
                                header: _("Search results"),
                                body: {
                                    padding: 14,
                                    margin: 14,
                                    rows: [counter, {}],
                                },
                            },
                        ],
                    };
                    return infoTabs;
                };
                InfoPreview.prototype.init = function () {
                    var _this = this;
                    this.Tabview = this.$$("info:tabs");
                    this.State = this.getParam("state");
                    this.on(this.State.$changes, "selectedItem", function (v) {
                        _this.ShowInfo(getLastSelected(v));
                    });
                    this.on(this.State.$changes, "searchStats", function (v) {
                        if (v) {
                            _this.$$("search:counter").setValues(v);
                        }
                        else {
                            if (!_this.State.selectedItem.length)
                                _this.Tabview.hide();
                        }
                    });
                };
                InfoPreview.prototype.ShowInfo = function (v) {
                    var _this = this;
                    var tabbar = this.Tabview.getTabbar();
                    var infoId = tabbar.config.options[0].id;
                    var counterId = tabbar.config.options[1].id;
                    if (v.type !== "empty") {
                        this.SetInfo(this.$$("info"), v);
                        this.SwitchTabs(tabbar, counterId, infoId);
                        var extraInfo_1 = this.$$("extra:info");
                        var meta = this.app.getService("backend").getMeta(v);
                        if (!meta)
                            extraInfo_1.hide();
                        else
                            meta
                                .then(function (data) { return _this.SetExtraInfo(extraInfo_1, data); })
                                .fail(function () { return extraInfo_1.hide(); });
                    }
                    else {
                        if (!this.State.search)
                            this.Tabview.hide();
                        else
                            this.SwitchTabs(tabbar, infoId, counterId);
                    }
                };
                InfoPreview.prototype.SetExtraInfo = function (view, data) {
                    if (!_isEmpty(data)) {
                        this.SetInfo(view, data);
                    }
                    else
                        view.hide();
                };
                InfoPreview.prototype.SetInfo = function (view, data) {
                    view.setValues(data);
                    view.show();
                };
                InfoPreview.prototype.SwitchTabs = function (tab, hide, show) {
                    tab.hideOption(hide);
                    tab.setValue(show);
                    tab.showOption(show);
                    this.Tabview.show();
                };
                return InfoPreview;
            }(JetView));
            function _isEmpty(obj) {
                for (var i in obj) {
                    if (typeof obj[i] === "object")
                        return _isEmpty(obj[i]);
                    else if (obj[i] && obj[i] !== "0")
                        return false;
                }
                return true;
            }
            var PreviewView = (function (_super) {
                __extends(PreviewView, _super);
                function PreviewView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PreviewView.prototype.config = function () {
                    var _this = this;
                    var _ = this.app.getService("locale")._;
                    var compact = this.getParam("compact");
                    var skin = webix.skin.$active;
                    var toolbar = {
                        view: "toolbar",
                        localId: "toolbar",
                        height: skin.toolbarHeight + 2,
                        padding: { right: 6 },
                        elements: [
                            {
                                view: "label",
                                localId: "filename:label",
                                css: "webix_fmanager_preview_name",
                            },
                            {
                                view: "icon",
                                icon: "wxi-download",
                                css: "webix_fmanager_spec_icon",
                                localId: "download",
                                tooltip: _("Download file"),
                                click: function () {
                                    _this.app.callEvent("app:action", ["download", [_this.FileInfo]]);
                                },
                            },
                            {
                                view: "icon",
                                icon: "wxi-close",
                                hidden: !compact,
                                click: function () { return _this.app.callEvent("app:action", ["toggle-preview"]); },
                            },
                        ],
                    };
                    var preview = {
                        view: "proxy",
                        minHeight: 413,
                        borderless: true,
                        body: {
                            $subview: true,
                            name: "preview",
                        },
                    };
                    return {
                        margin: 0.1,
                        rows: [
                            toolbar,
                            {
                                view: "scrollview",
                                borderless: true,
                                body: {
                                    type: "wide",
                                    margin: 10,
                                    rows: [preview, InfoPreview],
                                },
                            },
                        ],
                    };
                };
                PreviewView.prototype.init = function () {
                    var _this = this;
                    this.on(this.getParam("state").$changes, "selectedItem", function (v) {
                        var lastSelected = getLastSelected(v);
                        _this.ShowInfo(lastSelected);
                        _this.FileInfo = lastSelected;
                        var downloadIcon = _this.$$("download");
                        if (lastSelected.type === "folder") {
                            downloadIcon.hide();
                        }
                        else {
                            downloadIcon.show();
                        }
                    });
                };
                PreviewView.prototype.ShowInfo = function (v) {
                    var previewUrl = "preview.template";
                    var player = this.app.config.player;
                    if (player && (v.type === "audio" || v.type === "video")) {
                        previewUrl = "preview.media";
                    }
                    if (v.type !== "empty") {
                        this.$$("filename:label").setValue(v.value);
                        this.$$("toolbar").show();
                    }
                    else {
                        this.$$("toolbar").hide();
                    }
                    this.show(previewUrl, {
                        target: "preview",
                        params: {
                            info: v,
                        },
                    });
                };
                return PreviewView;
            }(JetView));
            webix.protoUI({
                name: "plyr-player",
                defaults: {
                    config: {},
                    source: {}
                },
                $init: function () {
                    this.$view.innerHTML = '<div class="webix_player_parent"><audio></audio></div>';
                    this._container = this.$view.firstChild.firstChild;
                    this.$view.style.overflow = "visible";
                    this._waitView = webix.promise.defer();
                    this.$ready.push(this.render);
                },
                getPlayer: function (wait) {
                    return wait ? this._waitView : this._player;
                },
                render: function () {
                    if (this.config.cdn === false || window.Plyr) {
                        this._initPlyr();
                        return;
                    }
                    var cdn = this.config.cdn ? this.config.cdn : "https://cdn.plyr.io/3.5.10";
                    webix.require([
                        cdn + "/plyr.js",
                        cdn + "/plyr.css"
                    ])
                        .then(webix.bind(this._initPlyr, this))
                        .catch(function (e) {
                        console.log(e);
                    });
                },
                _initPlyr: function () {
                    if (this.$view) {
                        var options = webix.extend({}, this.config.config);
                        this._player = new Plyr(this._container, options);
                        this._player.elements.container.setAttribute("tabindex", "-1");
                        this.attachEvent("onDestroy", function () {
                            if (this._player) {
                                this._player.destroy();
                            }
                        });
                        this._waitView.resolve(this._player);
                        this._player.on("canplay", webix.bind(function () {
                            if (this._player.media) {
                                this._player.media.setAttribute("tabindex", "-1");
                                this._normalizeRatio();
                            }
                        }, this));
                        this._player.on("ready", webix.bind(function () {
                            if (this.$view) {
                                this.$view.querySelector(".plyr--full-ui").style["min-width"] = "0px";
                                this._normalizeRatio();
                            }
                        }, this));
                    }
                },
                $setSize: function (x, y) {
                    this.$view.firstChild.style.width = x + "px";
                    this.$view.firstChild.style.height = (y - 2) + "px";
                    if (this._player)
                        this._normalizeRatio(x, y);
                },
                source_setter: function (value) {
                    this._waitView.then(function (player) {
                        if (value)
                            player.source = value;
                    });
                },
                getPlyr: function (wait) {
                    return wait ? this._waitView : this._player;
                },
                _gcdRatio: function (x, y) {
                    x = Math.abs(x);
                    y = Math.abs(y);
                    while (y) {
                        var t = y;
                        y = x % y;
                        x = t;
                    }
                    return x;
                },
                _normalizeRatio: function (x, y) {
                    if (this.$view) {
                        x = x || this.$view.clientWidth;
                        y = y || this.$view.clientHeight;
                        var div = this._gcdRatio(x, y), ratioX = (x / div).toString(), ratioY = (y / div).toString(), ratio = ratioX + ":" + ratioY;
                        this._player.ratio = ratio;
                    }
                }
            }, webix.ui.view, webix.EventSystem);
            var MediaPreview = (function (_super) {
                __extends(MediaPreview, _super);
                function MediaPreview() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MediaPreview.prototype.config = function () {
                    return {
                        rows: [
                            {
                                localId: "albumArt",
                                hidden: true,
                                css: "webix_fmanager_preview",
                                template: "<img class=\"webix_fmanager_preview_icon\" src=\"" + this.app
                                    .getService("backend")
                                    .icon({ type: "audio" }, "big") + "\" />",
                            },
                            {
                                view: "plyr-player",
                                css: "webix_fmanager_player",
                                localId: "player",
                                config: {
                                    controls: [
                                        "play-large",
                                        "play",
                                        "progress",
                                        "current-time",
                                        "mute",
                                        "volume",
                                    ],
                                },
                            },
                        ],
                    };
                };
                MediaPreview.prototype.init = function () {
                    var _this = this;
                    var node = this.$$("albumArt").$view;
                    webix.event(node, "dblclick", function () {
                        var info = _this.getParam("info");
                        _this.app.callEvent("app:action", ["open", [info]]);
                    });
                };
                MediaPreview.prototype.urlChange = function () {
                    var info = this.getParam("info");
                    this.ShowPreview(info);
                };
                MediaPreview.prototype.ShowPreview = function (info) {
                    if (!info)
                        return;
                    var url = this.app.getService("backend").directLink(info.id);
                    this.SetMedia(url, info.type, info.$ext);
                    var art = this.$$("albumArt");
                    var player = this.$$("player");
                    if (info.type === "audio") {
                        player.config.height = 52;
                        art.show();
                    }
                    else {
                        player.config.height = 0;
                        art.hide();
                    }
                };
                MediaPreview.prototype.SetMedia = function (src, type, ext) {
                    var player = this.$$("player");
                    player.define({
                        source: {
                            type: type,
                            sources: [
                                {
                                    src: src,
                                    type: type + "/" + ext,
                                },
                            ],
                        },
                    });
                };
                return MediaPreview;
            }(JetView));
            var TemplatePreview = (function (_super) {
                __extends(TemplatePreview, _super);
                function TemplatePreview() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TemplatePreview.prototype.config = function () {
                    return {
                        view: "template",
                        localId: "preview",
                        css: "webix_fmanager_preview",
                    };
                };
                TemplatePreview.prototype.init = function () {
                    var _this = this;
                    var node = this.getRoot().$view;
                    webix.event(node, "dblclick", function () {
                        var info = _this.getParam("info");
                        if (info.type === "code" && _this.app.config.editor) {
                            _this.app.callEvent("app:action", ["edit", [info]]);
                        }
                        else if (info.type !== "folder" && info.type !== "empty") {
                            _this.app.callEvent("app:action", ["open", [info]]);
                        }
                    });
                };
                TemplatePreview.prototype.urlChange = function () {
                    var info = this.getParam("info");
                    this.ShowPreview(info);
                };
                TemplatePreview.prototype.ShowPreview = function (info) {
                    var preview = this.$$("preview");
                    if (info.type === "folder") {
                        preview.setHTML("<img class=\"webix_fmanager_preview_icon\" src=\"" + this.app
                            .getService("backend")
                            .icon({ type: "folder" }, "big") + "\" />");
                    }
                    else if (info.type === "empty") {
                        preview.setHTML("<img class=\"webix_fmanager_preview_icon\" src=\"" + this.app
                            .getService("backend")
                            .icon({ type: "none" }, "big") + "\" />");
                    }
                    else {
                        var origin_1 = this.app.getService("backend").previewURL(info, 464, 407);
                        preview.setHTML("<img style='width:100%; height:100%;' src='" + origin_1 + "' onerror='this.style.display=\"none\"'>");
                    }
                };
                return TemplatePreview;
            }(JetView));
            var ProgressView = (function (_super) {
                __extends(ProgressView, _super);
                function ProgressView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ProgressView.prototype.config = function () {
                    var _this = this;
                    this.Config = this.getParam("config");
                    return {
                        view: "window",
                        position: "center",
                        modal: true,
                        css: "webix_fmanager_progress",
                        head: {
                            template: this.Config.head,
                            css: "webix_fmanager_progress_head",
                            height: 54,
                        },
                        body: {
                            padding: { top: 0, bottom: 20, left: 20, right: 20 },
                            margin: 10,
                            rows: [
                                {
                                    template: function (obj) {
                                        return "<div class=\"webix_fmanager_progress_bar\">\n<div class=\"webix_fmanager_progress_counter\">" + obj.done + " of " + obj.total + " items</div>\n<div class=\"webix_fmanager_progress_name\">" + obj.file + "</div></div>";
                                    },
                                    localId: "counter",
                                    borderless: true,
                                    height: 59,
                                },
                                {
                                    view: "button",
                                    value: "Stop",
                                    css: "webix_fmanager_progress_cancel",
                                    click: function () {
                                        _this.State.cancel = true;
                                        _this.getRoot().disable();
                                    },
                                },
                            ],
                        },
                    };
                };
                ProgressView.prototype.init = function () {
                    var _this = this;
                    this.WaitClose = webix.promise.defer();
                    this.Counter = this.$$("counter");
                    this.Counter.setValues({
                        done: 0,
                        total: this.Config.files.length,
                        file: this.Config.files[0],
                    });
                    webix.extend(this.Counter, webix.ProgressBar);
                    this.State = createState({ i: 0, cancel: false });
                    iterateAsync(this.Config.files, this.Config.code, this.State).finally(function () {
                        return _this.Close();
                    });
                    this.on(this.State.$changes, "i", function (i) { return _this.Step(i + 1); });
                };
                ProgressView.prototype.Close = function () {
                    this.Counter.showProgress({ type: "bottom", position: 1, delay: 100 });
                    this.show("_blank", { target: "popup" });
                    this.WaitClose.resolve();
                };
                ProgressView.prototype.Step = function (i) {
                    var done = this.Counter.getValues().done;
                    this.Counter.setValues({ done: i, file: this.Config.files[i - 1] }, true);
                    done = (done + 1) / this.Config.files.length;
                    this.Counter.showProgress({
                        type: "bottom",
                        position: Math.min(1, done),
                        delay: 100,
                    });
                };
                return ProgressView;
            }(JetView));
            webix.protoUI({
                name: "r-layout",
                sizeTrigger: function (width, handler, value) {
                    this._compactValue = value;
                    this._compactWidth = width;
                    this._compactHandler = handler;
                    this._checkTrigger(this.$view.width, value);
                },
                _checkTrigger: function (x, value) {
                    if (this._compactWidth) {
                        if ((x <= this._compactWidth && !value) ||
                            (x > this._compactWidth && value)) {
                            this._compactWidth = null;
                            this._compactHandler(!value);
                            return false;
                        }
                    }
                    return true;
                },
                $setSize: function (x, y) {
                    if (this._checkTrigger(x, this._compactValue))
                        return webix.ui.layout.prototype.$setSize.call(this, x, y);
                },
            }, webix.ui.layout);
            var TopBarView = (function (_super) {
                __extends(TopBarView, _super);
                function TopBarView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TopBarView.prototype.config = function () {
                    var _this = this;
                    var compact = this.getParam("compact");
                    var skin = webix.skin.$active;
                    var _ = this.app.getService("locale")._;
                    var bar = {
                        view: "toolbar",
                        height: skin.toolbarHeight + 12,
                        margin: 20,
                        paddingY: 9,
                        paddingX: 12,
                        cols: [
                            {
                                view: "icon",
                                icon: "webix_fmanager_icon fmi-file-tree",
                                click: function () { return _this.app.callEvent("app:action", ["toggle-folders"]); },
                                hidden: !compact,
                            },
                            { view: "label", label: _("Files"), autowidth: true, hidden: compact },
                            {
                                view: "search",
                                width: compact ? 0 : 300,
                                localId: "search",
                                placeholder: _("Search files and folders"),
                            },
                            { hidden: compact },
                            {
                                view: "toggle",
                                css: "webix_fmanager_preview_toggle",
                                type: "icon",
                                icon: "wxi-eye",
                                tooltip: _("Preview"),
                                width: skin.toolbarHeight < 37 ? 48 : 60,
                                localId: "previewMode",
                                click: function () { return _this.app.callEvent("app:action", ["toggle-preview"]); },
                                hidden: compact,
                            },
                            {
                                view: "segmented",
                                width: 124,
                                optionWidth: 40,
                                localId: "modes",
                                tooltip: function (conf) {
                                    switch (conf.id) {
                                        case "grid":
                                            return _("Table");
                                        case "cards":
                                            return _("Cards");
                                        case "double":
                                            return _("Total");
                                        default:
                                            return capitalize(conf.id + "");
                                    }
                                },
                                options: [
                                    { value: gridMode, id: "grid" },
                                    { value: cardMode, id: "cards" },
                                    { value: doubleMode, id: "double" },
                                ],
                            },
                        ],
                    };
                    return bar;
                };
                TopBarView.prototype.init = function () {
                    var common = this.getParam("state");
                    var modes = this.$$("modes");
                    modes.attachEvent("onChange", function (v) {
                        if (v) {
                            common.$batch({
                                mode: v,
                                search: "",
                            });
                        }
                    });
                    this.on(common.$changes, "mode", function (v) {
                        if (modes.getOption(v))
                            modes.setValue(v);
                        else
                            modes.setValue();
                    });
                    var search = this.$$("search");
                    search.attachEvent("onTimedKeyPress", function () {
                        common.search = search.getValue().trim();
                    });
                    this.on(common.$changes, "search", function (s) {
                        s = s.trim();
                        search.setValue(s);
                    });
                    this.on(handler(), (webix.env.isMac ? "COMMAND" : "CTRL") + " + F", function (v, e) {
                        search.focus();
                        webix.html.preventEvent(e);
                    });
                };
                return TopBarView;
            }(JetView));
            var TopView = (function (_super) {
                __extends(TopView, _super);
                function TopView() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TopView.prototype.config = function () {
                    var fCompact = this.getParam("forceCompact");
                    if (typeof fCompact !== "undefined")
                        this.setParam("compact", fCompact);
                    this.Compact = this.getParam("compact");
                    var tree = {
                        view: "proxy",
                        localId: "tree",
                        width: 240,
                        minWidth: 240,
                        maxWidth: 400,
                        hidden: true,
                        borderless: true,
                        body: FoldersView,
                    };
                    var panels = {
                        type: "wide",
                        cols: [
                            { $subview: true, name: "center", branch: true },
                            {
                                view: "proxy",
                                borderless: true,
                                width: 470,
                                hidden: true,
                                localId: "r-side",
                                body: {
                                    $subview: "",
                                    branch: true,
                                    name: "r-side",
                                },
                            },
                        ],
                    };
                    if (!this.Compact)
                        panels.cols.unshift(tree, { view: "resizer" });
                    return {
                        view: typeof fCompact === "undefined" ? "r-layout" : "layout",
                        type: "wide",
                        rows: [TopBarView, panels, { $subview: true, popup: true, name: "popup" }],
                    };
                };
                TopView.prototype.init = function () {
                    var _this = this;
                    var root = this.getRoot();
                    if (root.sizeTrigger)
                        root.sizeTrigger(this.app.config.compactWidth, function (mode) { return _this.SetCompactMode(mode); }, !!this.Compact);
                    var state = this.getParam("state");
                    this.State = state;
                    if (this.Compact) {
                        this.Tree = { show: dummy, hide: dummy };
                        this.SideTree = this.ui(SideTreeView);
                        this.PreviewPopup = this.ui(PreviewPopupView);
                    }
                    else {
                        this.Tree = this.$$("tree");
                    }
                    this.on(this.app, "app:action", function (name) {
                        switch (name) {
                            case "toggle-preview":
                                _this.TogglePreview();
                                break;
                            case "toggle-folders":
                                _this.ToggleFolders();
                                break;
                        }
                    });
                    this.on(state.$changes, "mode", function (v, o) { return _this.ShowMode(v, o); });
                    this.on(state.$changes, "search", function (v) { return _this.ShowSearch(v); });
                    this.app
                        .getService("progress")
                        .handle(this.getRoot(), this.ShowProgress.bind(this));
                };
                TopView.prototype.ShowMode = function (v, o) {
                    var params = { state: this.getParam("state"), compact: this.Compact };
                    if (v === "grid") {
                        this.Tree.show();
                        this.show("panel/list", {
                            target: "center",
                            params: params,
                        });
                    }
                    else if (v === "cards") {
                        this.Tree.show();
                        this.show("panel/cards", {
                            target: "center",
                            params: params,
                        });
                    }
                    else if (v === "double") {
                        this.Tree.hide();
                        this.show("panel-double", {
                            target: "center",
                            params: params,
                        });
                    }
                    else if (v === "search") {
                        this.Tree.hide();
                        this.PrevMode = this.PrevMode || o;
                        this.show("panel-search/cards", {
                            target: "center",
                            params: params,
                        });
                    }
                };
                TopView.prototype.ShowProgress = function (params) {
                    var _this = this;
                    return this.show("./progress", {
                        target: "popup",
                        params: params,
                    }).then(function () { return _this.getSubView("popup"); });
                };
                TopView.prototype.TogglePreview = function () {
                    if (!this.Compact) {
                        var side = this.$$("r-side");
                        if (!side.isVisible()) {
                            this.show("preview", {
                                target: "r-side",
                                params: { state: this.State },
                            });
                            side.show();
                        }
                        else {
                            this.show("_blank", { target: "r-side" });
                            side.hide();
                        }
                    }
                    else {
                        if (!this.PreviewPopup.IsVisible()) {
                            this.PreviewPopup.Show({ state: this.State });
                        }
                        else {
                            this.PreviewPopup.Hide();
                        }
                    }
                };
                TopView.prototype.ToggleFolders = function () {
                    if (!this.SideTree.IsVisible()) {
                        this.SideTree.Show();
                    }
                };
                TopView.prototype.ShowSearch = function (value) {
                    if (value) {
                        this.State.mode = "search";
                    }
                    else {
                        if (this.State.mode === "search")
                            this.State.mode = this.PrevMode || "grid";
                        this.PrevMode = "";
                    }
                };
                TopView.prototype.SetCompactMode = function (mode) {
                    this.setParam("compact", mode);
                    this.refresh();
                };
                return TopView;
            }(JetView));
            function dummy() { }
            var views = { JetView: JetView };
            views["cards"] = CardsView;
            views["editor"] = EditorView;
            views["folders"] = FoldersView;
            views["list"] = GridView;
            views["menus/addnewmenu"] = AddNewMenuView;
            views["menus/contextmenu"] = ContextMenuView;
            views["menus/menubody"] = MenuBodyView;
            views["mobile/previewpopup"] = PreviewPopupView;
            views["mobile/sidetree"] = SideTreeView;
            views["panel-double"] = DoublePanelView;
            views["panel-search"] = PanelSearchView;
            views["panel"] = PanelView;
            views["preview"] = PreviewView;
            views["preview/info"] = InfoPreview;
            views["preview/media"] = MediaPreview;
            views["preview/template"] = TemplatePreview;
            views["progress"] = ProgressView;
            views["sections/dataview"] = DataViewBase;
            views["top"] = TopView;
            views["topbar"] = TopBarView;
            var en = {
                Save: "Save",
                Rename: "Rename",
                Open: "Open",
                Edit: "Edit",
                Delete: "Delete",
                Folder: "Folder",
                "Add New": "Add New",
                "My Files": "My Files",
                Size: "Size",
                Date: "Date",
                "back to parent folder": "back to parent folder",
                Download: "Download",
                Type: "Type",
                Information: "Information",
                Files: "Files",
                Table: "Table",
                Cards: "Cards",
                Total: "Total",
                "Are you sure ?": "Are you sure ?",
                Details: "Details",
                "Enter a new name": "Enter a new name",
                Add: "Add",
                "Select something": "Select something",
                "Download file": "Download file",
                Preview: "Preview",
                Refresh: "Refresh",
                "Are you sure you want to exit without saving?": "Are you sure you want to exit without saving?",
                Copy: "Copy",
                Cut: "Cut",
                Paste: "Paste",
                "Deleting...": "Deleting...",
                "Copying...": "Copying...",
                "Moving...": "Moving...",
                Folders: "Folders",
                "Search results": "Search results",
                "Search results in": "Search results in",
                "Search files and folders": "Search files and folders",
                "Add new file": "Add new file",
                "Add new folder": "Add new folder",
                "Upload file": "Upload file",
                folder: "folder",
                file: "file",
                archive: "archive",
                audio: "audio",
                image: "image",
                video: "video",
                code: "code",
                document: "document",
                of: "of",
                used: "used",
                "Open item location": "Open item location",
                "Are you sure you want to delete": "Are you sure you want to delete",
                "these items:": "these items:",
                "this item:": "this item:",
                "Delete files": "Delete files",
                and: "and",
                "more file(s)": "more file(s)",
            };
            var Backend = (function () {
                function Backend(app, url) {
                    this.app = app;
                    this._url = url;
                    this._features = { preview: {}, meta: {} };
                }
                Backend.prototype.url = function (path) {
                    return this._url + path;
                };
                Backend.prototype.search = function (id, search) {
                    id = id || "/";
                    return this._files(this.url("files"), { id: id, search: search });
                };
                Backend.prototype.files = function (id) {
                    id = id || "/";
                    return this._files(this.url("files"), { id: id });
                };
                Backend.prototype._files = function (url, params) {
                    var data = webix.ajax(url, params).then(function (res) { return res.json(); });
                    return this.getInfo().then(function () { return data; });
                };
                Backend.prototype.folders = function (id) {
                    id = id || "/";
                    var data = webix.ajax(this.url("folders"), { id: id });
                    return data.then(function (a) { return a.json(); });
                };
                Backend.prototype.icon = function (obj, size) {
                    return this.url("icons/" + (size || "small") + "/" + obj.type + "/" + obj.$ext + ".svg");
                };
                Backend.prototype.upload = function () {
                    return this.url("upload");
                };
                Backend.prototype.readText = function (id) {
                    return webix.ajax(this.url("text"), { id: id }).then(function (data) { return data.text(); });
                };
                Backend.prototype.writeText = function (id, content) {
                    return webix
                        .ajax()
                        .post(this.url("text"), {
                        id: id,
                        content: content,
                    })
                        .then(function (r) { return r.json(); });
                };
                Backend.prototype.directLink = function (id, download) {
                    return this.url("direct?id=" + encodeURIComponent(id) + (download ? "&download=true" : ""));
                };
                Backend.prototype.previewURL = function (obj, width, height) {
                    if (!this._features.preview[obj.type])
                        return this.icon(obj, "big");
                    return this.url("preview?width=" + width + "&height=" + height + "&id=" + encodeURIComponent(obj.id));
                };
                Backend.prototype.remove = function (id) {
                    return webix
                        .ajax()
                        .post(this.url("delete"), {
                        id: id,
                    })
                        .then(function (r) { return r.json(); });
                };
                Backend.prototype.makedir = function (id, name) {
                    return webix
                        .ajax()
                        .post(this.url("makedir"), {
                        id: id,
                        name: name,
                    })
                        .then(function (r) { return r.json(); });
                };
                Backend.prototype.makefile = function (id, name) {
                    return webix
                        .ajax()
                        .post(this.url("makefile"), {
                        id: id,
                        name: name,
                    })
                        .then(function (r) { return r.json(); });
                };
                Backend.prototype.copy = function (id, to) {
                    return webix
                        .ajax()
                        .post(this.url("copy"), {
                        id: id,
                        to: to,
                    })
                        .then(function (r) { return r.json(); });
                };
                Backend.prototype.move = function (id, to) {
                    return webix
                        .ajax()
                        .post(this.url("move"), {
                        id: id,
                        to: to,
                    })
                        .then(function (r) { return r.json(); });
                };
                Backend.prototype.rename = function (id, name) {
                    return webix
                        .ajax()
                        .post(this.url("rename"), {
                        id: id,
                        name: name,
                    })
                        .then(function (r) { return r.json(); });
                };
                Backend.prototype.getRootName = function () {
                    var _ = this.app.getService("locale")._;
                    return _("My Files");
                };
                Backend.prototype.getMeta = function (obj) {
                    if (!this._features.meta[obj.type])
                        return false;
                    return webix
                        .ajax(this.url("meta"), {
                        id: obj.id,
                    })
                        .then(function (r) { return r.json(); });
                };
                Backend.prototype.getInfo = function (force) {
                    var _this = this;
                    if (this._info && !force)
                        return this._info;
                    return (this._info = webix.ajax(this.url("info")).then(function (resp) {
                        resp = resp.json();
                        _this._features = resp.features;
                        return resp;
                    }));
                };
                return Backend;
            }());
            var Cache = (function () {
                function Cache(limit) {
                    this._store = new Map();
                    this._limit = limit;
                    this._i = 1;
                }
                Cache.prototype.each = function (code) {
                    this._store.forEach(function (a) { return code(a.obj); });
                };
                Cache.prototype.set = function (key, obj) {
                    if (this._store.size >= this._limit)
                        this.prune();
                    this._store.set(key, {
                        obj: obj,
                        key: key,
                        t: this._i++,
                    });
                };
                Cache.prototype.get = function (key) {
                    var rec = this._store.get(key);
                    if (!rec)
                        return null;
                    rec.t = this._i++;
                    return rec.obj;
                };
                Cache.prototype.prune = function () {
                    var temp = [];
                    this._store.forEach(function (a) { return temp.push(a); });
                    temp = temp.sort(function (a, b) { return (a.t > b.t ? -1 : 1); });
                    for (var i = Math.floor(this._limit / 2); i < temp.length; i++) {
                        this._store.delete(temp[i].key);
                    }
                };
                Cache.prototype.delete = function (key) {
                    if (this._store.has(key))
                        this._store.delete(key);
                };
                Cache.prototype.clear = function () {
                    this._store.clear();
                };
                return Cache;
            }());
            var LocalData = (function () {
                function LocalData(app, size) {
                    this.app = app;
                    this.fscache = new Cache(size);
                    this.hierarchy = new webix.TreeCollection();
                    this.folders_ready = null;
                }
                LocalData.prototype.defaultDir = function (id) {
                    var dir = [];
                    if (id !== "/")
                        dir.push({
                            type: "folder",
                            value: "..",
                            $row: function (obj, common) {
                                return (common.backIcon() +
                                    ("<span class='webix_fmanager_back'>" + common.backLabel() + "</span>"));
                            },
                        });
                    return dir;
                };
                LocalData.prototype.files = function (path, sync) {
                    var fs = this.fscache.get(path);
                    if (sync)
                        return fs;
                    if (fs)
                        return Promise.resolve(fs);
                    fs = new webix.DataCollection({
                        scheme: {
                            $change: this.prepareData,
                            $serialize: this.serializeData,
                        },
                    });
                    this.fscache.set(path, fs);
                    return this.reload(fs, path);
                };
                LocalData.prototype.serializeData = function (a) {
                    if (a.value == "..")
                        return false;
                    else {
                        var o = {};
                        for (var f in a) {
                            if (f.indexOf("$") !== 0)
                                o[f] = a[f];
                        }
                        return o;
                    }
                };
                LocalData.prototype.prepareData = function (a) {
                    if (typeof a.date === "number")
                        a.date = new Date(a.date * 1000);
                    if (a.type === "folder")
                        a.$css = a.type;
                    else
                        a.$ext = ext(a.value);
                };
                LocalData.prototype.reload = function (fs, path) {
                    var _this = this;
                    return this.app
                        .getService("backend")
                        .files(path)
                        .then(function (data) {
                        fs.clearAll();
                        fs.parse(_this.defaultDir(path).concat(data));
                        return fs;
                    });
                };
                LocalData.prototype.refresh = function (path) {
                    var fs = this.fscache.get(path);
                    if (fs)
                        return this.reload(fs, path);
                };
                LocalData.prototype.addFile = function (id, item) {
                    var fs = this.fscache.get(id);
                    if (fs) {
                        if (!fs.exists(item.id)) {
                            fs.add(item, this.getFsPosition(fs, item));
                        }
                    }
                    if (item.type === "folder") {
                        if (id === "/")
                            id = "../files";
                        this.hierarchy.add(item, null, id);
                    }
                };
                LocalData.prototype.getFsPosition = function (fs, item) {
                    if (item.type !== "folder")
                        return -1;
                    var d = fs.data;
                    return d.order.findIndex(function (a) { return d.getItem(a).type !== "folder"; });
                };
                LocalData.prototype.deleteFile = function (item) {
                    var _a = this, fscache = _a.fscache, hierarchy = _a.hierarchy;
                    fscache.each(function (fs) {
                        if (fs && fs.exists(item))
                            fs.remove(item);
                    });
                    fscache.delete(item);
                    if (hierarchy.exists(item))
                        hierarchy.remove(item);
                };
                LocalData.prototype.updateFile = function (oldId, data, newId) {
                    var hierarchy = this.hierarchy;
                    this.fscache.each(function (fs) {
                        if (fs && fs.exists(oldId)) {
                            fs.updateItem(oldId, data);
                            if (newId && oldId != newId)
                                fs.data.changeId(oldId, newId);
                        }
                    });
                    if (hierarchy.exists(oldId)) {
                        hierarchy.updateItem(oldId, data);
                        if (newId && oldId != newId) {
                            hierarchy.data.changeId(oldId, newId);
                        }
                    }
                };
                LocalData.prototype.defaultTree = function () {
                    return [{ value: "My Files", id: "../files", open: true }];
                };
                LocalData.prototype.folders = function (force) {
                    var _this = this;
                    var hierarchy = this.hierarchy;
                    if (force || !this.folders_ready) {
                        this.folders_ready = this.app
                            .getService("backend")
                            .folders()
                            .then(function (data) {
                            hierarchy.clearAll();
                            hierarchy.parse(_this.defaultTree());
                            hierarchy.parse({ parent: "../files", data: data });
                            return hierarchy;
                        });
                    }
                    return this.folders_ready;
                };
                return LocalData;
            }());
            var UploadHandler = (function () {
                function UploadHandler(app, state) {
                    this.initUploader(app);
                    this.initEvents(app, state);
                }
                UploadHandler.prototype.initEvents = function (app, state) {
                    app.attachEvent("app:action", function (name, info) {
                        if (name == "upload") {
                            info = info || (state.path || "/");
                            app.getService("upload").fileDialog(info);
                        }
                    });
                };
                UploadHandler.prototype.initUploader = function (app) {
                    this.uploader = webix.ui({
                        view: "uploader",
                        apiOnly: true,
                        upload: app.getService("backend").upload(),
                        on: {
                            onAfterFileAdd: function (item) {
                                item.urlData = this.config.tempUrlData;
                            },
                            onFileUpload: function (file, res) {
                                app.getService("local").addFile(file.urlData.id, res);
                            },
                            onUploadComplete: function () {
                                app.getService("progress").end();
                                app.callEvent("reload:fs:stats", []);
                            },
                        },
                    });
                    this.uploader.$updateProgress = function (_, percent) {
                        app.getService("progress").start(percent / 100);
                    };
                };
                UploadHandler.prototype.getUploader = function () {
                    return this.uploader;
                };
                UploadHandler.prototype.fileDialog = function (id) {
                    this.uploader.config.tempUrlData = { id: id };
                    this.uploader.fileDialog();
                };
                return UploadHandler;
            }());
            var Progress = (function () {
                function Progress() {
                    this.view = null;
                    this.popup = null;
                }
                Progress.prototype.handle = function (view, popup) {
                    this.view = view;
                    webix.extend(view, webix.ProgressBar);
                    this.popup = popup;
                };
                Progress.prototype.start = function (size) {
                    var view = this.view;
                    if (!view || view.$destructed)
                        return;
                    view.showProgress({
                        type: "top",
                        delay: 3000,
                        hide: true,
                        progress: size || 0,
                    });
                };
                Progress.prototype.end = function () {
                    var view = this.view;
                    if (!view || view.$destructed)
                        return;
                    view.hideProgress();
                };
                Progress.prototype.files = function (head, files, code) {
                    var _this = this;
                    if (!files.length)
                        return;
                    if (files.length == 1) {
                        this.start();
                        return code(files[0], 0).finally(function () { return _this.end(); });
                    }
                    if (this.popup)
                        return this.popup({
                            config: { head: head, files: files, code: code },
                        }).then(function (popup) { return popup.WaitClose; });
                };
                return Progress;
            }());
            var Operations = (function () {
                function Operations(app, state) {
                    this.app = app;
                    this.state = state;
                    this.initEvents();
                }
                Operations.prototype.backend = function () {
                    return this.app.getService("backend");
                };
                Operations.prototype.local = function () {
                    return this.app.getService("local");
                };
                Operations.prototype.initEvents = function () {
                    var _this = this;
                    this.app.attachEvent("app:action", function (name, info) {
                        switch (name) {
                            case "open":
                                _this.open(info);
                                break;
                            case "download":
                                _this.download(info);
                                break;
                            case "edit":
                                _this.edit(info);
                                break;
                            case "delete":
                                _this.remove(info);
                                break;
                            case "makefile":
                                _this.makeFile(info);
                                break;
                            case "makedir":
                                _this.makeFolder(info);
                                break;
                            case "rename":
                                _this.rename(info);
                                break;
                            case "copy":
                            case "cut":
                                _this.addToClipboard(name);
                                break;
                            case "paste":
                                _this.paste();
                                break;
                            case "locate":
                                _this.goUp(info);
                        }
                    });
                };
                Operations.prototype.write = function (id, content) {
                    var _this = this;
                    return this.backend()
                        .writeText(id, content)
                        .then(function (data) {
                        return _this.local().updateFile(id, { size: data.size, date: data.date });
                    });
                };
                Operations.prototype.read = function (id) {
                    return this.backend().readText(id);
                };
                Operations.prototype.makeFile = function (name) {
                    var _this = this;
                    var id = this.state.path || "/";
                    this.backend()
                        .makefile(id, name)
                        .then(function (res) {
                        if (!res.invalid)
                            _this.local().addFile(id, res);
                    });
                };
                Operations.prototype.makeFolder = function (name) {
                    var _this = this;
                    var id = this.state.path || "/";
                    this.backend()
                        .makedir(id, name)
                        .then(function (res) {
                        if (!res.invalid)
                            _this.local().addFile(id, res);
                    });
                };
                Operations.prototype.edit = function (f) {
                    var state = this.state;
                    if (!f)
                        f = state.selectedItem;
                    var file = f[0];
                    if (f.length && file.type === "code")
                        this.app.show("/editor", {
                            params: {
                                file: file,
                                state: state,
                            },
                        });
                };
                Operations.prototype.open = function (f) {
                    if (!f)
                        f = this.state.selectedItem;
                    for (var i = 0; i < f.length; ++i) {
                        if (f[i].type != "folder") {
                            window.open(this.backend().directLink(f[i].id), "_blank");
                        }
                    }
                };
                Operations.prototype.download = function (f) {
                    if (!f)
                        f = this.state.selectedItem;
                    window.open(this.backend().directLink(f[0].id, true), "_self");
                };
                Operations.prototype.remove = function (files) {
                    var _this = this;
                    var state = this.state;
                    files = this.extractIds(files || state.selectedItem);
                    if (!files.length)
                        return;
                    var _ = this.app.getService("locale")._;
                    return webix
                        .confirm({
                        title: _("Delete files"),
                        text: this.removeConfirmMessage(state.selectedItem),
                        css: "webix_fmanager_confirm",
                    })
                        .then(function () {
                        return _this.app
                            .getService("progress")
                            .files(_("Deleting..."), files, function (f) {
                            return _this.backend()
                                .remove(f)
                                .then(function (res) {
                                if (!res.invalid) {
                                    _this.local().deleteFile(f);
                                    if (state.path === f) {
                                        state.path = "/";
                                    }
                                    _this.app.callEvent("pathChanged", [f, "/"]);
                                    _this.app.callEvent("reload:fs:stats", []);
                                }
                            });
                        });
                    })
                        .then(function () {
                        if (state.search) {
                            state.search = state.search + " ";
                        }
                    });
                };
                Operations.prototype.removeConfirmMessage = function (files) {
                    var _ = this.app.getService("locale")._;
                    var message = "<div class=\"question\">" + _("Are you sure you want to delete") + " " + (files.length > 1 ? _("these items:") : _("this item:")) + "</div>";
                    var i = 0;
                    var icon = "&#9679;&nbsp;";
                    for (var limit = files.length < 6 ? files.length : 5; i < limit; ++i) {
                        message += "<div class=\"item\">" + icon + files[i].value + "</div>";
                    }
                    if (i < files.length) {
                        message += "<div>" + icon + _("and") + " " + (files.length - i) + " " + _("more file(s)") + "</div>";
                    }
                    return message;
                };
                Operations.prototype.rename = function (f) {
                    var _this = this;
                    var state = this.state;
                    var file = f ? f[0] : state.selectedItem[0];
                    if (!file)
                        return;
                    var _ = this.app.getService("locale")._;
                    var oldId = file.id;
                    prompt({
                        text: _("Enter a new name"),
                        button: _("Rename"),
                        value: file.value,
                        selectMask: file.type !== "folder" ? fileNameSelectMask : null,
                    }).then(function (name) {
                        name = safeName(name);
                        if (name && name !== file.value)
                            _this.backend()
                                .rename(oldId, name)
                                .then(function (res) {
                                _this.local().updateFile(oldId, { value: name }, res.id);
                                if (file.type === "folder")
                                    _this.reloadBranch(res.id).then(function () {
                                        if (state.path === oldId) {
                                            state.path = res.id;
                                        }
                                        _this.app.callEvent("pathChanged", [oldId, res.id]);
                                    });
                                if (state.search) {
                                    state.search = state.search + " ";
                                }
                            });
                    });
                };
                Operations.prototype.reloadBranch = function (id) {
                    var hierarchy = this.local().hierarchy;
                    return this.app
                        .getService("backend")
                        .folders(id)
                        .then(function (data) {
                        var toRemove = [];
                        hierarchy.data.eachChild(id, function (obj) { return toRemove.push(obj.id); });
                        hierarchy.parse({ parent: id, data: data });
                        hierarchy.remove(toRemove);
                    });
                };
                Operations.prototype.copy = function (files, targetFolder) {
                    var _this = this;
                    if (!files.length)
                        return;
                    var local = this.local();
                    var _ = this.app.getService("locale")._;
                    return this.app.getService("progress").files(_("Copying..."), files, function (f) {
                        return _this.backend()
                            .copy(f, targetFolder)
                            .then(function (res) {
                            if (!res.invalid) {
                                local.addFile(targetFolder, res);
                            }
                        });
                    });
                };
                Operations.prototype.move = function (files, targetFolder) {
                    var _this = this;
                    if (!files.length || !targetFolder)
                        return;
                    var local = this.local();
                    var tfs = local.files(targetFolder, true);
                    if (tfs)
                        files = files.filter(function (a) { return !tfs.exists(a); });
                    files = files.filter(function (a) { return a != targetFolder; });
                    if (!files.length)
                        return;
                    var _ = this.app.getService("locale")._;
                    return this.app.getService("progress").files(_("Moving..."), files, function (f) {
                        return _this.backend()
                            .move(f, targetFolder)
                            .then(function (res) {
                            if (!res.invalid) {
                                local.deleteFile(f);
                                local.addFile(targetFolder, res);
                                if (_this.state.path === f) {
                                    _this.state.path = res.id;
                                }
                                _this.app.callEvent("pathChanged", [f, res.id]);
                            }
                        });
                    });
                };
                Operations.prototype.extractIds = function (files) {
                    if (!files.length || typeof files[0] == "string")
                        return files;
                    var ids = [];
                    for (var i = 0; i < files.length; ++i) {
                        ids.push(files[i].id);
                    }
                    return ids;
                };
                Operations.prototype.addToClipboard = function (mode) {
                    var ids = this.extractIds(this.state.selectedItem);
                    if (ids.length)
                        this.state.clipboard = {
                            files: ids,
                            mode: mode,
                        };
                };
                Operations.prototype.clearClipboard = function () {
                    this.state.clipboard = null;
                };
                Operations.prototype.paste = function () {
                    var state = this.state;
                    if (!state.clipboard)
                        return;
                    if (state.clipboard.mode === "copy") {
                        this.copy(state.clipboard.files, state.path);
                    }
                    else if (state.clipboard.mode === "cut") {
                        this.move(state.clipboard.files, state.path);
                    }
                    this.clearClipboard();
                };
                Operations.prototype.goUp = function (files) {
                    var state = this.state;
                    if (state.search) {
                        var file = files ? files[0] : state.selectedItem[0];
                        if (!file)
                            return;
                        var up = file.id.split("/");
                        var path = "/" + up.slice(1, up.length - 1).join("/");
                        state.$batch({
                            search: "",
                            searchStats: null,
                            path: path,
                        });
                    }
                };
                return Operations;
            }());
            var App = (function (_super) {
                __extends(App, _super);
                function App(config) {
                    var _this = this;
                    var state = createState({
                        mode: config.mode || "grid",
                        selectedItem: [],
                        search: "",
                        searchStats: null,
                        path: config.path || "/",
                        source: config.source || "files",
                        clipboard: null,
                    });
                    var defaults = {
                        router: EmptyRouter,
                        version: "8.0.0",
                        debug: true,
                        start: "/top",
                        params: { state: state, forceCompact: config.compact },
                        editor: true,
                        player: true,
                        compactWidth: 640,
                    };
                    _this = _super.call(this, __assign(__assign({}, defaults), config)) || this;
                    _this.setService("backend", new (_this.dynamic(Backend))(_this, _this.config.url));
                    _this.setService("local", new (_this.dynamic(LocalData))(_this, 10));
                    _this.setService("progress", new (_this.dynamic(Progress))(_this));
                    _this.setService("upload", new (_this.dynamic(UploadHandler))(_this, state));
                    _this.setService("operations", new (_this.dynamic(Operations))(_this, state));
                    _this.use(plugins.Locale, _this.config.locale || {
                        lang: "en",
                        webix: {
                            en: "en-US",
                            zh: "zh-CN",
                        },
                    });
                    return _this;
                }
                App.prototype.dynamic = function (obj) {
                    return this.config.override ? this.config.override.get(obj) || obj : obj;
                };
                App.prototype.require = function (type, name) {
                    if (type === "jet-views")
                        return views[name];
                    else if (type === "jet-locales")
                        return locales[name];
                    return null;
                };
                App.prototype.getState = function () {
                    return this.config.params.state;
                };
                return App;
            }(JetApp));
            webix.protoUI({
                name: "filemanager",
                app: App,
                getState: function () {
                    return this.$app.getState();
                },
                getService: function (name) {
                    return this.$app.getService(name);
                },
                $init: function () {
                    var state = this.$app.getState();
                    for (var key in state) {
                        link(state, this.config, key);
                    }
                },
            }, webix.ui.jetapp);
            var services = { Backend: Backend, LocalData: LocalData, Upload: UploadHandler, Progress: Progress, Operations: Operations };
            var locales = { en: en };
            exports.App = App;
            exports.locales = locales;
            exports.services = services;
            exports.views = views;
            Object.defineProperty(exports, '__esModule', { value: true });
        })));
    });
    unwrapExports(filemanager);
    var filemanager_1 = filemanager.views;
    var filemanager_2 = filemanager.services;
    var filemanager_3 = filemanager.locales;
    var filemanager_4 = filemanager.App;

    var index = 1;
    function uid() {
        return index++;
    }
    var empty = undefined;
    var context = null;
    function link(source, target, key) {
        Object.defineProperty(target, key, {
            get: function () { return source[key]; },
            set: function (value) { return (source[key] = value); },
        });
    }
    function createState(data, config) {
        config = config || {};
        var handlers = {};
        var out = {};
        var observe = function (mask, handler) {
            var key = uid();
            handlers[key] = { mask: mask, handler: handler };
            if (mask === "*")
                handler(out, empty, mask);
            else
                handler(out[mask], empty, mask);
            return key;
        };
        var observeEnd = function (id) {
            delete handlers[id];
        };
        var queue = [];
        var waitInQueue = false;
        var batch = function (code) {
            if (typeof code !== "function") {
                var values_1 = code;
                code = function () {
                    for (var key in values_1)
                        out[key] = values_1[key];
                };
            }
            waitInQueue = true;
            code(out);
            waitInQueue = false;
            while (queue.length) {
                var obj = queue.shift();
                notify.apply(this, obj);
            }
        };
        var notify = function (key, old, value, meta) {
            if (waitInQueue) {
                queue.push([key, old, value, meta]);
                return;
            }
            var list = Object.keys(handlers);
            for (var i = 0; i < list.length; i++) {
                var obj = handlers[list[i]];
                if (!obj)
                    continue;
                if (obj.mask === "*" || obj.mask === key) {
                    obj.handler(value, old, key, meta);
                }
            }
        };
        for (var key2 in data) {
            if (data.hasOwnProperty(key2)) {
                var test = data[key2];
                if (config.nested && typeof test === "object" && test) {
                    out[key2] = createState(test, config);
                }
                else {
                    reactive(out, test, key2, notify);
                }
            }
        }
        Object.defineProperty(out, "$changes", {
            value: {
                attachEvent: observe,
                detachEvent: observeEnd,
            },
            enumerable: false,
            configurable: false,
        });
        Object.defineProperty(out, "$observe", {
            value: observe,
            enumerable: false,
            configurable: false,
        });
        Object.defineProperty(out, "$batch", {
            value: batch,
            enumerable: false,
            configurable: false,
        });
        return out;
    }
    function reactive(obj, val, key, notify) {
        Object.defineProperty(obj, key, {
            get: function () {
                return val;
            },
            set: function (value) {
                var changed = false;
                if (val === null || value === null) {
                    changed = val !== value;
                }
                else {
                    changed = val.valueOf() != value.valueOf();
                }
                if (changed) {
                    var old = val;
                    val = value;
                    notify(key, old, value, context);
                }
            },
            enumerable: true,
            configurable: false,
        });
    }

    var folderCardIcon = "<span class='webix_icon wxi-folder webix_fmanager_folder_icon'></span>";
    var menuIcon = "<span class='webix_icon wxi-dots webix_fmanager_menu_icon'></span>";
    var folderIcon = "<span class='webix_icon wxi-folder'></span>";
    var deleteIcon = "<span class='webix_fmanager_remove_user webix_icon wxi-trash'></span>";

    function handler(view) {
        return {
            attachEvent: function (key, handler) {
                webix.UIManager.addHotKey(key, handler, view);
                return { key: key, handler: handler };
            },
            detachEvent: function (_a) {
                var key = _a.key, handler = _a.handler;
                return webix.UIManager.removeHotKey(key, handler, view);
            },
        };
    }

    function MoveFiles(files, target) {
        if (this.State.source === "files") {
            this.app.getService("operations").move(files, this.GetTargetFolder(target));
        }
        else if (this.State.source === "trash") {
            this.app.callEvent("app:action", ["delete", files]);
        }
        return false;
    }
    function AddHotkeys() {
        var _this = this;
        var ctrlKey = webix.env.isMac ? "COMMAND" : "CTRL";
        var operations = [
            { key: "DELETE", oper: "delete", trash: "remove" },
            { key: "BACKSPACE", oper: "delete", trash: "remove" },
            { key: ctrlKey + "+C", oper: "copy" },
            { key: ctrlKey + "+X", oper: "cut", trash: "trashed" },
            { key: ctrlKey + "+V", oper: "paste", trash: "paste" },
            { key: ctrlKey + "+R", oper: "rename" },
            { key: ctrlKey + "+O", oper: "open" },
            { key: ctrlKey + "+E", oper: "edit" },
            { key: ctrlKey + "+D", oper: "download" },
        ];
        var _loop_1 = function (i) {
            this_1.on(handler(this_1.getRoot()), operations[i].key, function (v, e) {
                var source = _this.State.source;
                var action = source !== "trash" ? operations[i].oper : operations[i].trash;
                if (action)
                    _this.app.callEvent("app:action", [action]);
                webix.html.preventEvent(e);
            });
        };
        var this_1 = this;
        for (var i = 0; i < operations.length; ++i) {
            _loop_1(i);
        }
    }
    function SourceHandlers() {
        var _this = this;
        this.on(this.State.$changes, "source", function (v, o) {
            if (o) {
                if (_this.State.source !== "files") {
                    _this.State.selectedItem = [];
                    _this.LoadData(_this.State.path, "", v);
                }
                else {
                    _this.LoadData(_this.State.path);
                }
            }
        });
    }
    function HandleDrag(ctx) {
        var source = this.State.source;
        if (source !== "files" && source !== "trash")
            return false;
        else {
            ctx.stateSource = source;
            return this.__proto__.DragMarker.call(this, ctx);
        }
    }
    function HandleDrop(ctx) {
        if (ctx.stateSource === "trash") {
            if (this.State.source === "trash")
                return false;
            this.app.callEvent("app:action", [
                "restore",
                ctx.source,
                this.GetTargetFolder(ctx.target),
            ]);
        }
        else
            return this.MoveFiles(ctx.source, ctx.target);
    }
    function LoadData(path, search, source) {
        var _this = this;
        if (!source)
            this.__proto__.LoadData.call(this, path, search);
        else {
            this._Track = false;
            var table = this.WTable;
            if (table.data.url !== path) {
                table.clearAll();
                this.app
                    .getService("local")
                    .files(path, false, source)
                    .then(function (data) {
                    _this.RenderData(data);
                    _this.SelectActive();
                });
            }
            this._Track = true;
        }
    }
    function Activate(item) {
        if (!(this.State.source === "trash" && item.id !== "/")) {
            if (!item)
                return;
            if (item.type === "folder") {
                this.ShowSubFolder(item.value === ".." ? item.value : item.id);
            }
            else {
                if (item.type === "code" ||
                    (item.$ext === "xls" || item.$ext === "xlsx")) {
                    this.app.callEvent("app:action", ["edit", [item]]);
                }
                else {
                    this.app.callEvent("app:action", ["open", [item]]);
                }
            }
        }
    }
    function ShowSubFolder(id) {
        this.__proto__.ShowSubFolder.call(this, id);
        this.State.source = "files";
    }
    function DragMark() {
        var _this = this;
        webix.extend(this.WTable, {
            $dragMark: function (ctx) {
                if (_this.WTable._marked && _this.WTable._marked != ctx.target) {
                    _this.WTable.removeCss(_this.WTable._marked, "webix_drag_over");
                }
                if (ctx.target && _this.State.source !== "trash") {
                    _this.WTable.addCss(ctx.target, "webix_drag_over");
                    _this.WTable._marked = ctx.target;
                }
                else if (_this.State.source == "trash" &&
                    ctx.stateSource &&
                    ctx.stateSource !== "trash") {
                    webix.html.addCss(_this.WTable.$view, "webix_drag_over");
                }
            },
            $dragOut: function (src, ot, nt) {
                if (_this.State.source == "trash" && ot !== nt) {
                    webix.html.removeCss(_this.WTable.$view, "webix_drag_over");
                }
            },
        }, true);
    }
    function DataviewMixin(node) {
        node.MoveFiles = MoveFiles;
        node.AddHotkeys = AddHotkeys;
        node.SourceHandlers = SourceHandlers;
        node.ShowSubFolder = ShowSubFolder;
        node.Activate = Activate;
        node.LoadData = LoadData;
        node.HandleDrag = HandleDrag;
        node.HandleDrop = HandleDrop;
        node.DragMark = DragMark;
    }

    var CardsView = (function (_super) {
        __extends(CardsView, _super);
        function CardsView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CardsView.prototype.config = function () {
            var _this = this;
            DataviewMixin(this);
            return this.app
                .getService("localusers")
                .users()
                .then(function (users) {
                _this.Users = users;
                var ui = _super.prototype.config.call(_this);
                ui.on.onBeforeDrag = function (ctx) { return _this.HandleDrag(ctx); };
                ui.on.onBeforeDrop = function (ctx) { return _this.HandleDrop(ctx); };
                return ui;
            });
        };
        CardsView.prototype.init = function () {
            _super.prototype.init.call(this);
            this.SourceHandlers();
            this.DragMark();
            webix.TooltipControl.addTooltip(this.WTable.$view);
        };
        CardsView.prototype.RenderData = function (data) {
            var _this = this;
            this.WTable.sync(data, function () {
                return _this.WTable.filter(function (f) { return f.value && f.value !== ".."; });
            });
        };
        CardsView.prototype.CardTemplate = function (obj) {
            var shared = "";
            if (obj.users && obj.users.length) {
                shared = "<div class='webix_fmanager_card_shared'>";
                var circles = [];
                var offst = obj.users.length > 4 ? 1 : 0;
                for (var i = 0; i < obj.users.length; ++i) {
                    if (i < 3 || (i === 3 && i - obj.users.length === -1)) {
                        var user = this.Users.getItem(obj.users[i]);
                        circles.push("<img class=\"shared_user_name user_" + (offst + i) + "\" webix_tooltip=\"" + user.name + "<br>(" + user.email + ")\" src=\"" + this.app
                            .getService("users")
                            .avatarUrl(user.id, user.avatar) + "\" />");
                    }
                    else
                        break;
                }
                if (offst)
                    circles.unshift("<span class=\"shared_user_name user_plus\">+" + (obj.users.length -
                        3) + "</span>");
                shared += circles.reverse().join("");
                shared += "</div>";
            }
            var _ = this.app.getService("locale")._;
            var star = obj.star && this.State.source !== "trash"
                ? "<div class='webix_fmanager_star'><span class='webix_docmanager_icon dmi-star'></span></div>"
                : "";
            var preview, panel;
            if (obj.type === "folder") {
                preview = "<div class=\"webix_fmanager_card_preview\">" + star + folderCardIcon + "</div>";
                panel = "<div class=\"webix_fmanager_card_panel\">\n\t\t<span class=\"webix_fmanager_card_label\">" + _("Folder") + "</span>\n\t\t<span class=\"webix_fmanager_card_name folder\">" + this.SearchTemplate(obj.value) + "</span>" + menuIcon + "\n\t\t</div>";
            }
            else {
                var skin = webix.skin.$active;
                var picSize = skin.listItemHeight < 29 ? [163, 92] : [214, 124];
                var origin_1 = this.app
                    .getService("backend")
                    .previewURL(obj, picSize[0], picSize[1]);
                var img = "<img height=\"" + picSize[1] + "\" width=\"" + picSize[0] + "\" src=\"" + origin_1 + "\" onerror='this.style.display=\"none\"'/>";
                preview = "<div class=\"webix_fmanager_card_preview file\">" + star + img + shared + "</div>";
                var fileIcon = this.Icon(obj);
                panel = "<div class=\"webix_fmanager_card_panel file\">\n\t\t<span class=\"webix_fmanager_card_name\">" + fileIcon + "<span class=\"file_name_text\">" + this.SearchTemplate(obj.value) + "</span></span>" + menuIcon + "\n\t\t</div>";
            }
            return "<div class=\"webix_fmanager_card_outer\"><div class=\"webix_fmanager_card\" webix_l_id=\"" + obj.id + "\">" + (preview + panel) + "</div></div>";
        };
        CardsView.prototype.SearchTemplate = function (name) {
            var search = this.State.search;
            search = search.replace(/(#\w+\b)/g, "").trim();
            if (search) {
                var rex = new RegExp("(" + search.replace(/ +/g, ")|(") + ")", "gi");
                return name.replace(rex, "<span class='webix_fmanager_search_mark'>$&</span>");
            }
            return name;
        };
        return CardsView;
    }(filemanager_1["cards"]));

    var EditorView = (function (_super) {
        __extends(EditorView, _super);
        function EditorView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EditorView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var ui = _super.prototype.config.call(this);
            var bar = ui.rows[0];
            bar.visibleBatch = "editor";
            bar.cols[0].batch = "editor";
            bar.cols[bar.cols.length - 1].batch = "editor";
            bar.cols.splice(bar.cols.length - 1, 0, {
                localId: "versionsBtn",
                view: "button",
                type: "icon",
                icon: "wxi-clock",
                css: "webix_transparent webix_fmanager_versions",
                autowidth: true,
                tooltip: _("Show version history"),
                batch: "editor",
                hidden: true,
                click: function () { return _this.ConfirmHistory(); },
            }, {
                view: "button",
                localId: "restoreBtn",
                hidden: true,
                value: "Restore this version",
                css: "webix_primary",
                width: 296,
                inputWidth: 200,
                click: function () { return _this.RestoreVersion(); },
            });
            var editor = ui.rows[1];
            var main = {
                type: "wide",
                cols: [
                    editor,
                    {
                        view: "proxy",
                        borderless: true,
                        hidden: true,
                        localId: "r-side",
                        body: {
                            $subview: true,
                            name: "r-side",
                        },
                    },
                ],
            };
            ui.rows[1] = main;
            return ui;
        };
        EditorView.prototype.init = function () {
            _super.prototype.init.call(this);
            this.OnInit();
        };
        EditorView.prototype.OnInit = function () {
            var _this = this;
            this.Editor = this.$$("editor");
            this.State = createState({
                version: 0,
                current: true,
                date: null,
                diff: true,
            });
            this.on(this.State.$changes, "current", function (v) {
                if (v)
                    _this.$$("restoreBtn").hide();
                else
                    _this.$$("restoreBtn").show();
            });
            this.on(this.State.$changes, "date", function (v) {
                if (v) {
                    var barLabel = _this.$$("name");
                    var old = barLabel.getValue().split(", ");
                    old[1] = "<span class=\"date\">" + _this.DateFormat(v).date + "</span>";
                    barLabel.setValue(old.join(", "));
                }
            });
            this.on(this.app, "history:close", function () {
                _this.refresh();
            });
        };
        EditorView.prototype.DateFormat = function (date) {
            if (!date)
                date = this.File.date;
            var format = "", prep = "on";
            var today = webix.Date.datePart(new Date()), edit = webix.Date.datePart(date, true);
            if (webix.Date.equal(today, edit)) {
                format = "%H:%i:%s";
                prep = "at";
            }
            else if (edit.getYear() === today.getYear()) {
                format = "%F %j";
            }
            else {
                format = "%F %j, %Y";
            }
            return { prep: prep, date: webix.Date.dateToStr(format)(date) };
        };
        EditorView.prototype.SetVersionsButton = function () {
            var btn = this.$$("versionsBtn");
            if (!this.State.version) {
                if (!btn.isVisible())
                    btn.show();
                var _ = this.app.getService("locale")._;
                var format = this.DateFormat();
                btn.config.label = _("Last edited " + format.prep) + " " + format.date;
                btn.resize();
                btn.refresh();
            }
        };
        EditorView.prototype.ConfirmHistory = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            if (this._changed)
                webix
                    .confirm(_("Unsaved changes will be lost. Are you sure?"))
                    .then(function () { return _this.ShowHistory(); });
            else
                this.ShowHistory();
        };
        EditorView.prototype.ShowHistory = function () {
            this.show("history", {
                target: "r-side",
                params: { file: this.File, state: this.State },
            });
            this.$$("r-side").show();
            this.SetBatch("history");
        };
        EditorView.prototype.SetBatch = function (batch) {
            this.getRoot()
                .queryView("toolbar")
                .showBatch(batch);
            this.Editor.hide();
        };
        EditorView.prototype.RestoreVersion = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            webix.confirm(_("Are you sure ?")).then(function () {
                _this.app
                    .getService("versions")
                    .restore(_this.File.id, _this.State.version * 1)
                    .then(function (data) {
                    _this.File.date = new Date(data.date * 1000);
                    _this.setParam("file", _this.File);
                    _this.refresh();
                });
            });
        };
        EditorView.prototype.ChangeTextState = function (state) {
            _super.prototype.ChangeTextState.call(this, state);
            if (!state)
                this.SetVersionsButton();
        };
        EditorView.prototype.Save = function () {
            var _this = this;
            var content = this.$$("editor").getValue();
            if (this._changed) {
                this.app
                    .getService("operations")
                    .write(this.File.id, content)
                    .then(function () {
                    _this._oldValue = content;
                    _this.ChangeTextState(false);
                });
            }
        };
        return EditorView;
    }(filemanager_1["editor"]));

    var SpreadsheetView = (function (_super) {
        __extends(SpreadsheetView, _super);
        function SpreadsheetView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SpreadsheetView.prototype.config = function () {
            var ui = _super.prototype.config.call(this);
            ui.rows[1].cols[0] = {
                view: "excelviewer",
                editable: true,
                editaction: "dblclick",
                css: "webix_data_border",
                areaselect: true,
                header: false,
                localId: "editor",
            };
            return ui;
        };
        SpreadsheetView.prototype.init = function () {
            var _this = this;
            this.OnInit();
            this.$$("name").setValue("<div class=\"filename\">" + this.ClipName(this.File.id) + "</div><span class=\"extension\">." + this.File.$ext + "</span>");
            webix.extend(this.Editor, webix.ProgressBar);
            this.Editor.showProgress({ type: "top" });
            var path = this.app.getService("backend").directLink(this.File.id);
            this.Editor.load("binary->" + path, "excel").then(function () {
                _this.Editor.hideProgress();
                _this.SetVersionsButton();
            });
            this.on(this.Editor, "onAfterEditStop", function (v) {
                if (v.value != v.old)
                    _this.ChangeTextState(true);
            });
            this.on(handler(this.Editor), "any", function () {
                var sel = _this.Editor.getSelectedId();
                if (sel)
                    _this.Editor.edit(sel);
            });
            this.on(this.State.$changes, "version", function (v) {
                return _this.ParseVersion(v, _this.State.diff);
            });
            this.on(this.State.$changes, "diff", function (v) {
                return _this.ResetDiffStyle(_this.State.version, v);
            });
        };
        SpreadsheetView.prototype.ResetDiffStyle = function (v, diff) {
            if (v) {
                var id = this.getSubView("r-side").GetPrevVersion(v);
                if (id) {
                    this.StyleDiffCells(diff);
                }
                this.ResetTotalDiff(id ? false : diff);
            }
        };
        SpreadsheetView.prototype.ParseVersion = function (v, diff) {
            var _this = this;
            if (v) {
                this.Editor.showProgress({ type: "top" });
                this.Editor.clearAll();
                var path = this.app.getService("versions").directLink(v);
                var id = this.getSubView("r-side").GetPrevVersion(v);
                this.ResetTotalDiff(id ? false : diff);
                if (diff && id) {
                    var prevPath = this.app.getService("versions").directLink(id);
                    webix.promise
                        .all([this.ParseExcel(prevPath), this.ParseExcel(path)])
                        .then(function (res) {
                        var older = res[0];
                        var target = res[1];
                        _this.Diffs = _this.CollectDiffs(older.data, target.data);
                        _this.Editor.parse(target);
                        _this.StyleDiffCells(true);
                    });
                }
                else {
                    this.Editor.load("binary->" + path, "excel").then(function () {
                        _this.Editor.hideProgress();
                    });
                }
            }
        };
        SpreadsheetView.prototype.ResetTotalDiff = function (mode) {
            var method = mode ? "addCss" : "removeCss";
            webix.html[method](this.Editor.$view, "webix_fmanager_diff_all");
        };
        SpreadsheetView.prototype.ParseExcel = function (url) {
            var _this = this;
            return webix
                .ajax()
                .response("arraybuffer")
                .get(url)
                .then(function (data) {
                return webix.DataDriver.excel.toObject({
                    data: data,
                    options: { ext: _this.File.$ext },
                });
            });
        };
        SpreadsheetView.prototype.CollectDiffs = function (old, target) {
            var diffs = [];
            for (var row = 0; row < target.length; ++row) {
                for (var col = 0; col < target[row].length; ++col) {
                    if (target[row][col] != old[row][col]) {
                        diffs.push([row, col]);
                    }
                }
            }
            return diffs;
        };
        SpreadsheetView.prototype.StyleDiffCells = function (mode) {
            var _this = this;
            this.Editor.showProgress({ type: "top" });
            var method = mode ? "addCellCss" : "removeCellCss";
            this.Diffs.forEach(function (d) {
                var colId = _this.Editor.columnId(d[1]);
                _this.Editor[method](_this.Editor.getIdByIndex(d[0]), colId, "webix_docmanager_diff_excel", true);
            });
            this.Editor.render();
            this.Editor.hideProgress();
        };
        SpreadsheetView.prototype.Save = function () {
            var _this = this;
            this.Editor.editStop();
            if (this._changed) {
                return webix
                    .toExcel(this.Editor, {
                    download: false,
                    styles: true,
                    spans: true,
                    heights: true,
                    header: false,
                })
                    .then(function (data) {
                    return _this.app
                        .getService("operations")
                        .writeBinary(_this.File.id, _this.File.value, data)
                        .then(function () {
                        _this.ChangeTextState(false);
                    });
                });
            }
        };
        SpreadsheetView.prototype.SetBatch = function (batch) {
            this.getRoot()
                .queryView("toolbar")
                .showBatch(batch);
            this.Editor.define("editable", false);
        };
        return SpreadsheetView;
    }(EditorView));

    var FoldersView = (function (_super) {
        __extends(FoldersView, _super);
        function FoldersView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FoldersView.prototype.config = function () {
            var _this = this;
            var ui = _super.prototype.config.call(this);
            var navbar = ui.body.rows[1];
            navbar.type.folder = function (o) {
                var iconPrefix = o.icon ? o.icon.slice(0, 3) : "";
                var icl = iconPrefix === "dmi" ? "webix_docmanager_icon" : "webix_icon";
                return "<div class='" + icl + " " + (o.icon || "wxi-folder") + "'></div>";
            };
            navbar.on.onBeforeDrop = function (ctx) { return _this.HandleDrop(ctx); };
            return ui;
        };
        FoldersView.prototype.init = function () {
            _super.prototype.init.call(this);
            this.DragMark();
        };
        FoldersView.prototype.DragMark = function () {
            var _this = this;
            webix.extend(this.Tree, {
                $dragMark: function (ctx) {
                    if (_this.Tree._marked && _this.Tree._marked != ctx.target) {
                        _this.Tree.removeCss(_this.Tree._marked, "webix_drag_over");
                    }
                    if (ctx.target) {
                        var trashing = ctx.target === "../trash" && ctx.stateSource !== "trash";
                        var toGroupFolder = ctx.target.indexOf("..") === 0 && ctx.target !== "../files";
                        if (!toGroupFolder || trashing) {
                            _this.Tree.addCss(ctx.target, "webix_drag_over");
                            _this.Tree._marked = ctx.target;
                        }
                    }
                },
            }, true);
        };
        FoldersView.prototype.HandleDrop = function (ctx) {
            if (!ctx.target)
                return false;
            if (ctx.target === "../files")
                ctx.target = "/";
            var fromTrash = ctx.stateSource === "trash";
            var toGroupFolder = ctx.target.indexOf("..") === 0;
            if (!toGroupFolder) {
                if (fromTrash) {
                    this.app.callEvent("app:action", ["restore", ctx.source, ctx.target]);
                }
                else {
                    this.app.getService("operations").move(ctx.source, ctx.target);
                }
            }
            else if (ctx.target === "../trash" && !fromTrash) {
                this.app.callEvent("app:action", ["delete", ctx.source]);
            }
            return false;
        };
        FoldersView.prototype.Subscribe = function () {
            var _this = this;
            _super.prototype.Subscribe.call(this);
            this.on(this.State.$changes, "source", function (v) {
                if (_this.State.path === "/")
                    _this.Tree.select("../" + v);
                var addButton = _this.getRoot().queryView("button");
                if (v !== "files") {
                    addButton.disable();
                }
                else {
                    addButton.enable();
                }
            });
        };
        return FoldersView;
    }(filemanager_1.folders));

    var HistoryView = (function (_super) {
        __extends(HistoryView, _super);
        function HistoryView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HistoryView.prototype.config = function () {
            var _this = this;
            this.File = this.getParam("file");
            this.State = this.getParam("state");
            var _ = this.app.getService("locale")._;
            return this.app
                .getService("localusers")
                .users()
                .then(function (users) {
                var toolbar = {
                    view: "toolbar",
                    elements: [
                        {
                            view: "icon",
                            css: "webix_fmanager_history_back",
                            icon: "dmi-arrow-left",
                            tooltip: _("Back to editor"),
                            click: function () {
                                _this.app.callEvent("history:close", []);
                            },
                        },
                        {
                            view: "label",
                            label: _("Version history"),
                            align: "center",
                            css: "webix_fmanager_history_bar",
                        },
                    ],
                };
                var check = {
                    view: "checkbox",
                    localId: "diffCheck",
                    labelWidth: 12,
                    labelRight: _("Show changes"),
                    value: _this.State.diff,
                    on: {
                        onChange: function (v) { return (_this.State.diff = !!v); },
                    },
                };
                var list = {
                    type: "form",
                    margin: 0,
                    padding: 0,
                    rows: [
                        toolbar,
                        {
                            view: "list",
                            localId: "list",
                            width: 300,
                            select: true,
                            borderless: true,
                            scheme: {
                                $init: _this.PrepareDates,
                            },
                            type: {
                                height: "auto",
                            },
                            template: function (obj) { return _this.ListTemplate(obj, users); },
                            on: {
                                onAfterSelect: function (id) { return _this.SetVersion(id); },
                            },
                        },
                        check,
                        { height: 12 },
                    ],
                };
                var diff = {
                    localId: "diff",
                    scroll: "auto",
                    hidden: _this.File.type !== "code",
                    view: "template",
                    css: "webix_docmanager_editor_diff",
                };
                var ui = { type: "wide", cols: [diff, list] };
                return ui;
            });
        };
        HistoryView.prototype.init = function () {
            var _this = this;
            this.List = this.$$("list");
            this.Diff = this.$$("diffCheck");
            this.dateFormat = webix.Date.dateToStr("%F %j, %Y %H:%i:%s");
            this.on(this.State.$changes, "version", function (v) {
                return _this.GetVersion(v, _this.State.diff);
            });
            this.on(this.State.$changes, "diff", function (v) {
                return _this.GetVersion(_this.List.getSelectedId(), v);
            });
            this.LoadData();
        };
        HistoryView.prototype.LoadData = function () {
            var _this = this;
            this.app
                .getService("versions")
                .versions(this.File.id)
                .then(function (res) {
                _this.List.clearAll();
                _this.List.parse(res);
                _this.List.select(_this.List.getFirstId());
            });
        };
        HistoryView.prototype.PrepareDates = function (o) {
            if (o && typeof o.date === "string")
                o.date = new Date(o.date);
            if (o && typeof o.origin === "string")
                o.origin = new Date(o.origin);
        };
        HistoryView.prototype.ListTemplate = function (obj, users) {
            var _ = this.app.getService("locale")._;
            var dateline = "<div class=\"webix_fmanager_version_date\">" + this.dateFormat(obj.date) + "</div>";
            if (obj.origin) {
                dateline += "<div class=\"webix_fmanager_restore_date\">" + _("Restored from") + " " + this.dateFormat(obj.origin) + "</div>";
            }
            var user = users.getItem(obj.user);
            var face = "<img class=\"webix_fmanager_version_face\" webix_tooltip=\"" + user.name + "<br>(" + user.email + ")\" src=\"" + this.app
                .getService("users")
                .avatarUrl(user.id, user.avatar) + "\" />";
            var authorline = "<div class=\"webix_fmanager_version_author\">" + face + "<span class=\"webix_fmanager_version_name\">" + user.name + "</span></div>";
            return "<div class=\"webix_fmanager_version\">" + dateline + authorline + "</div>";
        };
        HistoryView.prototype.SetVersion = function (id) {
            var version = this.List.getItem(id);
            this.State.$batch({
                version: id,
                current: webix.Date.equal(this.File.date, version.date),
                date: version.date,
            });
        };
        HistoryView.prototype.GetVersion = function (v, diff) {
            var _this = this;
            if (v && this.File.type === "code") {
                this.app
                    .getService("versions")
                    .readText(v, diff)
                    .then(function (text) {
                    if (v == _this.List.getLastId() && diff) {
                        text = "<span class=\"webix_docmanager_diff_insert\">" + text + "</span>";
                    }
                    _this.$$("diff").setHTML(text);
                });
            }
        };
        HistoryView.prototype.GetPrevVersion = function (curr) {
            return this.List.getNextId(curr);
        };
        return HistoryView;
    }(filemanager_1.JetView));

    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GridView.prototype.config = function () {
            var _this = this;
            DataviewMixin(this);
            var grid = _super.prototype.config.call(this);
            var _ = this.app.getService("locale")._;
            grid.type.backToFiles = function () {
                return _("back to ") + _this.app.getService("backend").getRootName();
            };
            grid.on.onBeforeDrag = function (ctx) { return _this.HandleDrag(ctx); };
            grid.on.onBeforeDrop = function (ctx) { return _this.HandleDrop(ctx); };
            return grid;
        };
        GridView.prototype.NameTemplate = function (obj) {
            var star = obj.star && this.State.source !== "trash"
                ? "<div class='webix_fmanager_star'><span class='webix_docmanager_icon dmi-star'></span></div>"
                : "";
            return (star +
                (obj.type === "folder"
                    ? folderIcon + obj.value
                    : this.Icon(obj) + "<span class=\"file-name\">" + obj.value + "</span>"));
        };
        GridView.prototype.init = function () {
            _super.prototype.init.call(this);
            this.SourceHandlers();
            this.DragMark();
        };
        return GridView;
    }(filemanager_1.list));

    var FOLDER = 0x01;
    var MANY = 0x02;
    var TEXT = 0x04;
    var VIEW = 0x08;
    var FULL = 0x10;
    var TREE = 0x20;
    var SEARCH = 0x40;
    var STAR = 0x80;
    var TRASH = 0x7f;
    var MenuBodyView = (function (_super) {
        __extends(MenuBodyView, _super);
        function MenuBodyView(app, name, config) {
            var _this = _super.call(this, app, name, config) || this;
            _this.state = config.state;
            return _this;
        }
        MenuBodyView.prototype.config = function () {
            var _a;
            var _ = this.app.getService("locale")._;
            var menu = _super.prototype.config.call(this);
            var options = [
                {
                    $template: "Separator",
                    show: TREE,
                },
                {
                    id: "favorite",
                    show: FOLDER | TREE | STAR,
                    value: _("Add to favorites"),
                    icon: "dmi-star-outline",
                },
                {
                    id: "unfavorite",
                    show: FOLDER | TREE | STAR,
                    value: _("Remove from favorites"),
                    icon: "dmi-star",
                },
                {
                    id: "share",
                    value: _("Share"),
                    show: TREE,
                    icon: "dmi-share",
                },
            ];
            (_a = menu.data).splice.apply(_a, __spreadArrays([10, 0], options));
            menu.data = menu.data.concat([
                {
                    id: "restore",
                    value: _("Restore"),
                    show: TRASH,
                    icon: "dmi-delete-restore",
                },
                {
                    id: "remove",
                    value: _("Delete from trash"),
                    show: TRASH,
                    icon: "dmi-delete-empty",
                    hotkey: "Del / &#8592;",
                },
            ]);
            menu.template = function (obj) {
                return ((obj.icon
                    ? "<span class=\"webix_list_icon webix_icon " + obj.icon + "\"></span>"
                    : "") +
                    obj.value +
                    (obj.hotkey
                        ? "<span class=\"webix_fmanager_context-menu-hotkey\">" + obj.hotkey + "</span>"
                        : ""));
            };
            return menu;
        };
        MenuBodyView.prototype.FilterOptions = function (files) {
            var _this = this;
            var source = this.state ? this.state.source : null;
            var menu = this.getRoot();
            this.Files = files;
            if (source !== "trash") {
                var file_1 = files[0];
                var many_1 = files.length > 1;
                var vtypes = ["image", "audio", "video", "code", "pdf"];
                var viewable_1 = vtypes.find(function (t) { return t === file_1.type || t === file_1.$ext; });
                var editable_1 = file_1.type === "code" || (file_1.$ext === "xls" || file_1.$ext === "xlsx");
                var search_1 = this.app.getState().search;
                this.getRoot().define("width", search_1 && !many_1 ? 270 : 200);
                this.getRoot().filter(function (o) {
                    return !((many_1 && !(o.show & MANY)) ||
                        (file_1.type === "folder" && !(o.show & FOLDER)) ||
                        (o.show & TEXT && !editable_1) ||
                        (o.show & VIEW && !viewable_1) ||
                        (o.show & FULL && !_this.compact) ||
                        (o.show & TREE && _this.tree) ||
                        (o.show & SEARCH && !search_1) ||
                        (o.show & STAR && file_1.star
                            ? o.id === "favorite"
                            : o.id === "unfavorite"));
                });
                this.FilterCopyPaste(source, menu);
            }
            else {
                menu.define("width", 250);
                menu.filter(function (o) { return o.id === "remove" || o.id === "restore"; });
            }
        };
        MenuBodyView.prototype.FilterCopyPaste = function (source, menu) {
            if (source !== "files") {
                menu.filter(function (o) {
                    return o.show ^ (FOLDER | MANY | TREE) && o.show ^ (FOLDER | TREE);
                }, null, true);
            }
        };
        return MenuBodyView;
    }(filemanager_1["menus/menubody"]));

    var PopupView = (function (_super) {
        __extends(PopupView, _super);
        function PopupView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PopupView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var compact = this.getParam("compact");
            var label = _(this.getParam("label"));
            var header = {
                view: "toolbar",
                padding: { left: 12, right: 4 },
                borderless: true,
                cols: [
                    {
                        template: function () { return label; },
                        height: 36,
                        borderless: true,
                        css: "webix_fmanager_shared_title",
                    },
                    {
                        view: "icon",
                        icon: "wxi-close",
                        css: "webix_fmanager_shared_close",
                        hotkey: "esc",
                        click: function () { return _this.Hide(); },
                    },
                ],
            };
            var win = {
                view: "window",
                css: "webix_fmanager_popup",
                position: "center",
                head: header,
                modal: true,
                body: { $subview: true },
            };
            if (compact) {
                win.fullscreen = true;
            }
            else {
                var small = webix.skin.$name == "mini" || webix.skin.$name == "compact";
                win.width = small ? 400 : 540;
            }
            return win;
        };
        PopupView.prototype.Hide = function () {
            this.show("_blank", { target: "popup" });
        };
        return PopupView;
    }(filemanager_1.JetView));

    function getAvatar(name) {
        var result = "";
        var style = stylesheet[Math.floor(Math.random() * stylesheet.length)];
        if (typeof name !== "string")
            name = "";
        name = name.split(" ");
        for (var i = 0; i < name.length && result.length < 2; i++)
            if (name[i])
                result += name[i].charAt(0);
        return "<div class=\"default_avatar\" style=\"background:" + style.bg + "; color:" + style.c + ";\">" + (result || "no") + "</div>";
    }
    var stylesheet = [
        { bg: "#2EADC2", c: "#FFFFFF" },
        { bg: "#3B3ABB", c: "#FFFFFF" },
        { bg: "#813EBB", c: "#FFFFFF" },
        { bg: "#B442A8", c: "#FFFFFF" },
        { bg: "#B43D64", c: "#FFFFFF" },
        { bg: "#D25640", c: "#FFFFFF" },
        { bg: "#DBA10D", c: "#FFFFFF" },
        { bg: "#7BBD48", c: "#FFFFFF" },
        { bg: "#5EBD90", c: "#FFFFFF" },
    ];

    var SharePopupView = (function (_super) {
        __extends(SharePopupView, _super);
        function SharePopupView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SharePopupView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var compact = this.getParam("compact", true);
            var input = {
                localId: "users",
                view: "text",
                placeholder: _("Invite someone..."),
                suggest: {
                    template: "#email#",
                    body: {
                        css: "webix_fmanager_user_list",
                        data: [],
                        template: function (obj) { return _this.InputListTemplate(obj); },
                    },
                },
            };
            var label = {
                localId: "counter",
                borderless: true,
                template: function (obj) {
                    if (!obj)
                        return "&nbsp;";
                    return obj.users
                        ? _("Available to") + " " + obj.users + " " + _("user(s)")
                        : _("No users");
                },
                autoheight: true,
            };
            var list = {
                view: "list",
                localId: "list",
                css: "webix_fmanager_shared_list",
                template: function (obj) { return _this.ListTemplate(obj); },
                type: { height: webix.skin.$active.rowHeight },
                autoheight: true,
                yCount: compact ? 0 : 4,
                onClick: {
                    webix_fmanager_remove_user: function (_e, id) { return _this.RemoveUser(id * 1); },
                },
            };
            var body = {
                borderless: true,
                padding: 12,
                margin: 4,
                rows: [
                    input,
                    {
                        view: "button",
                        label: _("Invite"),
                        inputWidth: 140,
                        css: "webix_primary",
                        click: function () { return _this.Done(); },
                    },
                    label,
                    list,
                ],
            };
            return body;
        };
        SharePopupView.prototype.init = function () {
            var _this = this;
            this.List = this.$$("list");
            this.Input = this.$$("users");
            this.File = this.getParam("info", true)[0];
            this.app
                .getService("localusers")
                .users()
                .then(function (data) {
                _this.Data = data;
                var list = webix.$$(_this.Input.config.suggest).getList();
                list.clearAll();
                list.sync(data);
                var users = _this.File.users;
                if (users && users.length) {
                    _this.List.parse(users.map(function (u) { return data.getItem(u); }));
                }
                _this.UpdateCounter(users);
            });
            this.Input.focus();
            webix.TooltipControl.addTooltip(this.List.$view);
        };
        SharePopupView.prototype.RemoveUser = function (id) {
            var _this = this;
            var _ = this.app.getService("locale")._;
            webix.confirm(_("Are you sure ?")).then(function () {
                return _this.app
                    .getService("operations")
                    .removeUser(_this.File, id)
                    .then(function () {
                    _this.List.remove(id);
                    _this.UpdateCounter(_this.File.users);
                });
            });
        };
        SharePopupView.prototype.ClearInput = function () {
            this.Input.setValue("");
        };
        SharePopupView.prototype.Done = function () {
            var _this = this;
            var email = this.Input.getValue();
            if (email) {
                var user_1 = this.Data.find(function (a) { return a.email === email; }, true);
                if (user_1 && !this.List.find(function (a) { return a.id === user_1.id; }, true)) {
                    return this.app
                        .getService("operations")
                        .share(this.File, user_1.id)
                        .then(function () {
                        _this.List.add(user_1);
                        _this.List.showItem(user_1.id);
                        _this.ClearInput();
                        _this.UpdateCounter(_this.File.users);
                    });
                }
                else
                    this.ClearInput();
            }
        };
        SharePopupView.prototype.ListTemplate = function (obj) {
            var avatar = obj.avatar
                ? "<img class=\"avatar_img\" webix_tooltip=\"" + obj.email + "\" src=\"" + this.app.getService("users").avatarUrl(obj.id, obj.avatar) + "\">"
                : getAvatar(obj.name);
            return (avatar +
                ("<span webix_tooltip=\"" + obj.email + "\">" + obj.name + "</span>") +
                deleteIcon);
        };
        SharePopupView.prototype.InputListTemplate = function (obj) {
            return (obj.name +
                "&nbsp;" +
                ("<span class=\"webix_fmanager_user_email\">" + obj.email + "</span>"));
        };
        SharePopupView.prototype.UpdateCounter = function (users) {
            this.$$("counter").setValues({ users: users ? users.length : 0 });
            if (users && users.length) {
                webix.html.removeCss(this.List.$view, "no-border");
            }
            else {
                webix.html.addCss(this.List.$view, "no-border");
            }
        };
        return SharePopupView;
    }(filemanager_1.JetView));

    function randomColor() {
        return palette[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)];
    }
    var palette = [
        ["#00a037", "#13a1aa", "#df282f", "#fd772c"],
        ["#6d4bce", "#b26bd3", "#c87095", "#90564d"],
        ["#eb2f89", "#ea77c0", "#777676", "#a9a8a8"],
        ["#9bb402", "#e7a90b", "#0bbed7", "#038cd9"],
    ];

    var TagsPopupView = (function (_super) {
        __extends(TagsPopupView, _super);
        function TagsPopupView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TagsPopupView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var compact = this.getParam("compact", true);
            var search = {
                margin: 4,
                cols: [
                    {
                        view: "search",
                        localId: "search",
                        placeholder: _("Type to search a tag"),
                        on: {
                            onTimedKeyPress: function () { return _this.FilterTags(); },
                            onChange: function (v) { return !v && _this.FilterTags(); },
                        },
                    },
                    {
                        view: "button",
                        value: _("Add"),
                        css: "webix_primary",
                        width: 90,
                        click: function () {
                            _this.AddTag();
                        },
                    },
                ],
            };
            var size = webix.skin.$active.propertyItemHeight + 1;
            var list = {
                localId: "tags",
                view: "datatable",
                editable: true,
                header: false,
                yCount: compact ? 0 : 4,
                columns: [
                    {
                        id: "name",
                        editor: "text",
                        fillspace: true,
                        template: function (obj) { return _this.SearchTemplate(obj.name); },
                    },
                    {
                        id: "color",
                        editor: "color",
                        width: 50,
                        template: function (obj) { return _this.TaglistTemplate(obj); },
                        suggest: {
                            css: "webix_fmanager_palette",
                            type: "colorboard",
                            padding: 3,
                            body: {
                                view: "colorboard",
                                palette: palette,
                                width: 4 * size,
                                height: 4 * size,
                            },
                        },
                    },
                    {
                        width: 50,
                        template: "<span class='webix_fmanager_remove_tag webix_icon wxi-trash'></span>",
                    },
                ],
                on: {
                    onBeforeEditStop: function (values, editor) {
                        if (values.value !== values.old) {
                            var data = _this.$$("tags").getItem(editor.row);
                            data[editor.column] = values.value;
                            _this.UpdateTag(editor.row, {
                                name: data.name,
                                color: data.color,
                            });
                            return false;
                        }
                    },
                    "data->onSyncApply": function () {
                        _this.FilterTags();
                    },
                },
                onClick: {
                    webix_fmanager_remove_tag: function (e, id) {
                        _this.RemoveTag(id.row);
                    },
                },
            };
            var body = {
                borderless: true,
                padding: 12,
                margin: 0,
                type: "clean",
                rows: [search, list],
            };
            return body;
        };
        TagsPopupView.prototype.init = function () {
            var _this = this;
            this.List = this.$$("tags");
            this.Search = this.$$("search");
            this.SetTaglistOverlay();
            this.app
                .getService("localtags")
                .tags()
                .then(function (data) {
                _this.List.parse(data);
                _this.Search.focus();
            });
        };
        TagsPopupView.prototype.FilterTags = function () {
            var _this = this;
            this._Input = this.Search.getValue()
                .trim()
                .toLowerCase();
            this.List.filter(function (t) { return t.name.toLowerCase().indexOf(_this._Input) !== -1; });
        };
        TagsPopupView.prototype.AddTag = function () {
            var _this = this;
            var tag = { name: "New", color: randomColor() };
            this.app
                .getService("operations")
                .addTag(tag)
                .then(function (id) {
                _this.Search.setValue("");
                _this.List.editCell(id, "name", false, true);
            });
        };
        TagsPopupView.prototype.UpdateTag = function (id, data) {
            var _this = this;
            this.app
                .getService("operations")
                .updateTag(id, data)
                .then(function () {
                _this.List.blockEvent();
                _this.List.editStop();
                _this.List.unblockEvent();
            });
        };
        TagsPopupView.prototype.RemoveTag = function (id) {
            this.app.getService("operations").removeTag(id);
        };
        TagsPopupView.prototype.SetTaglistOverlay = function () {
            var _this = this;
            webix.extend(this.List, webix.OverlayBox);
            this.on(this.List.data, "onAfterFilter", function () { return _this.ToggleOverlay(); });
            this.on(this.List.data, "onStoreUpdated", function () { return _this.ToggleOverlay(); });
        };
        TagsPopupView.prototype.ToggleOverlay = function () {
            var _ = this.app.getService("locale")._;
            if (!this.List.count()) {
                this.List.showOverlay(_("Click Add to create a new tag"));
            }
            else {
                this.List.hideOverlay();
            }
        };
        TagsPopupView.prototype.TaglistTemplate = function (obj) {
            return "<span class=\"webix_fmanager_tag_color\" style=\"background-color: " + obj.color + ";\">&nbsp;</span>";
        };
        TagsPopupView.prototype.SearchTemplate = function (name) {
            if (this._Input) {
                var rex = new RegExp("(" + this._Input + ")", "gi");
                return name.replace(rex, "<span class='webix_fmanager_search_mark'>$1</span>");
            }
            return name;
        };
        return TagsPopupView;
    }(filemanager_1.JetView));

    var DoublePanel = (function (_super) {
        __extends(DoublePanel, _super);
        function DoublePanel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DoublePanel.prototype.GetSource = function (mode) {
            return mode === "left" ? this.State.source : "files";
        };
        return DoublePanel;
    }(filemanager_1["panel-double"]));

    var PanelView = (function (_super) {
        __extends(PanelView, _super);
        function PanelView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PanelView.prototype.config = function () {
            var _this = this;
            var ui = _super.prototype.config.call(this);
            var refreshIcon = ui.rows[0].cols[0];
            refreshIcon.click = function () {
                var source = _this.State.source !== "files" ? _this.State.source : "";
                _this.app.getService("local").refresh(_this.State.path, source);
            };
            return ui;
        };
        PanelView.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);
            var uapi = this.app.getService("upload").getUploader();
            this.on(uapi, "onBeforeFileDrop", function (_files, e) {
                if (_this.getRoot().$view.contains(e.target) &&
                    _this.State.source !== "files")
                    return false;
            });
            this.on(this.State.$changes, "source", function (v) { return _this.ProcessSource(v); });
        };
        PanelView.prototype.ProcessPath = function (v) {
            if (this.State.path !== "/")
                _super.prototype.ProcessPath.call(this, v);
        };
        PanelView.prototype.ProcessSource = function (v) {
            var _this = this;
            var _ = this.app.getService("locale")._;
            this.app
                .getService("local")
                .folders()
                .then(function (dirs) {
                var source = _(dirs.getItem("../" + v).value);
                _this.$$("path").setValues({ source: source });
            });
        };
        PanelView.prototype.RenderPath = function (obj) {
            if (obj.path)
                return _super.prototype.RenderPath.call(this, obj);
            else if (obj.source)
                return this.RenderSource(obj);
            return "";
        };
        PanelView.prototype.RenderSource = function (obj) {
            return "<span class=\"webix_fmanager_path_chunk\" data-path=\"0\">" + obj.source + "</span>";
        };
        return PanelView;
    }(filemanager_1.panel));

    var CommentsView = (function (_super) {
        __extends(CommentsView, _super);
        function CommentsView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CommentsView.prototype.config = function () {
            var _this = this;
            var backend = this.app.getService("users");
            return this.app
                .getService("localusers")
                .users()
                .then(function (users) {
                return {
                    localId: "comments",
                    view: "comments",
                    css: "webix_fmanager_comments",
                    mentions: true,
                    users: users,
                    currentUser: 1,
                    scheme: {
                        $init: _this.PrepareComments,
                    },
                    listItem: {
                        templateAvatar: function (obj) {
                            var user = users.getItem(obj.user_id);
                            return "<div class=\"webix_comments_avatar\"><img class=\"webix_comments_avatar_image\" src=\"" + backend.avatarUrl(user.id, user.avatar) + "\" /></div>";
                        },
                    },
                };
            });
        };
        CommentsView.prototype.init = function () {
            var _this = this;
            this.Comments = this.$$("comments");
            this.on(this.Comments, "onBeforeAdd", function (_id, obj) { return _this.AddComment(obj); });
            this.on(this.Comments.queryView("list").data, "onDataUpdate", function (id, obj, old) { return _this.UpdateComment(id, obj, old); });
            this.on(this.Comments, "onBeforeDelete", function (id) { return _this.RemoveComment(id); });
            webix.extend(this.Comments.queryView("list"), webix.OverlayBox);
        };
        CommentsView.prototype.urlChange = function () {
            var file = this.getParam("file");
            this.LoadComments(file);
        };
        CommentsView.prototype.LoadComments = function (v) {
            var _this = this;
            this.File = v;
            this.app
                .getService("users")
                .comments(v.id)
                .then(function (data) {
                _this.Comments.clearAll();
                _this.Comments.parse(data);
                _this.ChangeListState();
            });
        };
        CommentsView.prototype.ChangeListState = function () {
            if (this.Comments.count()) {
                this.Comments.queryView("list").hideOverlay();
            }
            else {
                var _ = this.app.getService("locale")._;
                this.Comments.queryView("list").showOverlay("<div class=\"webix_fmanager_overlay\">" + _("No comments yet") + "</div>");
            }
        };
        CommentsView.prototype.PrepareComments = function (o) {
            if (o && typeof o.date === "string")
                o.date = new Date(o.date);
        };
        CommentsView.prototype.AddComment = function (obj) {
            var _this = this;
            this.app
                .getService("users")
                .addComment(this.File.id, obj.text)
                .then(function (res) {
                obj.id = res.id * 1;
                _this.Silently("add", [obj]);
                _this.ChangeListState();
            });
            return false;
        };
        CommentsView.prototype.UpdateComment = function (id, obj, old) {
            var _this = this;
            this.app
                .getService("users")
                .updateComment(id, obj.text)
                .fail(function () {
                _this.Comments.getItem(id).text = old.text;
                _this.Comments.refresh(id);
            });
        };
        CommentsView.prototype.RemoveComment = function (id) {
            var _this = this;
            this.app
                .getService("users")
                .deleteComment(id)
                .then(function (res) {
                _this.Silently("remove", [res.id]);
                _this.ChangeListState();
            });
            return false;
        };
        CommentsView.prototype.Silently = function (operation, params) {
            var comments = this.Comments;
            comments.blockEvent();
            comments[operation].apply(comments, params);
            comments.unblockEvent();
        };
        return CommentsView;
    }(filemanager_1.JetView));

    var PreviewView = (function (_super) {
        __extends(PreviewView, _super);
        function PreviewView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PreviewView.prototype.config = function () {
            var _ = this.app.getService("locale")._;
            var ui = _super.prototype.config.call(this);
            var toolbar = webix.copy(ui.rows[0]);
            return {
                rows: [
                    toolbar,
                    {
                        localId: "tabview",
                        view: "tabview",
                        css: "webix_fmanager_preview_tabs",
                        cells: [
                            { header: _("Preview"), body: ui.rows[1] },
                            {
                                header: _("Comments"),
                                body: { $subview: true, name: "comments" },
                            },
                        ],
                    },
                ],
            };
        };
        PreviewView.prototype.ShowInfo = function (v) {
            _super.prototype.ShowInfo.call(this, v);
            var tabbar = this.$$("tabview").getTabbar();
            if (v.type === "empty") {
                tabbar.setValue(tabbar.config.options[0].id);
                tabbar.hide();
            }
            else {
                tabbar.show();
                this.show("preview.comments", {
                    target: "comments",
                    params: { file: v },
                });
            }
        };
        return PreviewView;
    }(filemanager_1.preview));

    var InfoPreview = (function (_super) {
        __extends(InfoPreview, _super);
        function InfoPreview() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        InfoPreview.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var tags = {
                css: "webix_fmanager_tags_line",
                rows: [
                    {
                        view: "label",
                        css: "webix_fmanager_info_title",
                        label: _("Tags"),
                    },
                    {
                        cols: [
                            {
                                view: "multicombo",
                                localId: "tags:combo",
                                css: "preview_tags",
                                placeholder: _("Add a tag"),
                                newValues: true,
                                options: {
                                    template: "#name#",
                                    body: {
                                        data: [],
                                        template: function (obj) { return _this.TaglistTemplate(obj); },
                                    },
                                },
                                on: {
                                    onItemClick: function (_id, e) { return _this.SearchTag(e.target); },
                                },
                            },
                            {
                                rows: [
                                    {
                                        cols: [
                                            {
                                                view: "icon",
                                                icon: "wxi-plus",
                                                css: "webix_fmanager_tags_plus",
                                                tooltip: _("Add a tag"),
                                                click: function () {
                                                    var tags = _this.$$("tags:combo");
                                                    tags.getInputNode().click();
                                                    tags.getList().show(tags.$view);
                                                },
                                            },
                                            {
                                                view: "icon",
                                                icon: "dmi-cog",
                                                css: "webix_fmanager_tag_settings",
                                                tooltip: _("Open tag settings"),
                                                click: function () {
                                                    _this.app.callEvent("app:action", ["tags"]);
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
            var ui = _super.prototype.config.call(this);
            var info = ui.cells[0].body;
            info.css = "webix_fmanager_info";
            info.rows.splice(0, 0, tags);
            return ui;
        };
        InfoPreview.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);
            var tags = this.$$("tags:combo");
            this.HandleTagUpdate(tags);
            this.HandleColoring(tags);
            this.HandleTagCreation(tags);
            this.on(this.app, "current:tags:updated", function () { return _this.ReloadTags(); });
        };
        InfoPreview.prototype.ShowInfo = function (v) {
            var _this = this;
            _super.prototype.ShowInfo.call(this, v);
            if (v.type !== "empty") {
                this.File = v;
                var tags_1 = this.$$("tags:combo");
                var all = this.app.getService("localtags").tags();
                var ftags = this.app.getService("tags").getTags(v.id);
                webix.promise.all([all, ftags]).then(function (result) {
                    tags_1.getList().parse(result[0]);
                    _this.SetTagsSilent(tags_1, result[1]);
                });
            }
        };
        InfoPreview.prototype.HandleTagUpdate = function (mc) {
            var _this = this;
            this.on(mc, "onChange", function (nt, ot) {
                if (_this.File) {
                    _this.app
                        .getService("tags")
                        .setTags(_this.File.id, nt.join())
                        .fail(function () {
                        _this.SetTagsSilent(mc, ot);
                    });
                }
            });
        };
        InfoPreview.prototype.SetTagsSilent = function (tags, value) {
            tags.blockEvent();
            tags.setValue(value);
            tags.unblockEvent();
        };
        InfoPreview.prototype.HandleColoring = function (tags) {
            var smallSkin = webix.skin.$name === "mini" || webix.skin.$name === "compact";
            var material = webix.skin.$name === "material" || webix.skin.$name === "mini";
            tags.$renderTag = function (text, height, value) {
                var data = this.getList().getItem(value);
                var content = "<span>" + text + "</span><span class='webix_multicombo_delete' role='button' aria-label='" + webix.i18n.aria.removeItem + "'>" + (material ? "&nbsp;&nbsp;" : "x") + "</span>";
                return "<li class='webix_multicombo_value' style='line-height: " + (height +
                    (smallSkin ? 2 : 0)) + "px; background-color: " + data.color + ";' optvalue='" + webix.template.escape(value) + "'>" + content + "</li>";
            };
        };
        InfoPreview.prototype.ReloadTags = function () {
            var _this = this;
            this.app
                .getService("tags")
                .getTags(this.File.id)
                .then(function (res) {
                _this.SetTagsSilent(_this.$$("tags:combo"), res);
            });
        };
        InfoPreview.prototype.SearchTag = function (target) {
            var tags = this.$$("tags:combo");
            tags.getPopup().hide();
            var node = target.className === "webix_multicombo_value"
                ? target
                : target.parentNode.className === "webix_multicombo_value"
                    ? target.parentNode
                    : null;
            if (!node)
                return;
            var value = node.getAttribute("optvalue");
            this.getParam("state").search = "#" + tags.getList().getItem(value).value;
        };
        InfoPreview.prototype.SwitchTabs = function (tab, hide, show) {
            this.State.search && !this.State.selectedItem.length
                ? tab.show()
                : tab.hide();
            _super.prototype.SwitchTabs.call(this, tab, hide, show);
        };
        InfoPreview.prototype.HandleTagCreation = function (mc) {
            var _this = this;
            var popupList = mc.getList();
            this.on(popupList, "onBeforeAdd", function (id, data) {
                var old = mc.getValue();
                _this.AddTag({ name: data.value, tags: old });
                return false;
            });
            this.SetTaglistOverlay(popupList);
        };
        InfoPreview.prototype.AddTag = function (data) {
            var _this = this;
            var tag = { name: data.name, color: randomColor() };
            this.app
                .getService("operations")
                .addTag(tag, data.tags)
                .then(function () {
                _this.ReloadTags();
            });
        };
        InfoPreview.prototype.SetTaglistOverlay = function (list) {
            var _this = this;
            webix.extend(list, webix.OverlayBox);
            this.on(list.data, "onAfterFilter", function () { return _this.ToggleOverlay(list); });
            this.on(list.getTopParentView(), "onShow", function () { return _this.ToggleOverlay(list); });
        };
        InfoPreview.prototype.ToggleOverlay = function (list) {
            var _ = this.app.getService("locale")._;
            if (!list.count()) {
                list.define({
                    yCount: 1,
                    autoheight: false,
                });
                list.showOverlay(_("Press Enter to create a new tag"));
            }
            else {
                list.define({ autoheight: true, yCount: 5 });
                list.hideOverlay();
            }
            list.resize();
        };
        InfoPreview.prototype.TaglistTemplate = function (obj) {
            var lih = webix.skin.$active.listItemHeight;
            var color = "<span class=\"webix_fmanager_tag_marker\" style=\"background-color:" + obj.color + "; height:" + (lih - 12) + "px; width:" + (lih - 12) + "px; margin-top:" + lih /
                10 + "px;\">&nbsp;</span>";
            return obj.name + color;
        };
        return InfoPreview;
    }(filemanager_1["preview/info"]));

    var TopView = (function (_super) {
        __extends(TopView, _super);
        function TopView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TopView.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);
            this.on(this.app, "app:action", function (name, info) {
                if (name === "share") {
                    _this.show("./menus.popup/menus.sharepopup", {
                        target: "popup",
                        params: { info: info, compact: _this.Compact, label: "Share File" },
                    });
                }
                else if (name === "tags") {
                    _this.show("./menus.popup/menus.tagspopup", {
                        target: "popup",
                        params: { compact: _this.Compact, label: "Manage Tags" },
                    });
                }
            });
        };
        return TopView;
    }(filemanager_1.top));

    var TopBarView = (function (_super) {
        __extends(TopBarView, _super);
        function TopBarView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TopBarView.prototype.config = function () {
            var _this = this;
            var bar = _super.prototype.config.call(this);
            var skin = webix.skin.$active;
            var _ = this.app.getService("locale")._;
            var preview = bar.cols.find(function (c) { return c.localId === "previewMode"; });
            preview.icon = "dmi-gesture-double-tap";
            bar.cols.splice(5, 0, {
                localId: "emptyTrash",
                css: "webix_fmanager_empty_trash",
                view: "button",
                type: "icon",
                icon: "dmi-delete-empty",
                tooltip: _("Empty trash"),
                width: skin.toolbarHeight < 37 ? 48 : 60,
                hidden: true,
                click: function () { return _this.app.callEvent("app:action", ["remove", "all"]); },
            });
            return bar;
        };
        TopBarView.prototype.init = function () {
            var _this = this;
            _super.prototype.init.call(this);
            var common = this.getParam("state");
            this.on(common.$changes, "source", function (v, o) {
                if (v === "trash") {
                    _this.$$("emptyTrash").show();
                    _this.$$("previewMode").hide();
                }
                else if (o === "trash") {
                    _this.$$("emptyTrash").hide();
                    if (!_this.getParam("compact"))
                        _this.$$("previewMode").show();
                }
            });
        };
        return TopBarView;
    }(filemanager_1.topbar));

    var views = {};
    views["cards"] = CardsView;
    views["editor"] = EditorView;
    views["excel"] = SpreadsheetView;
    views["folders"] = FoldersView;
    views["history"] = HistoryView;
    views["list"] = GridView;
    views["menus/menubody"] = MenuBodyView;
    views["menus/popup"] = PopupView;
    views["menus/sharepopup"] = SharePopupView;
    views["menus/tagspopup"] = TagsPopupView;
    views["panel-double"] = DoublePanel;
    views["panel"] = PanelView;
    views["preview/comments"] = CommentsView;
    views["preview"] = PreviewView;
    views["preview/info"] = InfoPreview;
    views["top"] = TopView;
    views["topbar"] = TopBarView;

    var en = {
        Favorite: "Favorite",
        Recent: "Recent",
        Shared: "Shared",
        Trash: "Trash",
        "Add to favorites": "Add to favorites",
        "Remove from favorites": "Remove from favorites",
        Share: "Share",
        Tags: "Tags",
        Comments: "Comments",
        "Can view": "Can view",
        "Can edit": "Can edit",
        "Share File": "Share File",
        "Invite someone...": "Invite someone...",
        Invite: "Invite",
        Restore: "Restore",
        "Delete from trash": "Delete from trash",
        "Restoring...": "Restoring...",
        "Empty trash": "Empty trash",
        "back to ": "back to ",
        "Select a user": "Select a user",
        "Add a tag": "Add a tag",
        "No comments yet": "No comments yet",
        "No users": "No users",
        "Available to": "Available to",
        "user(s)": "user(s)",
        "Manage Tags": "Manage Tags",
        "Press Enter to create a new tag": "Press Enter to create a new tag",
        "Click Add to create a new tag": "Click Add to create a new tag",
        "Open tag settings": "Open tag settings",
        "Type to search a tag": "Type to search a tag",
        "Show version history": "Show version history",
        "Unsaved changes will be lost. Are you sure?": "Unsaved changes will be lost. Are you sure?",
        "Last edited at": "Last edited at",
        "Last edited on": "Last edited on",
        "Back to editor": "Back to editor",
        "Version history": "Version history",
        "Show changes": "Show changes",
        "Restored from": "Restored from",
    };

    var Backend = (function (_super) {
        __extends(Backend, _super);
        function Backend() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Backend.prototype.files = function (id, source) {
            if (!source)
                return _super.prototype.files.call(this, id);
            else {
                return this._files(this.url("files"), { id: id, source: source });
            }
        };
        Backend.prototype.removePermanent = function (id) {
            return webix
                .ajax()
                .del(this.url("delete?id=" + encodeURIComponent(id)))
                .then(function (r) { return r.json(); });
        };
        Backend.prototype.restore = function (id, target) {
            return webix
                .ajax()
                .put(this.url("delete"), {
                id: id,
                target: target,
            })
                .then(function (r) { return r.json(); });
        };
        Backend.prototype.favour = function (id) {
            return webix
                .ajax()
                .post(this.url("favorite"), {
                id: id,
            })
                .then(function (r) { return r.json(); });
        };
        Backend.prototype.unfavour = function (id) {
            return webix
                .ajax()
                .del(this.url("favorite?id=" + encodeURIComponent(id)))
                .then(function (r) { return r.json(); });
        };
        Backend.prototype.writeBinary = function (id, filename, upload) {
            var fd = new FormData();
            fd.append("upload", upload, filename);
            return webix
                .ajax()
                .post(this.url("direct?id=" + encodeURIComponent(id)), fd)
                .then(function (r) { return r.json(); });
        };
        return Backend;
    }(filemanager_2.Backend));

    var LocalData = (function (_super) {
        __extends(LocalData, _super);
        function LocalData() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LocalData.prototype.files = function (path, sync, source) {
            if (!source)
                return _super.prototype.files.call(this, path, sync);
            else {
                var fs = this.fscache.get(source);
                if (sync)
                    return fs;
                if (fs)
                    return Promise.resolve(fs);
                fs = new webix.DataCollection({
                    scheme: {
                        $change: this.prepareData,
                        $serialize: this.serializeData,
                    },
                });
                this.fscache.set(source, fs);
                return this.reload(fs, path, source);
            }
        };
        LocalData.prototype.refresh = function (path, source) {
            var fs = this.fscache.get(source || path);
            if (fs)
                return this.reload(fs, path, source);
        };
        LocalData.prototype.reload = function (fs, path, source) {
            var _this = this;
            if (!source)
                return _super.prototype.reload.call(this, fs, path);
            else {
                return this.app
                    .getService("backend")
                    .files(path, source)
                    .then(function (data) {
                    fs.clearAll();
                    fs.parse(_this.backToFiles().concat(data));
                    return fs;
                });
            }
        };
        LocalData.prototype.backToFiles = function () {
            return [
                {
                    type: "folder",
                    id: "/",
                    value: "..",
                    $row: function (_obj, common) {
                        return (common.backIcon() +
                            ("<span class='webix_fmanager_back'>" + common.backToFiles() + "</span>"));
                    },
                },
            ];
        };
        LocalData.prototype.defaultTree = function () {
            return [
                { value: "My Files", id: "../files", open: true },
                {
                    value: "Favorite",
                    $css: { "margin-top": "20px" },
                    id: "../favorite",
                    icon: "dmi-star",
                },
                { value: "Recent", id: "../recent", icon: "dmi-history" },
                { value: "Shared", id: "../shared", icon: "dmi-share-all" },
                {
                    value: "Trash",
                    $css: { "margin-top": "20px" },
                    id: "../trash",
                    icon: "wxi-trash",
                },
            ];
        };
        LocalData.prototype.addFile = function (id, item) {
            if (!this.hierarchy.exists(id))
                id = "/";
            _super.prototype.addFile.call(this, id, item);
        };
        return LocalData;
    }(filemanager_2.LocalData));

    var Operations = (function (_super) {
        __extends(Operations, _super);
        function Operations() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Operations.prototype.initEvents = function () {
            var _this = this;
            _super.prototype.initEvents.call(this);
            this.app.attachEvent("app:action", function (name, info, target) {
                switch (name) {
                    case "trashed":
                        _this.addToClipboard(name);
                        break;
                    case "restore":
                        _this.restore(info, target);
                        break;
                    case "remove":
                        _this.removePermanent(info);
                        break;
                    case "favorite":
                    case "unfavorite":
                        _this.favour(info);
                        break;
                }
            });
        };
        Operations.prototype.remove = function (files) {
            var _this = this;
            if (files || this.state.selectedItem.length)
                _super.prototype.remove.call(this, files).then(function () {
                    _this.local().refresh("/", "trash");
                });
        };
        Operations.prototype.restore = function (files, target) {
            var _this = this;
            var state = this.state;
            var _ = this.app.getService("locale")._;
            if (!files)
                files = state.selectedItem;
            if (!files.length)
                return;
            files = this.extractIds(files);
            this.app.getService("progress").files(_("Restoring..."), files, function (f) {
                return _this.backend()
                    .restore(f, target)
                    .then(function (res) {
                    var local = _this.local();
                    local.deleteFile(f);
                    local.addFile(_this.dir(res.id), res);
                });
            });
        };
        Operations.prototype.removePermanent = function (files) {
            var _this = this;
            var state = this.state;
            var _ = this.app.getService("locale")._;
            if (files === "all") {
                files = this.local()
                    .files("/", true, "trash")
                    .serialize();
            }
            else {
                if (!files)
                    files = state.selectedItem;
            }
            if (!files.length)
                return;
            files = this.extractIds(files);
            return webix.confirm(_("Are you sure ?")).then(function () {
                _this.app.getService("progress").files(_("Deleting..."), files, function (f) {
                    return _this.backend()
                        .removePermanent(f)
                        .then(function (res) {
                        if (!res.invalid) {
                            _this.local().deleteFile(f);
                        }
                    });
                });
            });
        };
        Operations.prototype.addToClipboard = function (mode) {
            if (this.state.source === "files" || this.state.source === "trash")
                _super.prototype.addToClipboard.call(this, mode);
        };
        Operations.prototype.paste = function () {
            var state = this.state;
            if (!state.clipboard)
                return;
            if (state.source === "files") {
                if (state.clipboard.mode === "trashed")
                    this.restore(state.clipboard.files, state.path);
                else
                    _super.prototype.paste.call(this);
            }
            else if (state.source === "trash" && state.clipboard.mode === "cut") {
                this.remove(state.clipboard.files);
            }
        };
        Operations.prototype.favour = function (files) {
            var _this = this;
            var file = files[0];
            var star = !file.star;
            var backend = this.backend();
            var method = star ? backend.favour : backend.unfavour;
            method.call(backend, file.id).then(function (res) {
                if (!res.invalid) {
                    _this.local().updateFile(res.id, { star: star });
                    _this.local().refresh("/", "favorite");
                }
            });
        };
        Operations.prototype.dir = function (path) {
            return path.slice(0, path.lastIndexOf("/")) || "/";
        };
        Operations.prototype.edit = function (f) {
            var state = this.state;
            if (!f)
                f = state.selectedItem;
            var file = f[0];
            var path;
            if (f.length) {
                if (file.$ext === "xls" || file.$ext === "xlsx") {
                    path = "/excel";
                }
                else if (file.type === "code") {
                    path = "/editor";
                }
                if (path) {
                    this.app.show(path, {
                        params: {
                            file: file,
                            state: state,
                        },
                    });
                }
            }
        };
        Operations.prototype.writeBinary = function (id, filename, file) {
            var _this = this;
            return this.backend()
                .writeBinary(id, filename, file)
                .then(function (data) {
                return _this.local().updateFile(id, {
                    size: data.size,
                    date: data.date,
                });
            });
        };
        Operations.prototype.users = function () {
            return this.app.getService("users");
        };
        Operations.prototype.share = function (file, uid) {
            var _this = this;
            return this.users()
                .share(file.id, uid)
                .then(function (res) {
                return _this.local().updateFile(res.id, {
                    users: (file.users || []).concat(uid),
                });
            });
        };
        Operations.prototype.removeUser = function (file, uid) {
            var _this = this;
            return this.users()
                .removeUser(file.id, uid)
                .then(function (res) {
                return _this.local().updateFile(res.id, {
                    users: file.users.filter(function (u) { return u !== uid; }),
                });
            });
        };
        Operations.prototype.tags = function () {
            return this.app.getService("tags");
        };
        Operations.prototype.localtags = function () {
            return this.app.getService("localtags");
        };
        Operations.prototype.addTag = function (data, tags) {
            var _this = this;
            return this.tags()
                .addTag(data)
                .then(function (res) {
                if (tags !== undefined) {
                    var files = _this.state.selectedItem;
                    var file = files[files.length - 1];
                    _this.tags()
                        .setTags(file.id, tags + "," + res.id)
                        .then(function () {
                        _this.app.callEvent("current:tags:updated");
                    });
                }
                return _this.localtags().addTag(res);
            });
        };
        Operations.prototype.updateTag = function (id, data) {
            var _this = this;
            return this.tags()
                .updateTag(id, data)
                .then(function (res) {
                _this.app.callEvent("current:tags:updated");
                _this.localtags().updateTag(id, res);
            });
        };
        Operations.prototype.removeTag = function (id) {
            var _this = this;
            var _ = this.app.getService("locale")._;
            webix.confirm(_("Are you sure ?")).then(function () {
                _this.tags()
                    .removeTag(id)
                    .then(function (res) {
                    _this.app.callEvent("current:tags:updated");
                    _this.localtags().removeTag(res.id);
                });
            });
        };
        return Operations;
    }(filemanager_2.Operations));

    var Users = (function () {
        function Users(_app, url) {
            this._url = url;
        }
        Users.prototype.url = function (path) {
            return this._url + path;
        };
        Users.prototype.users = function () {
            return webix
                .ajax()
                .get(this.url("users/all"))
                .then(function (r) { return r.json(); });
        };
        Users.prototype.avatarUrl = function (id, name) {
            return this.url("" + name.slice(1));
        };
        Users.prototype.share = function (id, user) {
            return webix
                .ajax()
                .post(this.url("share"), {
                id: id,
                user: user,
            })
                .then(function (r) { return r.json(); });
        };
        Users.prototype.removeUser = function (id, user) {
            return webix
                .ajax()
                .del(this.url("share?id=" + encodeURIComponent(id) + "&user=" + user))
                .then(function (r) { return r.json(); });
        };
        Users.prototype.comments = function (id) {
            return webix
                .ajax()
                .get(this.url("comments?id=" + encodeURIComponent(id)))
                .then(function (res) { return res.json(); });
        };
        Users.prototype.addComment = function (id, value) {
            return webix
                .ajax()
                .post(this.url("comments?id=" + encodeURIComponent(id)), {
                value: value,
            })
                .then(function (res) { return res.json(); });
        };
        Users.prototype.updateComment = function (id, value) {
            return webix
                .ajax()
                .put(this.url("comments/" + id), {
                value: value,
            })
                .then(function (res) { return res.json(); });
        };
        Users.prototype.deleteComment = function (id) {
            return webix
                .ajax()
                .del(this.url("comments/" + id))
                .then(function (res) { return res.json(); });
        };
        return Users;
    }());

    var LocalUsers = (function () {
        function LocalUsers(app) {
            this.app = app;
            this.userlist = new webix.DataCollection({
                scheme: {
                    $change: function (o) {
                        o.value = o.name;
                    },
                },
            });
            this.users_ready = null;
        }
        LocalUsers.prototype.users = function (force) {
            var users = this.userlist;
            if (force || !this.users_ready) {
                this.users_ready = this.app
                    .getService("users")
                    .users()
                    .then(function (data) {
                    users.clearAll();
                    users.parse(data);
                    return users;
                });
            }
            return this.users_ready;
        };
        return LocalUsers;
    }());

    var Tags = (function () {
        function Tags(_app, url) {
            this._url = url;
        }
        Tags.prototype.url = function (path) {
            return this._url + path;
        };
        Tags.prototype.tags = function () {
            return webix
                .ajax()
                .get(this.url("tags/all"))
                .then(function (r) { return r.json(); });
        };
        Tags.prototype.getTags = function (id) {
            return webix
                .ajax()
                .get(this.url("tags?id=" + encodeURIComponent(id)))
                .then(function (r) { return r.json(); });
        };
        Tags.prototype.setTags = function (id, value) {
            return webix
                .ajax()
                .put(this.url("tags"), {
                id: id,
                value: value,
            })
                .then(function (r) { return r.json(); });
        };
        Tags.prototype.addTag = function (data) {
            return webix
                .ajax()
                .post(this.url("tags"), data)
                .then(function (res) { return res.json(); });
        };
        Tags.prototype.updateTag = function (id, data) {
            return webix
                .ajax()
                .put(this.url("tags/" + id), data)
                .then(function (res) { return res.json(); });
        };
        Tags.prototype.removeTag = function (id) {
            return webix
                .ajax()
                .del(this.url("tags/" + id))
                .then(function (res) { return res.json(); });
        };
        return Tags;
    }());

    var LocalTags = (function () {
        function LocalTags(app) {
            this.app = app;
            this.taglist = new webix.DataCollection({});
            this.tags_ready = null;
        }
        LocalTags.prototype.tags = function (force) {
            var tags = this.taglist;
            if (force || !this.tags_ready) {
                this.tags_ready = this.app
                    .getService("tags")
                    .tags()
                    .then(function (data) {
                    tags.clearAll();
                    tags.parse(data);
                    return tags;
                });
            }
            return this.tags_ready;
        };
        LocalTags.prototype.addTag = function (data) {
            return this.taglist.add(data);
        };
        LocalTags.prototype.updateTag = function (id, data) {
            if (this.taglist.exists(id))
                this.taglist.updateItem(id, data);
        };
        LocalTags.prototype.removeTag = function (id) {
            if (this.taglist.exists(id))
                this.taglist.remove(id);
        };
        return LocalTags;
    }());

    var Versions = (function () {
        function Versions(_app, url) {
            this._url = url;
        }
        Versions.prototype.url = function (path) {
            return this._url + path;
        };
        Versions.prototype.versions = function (id) {
            return webix
                .ajax()
                .get(this.url("versions"), { id: id })
                .then(function (r) { return r.json(); });
        };
        Versions.prototype.readText = function (id, diff) {
            var params = { mode: "text" };
            if (diff)
                params.diff = true;
            return webix
                .ajax()
                .get(this.url("versions/" + id), params)
                .then(function (r) { return r.text(); });
        };
        Versions.prototype.restore = function (id, version) {
            return webix
                .ajax()
                .post(this.url("versions"), { id: id, version: version })
                .then(function (r) { return r.json(); });
        };
        Versions.prototype.directLink = function (id) {
            return this.url("versions/" + id + "?mode=binary");
        };
        return Versions;
    }());

    var App = (function (_super) {
        __extends(App, _super);
        function App(config) {
            var _this = this;
            var defaults = {
                version: "8.0.0",
            };
            var override = new Map([
                [filemanager_1["top"], views["top"]],
                [filemanager_1["cards"], views["cards"]],
                [filemanager_1["editor"], views["editor"]],
                [filemanager_1["folders"], views["folders"]],
                [filemanager_1["list"], views["list"]],
                [filemanager_1["menus/menubody"], views["menus/menubody"]],
                [filemanager_1["panel"], views["panel"]],
                [filemanager_1["panel-double"], views["panel-double"]],
                [filemanager_1["preview/info"], views["preview/info"]],
                [filemanager_1["preview"], views["preview"]],
                [filemanager_1["topbar"], views["topbar"]],
                [filemanager_2.Backend, services.Backend],
                [filemanager_2.LocalData, services.LocalData],
                [filemanager_2.Operations, services.Operations],
            ]);
            if (config.override)
                config.override.forEach(function (v, k) { return override.set(k, v); });
            _this = _super.call(this, __assign(__assign(__assign({}, defaults), config), { override: override })) || this;
            _this.setService("users", new (_this.dynamic(Users))(_this, _this.config.url));
            _this.setService("localusers", new (_this.dynamic(LocalUsers))(_this));
            _this.setService("tags", new (_this.dynamic(Tags))(_this, _this.config.url));
            _this.setService("localtags", new (_this.dynamic(LocalTags))(_this));
            _this.setService("versions", new (_this.dynamic(Versions))(_this, _this.config.url));
            return _this;
        }
        App.prototype.require = function (type, name) {
            if (type === "jet-views")
                return views[name];
            else if (type === "jet-locales")
                return locales[name];
            return null;
        };
        App.prototype.dynamic = function (obj) {
            var override = this.config.override;
            if (override) {
                var s = void 0;
                while (obj) {
                    s = obj;
                    obj = override.get(obj);
                }
                return s;
            }
            return obj;
        };
        return App;
    }(filemanager_4));
    webix.protoUI({
        name: "docmanager",
        app: App,
        getState: function () {
            return this.$app.getState();
        },
        getService: function (name) {
            return this.$app.getService(name);
        },
        $init: function () {
            var state = this.$app.getState();
            for (var key in state) {
                link(state, this.config, key);
            }
        },
    }, webix.ui.jetapp);
    webix.extend(views, filemanager_1);
    var services = {
        LocalData: LocalData,
        Backend: Backend,
        Operations: Operations,
        Users: Users,
        LocalUsers: LocalUsers,
        Tags: Tags,
        LocalTags: LocalTags,
        Versions: Versions,
        Progress: filemanager_2.Progress,
        Upload: filemanager_2.Upload,
    };
    var locales = { en: webix.extend(en, filemanager_3.en) };

    exports.App = App;
    exports.locales = locales;
    exports.services = services;
    exports.views = views;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
