﻿
import { Component, Input, OnChanges, Type } from '@angular/core';
import { Routes } from '@angular/router';



export class ColumnCollection<rowType> {
    constructor(public currentRow: () => any, private allowUpdate: () => boolean) { }
    private settingsByKey = {};
    _optionalKeys() {
        if (!this.currentRow())
            return [];
        return Object.keys(this.currentRow());
    }
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
                s = { key: c, caption: makeTitle(c) };
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
                    if (s.inputType)
                        existing.inputType = s.inputType;
                    if (s.click)
                        existing.click = s.click;

                }
                else {
                    this.items.push(s);
                    this.settingsByKey[s.key] = s;
                }

            }
            else
                this.items.push(s);


        }
    }
    designMode: false;
    colListChanged() {
        this._lastNumOfColumnsInGrid = -1;
        this._colListChangeListeners.forEach(x => x());
    };
    _colListChangeListeners: (() => void)[] = [];
    onColListChange(action: (() => void)) {
        this._colListChangeListeners.push(action);
    }
    moveCol(col: ColumnSetting<any>, move: number) {
        let currentIndex = this.items.indexOf(col);
        let newIndex = currentIndex + move;
        if (newIndex < 0 || newIndex >= this.items.length)
            return;
        this.items.splice(currentIndex, 1);
        this.items.splice(newIndex, 0, col);
        this.colListChanged();
    }
    deleteCol(col: ColumnSetting<any>) {
        this.items.splice(this.items.indexOf(col), 1);
        this.colListChanged();
    }
    addCol(col: ColumnSetting<any>) {
        this.items.splice(this.items.indexOf(col) + 1, 0, { designMode: true });
        this.colListChanged();
    }
    designColumn(col: ColumnSetting<any>) {
        col.designMode = !col.designMode;
    }

    _getEditable(col: ColumnSetting<any>) {
        if (!this.allowUpdate())
            return false;
        if (!col.key)
            return false
        return !col.readonly;
    }
    _getColValue(col: ColumnSetting<any>, row: any) {
        if (col.getValue)
            return col.getValue(row);
        return row[col.key];
    }
    _getColDataType(col: ColumnSetting<any>, row: any) {
        if (col.inputType)
            return col.inputType;
        return "text";
    }
    _getColumnClass(col: ColumnSetting<any>, row: any) {

        if (col.cssClass)
            if (isFunction(col.cssClass)) {
                let anyFunc: any = col.cssClass;
                return anyFunc(row);
            }
            else return col.cssClass;
        return '';

    }
    _getError(col: ColumnSetting<any>, r: any) {
        if (r.__modelState) {
            let m = <ModelState<any>>r.__modelState();
            if (m.modelState) {
                let errors = m.modelState[col.key];
                if (errors && errors.length > 0)
                    return errors[0];
            }

        }
        return undefined;
    }
    autoGenerateColumnsBasedOnData() {
        if (this.items.length == 0) {
            let r = this.currentRow();
            if (r) {
                Object.keys(r).forEach(key => {
                    if (typeof (r[key]) != 'function')

                        this.items.push({
                            key: key,
                            caption: makeTitle(key)
                        });
                });

            }
        }



    }
    columnSettingsTypeScript() {
        let result = `columnSettings:[`;
        for (var i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            result += `
    { key:"${item.key}"`

            let addString = (k: string, v: string) => {
                if (v) {
                    result += `, ${k}:"${v.replace('"', '""')}"`;
                }
            }
            let addBoolean = (k: string, v: boolean) => {
                if (v) {
                    result += `, ${k}:${v}`;
                }
            }
            if (item.caption != makeTitle(item.key))
                addString('caption', item.caption);
            addString('inputType', item.inputType);
            addBoolean('readonly', item.readonly);


            result += ` },`
        }
        result += `
]`;
        return result;
    }
    _colValueChanged(col: ColumnSetting<any>, r: any) {
        if (r.__modelState) {
            let m = <ModelState<any>>r.__modelState();
            m.modelState[col.key] = undefined;
        }
    }
    items: ColumnSetting<any>[] = [];
    private gridColumns: ColumnSetting<any>[];
    private nonGridColumns: ColumnSetting<any>[];
    numOfColumnsInGrid = 0;

    private _lastColumnCount;
    private _lastNumOfColumnsInGrid;
    private _initColumnsArrays() {
        if (this._lastColumnCount != this.items.length || this._lastNumOfColumnsInGrid != this.numOfColumnsInGrid) {
            this._lastNumOfColumnsInGrid = this.numOfColumnsInGrid;
            this._lastColumnCount = this.items.length;
            this.gridColumns = [];
            this.nonGridColumns = [];
            let i = 0;
            for (let c of this.items) {
                if (i++ < this._lastNumOfColumnsInGrid)
                    this.gridColumns.push(c);
                else
                    this.nonGridColumns.push(c);
            }
        }
    }
    getGridColumns() {
        this._initColumnsArrays();
        return this.gridColumns;
    }
    getNonGridColumns() {
        this._initColumnsArrays();
        return this.nonGridColumns;
    }
}


