// https://medium.com/@ct7/building-a-reusable-table-layout-for-your-angular-2-project-adf6bba3b498
import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'ct-table',
    templateUrl: './scripts/app/utils/table-layout.component.html'
})
export class TableLayoutComponent implements OnChanges {


    @Input() records: Iterable<any>;
    
    @Input() settings =new ColumnSettings();
    columnMaps: ColumnSetting[];
    rowButtons: rowButton[] = [];
    keys: string[] = [];
    ngOnChanges(): void {
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


        if (this.settings.settings.length>0) { // when settings provided
            this.columnMaps = this.settings.settings;
            this.columnMaps.forEach(s => {
                if (!s.caption)
                    s.caption = makeTitle(s.key);
            });
        } else {
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
}
function makeTitle(key: string) {
    return key.slice(0, 1).toUpperCase() + key.replace(/_/g, ' ').slice(1);
}

export class ColumnSettings {
    settings: ColumnSetting[] = [];
    constructor(...columns: ColumnSetting[]);
    constructor(...columns: string[]);
    constructor(...columns: any[]){
        this.add(...columns);
    }
    add(...columns: ColumnSetting[]);
    add(...columns: string[]);
    add(...columns: any[]){
        for (let c of columns) {
            let x = c as ColumnSetting;
            if (x.key)
                this.settings.push(x);
            else this.settings.push({key:c});
        }

    }
}

interface ColumnSetting {
    key: string;
    caption?: string;
}
class rowButton {
    constructor(public name: string) { }
    visible: (r: any) => boolean = (r) => true;
    click: (r: any) => void = r => { };

}