var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "./base-abstract/button", "../misc/annotations"], function (require, exports, button_1, annotations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MenuButton extends button_1.default {
        static build(onClick) {
            const outerDiv = document.createElement('div');
            outerDiv.id = MenuButton._OUTER_DIV_ID;
            const innerDiv = document.createElement('div');
            innerDiv.id = MenuButton._INNER_DIV_ID;
            innerDiv.innerHTML = MenuButton.CLOSED_SYMBOL;
            outerDiv.addEventListener('click', onClick);
            outerDiv.addEventListener('touchend', function (e) {
                e.stopPropagation();
            });
            outerDiv.appendChild(innerDiv);
            return outerDiv;
        }
    }
    MenuButton.CLOSED_SYMBOL = 'ˇ';
    MenuButton.OPEN_SYMBOL = '^';
    MenuButton._OUTER_DIV_ID = 'menu-btn-outer';
    MenuButton._INNER_DIV_ID = 'menu-btn-inner';
    __decorate([
        annotations_1.override,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", HTMLDivElement)
    ], MenuButton, "build", null);
    exports.default = MenuButton;
});
