import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { routing } from './app.routes';
import { SectionAModule } from './section-a/section-a.module';
import { SectionBModule } from './section-b/section-b.module';
import { SectionCModule } from './section-c/section-c.module';
import { SectionDModule } from './section-d/section-d.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
  ],
  exports: [],
  imports: [
    BrowserModule,
    routing,
    SectionAModule,
    SectionBModule,
    SectionCModule,
    SectionDModule,
    BrowserAnimationsModule,
  ],
  providers: [],
})
export class AppModule { }
