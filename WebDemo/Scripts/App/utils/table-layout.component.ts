// https://medium.com/@ct7/building-a-reusable-table-layout-for-your-angular-2-project-adf6bba3b498
import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'ct-table',
    templateUrl: './scripts/app/utils/table-layout.component.html'
})
export class TableLayoutComponent implements OnChanges {


    @Input() records: any[];
    @Input() caption: string;
    keys: string[]=[];
    ngOnChanges(): void {
        if (this.records.length > 0)
            this.keys = Object.keys(this.records[0]);
    }
}