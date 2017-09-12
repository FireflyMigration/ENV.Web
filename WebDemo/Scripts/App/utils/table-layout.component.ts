// https://medium.com/@ct7/building-a-reusable-table-layout-for-your-angular-2-project-adf6bba3b498
import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'ct-table',
    templateUrl: './scripts/app/utils/table-layout.component.html'
})
export class TableLayoutComponent implements OnChanges {


    @Input() records: Iterable<any>;
    @Input() caption: string;
    @Input() settings: ColumnSetting[];
    columnMaps: ColumnSetting[];
    keys: string[] = [];
    ngOnChanges(): void {
        if (this.settings) { // when settings provided
            this.columnMaps = this.settings;
            this.columnMaps.forEach(s => {
                if (!s.caption)
                    s.caption = makeTitle(s.key);
            });
        } else {
            {
                let x = this.records as any[];
                if (x)
                    // no settings, create column maps with defaults
                    if (x.length > 0) {
                        this.columnMaps = [];
                        Object.keys(x[0]).forEach(key => {
                            if (typeof (x[0][key]) != 'function')

                                this.columnMaps.push({
                                    key: key,
                                    caption: makeTitle(key)
                                });
                        });
                    }
            }
        }
    }
}
function makeTitle(key: string) {
    return key.slice(0, 1).toUpperCase() + key.replace(/_/g, ' ').slice(1);
}

export class ColumnSetting {
    key: string;
    caption?: string;


}