if (typeof desktopJS === "undefined") {(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.desktopJS = {}));
}(this, function (exports) {

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

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var EventArgs = (function () {
        function EventArgs(sender, name, innerEvent) {
            this.sender = sender;
            this.name = name;
            this.innerEvent = innerEvent;
        }
        return EventArgs;
    }());
    var EventEmitter = (function () {
        function EventEmitter() {
            this.eventListeners = new Map();
            this.wrappedListeners = new Map();
        }
        EventEmitter.prototype.addListener = function (eventName, listener) {
            (this.eventListeners[eventName] = this.eventListeners[eventName] || []).push(listener);
            return this;
        };
        EventEmitter.prototype.registerAndWrapListener = function (eventName, listener) {
            var callback = this.wrapListener(eventName, listener);
            this.wrappedListeners.set(listener, callback);
            return callback;
        };
        EventEmitter.prototype.wrapListener = function (eventName, listener) {
            var _this = this;
            return function (event) {
                var args = new EventArgs(_this, eventName, event);
                _this.preProcessArgs(args);
                var result = listener(args);
                _this.postProcessArgs(args);
                return result;
            };
        };
        EventEmitter.prototype.preProcessArgs = function (args) {
        };
        EventEmitter.prototype.postProcessArgs = function (args) {
            if (args && typeof args.returnValue !== "undefined") {
                args.innerEvent.returnValue = args.returnValue;
            }
        };
        EventEmitter.prototype.unwrapAndUnRegisterListener = function (listener) {
            var callback = this.wrappedListeners.get(listener);
            if (callback) {
                this.wrappedListeners.delete(listener);
            }
            return callback;
        };
        EventEmitter.prototype.removeListener = function (eventName, listener) {
            var listeners = this.listeners(eventName);
            if (listeners) {
                var i = listeners.indexOf(listener);
                if (i >= 0) {
                    listeners.splice(i, 1);
                }
            }
            return this;
        };
        EventEmitter.prototype.listeners = function (eventName) {
            return (this.eventListeners[eventName] || []);
        };
        EventEmitter.prototype.emit = function (eventName, eventArgs) {
            for (var _i = 0, _a = this.listeners(eventName); _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(eventArgs);
            }
        };
        Object.defineProperty(EventEmitter, "ipc", {
            set: function (value) {
                if (value) {
                    // value.subscribe(EventEmitter.staticEventName, function (event, message) {
                    //     EventEmitter.emit(message.eventName, message.eventArgs);
                    // });
                }
            },
            enumerable: true,
            configurable: true
        });
        EventEmitter.addListener = function (eventName, listener) {
            (this.staticEventListeners[eventName] = this.staticEventListeners[eventName] || []).push(listener);
        };
        EventEmitter.removeListener = function (eventName, listener) {
            var listeners = EventEmitter.listeners(eventName);
            if (listeners) {
                var i = listeners.indexOf(listener);
                if (i >= 0) {
                    listeners.splice(i, 1);
                }
            }
        };
        EventEmitter.listeners = function (eventName) {
            return (this.staticEventListeners[eventName] || []);
        };
        EventEmitter.emit = function (eventName, eventArgs, ipc) {
            if (ipc && ipc.publish) {
                ipc.publish(EventEmitter.staticEventName, { eventName: eventName, eventArgs: eventArgs });
            }
            else {
                for (var _i = 0, _a = EventEmitter.listeners(eventName); _i < _a.length; _i++) {
                    var listener = _a[_i];
                    listener(eventArgs);
                }
            }
        };
        EventEmitter.staticEventListeners = new Map();
        EventEmitter.staticEventName = "desktopJS.static-event";
        return EventEmitter;
    }());

    var Guid = (function () {
        function Guid() {
        }
        Guid.newGuid = function () {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        return Guid;
    }());

    var LayoutEventArgs = (function (_super) {
        __extends(LayoutEventArgs, _super);
        function LayoutEventArgs() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return LayoutEventArgs;
    }(EventArgs));
    var Container = (function (_super) {
        __extends(Container, _super);
        function Container() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Container, "ipc", {
            get: function () {
                return Container._ipc;
            },
            set: function (value) {
                EventEmitter.ipc = Container._ipc = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Container.prototype, "ipc", {
            get: function () {
                return Container.ipc;
            },
            set: function (value) {
                Container.ipc = value;
            },
            enumerable: true,
            configurable: true
        });
        Container.prototype.addListener = function (eventName, listener) {
            return _super.prototype.addListener.call(this, eventName, listener);
        };
        Container.prototype.removeListener = function (eventName, listener) {
            return _super.prototype.removeListener.call(this, eventName, listener);
        };
        Container.prototype.emit = function (eventName, eventArgs) {
            _super.prototype.emit.call(this, eventName, eventArgs);
        };
        Container.addListener = function (eventName, listener) {
            EventEmitter.addListener(Container.staticEventScopePrefix + eventName, listener);
        };
        Container.removeListener = function (eventName, listener) {
            EventEmitter.removeListener(Container.staticEventScopePrefix + eventName, listener);
        };
        Container.emit = function (eventName, eventArgs) {
            EventEmitter.emit(Container.staticEventScopePrefix + eventName, eventArgs, Container.ipc);
        };
        Container.listeners = function (eventName) {
            return EventEmitter.listeners(Container.staticEventScopePrefix + eventName);
        };
        Container.staticEventScopePrefix = "container-";
        Container.windowOptionsPropertyKey = "desktopJS-options";
        return Container;
    }(EventEmitter));
    var ContainerBase = (function (_super) {
        __extends(ContainerBase, _super);
        function ContainerBase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.uuid = Guid.newGuid();
            _this.storage = (typeof window !== "undefined" && window)
                ? window.localStorage
                : undefined;
            return _this;
        }
        ContainerBase.prototype.showNotification = function (title, options) {
            throw new TypeError("Notifications not supported by this container");
        };
        ContainerBase.prototype.addTrayIcon = function (details, listener, menuItems) {
            throw new TypeError("Tray icons are not supported by this container.");
        };
        ContainerBase.prototype.getLayoutFromStorage = function (name) {
            return JSON.parse(this.storage.getItem(ContainerBase.layoutsPropertyKey))[name];
        };
        ContainerBase.prototype.saveLayoutToStorage = function (name, layout) {
            var layouts = JSON.parse(this.storage.getItem(ContainerBase.layoutsPropertyKey)) || {};
            if (!layout.name) {
                layout.name = name;
            }
            layouts[name] = layout;
            this.storage.setItem(ContainerBase.layoutsPropertyKey, JSON.stringify(layouts));
            this.emit("layout-saved", { sender: this, name: "layout-saved", layout: layout, layoutName: layout.name });
            Container.emit("layout-saved", { name: "layout-saved", layout: layout, layoutName: layout.name });
        };
        ContainerBase.prototype.loadLayout = function (name) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.closeAllWindows(true).then(function () {
                    var layout = _this.getLayoutFromStorage(name);
                    if (layout && layout.windows) {
                        var promises = [];
                        for (var _i = 0, _a = layout.windows; _i < _a.length; _i++) {
                            var window = _a[_i];
                            var options = Object.assign(window.options || {}, window.bounds);
                            options.name = window.name;
                            if (window.main) {
                                _this.getMainWindow().setBounds(window.bounds);
                                promises.push(Promise.resolve(_this.getMainWindow()));
                            }
                            else {
                                promises.push(_this.createWindow(window.url, options));
                            }
                        }
                        Promise.all(promises).then(function (windows) {
                            var groupMap = new Map();
                            windows.forEach(function (window) {
                                var matchingWindow = layout.windows.find(function (win) { return win.name === window.name; });
                                if (matchingWindow && matchingWindow.state && window.setState) {
                                    window.setState(matchingWindow.state).catch(function (e) { return _this.log("error", "Error invoking setState: " + e); });
                                }
                                var found = false;
                                groupMap.forEach(function (targets, win) {
                                    if (!found && targets.indexOf(window.id) >= 0) {
                                        found = true;
                                    }
                                });
                                if (!found) {
                                    var group = matchingWindow ? matchingWindow.group : undefined;
                                    if (group && group.length > 0) {
                                        groupMap.set(window, group.filter(function (id) { return id !== window.id; }));
                                    }
                                }
                            });
                            groupMap.forEach(function (targets, window) {
                                targets.forEach(function (target) {
                                    _this.getWindowByName(layout.windows.find(function (win) { return win.id === target; }).name).then(function (targetWin) {
                                        targetWin.joinGroup(window);
                                    });
                                });
                            });
                        });
                        _this.emit("layout-loaded", { sender: _this, name: "layout-loaded", layout: layout, layoutName: layout.name });
                        Container.emit("layout-loaded", { name: "layout-loaded", layout: layout, layoutName: layout.name });
                        resolve(layout);
                    }
                    else {
                        reject("Layout does not exist");
                    }
                });
            });
        };
        ContainerBase.prototype.getLayouts = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var rawLayouts = _this.storage.getItem(ContainerBase.layoutsPropertyKey);
                if (rawLayouts) {
                    var layouts_1 = JSON.parse(rawLayouts);
                    resolve(Object.getOwnPropertyNames(layouts_1).map(function (key) { return layouts_1[key]; }));
                }
                resolve(undefined);
            });
        };
        ContainerBase.prototype.log = function (level, message) {
            return new Promise(function (resolve) {
                var logger;
                switch (level) {
                    case "debug": {
                        logger = console.debug;
                        break;
                    }
                    case "warn": {
                        logger = console.warn;
                        break;
                    }
                    case "error": {
                        logger = console.error;
                        break;
                    }
                    default: {
                        logger = console.log;
                    }
                }
                if (logger) {
                    logger(message);
                }
                resolve();
            });
        };
        ContainerBase.layoutsPropertyKey = "desktopJS-layouts";
        return ContainerBase;
    }(Container));
    var WebContainerBase = (function (_super) {
        __extends(WebContainerBase, _super);
        function WebContainerBase(win) {
            var _this = _super.call(this) || this;
            _this.globalWindow = win || (typeof window !== "undefined" && window) || null;
            _this.linkHelper = { href: "unknown" };
            try {
                _this.linkHelper = _this.globalWindow.top.document.createElement("a");
            }
            catch (e) { }
            if (_this.globalWindow) {
                var open_1 = _this.globalWindow.open;
                _this.globalWindow.open = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.onOpen.apply(_this, [open_1].concat(args));
                };
            }
            return _this;
        }
        WebContainerBase.prototype.onOpen = function (open) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return open.apply(this.globalWindow, args);
        };
        WebContainerBase.prototype.ensureAbsoluteUrl = function (url) {
            if (this.linkHelper) {
                this.linkHelper.href = url;
                return this.linkHelper.href;
            }
            else {
                return url;
            }
        };
        return WebContainerBase;
    }(ContainerBase));

    var MessageBusSubscription = (function () {
        function MessageBusSubscription(topic, listener, options) {
            this.topic = topic;
            this.listener = listener;
            this.options = options;
        }
        return MessageBusSubscription;
    }());
    var MessageBusOptions = (function () {
        function MessageBusOptions() {
        }
        return MessageBusOptions;
    }());

    var MenuItem = (function () {
        function MenuItem() {
        }
        return MenuItem;
    }());

    var NotificationOptions = (function () {
        function NotificationOptions() {
        }
        return NotificationOptions;
    }());
    var ContainerNotification = (function () {
        function ContainerNotification(title, options) {
        }
        ContainerNotification.requestPermission = function (callback) {
            if (callback) {
                callback(ContainerNotification.permission);
            }
            return Promise.resolve(ContainerNotification.permission);
        };
        ContainerNotification.permission = "granted";
        return ContainerNotification;
    }());

    var PropertyMap = (function () {
        function PropertyMap() {
        }
        return PropertyMap;
    }());
    (function (ObjectTransform) {
        function transformProperties(object, mappings) {
            var newOptions = {};
            if (object) {
                for (var prop in object) {
                    try {
                        if (prop in mappings) {
                            newOptions[mappings[prop].target] = (mappings[prop].convert)
                                ? mappings[prop].convert(object[prop], object, newOptions)
                                : object[prop];
                        }
                        else {
                            newOptions[prop] = object[prop];
                        }
                    }
                    catch (e) {
                        console.error("Error transforming property '" + prop + "'");
                    }
                }
            }
            return newOptions;
        }
        ObjectTransform.transformProperties = transformProperties;
    })(exports.ObjectTransform || (exports.ObjectTransform = {}));

    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Object.defineProperty(Rectangle.prototype, "right", {
            get: function () {
                return Rectangle.getRight(this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rectangle.prototype, "bottom", {
            get: function () {
                return Rectangle.getBottom(this);
            },
            enumerable: true,
            configurable: true
        });
        Rectangle.getRight = function (r) {
            return r.x + r.width;
        };
        Rectangle.getBottom = function (r) {
            return r.y + r.height;
        };
        return Rectangle;
    }());
    var WindowEventArgs = (function (_super) {
        __extends(WindowEventArgs, _super);
        function WindowEventArgs() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WindowEventArgs;
    }(EventArgs));
    var WindowGroupEventArgs = (function (_super) {
        __extends(WindowGroupEventArgs, _super);
        function WindowGroupEventArgs() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WindowGroupEventArgs;
    }(WindowEventArgs));
    var ContainerWindow = (function (_super) {
        __extends(ContainerWindow, _super);
        function ContainerWindow(wrap) {
            var _this = _super.call(this) || this;
            _this.innerWindow = wrap;
            return _this;
        }
        Object.defineProperty(ContainerWindow.prototype, "allowGrouping", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        ContainerWindow.prototype.getGroup = function () {
            return Promise.resolve([]);
        };
        ContainerWindow.prototype.joinGroup = function (target) {
            return Promise.reject("Not supported");
        };
        ContainerWindow.prototype.leaveGroup = function () {
            return Promise.resolve();
        };
        ContainerWindow.prototype.bringToFront = function () {
            return this.focus();
        };
        ContainerWindow.prototype.getState = function () {
            return Promise.resolve(undefined);
        };
        ContainerWindow.prototype.setState = function (state) {
            return Promise.resolve();
        };
        Object.defineProperty(ContainerWindow.prototype, "nativeWindow", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        ContainerWindow.prototype.addListener = function (eventName, listener) {
            var callback = this.registerAndWrapListener(eventName, listener);
            this.attachListener(eventName, callback);
            return _super.prototype.addListener.call(this, eventName, callback);
        };
        ContainerWindow.prototype.removeListener = function (eventName, listener) {
            var callback = this.unwrapAndUnRegisterListener(listener) || listener;
            this.detachListener(eventName, callback);
            return _super.prototype.removeListener.call(this, eventName, callback);
        };
        ContainerWindow.addListener = function (eventName, listener) {
            EventEmitter.addListener(ContainerWindow.staticEventScopePrefix + eventName, listener);
        };
        ContainerWindow.removeListener = function (eventName, listener) {
            EventEmitter.removeListener(ContainerWindow.staticEventScopePrefix + eventName, listener);
        };
        ContainerWindow.emit = function (eventName, eventArgs) {
            EventEmitter.emit(ContainerWindow.staticEventScopePrefix + eventName, eventArgs, Container.ipc);
        };
        ContainerWindow.listeners = function (eventName) {
            return EventEmitter.listeners(ContainerWindow.staticEventScopePrefix + eventName);
        };
        ContainerWindow.staticEventScopePrefix = "containerwindow-";
        return ContainerWindow;
    }(EventEmitter));
    var PersistedWindow = (function () {
        function PersistedWindow() {
        }
        return PersistedWindow;
    }());
    var PersistedWindowLayout = (function () {
        function PersistedWindowLayout(name) {
            this.windows = [];
            this.name = name;
        }
        return PersistedWindowLayout;
    }());
    (function (WindowStateTracking) {
        WindowStateTracking[WindowStateTracking["None"] = 0] = "None";
        WindowStateTracking[WindowStateTracking["Main"] = 1] = "Main";
        WindowStateTracking[WindowStateTracking["Group"] = 2] = "Group";
    })(exports.WindowStateTracking || (exports.WindowStateTracking = {}));
    function isOpenFin() {
        return (typeof window !== "undefined" && window.fin);
    }
    var GroupWindowManager = (function () {
        function GroupWindowManager(container, options) {
            this.windowStateTracking = exports.WindowStateTracking.None;
            this.container = container;
            if (options) {
                if ("windowStateTracking" in options) {
                    this.windowStateTracking = options.windowStateTracking;
                }
            }
            this.attach();
        }
        GroupWindowManager.prototype.attach = function (win) {
            var _this = this;
            if (win) {
                win.addListener(isOpenFin() ? "minimized" : "minimize", function (e) {
                    if ((_this.windowStateTracking & exports.WindowStateTracking.Main) && _this.container.getMainWindow().id === e.sender.id) {
                        _this.container.getAllWindows().then(function (windows) {
                            windows.forEach(function (window) { return window.minimize(); });
                        });
                    }
                    if (_this.windowStateTracking & exports.WindowStateTracking.Group) {
                        e.sender.getGroup().then(function (windows) {
                            windows.forEach(function (window) { return window.minimize(); });
                        });
                    }
                });
                win.addListener(isOpenFin() ? "restored" : "restore", function (e) {
                    if ((_this.windowStateTracking & exports.WindowStateTracking.Main) && _this.container.getMainWindow().id === e.sender.id) {
                        _this.container.getAllWindows().then(function (windows) {
                            windows.forEach(function (window) { return window.restore(); });
                        });
                    }
                    if (_this.windowStateTracking & exports.WindowStateTracking.Group) {
                        e.sender.getGroup().then(function (windows) {
                            windows.forEach(function (window) { return window.restore(); });
                        });
                    }
                });
            }
            else {
                ContainerWindow.addListener("window-created", function (args) {
                    if (_this.container && _this.container.getWindowById) {
                        _this.container.getWindowById(args.windowId).then(function (window) {
                            _this.attach(window);
                        });
                    }
                });
                if (this.container) {
                    this.container.getAllWindows().then(function (windows) {
                        windows.forEach(function (window) { return _this.attach(window); });
                    });
                }
            }
        };
        return GroupWindowManager;
    }());
    var SnapAssistWindowManager = (function (_super) {
        __extends(SnapAssistWindowManager, _super);
        function SnapAssistWindowManager(container, options) {
            var _this = _super.call(this, container, options) || this;
            _this.autoGrouping = true;
            _this.snapThreshold = 15;
            _this.snapOffset = 15;
            _this.targetGroup = new Map();
            if (options) {
                if ("snapThreshold" in options) {
                    _this.snapThreshold = options.snapThreshold;
                }
                if ("snapOffset" in options) {
                    _this.snapOffset = options.snapOffset;
                }
                if ("autoGrouping" in options) {
                    _this.autoGrouping = options.autoGrouping;
                }
            }
            return _this;
        }
        SnapAssistWindowManager.prototype.onAttached = function (win) {
            var _this = this;
            if (win.innerWindow && win.innerWindow.disableFrame) {
                win.innerWindow.disableFrame();
            }
            if (isOpenFin()) {
                win.addListener("disabled-frame-bounds-changed", function () { return _this.onMoved(win); });
                win.addListener("frame-enabled", function () { return win.innerWindow.disableFrame(); });
            }
            else {
                if (win.innerWindow && win.innerWindow.hookWindowMessage) {
                    win.innerWindow.hookWindowMessage(0x0232, function () { return _this.onMoved(win); });
                }
            }
        };
        SnapAssistWindowManager.prototype.attach = function (win) {
            var _this = this;
            _super.prototype.attach.call(this, win);
            if (win) {
                win.getOptions().then(function (options) {
                    if (options && typeof (options.snap) !== "undefined" && options.snap === false) {
                        return;
                    }
                    _this.onAttached(win);
                    win.addListener(isOpenFin() ? "disabled-frame-bounds-changing" : "move", function (e) { return _this.onMoving(e); });
                });
            }
        };
        SnapAssistWindowManager.prototype.onMoving = function (e) {
            var _this = this;
            var id = e.sender.id;
            if (this.snappingWindow === id) {
                return;
            }
            e.sender.getOptions().then(function (senderOptions) {
                if (senderOptions && typeof (senderOptions.snap) !== "undefined" && senderOptions.snap === false) {
                    return;
                }
                e.sender.getGroup().then(function (groupedWindows) {
                    var getBounds = (isOpenFin())
                        ? Promise.resolve(new Rectangle(e.innerEvent.left, e.innerEvent.top, e.innerEvent.width, e.innerEvent.height))
                        : e.sender.getBounds();
                    getBounds.then(function (bounds) {
                        if (groupedWindows.length > 0) {
                            if (isOpenFin()) {
                                _this.moveWindow(e.sender, bounds);
                            }
                            return;
                        }
                        var promises = [];
                        _this.container.getAllWindows().then(function (windows) {
                            windows.filter(function (window) { return id !== window.id; }).forEach(function (window) {
                                promises.push(new Promise(function (resolve) {
                                    window.getOptions().then(function (targetOptions) {
                                        window.getBounds().then(function (targetBounds) { return resolve({ window: window, bounds: targetBounds, options: targetOptions }); });
                                    });
                                }));
                            });
                            Promise.all(promises).then(function (responses) {
                                var isSnapped = false;
                                var snapHint;
                                for (var _i = 0, _a = responses.filter(function (response) { return !(response.options && typeof (response.options.snap) !== "undefined" && response.options.snap === false); }); _i < _a.length; _i++) {
                                    var target = _a[_i];
                                    snapHint = _this.getSnapBounds(snapHint || bounds, target.bounds);
                                    if (snapHint) {
                                        isSnapped = true;
                                        _this.showGroupingHint(target.window);
                                        _this.moveWindow(e.sender, snapHint);
                                    }
                                    else {
                                        _this.hideGroupingHint(target.window);
                                    }
                                }
                                if (!isSnapped && isOpenFin()) {
                                    _this.moveWindow(e.sender, bounds);
                                }
                            });
                        });
                    });
                });
            });
        };
        SnapAssistWindowManager.prototype.moveWindow = function (win, bounds) {
            var _this = this;
            this.snappingWindow = win.id;
            win.setBounds(bounds).then(function () { return _this.snappingWindow = undefined; }, function () { return _this.snappingWindow = undefined; });
        };
        SnapAssistWindowManager.prototype.onMoved = function (win) {
            var _this = this;
            if (this.autoGrouping) {
                var groupCallbacks_1 = [];
                this.targetGroup.forEach(function (target) { return groupCallbacks_1.push(new Promise(function (resolve) {
                    target.getGroup().then(function (windows) { return resolve({ window: target, isGrouped: windows.length > 0 }); });
                })); });
                Promise.all(groupCallbacks_1).then(function (responses) {
                    if (responses.length > 0) {
                        win.joinGroup(responses[0].window);
                    }
                    for (var i = 1; i < responses.length; i++) {
                        if (!responses[i].isGrouped) {
                            responses[i].window.joinGroup(win);
                        }
                    }
                });
            }
            this.targetGroup.forEach(function (window) { return _this.hideGroupingHint(window); });
            this.targetGroup.clear();
        };
        SnapAssistWindowManager.prototype.showGroupingHint = function (win) {
            if (win.innerWindow && win.innerWindow.updateOptions) {
                win.innerWindow.updateOptions({ opacity: 0.75 });
            }
            this.targetGroup.set(win.id, win);
        };
        SnapAssistWindowManager.prototype.hideGroupingHint = function (win) {
            if (win.innerWindow && win.innerWindow.updateOptions) {
                win.innerWindow.updateOptions({ opacity: 1.0 });
            }
            this.targetGroup.delete(win.id);
        };
        SnapAssistWindowManager.prototype.isHorizontallyAligned = function (r1, r2) {
            return (r1.y >= r2.y && r1.y <= r2.bottom)
                || (r1.bottom >= r2.y && r1.bottom <= r2.bottom)
                || (r1.y <= r2.y && r1.bottom >= r2.bottom);
        };
        SnapAssistWindowManager.prototype.isVerticallyAligned = function (r1, r2) {
            return (r1.x >= r2.x && r1.x <= r2.right)
                || (r1.right >= r2.x && r1.right <= r2.right)
                || (r1.x <= r2.x && r1.right >= r2.right);
        };
        SnapAssistWindowManager.prototype.getSnapBounds = function (r1, r2) {
            var isLeftToRight, isLeftToLeft, isRightToLeft, isRightToRight, isTopToBottom, isTopToTop, isBottomToTop, isBottomToBottom;
            if (this.isHorizontallyAligned(r1, r2)) {
                isLeftToRight = Math.abs(r1.x - (r2.right - this.snapOffset)) < this.snapThreshold;
                isLeftToLeft = Math.abs(r1.x - r2.x) < this.snapThreshold;
                isRightToLeft = Math.abs((r1.right - this.snapOffset) - r2.x) < this.snapThreshold;
                isRightToRight = Math.abs(r1.right - r2.right) < this.snapThreshold;
            }
            if (this.isVerticallyAligned(r1, r2)) {
                isTopToBottom = Math.abs(r1.y - (r2.bottom - this.snapOffset)) < this.snapThreshold;
                isTopToTop = Math.abs(r1.y - r2.y) < this.snapThreshold;
                isBottomToTop = Math.abs((r1.bottom - this.snapOffset) - r2.y) < this.snapThreshold;
                isBottomToBottom = Math.abs(r1.bottom - r2.bottom) < this.snapThreshold;
            }
            if (!isLeftToRight && !isRightToLeft && !isTopToBottom && !isBottomToTop) {
                return undefined;
            }
            var x = r1.x;
            var y = r1.y;
            if (isLeftToRight) {
                x = r2.x + r2.width - this.snapOffset;
            }
            else if (isLeftToLeft) {
                x = r2.x;
            }
            if (isRightToLeft) {
                x = r2.x - r1.width + this.snapOffset;
            }
            else if (isRightToRight) {
                x = (r2.x + r2.width) - r1.width;
            }
            if (isTopToBottom) {
                y = r2.y + r2.height - Math.floor(this.snapOffset / 2);
            }
            else if (isTopToTop) {
                y = r2.y;
            }
            if (isBottomToTop) {
                y = r2.y - r1.height + Math.floor(this.snapOffset / 2);
            }
            else if (isBottomToBottom) {
                y = (r2.y + r2.height) - r1.height;
            }
            return new Rectangle(x, y, r1.width, r1.height);
        };
        return SnapAssistWindowManager;
    }(GroupWindowManager));

    var Point = (function () {
        function Point() {
        }
        return Point;
    }());
    var Display = (function () {
        function Display() {
        }
        return Display;
    }());

    (function (Default) {
        var windowEventMap = {
            close: "unload"
        };
        var DefaultContainerWindow = (function (_super) {
            __extends(DefaultContainerWindow, _super);
            function DefaultContainerWindow(wrap) {
                return _super.call(this, wrap) || this;
            }
            Object.defineProperty(DefaultContainerWindow.prototype, "id", {
                get: function () {
                    return this.innerWindow[DefaultContainer.windowUuidPropertyKey];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DefaultContainerWindow.prototype, "name", {
                get: function () {
                    return this.innerWindow[DefaultContainer.windowNamePropertyKey];
                },
                enumerable: true,
                configurable: true
            });
            DefaultContainerWindow.prototype.load = function (url, options) {
                var _this = this;
                return new Promise(function (resolve) {
                    _this.innerWindow.location.replace(url);
                    resolve();
                });
            };
            DefaultContainerWindow.prototype.focus = function () {
                this.innerWindow.focus();
                return Promise.resolve();
            };
            DefaultContainerWindow.prototype.show = function () {
                return Promise.resolve();
            };
            DefaultContainerWindow.prototype.hide = function () {
                return Promise.resolve();
            };
            DefaultContainerWindow.prototype.close = function () {
                this.innerWindow.close();
                return Promise.resolve();
            };
            DefaultContainerWindow.prototype.minimize = function () {
                var _this = this;
                return new Promise(function (resolve) {
                    _this.innerWindow.minimize();
                    resolve();
                });
            };
            DefaultContainerWindow.prototype.maximize = function () {
                var _this = this;
                return new Promise(function (resolve) {
                    _this.innerWindow.maximize();
                    resolve();
                });
            };
            DefaultContainerWindow.prototype.restore = function () {
                var _this = this;
                return new Promise(function (resolve) {
                    _this.innerWindow.restore();
                    resolve();
                });
            };
            DefaultContainerWindow.prototype.isShowing = function () {
                return Promise.resolve(true);
            };
            DefaultContainerWindow.prototype.getSnapshot = function () {
                return Promise.reject("getSnapshot requires an implementation.");
            };
            DefaultContainerWindow.prototype.flash = function (enable, options) {
                return Promise.reject("Not supported");
            };
            DefaultContainerWindow.prototype.getBounds = function () {
                var _this = this;
                return new Promise(function (resolve) {
                    resolve(new Rectangle(_this.innerWindow.screenX, _this.innerWindow.screenY, _this.innerWindow.outerWidth, _this.innerWindow.outerHeight));
                });
            };
            DefaultContainerWindow.prototype.setBounds = function (bounds) {
                var _this = this;
                return new Promise(function (resolve) {
                    _this.innerWindow.moveTo(bounds.x, bounds.y);
                    _this.innerWindow.resizeTo(bounds.width, bounds.height);
                    resolve();
                });
            };
            DefaultContainerWindow.prototype.getOptions = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    resolve(_this.innerWindow[Container.windowOptionsPropertyKey]);
                });
            };
            DefaultContainerWindow.prototype.getState = function () {
                var _this = this;
                return new Promise(function (resolve) {
                    (_this.nativeWindow && _this.nativeWindow.getState) ? resolve(_this.nativeWindow.getState()) : resolve(undefined);
                });
            };
            DefaultContainerWindow.prototype.setState = function (state) {
                var _this = this;
                return new Promise(function (resolve) {
                    if (_this.nativeWindow && _this.nativeWindow.setState) {
                        _this.nativeWindow.setState(state);
                    }
                    resolve();
                });
            };
            DefaultContainerWindow.prototype.attachListener = function (eventName, listener) {
                this.innerWindow.addEventListener(windowEventMap[eventName] || eventName, listener);
            };
            DefaultContainerWindow.prototype.detachListener = function (eventName, listener) {
                this.innerWindow.removeEventListener(windowEventMap[eventName] || eventName, listener);
            };
            Object.defineProperty(DefaultContainerWindow.prototype, "nativeWindow", {
                get: function () {
                    return this.innerWindow;
                },
                enumerable: true,
                configurable: true
            });
            return DefaultContainerWindow;
        }(ContainerWindow));
        Default.DefaultContainerWindow = DefaultContainerWindow;
        var DefaultMessageBus = (function () {
            function DefaultMessageBus(container) {
                this.container = container;
            }
            DefaultMessageBus.prototype.subscribe = function (topic, listener, options) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var subscription = new MessageBusSubscription(topic, function (event) {
                        if (event.origin !== _this.container.globalWindow.location.origin) {
                            return;
                        }
                        var _a = event.data, source = _a.source, receivedTopic = _a["topic"], message = _a.message;
                        if (source === DefaultMessageBus.messageSource && topic === receivedTopic) {
                            listener({ topic: topic }, message);
                        }
                    });
                    if (_this.container.globalWindow && _this.container.globalWindow.addEventListener) {
                        _this.container.globalWindow.addEventListener("message", subscription.listener);
                    }
                    resolve(subscription);
                });
            };
            DefaultMessageBus.prototype.unsubscribe = function (subscription) {
                return Promise.resolve(this.container.globalWindow.removeEventListener("message", subscription.listener));
            };
            DefaultMessageBus.prototype.publish = function (topic, message, options) {
                var windows = (this.container.globalWindow)
                    ? this.container.globalWindow[DefaultContainer.windowsPropertyKey]
                        || (this.container.globalWindow.opener && this.container.globalWindow.opener[DefaultContainer.windowsPropertyKey])
                    : [];
                if (windows) {
                    for (var key in windows) {
                        var win = windows[key];
                        if (options && options.name && options.name !== win[DefaultContainer.windowNamePropertyKey]) {
                            continue;
                        }
                        if (win.location.origin !== this.container.globalWindow.location.origin) {
                            continue;
                        }
                        win.postMessage({ source: DefaultMessageBus.messageSource, topic: topic, message: message }, this.container.globalWindow.location.origin);
                    }
                }
                return Promise.resolve();
            };
            DefaultMessageBus.messageSource = "desktopJS";
            return DefaultMessageBus;
        }());
        Default.DefaultMessageBus = DefaultMessageBus;
        var DefaultContainer = (function (_super) {
            __extends(DefaultContainer, _super);
            function DefaultContainer(win) {
                var _this = _super.call(this, win) || this;
                _this.windowOptionsMap = DefaultContainer.defaultWindowOptionsMap;
                _this.hostType = "Default";
                _this.ipc = _this.createMessageBus();
                if (_this.globalWindow && !(DefaultContainer.windowsPropertyKey in _this.globalWindow)) {
                    _this.globalWindow[DefaultContainer.windowsPropertyKey] = { root: _this.globalWindow };
                }
                _this.screen = new DefaultDisplayManager(_this.globalWindow);
                return _this;
            }
            DefaultContainer.prototype.createMessageBus = function () {
                return new DefaultMessageBus(this);
            };
            DefaultContainer.prototype.getMainWindow = function () {
                if (!this.mainWindow) {
                    this.mainWindow = new DefaultContainerWindow(this.globalWindow);
                }
                return this.mainWindow;
            };
            DefaultContainer.prototype.getCurrentWindow = function () {
                return this.wrapWindow(this.globalWindow);
            };
            DefaultContainer.prototype.getWindowOptions = function (options) {
                return exports.ObjectTransform.transformProperties(options, this.windowOptionsMap);
            };
            DefaultContainer.prototype.wrapWindow = function (containerWindow) {
                return new DefaultContainerWindow(containerWindow);
            };
            DefaultContainer.prototype.onOpen = function (open) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var window = open.apply(this.globalWindow, args);
                var windows = this.globalWindow[DefaultContainer.windowsPropertyKey];
                var uuid = window[DefaultContainer.windowUuidPropertyKey] = Guid.newGuid();
                windows[uuid] = window;
                window.addEventListener("beforeunload", function () {
                    window.addEventListener("unload", function () {
                        delete windows[uuid];
                    });
                });
                window[DefaultContainer.windowsPropertyKey] = windows;
                Container.emit("window-created", { name: "window-created", windowId: uuid });
                ContainerWindow.emit("window-created", { name: "window-created", windowId: uuid });
                return window;
            };
            DefaultContainer.prototype.createWindow = function (url, options) {
                var features;
                var target = "_blank";
                var newOptions = this.getWindowOptions(options);
                if (newOptions) {
                    for (var prop in newOptions) {
                        features = (features ? features : "") + prop + "=" + newOptions[prop] + ",";
                    }
                    if (newOptions && "target" in newOptions) {
                        target = newOptions.target;
                    }
                }
                var window = this.globalWindow.open(url, target, features);
                window[Container.windowOptionsPropertyKey] = options;
                window[DefaultContainer.windowNamePropertyKey] = newOptions.name;
                var newWindow = this.wrapWindow(window);
                this.emit("window-created", { sender: this, name: "window-created", window: newWindow, windowId: newWindow.id, windowName: newOptions.name });
                return Promise.resolve(newWindow);
            };
            DefaultContainer.prototype.showNotification = function (title, options) {
                var _this = this;
                if (!("Notification" in this.globalWindow)) {
                    console.warn("Notifications not supported");
                    return;
                }
                this.globalWindow.Notification.requestPermission(function (permission) {
                    if (permission === "denied") {
                        console.warn("Notifications not permitted");
                    }
                    else if (permission === "granted") {
                        new _this.globalWindow.Notification(title, options);
                    }
                });
            };
            DefaultContainer.prototype.closeAllWindows = function (excludeSelf) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var windows = _this.globalWindow[DefaultContainer.windowsPropertyKey];
                    for (var key in windows) {
                        var win = windows[key];
                        if (!excludeSelf || _this.globalWindow !== win) {
                            win.close();
                        }
                    }
                    resolve();
                });
            };
            DefaultContainer.prototype.getAllWindows = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var windows = [];
                    var trackedWindows = _this.globalWindow[DefaultContainer.windowsPropertyKey];
                    for (var key in trackedWindows) {
                        windows.push(_this.wrapWindow(trackedWindows[key]));
                    }
                    resolve(windows);
                });
            };
            DefaultContainer.prototype.getWindowById = function (id) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var win = _this.globalWindow[DefaultContainer.windowsPropertyKey][id];
                    resolve(win ? _this.wrapWindow(win) : null);
                });
            };
            DefaultContainer.prototype.getWindowByName = function (name) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    var trackedWindows = _this.globalWindow[DefaultContainer.windowsPropertyKey];
                    for (var key in trackedWindows) {
                        if (trackedWindows[key][DefaultContainer.windowNamePropertyKey] === name) {
                            resolve(_this.wrapWindow(trackedWindows[key]));
                            return;
                        }
                    }
                    resolve(null);
                });
            };
            DefaultContainer.prototype.saveLayout = function (name) {
                var _this = this;
                var layout = new PersistedWindowLayout();
                return new Promise(function (resolve, reject) {
                    var promises = [];
                    _this.getAllWindows().then(function (windows) {
                        windows.forEach(function (window) {
                            promises.push(new Promise(function (innerResolve) { return __awaiter(_this, void 0, void 0, function () {
                                var nativeWin, _a, _b, _c;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            nativeWin = window.nativeWindow;
                                            if (!(this.globalWindow !== nativeWin)) return [3, 2];
                                            _b = (_a = layout.windows).push;
                                            _c = {
                                                name: window.name,
                                                url: nativeWin.location.toString(),
                                                id: window.id,
                                                bounds: { x: nativeWin.screenX, y: nativeWin.screenY, width: nativeWin.outerWidth, height: nativeWin.outerHeight },
                                                options: nativeWin[Container.windowOptionsPropertyKey]
                                            };
                                            return [4, window.getState()];
                                        case 1:
                                            _b.apply(_a, [(_c.state = _d.sent(),
                                                    _c)]);
                                            _d.label = 2;
                                        case 2:
                                            innerResolve();
                                            return [2];
                                    }
                                });
                            }); }));
                        });
                        Promise.all(promises).then(function () {
                            _this.saveLayoutToStorage(name, layout);
                            resolve(layout);
                        }).catch(function (reason) { return reject(reason); });
                    });
                });
            };
            DefaultContainer.windowsPropertyKey = "desktopJS-windows";
            DefaultContainer.windowUuidPropertyKey = "desktopJS-uuid";
            DefaultContainer.windowNamePropertyKey = "desktopJS-name";
            DefaultContainer.defaultWindowOptionsMap = {
                x: { target: "left" },
                y: { target: "top" }
            };
            return DefaultContainer;
        }(WebContainerBase));
        Default.DefaultContainer = DefaultContainer;
        var DefaultDisplayManager = (function () {
            function DefaultDisplayManager(window) {
                this.window = window;
            }
            DefaultDisplayManager.prototype.getPrimaryDisplay = function () {
                var _this = this;
                return new Promise(function (resolve) {
                    var display = new Display();
                    display.scaleFactor = _this.window.devicePixelRatio;
                    display.id = "Current";
                    display.bounds = new Rectangle(_this.window.screen.availLeft, _this.window.screen.availTop, _this.window.screen.width, _this.window.screen.height);
                    display.workArea = new Rectangle(_this.window.screen.availLeft, _this.window.screen.availTop, _this.window.screen.availWidth, _this.window.screen.availHeight);
                    resolve(display);
                });
            };
            DefaultDisplayManager.prototype.getAllDisplays = function () {
                var _this = this;
                return new Promise(function (resolve) {
                    _this.getPrimaryDisplay().then(function (display) { return resolve([display]); });
                });
            };
            DefaultDisplayManager.prototype.getMousePosition = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    resolve({ x: _this.window.event.screenX, y: _this.window.event.screenY });
                });
            };
            return DefaultDisplayManager;
        }());
    })(exports.Default || (exports.Default = {}));

    var ContainerRegistration = (function () {
        function ContainerRegistration() {
        }
        return ContainerRegistration;
    }());
    var registeredContainers = new Map();
    function clearRegistry() {
        registeredContainers.clear();
        exports.container = undefined;
    }
    function registerContainer(id, registration) {
        registeredContainers[id] = registration;
    }
    function resolveContainer(param1, param2) {
        var force = false;
        var options = param2;
        if (typeof param1 === "boolean") {
            force = param1;
        }
        else {
            options = param1;
        }
        if (!force && exports.container) {
            return exports.container;
        }
        for (var entry in registeredContainers) {
            try {
                if (registeredContainers[entry].condition(options)) {
                    return exports.container = registeredContainers[entry].create(options);
                }
            }
            catch (e) {
                console.error("Error resolving container '" + entry + "': " + e.toString());
            }
        }
        return exports.container = new exports.Default.DefaultContainer();
    }

    var TrayIconDetails = (function () {
        function TrayIconDetails() {
        }
        return TrayIconDetails;
    }());

    var GlobalShortcutManager = (function () {
        function GlobalShortcutManager() {
        }
        return GlobalShortcutManager;
    }());

    var version = "3.0.0";

    exports.version = version;
    exports.LayoutEventArgs = LayoutEventArgs;
    exports.Container = Container;
    exports.ContainerBase = ContainerBase;
    exports.WebContainerBase = WebContainerBase;
    exports.EventArgs = EventArgs;
    exports.EventEmitter = EventEmitter;
    exports.Guid = Guid;
    exports.MessageBusSubscription = MessageBusSubscription;
    exports.MessageBusOptions = MessageBusOptions;
    exports.MenuItem = MenuItem;
    exports.NotificationOptions = NotificationOptions;
    exports.ContainerNotification = ContainerNotification;
    exports.PropertyMap = PropertyMap;
    exports.ContainerRegistration = ContainerRegistration;
    exports.clearRegistry = clearRegistry;
    exports.registerContainer = registerContainer;
    exports.resolveContainer = resolveContainer;
    exports.Point = Point;
    exports.Display = Display;
    exports.TrayIconDetails = TrayIconDetails;
    exports.Rectangle = Rectangle;
    exports.WindowEventArgs = WindowEventArgs;
    exports.WindowGroupEventArgs = WindowGroupEventArgs;
    exports.ContainerWindow = ContainerWindow;
    exports.PersistedWindow = PersistedWindow;
    exports.PersistedWindowLayout = PersistedWindowLayout;
    exports.GroupWindowManager = GroupWindowManager;
    exports.SnapAssistWindowManager = SnapAssistWindowManager;
    exports.GlobalShortcutManager = GlobalShortcutManager;

    Object.defineProperty(exports, '__esModule', { value: true });

}));}
//# sourceMappingURL=desktop.js.map
