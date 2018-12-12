import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { PageModule } from './page/page.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
  ],
  exports: [],
  imports: [
    BrowserModule,
    routing,
    PageModule,
    TranslateModule.forRoot(),
  ],
  providers: [],
})
export class AppModule { }
