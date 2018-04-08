import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AlertModule, TabsModule, BsDropdownModule, CollapseModule } from "ngx-bootstrap";
import { AppComponent } from './app.component';
import { RadWebModule } from 'radweb';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms'; 


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    TabsModule.forRoot(),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    RadWebModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
