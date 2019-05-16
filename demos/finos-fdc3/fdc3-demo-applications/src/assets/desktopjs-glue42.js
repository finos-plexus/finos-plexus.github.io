(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@morgan-stanley/desktopjs')) :
    typeof define === 'function' && define.amd ? define(['exports', '@morgan-stanley/desktopjs'], factory) :
    (global = global || self, factory((global.desktopJS = global.desktopJS || {}, global.desktopJS.Glue42 = {}), global.desktopJS));
}(this, function (exports, desktopjs) {

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

    desktopjs.registerContainer("Glue42", {
        condition: function () { return typeof window !== "undefined" && "glue42gd" in window; },
        create: function (options) { return new Glue42Container(null, null, options); }
    });
    var Glue42ContainerWindow = (function (_super) {
        __extends(Glue42ContainerWindow, _super);
        function Glue42ContainerWindow(wrap) {
            return _super.call(this, wrap) || this;
        }
        Object.defineProperty(Glue42ContainerWindow.prototype, "id", {
            get: function () {
                return this.innerWindow.id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Glue42ContainerWindow.prototype, "name", {
            get: function () {
                return this.innerWindow.name;
            },
            enumerable: true,
            configurable: true
        });
        Glue42ContainerWindow.prototype.load = function (url, options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.innerWindow.navigate(url, function () { return resolve(); }, function () { return reject(); });
            });
        };
        Glue42ContainerWindow.prototype.focus = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.innerWindow.focus(function () { return resolve(); }, function () { return reject(); });
            });
        };
        Glue42ContainerWindow.prototype.show = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.innerWindow.setVisible(true, function () { return resolve(); }, function () { return reject(); });
            });
        };
        Glue42ContainerWindow.prototype.hide = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.innerWindow.setVisible(false, function () { return resolve(); }, function () { return reject(); });
            });
        };
        Glue42ContainerWindow.prototype.close = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.innerWindow.close(function () { return resolve(); }, function () { return reject(); });
            });
        };
        Glue42ContainerWindow.prototype.minimize = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.innerWindow.minimize(function () { return resolve(); }, function () { return reject(); });
            });
        };
        Glue42ContainerWindow.prototype.maximize = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.innerWindow.maximize(function () { return resolve(); }, function () { return reject(); });
            });
        };
        Glue42ContainerWindow.prototype.restore = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.innerWindow.restore(function () { return resolve(); }, function () { return reject(); });
            });
        };
        Glue42ContainerWindow.prototype.isShowing = function () {
            return Promise.resolve(this.innerWindow.isVisible);
        };
        Glue42ContainerWindow.prototype.getSnapshot = function () {
            throw new Error("Method not implemented.");
        };
        Glue42ContainerWindow.prototype.getBounds = function () {
            return Promise.resolve(new desktopjs.Rectangle(this.innerWindow.bounds.left, this.innerWindow.bounds.top, this.innerWindow.bounds.width, this.innerWindow.bounds.height));
        };
        Glue42ContainerWindow.prototype.flash = function (enable, options) {
            throw new Error("Method not implemented.");
        };
        Glue42ContainerWindow.prototype.setBounds = function (_a) {
            var _this = this;
            var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
            return new Promise(function (resolve, reject) {
                _this.innerWindow.moveResize({ left: x, top: y, width: width, height: height }, function () { return resolve(); }, function () { return reject(); });
            });
        };
        Object.defineProperty(Glue42ContainerWindow.prototype, "allowGrouping", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Glue42ContainerWindow.prototype.getGroup = function () {
            return Promise.resolve(this.innerWindow.group.windows.map(function (window) { return new Glue42ContainerWindow(window); }));
        };
        Glue42ContainerWindow.prototype.joinGroup = function (target) {
            throw new Error("Method not implemented.");
        };
        Glue42ContainerWindow.prototype.leaveGroup = function () {
            throw new Error("Method not implemented.");
        };
        Glue42ContainerWindow.prototype.bringToFront = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.innerWindow.activate(function () { return resolve(); }, function () { return reject(); });
            });
        };
        Glue42ContainerWindow.prototype.getOptions = function () {
            return Promise.resolve(this.innerWindow.settings);
        };
        Glue42ContainerWindow.prototype.getState = function () {
            return Promise.resolve(this.innerWindow.state);
        };
        Glue42ContainerWindow.prototype.setState = function (state) {
            throw new Error("Method not implemented.");
        };
        Glue42ContainerWindow.prototype.attachListener = function (eventName, listener) {
            throw new Error("Method not implemented.");
        };
        Glue42ContainerWindow.prototype.wrapListener = function (eventName, listener) {
            throw new Error("Method not implemented.");
        };
        Glue42ContainerWindow.prototype.detachListener = function (eventName, listener) {
            throw new Error("Method not implemented.");
        };
        return Glue42ContainerWindow;
    }(desktopjs.ContainerWindow));
    var Glue42MessageBus = (function () {
        function Glue42MessageBus(bus) {
            this.bus = bus;
            this.unsubs = {};
        }
        Glue42MessageBus.prototype.subscribe = function (topic, listener, options) {
            var _this = this;
            var callback = function (data, topic) {
                return listener({ topic: topic }, data);
            };
            var newOptions = {};
            if (options && options.uuid) {
                newOptions["target"] = options.uuid;
            }
            return this.bus.subscribe(topic, callback, newOptions)
                .then(function (unsub) {
                var subscription = new desktopjs.MessageBusSubscription(topic, function (message) {
                    listener({ topic: topic }, message);
                }, options);
                _this.unsubs[JSON.stringify(subscription)] = unsub.unsubscribe;
                return subscription;
            });
        };
        Glue42MessageBus.prototype.unsubscribe = function (subscription) {
            return this.unsubs[JSON.stringify(subscription)]();
        };
        Glue42MessageBus.prototype.publish = function (topic, message, options) {
            var newOptions = {};
            if (options && options.uuid) {
                newOptions["target"] = options.uuid;
            }
            return this.bus.publish(topic, message, newOptions);
        };
        return Glue42MessageBus;
    }());
    var Glue42Container = (function (_super) {
        __extends(Glue42Container, _super);
        function Glue42Container(desktop, win, options) {
            var _this = _super.call(this, win) || this;
            _this.windowOptionsMap = Glue42Container.windowOptionsMap;
            _this.notificationOptionsMap = Glue42Container.notificationOptionsMap;
            _this.desktop = desktop || window.glue;
            _this.hostType = "Glue42";
            _this.ipc = _this.createMessageBus();
            var replaceNotificationApi = Glue42Container.replaceNotificationApi;
            if (options && typeof options.replaceNotificationApi !== "undefined") {
                replaceNotificationApi = options.replaceNotificationApi;
            }
            if (replaceNotificationApi) {
                _this.registerNotificationsApi();
            }
            _this.screen = new Glue42DisplayManager();
            return _this;
        }
        Glue42Container.prototype.createMessageBus = function () {
            return new Glue42MessageBus(this.desktop.agm);
        };
        Glue42Container.prototype.registerNotificationsApi = function () {
            var owningContainer = this;
            this.globalWindow["Notification"] = (function (_super) {
                __extends(Glue42Notification, _super);
                function Glue42Notification(title, options) {
                    var _this = _super.call(this, title, options) || this;
                    owningContainer.showNotification(title, options);
                    return _this;
                }
                return Glue42Notification;
            }(desktopjs.ContainerNotification));
        };
        Glue42Container.prototype.log = function (level, message) {
            throw new Error("Method not implemented.");
        };
        Glue42Container.prototype.getMainWindow = function () {
            throw new Error("Method not implemented.");
        };
        Glue42Container.prototype.getCurrentWindow = function () {
            return this.wrapWindow(this.desktop.windows.my());
        };
        Glue42Container.prototype.getWindowOptions = function (options) {
            var newOptions = desktopjs.ObjectTransform.transformProperties(options, this.windowOptionsMap);
            if ("center" in newOptions) {
                if (newOptions.center === true) {
                    newOptions.startLocation = "CenterScreen";
                }
                delete newOptions.center;
            }
            return newOptions;
        };
        Glue42Container.prototype.wrapWindow = function (containerWindow) {
            return new Glue42ContainerWindow(containerWindow);
        };
        Glue42Container.prototype.createWindow = function (url, options) {
            var newOptions = this.getWindowOptions(options);
            var name;
            if ("name" in newOptions) {
                name = newOptions.name;
            }
            else {
                name = desktopjs.Guid.newGuid();
            }
            return this.desktop.windows.open(name, url, newOptions).then(this.wrapWindow);
        };
        Glue42Container.prototype.showNotification = function (title, options) {
            var newOptions = desktopjs.ObjectTransform.transformProperties(options, this.notificationOptionsMap);
            this.desktop.agm.invoke("T42.GNS.Publish.RaiseNotification", {
                notification: __assign({ title: title, severity: "High" }, newOptions)
            });
        };
        Glue42Container.prototype.addTrayIcon = function (details, listener, menuItems) {
            throw new Error("Method not implemented.");
        };
        Glue42Container.prototype.closeAllWindows = function () {
            throw new Error("Method not implemented.");
        };
        Glue42Container.prototype.getAllWindows = function () {
            throw new Error("Method not implemented.");
        };
        Glue42Container.prototype.getWindowById = function (id) {
            throw new Error("Method not implemented.");
        };
        Glue42Container.prototype.getWindowByName = function (name) {
            throw new Error("Method not implemented.");
        };
        Glue42Container.prototype.saveLayout = function (name) {
            throw new Error("Method not implemented.");
        };
        Glue42Container.replaceNotificationApi = true;
        Glue42Container.windowOptionsMap = {
            alwaysOnTop: { target: "onTop" },
            maximizable: { target: "allowMaximize" },
            minimizable: { target: "allowMinimize" },
            taskbar: { target: "showInTaskbar" },
            x: { target: "left" },
            y: { target: "top" },
            resizable: { target: "hasSizeAreas" }
        };
        Glue42Container.notificationOptionsMap = {
            body: { target: "description" }
        };
        return Glue42Container;
    }(desktopjs.WebContainerBase));
    var Glue42DisplayManager = (function () {
        function Glue42DisplayManager() {
        }
        Glue42DisplayManager.prototype.createDisplay = function (monitorDetails) {
            var display = new desktopjs.Display();
            display.id = monitorDetails.id;
            display.scaleFactor = monitorDetails.scale;
            display.bounds = new desktopjs.Rectangle(monitorDetails.left, monitorDetails.top, monitorDetails.width, monitorDetails.height);
            display.workArea = new desktopjs.Rectangle(monitorDetails.workingAreaLeft, monitorDetails.workingAreaTop, monitorDetails.workingAreaWidth, monitorDetails.workingAreaHeight);
            return display;
        };
        Glue42DisplayManager.prototype.getPrimaryDisplay = function () {
            return Promise.resolve(this.createDisplay(window.glue42gd.monitors.find(function (monitor) { return monitor.isPrimary; })));
        };
        Glue42DisplayManager.prototype.getAllDisplays = function () {
            return Promise.resolve(window.glue42gd.monitors.map(this.createDisplay));
        };
        Glue42DisplayManager.prototype.getMousePosition = function () {
            throw new Error("Method not implemented.");
        };
        return Glue42DisplayManager;
    }());

    exports.Glue42ContainerWindow = Glue42ContainerWindow;
    exports.Glue42MessageBus = Glue42MessageBus;
    exports.Glue42Container = Glue42Container;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=desktopjs-glue42.js.map
