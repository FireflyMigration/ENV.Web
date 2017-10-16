import * as utils from './lib/utils';
export class categories extends utils.DataSettings<category>{
    constructor(settings?: utils.IDataSettings<category>) {
        super('/dataapi/categories', settings);
    }
}
export interface category {
    id?: number;
    categoryName?: string;
    description?: string;
}
