/**
 * Differentiates between single and double clicks on the map, so that only the appropriate
 * event gets fired (wtf Google?).
 */
var ClickHandler = /** @class */ (function () {
    function ClickHandler() {
        this.isLongPress = false;
        this._doubleClickInProgress = false;
        this._gMapClickEvent = null;
    }
    Object.defineProperty(ClickHandler, "SINGLE", {
        // accessed when sending the click events from GoogleMap
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClickHandler, "DOUBLE", {
        get: function () { return 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClickHandler, "LONG_START", {
        get: function () { return 3; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClickHandler, "LONG_END", {
        get: function () { return 4; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ClickHandler.prototype, "isLongPress", {
        get: function () {
            return this._isLongPress;
        },
        set: function (value) {
            this._isLongPress = value;
        },
        enumerable: true,
        configurable: true
    });
    // i'm sure there's a simpler way to do this, but whatever, it works
    ClickHandler.prototype.handle = function (event) {
        var _this = this;
        switch (event.id) {
            case ClickHandler.SINGLE:
                // capture the google map event so that it can be used in the LONG_START case that fires afterwards
                this._gMapClickEvent = event;
                // do not delete! single clicks will perhaps be used later
                /* setTimeout(() => {
                  
                  if (!ClickHandler._doubleClickInProgress) {
                    
                    Route.to(event);
                  }
                }, ClickHandler._singleClickTimeOut); */
                break;
            case ClickHandler.DOUBLE:
                App.onGoogleMapDoubleClick(event);
                this._doubleClickInProgress = true;
                setTimeout(function () {
                    _this._doubleClickInProgress = false;
                }, ClickHandler._doubleClickTimeOut);
                break;
            case ClickHandler.LONG_START:
                this.isLongPress = false;
                setTimeout(function () {
                    _this.isLongPress = true;
                }, ClickHandler._longPressTimeOut);
                break;
            case ClickHandler.LONG_END:
                if (!this.isLongPress || App.mapService.markerDragEventJustStopped)
                    return; // do not re-fetch if the marker drag event just did it
                // set by the google map click event that fires just before this regular DOM event
                App.onGoogleMapLongPress(this._gMapClickEvent);
                break;
            default:
                console.log("error handling click (a Very Bad Thing)!");
                break;
        } // switch
    }; // handle
    ClickHandler._doubleClickTimeOut = 300;
    ClickHandler._singleClickTimeOut = 300;
    ClickHandler._longPressTimeOut = 1500; // find the right value by experiment
    return ClickHandler;
}()); // ClickHandler
