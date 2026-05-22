import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoriesListComponent } from './components/stories-list/stories-list.component';
import { StoryDetailComponent } from './components/story-detail/story-detail.component';

const routes: Routes = [
  { path: '', component: StoriesListComponent },
  { path: 'story/:id', component: StoryDetailComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
