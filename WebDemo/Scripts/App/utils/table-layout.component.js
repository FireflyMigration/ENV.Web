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
const core_1 = require("@angular/core");
const RestList_1 = require("./RestList");
let TableLayoutComponent = class TableLayoutComponent {
    constructor() {
        // Inspired by  https://medium.com/@ct7/building-a-reusable-table-layout-for-your-angular-2-project-adf6bba3b498
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
    catchErrors(what, r) {
        what.catch(e => e.json().then(e => {
            console.log(e);
            let s = new ModelState(r);
            r.__modelState = () => s;
            s.message = e.Message;
            s.modelState = e.ModelState;
            this.showError(s.message, s.modelState);
        }));
    }
    showError(message, state) {
        if (!message)
            message = "";
        if (state) {
            for (let x in state) {
                let m = x + ": ";
                for (var i = 0; i < state[x].length; i++) {
                    m += state[x][i];
                }
                if (m != message)
                    message += "\n" + m;
            }
        }
        alert(message);
    }
    _getError(col, r) {
        if (r.__modelState) {
            let m = r.__modelState();
            if (m.modelState) {
                let errors = m.modelState[col.key];
                if (errors && errors.length > 0)
                    return errors[0];
            }
        }
        return undefined;
    }
    _colValueChanged(col, r) {
        if (r.__modelState) {
            let m = r.__modelState();
            m.modelState[col.key] = undefined;
        }
    }
    ngOnChanges() {
        if (!this.settings)
            return;
        this.rowButtons = [];
        if (this.settings.editable) {
            this.addButton({
                name: "save", click: r => {
                    let s = new ModelState(r);
                    r.__modelState = () => s;
                    if (this.settings.onSavingRow)
                        this.settings.onSavingRow(s);
                    if (s.isValid)
                        this.catchErrors(r.save(), r);
                    else
                        this.showError(s.message, s.modelState);
                }
            });
            this.addButton({
                name: 'Delete', visible: (r) => r.newRow == undefined, click: r => this.catchErrors(r.delete(), r)
            });
        }
        for (let b of this.settings.buttons) {
            this.addButton(b);
        }
        if (!this.records) {
            this.settings.getRecords().then(r => {
                this.records = r;
                if (this.settings.settings.length == 0)
                    this.autoGenerateColumnsBasedOnData();
            });
        }
        if (this.settings.settings.length > 0) {
            this.columnMaps = this.settings.settings;
            this.columnMaps.forEach(s => {
                if (!s.caption)
                    s.caption = makeTitle(s.key);
            });
        }
        else if (this.records) {
            {
                this.autoGenerateColumnsBasedOnData();
            }
        }
    }
    autoGenerateColumnsBasedOnData() {
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
    _getRowClass(row) {
        if (this.settings.rowClass)
            return this.settings.rowClass(row);
        return "";
    }
    _getColValue(col, row) {
        if (col.getValue)
            return col.getValue(row);
        return row[col.key];
    }
    _getColDataType(col, row) {
        if (col.inputType)
            return col.inputType;
        return "text";
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
        this.getRecords = () => this.restList.get(this.getOptions).then(() => this.restList);
        this.settingsByKey = {};
        if (settings) {
            if (settings.columnKeys)
                this.add(...settings.columnKeys);
            if (settings.columnSettings)
                this.add(...settings.columnSettings);
            if (settings.editable)
                this.editable = true;
            if (settings.rowButtons)
                this.buttons = settings.rowButtons;
            if (settings.restUrl) {
                this.restList = new RestList_1.RestList(settings.restUrl);
            }
            if (settings.rowClass)
                this.rowClass = settings.rowClass;
            if (settings.onSavingRow)
                this.onSavingRow = settings.onSavingRow;
            this.getOptions = settings.get;
        }
    }
    static getRecords() {
        throw new Error("Method not implemented.");
    }
    get(options) {
        this.restList.get(options);
    }
    get items() {
        if (this.restList)
            return this.restList.items;
        return undefined;
    }
    add(...columns) {
        for (let c of columns) {
            let s;
            let x = c;
            if (x.key || x.getValue) {
                s = x;
            }
            else {
                s = { key: c };
            }
            if (s.key) {
                let existing = this.settingsByKey[s.key];
                if (existing) {
                    if (s.caption)
                        existing.caption = s.caption;
                    if (s.columnClass)
                        existing.columnClass = s.columnClass;
                    if (s.getValue)
                        existing.getValue = s.getValue;
                    if (s.readonly)
                        existing.readonly = s.readonly;
                }
                else {
                    this.settings.push(s);
                    this.settingsByKey[s.key] = s;
                }
            }
            else
                this.settings.push(s);
        }
    }
}
exports.TableSettings = TableSettings;
class ModelState {
    constructor(_row) {
        this._row = _row;
        this.isValid = true;
        this.modelState = {};
        this.row = _row;
    }
    addError(key, message) {
        this.isValid = false;
        let current = this.modelState[key];
        if (!current) {
            current = this.modelState[key] = [];
        }
        current.push(message);
    }
    required(key, message = 'Required') {
        let value = this._row[key];
        if (value == undefined || value == null || value == "" || value == 0)
            this.addError(key, message);
    }
    addErrorMessage(message) {
        this.isValid = false;
        this.message = message;
    }
}
//# sourceMappingURL=table-layout.component.js.map