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
        this.settings = new TableSettings();
        this.rowButtons = [];
        this.keys = [];
    }
    ngOnChanges() {
        if (this.settings.editable) {
            this.rowButtons = [];
            let s = new rowButton('Save');
            s.click = r => r.save();
            this.rowButtons.push(s);
            let d = new rowButton('Delete');
            d.visible = (r) => {
                return r.newRow == undefined;
            };
            d.click = r => r.delete();
            this.rowButtons.push(d);
        }
        if (this.settings.settings.length > 0) {
            this.columnMaps = this.settings.settings;
            this.columnMaps.forEach(s => {
                if (!s.caption)
                    s.caption = makeTitle(s.key);
            });
        }
        else {
            {
                for (let r of this.records) {
                    this.columnMaps = [];
                    Object.keys(r).forEach(key => {
                        if (typeof (r[key]) != 'function')
                            this.columnMaps.push({
                                key: key,
                                caption: makeTitle(key)
                            });
                    });
                    break;
                }
            }
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TableLayoutComponent.prototype, "records", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TableLayoutComponent.prototype, "settings", void 0);
TableLayoutComponent = __decorate([
    core_1.Component({
        selector: 'ct-table',
        templateUrl: './scripts/app/utils/table-layout.component.html'
    })
], TableLayoutComponent);
exports.TableLayoutComponent = TableLayoutComponent;
function makeTitle(key) {
    return key.slice(0, 1).toUpperCase() + key.replace(/_/g, ' ').slice(1);
}
class TableSettings {
    constructor(settings) {
        this.settings = [];
        this.editable = false;
        if (settings) {
            if (settings.columnSettings)
                this.add(...settings.columnSettings);
            else if (settings.columnKeys)
                this.add(...settings.columnKeys);
            if (settings.editable)
                this.editable = true;
        }
    }
    add(...columns) {
        for (let c of columns) {
            let x = c;
            if (x.key)
                this.settings.push(x);
            else
                this.settings.push({ key: c });
        }
    }
}
exports.TableSettings = TableSettings;
class rowButton {
    constructor(name) {
        this.name = name;
        this.visible = (r) => true;
        this.click = r => { };
    }
}
//# sourceMappingURL=table-layout.component.js.map