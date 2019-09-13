"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var audit_1 = require("./audit");
var Note = (function (_super) {
    __extends(Note, _super);
    function Note() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Note;
}(audit_1.IAudit));
exports.Note = Note;
//# sourceMappingURL=note.js.map