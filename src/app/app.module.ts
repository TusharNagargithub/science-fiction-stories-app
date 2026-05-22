import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { StoriesListComponent } from './components/stories-list/stories-list.component';
import { StoryDetailComponent } from './components/story-detail/story-detail.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StoriesListComponent,
    StoryDetailComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    DragDropModule,
    AppRoutingModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
