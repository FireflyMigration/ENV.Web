import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TableLayoutComponent } from './utils/table-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { Categories} from './demo/categories';
import { Products } from './demo/products';

const appRoues: Routes =
    [
        { path: 'categories', component: Categories },
        {path:'products', component: Products },
        { path: '', redirectTo: '/categories', pathMatch: 'full' }
    ]

@NgModule({

    imports: [
        RouterModule.forRoot(appRoues, {
            enableTracing: false// set to true for debugging
        })
        , BrowserModule, FormsModule, HttpModule],
    declarations: [
        TableLayoutComponent,
        AppComponent,
        Categories,
        Products
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }