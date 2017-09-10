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
const http_1 = require("@angular/http");
let dataService = class dataService {
    constructor(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.url = "http://localhost/webDemo";
    }
    getData(url) {
        return this.get('dataApi/' + url).then(response => {
            let x = response.json();
            return x;
        });
    }
    get(url) {
        return this.http.get(this.urlFor(url)).toPromise().catch(error => {
            console.error('An error occurred', error); // for demo purposes only
            return Promise.reject(error.message || error);
        });
    }
    put(url, data) {
        return this.http.put(this.urlFor('dataApi/' + url), JSON.stringify(data), { headers: this.headers }).toPromise();
    }
    do(url) {
        return this.get(url);
    }
    urlFor(url) {
        return `${this.url}/${url}`;
    }
};
dataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], dataService);
exports.dataService = dataService;
//# sourceMappingURL=data.service.js.map