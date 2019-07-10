import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Page Imports
import { HomePageComponent } from '@pages/home-page/home-page.component';

// Directive Imports
import { TooltipDirective } from '@directives/tooltip.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    TooltipDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
