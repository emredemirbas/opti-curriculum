import {Injectable} from '@angular/core';
import {Classroom} from "../models/classroom";
import {Course} from "../models/course";
import {Instructor} from "../models/instructor";
import {Schedule} from "../models/schedule";

@Injectable({
  providedIn: 'root' // Makes this service available globally
})

export class ScheduleService {
  public weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  public hoursInSchedule: string[] = ['8:30', '9:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30', '16:30'];


  coursesData: string = '';
  classroomsData: string = '';
  busyHoursData: string = '';
  serviceCoursesData: string = '';

  classrooms: Classroom[] = [];
  courses: Course[] = [];
  instructors: Instructor[] = [];
  schedule: Schedule = new Schedule(this);

  // A mapping function that converts day to the index for some arrays in the program.
  dayToIndex(day: string): number {
    switch (day) {
      case 'Monday' :
        return 0;
      case 'Tuesday' :
        return 1;
      case 'Wednesday' :
        return 2;
      case 'Thursday' :
        return 3;
      case 'Friday' :
        return 4;
      default :
        throw new Error('Invalid Day! (see dayToIndex function in myservice.service.ts)');
    }
  }

  // A mapping function that converts hour to the index for some arrays in the program.
  hourToIndex(hour: string): number {
    switch (hour) {
      case '8:30' :
        return 0;
      case '9:30' :
        return 1;
      case '10:30' :
        return 2;
      case '11:30' :
        return 3;
      case '12:30' :
        return 4;
      case '13:30' :
        return 5;
      case '14:30' :
        return 6;
      case '15:30' :
        return 7;
      case '16:30' :
        return 8;
      default :
        throw new Error('Invalid Hour! (see hourToIndex function in myservice.service.ts)');
    }
  }

  // Mapping function that converts year to the index for some arrays in the program.
  yearToIndex(year: number): number {
    return year - 1;
  }

  assignAllCourses(): void {
    if (this.classrooms.length === 0 || this.courses.length === 0 || this.instructors.length === 0) {
      alert('Please upload the csv files before you try to create a schedule!');
      return;
    }
    try {
      this.schedule.assignAllServiceCourses();
      this.schedule.assignAllDepartmentCourses();
    } catch (err: any) {
      alert(err.message);
      this.schedule.abortSchedule();
    }
  }


}