interface dataAreaSettings {
    columns: ColumnCollection<any>;
}


@Component({
    selector: 'data-area',
    template: `

<div class="form-horizontal" *ngIf="settings.columns&&settings.columns.currentRow()" >
    <div class="row">
        <div class="col-sm-{{12/columns}}"*ngFor="let col of theColumns()">
            <div class="form-group {{settings.columns._getColumnClass(map,settings.columns.currentRow())}}" *ngFor="let map of col" >
                <div class="col-sm-{{labelWidth}}">
                    <label for="inputEmail3" class="control-label" *ngIf="!map.designMode">{{map.caption}}</label>
                    <column-designer [settings]="settings.columns" [map]="map"></column-designer>
                </div>
                <div class="col-sm-{{12-labelWidth}}">
                    <data-control [settings]="settings.columns" [map]="map" [record]="settings.columns.currentRow()"></data-control>
                </div>
            </div>
        </div>
    </div>
</div>


`
})
export class DataAreaCompnent implements OnChanges {

    ngOnChanges(): void {
        if (this.settings && this.settings.columns) {
            this.settings.columns.onColListChange(() => this.lastCols = undefined);
            let areaSettings = this.settings as DataAreaSettings<any>;
            if (areaSettings.settings)
            {
                if (areaSettings.settings.labelWidth)
                    this.labelWidth = areaSettings.settings.labelWidth;
                if (areaSettings.settings.numberOfColumnAreas)
                    this.columns = areaSettings.settings.numberOfColumnAreas;
            }
        }
        
    }


    lastCols: Array<ColumnSetting<any>[]>;

    theColumns(): Array<ColumnSetting<any>[]> {

        if (!this.lastCols) {

            let cols = this.settings.columns.getNonGridColumns();

            let r: Array<ColumnSetting<any>[]> = [];
            this.lastCols = r;
            for (var i = 0; i < this.columns; i++) {
                r.push([]);
            }
            let itemsPerCol = Math.round(cols.length / this.columns);
            for (var i = 0; i < cols.length; i++) {
                r[Math.floor(i / itemsPerCol)].push(cols[i]);
            }
        }
        return this.lastCols;
    }
    @Input() settings: dataAreaSettings = { columns: new ColumnCollection(() => undefined, () => false) };
    @Input() labelWidth = 4;
    @Input() columns = 1;
}




