define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ClickType;
    (function (ClickType) {
        ClickType[ClickType["SINGLE"] = 0] = "SINGLE";
        ClickType[ClickType["DOUBLE"] = 1] = "DOUBLE";
        ClickType[ClickType["LONG_START"] = 2] = "LONG_START";
        ClickType[ClickType["LONG_END"] = 3] = "LONG_END";
    })(ClickType || (ClickType = {}));
    class ClickHandler {
        constructor() {
            this._isLongPress = false;
            this._doubleClickInProgress = false;
        }
        static get ClickType() {
            return ClickType;
        }
        get isLongPress() {
            return this._isLongPress;
        }
        set isLongPress(value) {
            this._isLongPress = value;
        }
        handle(event) {
            switch (event.id) {
                case ClickHandler.ClickType.SINGLE:
                    this._gMapClickEvent = event;
                    break;
                case ClickHandler.ClickType.DOUBLE:
                    app_1.default.onGoogleMapDoubleClick(event);
                    this._doubleClickInProgress = true;
                    setTimeout(() => {
                        this._doubleClickInProgress = false;
                    }, ClickHandler._DOUBLE_CLICK_TIMEOUT);
                    break;
                case ClickHandler.ClickType.LONG_START:
                    this._isLongPress = false;
                    setTimeout(() => {
                        this._isLongPress = true;
                    }, ClickHandler._LONG_PRESS_TIMEOUT);
                    break;
                case ClickHandler.ClickType.LONG_END:
                    if (!this._isLongPress || app_1.default.mapService.markerDragEventJustStopped)
                        return;
                    app_1.default.onGoogleMapLongPress(this._gMapClickEvent);
                    break;
                default:
                    console.log("error handling click (a Very Bad Thing)!");
                    break;
            }
        }
    }
    ClickHandler._DOUBLE_CLICK_TIMEOUT = 300;
    ClickHandler._SINGLE_CLICK_TIMEOUT = 300;
    ClickHandler._LONG_PRESS_TIMEOUT = 1500;
    exports.default = ClickHandler;
});
