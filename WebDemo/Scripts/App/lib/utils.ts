
import { Component, Input, OnChanges, Type } from '@angular/core';
import { Routes } from '@angular/router';



export class ColumnCollection<rowType> {
    constructor(public currentRow: () => any, private allowUpdate: () => boolean, private _filterData: (f: rowType) => void) {

        if (this.allowDesignMode == undefined) {
            if (location.search)
                if (location.search.toLowerCase().indexOf('design=y') >= 0)
                    this.allowDesignMode = true;
        }
    }
    private settingsByKey = {};
    _optionalKeys() {
        if (!this.currentRow())
            return [];
        let r = this.currentRow();
        let result = [];
        Object.keys(r).forEach(key => {
            if (typeof (r[key]) != 'function')

                result.push(key);
        });
        return result;
    }
    private allowDesignMode: boolean;
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
                if (!s.caption)
                    s.caption = makeTitle(s.key);
                if (s.dropDown) {
                    let orig = s.dropDown.items;
                    let result: dropDownItem[] = [];
                    s.dropDown.items = result;
                    let populateBasedOnArray = (arr: Array<any>) => {
                        for (let item of arr) {
                            let type = typeof (item);
                            if (type == "string" || type == "number")
                                result.push({ id: item, caption: item });
                            else {
                                if (!s.dropDown.idKey) {
                                    if (item['id'])
                                        s.dropDown.idKey = 'id';
                                    else {
                                        for (let keyInItem of Object.keys(item)) {
                                            s.dropDown.idKey = keyInItem;
                                            break;
                                        }
                                    }
                                }
                                if (!s.dropDown.captionKey) {
                                    if (item['caption'])
                                        s.dropDown.captionKey = 'caption';
                                    else {
                                        for (let keyInItem of Object.keys(item)) {
                                            if (keyInItem != s.dropDown.idKey) {
                                                s.dropDown.captionKey = keyInItem;
                                                break;
                                            }
                                        }
                                    }
                                }
                                let p = { id: item[s.dropDown.idKey], caption: item[s.dropDown.captionKey] };
                                if (!p.caption)
                                    p.caption = p.id;
                                result.push(p);
                            }
                        }
                    };
                    if (orig instanceof Array) {
                        populateBasedOnArray(orig);
                    }
                    if (s.dropDown.source) {
                        if (typeof (s.dropDown.source) == "string") {
                            new RestList(s.dropDown.source).get({ limit: 5000 }).then(arr => populateBasedOnArray(arr));
                        }
                        else if (s.dropDown.source instanceof RestList) {
                            s.dropDown.source.get({ limit: 5000 }).then(arr => populateBasedOnArray(arr));
                        } else {
                            let x = s.dropDown.source as Promise<any>;
                            if (x.then) {
                                x.then(arr => populateBasedOnArray(arr));
                            }
                        }
                    }
                }
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
                    if (s.defaultValue)
                        existing.defaultValue = s.defaultValue;
                    if (s.onUserChangedValue)
                        existing.onUserChangedValue = s.onUserChangedValue;


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
    userFilter: rowType = {} as rowType;
    filterRows(col: FilteredColumnSetting<any>) {
        col._showFilter = false;
        this._filterData(this.userFilter);
    }
    clearFilter(col: FilteredColumnSetting<any>) {
        col._showFilter = false;
        this.userFilter[col.key] = undefined;
        this._filterData(this.userFilter);
    }
    _shouldShowFilterDialog(col: FilteredColumnSetting<any>) {
        return col._showFilter;
    }
    showFilterDialog(col: FilteredColumnSetting<any>) {
        col._showFilter = !col._showFilter;
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
        let r;
        if (col.getValue)
            r = col.getValue(row);
        else r = row[col.key];
        if (col.inputType == "date")
            r = new Date(r).toLocaleDateString();
        if (col.dropDown) {
            if (col.dropDown.items instanceof Array)
                for (let item of col.dropDown.items) {
                    let i: dropDownItem = item;
                    if (i.id == r)
                        return i.caption;
                }
        }
        return r;
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
                this._optionalKeys().forEach(key => {

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
        if (col.onUserChangedValue)
            col.onUserChangedValue(r);

    }
    items: ColumnSetting<any>[] = [];
    private gridColumns: ColumnSetting<any>[];
    private nonGridColumns: ColumnSetting<any>[];
    numOfColumnsInGrid = 5;

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
    
        <div class="{{getColumnsClass()}}" *ngFor="let col of theColumns()">
            <div class="form-group {{settings.columns._getColumnClass(map,settings.columns.currentRow())}}" *ngFor="let map of col" >
                <div class="col-sm-{{labelWidth}}">
                    <label class="control-label" *ngIf="!map.designMode">{{map.caption}}</label>
                    <column-designer [settings]="settings.columns" [map]="map"></column-designer>
                </div>
                <div class="col-sm-{{12-labelWidth}}">
                    <data-control [settings]="settings.columns" [map]="map" [record]="settings.columns.currentRow()"></data-control>
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
            if (areaSettings.settings) {
                if (areaSettings.settings.labelWidth)
                    this.labelWidth = areaSettings.settings.labelWidth;
                if (areaSettings.settings.numberOfColumnAreas)
                    this.columns = areaSettings.settings.numberOfColumnAreas;
            }
        }


    }
    getColumnsClass() {
        if (this.columns > 1)
            return "col-sm-" + 12 / this.columns;
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
    @Input() settings: dataAreaSettings = { columns: new ColumnCollection(() => undefined, () => false, null) };
    @Input() labelWidth = 4;
    @Input() columns = 1;
}




@Component({
    selector: 'data-control',
    template: `
<span *ngIf="!_getEditable()" >{{settings._getColValue(map,record)}}</span>
<div *ngIf="_getEditable()" class="" [class.has-error]="settings._getError(map,record)">
    <div >
        <div [class.input-group]="showDescription()||map.click" *ngIf="!isSelect()">
            <div class="input-group-btn" *ngIf="map.click">
                <button type="button" class="btn btn-default" (click)="map.click(record)" > <span class="glyphicon glyphicon-chevron-down"></span></button>
            </div>
            <input class="form-control"  [(ngModel)]="record[map.key]" type="{{settings._getColDataType(map)}}" (ngModelChange)="settings._colValueChanged(map,record)" />
            <div class="input-group-addon" *ngIf="showDescription()">{{map.getValue(record)}}</div>
            
        </div>
        <div *ngIf="isSelect()">
            <select  class="form-control" [(ngModel)]="record[map.key]" (ngModelChange)="settings._colValueChanged(map,record)" >
                <option *ngFor="let v of map.dropDown.items" value="{{v.id}}">{{v.caption}}</option>
                
            </select>
        </div>
    <span class="help-block" *ngIf="settings._getError(map,record)">{{settings._getError(map,record)}}</span>
    </div>
</div>`
})
export class DataControlComponent {
    @Input() map: ColumnSetting<any>;
    @Input() record: any;
    @Input() notReadonly: false;
    showDescription() {
        return this.map.key && this.map.getValue;
    }
    _getEditable() {
        if (this.notReadonly)
            return true;
        return this.settings._getEditable(this.map);
    }
    ngOnChanges(): void {

    }
    isSelect() {
        return this.map.dropDown;
    }
    @Input() settings: ColumnCollection<any>;
}
declare var $;
export class SelectPopup<rowType> {
    constructor(
        private modalList: DataSettings<rowType>, settings?: SelectPopupSettings) {
        this.modalId = makeid();
        if (settings) {
            if (settings.title)
                this.title = settings.title;
            if (settings.searchColumnKey)
                this.searchColumn = settings.searchColumnKey;
        }
        if (!this.title)
            this.title = "Select " + modalList.caption;
    }
    private title: string;
    private search() {
        let s = {};
        s[this.searchColumn] = this.searchText + "*";

        this.modalList.get({
            isEqualTo: <rowType>s
        });
    }
    private searchText: string;
    private searchColumn: string;

    private modalId: string = "myModal";
    private onSelect: (selected: rowType) => void;
    modalSelect() {
        this.onSelect(this.modalList.currentRow);
        $("#" + this.modalId).modal('hide');
    }
    show(onSelect: (selected: rowType) => void) {
        if (!this.searchColumn) {
            for (let col of this.modalList.columns.items) {
                if (col.key != "id" && (!col.inputType || col.inputType == "text")) {
                    this.searchColumn = col.key;
                    break;
                }
            }
        }
        this.onSelect = onSelect;
        $("#" + this.modalId).modal('show');
    }
    searchColumnCaption() {
        for (let item of this.modalList.columns.items) {
            if (item.key == this.searchColumn)
                return item.caption;
        }
        return this.searchColumn;
    }
}
interface SelectPopupSettings {
    title?: string;
    searchColumnKey?: string;
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

@Component({
    selector: 'select-popup',
    template: `

<!-- Modal -->
<div class="modal fade"  *ngIf="settings && settings.popupSettings" id="{{settings.popupSettings.modalId}}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">{{settings.popupSettings.title}}</h4>
      </div>
      <div class="modal-body">
<div class="row">
<div class="col-sm-10">
        <div class="form-group">
    <label >Search</label>
    <input type="search" class="form-control" placeholder="{{settings.popupSettings.searchColumnCaption()}}"[(ngModel)]="settings.popupSettings.searchText" (ngModelChange)="settings.popupSettings.search()">
  </div>
</div>
        <data-grid [settings]="settings"></data-grid>
</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" (click)="settings.popupSettings.modalSelect()">Select</button>
      </div>
    </div>
  </div>
</div>`
})
export class SelectPopupComponent {
    @Input() settings: DataSettings<any>;



}




export interface dropDownOptions {