@Component({
    selector: 'data-control',
    template: `
<span *ngIf="!settings._getEditable(map)" >{{settings._getColValue(map,record)}}</span>
<div *ngIf="settings._getEditable(map)" class="form-group " [class.has-error]="settings._getError(map,record)">
    <div >
        <div [class.input-group]="showDescription()||map.click">
            <div class="input-group-btn" *ngIf="map.click">
                <button type="button" class="btn btn-default" (click)="map.click(record)" > <span class="glyphicon glyphicon-chevron-down"></span></button>
            </div>
            <input class="form-control"  [(ngModel)]="record[map.key]" type="{{settings._getColDataType(map)}}" (ngModelChange)="settings._colValueChanged(map,record)" />
            <div class="input-group-addon" *ngIf="showDescription()">{{map.getValue(record)}}</div>
            </div>
        </div>
    <span class="help-block" *ngIf="settings._getError(map,record)">{{settings._getError(map,record)}}</span>
</div>`
})
export class DataControlComponent {
    @Input() map: ColumnSetting<any>;
    @Input() record: any;

    showDescription() {
        return this.map.key && this.map.getValue;
    }

    ngOnChanges(): void {

    }
    @Input() settings: ColumnSetting<any>;
}


@Component({
    selector: 'column-designer',
    template: `
<div *ngIf="map.designMode">
    <div class="form-group">
        <input type="text" class="form-control" [(ngModel)]="map.caption">
    </div>
    <label>Key</label>
    <div class="form-group">
        <select class="form-control" [(ngModel)]="map.key">
            <option value="" selected></option>
            <option  selected *ngFor="let k of settings._optionalKeys()">{{k}}</option>
        </select>
    </div>
    <label>Input Type</label>
    <div class="form-group">
        <select class="form-control" [(ngModel)]="map.inputType" placeholder="inputType">
            <option value="" selected>text</option>
            <option value="number">number</option>
            <option value="date">date</option>
            <option value="checkbox">checkbox</option>
        </select>
    </div>
                    
                   
    <div class="form-group">
        <button class="glyphicon glyphicon-chevron-right  pull-right" (click)="settings.moveCol(map,1)"></button>
        <button class="glyphicon glyphicon-chevron-left pull-right" (click)="settings.moveCol(map,-1)"></button>
        <button class="glyphicon glyphicon-trash pull-right" (click)="settings.deleteCol(map)"></button>
        <button class="glyphicon glyphicon-plus pull-right" (click)="settings.addCol(map)"></button>
    </div>
</div>
<span class="pull-right glyphicon glyphicon-pencil" (click)="settings.designColumn(map)"></span>
`
})
class ColumnDesigner {
    @Input() map: ColumnSetting<any>;
    @Input() settings: ColumnCollection<any>;
}


@Component({
    selector: 'data-grid',
    templateUrl: './scripts/app/lib/data-grid.component.html'
})


export class DataGridComponent implements OnChanges {

    // Inspired by  https://medium.com/@ct7/building-a-reusable-table-layout-for-your-angular-2-project-adf6bba3b498

    @Input() records: Iterable<any>;
    @Input() settings = new DataSettings();

    rowButtons: rowButtonBase[] = [];
    keys: string[] = [];
    private addButton(b: rowButtonBase) {
        if (!b.click)
            b.click = (r) => { };
        if (!b.visible)
            b.visible = r => true;
        if (!b.cssClass)
            b.cssClass = r => "btn";
        else if (!isFunction(b.cssClass)) {
            let x = b.cssClass;
            b.cssClass = <any>(r => x);
        }

        this.rowButtons.push(b);
        return b;

    }
    rowClicked(row) {
        this.settings.currentRow = row;
    }

    page = 1;
    nextPage() {
        this.page++;
    }
    previousPage() {
        if (this.page <= 1)
            return;
        this.page--;
    }

