var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "../app", "./base-abstract/button", "../misc/annotations"], function (require, exports, app_1, button_1, annotations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TravelModeToggleButton extends button_1.default {
        static build(onChange) {
            const pickedOption = app_1.default.state.travelMode;
            let unpickedOption;
            let pickedText;
            let unpickedText;
            if (pickedOption === app_1.default.TravelMode.BICYCLING) {
                unpickedOption = app_1.default.TravelMode.WALKING;
                pickedText = TravelModeToggleButton._CYCLE_TEXT;
                unpickedText = TravelModeToggleButton._WALK_TEXT;
            }
            else {
                unpickedOption = app_1.default.TravelMode.BICYCLING;
                pickedText = TravelModeToggleButton._WALK_TEXT;
                unpickedText = TravelModeToggleButton._CYCLE_TEXT;
            }
            const outerDiv = document.createElement('div');
            outerDiv.id = TravelModeToggleButton._OUTER_DIV_ID;
            const select = document.createElement('select');
            select.id = TravelModeToggleButton._SELECT_ID;
            select.addEventListener('change', onChange);
            const firstOption = document.createElement('option');
            firstOption.innerHTML = pickedText;
            firstOption.value = pickedOption;
            const secondOption = document.createElement('option');
            secondOption.innerHTML = unpickedText;
            secondOption.value = unpickedOption;
            select.appendChild(firstOption);
            select.appendChild(secondOption);
            outerDiv.appendChild(select);
            return outerDiv;
        }
    }
    TravelModeToggleButton._OUTER_DIV_ID = 'walk-cycle-btn-outer';
    TravelModeToggleButton._SELECT_ID = 'walk-cycle-btn-select';
    TravelModeToggleButton._CYCLE_TEXT = "cycle";
    TravelModeToggleButton._WALK_TEXT = "walk";
    __decorate([
        annotations_1.override,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", HTMLDivElement)
    ], TravelModeToggleButton, "build", null);
    exports.default = TravelModeToggleButton;
});
