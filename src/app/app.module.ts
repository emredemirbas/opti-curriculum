import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import { CoursesAndClassroomsComponent } from './components/courses-and-classrooms/courses-and-classrooms.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import {FormsModule} from "@angular/forms";
import { InstructorsComponent } from './components/instructors/instructors.component';
import { CreditsComponent } from './components/credits/credits.component';

// @ts-ignore
// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    CoursesAndClassroomsComponent,
    ScheduleComponent,
    UploadFilesComponent,
    InstructorsComponent,
    CreditsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIcon,
    MatToolbar,
    MatIconButton,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
