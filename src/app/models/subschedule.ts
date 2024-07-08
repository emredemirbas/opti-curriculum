import {Injectable} from '@angular/core';
import {ScheduleService} from "../services/schedule.service";

@Injectable({
  providedIn: 'root'
})

// This class represents the schedule for a specific year (1st year, 2nd year, ...)
export class SubSchedule {
  arr: { courseCode: string; classroomName: string }[][];

  constructor(private service: ScheduleService) {
    // if courseCode === ' ' and classroomName === ' ', it means that there is no assigned course in that hour yet.
    // However, a course may be unassigned via unassignExistingCourse method in the class Schedule.
    this.arr = [
      [], // Monday
      [], // Tuesday
      [], // Wednesday
      [], // Thursday
      []  // Friday
    ];
    for (let i = 0; i < service.weekDays.length; i++) {
      for (let j = 0; j < service.hoursInSchedule.length; j++) {
        this.arr[i].push({courseCode: ' ', classroomName: ' '});
      }
    }
  }

  hasAssignedCourse(day: string, hour: string): boolean {
    const dayIndex = this.service.dayToIndex(day);
    const hourIndex = this.service.hourToIndex(hour);
    const element = this.arr[dayIndex][hourIndex];
    return !(element.courseCode === ' ' && element.classroomName === ' ');
  }


}
