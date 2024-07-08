import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {UploadFilesComponent} from "./components/upload-files/upload-files.component";
import {CoursesAndClassroomsComponent} from "./components/courses-and-classrooms/courses-and-classrooms.component";
import {ScheduleComponent} from "./components/schedule/schedule.component";
import {InstructorsComponent} from "./components/instructors/instructors.component";
import {CreditsComponent} from "./components/credits/credits.component";


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'upload-files',
    component: UploadFilesComponent
  },
  {
    path: 'courses-and-classrooms',
    component: CoursesAndClassroomsComponent
  },
  {
    path: 'instructors',
    component: InstructorsComponent
  },
  {
    path: 'schedule',
    component: ScheduleComponent
  },
  {
    path: 'credits',
    component: CreditsComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
