
import { Component, Input, OnChanges } from '@angular/core';
import { RestList, getOptions, Lookup } from './RestList';


@Component({
    selector: 'ct-table',
    templateUrl: './scripts/app/utils/table-layout.component.html'
})

export class TableLayoutComponent implements OnChanges {

// Inspired by  https://medium.com/@ct7/building-a-reusable-table-layout-for-your-angular-2-project-adf6bba3b498

    @Input() records: Iterable<any>;
    @Input() settings = new TableSettings();
    columnMaps: ColumnSettingBase[];
    rowButtons: rowButtonBase[] = [];
    keys: string[] = [];
    private addButton(b: rowButtonBase) {
        if (!b.click)
            b.click = (r) => { };
        if (!b.visible)
            b.visible = r => true;
        this.rowButtons.push(b);
        return b;

    }
    catchErrors(what: any,r:any) {
        what.catch(e => e.json().then(e => {
            console.log(e);
            let s = new ModelState(r);
            r.__modelState = () => s;
            s.message = e.Message;
            s.modelState = e.ModelState;
            this.showError(s.message, s.modelState);

        }));

    }
    private showError(message: string, state: any) {
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

    _getError(col: ColumnSettingBase, r:any) {
        if (r.__modelState) {
            let m = <ModelState<any>>r.__modelState();
            if (m.modelState) {
                let errors = m.modelState[col.key] ;
                if (errors && errors.length>0)
                    return errors[0];
            }
              
        }
        return undefined;
    }
    _colValueChanged(col: ColumnSettingBase, r: any) {
        if (r.__modelState) {
            let m = <ModelState<any>>r.__modelState();
            m.modelState[col.key] = undefined;
        }
    }
    ngOnChanges(): void {
        if (!this.settings)
            return;
        this.rowButtons = [];
        if (this.settings.editable) {

            this.addButton({
                name: "save", click: r => {
                    let s = new ModelState(r);
                    r.__modelState = ()=>s;
                    if (this.settings.onSavingRow)
                        this.settings.onSavingRow(s);
                    if (s.isValid)
                        this.catchErrors(r.save(),r);
                    else
                        this.showError(s.message, s.modelState);
                }
            });

            this.addButton({
                name: 'Delete', visible: (r) => r.newRow == undefined, click: r => this.catchErrors(r.delete(),r)
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

        if (this.settings.settings.length > 0) { // when settings provided
            this.columnMaps = this.settings.settings;
            this.columnMaps.forEach(s => {
                if (!s.caption)
                    s.caption = makeTitle(s.key);
            });
        } else if (this.records) {
            {
                this.autoGenerateColumnsBasedOnData();

            }
        }
    }
    private autoGenerateColumnsBasedOnData() {
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
    _getRowClass(row: any) {
        if (this.settings.rowClass)
            return this.settings.rowClass(row);
        return "";
    }
    _getColValue(col: ColumnSettingBase, row: any) {
        if (col.getValue)
            return col.getValue(row);
        return row[col.key];
    }
    _getColDataType(col: ColumnSettingBase, row: any) {
        if (col.inputType)
            return col.inputType;
        return "text";
    }
    _getColumnClass(col: ColumnSettingBase, row: any) {
        
        if (col.cssClass)
            if (isFunction(col.cssClass)) {
                let anyFunc: any = col.cssClass;
                return anyFunc(row);
            }
            else return col.cssClass;
        return '';

    }
    _getEditable(col: ColumnSettingBase) {
        if (!this.settings.editable)
            return false;
        if (!col.key)
            return false
        return !col.readonly;


    }
}
function makeTitle(key: string) {
    return key.slice(0, 1).toUpperCase() + key.replace(/_/g, ' ').slice(1);
}
class TableSettingsBase {
    editable = false;
    settings: ColumnSettingBase[] = [];
    buttons: rowButtonBase[] = [];
    getRecords: () => Promise<Iterable<any>>;
    rowClass?: (row: any) => string;
    onSavingRow?: (s: ModelState<any>) => void;
}
export class TableSettings<rowType> extends TableSettingsBase {
    static getRecords(): any {
        throw new Error("Method not implemented.");
    }

    constructor(settings?: TableSettingsInterface<rowType>) {
        super();
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
                this.restList = new RestList<rowType>(settings.restUrl);
            } if (settings.rowCssClass)
                this.rowClass = settings.rowCssClass;
            if (settings.onSavingRow)
                this.onSavingRow = settings.onSavingRow;
            this.getOptions = settings.get;
        }

    }

    get(options: getOptions<rowType>) {
        this.restList.get(options);
    }
    private getOptions: getOptions<rowType>;
    getRecords: () => Promise<Iterable<any>> = () => this.restList.get(this.getOptions).then(() => this.restList);

    restList: RestList<rowType>;
    get items(): rowType[] {
        if (this.restList)
            return this.restList.items;
        return undefined;
    }

    private settingsByKey = {};

    add(...columns: ColumnSetting<rowType>[]);
    add(...columns: string[]);
    add(...columns: any[]) {
        for (let c of columns) {
            let s: ColumnSetting<rowType>;
            let x = c as ColumnSetting<rowType>;
            if (x.key || x.getValue) {
                s = x;
            }
            else {
                s = { key: c };
            }
            if (s.key) {
                let existing: ColumnSetting<rowType> = this.settingsByKey[s.key];
                if (existing) {
                    if (s.caption)
                        existing.caption = s.caption;
                    if (s.cssClass)
                        existing.cssClass = s.cssClass;
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
interface TableSettingsInterface<rowType> {
    editable?: boolean,
    columnSettings?: ColumnSetting<rowType>[],
    columnKeys?: string[],
    restUrl?: string,
    rowCssClass?: (row: rowType) => string;
    rowButtons?: rowButton<rowType>[],
    get?: getOptions<rowType>,
    onSavingRow?: (s: ModelState<rowType>) => void;
}
class ModelState<rowType> {
    row: rowType;
    constructor(private _row: any) {
        this.row = _row;
    }
    
    isValid = true;
    message: string;
    addError(key: string, message: string) {
        this.isValid = false;
        let current = this.modelState[key];
        if (!current) {
            current = this.modelState[key] = [];
        }
        current.push(message);
    }
    required(key: string, message = 'Required') {
        let value = this._row[key];
        if (value == undefined || value == null || value == "" || value == 0)
            this.addError(key, message);
    }
    addErrorMessage(message: string) {
        this.isValid = false;
        this.message = message;
    }
    modelState = {};
}

interface ColumnSettingBase {
    key?: string;
    caption?: string;
    readonly?: boolean;
    getValue?: (row: any) => any;
    cssClass?: (string | ((row: any) => string));
    inputType?: string;
}
interface ColumnSetting<rowType> extends ColumnSettingBase {
    getValue?: (row: rowType) => any;
    cssClass?: (string| ((row: rowType) => string ));
}
interface rowButtonBase {

    name?: string;
    visible?: (r: any) => boolean;
    click?: (r: any) => void;

}
interface rowButton<rowType> extends rowButtonBase {
    visible?: (r: rowType) => boolean;
    click?: (r: rowType) => void;

}
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}