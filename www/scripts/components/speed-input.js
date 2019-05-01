var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../app", "../misc/utils", "../components/components", "./base-abstract/ui-element", "../misc/annotations"], function (require, exports, app_1, utils_1, components_1, ui_element_1, annotations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SpeedInput extends ui_element_1.default {
        static build(onValueChange) {
            const input = document.createElement('input');
            input.type = "number";
            input.id = SpeedInput._INPUT_ID;
            input.step = "1";
            input.max = app_1.default.MAX_SPEED + "";
            input.value = app_1.default.speed + "";
            input.addEventListener('input', onValueChange);
            return input;
        }
        static onValueChange(event) {
            const value = event.target.value;
            if (value > app_1.default.MAX_SPEED) {
                event.target.value = app_1.default.MAX_SPEED;
            }
            else if (value < 0) {
                event.target.value = 0;
            }
            if (utils_1.default.isValidSpeed(event.target.value)) {
                app_1.default.speed = event.target.value;
            }
            else {
                app_1.default.speed = 0;
            }
            if (!app_1.default.hasVisualTrip)
                return;
            const newDura = utils_1.default.calcDuration(app_1.default.mapService.visualTrip.distance, app_1.default.speed);
            components_1.InfoHeader.updateDuration(newDura);
        }
    }
    SpeedInput._INPUT_ID = 'speed-input';
    __decorate([
        annotations_1.override
    ], SpeedInput, "build", null);
    exports.default = SpeedInput;
});
