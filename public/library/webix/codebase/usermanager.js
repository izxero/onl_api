/*
@license
Webix UserManager v.8.0.0
This software is covered by Webix Commercial License.
Usage without proper license is prohibited.
(c) XB Software Ltd.
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.userManager = {}));
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
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

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
                return root_1.queryView((function (obj) { return (obj.config.id === id || obj.config.localId === id) &&
                    (obj.$scope === root_1.$scope); }), "self");
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
                    !(point instanceof this.webix.DataCollection) && !(point instanceof RegExp)) {
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
                    if (url === "_blank") {
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
            if (over)
                ui = over.get(ui) || ui;
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
            var cb = function (a) { return setTimeout(function () {
                _this.show(a).catch(function (e) {
                    if (!(e instanceof NavigationBlocked))
                        throw e;
                });
            }, 1); };
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
            return require(type + "/" + url);
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

    var HiddenView = (function (_super) {
        __extends(HiddenView, _super);
        function HiddenView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HiddenView.prototype.config = function () {
            return {
                hidden: true,
            };
        };
        return HiddenView;
    }(JetView));

    var AddNewMenuView = (function (_super) {
        __extends(AddNewMenuView, _super);
        function AddNewMenuView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AddNewMenuView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            this.WithRoles = this.app.config.roles;
            var menuItems = [
                {
                    id: "user",
                    value: _("Add new user"),
                },
            ];
            if (this.WithRoles)
                menuItems.push({
                    id: "role",
                    value: _("Add new role"),
                });
            return {
                view: "popup",
                width: 176,
                padding: 0,
                point: 0,
                borderless: true,
                css: "webix_um_add_new_menu",
                body: {
                    view: "menu",
                    autoheight: true,
                    layout: "y",
                    data: menuItems,
                    on: {
                        onMenuItemClick: function (id) {
                            _this.AddNew(id);
                            _this.getRoot().hide();
                        },
                    },
                },
            };
        };
        AddNewMenuView.prototype.AddNew = function (id) {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var prompt = this.app.getService("prompt");
            if (id == "role") {
                prompt
                    .show(_("Enter role name"))
                    .then(function (name) { return _this.app.getService("operations").addRole({ name: name }); })
                    .then(function (data) { return _this.ShowDetails("roles", data.id); });
            }
            else if (id == "user") {
                prompt
                    .show(_("Enter user name"))
                    .then(function (name) {
                    return _this.app.getService("operations").addUser({ name: name });
                })
                    .then(function (data) { return _this.ShowDetails("users", data.id); });
            }
        };
        AddNewMenuView.prototype.ShowDetails = function (collection, id) {
            this.app.callEvent("details:item-click", [collection, id]);
        };
        AddNewMenuView.prototype.Show = function (target) {
            this.getRoot().show(target, { x: 2 });
        };
        return AddNewMenuView;
    }(JetView));

    var SideBarView = (function (_super) {
        __extends(SideBarView, _super);
        function SideBarView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SideBarView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            this.WithRoles = this.app.config.roles;
            var newButton = {
                view: "button",
                localId: "add-button",
                css: "webix_primary",
                type: "icon",
                icon: "wxi-plus",
                label: _("New"),
                click: function () {
                    this.$scope.Menu.Show(this.$view);
                },
            };
            var menuItems = [
                { id: "users", value: _("Users"), icon: "umi-users" },
                { id: "roles", value: _("Roles"), icon: "umi-roles" },
                { id: "rules", value: _("Rules"), icon: "umi-rules" },
            ];
            if (!this.WithRoles)
                menuItems.splice(1, 1);
            var bar = {
                select: true,
                width: 210,
                view: "list",
                css: "webix_um_sidebar_menu",
                localId: "menu",
                click: function (id) { return _this.ShowPage(id); },
                type: {
                    height: webix.skin.$active.listItemHeight + 8,
                },
                data: menuItems,
                template: "<span class='webix_icon #icon#'></span>#value#",
            };
            return {
                css: "webix_um_sidebar",
                type: "clean",
                rows: [
                    {
                        paddingX: 15,
                        paddingY: 15,
                        type: "form",
                        rows: [newButton],
                    },
                    bar,
                ],
            };
        };
        SideBarView.prototype.init = function () {
            var _this = this;
            this.Menu = this.ui(AddNewMenuView);
            this.on(this.app, "onAddButtonClick", function (target) { return _this.Menu.Show(target); });
        };
        SideBarView.prototype.urlChange = function () {
            var page = this.getUrl()[1].page;
            var mode = page.split(".")[0];
            this.$$("menu").select(mode);
        };
        SideBarView.prototype.ShowPage = function (id) {
            this.show("./" + id);
        };
        return SideBarView;
    }(JetView));

    var SideMenu = (function (_super) {
        __extends(SideMenu, _super);
        function SideMenu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SideMenu.prototype.config = function () {
            var _this = this;
            return {
                view: "sidemenu",
                width: 300,
                position: "left",
                state: function (state) {
                    state.left = _this.Parent.left;
                    state.top = _this.Parent.top;
                    state.height = _this.Parent.height;
                },
                body: SideBarView,
            };
        };
        SideMenu.prototype.init = function () {
            var _this = this;
            this.on(this.app, "top:navigation", function () {
                _this.getRoot().hide();
            });
        };
        SideMenu.prototype.Show = function (box) {
            var _this = this;
            if (this.getRoot().isVisible())
                return;
            this.Parent = box;
            this.webix.delay(function () { return _this.getRoot().show(); });
        };
        return SideMenu;
    }(JetView));

    function getInfoList(lists) {
        var result = "";
        lists.forEach(function (config) {
            result += "<div class='webix_um_infolist_header'>";
            if (config.icon)
                result += "<span class='webix_icon " + config.icon + "'></span>";
            result += config.title + " (" + config.data.length + ")</div>";
            result += "<ul class='webix_um_infolist'>";
            config.data.forEach(function (record) {
                result += "<li class='webix_um_infolist_" + config.name + "_item' data-id='" + record.id + "'>";
                result += "<span class='webix_um_infolist_name webix_um_infolist_" + config.name + "_name'>" + record[config.key] + "</span>";
                if (config.deleteIcon)
                    result += "<span class='webix_um_infolist_" + config.name + "_delete webix_icon wxi-close'></span>";
                result += "</li>";
            });
            result += "</ul>";
        });
        return result;
    }

    function addTextMark(value, text) {
        return value.replace(new RegExp("(" + text + ")", "ig"), "<span class='webix_um_search_mark'>$1</span>");
    }
    function text(view) {
        return function (data, type, value) {
            var search = view.EscapedSearchText;
            if (search) {
                value = addTextMark(value, search);
            }
            return value;
        };
    }
    function rule(view) {
        return function (data) {
            var search = view.EscapedSearchText;
            var short = data.short;
            var long = data.long;
            if (search) {
                short = addTextMark(short, search);
                long = addTextMark(long, search);
            }
            return short + ("<div class='webix_um_details_row'>" + long + "</div>");
        };
    }
    function statusBadge(value, _) {
        var status = value ? "Active" : "Not active";
        var cssStatusName = value ? "active" : "not_active";
        var html = "\n\t\t<div class=\"webix_um_badge_container\">\n\t\t\t<span class=\"webix_um_status_badge webix_um_" + cssStatusName + "\">" + _(status) + "</span>\n\t\t</div>";
        return html;
    }
    function roleAvatar(role, cssClass) {
        var css = typeof cssClass == "string" ? cssClass : "webix_um_role_avatar";
        return "<div class='" + css + "' style='background-color: " + (role.color ? role.color : "") + "'>" + (role.name ? role.name.charAt(0).toUpperCase() : "") + "</div>";
    }
    function userCss(name) {
        return " webix_um_avatar_" + ((name.charCodeAt(1) + (name.length % 10)) % 10);
    }
    function userAvatar(user, cssClass) {
        var css = typeof cssClass == "string" ? cssClass : "webix_um_member_avatar";
        if (user.avatar)
            return "<img class=\"" + css + "\" src=\"" + user.avatar + "\"/>";
        return "<div class='" + css + " " + (user.name ? userCss(user.name) : "webix_um_no_name") + "'>" + (user.name ? user.name.charAt(0).toUpperCase() : "") + "</div>";
    }

    var UsersView = (function (_super) {
        __extends(UsersView, _super);
        function UsersView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UsersView.prototype.config = function () {
            var _this = this;
            var padding = { left: 10 };
            var headers = {
                view: "toolbar",
                padding: padding,
                cols: [
                    { view: "label", label: "Role information" },
                    {
                        view: "icon",
                        icon: "wxi-pencil",
                        click: function () { return _this.Edit(_this.ID); },
                    },
                ],
            };
            var details = {
                view: "template",
                localId: "title",
                autoheight: true,
                template: this.TitleTemplate,
            };
            var info = {
                localId: "info",
                template: " ",
                scroll: true,
                onClick: {
                    webix_um_infolist_users_name: function (e) {
                        var id = webix.html.locate(e, "data-id");
                        _this.app.callEvent("details:item-click", ["users", id]);
                    },
                    webix_um_infolist_rules_name: function (e) {
                        var id = webix.html.locate(e, "data-id");
                        _this.app.callEvent("details:item-click", ["rules", id]);
                    },
                },
            };
            return {
                localId: "layout",
                maxWidth: 350,
                rows: [
                    headers,
                    {
                        type: "clean",
                        rows: [details, info],
                    },
                ],
            };
        };
        UsersView.prototype.urlChange = function () {
            if (!this.Compact)
                this.SetValues();
        };
        UsersView.prototype.SetValues = function () {
            var _this = this;
            this.ID = this.getParam("id", true);
            var local = this.app.getService("local");
            var roles = local.roles(true);
            roles.waitData.then(function () {
                var role = roles.getItem(_this.ID);
                _this.SetTitle(role);
                Promise.all([local.rules(), local.users()]).then(function (data) {
                    _this.SetDetails(role, data[0], data[1]);
                });
            });
        };
        UsersView.prototype.SetTitle = function (role) {
            this.$$("title").setValues({ color: role.color, name: role.name });
        };
        UsersView.prototype.TitleTemplate = function (role) {
            return (roleAvatar(role, "webix_um_avatarbox_roles") +
                ("<div class='webix_um_title'>" + (role.name ? role.name : "") + "</div>"));
        };
        UsersView.prototype.SetDetails = function (role, allRules, allUsers) {
            this.$$("info").setHTML(this.GetDetailsHTML(role, allRules, allUsers));
        };
        UsersView.prototype.GetDetailsHTML = function (role, allRules, allUsers) {
            return this.GetListsHTML(role, allRules, allUsers);
        };
        UsersView.prototype.GetListsHTML = function (role, allRules, allUsers) {
            var _ = this.app.getService("locale")._;
            var assigned = this.GetAssignments(role, allRules, allUsers);
            return getInfoList([
                {
                    name: "rules",
                    data: assigned.rules,
                    key: "long",
                    title: _("Rules assigned"),
                    icon: "umi-rules",
                },
                {
                    name: "users",
                    data: assigned.users,
                    key: "name",
                    title: _("Members assigned"),
                    icon: "umi-users",
                },
            ]);
        };
        UsersView.prototype.GetAssignments = function (role, allRules, allUsers) {
            var assigned = {};
            assigned.rules = this.GetRoleRules(role, allRules);
            assigned.users = this.GetRoleMembers(role, allUsers);
            return assigned;
        };
        UsersView.prototype.GetRoleRules = function (role, rules) {
            var rIds = role.rules || [];
            var data = [];
            rIds.forEach(function (id) {
                data.push(rules.getItem(id));
            });
            return data;
        };
        UsersView.prototype.GetRoleMembers = function (role, users) {
            var roleUsers = [];
            users.data.each(function (user) {
                if (user.roles && user.roles.indexOf(role.id) > -1)
                    roleUsers.push(user);
            });
            return roleUsers;
        };
        UsersView.prototype.Edit = function (id) {
            this.show("../../roles?id=" + id + "/roles.editor");
        };
        return UsersView;
    }(JetView));

    var EditorView = (function (_super) {
        __extends(EditorView, _super);
        function EditorView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EditorView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var tabbar = {
                view: "tabbar",
                localId: "tabbar",
                tabMinWidth: 80,
                css: "webix_um_editor_tabbar",
                height: webix.skin.$active.barHeight - 2,
                type: "bottom",
                borderless: true,
                options: [
                    { id: "roles.form", value: _("General") },
                    { id: "roles.rules", value: _("Rules") },
                    { id: "roles.members", value: _("Members") },
                ],
                on: {
                    onChange: function (v) { return _this.SetMode(v); },
                },
            };
            var toolbar = {
                view: "toolbar",
                padding: {
                    left: 2,
                    right: 0,
                    top: 0,
                    bottom: 0,
                },
                cols: [
                    {
                        view: "icon",
                        icon: "umi-back",
                        click: function () {
                            return _this.app.callEvent("details.back:click", [
                                "roles",
                                _this.getParam("id", true),
                            ]);
                        },
                    },
                    tabbar,
                ],
            };
            return {
                rows: [toolbar, { $subview: true }],
            };
        };
        EditorView.prototype.init = function () {
            if (this.getUrl().length < 2)
                this.show("./roles.form");
            else
                this.$$("tabbar").setValue(this.getUrl()[1].page);
        };
        EditorView.prototype.SetMode = function (v) {
            this.show(v);
        };
        return EditorView;
    }(JetView));

    var palette = [
        [
            "#00a037",
            "#13a1aa",
            "#df282f",
            "#fd772c",
            "#6d4bce",
            "#b26bd3",
            "#c87095",
            "#90564d",
        ],
        [
            "#eb2f89",
            "#ea77c0",
            "#777676",
            "#a9a8a8",
            "#9bb402",
            "#e7a90b",
            "#0bbed7",
            "#038cd9",
        ],
    ];

    var UsersView$1 = (function (_super) {
        __extends(UsersView, _super);
        function UsersView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UsersView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            return {
                view: "form",
                localId: "form",
                scroll: "auto",
                margin: 20,
                css: "webix_um_edit_form",
                elementsConfig: {
                    labelWidth: 130,
                    labelAlign: "right",
                },
                rows: [
                    {
                        margin: 10,
                        cols: [
                            {},
                            {
                                view: "button",
                                width: 120,
                                label: _("Delete"),
                                click: function () { return _this.Delete(); },
                            },
                            {
                                width: 120,
                                value: _("Save"),
                                view: "button",
                                css: "webix_primary",
                                click: function () { return _this.Save(); },
                            },
                        ],
                    },
                    {
                        view: "text",
                        label: _("Name"),
                        name: "name",
                        localId: "focus",
                        inputWidth: 370,
                    },
                    {
                        view: "colorpicker",
                        label: _("Color"),
                        name: "color",
                        inputWidth: 370,
                        suggest: {
                            type: "colorboard",
                            padding: 3,
                            body: {
                                view: "colorboard",
                                palette: palette,
                                width: 8 * 29,
                                height: 2 * 29,
                            },
                        },
                    },
                    {},
                ],
            };
        };
        UsersView.prototype.urlChange = function () {
            var _this = this;
            webix.delay(function () { return _this.$$("focus").focus(); });
            this.ID = this.getParam("id", true);
            if (this.ID) {
                var data_1 = this.app.getService("local").roles(true);
                data_1.waitData.then(function () {
                    var role = data_1.getItem(_this.ID);
                    _this.$$("form").setValues(role);
                });
            }
        };
        UsersView.prototype.Save = function () {
            if (this.ID) {
                var roleData = this.$$("form").getValues();
                this.app.getService("operations").updateRole(this.ID, roleData);
            }
        };
        UsersView.prototype.Delete = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            webix
                .confirm({
                title: _("Delete"),
                ok: _("Delete"),
                cancel: _("Cancel"),
                text: _("Are you sure to delete this role ?"),
            })
                .then(function () {
                _this.app.getService("operations").deleteRole(_this.ID);
                _this.app.show("/top/roles/_hidden");
            });
        };
        return UsersView;
    }(JetView));

    var BaseGrid = (function (_super) {
        __extends(BaseGrid, _super);
        function BaseGrid() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseGrid.prototype.config = function () {
            var _this = this;
            var table = {
                view: "datatable",
                localId: "table",
                rowHeight: webix.skin.$active.rowHeight,
                headerRowHeight: webix.skin.$active.barHeight - webix.skin.$active.borderWidth * 2,
                select: true,
                on: {
                    onAfterSelect: function (id) { return _this.ShowDetails(id); },
                },
                columns: [],
            };
            return table;
        };
        BaseGrid.prototype.ShowDetails = function () { };
        BaseGrid.prototype.InitSelf = function (data, id) {
            var _this = this;
            var table = this.$$("table");
            (data.waitData || table.waitData).then(function () {
                if (id)
                    _this.$$("table").select(id);
                _this.on(_this.getParam("state", true).$changes, "search", function (v) {
                    return _this.Find(v);
                });
                _this.Table = table;
            });
            table.parse(data);
        };
        BaseGrid.prototype.urlChange = function () {
            var t = this.Table;
            var id = this.getParam("id", true);
            if (t && id && t.select && t.getSelectedId() != id) {
                t.select(id);
                t.showItem(id);
            }
        };
        BaseGrid.prototype.EscapeRegExp = function (text) {
            return text.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
        };
        BaseGrid.prototype.Find = function (text) {
            var _this = this;
            var table = this.$$("table");
            this.EscapedSearchText = this.EscapeRegExp(text || "");
            if (text) {
                text = text.toLowerCase();
                table.filter(function (data) { return _this.SearchCompare(text, data); });
            }
            else
                table.filter();
        };
        return BaseGrid;
    }(JetView));

    var GridView = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GridView.prototype.config = function () {
            var _ = this.app.getService("locale")._;
            var ui = _super.prototype.config.call(this);
            webix.extend(ui, {
                rowHeight: webix.skin.$active.rowHeight + 10,
                headerRowHeight: webix.skin.$active.barHeight + 10,
            }, true);
            ui.columns = [
                {
                    id: "color",
                    header: "",
                    width: 60,
                    css: "webix_um_center_column ",
                    template: roleAvatar,
                },
                {
                    id: "name",
                    header: _("Name"),
                    fillspace: 2,
                    sort: "string",
                    template: text(this),
                },
            ];
            return ui;
        };
        GridView.prototype.init = function () {
            var users = this.app.getService("local").roles(true);
            this.InitSelf(users, this.getParam("id", true));
        };
        GridView.prototype.ShowDetails = function (id) {
            this.getParentView().ShowDetails(id);
        };
        GridView.prototype.SearchCompare = function (value, role) {
            return role.name.toLowerCase().indexOf(value) > -1;
        };
        return GridView;
    }(BaseGrid));

    var ToolbarView = (function (_super) {
        __extends(ToolbarView, _super);
        function ToolbarView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ToolbarView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var padding = { left: 10, right: 10 };
            var state = this.getParam("state");
            var defbar = {
                view: "toolbar",
                padding: padding,
                batch: "main",
                cols: [
                    {
                        view: "label",
                        label: state.name,
                    },
                    {},
                    {
                        view: "icon",
                        icon: "wxi-search",
                        click: function () { return _this.ShowSearchHeader(); },
                    },
                ],
            };
            var searchbar = {
                view: "toolbar",
                padding: padding,
                batch: "search",
                cols: [
                    { view: "text", localId: "search", placeholder: _("Search") },
                    {
                        view: "icon",
                        icon: "wxi-close",
                        click: function () { return _this.HideSearchHeader(); },
                    },
                ],
            };
            return {
                visibleBatch: "main",
                localId: "header",
                rows: [defbar, searchbar],
            };
        };
        ToolbarView.prototype.init = function () {
            var _this = this;
            this.State = this.getParam("state", true);
            this.$$("search").attachEvent("onTimedKeyPress", function () {
                _this.State.search = _this.$$("search").getValue();
            });
        };
        ToolbarView.prototype.ShowSearchHeader = function () {
            this.$$("header").showBatch("search");
            this.$$("search").focus();
        };
        ToolbarView.prototype.HideSearchHeader = function () {
            this.$$("search").setValue("");
            this.$$("header").showBatch("main");
            this.State.search = "";
        };
        return ToolbarView;
    }(JetView));

    var ToolbarView$1 = (function (_super) {
        __extends(ToolbarView, _super);
        function ToolbarView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ToolbarView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var state = this.getParam("state");
            var ui = _super.prototype.config.call(this);
            ui.rows[0].cols.push({
                view: "toggle",
                width: 150,
                type: "icon",
                icon: "umi-matrix",
                label: _("Rule Matrix"),
                on: {
                    onChange: function (v) { return _this.ToggleVisible(v, state); },
                },
            });
            return ui;
        };
        ToolbarView.prototype.ToggleVisible = function (v, state) {
            state.mode = v ? "matrix" : "grid";
        };
        return ToolbarView;
    }(ToolbarView));

    var RolesView = (function (_super) {
        __extends(RolesView, _super);
        function RolesView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RolesView.prototype.config = function () {
            var _ = this.app.getService("locale")._;
            this.Compact = this.getParam("compact", true);
            this.setParam("state", createState({ mode: "grid", name: _("Roles"), search: "" }));
            return {
                margin: 10,
                padding: 10,
                css: "webix_um_tableview",
                cols: [
                    {
                        localId: "list",
                        rows: [
                            ToolbarView$1,
                            {
                                $subview: true,
                                name: "center",
                            },
                        ],
                    },
                    { $subview: "_hidden", name: "default" },
                ],
            };
        };
        RolesView.prototype.init = function () {
            var _this = this;
            this.on(this.getParam("state").$changes, "mode", function (v) {
                _this.show("roles." + v, { target: "center" });
                if (v === "matrix") {
                    _this.setParam("id", null);
                    _this.show("./_hidden");
                }
            });
            this.on(this.app, "roles.back:click", function () { return _this.HideEditor(); });
        };
        RolesView.prototype.ShowDetails = function (id) {
            var now = this.getParam("id");
            var next = id.toString();
            if (this.getParam("compact", true) || !now) {
                this.app.callEvent("details:item-click", ["roles", next]);
            }
            else if (now !== next) {
                this.setParam("id", next, true);
            }
        };
        RolesView.prototype.ToggleVisible = function (mode) {
            if (mode) {
                this.show("_hidden", { target: "default" });
                this.show("roles.matrix", { target: "center" });
                this.$$("toolbar").showBatch("matrix");
            }
            else {
                this.show("roles.grid", { target: "center" });
                this.$$("toolbar").showBatch("default");
            }
        };
        return RolesView;
    }(JetView));

    var checkedIcon = "<span class='webix_icon wxi-checkbox-marked'></span>";
    var notCheckedIcon = "<span class='webix_icon wxi-checkbox-blank'></span>";
    var checkedIconAlt = "<span class='webix_icon wxi-check'></span>";
    var notCheckedIconAlt = "<span class='webix_icon wxi-minus '></span>";

    var MatrixView = (function (_super) {
        __extends(MatrixView, _super);
        function MatrixView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MatrixView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            this.Sorting = { column: "", dir: "" };
            var ui = _super.prototype.config.call(this);
            webix.extend(ui, {
                css: "webix_um_matrix",
                headerRowHeight: 56,
                rowHeight: 62,
                rowLineHeight: 29,
                leftSplit: 1,
                select: false,
                on: {
                    onItemClick: function (id) { return _this.Toggle(id); },
                    onHeaderClick: function (header) { return _this.ToggleColumnSorting(header.column); },
                },
            }, true);
            return this.GetRoleColumns().then(function (roles) {
                ui.columns = __spreadArrays([
                    {
                        id: "short",
                        header: _("Rules"),
                        width: 220,
                        css: "webix_um_column_name",
                        sort: "string",
                        template: rule(_this),
                    }
                ], roles);
                return ui;
            });
        };
        MatrixView.prototype.init = function () {
            return this.GetData();
        };
        MatrixView.prototype.GetData = function () {
            var _this = this;
            var local = this.app.getService("local");
            return Promise.all([local.roles(), local.rules()]).then(function (res) {
                var data = _this.CreateMatrix(res[0], res[1]);
                _this.InitSelf(data);
            });
        };
        MatrixView.prototype.SearchCompare = function (value, rule) {
            return (rule.short.toLowerCase().indexOf(value) > -1 ||
                rule.long.toLowerCase().indexOf(value) > -1);
        };
        MatrixView.prototype.Save = function (id) {
            var roleId = id.column;
            var role = this.app
                .getService("local")
                .roles(true)
                .getItem(roleId);
            role.rules = [];
            this.$$("table").data.each(function (row) {
                if (row[roleId])
                    role.rules.push(row.id);
            });
            this.app.getService("operations").updateRole(roleId, role);
        };
        MatrixView.prototype.Toggle = function (id) {
            var item = this.$$("table").getItem(id);
            var column = id.column;
            if (column != "short") {
                item[column] = !item[column];
                item.selected = !item.selected;
                this.$$("table").updateItem(id, item);
                this.Save(id);
            }
        };
        MatrixView.prototype.GetRoleColumns = function () {
            return this.app
                .getService("local")
                .roles()
                .then(function (roles) {
                var columns = [];
                roles.data.each(function (role) {
                    columns.push({
                        id: role.id,
                        header: {
                            text: "<span>" + role.name + "</span>",
                            css: "webix_um_center_column webix_um_names",
                        },
                        minWidth: 100,
                        fillspace: 1,
                        css: "webix_um_center_column",
                        template: function (obj) {
                            return obj[role.id] ? checkedIconAlt : notCheckedIconAlt;
                        },
                    });
                });
                return columns;
            });
        };
        MatrixView.prototype.CreateMatrix = function (roles, rules) {
            var data = rules.serialize().map(function (_a) {
                var id = _a.id, short = _a.short, long = _a.long;
                var roleAssigned = {};
                roles.data.each(function (role) {
                    roleAssigned[role.id] = role.rules
                        ? role.rules.indexOf(id) > -1
                        : false;
                });
                return __assign({ id: id, short: short, long: long }, roleAssigned);
            });
            return data;
        };
        MatrixView.prototype.ToggleColumnSorting = function (column) {
            if (column != "short") {
                var dir = this.Sorting.column == column && this.Sorting.dir == "desc"
                    ? "asc"
                    : "desc";
                this.$$("table").sort({ by: column, dir: dir, as: "string" });
                this.$$("table").markSorting(column, dir);
                this.Sorting.dir = dir;
            }
            this.Sorting.column = column;
        };
        return MatrixView;
    }(BaseGrid));

    var UsersView$2 = (function (_super) {
        __extends(UsersView, _super);
        function UsersView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UsersView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var form = {
                view: "form",
                rows: [
                    {
                        rows: [
                            {
                                view: "template",
                                localId: "title",
                                borderless: true,
                                height: 25,
                                css: "webix_um_details_title",
                                template: "#name#",
                                data: { name: "" },
                            },
                            {
                                cols: [
                                    {
                                        view: "template",
                                        localId: "number",
                                        borderless: true,
                                        height: 40,
                                        css: "webix_um_details_title_description",
                                        template: function (v) {
                                            var number = v.number ? v.number : 0;
                                            var descr = !number
                                                ? _("No members")
                                                : _("Members assigned") + " (" + number + ")";
                                            return "<div class=\"webix_um_details_title_description\">" + descr + "</div>";
                                        },
                                        data: { name: "" },
                                    },
                                    {
                                        rows: [
                                            {
                                                view: "toggle",
                                                localId: "toggle",
                                                offLabel: _("Modify"),
                                                onLabel: _("Done"),
                                                width: 160,
                                                on: {
                                                    onChange: function (v) { return _this.ToggleVisible(v); },
                                                },
                                            },
                                            {},
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
            var table = {
                view: "datatable",
                localId: "users",
                css: "webix_um_details_table",
                rowHeight: webix.skin.$active.rowHeight + 10,
                columns: [
                    {
                        id: "selected",
                        hidden: true,
                        header: "",
                        width: 45,
                        cssFormat: function (_, obj) { return (obj.selected ? "webix_um_row_select" : ""); },
                        template: function (obj) {
                            return obj.selected ? checkedIcon : notCheckedIcon;
                        },
                    },
                    {
                        id: "name",
                        header: {
                            content: "textFilter",
                            placeholder: _("Search"),
                        },
                        template: function (obj) { return userAvatar(obj) + obj.name; },
                        fillspace: 2,
                        cssFormat: function (_, obj) { return (obj.selected ? "webix_um_row_select" : ""); },
                    },
                ],
                checkboxRefresh: true,
                on: {
                    onItemClick: function (id) { return _this.Toggle(id.row * 1); },
                },
            };
            return { type: "clean", rows: [form, table] };
        };
        UsersView.prototype.urlChange = function () {
            this.ID = this.getParam("id", true) * 1;
            if (this.ID)
                this.GetData();
        };
        UsersView.prototype.GetData = function () {
            var _this = this;
            var local = this.app.getService("local");
            this.ShowAll = false;
            this.$$("users").registerFilter(this.$$("toggle"), {
                compare: function (_v1, _v2, obj) {
                    return obj.selected;
                },
            }, {
                getValue: function (a) { return (a.getValue() ? "" : true); },
            });
            return Promise.all([local.roles(), local.users()]).then(function (data) {
                _this.Role = webix.copy(data[0].getItem(_this.ID));
                _this.Role.number = 0;
                var users = data[1].serialize().map(function (_a) {
                    var id = _a.id, avatar = _a.avatar, name = _a.name, roles = _a.roles;
                    var selected = roles && roles.indexOf(_this.ID) !== -1;
                    if (selected)
                        _this.Role.number++;
                    return {
                        id: id,
                        avatar: avatar,
                        name: name,
                        selected: selected,
                    };
                });
                _this.$$("users").parse(users);
                _this.$$("title").setValues(_this.Role);
                _this.ShowNumber();
                _this.Filter();
            });
        };
        UsersView.prototype.ShowNumber = function () {
            this.$$("number").setValues(this.Role);
        };
        UsersView.prototype.Save = function (id) {
            var data = this.app.getService("local").users(true);
            var user = data.getItem(id);
            if (this.$$("users").getItem(id).selected) {
                this.Role.number++;
                if (!user.roles)
                    user.roles = [];
                if (user.roles.indexOf(this.ID) < 0)
                    user.roles[user.roles.length] = this.ID;
            }
            else if (user.roles && user.roles.indexOf(this.ID) >= 0) {
                user.roles.splice(user.roles.indexOf(this.ID), 1);
                this.Role.number--;
            }
            this.ShowNumber();
            this.app.getService("operations").updateUser(id, user);
        };
        UsersView.prototype.ToggleVisible = function () {
            this.ShowAll = !this.ShowAll;
            if (this.ShowAll)
                this.$$("users").showColumn("selected");
            else
                this.$$("users").hideColumn("selected");
            this.Filter();
        };
        UsersView.prototype.Toggle = function (id) {
            if (!this.ShowAll)
                return;
            var item = this.$$("users").getItem(id);
            this.$$("users").updateItem(id, { selected: !item.selected });
            this.Save(id);
        };
        UsersView.prototype.Filter = function () {
            this.$$("users").filterByAll();
            this.$$("users").sort(function (a, b) {
                return a.selected == b.selected
                    ? a.name > b.name
                        ? 1
                        : -1
                    : a.selected
                        ? -1
                        : 1;
            });
        };
        return UsersView;
    }(JetView));

    webix.ui.datafilter.umMasterCheckox = webix.extend({
        refresh: function (master, node, config) {
            node.onclick = function () {
                config.checked = !config.checked;
                var elem = node.querySelector(".webix_icon");
                elem.className =
                    "webix_icon wxi-checkbox-" + (config.checked ? "marked" : "blank");
                master.data.each(function (obj) { return (obj[config.columnId] = config.checked); });
                master.refresh();
                master.callEvent("onCustomSave", []);
            };
        },
        render: function (master, config) {
            return config.checked ? checkedIcon : notCheckedIcon;
        },
    }, webix.ui.datafilter.masterCheckbox);

    var RulesView = (function (_super) {
        __extends(RulesView, _super);
        function RulesView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RulesView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var form = {
                view: "form",
                rows: [
                    {
                        rows: [
                            {
                                view: "template",
                                localId: "title",
                                borderless: true,
                                height: 25,
                                css: "webix_um_details_title",
                                template: "#name#",
                                data: { name: "" },
                            },
                            {
                                cols: [
                                    {
                                        view: "template",
                                        localId: "number",
                                        borderless: true,
                                        height: 40,
                                        css: "webix_um_details_title_description",
                                        template: function (v) {
                                            var number = v.rules ? v.rules.length : 0;
                                            var descr = !number
                                                ? _("No rules")
                                                : _("Rules assigned") + " (" + number + ")";
                                            return "<div class=\"webix_um_details_title_description\">" + descr + "</div>";
                                        },
                                        data: { name: "" },
                                    },
                                    {
                                        rows: [
                                            {
                                                view: "toggle",
                                                localId: "toggle",
                                                offLabel: _("Modify"),
                                                onLabel: _("Done"),
                                                width: 160,
                                                on: {
                                                    onChange: function (v) { return _this.ToggleVisible(v); },
                                                },
                                            },
                                            {},
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
            var table = {
                view: "datatable",
                localId: "rules",
                rowHeight: webix.skin.$active.rowHeight > 30 ? 60 : 52,
                rowLineHeight: 28,
                css: "webix_um_details_table webix_um_details_table_rules",
                columns: [
                    {
                        id: "selected",
                        hidden: true,
                        header: { content: "umMasterCheckox", contentId: "ch" },
                        width: 45,
                        css: "webix_um_checkbox_column",
                        cssFormat: function (_, obj) { return (obj.selected ? "webix_um_row_select" : ""); },
                        template: function (obj) {
                            return obj.selected ? checkedIcon : notCheckedIcon;
                        },
                    },
                    {
                        id: "name",
                        header: {
                            content: "textFilter",
                            compare: this.GetCompare(),
                            prepare: function (a) { return a.toLowerCase(); },
                            placeholder: _("Search"),
                        },
                        fillspace: 2,
                        cssFormat: function (_, obj) { return (obj.selected ? "webix_um_row_select" : ""); },
                        template: function (obj) {
                            return (obj.short + ("<div class='webix_um_details_row'>" + obj.long + "</div>"));
                        },
                    },
                ],
                on: {
                    onItemClick: function (id) { return _this.Toggle(id.row * 1); },
                    onCustomSave: function () { return _this.Save(); },
                },
            };
            return {
                type: "clean",
                rows: [
                    {
                        rows: [form, table],
                    },
                ],
            };
        };
        RulesView.prototype.urlChange = function () {
            this.ID = this.getParam("id", true);
            if (this.ID)
                this.GetData();
        };
        RulesView.prototype.GetData = function () {
            var _this = this;
            var local = this.app.getService("local");
            this.ShowAll = false;
            this.$$("rules").registerFilter(this.$$("toggle"), {
                compare: function (_v1, _v2, obj) {
                    return obj.selected;
                },
            }, {
                getValue: function (a) { return (a.getValue() ? "" : true); },
            });
            return Promise.all([local.roles(), local.rules()]).then(function (data) {
                _this.Role = webix.copy(data[0].getItem(_this.ID));
                _this.Role.rules = _this.Role.rules || [];
                var rules = data[1].serialize().map(function (_a) {
                    var id = _a.id, short = _a.short, long = _a.long;
                    return ({
                        id: id,
                        short: short,
                        long: long,
                        selected: _this.Role.rules.indexOf(id) !== -1,
                    });
                });
                _this.$$("rules").parse(rules);
                _this.$$("title").setValues(_this.Role);
                _this.ShowNumber();
                _this.Filter();
            });
        };
        RulesView.prototype.Save = function () {
            var _this = this;
            this.Role.rules = [];
            this.$$("rules").data.each(function (a) {
                if (a.selected)
                    _this.Role.rules.push(a.id);
            }, this, true);
            this.ShowNumber();
            this.app.getService("operations").updateRole(this.Role.id, this.Role);
        };
        RulesView.prototype.ShowNumber = function () {
            this.$$("number").setValues(this.Role);
        };
        RulesView.prototype.ToggleVisible = function () {
            this.ShowAll = !this.ShowAll;
            if (this.ShowAll)
                this.$$("rules").showColumn("selected");
            else
                this.$$("rules").hideColumn("selected");
            this.Filter();
        };
        RulesView.prototype.Toggle = function (id) {
            if (!this.ShowAll)
                return;
            var item = this.$$("rules").getItem(id);
            this.$$("rules").updateItem(id, { selected: !item.selected });
            this.Save();
        };
        RulesView.prototype.Filter = function () {
            this.$$("rules").filterByAll();
            this.$$("rules").sort(function (a, b) {
                return a.selected == b.selected
                    ? a.short > b.short
                        ? 1
                        : -1
                    : a.selected
                        ? -1
                        : 1;
            });
        };
        RulesView.prototype.GetCompare = function () {
            return function (value, searchValue, rule) {
                return (rule.short.toLowerCase().indexOf(searchValue) > -1 ||
                    rule.long.toLowerCase().indexOf(searchValue) > -1);
            };
        };
        return RulesView;
    }(JetView));

    var DetailsView = (function (_super) {
        __extends(DetailsView, _super);
        function DetailsView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DetailsView.prototype.config = function () {
            var _this = this;
            this.WithRoles = this.app.config.roles;
            this.Compact = this.getParam("compact", true);
            var padding = { left: 10 };
            var headers = {
                view: "toolbar",
                padding: padding,
                cols: [
                    {
                        view: "icon",
                        icon: "umi-back",
                        click: function () {
                            return _this.app.callEvent("details.back:click", [
                                "rules",
                                _this.getParam("id", true),
                            ]);
                        },
                        hidden: !this.Compact,
                    },
                    { view: "label", label: "Rule information" },
                    {},
                ],
            };
            var details = {
                view: "template",
                localId: "title",
                autoheight: true,
                template: this.TitleTemplate,
            };
            var info = {
                view: "template",
                localId: "info",
                scroll: true,
                onClick: {
                    webix_um_infolist_users_name: function (e) {
                        var id = webix.html.locate(e, "data-id");
                        _this.app.callEvent("details:item-click", ["users", id]);
                    },
                    webix_um_infolist_roles_name: function (e) {
                        var id = webix.html.locate(e, "data-id");
                        _this.app.callEvent("details:item-click", ["roles", id]);
                    },
                },
            };
            return {
                maxWidth: this.Compact ? 10000 : 350,
                rows: [
                    headers,
                    {
                        type: "clean",
                        rows: [details, info],
                    },
                ],
            };
        };
        DetailsView.prototype.urlChange = function () {
            var _this = this;
            this.ID = this.getParam("id", true) * 1;
            var local = this.app.getService("local");
            var colls = [local.users()];
            if (this.WithRoles)
                colls.push(local.roles());
            var rules = local.rules(true);
            rules.waitData.then(function () {
                if (!_this.getRoot())
                    return;
                var rule = rules.getItem(_this.ID);
                _this.SetTitle(rule);
                Promise.all(colls).then(function (data) {
                    _this.SetDetails(rule, data[0], data[1] || null);
                });
            });
        };
        DetailsView.prototype.SetTitle = function (rule) {
            this.$$("title").setValues(rule);
        };
        DetailsView.prototype.SetDetails = function (rule, allUsers, allRoles) {
            this.$$("info").setHTML(this.GetDetailsHTML(rule, allUsers, allRoles));
        };
        DetailsView.prototype.GetDetailsHTML = function (rule, allUsers, allRoles) {
            return this.GetListsHTML(rule, allUsers, allRoles);
        };
        DetailsView.prototype.TitleTemplate = function (rule) {
            return ("<div class='webix_um_title'>" + (rule.short || "") + "</div>" +
                ("<div class='webix_um_description'>" + (rule.long || "") + "</div>"));
        };
        DetailsView.prototype.GetRoles = function (id, data) {
            var roles = [];
            if (data)
                data.data.each(function (role) {
                    if (role.rules && role.rules.indexOf(id) >= 0)
                        roles.push(role);
                });
            return roles;
        };
        DetailsView.prototype.GetUsers = function (id, uData, rData) {
            var _this = this;
            var users = [];
            uData.data.each(function (user) {
                if (user.rules && user.rules.indexOf(id) >= 0)
                    users.push(user);
                else if (rData && _this.WithRoles && user.roles) {
                    for (var i = 0; i < user.roles.length; i++) {
                        var role = rData.getItem(user.roles[i]);
                        if (role.rules && role.rules.indexOf(id) >= 0) {
                            users.push(user);
                            break;
                        }
                    }
                }
            });
            return users;
        };
        DetailsView.prototype.GetAssignments = function (rule, allUsers, allRoles) {
            var assigned = {};
            assigned.roles = this.GetRoles(rule.id, allRoles);
            assigned.users = this.GetUsers(rule.id, allUsers, allRoles);
            return assigned;
        };
        DetailsView.prototype.GetListsHTML = function (rule, uData, rData) {
            var _ = this.app.getService("locale")._;
            var configs = [];
            var assigned = this.GetAssignments(rule, uData, rData);
            if (this.WithRoles)
                configs.push({
                    name: "roles",
                    data: assigned.roles,
                    key: "name",
                    title: _("Roles"),
                    icon: "umi-roles",
                });
            return getInfoList(configs.concat({
                name: "users",
                data: assigned.users,
                key: "name",
                title: _("Users"),
                icon: "umi-users",
            }));
        };
        return DetailsView;
    }(JetView));

    var RulesGrid = (function (_super) {
        __extends(RulesGrid, _super);
        function RulesGrid() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RulesGrid.prototype.config = function () {
            var _ = this.app.getService("locale")._;
            this.setParam("state", createState({ name: _("Rules"), search: "" }));
            this.Compact = this.getParam("compact", true);
            var ui = _super.prototype.config.call(this);
            webix.extend(ui, {
                rowHeight: webix.skin.$active.rowHeight + 10,
                headerRowHeight: webix.skin.$active.barHeight + 10,
            }, true);
            ui.columns = [
                {
                    id: "short",
                    header: _("Name"),
                    fillspace: 2,
                    sort: "string",
                    template: text(this),
                },
                {
                    id: "long",
                    header: _("Description"),
                    fillspace: 2,
                    sort: "string",
                    template: text(this),
                },
            ];
            return {
                margin: 10,
                padding: 10,
                css: "webix_um_tableview",
                cols: [
                    {
                        rows: [ToolbarView, ui],
                    },
                    { $subview: "_hidden", name: "default" },
                ],
            };
        };
        RulesGrid.prototype.init = function () {
            var _this = this;
            var rules = this.app.getService("local").rules(true);
            this.InitSelf(rules, this.getParam("id"));
            this.on(this.app, "rules.back:click", function () { return _this.HideDetails(); });
        };
        RulesGrid.prototype.ShowDetails = function (id) {
            this.app.callEvent("details:item-click", ["rules", id.toString()]);
        };
        RulesGrid.prototype.SearchCompare = function (value, rule) {
            return (rule.short.toLowerCase().indexOf(value) > -1 ||
                rule.long.toLowerCase().indexOf(value) > -1);
        };
        return RulesGrid;
    }(BaseGrid));

    var TopBarView = (function (_super) {
        __extends(TopBarView, _super);
        function TopBarView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TopBarView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            this.Compact = this.getParam("compact");
            var bar = {
                view: "toolbar",
                paddingY: 9,
                paddingX: 12,
                css: "webix_um_toolbar",
                visibleBatch: "def",
                cols: [
                    {
                        view: "icon",
                        icon: "webix_icon umi-menu",
                        click: function () { return _this.app.callEvent("menu:click", []); },
                        hidden: !this.Compact,
                    },
                    { view: "label", label: _("User Manager") },
                    {},
                    {
                        batch: "saving",
                        view: "label",
                        width: 30,
                        label: "<span class='webix_icon webix_um_saving_icon umi-sync webix_spin'></span>",
                    },
                    {
                        batch: "saved",
                        cols: [
                            {
                                view: "label",
                                label: _("Done"),
                                width: 130,
                                align: "right",
                                css: "webix_um_saved_label",
                            },
                            {
                                view: "label",
                                width: 30,
                                label: "<span class='webix_icon umi-check-circle webix_um_saved_icon'></span>",
                            },
                        ],
                    },
                ],
            };
            return bar;
        };
        TopBarView.prototype.init = function () {
            this.app.getService("progress").handle(this.getRoot());
        };
        return TopBarView;
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

    var TopView = (function (_super) {
        __extends(TopView, _super);
        function TopView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TopView.prototype.config = function () {
            var fCompact = this.getParam("forceCompact");
            var isForced = typeof fCompact !== "undefined";
            if (isForced)
                this.setParam("compact", fCompact);
            this.Compact = this.getParam("compact");
            var cols = this.Compact
                ? [{ $subview: true }]
                : [SideBarView, { $subview: true }];
            return {
                borderless: true,
                view: isForced ? "layout" : "r-layout",
                rows: [
                    TopBarView,
                    {
                        localId: "main",
                        borderless: true,
                        cols: cols,
                    },
                ],
            };
        };
        TopView.prototype.init = function () {
            var _this = this;
            var root = this.getRoot();
            if (root.sizeTrigger)
                root.sizeTrigger(this.app.config.compactWidth, function (mode) { return _this.SetCompactMode(mode); }, !!this.Compact);
            this.on(this.app, "menu:click", function () { return _this.ShowSideMenu(); });
            this.on(this.app, "details:item-click", function (collection, id) {
                return _this.ShowDetails(collection, id);
            });
            this.on(this.app, "details.back:click", function (coll, id) {
                return _this.ShowList(coll, id);
            });
        };
        TopView.prototype.urlChange = function () {
            this.app.callEvent("top:navigation");
        };
        TopView.prototype.SetCompactMode = function (mode) {
            var _this = this;
            webix.delay(function () {
                _this.setParam("compact", mode);
                _this.refresh();
            });
        };
        TopView.prototype.ShowSideMenu = function () {
            if (!this.SideMenu || !this.SideMenu.getRoot())
                this.SideMenu = this.ui(SideMenu);
            var box = this.$$("main").$view.getBoundingClientRect();
            this.SideMenu.Show(box);
        };
        TopView.prototype.ShowDetails = function (collection, id) {
            var details = this.Compact && collection !== "rules" ? "editor" : "details";
            if (this.Compact)
                this.show("./" + collection + "." + details + "?id=" + id);
            else
                this.show("./" + collection + "?id=" + id + "/" + collection + "." + details);
        };
        TopView.prototype.ShowList = function (collection, id) {
            if (this.Compact) {
                this.show("./" + collection);
            }
            else {
                this.show("./" + collection + "?id=" + id + "/" + collection + ".details");
            }
        };
        return TopView;
    }(JetView));

    var dateMask = "%M %d, %Y %H:%i:%s";
    var dateCommonFormat = webix.Date.dateToStr(dateMask);
    var dateFromISO = function (string) { return new Date(string); };

    var AuditView = (function (_super) {
        __extends(AuditView, _super);
        function AuditView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AuditView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            this.Type = "login";
            var form = {
                view: "form",
                rows: [
                    {
                        rows: [
                            {
                                view: "template",
                                localId: "title",
                                borderless: true,
                                height: 30,
                                css: "webix_um_details_title",
                                template: "#name#",
                                data: { name: "" },
                            },
                            {
                                view: "radio",
                                localId: "type",
                                value: this.Type,
                                options: [
                                    { id: "login", value: _("logins") },
                                    { id: "user", value: _("changes to") },
                                    { id: "by-user", value: _("changes by") },
                                ],
                                on: {
                                    onChange: function (t) { return _this.ShowLogTable(t); },
                                },
                            },
                        ],
                    },
                ],
            };
            this.InitColumns(_);
            var table = {
                view: "datatable",
                localId: "audit",
                rowHeight: Math.max(webix.skin.$active.rowHeight, 34),
                columns: this.GetColumns("login"),
                on: {
                    onItemClick: function (id) { return _this.ShowTarget(id); },
                },
            };
            return {
                type: "clean",
                rows: [
                    {
                        rows: [form, table],
                    },
                ],
            };
        };
        AuditView.prototype.init = function () { };
        AuditView.prototype.urlChange = function () {
            var _this = this;
            this.$$("type").setValue(this.Type);
            this.ID = this.getParam("id", true);
            if (this.ID) {
                var local = this.app.getService("local");
                Promise.all([local.users(), local.roles(), local.logsMeta()]).then(function (data) {
                    var user = data[0].getItem(_this.ID);
                    _this.$$("title").setValues(user);
                    _this.ShowLogTable(_this.Type);
                });
            }
        };
        AuditView.prototype.InitColumns = function (_) {
            var _this = this;
            var local = this.app.getService("local");
            var date = {
                id: "date",
                header: _("When"),
                fillspace: true,
                format: function (value) { return dateCommonFormat(dateFromISO(value)); },
            };
            var user_id = {
                id: "user_id",
                header: _("Who"),
                fillspace: true,
                template: function (obj) {
                    var user = local.users(true).getItem(obj["user_id"]);
                    return user
                        ? "<span class=\"webix_um_cell_clickable\">" + user.name + "</span>"
                        : "<span class=\"webix_um_deleted_user\"> " + _("Deleted") + "</span>";
                },
            };
            var target_id = {
                id: "target_id",
                header: _("Target"),
                fillspace: true,
                template: function (obj) {
                    var target = _this.GetTarget(obj).item;
                    return target
                        ? "<span class=\"webix_um_cell_clickable\">" + target.name + "</span>"
                        : "<span class=\"webix_um_deleted_user\"> " + _("Deleted") + "</span>";
                },
            };
            var type = {
                id: "type",
                header: _("Operation"),
                template: function (obj) {
                    var type = local.logsMeta(true)[obj.type];
                    return type ? type.name : obj.type;
                },
                fillspace: true,
            };
            var details = {
                id: "details",
                fillspace: true,
                header: _("Details"),
            };
            this.ColumnBatches = {
                login: [date, details],
                user: [date, user_id, type, details],
                "by-user": [date, target_id, type, details],
            };
        };
        AuditView.prototype.ShowLogTable = function (type) {
            var logs = this.app.getService("backend").logs(type, this.ID);
            var table = this.$$("audit");
            table.clearAll();
            table.refreshColumns(this.GetColumns(type));
            logs.then(function (data) {
                table.parse(data);
            });
        };
        AuditView.prototype.GetColumns = function (type) {
            return webix.copy(this.ColumnBatches[type]);
        };
        AuditView.prototype.ShowTarget = function (id) {
            var column = id.column;
            if (column == "target_id" || column == "user_id") {
                var item = this.$$("audit").getItem(id);
                var targetItem = void 0, type = "users";
                if (column == "target_id") {
                    var target = this.GetTarget(item);
                    targetItem = target.item;
                    if (target.type == "role")
                        type = "roles";
                }
                else
                    targetItem = this.app
                        .getService("local")
                        .users(true)
                        .getItem(item["user_id"]);
                if (targetItem)
                    this.app.callEvent("details:item-click", [type, targetItem.id]);
            }
        };
        AuditView.prototype.GetTarget = function (obj) {
            var local = this.app.getService("local");
            var type = local.logsMeta(true)[obj.type];
            var data = type && type.target == "role" ? local.roles(true) : local.users(true);
            return {
                item: data.getItem(obj["target_id"]),
                type: type ? type.target : "user",
            };
        };
        return AuditView;
    }(JetView));

    var CredentialsWinView = (function (_super) {
        __extends(CredentialsWinView, _super);
        function CredentialsWinView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CredentialsWinView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            return {
                view: "window",
                modal: true,
                move: true,
                width: 300,
                height: 300,
                head: {
                    view: "toolbar",
                    padding: { left: 20, right: 9 },
                    borderless: true,
                    elements: [
                        { view: "label", label: _("New password") },
                        {
                            view: "icon",
                            icon: "wxi-close",
                            hotkey: "esc",
                            click: function () { return _this.getRoot().close(); },
                        },
                    ],
                },
                position: "center",
                body: {
                    view: "form",
                    localId: "form",
                    padding: { top: 20, left: 20, right: 20, bottom: 20 },
                    margin: 2,
                    elements: [
                        {
                            view: "button",
                            label: _("Generate password"),
                            click: function () { return _this.GeneratePassword(); },
                        },
                        {
                            borderless: true,
                            height: 20,
                            cols: [
                                {},
                                {
                                    template: "<div class='webix_um_divider_line'/>",
                                    css: "webix_um_divider",
                                    borderless: true,
                                    width: 40,
                                },
                                {},
                            ],
                        },
                        {
                            margin: 10,
                            rows: [
                                {
                                    labelPosition: "top",
                                    css: "webix_um_passw_label",
                                    label: _("Enter password"),
                                    view: "text",
                                    name: "password",
                                    validate: "isNotEmpty",
                                    type: "password",
                                },
                                {
                                    view: "button",
                                    css: "webix_primary",
                                    label: _("Reset password"),
                                    click: function () { return _this.ResetPassword(); },
                                },
                            ],
                        },
                    ],
                },
                on: {
                    onShow: function () {
                        var input = this.getBody().elements.password.getInputNode();
                        input.focus();
                    },
                },
            };
        };
        CredentialsWinView.prototype.Show = function (id) {
            this.getRoot().show();
            this.ID = this.getParam("id", true) * 1;
            this.credID = id;
        };
        CredentialsWinView.prototype.GeneratePassword = function () {
            this.app.getService("backend").resetPassword(this.ID, { id: this.credID });
            this.getRoot().close();
        };
        CredentialsWinView.prototype.ResetPassword = function () {
            if (this.$$("form").validate()) {
                var record = this.$$("form").getValues().password;
                this.app
                    .getService("backend")
                    .resetPassword(this.ID, { id: this.credID, record: record });
                this.getRoot().close();
            }
        };
        return CredentialsWinView;
    }(JetView));

    var UsersView$3 = (function (_super) {
        __extends(UsersView, _super);
        function UsersView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UsersView.prototype.config = function () {
            var _this = this;
            this.WithRoles = this.app.config.roles;
            var padding = { left: 10 };
            var headers = {
                view: "toolbar",
                padding: padding,
                cols: [
                    { view: "label", label: "User information", width: 125 },
                    {
                        view: "template",
                        css: "webix_um_transparent",
                        localId: "statusBadge",
                        borderless: true,
                    },
                    {
                        view: "icon",
                        icon: "wxi-pencil",
                        click: function () { return _this.Edit(_this.ID); },
                    },
                ],
            };
            var userTemplate = {
                localId: "title",
                template: " ",
                autoheight: true,
            };
            var info = {
                localId: "info",
                template: " ",
                scroll: "auto",
                onClick: {
                    webix_um_infolist_rules_name: function (e) {
                        var id = webix.html.locate(e, "data-id");
                        _this.app.callEvent("details:item-click", ["rules", id]);
                    },
                    webix_um_infolist_roles_name: function (e) {
                        var id = webix.html.locate(e, "data-id");
                        _this.app.callEvent("details:item-click", ["roles", id]);
                    },
                },
            };
            var userDetails = {
                type: "clean",
                rows: [userTemplate, info],
            };
            return {
                maxWidth: 350,
                rows: [headers, userDetails],
            };
        };
        UsersView.prototype.init = function () {
            this._ = this.app.getService("locale")._;
        };
        UsersView.prototype.urlChange = function () {
            var _this = this;
            this.ID = this.getParam("id", true);
            var local = this.app.getService("local");
            var colls = [local.rules()];
            if (this.WithRoles)
                colls.push(local.roles());
            var users = local.users(true);
            users.waitData.then(function () {
                if (!_this.getRoot())
                    return;
                var user = users.getItem(_this.ID);
                _this.SetTitle(user);
                Promise.all(colls).then(function (data) {
                    _this.SetDetails(user, data[0], data[1]);
                });
            });
        };
        UsersView.prototype.SetTitle = function (user) {
            this.$$("statusBadge").setHTML(statusBadge(user.status, this._));
            this.$$("title").setHTML(this.TitleTemplate(user));
        };
        UsersView.prototype.SetDetails = function (user, rules, roles) {
            this.$$("info").setHTML(this.GetDetailsHTML(user, roles, rules));
        };
        UsersView.prototype.GetDetailsHTML = function (user, roles, rules) {
            var userDetails = "";
            userDetails += this.InfoTemplate(user.email, this._("Email"), "umi-email");
            userDetails += this.InfoTemplate(this.FormatDate(user.visited), this._("Last visited"), "umi-clock");
            userDetails += this.GetListsHTML(user, roles, rules);
            return userDetails;
        };
        UsersView.prototype.GetListsHTML = function (user, rolesData, rulesData) {
            var _ = this.app.getService("locale")._;
            var assignedStats = this.GetAssignments(user, rolesData, rulesData);
            var configs = [];
            if (this.WithRoles)
                configs.push({
                    name: "roles",
                    data: assignedStats.roles,
                    key: "name",
                    title: _("Roles"),
                    icon: "umi-roles",
                });
            return getInfoList(configs.concat({
                name: "rules",
                data: assignedStats.rules,
                key: "long",
                title: _("Rules"),
                icon: "umi-rules",
            }));
        };
        UsersView.prototype.GetAssignments = function (user, roles, rules) {
            var stats = {};
            stats.roles = [];
            stats.rules = [];
            if (this.WithRoles && user.roles) {
                roles.data.each(function (role) {
                    if (user.roles.indexOf(role.id) >= 0) {
                        stats.roles.push(role);
                    }
                });
            }
            var rulesHash = {};
            if (user.rules) {
                rules.data.each(function (rule) {
                    if (user.rules.indexOf(rule.id) >= 0 && !rulesHash[rule.id]) {
                        rulesHash[rule.id] = true;
                        stats.rules.push(rule);
                    }
                });
            }
            if (this.WithRoles)
                stats.roles.forEach(function (role) {
                    if (role.rules) {
                        rules.data.each(function (rule) {
                            if (role.rules.indexOf(rule.id) >= 0 && !rulesHash[rule.id]) {
                                rulesHash[rule.id] = true;
                                stats.rules.push(rule);
                            }
                        });
                    }
                });
            return stats;
        };
        UsersView.prototype.TitleTemplate = function (user) {
            return "\n\t\t\t" + userAvatar(user, "webix_um_avatarbox") + "\n\t\t\t<div class=\"webix_um_title\">" + (user.name || this._("Unknown user")) + "</div>";
        };
        UsersView.prototype.InfoTemplate = function (value, title, icon) {
            var result = "\n\t\t\t<div class='webix_um_infolist_header'><span class='webix_icon " + icon + "'></span> " + (title ||
                this._("Unknown")) + ":</div>\n\t\t\t<div class='webix_um_infolist_details'>" + (value || this._("Unknown")) + "</div>\n\t\t";
            return result;
        };
        UsersView.prototype.FormatDate = function (value) {
            if (value) {
                value = dateFromISO(value);
                value = dateCommonFormat(value);
            }
            return value || "";
        };
        UsersView.prototype.Edit = function () {
            this.show("../users.editor");
        };
        return UsersView;
    }(JetView));

    var EditorView$1 = (function (_super) {
        __extends(EditorView, _super);
        function EditorView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EditorView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var options = [
                { id: "users.form", value: _("General") },
                { id: "users.rules", value: _("Rules") },
                { id: "users.audit", value: _("Audit") },
            ];
            if (this.app.config.roles)
                options.splice(2, 0, { id: "users.roles", value: _("Roles") });
            var tabbar = {
                view: "tabbar",
                localId: "tabbar",
                css: "webix_um_editor_tabbar",
                height: webix.skin.$active.barHeight - 2,
                type: "bottom",
                options: options,
                borderless: true,
                on: {
                    onChange: function (v) { return _this.SetMode(v); },
                },
            };
            var toolbar = {
                view: "toolbar",
                padding: {
                    left: 2,
                    right: 0,
                    top: 0,
                    bottom: 0,
                },
                cols: [
                    {
                        view: "icon",
                        icon: "umi-back",
                        click: function () {
                            return _this.app.callEvent("details.back:click", [
                                "users",
                                _this.getParam("id", true),
                            ]);
                        },
                    },
                    tabbar,
                ],
            };
            return {
                rows: [toolbar, { $subview: true }],
            };
        };
        EditorView.prototype.init = function () {
            if (this.getUrl().length < 2)
                this.show("./users.form");
            else
                this.$$("tabbar").setValue(this.getUrl()[1].page);
        };
        EditorView.prototype.SetMode = function (v) {
            this.show(v);
        };
        return EditorView;
    }(JetView));

    var UsersView$4 = (function (_super) {
        __extends(UsersView, _super);
        function UsersView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UsersView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var buttons = {
                view: "form",
                margin: 10,
                cols: [
                    {},
                    {
                        width: 120,
                        value: _("Delete"),
                        view: "button",
                        click: function () { return _this.Delete(); },
                    },
                    {
                        width: 120,
                        value: _("Save"),
                        view: "button",
                        css: "webix_primary",
                        click: function () { return _this.Save(); },
                    },
                ],
            };
            var info = {
                type: "clean",
                rows: [
                    buttons,
                    {
                        view: "form",
                        localId: "form",
                        margin: 20,
                        css: "webix_um_edit_form",
                        scroll: "auto",
                        elementsConfig: {
                            labelAlign: "right",
                            labelWidth: 130,
                        },
                        rows: [
                            {
                                cols: [
                                    {
                                        view: "text",
                                        label: _("Full Name"),
                                        localId: "focus",
                                        name: "name",
                                        gravity: 2,
                                        maxWidth: 550,
                                        minWidth: 420,
                                    },
                                    {},
                                ],
                            },
                            {
                                cols: [
                                    {
                                        view: "text",
                                        label: _("Email"),
                                        name: "email",
                                        gravity: 2,
                                        maxWidth: 550,
                                        minWidth: 420,
                                    },
                                    {},
                                ],
                            },
                            {
                                cols: [
                                    {
                                        view: "forminput",
                                        label: _("Avatar"),
                                        body: {
                                            localId: "avatar",
                                            css: "webix_um_form_avatar",
                                            width: 95,
                                            height: 95,
                                            borderless: true,
                                            template: function (user) {
                                                return "" + userAvatar(user, "webix_um_avatarbox");
                                            },
                                        },
                                    },
                                    {
                                        rows: [
                                            {},
                                            {
                                                view: "uploader",
                                                localId: "avatarUpl",
                                                accept: "image/*",
                                                autowidth: true,
                                                autosend: true,
                                                label: _("Upload new photo"),
                                                type: "icon",
                                                icon: "umi-upload",
                                                css: "webix_transparent webix_um_uploader",
                                                on: {
                                                    onAfterFileAdd: function (fileData) { return _this.UpdateAvatar(fileData); },
                                                    onUploadComplete: function (response) {
                                                        return _this.UpdateAvatar(response);
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                    {},
                                ],
                            },
                            {
                                view: "switch",
                                name: "status",
                                localId: "status",
                                label: _("Status"),
                                css: "webix_um_status_switch",
                                on: {
                                    onChange: function (value) { return _this.UpdateBadge(value); },
                                },
                            },
                            {
                                view: "forminput",
                                label: _("Registered"),
                                body: {
                                    view: "label",
                                    localId: "registeredDate",
                                    css: "webix_um_text_normal",
                                },
                            },
                            {
                                view: "forminput",
                                label: _("Last visited"),
                                body: {
                                    view: "label",
                                    localId: "visitedDate",
                                    css: "webix_um_text_normal",
                                },
                            },
                            {
                                visibleBatch: "def",
                                localId: "credentials",
                                css: "webix_um_credentials",
                                cols: [
                                    {
                                        view: "label",
                                        label: _("Credentials"),
                                        width: 130,
                                        css: "webix_um_form_label",
                                    },
                                    {
                                        batch: "def",
                                    },
                                    {
                                        batch: "no-credentials",
                                        cols: [
                                            {
                                                view: "button",
                                                label: _("Add credentials"),
                                                width: 160,
                                                click: function () { return _this.AddCredentials(); },
                                            },
                                            {},
                                        ],
                                    },
                                    {
                                        batch: "credentials",
                                        margin: 5,
                                        cols: [
                                            {
                                                view: "button",
                                                css: "webix_transparent",
                                                label: _("Reset password"),
                                                width: 140,
                                                click: function () { return _this.ResetPassword(); },
                                            },
                                            {
                                                view: "button",
                                                css: "webix_transparent",
                                                label: _("Delete credentials"),
                                                width: 150,
                                                click: function () { return _this.DeleteCredentials(); },
                                            },
                                            {},
                                        ],
                                    },
                                ],
                            },
                            {
                                cols: [
                                    {
                                        view: "textarea",
                                        name: "details",
                                        label: _("Details"),
                                        height: 128,
                                        gravity: 2,
                                        maxWidth: 550,
                                        minWidth: 420,
                                    },
                                    {},
                                ],
                            },
                            {},
                        ],
                    },
                ],
            };
            return info;
        };
        UsersView.prototype.urlChange = function () {
            var _this = this;
            this.ID = this.getParam("id", true) * 1;
            this.ShowCredentials();
            this.$$("avatarUpl").config.upload = this.app
                .getService("backend")
                .avatar(this.ID);
            this.app
                .getService("local")
                .users()
                .then(function (data) {
                var user = data.getItem(_this.ID);
                _this.$$("form").setValues(user);
                _this.$$("focus").focus();
                _this.$$("registeredDate").setValue(_this.FormatDate(user.registered));
                _this.$$("visitedDate").setValue(_this.FormatDate(user.visited));
                _this.$$("avatar").setValues(user);
            });
        };
        UsersView.prototype.Save = function () {
            var form = this.$$("form");
            this.app.getService("operations").updateUser(this.ID, form.getValues());
        };
        UsersView.prototype.Delete = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            webix
                .confirm({
                title: _("Delete"),
                ok: _("Delete"),
                cancel: _("Cancel"),
                text: _("Are you sure to delete this user?"),
            })
                .then(function () {
                _this.app.getService("operations").deleteUser(_this.ID);
                _this.app.show("/top/users/_hidden");
            });
        };
        UsersView.prototype.UpdateBadge = function (value) {
            var _ = this.app.getService("locale")._;
            var control = this.$$("status");
            var html = statusBadge(value, _);
            control.config.labelRight = html;
            control.refresh();
        };
        UsersView.prototype.UpdateAvatar = function (data) {
            var _this = this;
            if (data.status === "client" && data.file) {
                var reader_1 = new FileReader();
                reader_1.onload = function () {
                    _this.SetLocalAvatar(reader_1.result);
                };
                reader_1.readAsDataURL(data.file);
            }
            else if (data.status === "server") {
                var avatar = data.value;
                this.$$("form").setValues({ avatar: avatar }, true);
                this.SetLocalAvatar(avatar);
            }
        };
        UsersView.prototype.SetLocalAvatar = function (avatar) {
            var _this = this;
            this.$$("avatar").setValues({ avatar: avatar });
            this.app
                .getService("local")
                .users()
                .then(function (data) {
                data.updateItem(_this.ID, { avatar: avatar });
            });
        };
        UsersView.prototype.FormatDate = function (date) {
            if (date) {
                date = dateFromISO(date);
                date = dateCommonFormat(date);
            }
            return date || "";
        };
        UsersView.prototype.ShowCredentials = function () {
            var _this = this;
            var p = this.app.getService("backend").credentials(this.ID);
            p.then(function (data) {
                var batch = data.length ? "credentials" : "no-credentials";
                _this.credID = data.length ? data[0].id : null;
                _this.$$("credentials").showBatch(batch);
            });
        };
        UsersView.prototype.AddCredentials = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            if (!this.CheckEmail())
                return webix.alert({
                    type: "alert-error",
                    title: _("Error: no email"),
                    text: _("Please submit an email first!"),
                });
            var data = { user_id: this.ID, source: 1, record: "test" };
            var p = this.app.getService("backend").addCredentials(this.ID, data);
            p.then(function (response) {
                if (response.id) {
                    _this.credID = response.id;
                    _this.$$("credentials").showBatch("credentials");
                }
            });
        };
        UsersView.prototype.CheckEmail = function () {
            var users = this.app.getService("local").users(true);
            return users.getItem(this.ID).email;
        };
        UsersView.prototype.ResetPassword = function () {
            this.ui(CredentialsWinView).Show(this.credID);
        };
        UsersView.prototype.DeleteCredentials = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            webix
                .confirm({
                title: _("Delete"),
                ok: _("Delete"),
                cancel: _("Cancel"),
                text: _("Are you sure to delete credentials?"),
            })
                .then(function () {
                var p = _this.app
                    .getService("backend")
                    .deleteCredentials(_this.ID, _this.credID);
                p.then(function (data) {
                    if (data.id)
                        _this.ShowCredentials();
                });
            });
        };
        return UsersView;
    }(JetView));

    var GridView$1 = (function (_super) {
        __extends(GridView, _super);
        function GridView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GridView.prototype.config = function () {
            var _ = this.app.getService("locale")._;
            var ui = _super.prototype.config.call(this);
            webix.extend(ui, {
                rowHeight: Math.max(webix.skin.$active.rowHeight +
                    Math.round(webix.skin.$active.rowHeight * 0.55), 40),
                headerRowHeight: webix.skin.$active.barHeight + 10,
            }, true);
            ui.columns = [
                {
                    id: "avatar",
                    header: "",
                    width: 70,
                    css: "webix_um_center_column ",
                    template: function (user) {
                        return userAvatar(user, "webix_um_member_avatar webix_um_member_avatar_big");
                    },
                },
                {
                    id: "name",
                    header: _("Full Name"),
                    fillspace: 2,
                    sort: "string",
                    template: text(this),
                },
                {
                    id: "status",
                    header: _("Status"),
                    width: 150,
                    template: function (data, type, value) { return statusBadge(value, _); },
                },
                {
                    id: "email",
                    header: _("Email"),
                    fillspace: 2,
                    sort: "string",
                    template: text(this),
                },
            ];
            return ui;
        };
        GridView.prototype.init = function () {
            var users = this.app.getService("local").users(true);
            this.InitSelf(users, this.getParam("id", true));
        };
        GridView.prototype.ShowDetails = function (id) {
            this.getParentView().ShowDetails(id);
        };
        GridView.prototype.SearchCompare = function (value, user) {
            return (user.name.toLowerCase().indexOf(value) > -1 ||
                user.email.toLowerCase().indexOf(value) > -1);
        };
        return GridView;
    }(BaseGrid));

    var ToolbarView$2 = (function (_super) {
        __extends(ToolbarView, _super);
        function ToolbarView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ToolbarView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var state = this.getParam("state");
            var ui = _super.prototype.config.call(this);
            ui.rows[0].cols.push({
                view: "toggle",
                width: 150,
                type: "icon",
                icon: "umi-matrix",
                label: this.app.config.roles ? _("Role Matrix") : _("Rule Matrix"),
                on: {
                    onChange: function (v) { return _this.ToggleVisible(v, state); },
                },
            });
            return ui;
        };
        ToolbarView.prototype.ToggleVisible = function (v, state) {
            state.mode = v ? "matrix" : "grid";
        };
        return ToolbarView;
    }(ToolbarView));

    var UsersView$5 = (function (_super) {
        __extends(UsersView, _super);
        function UsersView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UsersView.prototype.config = function () {
            var _ = this.app.getService("locale")._;
            this.Compact = this.getParam("compact", true);
            this.setParam("state", createState({ mode: "grid", name: _("Users"), search: "" }));
            return {
                margin: 10,
                padding: 10,
                css: "webix_um_tableview",
                cols: [
                    {
                        rows: [
                            ToolbarView$2,
                            {
                                $subview: true,
                                name: "center",
                            },
                        ],
                    },
                    { $subview: "_hidden", name: "default" },
                ],
            };
        };
        UsersView.prototype.init = function () {
            var _this = this;
            this.on(this.getParam("state").$changes, "mode", function (v) {
                var path = "users." + v;
                if (v === "matrix" && !_this.app.config.roles)
                    path = "users.rulematrix";
                _this.show(path, { target: "center" });
                if (v === "matrix") {
                    _this.setParam("id", null);
                    _this.show("./_hidden");
                }
            });
        };
        UsersView.prototype.ShowDetails = function (id) {
            var now = this.getParam("id");
            var next = id.toString();
            if (this.getParam("compact", true) || !now) {
                this.app.callEvent("details:item-click", ["users", next]);
            }
            else if (now !== next) {
                this.setParam("id", next, true);
            }
        };
        UsersView.prototype.HideEditor = function () {
            if (this.Compact) {
                this.show("../users/_hidden");
            }
            else {
                this.show("users.details");
            }
        };
        return UsersView;
    }(JetView));

    var MatrixView$1 = (function (_super) {
        __extends(MatrixView, _super);
        function MatrixView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MatrixView.prototype.config = function () {
            var _this = this;
            var ui = _super.prototype.config.call(this);
            this.Sorting = { column: "", dir: "" };
            webix.extend(ui, {
                css: "webix_um_matrix",
                rowHeight: 56,
                headerRowHeight: 56,
                leftSplit: 1,
                select: false,
                on: {
                    onItemClick: function (id) { return _this.Toggle(id); },
                    onHeaderClick: function (header) { return _this.ToggleColumnSorting(header.column); },
                },
            }, true);
            return this.GetRoleColumns().then(function (roles) {
                ui.columns = __spreadArrays([
                    {
                        id: "name",
                        header: "",
                        width: 220,
                        css: "webix_um_column_name",
                        sort: "string",
                        template: text(_this),
                    }
                ], roles);
                return ui;
            });
        };
        MatrixView.prototype.init = function () {
            return this.GetData();
        };
        MatrixView.prototype.GetData = function () {
            var _this = this;
            var local = this.app.getService("local");
            return Promise.all([local.roles(), local.users()]).then(function (res) {
                var data = _this.CreateMatrix(res[0], res[1]);
                _this.InitSelf(data);
            });
        };
        MatrixView.prototype.SearchCompare = function (value, user) {
            return user.name.toLowerCase().indexOf(value) > -1;
        };
        MatrixView.prototype.Save = function (id) {
            var user = this.app
                .getService("local")
                .users(true)
                .getItem(id);
            var gridUser = this.$$("table").getItem(id);
            user.roles = [];
            var roles = this.app.getService("local").roles(true);
            roles.data.each(function (role) {
                if (gridUser[role.id])
                    user.roles.push(role.id);
            });
            this.app.getService("operations").updateUser(id, user);
        };
        MatrixView.prototype.Toggle = function (id) {
            var item = this.$$("table").getItem(id);
            var column = id.column;
            if (column != "name") {
                item[column] = !item[column];
                item.selected = !item.selected;
                this.$$("table").updateItem(id, item);
                this.Save(id);
            }
        };
        MatrixView.prototype.GetRoleColumns = function () {
            return this.app
                .getService("local")
                .roles()
                .then(function (roles) {
                var columns = [];
                roles.data.each(function (role) {
                    columns.push({
                        id: role.id,
                        header: {
                            text: "<span>" + role.name + "</span>",
                            css: "webix_um_center_column webix_um_names",
                        },
                        minWidth: 100,
                        fillspace: 1,
                        css: "webix_um_center_column",
                        template: function (obj) {
                            return obj[role.id] ? checkedIconAlt : notCheckedIconAlt;
                        },
                    });
                });
                return columns;
            });
        };
        MatrixView.prototype.CreateMatrix = function (rolesData, users) {
            var index = 0;
            var data = users.serialize().map(function (_a) {
                var id = _a.id, name = _a.name, roles = _a.roles;
                var roleAssigned = {};
                rolesData.data.each(function (role) {
                    roleAssigned[role.id] = roles ? roles.indexOf(role.id) > -1 : false;
                });
                return __assign({ id: id, name: name, $index: index++ }, roleAssigned);
            });
            return data;
        };
        MatrixView.prototype.ToggleColumnSorting = function (column) {
            if (column != "name") {
                var dir = this.Sorting.column == column && this.Sorting.dir == "desc"
                    ? "asc"
                    : "desc";
                this.$$("table").sort({ by: column, dir: dir, as: "string" });
                this.$$("table").markSorting(column, dir);
                this.Sorting.dir = dir;
            }
            this.Sorting.column = column;
        };
        return MatrixView;
    }(BaseGrid));

    var RolesView$1 = (function (_super) {
        __extends(RolesView, _super);
        function RolesView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RolesView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var form = {
                view: "form",
                rows: [
                    {
                        rows: [
                            {
                                view: "template",
                                localId: "title",
                                borderless: true,
                                height: 30,
                                css: "webix_um_details_title",
                                template: "#name#",
                                data: { name: "" },
                            },
                            {
                                cols: [
                                    {
                                        view: "template",
                                        localId: "number",
                                        borderless: true,
                                        css: "webix_um_details_title_description",
                                        template: function (v) {
                                            var number = v.roles ? v.roles.length : 0;
                                            var descr = !number
                                                ? _("No roles")
                                                : _("Roles assigned") + " (" + number + ")";
                                            return "<div class=\"webix_um_details_title_description\">" + descr + "</div>";
                                        },
                                        data: { name: "" },
                                    },
                                    {
                                        view: "toggle",
                                        localId: "toggle",
                                        offLabel: _("Modify"),
                                        onLabel: _("Done"),
                                        width: 160,
                                        on: {
                                            onChange: function (v) { return _this.ToggleVisible(v); },
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
            var table = {
                view: "datatable",
                localId: "roles",
                css: "webix_um_details_table",
                rowHeight: webix.skin.$active.rowHeight + 10,
                columns: [
                    {
                        id: "selected",
                        hidden: true,
                        header: "",
                        width: 45,
                        cssFormat: function (_, obj) { return (obj.selected ? "webix_um_row_select" : ""); },
                        template: function (obj) {
                            return obj.selected ? checkedIcon : notCheckedIcon;
                        },
                    },
                    {
                        id: "name",
                        header: {
                            content: "textFilter",
                            placeholder: _("Search"),
                            prepare: function (a) { return a.toLowerCase(); },
                        },
                        fillspace: 2,
                        cssFormat: function (_, obj) { return (obj.selected ? "webix_um_row_select" : ""); },
                        template: function (role) {
                            return roleAvatar(role) + role.name;
                        },
                    },
                ],
                on: {
                    onItemClick: function (id) { return _this.Toggle(id.row * 1); },
                },
            };
            return {
                type: "clean",
                rows: [
                    {
                        rows: [form, table],
                    },
                ],
            };
        };
        RolesView.prototype.init = function () {
            this.$$("roles").registerFilter(this.$$("toggle"), {
                compare: function (_v1, _v2, obj) {
                    return obj.selected;
                },
            }, {
                getValue: function (a) { return (a.getValue() ? "" : true); },
            });
        };
        RolesView.prototype.urlChange = function () {
            this.GetData();
        };
        RolesView.prototype.GetData = function () {
            var _this = this;
            var local = this.app.getService("local");
            var id = this.getParam("id", true);
            this.ShowAll = false;
            return Promise.all([local.users(), local.roles()]).then(function (data) {
                _this.User = webix.copy(data[0].getItem(id));
                _this.User.roles = _this.User.roles || [];
                var roles = data[1].serialize().map(function (_a) {
                    var id = _a.id, name = _a.name, color = _a.color;
                    return ({
                        id: id,
                        color: color,
                        name: name,
                        selected: _this.User.roles.indexOf(id) !== -1,
                    });
                });
                _this.$$("roles").parse(roles);
                _this.$$("title").setValues(_this.User);
                _this.ShowNumber();
                _this.Filter();
            });
        };
        RolesView.prototype.Save = function () {
            var _this = this;
            this.User.roles = [];
            this.$$("roles").data.each(function (a) {
                if (a.selected)
                    _this.User.roles.push(a.id);
            }, this, true);
            this.ShowNumber();
            this.app.getService("operations").updateUser(this.User.id, this.User);
        };
        RolesView.prototype.ShowNumber = function () {
            this.$$("number").setValues(this.User);
        };
        RolesView.prototype.ToggleVisible = function () {
            this.ShowAll = !this.ShowAll;
            if (this.ShowAll)
                this.$$("roles").showColumn("selected");
            else
                this.$$("roles").hideColumn("selected");
            this.Filter();
        };
        RolesView.prototype.Toggle = function (id) {
            if (!this.ShowAll)
                return;
            var item = this.$$("roles").getItem(id);
            this.$$("roles").updateItem(id, { selected: !item.selected });
            this.Save();
        };
        RolesView.prototype.Filter = function () {
            this.$$("roles").filterByAll();
            this.$$("roles").sort(function (a, b) {
                return a.selected == b.selected
                    ? a.name > b.name
                        ? 1
                        : -1
                    : a.selected
                        ? -1
                        : 1;
            });
        };
        return RolesView;
    }(JetView));

    var MatrixView$2 = (function (_super) {
        __extends(MatrixView, _super);
        function MatrixView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MatrixView.prototype.config = function () {
            var _this = this;
            this.Sorting = { column: "", dir: "" };
            var ui = _super.prototype.config.call(this);
            webix.extend(ui, {
                css: "webix_um_matrix",
                headerRowHeight: 56,
                rowHeight: 62,
                rowLineHeight: 29,
                leftSplit: 1,
                select: false,
                on: {
                    onItemClick: function (id) { return _this.Toggle(id); },
                    onHeaderClick: function (header) { return _this.ToggleColumnSorting(header.column); },
                },
            }, true);
            return this.GetUserColumns().then(function (users) {
                ui.columns = __spreadArrays([
                    {
                        id: "short",
                        header: "",
                        width: 220,
                        css: "webix_um_column_name",
                        sort: "string",
                        template: rule(_this),
                    }
                ], users);
                return ui;
            });
        };
        MatrixView.prototype.init = function () {
            return this.GetData();
        };
        MatrixView.prototype.GetData = function () {
            var _this = this;
            var local = this.app.getService("local");
            return Promise.all([local.users(), local.rules()]).then(function (res) {
                var data = _this.CreateMatrix(res[0], res[1]);
                _this.InitSelf(data);
            });
        };
        MatrixView.prototype.SearchCompare = function (value, rule) {
            return (rule.short.toLowerCase().indexOf(value) > -1 ||
                rule.long.toLowerCase().indexOf(value) > -1);
        };
        MatrixView.prototype.Save = function (id) {
            var userId = id.column;
            var user = this.app
                .getService("local")
                .users(true)
                .getItem(userId);
            user.rules = [];
            this.$$("table").data.each(function (row) {
                if (row[userId])
                    user.rules.push(row.id);
            });
            this.app.getService("operations").updateUser(userId, user);
        };
        MatrixView.prototype.Toggle = function (id) {
            var item = this.$$("table").getItem(id);
            var column = id.column;
            if (column !== "short") {
                item[column] = !item[column];
                item.selected = !item.selected;
                this.$$("table").updateItem(id, item);
                this.Save(id);
            }
        };
        MatrixView.prototype.GetUserColumns = function () {
            return this.app
                .getService("local")
                .users()
                .then(function (users) {
                var columns = [];
                users.data.each(function (user) {
                    columns.push({
                        id: user.id,
                        header: {
                            text: "<span>" + user.name + "</span>",
                            css: "webix_um_center_column webix_um_names",
                        },
                        minWidth: 100,
                        fillspace: 1,
                        css: "webix_um_center_column",
                        template: function (obj) {
                            return obj[user.id] ? checkedIconAlt : notCheckedIconAlt;
                        },
                    });
                });
                return columns;
            });
        };
        MatrixView.prototype.CreateMatrix = function (users, rules) {
            var data = rules.serialize().map(function (_a) {
                var id = _a.id, short = _a.short, long = _a.long;
                var userAssigned = {};
                users.data.each(function (user) {
                    userAssigned[user.id] = user.rules
                        ? user.rules.indexOf(id) > -1
                        : false;
                });
                return __assign({ id: id, short: short, long: long }, userAssigned);
            });
            return data;
        };
        MatrixView.prototype.ToggleColumnSorting = function (column) {
            if (column !== "short") {
                var dir = this.Sorting.column == column && this.Sorting.dir == "desc"
                    ? "asc"
                    : "desc";
                this.$$("table").sort({ by: column, dir: dir, as: "string" });
                this.$$("table").markSorting(column, dir);
                this.Sorting.dir = dir;
            }
            this.Sorting.column = column;
        };
        return MatrixView;
    }(BaseGrid));

    function getRolesList(roles) {
        var list = "<ul class='webix_um_roleslist'>";
        roles.forEach(function (role) {
            if (role.direct)
                list +=
                    "<li class='webix_um_roleslist_item webix_um_roleslist_item_direct'>";
            else {
                list += "<li class='webix_um_roleslist_item' data-id='" + role.id + "'>";
                list += "<span class='webix_um_roleslist_item_marker webix_icon umi-roles' style='color: " + (role.color ? role.color : "") + "'></span>";
            }
            list += role.name + "</li>";
        });
        list += "</ul>";
        return list;
    }

    var RulesView$1 = (function (_super) {
        __extends(RulesView, _super);
        function RulesView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RulesView.prototype.config = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            this.WithRoles = this.app.config.roles;
            this.State = "direct";
            this.Options = [
                { id: "direct", value: _("Assigned directly") },
                { id: "all", value: _("All assignments") },
            ];
            var form = {
                view: "form",
                rows: [
                    {
                        rows: [
                            {
                                view: "template",
                                localId: "title",
                                borderless: true,
                                height: 30,
                                css: "webix_um_details_title",
                                template: "#name#",
                                data: { name: "" },
                            },
                            {
                                cols: [
                                    {
                                        view: "radio",
                                        localId: "radio",
                                        value: this.State,
                                        vertical: true,
                                        options: this.Options,
                                        on: {
                                            onChange: function (o) { return _this.ToggleTable(o); },
                                        },
                                        hidden: !this.WithRoles,
                                    },
                                    {
                                        view: "template",
                                        localId: "number",
                                        height: 38,
                                        borderless: true,
                                        css: "webix_um_details_title_description",
                                        template: function (v) {
                                            var number = v.rules ? v.rules.length : 0;
                                            var descr = !number
                                                ? _("No rules")
                                                : _("Rules assigned") + " (" + number + ")";
                                            return "<div class=\"webix_um_details_title_description\">" + descr + "</div>";
                                        },
                                        data: { name: "" },
                                        hidden: this.WithRoles,
                                    },
                                    {
                                        rows: [
                                            {
                                                view: "toggle",
                                                localId: "toggle",
                                                offLabel: _("Modify"),
                                                onLabel: _("Done"),
                                                width: 160,
                                                on: {
                                                    onChange: function (v) { return _this.ToggleVisible(v); },
                                                },
                                            },
                                            {},
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };
            var table = {
                view: "datatable",
                localId: "rules",
                rowHeight: webix.skin.$active.rowHeight > 30 ? 60 : 52,
                rowLineHeight: webix.skin.$active.rowHeight > 30 ? 28 : 26,
                css: "webix_um_details_table webix_um_details_table_rules",
                fixedRowHeight: false,
                columns: [
                    {
                        id: "selected",
                        hidden: true,
                        header: "",
                        width: 45,
                        css: "webix_um_checkbox_column",
                        cssFormat: function (_, obj) { return (obj.selected ? "webix_um_row_select" : ""); },
                        template: function (obj) {
                            return obj.selected ? checkedIcon : notCheckedIcon;
                        },
                    },
                    {
                        id: "name",
                        header: {
                            contentId: "filter",
                            content: "textFilter",
                            compare: this.GetCompare(),
                            prepare: function (a) { return a.toLowerCase(); },
                            placeholder: _("Search"),
                        },
                        fillspace: 2,
                        cssFormat: function (_, obj) { return (obj.selected ? "webix_um_row_select" : ""); },
                        template: function (obj) {
                            if (_this.State === "direct")
                                return (obj.short +
                                    ("<div class='webix_um_details_row'>" + obj.long + "</div>"));
                            else
                                return ("<div class='webix_um_assignments_description'>" +
                                    ("<div><span class=\"webix_um_assignments_rule_name\">" + obj.short + "</span>: " + obj.long + "</div>") +
                                    getRolesList(obj.source) +
                                    "</div>");
                        },
                    },
                ],
                on: {
                    onItemClick: function (id) { return _this.Toggle(id.row * 1); },
                    onResize: function () {
                        this.adjustRowHeight("name");
                    },
                },
                onClick: {
                    webix_um_roleslist_item: function (e) {
                        var id = webix.html.locate(e, "data-id");
                        _this.app.callEvent("details:item-click", ["roles", id]);
                    },
                },
            };
            return {
                type: "clean",
                rows: [
                    {
                        rows: [form, table],
                    },
                ],
            };
        };
        RulesView.prototype.init = function () {
            var _this = this;
            this.$$("rules").registerFilter(this.$$("toggle"), {
                compare: function (_v1, _v2, obj) {
                    return obj.selected;
                },
            }, {
                getValue: function (a) { return (a.getValue() || _this.State !== "direct" ? "" : true); },
            });
        };
        RulesView.prototype.urlChange = function () {
            this.ID = this.getParam("id", true);
            this.User = null;
            this.ShowAll = false;
            if (this.State === "direct")
                this.ShowDirectRules();
            else
                this.ShowAllAssignments();
        };
        RulesView.prototype.ToggleTable = function (state) {
            this.State = state;
            this.$$("rules").clearAll();
            this.$$("rules")
                .getHeaderContent("filter")
                .setValue("");
            if (state === "direct") {
                this.ShowDirectRules();
                this.$$("toggle").enable();
            }
            else {
                if (this.ShowAll)
                    this.$$("toggle").setValue(false);
                this.ShowAllAssignments();
                this.$$("toggle").disable();
            }
        };
        RulesView.prototype.SetUser = function (userItem, roles) {
            if (!this.User) {
                this.User = webix.copy(userItem);
                this.$$("title").setValues(this.User);
                this.User.rules = this.User.rules || [];
                this.User.RulesRoles = this.GetRulesRoles(roles);
            }
        };
        RulesView.prototype.ShowDirectRules = function () {
            var _this = this;
            var local = this.app.getService("local");
            Promise.all([local.users(), local.rules(), local.roles()]).then(function (data) {
                _this.SetUser(data[0].getItem(_this.ID), data[2]);
                var rules = data[1].serialize().map(function (_a) {
                    var id = _a.id, short = _a.short, long = _a.long;
                    return ({
                        id: id,
                        short: short,
                        long: long,
                        selected: _this.User.rules.indexOf(id) !== -1,
                    });
                });
                _this.$$("rules").parse(rules);
                _this.ShowNumber();
                _this.Filter();
            });
        };
        RulesView.prototype.ShowAllAssignments = function () {
            var _this = this;
            var _ = this.app.getService("locale")._;
            var local = this.app.getService("local");
            Promise.all([local.users(), local.rules(), local.roles()]).then(function (data) {
                _this.SetUser(data[0].getItem(_this.ID), data[2]);
                var ruleIds = _this.GetAllAssignedRules();
                var userRules = [];
                ruleIds.forEach(function (id) {
                    var rule = data[1].getItem(id);
                    var source = [];
                    if (_this.User.rules.indexOf(id) > -1)
                        source.push({
                            name: _("Assigned directly"),
                            direct: true,
                        });
                    if (_this.User.RulesRoles[id]) {
                        _this.User.RulesRoles[id].forEach(function (roleId) {
                            var role = data[2].getItem(roleId);
                            source.push({
                                id: role.id,
                                name: role.name,
                                color: role.color,
                            });
                        });
                    }
                    userRules.push(__assign(__assign({}, rule), { source: source }));
                });
                _this.$$("rules").parse(userRules);
                _this.$$("rules").adjustRowHeight("name");
            });
        };
        RulesView.prototype.Save = function () {
            var _this = this;
            this.User.rules = [];
            this.$$("rules").data.each(function (a) {
                if (a.selected)
                    _this.User.rules.push(a.id);
            }, this, true);
            this.ShowNumber();
            this.app.getService("operations").updateUser(this.User.id, this.User);
        };
        RulesView.prototype.ShowNumber = function () {
            if (this.WithRoles) {
                var options = this.$$("radio").config.options;
                options[0].value = this.Options[0].value + " (" + this.User.rules.length + ")";
                options[1].value = this.Options[1].value + " (" + this.GetAllAssignedRules().length + ")";
                this.$$("radio").refresh();
            }
            else
                this.$$("number").setValues(this.User);
        };
        RulesView.prototype.GetAllAssignedRules = function () {
            var rules = __spreadArrays(this.User.rules);
            var rulesRoles = this.User.RulesRoles;
            for (var id in rulesRoles) {
                if (rules.indexOf(id) < 0)
                    rules.push(id * 1);
            }
            return rules;
        };
        RulesView.prototype.GetRulesRoles = function (roles) {
            var rules = {};
            (this.User.roles || []).forEach(function (id) {
                var role = roles.getItem(id);
                if (role)
                    (role.rules || []).forEach(function (ruleId) {
                        if (rules[ruleId])
                            rules[ruleId].push(id);
                        else
                            rules[ruleId] = [id];
                    });
            });
            return rules;
        };
        RulesView.prototype.ToggleVisible = function () {
            this.ShowAll = !this.ShowAll;
            if (this.ShowAll)
                this.$$("rules").showColumn("selected");
            else
                this.$$("rules").hideColumn("selected");
            this.Filter();
        };
        RulesView.prototype.Toggle = function (id) {
            if (!this.ShowAll || this.State !== "direct")
                return;
            var item = this.$$("rules").getItem(id);
            this.$$("rules").updateItem(id, { selected: !item.selected });
            this.Save();
        };
        RulesView.prototype.Filter = function () {
            this.$$("rules").filterByAll();
            this.$$("rules").sort(function (a, b) {
                return a.selected == b.selected
                    ? a.short > b.short
                        ? 1
                        : -1
                    : a.selected
                        ? -1
                        : 1;
            });
        };
        RulesView.prototype.GetCompare = function () {
            return function (value, searchValue, rule) {
                return (rule.short.toLowerCase().indexOf(searchValue) > -1 ||
                    rule.long.toLowerCase().indexOf(searchValue) > -1);
            };
        };
        return RulesView;
    }(JetView));

    var views = { JetView: JetView };
    views["_hidden"] = HiddenView;
    views["addmenu"] = AddNewMenuView;
    views["compact/sidemenu"] = SideMenu;
    views["roles/details"] = UsersView;
    views["roles/editor"] = EditorView;
    views["roles/form"] = UsersView$1;
    views["roles/grid"] = GridView;
    views["roles"] = RolesView;
    views["roles/matrix"] = MatrixView;
    views["roles/members"] = UsersView$2;
    views["roles/rules"] = RulesView;
    views["roles/toolbar"] = ToolbarView$1;
    views["rules/details"] = DetailsView;
    views["rules"] = RulesGrid;
    views["sections/toolbar"] = ToolbarView;
    views["sections/view"] = BaseGrid;
    views["sidebar"] = SideBarView;
    views["top"] = TopView;
    views["topbar"] = TopBarView;
    views["users/audit"] = AuditView;
    views["users/credentials"] = CredentialsWinView;
    views["users/details"] = UsersView$3;
    views["users/editor"] = EditorView$1;
    views["users/form"] = UsersView$4;
    views["users/grid"] = GridView$1;
    views["users"] = UsersView$5;
    views["users/matrix"] = MatrixView$1;
    views["users/roles"] = RolesView$1;
    views["users/rulematrix"] = MatrixView$2;
    views["users/rules"] = RulesView$1;
    views["users/toolbar"] = ToolbarView$2;

    var en = {
        Active: "Active",
        "Add credentials": "Add credentials",
        "Are you sure to delete credentials?": "Are you sure to delete credentials?",
        "Add new user": "Add new user",
        "Are you sure to delete this user?": "Are you sure to delete this user?",
        Audit: "Audit",
        Avatar: "Avatar",
        Cancel: "Cancel",
        "changes by": "changes by",
        "changes to": "changes to",
        Color: "Color",
        Credentials: "Credentials",
        Delete: "Delete",
        Deleted: "Deleted",
        "Delete credentials": "Delete credentials",
        Details: "Details",
        Done: "Done",
        "Enter password": "Enter password",
        "Enter user name": "Enter user name",
        "Error: no email": "Error: no email",
        "Full Name": "Full Name",
        General: "General",
        "Generate password": "Generate password",
        Description: "Description",
        Email: "Email",
        "Last visited": "Last visited",
        logins: "logins",
        Members: "Members",
        "Members assigned": "Members assigned",
        Modify: "Modify",
        Name: "Name",
        New: "New",
        "New password": "New password",
        "Not active": "Not active",
        "No members": "No members assigned",
        "No rules": "No rules assigned",
        Operation: "Operation",
        "Please submit an email first!": "Please submit an email first!",
        Registered: "Registered",
        "Reset password": "Reset password",
        Rules: "Rules",
        "Rules assigned": "Rules assigned",
        "Rule Matrix": "Rule Matrix",
        Save: "Save",
        Search: "Search",
        Status: "Status",
        Target: "Target",
        Unknown: "Unknown",
        "Unknown user": "Unknown user",
        "Upload new photo": "Upload new photo",
        "User Manager": "User Manager",
        Users: "Users",
        When: "When",
        Who: "Who",
        "Add new role": "Add new role",
        "All assignments": "All assignments",
        "Are you sure to delete this role ?": "Are you sure to delete this role?",
        "Assigned directly": "Assigned directly",
        "Enter role name": "Enter role name",
        "No roles": "No roles assigned",
        Role: "Role",
        Roles: "Roles",
        "Roles assigned": "Roles assigned",
        "Role Matrix": "Role Matrix",
    };

    var Backend = (function () {
        function Backend(_app, url) {
            this._url = url;
        }
        Backend.prototype.get = function (path) {
            return webix.ajax(this._url + path).then(function (a) { return a.json(); });
        };
        Backend.prototype.save = function (path, data, mode) {
            var x = webix.ajax().headers({ "Content-type": "application/json" });
            if (mode == 0)
                x = x.post(this._url + path, data);
            if (mode == 1)
                x = x.del(this._url + path, data);
            if (mode == 2)
                x = x.put(this._url + path, data);
            return x.then(function (a) { return a.json(); });
        };
        Backend.prototype.users = function () {
            return this.get("users");
        };
        Backend.prototype.addUser = function (data) {
            return this.save("users", data, 0);
        };
        Backend.prototype.deleteUser = function (id) {
            return this.save("users/" + id, {}, 1);
        };
        Backend.prototype.updateUser = function (id, data) {
            return this.save("users/" + id, data, 2);
        };
        Backend.prototype.roles = function () {
            return this.get("roles");
        };
        Backend.prototype.addRole = function (data) {
            return this.save("roles", data, 0);
        };
        Backend.prototype.deleteRole = function (id) {
            return this.save("roles/" + id, {}, 1);
        };
        Backend.prototype.updateRole = function (id, data) {
            return this.save("roles/" + id, data, 2);
        };
        Backend.prototype.rules = function () {
            return this.get("rules");
        };
        Backend.prototype.meta = function () {
            return this.get("meta");
        };
        Backend.prototype.avatar = function (id) {
            return this._url + ("users/" + id + "/avatar");
        };
        Backend.prototype.credentials = function (id) {
            return this.get("user/" + id + "/credentials");
        };
        Backend.prototype.addCredentials = function (id, data) {
            return this.save("user/" + id + "/credentials", data, 0);
        };
        Backend.prototype.resetPassword = function (id, data) {
            return this.save("user/" + id + "/credentials", data, 2);
        };
        Backend.prototype.deleteCredentials = function (id, credId) {
            return this.save("user/" + id + "/credentials/" + credId, {}, 1);
        };
        Backend.prototype.logs = function (type, id) {
            return this.get("logs/" + type + "/" + id);
        };
        Backend.prototype.logsMeta = function () {
            return this.get("logs/meta");
        };
        return Backend;
    }());

    var Local = (function () {
        function Local(_app) {
            this._back = _app.getService("backend");
            this._data = new Map();
        }
        Local.prototype.rules = function (now) {
            var _this = this;
            return getColl(this._data, 1, function () { return _this._back.rules(); }, now);
        };
        Local.prototype.users = function (now) {
            var _this = this;
            var meta = this.meta();
            return getColl(this._data, 2, function () { return _this._back.users(); }, now, function (c) {
                return meta.then(function (links) {
                    links.UserRule.forEach(function (a) {
                        var obj = c.getItem(a[0]);
                        if (obj) {
                            if (!obj.rules)
                                obj.rules = [];
                            obj.rules.push(a[1]);
                        }
                    });
                    links.UserRole.forEach(function (a) {
                        var obj = c.getItem(a[0]);
                        if (obj) {
                            if (!obj.roles)
                                obj.roles = [];
                            obj.roles.push(a[1]);
                        }
                    });
                    return c;
                });
            });
        };
        Local.prototype.roles = function (now) {
            var _this = this;
            var meta = this.meta();
            return getColl(this._data, 3, function () { return _this._back.roles(); }, now, function (c) {
                return meta.then(function (links) {
                    links.RoleRule.forEach(function (a) {
                        var obj = c.getItem(a[0]);
                        if (obj) {
                            if (!obj.rules)
                                obj.rules = [];
                            obj.rules.push(a[1]);
                        }
                    });
                    return c;
                });
            });
        };
        Local.prototype.meta = function (now) {
            var _this = this;
            return getSome(this._data, 4, function () { return _this._back.meta(); }, now);
        };
        Local.prototype.logsMeta = function (now) {
            var _this = this;
            return getSome(this._data, 5, function () { return _this._back.logsMeta(); }, now);
        };
        return Local;
    }());
    function getColl(store, key, handler, now, post) {
        if (!store.has(key)) {
            var x_1 = {
                promise: handler().then(function (data) {
                    x_1.obj.parse(data);
                    return x_1.obj;
                }),
                obj: new webix.DataCollection({}),
            };
            if (post)
                x_1.promise = x_1.promise.then(post);
            store.set(key, x_1);
        }
        var x = store.get(key);
        return now ? x.obj : x.promise;
    }
    function getSome(store, key, handler, now) {
        if (!store.has(key)) {
            var x_2 = {
                promise: handler().then(function (data) { return (x_2.obj = data); }),
                obj: null,
            };
            store.set(key, x_2);
        }
        var x = store.get(key);
        return now ? x.obj : x.promise;
    }

    var Local$1 = (function () {
        function Local(_app) {
            this._back = _app.getService("backend");
            this._local = _app.getService("local");
            this._app = _app;
        }
        Local.prototype.progressStart = function () {
            this._app.getService("progress").start();
        };
        Local.prototype.progressEnd = function () {
            this._app.getService("progress").end();
        };
        Local.prototype.addRole = function (obj) {
            var _this = this;
            this.progressStart();
            return Promise.all([this._back.addRole(obj), this._local.roles()]).then(function (data) {
                _this.progressEnd();
                obj.id = data[0].id;
                data[1].add(obj);
                return obj;
            });
        };
        Local.prototype.addUser = function (obj) {
            var _this = this;
            this.progressStart();
            return Promise.all([this._back.addUser(obj), this._local.users()]).then(function (data) {
                _this.progressEnd();
                obj.id = data[0].id;
                data[1].add(obj);
                return obj;
            });
        };
        Local.prototype.updateUser = function (id, obj) {
            var _this = this;
            this.progressStart();
            return Promise.all([
                this._back.updateUser(id, obj),
                this._local.users(),
            ]).then(function (data) {
                _this.progressEnd();
                data[1].updateItem(id, obj);
                return obj;
            });
        };
        Local.prototype.deleteUser = function (id) {
            var _this = this;
            this.progressStart();
            return Promise.all([this._back.deleteUser(id), this._local.users()]).then(function (data) {
                _this.progressEnd();
                data[1].remove(id);
                return id;
            });
        };
        Local.prototype.updateRole = function (id, obj) {
            var _this = this;
            this.progressStart();
            return Promise.all([
                this._back.updateRole(id, obj),
                this._local.roles(),
            ]).then(function (data) {
                _this.progressEnd();
                data[1].updateItem(id, obj);
                return obj;
            });
        };
        Local.prototype.deleteRole = function (id) {
            var _this = this;
            this.progressStart();
            return Promise.all([this._back.deleteRole(id), this._local.roles()]).then(function (data) {
                _this.progressEnd();
                data[1].remove(id);
                return id;
            });
        };
        return Local;
    }());

    var Progress = (function () {
        function Progress() {
            this.view = null;
        }
        Progress.prototype.handle = function (view) {
            this.view = view;
        };
        Progress.prototype.start = function () {
            var _this = this;
            var view = this.view;
            if (!view || view.$destructed)
                return;
            view.showBatch("saving");
            if (this._progressDelay)
                clearTimeout(this._progressDelay);
            this._progressDelay = window.setTimeout(function () {
                if (!view || view.$destructed)
                    return;
                _this.end();
            }, 3000);
        };
        Progress.prototype.end = function () {
            var view = this.view;
            if (!view || view.$destructed)
                return;
            view.showBatch("saved");
            if (this._progressDelay)
                clearTimeout(this._progressDelay);
            if (this._hideDelay)
                clearTimeout(this._hideDelay);
            this._hideDelay = window.setTimeout(function () {
                if (!view || view.$destructed)
                    return;
                view.showBatch("def");
            }, 3000);
        };
        return Progress;
    }());

    var Prompt = (function () {
        function Prompt(app) {
            this.view = null;
            this.result = null;
            this._app = app;
        }
        Prompt.prototype.close = function () {
            this.view.close();
            this.view = null;
        };
        Prompt.prototype.config = function (text) {
            var _this = this;
            var _ = this._app.getService("locale")._;
            return {
                view: "window",
                modal: true,
                move: true,
                width: 350,
                css: "webix_um_prompt",
                head: {
                    view: "toolbar",
                    padding: {
                        left: webix.skin.$active.layoutPadding.form,
                        right: webix.skin.$active.layoutPadding.form - 5,
                    },
                    borderless: true,
                    cols: [
                        { view: "label", label: text },
                        {
                            view: "icon",
                            icon: "wxi-close",
                            hotkey: "esc",
                            click: function () {
                                _this.result.reject("prompt cancelled");
                                _this.close();
                            },
                        },
                    ],
                },
                position: "center",
                body: {
                    view: "form",
                    padding: {
                        top: webix.skin.$active.layoutPadding.form / 2,
                        bottom: webix.skin.$active.layoutPadding.form,
                    },
                    cols: [
                        {
                            view: "text",
                            name: "name",
                            value: "",
                        },
                        {
                            view: "button",
                            value: _("Save"),
                            css: "webix_primary",
                            width: 100,
                            hotkey: "enter",
                            click: function () {
                                var form = _this.view.getBody();
                                if (form.validate()) {
                                    var newname = form.getValues().name;
                                    _this.result.resolve(newname);
                                    _this.close();
                                }
                                else {
                                    webix.UIManager.setFocus(form);
                                }
                            },
                        },
                    ],
                },
                on: {
                    onShow: function () {
                        var input = this.getBody().elements.name.getInputNode();
                        input.focus();
                    },
                },
            };
        };
        Prompt.prototype.show = function (text) {
            var _this = this;
            this.result = new webix.promise.defer();
            this.view = webix.ui(this.config(text));
            webix.delay(function () { return _this.view.show(); });
            return this.result;
        };
        return Prompt;
    }());

    var App = (function (_super) {
        __extends(App, _super);
        function App(config) {
            var _this = this;
            var state = createState({});
            var params = { state: state };
            if (config.compact)
                params.forceCompact = config.compact;
            var defaults = {
                router: EmptyRouter,
                version: "8.0.0",
                debug: true,
                start: "/top/users",
                roles: true,
                compactWidth: 1000,
                params: params,
            };
            _this = _super.call(this, __assign(__assign({}, defaults), config)) || this;
            var dynamic = function (obj) {
                return _this.config.override ? _this.config.override.get(obj) || obj : obj;
            };
            _this.setService("backend", new (dynamic(Backend))(_this, _this.config.url));
            _this.setService("progress", new (dynamic(Progress))());
            _this.setService("local", new (dynamic(Local))(_this));
            _this.setService("operations", new (dynamic(Local$1))(_this));
            _this.setService("prompt", new (dynamic(Prompt))(_this));
            _this.use(plugins.Locale, _this.config.locale || {
                lang: "en",
                webix: {
                    en: "en-US",
                },
            });
            return _this;
        }
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
        name: "usermanager",
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
    var services = { Backend: Backend, Local: Local, Operations: Local$1, Progress: Progress, Prompt: Prompt };
    var locales = { en: en };

    exports.App = App;
    exports.locales = locales;
    exports.services = services;
    exports.views = views;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
