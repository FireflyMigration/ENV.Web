"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// https://medium.com/@ct7/building-a-reusable-table-layout-for-your-angular-2-project-adf6bba3b498
const core_1 = require("@angular/core");
let TableLayoutComponent = class TableLayoutComponent {
    constructor() {
        this.keys = [];
    }
    ngOnChanges() {
        if (this.settings) {
            this.columnMaps = this.settings;
        }
        else {
            {
                // no settings, create column maps with defaults
                if (this.records.length > 0)
                    this.columnMaps = Object.keys(this.records[0])
                        .map(key => {
                        return {
                            key: key,
                            caption: key.slice(0, 1).toUpperCase() +
                                key.replace(/_/g, ' ').slice(1)
                        };
                    });
            }
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], TableLayoutComponent.prototype, "records", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TableLayoutComponent.prototype, "caption", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], TableLayoutComponent.prototype, "settings", void 0);
TableLayoutComponent = __decorate([
    core_1.Component({
        selector: 'ct-table',
        templateUrl: './scripts/app/utils/table-layout.component.html'
    })
], TableLayoutComponent);
exports.TableLayoutComponent = TableLayoutComponent;
class ColumnSetting {
}
exports.ColumnSetting = ColumnSetting;
//# sourceMappingURL=table-layout.component.js.map