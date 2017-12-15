import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AlertModule,TabsModule } from "ngx-bootstrap";
import { AppComponent } from './app.component';
import { RadWebModule} from 'radweb';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,TabsModule.forRoot(),RadWebModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