    catchErrors(what: any, r: any) {
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



    ngOnChanges(): void {
        if (!this.settings)
            return;
        this.rowButtons = [];
        if (this.settings.allowUpdate) {
            this.addButton({
                name: "",
                cssClass: "glyphicon glyphicon-ok btn-success",
                visible: r => r.__wasChanged(),
                click: r => {
                    let s = new ModelState(r);
                    r.__modelState = () => s;
                    if (this.settings.onSavingRow)
                        this.settings.onSavingRow(s);
                    if (s.isValid)
                        this.catchErrors(r.save(), r);
                    else
                        this.showError(s.message, s.modelState);
                },

            });
            this.addButton({
                name: "",
                cssClass: "btn btn-danger glyphicon glyphicon-ban-circle",
                visible: r => r.__wasChanged(),
                click: r => {
                    r.reset();
                }
            });


        }
        if (this.settings.allowDelete)
            this.addButton({
                name: '',
                visible: (r) => r.newRow == undefined,
                click: r => this.catchErrors(r.delete(), r),
                cssClass: "btn-danger glyphicon glyphicon-trash"
            });
        for (let b of this.settings.buttons) {
            this.addButton(b);
        }
        if (!this.records) {
            this.settings.getRecords().then(r => {
                this.records = r;

            });

        }


    }

    _getRowClass(row: any) {
        if (row == this.settings.currentRow)
            return "active";
        if (this.settings.rowClass)
            return this.settings.rowClass(row);
        return "";
    }


}
function makeTitle(key: string) {
    return key.slice(0, 1).toUpperCase() + key.replace(/_/g, ' ').slice(1);
}


interface IDataAreaSettings<rowType>
{
    columnSettings?: ColumnSetting<rowType>[];
    numberOfColumnAreas?: number;
    labelWidth?: number;
}

class DataAreaSettings<rowType>
{

    constructor(public columns: ColumnCollection<rowType>, public settings: IDataAreaSettings<rowType>)
    {
        if (settings.columnSettings)
            columns.add(...settings.columnSettings);

    }
}

export class DataSettings<rowType>  {
    static getRecords(): any {
        throw new Error("Method not implemented.");
    }

    addArea(settings: IDataAreaSettings<rowType>) {
        let col = new ColumnCollection<rowType>(() => this.currentRow, () => this.allowUpdate);
        
        return new DataAreaSettings<rowType>( col,settings);
    }
    currentRow: rowType;
    private setCurrentRow(row: rowType) {
        this.currentRow = row;
        this.currentRowChanged(row);
    }
    allowUpdate = false;
    allowInsert = false;
    allowDelete = false;
    hideDataArea = false;


    buttons: rowButtonBase[] = [];

    rowClass?: (row: any) => string;
    onSavingRow?: (s: ModelState<any>) => void;

    currentRowChanged: (r: any) => void;

    constructor(settings?: IDataSettings<rowType>) {

        if (settings) {
            if (settings.columnKeys)
                this.columns.add(...settings.columnKeys);
            if (settings.columnSettings)
                this.columns.add(...settings.columnSettings);

            if (settings.allowUpdate)
                this.allowUpdate = true;
            if (settings.allowDelete)
                this.allowDelete = true;
            if (settings.allowInsert)
                this.allowInsert = true;
            if (settings.hideDataArea)
                this.hideDataArea = settings.hideDataArea;
            if (settings.numOfColumnsInGrid)
                this.columns.numOfColumnsInGrid;
            else this.columns.numOfColumnsInGrid = 5;
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
    columns = new ColumnCollection<rowType>(() => this.currentRow, () => this.allowUpdate);




    page = 1;
    nextPage() {
        this.page++;
        this.getRecords();
    }
    previousPage() {
        if (this.page <= 1)
            return;
        this.page--;
        this.getRecords();
    }
    get(options: getOptions<rowType>) {
        this.getOptions = options;
        this.page = 1;
        this.getRecords();
    }
    sort(key: string) {
        if (!this.getOptions)
            this.getOptions = {};
        if (this.getOptions.orderBy == key && this.getOptions.orderByDir == undefined) {
            this.getOptions.orderByDir = 'd';
        }
        else {
            this.getOptions.orderBy = key;
            this.getOptions.orderByDir = undefined;
        }
        this.getRecords();
    }
    sortedAscending(key: string) {
        if (!this.getOptions)
            return false;
        return this.getOptions.orderBy == key && !this.getOptions.orderByDir;
    }
    sortedDescending(key: string) {
        if (!this.getOptions)
            return false;
        return this.getOptions.orderBy == key && this.getOptions.orderByDir && this.getOptions.orderByDir.toLowerCase().startsWith('d');
    }


    private getOptions: getOptions<rowType>;
    getRecords() {

        let opt: getOptions<rowType> = {};
        if (this.getOptions)
            opt = JSON.parse(JSON.stringify(this.getOptions));
        if (!opt.limit)
            opt.limit = 7;
        if (this.page > 1)
            opt.page = this.page;
        return this.restList.get(opt).then(() => {


            if (this.restList.items.length == 0)
                this.currentRow = undefined;
            else {


                this.currentRow = this.restList.items[0];
                this.columns.autoGenerateColumnsBasedOnData();
            }
            return this.restList;
        });
    };



    restList: RestList<rowType>;
    get items(): rowType[] {
        if (this.restList)
            return this.restList.items;
        return undefined;
    }





}
interface IDataSettings<rowType> {
    allowUpdate?: boolean,
    allowInsert?: boolean,
    allowDelete?: boolean,
    hideDataArea?: boolean,
    columnSettings?: ColumnSetting<rowType>[],
    areas?: { [areaKey: string]: ColumnSetting<any>[] },
    columnKeys?: string[],
    restUrl?: string,
    rowCssClass?: (row: rowType) => string;
    rowButtons?: rowButton<rowType>[],
    get?: getOptions<rowType>,
    onSavingRow?: (s: ModelState<rowType>) => void;
    numOfColumnsInGrid?: number;
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

interface ColumnSetting<rowType> {
    key?: string;
    caption?: string;
    readonly?: boolean;
    inputType?: string;
    designMode?: boolean;
    getValue?: (row: rowType) => any;
    cssClass?: (string | ((row: rowType) => string));
    click?: (row: rowType) => void;
}
interface rowButtonBase {

    name?: string;
    visible?: (r: any) => boolean;
    click?: (r: any) => void;
    cssClass?: (string | ((row: any) => string));

}
interface rowButton<rowType> extends rowButtonBase {
    visible?: (r: rowType) => boolean;
    click?: (r: rowType) => void;
    cssClass?: (string | ((row: rowType) => string));

}
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}


export class RestList<T extends hasId> implements Iterable<T>{
    [Symbol.iterator](): Iterator<T> {
        return this.items[Symbol.iterator]();
    }


    items: (restListItem & T)[] = [];
    constructor(private url: string) {

    }
    private map(item: T): restListItem & T {

        let x = <any>item;
        let id = x.id;
        let orig = JSON.stringify(item);
        x.__wasChanged = () => orig != JSON.stringify(item) || (<any>item).newRow;
        x.reset = () => {
            if ((<any>item).newRow)
                this.items.splice(this.items.indexOf(x), 1);
            else
                this.items[this.items.indexOf(<any>item)] = this.map(JSON.parse(orig));
        }

        x.save = () => this.save(id, x);
        x.delete = () => {
            return fetch(this.url + '/' + id, { method: 'delete' }).then(onSuccess, onError).then(() => {
                this.items.splice(this.items.indexOf(x), 1);
            });

        }
        return <restListItem & T>x;
    }

    get(options?: getOptions<T>) {

        let url = new urlBuilder(this.url);
        if (options) {
            url.addObject({
                _limit: options.limit,
                _page: options.page,
                _sort: options.orderBy,
                _order: options.orderByDir
            });
            url.addObject(options.isEqualTo);
            url.addObject(options.isGreaterOrEqualTo, "_gte");
            url.addObject(options.isLessOrEqualTo, "_lte");
            url.addObject(options.isGreaterThan, "_gt");
            url.addObject(options.isLessThan, "_lt");
            url.addObject(options.isDifferentFrom, "_ne");
        }


        return myFetch(url.url).then(r => {
            let x: T[] = r;
            this.items = r.map(x => this.map(x));
        });
    }
    add(): T {
        let x: newItemInList = { newRow: true };
        this.items.push(this.map(x as any as T));
        return x as any as T;
    }
    private save(id: any, c: restListItem & T) {

        let nr: newItemInList = c as any as newItemInList;
        if (nr.newRow)
            return myFetch(this.url, {
                method: 'post',
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify(c)
            }).then(response => {

                this.items[this.items.indexOf(c)] = this.map(response);
            });
        else {

            return myFetch(this.url + '/' + id, {
                method: 'put',
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify(c)
            }).then(response => {

                this.items[this.items.indexOf(c)] = this.map(response);
            });
        }
    }

}
class urlBuilder {
    constructor(public url: string) {
    }
    add(key: string, value: any) {
        if (value == undefined)
            return;
        if (this.url.indexOf('?') >= 0)
            this.url += '&';
        else
            this.url += '?';
        this.url += encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
    addObject(object: any, suffix = '') {
        if (object != undefined)
            for (var key in object) {
                this.add(key + suffix, object[key]);
            }
    }
}
function myFetch(url: string, init?: RequestInit): Promise<any> {

    return fetch(url, init).then(onSuccess, error => {

    });

}
function onSuccess(response: Response) {

    if (response.status >= 200 && response.status < 300)
        return response.json();
    else throw response;

}
function onError(error: any) {
    throw error;
}
interface newItemInList {
    newRow: boolean;
}
interface hasId {
    id?: any;
}
interface restListItem {
    save: () => void;
    delete: () => void;
    _wasChanged: () => boolean;
    reset: () => void;
}
export interface getOptions<T> {
    isEqualTo?: T;
    isGreaterOrEqualTo?: T;
    isLessOrEqualTo?: T;
    orderBy?: string;
    orderByDir?: string;
    page?: number;
    limit?: number;
    isGreaterThan?: T;
    isLessThan?: T;
    isDifferentFrom?: T;

}

export class Lookup<lookupType, idType_or_MainTableType> {

    constructor(url: string, private options?: (mt: idType_or_MainTableType, o: getOptions<lookupType>) => void) {
        if (!options) {
            this.options = (mt, o) => o.isEqualTo = <lookupType><any>{ id: mt };
        }
        this.categories = new RestList<lookupType>(url);
    }

    categories: RestList<lookupType>;
    private cache: {};

    get(r: any): lookupType {
        return this.getInternal(r).value;
    }
    found(r: any): boolean {
        return this.getInternal(r).found;
    }

    private getInternal(r: any): lookupRowInfo<lookupType> {

        let find: getOptions<lookupType> = {};
        this.options(<idType_or_MainTableType>r, find);
        let key = JSON.stringify(find);
        if (this.cache == undefined)
            this.cache = {};
        if (this.cache[key]) {
            return this.cache[key];
        } else {
            let res = new lookupRowInfo<lookupType>();
            this.cache[key] = res;
            this.categories.get(find).then(() => {
                res.loading = false;
                if (this.categories.items.length > 0) {
                    res.value = this.categories.items[0];
                    res.found = true;
                }
            });
            return res;
        }

    }
}

class lookupRowInfo<type> {
    found = false;
    loading = true;
    value: type = {} as type;

}
export class AppHelper {
    constructor() {

    }
    Routes: Routes =
    [
    ];
    menues: MenuEntry[] = [];

    Components: Type<any>[] = [DataGridComponent, DataAreaCompnent, DataControlComponent, ColumnDesigner];

    Register(component: Type<any>) {
        this.Components.push(component);
        let name = component.name;
        if (this.Routes.length == 0)
            this.Routes.push({ path: '', redirectTo: '/' + name, pathMatch: 'full' });
        this.Routes.splice(0, 0, { path: name, component: component });
        this.menues.push({
            path: '/' + name,
            text: name
        });
    }
    Add(c: Type<any>) {
        this.Components.push(c);
    }

}
interface MenuEntry {
    path: string,
    text: string
}
export function getDayOfWeek(date: string) {
    return new Date(date).getDay();
}
export function getDayOfWeekName(date: string) {
    return new Date(date).toLocaleDateString("en-us", { weekday: "long" });
}



