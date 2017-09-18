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
    addButton(b) {
        if (!b.click)
            b.click = (r) => { };
        if (!b.visible)
            b.visible = r => true;
        this.rowButtons.push(b);
        return b;
    }
    ngOnChanges() {
        this.rowButtons = [];
        if (this.settings.editable) {
            this.addButton({ name: "save", click: r => r.save() });
            this.addButton({
                name: 'Delete', visible: (r) => r.newRow == undefined, click: r => r.delete()
            });
        }
        for (let b of this.settings.buttons) {
            this.addButton(b);
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
    _getRowClass(row) {
        return "";
    }
    _getColValue(col, row) {
        if (col.getValue)
            return col.getValue(row);
        return row[col.key];
    }
    _getColumnClass(col, row) {
        if (col.columnClass)
            return col.columnClass(row);
        return '';
    }
    _getEditable(col) {
        if (!this.settings.editable)
            return false;
        if (!col.key)
            return false;
        return !col.readonly;
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
class TableSettingsBase {
    constructor() {
        this.editable = false;
        this.settings = [];
        this.buttons = [];
    }
}
class TableSettings extends TableSettingsBase {
    constructor(settings) {
        super();
        if (settings) {
            if (settings.columnSettings)
                this.add(...settings.columnSettings);
            else if (settings.columnKeys)
                this.add(...settings.columnKeys);
            if (settings.editable)
                this.editable = true;
            if (settings.rowButtons)
                this.buttons = settings.rowButtons;
        }
    }
    add(...columns) {
        for (let c of columns) {
            let x = c;
            if (x.key || x.getValue)
                this.settings.push(x);
            else
                this.settings.push({ key: c });
        }
    }
}
exports.TableSettings = TableSettings;
//# sourceMappingURL=table-layout.component.js.map