// https://medium.com/@ct7/building-a-reusable-table-layout-for-your-angular-2-project-adf6bba3b498
import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'ct-table',
    templateUrl: './scripts/app/utils/table-layout.component.html'
})
export class TableLayoutComponent implements OnChanges {


    @Input() records: any[];
    @Input() caption: string;
    @Input() settings: ColumnSetting[];
    columnMaps: ColumnSetting[];
    keys: string[] = [];
    ngOnChanges(): void {
        if (this.settings) { // when settings provided
            this.columnMaps = this.settings;
        } else {
            {
                // no settings, create column maps with defaults
                if (this.records.length > 0)
                    this.columnMaps = Object.keys(this.records[0])
                        .map(key => {
                            return {
                                key: key,
                                caption: key.slice(0, 1).toUpperCase() +
                                key.replace(/_/g, ' ').slice(1)
                            }
                        });
            }
        }

    }
}

export class ColumnSetting {
    key: string;
    caption?: string;
    
    
}