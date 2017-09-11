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
const core_2 = require("@angular/core");
const data_service_1 = require("./data.service");
require("rxjs/add/operator/toPromise");
let AppComponent = class AppComponent {
    constructor(server) {
        this.server = server;
        this.title = 'Categories';
        this.categories = new RestList();
        this.status = 'ok';
    }
    ngOnInit() {
        this.categories.get(this.server, 'categories');
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        templateUrl: `./scripts/app/app.component.html`,
        providers: [data_service_1.dataService]
    }),
    core_2.Injectable(),
    __metadata("design:paramtypes", [data_service_1.dataService])
], AppComponent);
exports.AppComponent = AppComponent;
class RestList {
    constructor() {
        this.items = [];
    }
    get(server, name) {
        this.server = server;
        this.url = name;
        this.server.getData(name).then(r => {
            this.items = r;
        });
    }
    add() {
        let x = { newRow: true };
        this.items.push(x);
    }
    save(c) {
        if ('newRow' in c)
            return this.server.post(this.url, c).then(response => {
                this.items[this.items.indexOf(c)] = response;
            });
        else {
            return this.server.put(this.url + '/' + c.id, c).then(response => {
                this.items[this.items.indexOf(c)] = response;
            });
        }
    }
    delete(c) {
        return this.server.delete(this.url + '/' + c.id).then(() => {
            this.items.splice(this.items.indexOf(c), 1);
        });
    }
}
//# sourceMappingURL=app.component.js.map