    items?: dropDownItem[] | string[] | any[];
    source?: Promise<any> | RestList<any> | string | DataSettings<any>;
    idKey?: string;
    captionKey?: string;
}

export interface dropDownItem {
    id?: any;
    caption?: any;
}


@Component({
    selector: 'column-designer',
    template: `
<div *ngIf="map.designMode" class="columnDesigner">
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

        <button class="btn btn-success glyphicon glyphicon-ok pull-left" (click)="settings.designColumn(map)"></button>
        <div class="btn-group pull-right">
                <button class="btn btn-danger glyphicon glyphicon-trash " (click)="settings.deleteCol(map)"></button>
                <button class="btn btn-primary glyphicon glyphicon-plus " (click)="settings.addCol(map)"></button>
                <button class="btn btn-primary glyphicon glyphicon-chevron-left" (click)="settings.moveCol(map,-1)"></button>
                <button class="btn btn-primary glyphicon glyphicon-chevron-right" (click)="settings.moveCol(map,1)"></button>
        </div>
    </div>
</div>
<span class="designModeButton pull-right">
<span class="glyphicon glyphicon-pencil " (click)="settings.designColumn(map)" *ngIf="settings.allowDesignMode"></span>
</span>
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
        this.settings.setCurrentRow(row);
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
                visible: (r) => !isNewRow(r),
                click: r => this.catchErrors(r.delete(), r),
                cssClass: "btn-danger glyphicon glyphicon-trash"
            });
        for (let b of this.settings._buttons) {
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


interface IDataAreaSettings<rowType> {
    columnSettings?: ColumnSetting<rowType>[];
    numberOfColumnAreas?: number;
    labelWidth?: number;
}

class DataAreaSettings<rowType>
{

    constructor(public columns: ColumnCollection<rowType>, public settings: IDataAreaSettings<rowType>) {
        if (settings.columnSettings)
            columns.add(...settings.columnSettings);

    }
}

export class Lookup<lookupType > {

    constructor(url: string) {
        this.restList = new RestList<lookupType>(url);
    }

    private restList: RestList<lookupType>;
    private cache: {};

    get(filter: lookupType): lookupType {
        return this.getInternal(filter).value;
    }
    found(filter: lookupType): boolean {
        return this.getInternal(filter).found;
    }

    private getInternal(filter: lookupType): lookupRowInfo<lookupType> {
        let find: getOptions<lookupType> = {};
        find.isEqualTo = filter;
        let key = JSON.stringify(find);
        if (this.cache == undefined)
            this.cache = {};
        if (this.cache[key]) {
            return this.cache[key];
        } else {
            let res = new lookupRowInfo<lookupType>();
            this.cache[key] = res;
            if (filter == undefined) {
                res.loading = false;
                res.found = false;
                return res;
            } else
                res.promise = this.restList.get(find).then(() => {
                    res.loading = false;
                    if (this.restList.items.length > 0) {
                        res.value = this.restList.items[0];
                        res.found = true;
                    }
                    return res;
                });
            return res;
        }

    }
    whenGet(r: lookupType) {
        return this.getInternal(r).promise.then(r => r.value);
    }
}



export class DataSettings<rowType>  {

    

    private popupSettings: SelectPopup<rowType>;
    show(onSelect: (selected: rowType) => void) {
        
            
        this.popupSettings.show(onSelect);
    }


    static getRecords(): any {
        throw new Error("Method not implemented.");
    }
    private addNewRow() {
        let r = this.restList.add();
        this.columns.items.forEach(item => {
            if (item.defaultValue) {
                let result = item.defaultValue(r);
                if (result != undefined)
                    r[item.key] = result;

            }
        });
        if (this.onNewRow(r))
            this.onNewRow(r);
        this.setCurrentRow(r);
    }

    addArea(settings: IDataAreaSettings<rowType>) {
        let col = new ColumnCollection<rowType>(() => this.currentRow, () => this.allowUpdate, (userFilter) => {
            this.extraFitler = userFilter;
            this.page = 1;
            this.getRecords();
        });

        return new DataAreaSettings<rowType>(col, settings);
    }
    currentRow: rowType;
    setCurrentRow(row: rowType) {
        this.currentRow = row;
        if (this.onEnterRow && row) {
            this.onEnterRow(row);
        }

    }
    allowUpdate = false;
    allowInsert = false;
    allowDelete = false;
    private hideDataArea = false;


    _buttons: rowButtonBase[] = [];

    rowClass?: (row: any) => string;
    onSavingRow?: (s: ModelState<any>) => void;
    onEnterRow: (row: rowType) => void;
    onNewRow: (row: rowType) => void;

    caption: string;
    lookup: Lookup<rowType>;
    constructor(restUrl?: string, settings?: IDataSettings<rowType>) {
        this.restList = new RestList<rowType>(restUrl);
        this.restList._rowReplacedListeners.push((old, curr) => {
            if (old == this.currentRow)
                this.setCurrentRow(curr);
        });
        this.lookup = new Lookup<rowType>(restUrl);
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
                this.columns.numOfColumnsInGrid = settings.numOfColumnsInGrid;

            if (settings.rowButtons)
                this._buttons = settings.rowButtons;


            if (settings.rowCssClass)
                this.rowClass = settings.rowCssClass;
            if (settings.onSavingRow)
                this.onSavingRow = settings.onSavingRow;
            if (settings.onEnterRow)
                this.onEnterRow = settings.onEnterRow;
            if (settings.onNewRow)
                this.onNewRow = settings.onNewRow;
            if (settings.caption)
                this.caption = settings.caption;
            this.getOptions = settings.get;

        }
        if (!this.caption && restUrl) {
            this.caption = makeTitle(restUrl.substring(restUrl.lastIndexOf('/') + 1));
        }
        this.popupSettings = new SelectPopup(this);
    }
    columns = new ColumnCollection<rowType>(() => this.currentRow, () => this.allowUpdate, (userFilter) => {
        this.extraFitler = userFilter;
        this.page = 1;
        this.getRecords();
    });




    private page = 1;
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

    private extraFitler: rowType;

    private getOptions: getOptions<rowType>;
    getRecords() {

        let opt: getOptions<rowType> = {};
        if (this.getOptions)
            opt = JSON.parse(JSON.stringify(this.getOptions));
        if (!opt.limit)
            opt.limit = 7;
        if (this.page > 1)
            opt.page = this.page;
        if (this.extraFitler) {
            if (!opt.isEqualTo)
                opt.isEqualTo = <rowType>{};
            for (let val in this.extraFitler) {
                if (opt.isEqualTo[val] == undefined)
                    opt.isEqualTo[val] = this.extraFitler[val];
            }
        }

        return this.restList.get(opt).then(() => {


            if (this.restList.items.length == 0)
                this.setCurrentRow(undefined);
            else {


                this.setCurrentRow(this.restList.items[0]);
                this.columns.autoGenerateColumnsBasedOnData();
            }
            return this.restList;
        });
    };



    private restList: RestList<rowType>;
    get items(): rowType[] {
        if (this.restList)
            return this.restList.items;
        return undefined;
    }





}
export interface IDataSettings<rowType> {
    allowUpdate?: boolean,
    allowInsert?: boolean,
    allowDelete?: boolean,
    hideDataArea?: boolean,
    autoGet?: boolean;
    columnSettings?: ColumnSetting<rowType>[],
    areas?: { [areaKey: string]: ColumnSetting<any>[] },
    columnKeys?: string[],
    rowCssClass?: (row: rowType) => string;
    rowButtons?: rowButton<rowType>[],
    get?: getOptions<rowType>,
    onSavingRow?: (s: ModelState<rowType>) => void;
    onEnterRow?: (r: rowType) => void;
    onNewRow?: (r: rowType) => void;
    numOfColumnsInGrid?: number;
    caption?: string;

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
    defaultValue?: (row: rowType) => any;
    onUserChangedValue?: (row: rowType) => void;
    click?: (row: rowType) => void;
    dropDown?: dropDownOptions;
}

interface FilteredColumnSetting<rowType> extends ColumnSetting<rowType> {
    _showFilter?: boolean;
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
    _rowReplacedListeners: ((oldRow: T, newRow: T) => void)[] = [];

    private map(item: T): restListItem & T {

        let x = <any>item;
        let id = x.id;
        let orig = JSON.stringify(item);
        x.__wasChanged = () => orig != JSON.stringify(item) || isNewRow(item);
        x.reset = () => {
            if (isNewRow(item)) {
                this.items.splice(this.items.indexOf(x), 1);
                this._rowReplacedListeners.forEach(y => y(x, undefined));
            }
            else
                this.replaceRow(item, JSON.parse(orig));
        }

        x.save = () => this.save(id, x);
        x.delete = () => {
            return fetch(this.url + '/' + id, { method: 'delete' }).then(() => { }, onError).then(() => {
                this.items.splice(this.items.indexOf(x), 1);
                this._rowReplacedListeners.forEach(y => y(x, undefined));
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
            return this.items;
        });
    }
    add(): T {
        let x: newItemInList = { newRow: true };
        this.items.push(this.map(x as any as T));
        return x as any as T;
    }
    replaceRow(originalRow, newRow) {
        newRow = this.map(newRow);
        this.items[this.items.indexOf(originalRow)] = newRow;
        this._rowReplacedListeners.forEach(x => x(originalRow, newRow));
    }
    private save(id: any, c: restListItem & T) {


        if (isNewRow(c))
            return myFetch(this.url, {
                method: 'post',
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify(c)
            }).then(response => {
                this.replaceRow(c, response);
            });
        else {

            return myFetch(this.url + '/' + id, {
                method: 'put',
                headers: {
                    'Content-type': "application/json"
                },
                body: JSON.stringify(c)
            }).then(response => {

                this.replaceRow(c, response);
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



class lookupRowInfo<type> {
    found = false;
    loading = true;
    value: type = {} as type;
    promise: Promise<lookupRowInfo<type>>

}
export class AppHelper {
    constructor() {

    }
    Routes: Routes =
    [
    ];
    menues: MenuEntry[] = [];

    Components: Type<any>[] = [DataGridComponent, DataAreaCompnent, DataControlComponent, ColumnDesigner, SelectPopupComponent];

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
    return dateFromDataString(date).getDay();
}
export function getDayOfWeekName(date: string) {
    return dateFromDataString(date).toLocaleDateString("en-us", { weekday: "long" });
}
export function dateFromDataString(date: string) {
    let from = date.split('-');
    return new Date(+from[2], +from[1] - 1, +from[0]);
}
export function dateToDataString(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
function isNewRow(r: any) {
    if (r) {
        let nr: newItemInList = r as any as newItemInList;
        return (nr.newRow)
    }
    return false;
}


