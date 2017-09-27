import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import * as utils from './lib/utils';
import { RouterModule, Routes } from '@angular/router';
import { Categories } from './Categories';


const appRoues: Routes =
    [
        { path: 'categories', component: Categories },
        { path: '', redirectTo: '/categories', pathMatch: 'full' }
    ]

@NgModule({

    imports: [
        RouterModule.forRoot(appRoues, {
            enableTracing: false// set to true for debugging
        })
        , BrowserModule, FormsModule, HttpModule],
    declarations: [
        utils.DataGridComponent,
        AppComponent,
        Categories,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }