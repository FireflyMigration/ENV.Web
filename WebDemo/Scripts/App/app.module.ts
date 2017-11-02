import { AppComponent } from './AppComponent';
import { categories } from './models';
import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { radWebModule }from 'radweb';
import { RouterModule, Routes } from '@angular/router';
import { Categories } from './Categories';
import { Orders } from './Orders';


@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: '/Categories',pathMatch:'full' },
            { path: 'Categories', component: Categories },
            { path: 'Orders', component: Orders }
        ], {
                enableTracing: false// set to true for debugging
            })
        , BrowserModule, FormsModule, HttpModule,radWebModule],
    declarations: [AppComponent, Categories, Orders],
    bootstrap: [AppComponent]
})
export class AppModule { }





