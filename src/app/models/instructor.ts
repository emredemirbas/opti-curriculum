import {ScheduleService} from "../services/schedule.service";

export class Instructor {
  name: string;
  busyHours: string[][];

  constructor(name: string, private service: ScheduleService) {
    this.name = name;
    this.busyHours = [
      [], // Monday
      [], // Tuesday
      [], // Wednesday
      [], // Thursday
      []  // Friday
    ];
  }

  addBusyHour(day: string, hour: string): void {
    const dayIndex = this.service.dayToIndex(day);
    if (!this.busyHours[dayIndex].includes(hour))
      this.busyHours[dayIndex].push(hour);
    this.busyHours.sort();
  }

  isBusy(day: string, hour: string): boolean {
    const dayIndex = this.service.dayToIndex(day);
    return this.busyHours[dayIndex].includes(hour);
  }

  isAvailable(day: string, hour: string): boolean {
    return !this.isBusy(day, hour);
  }

  getBusyHours(day: string): string[] {
    return this.busyHours[this.service.dayToIndex(day)];
  }

  getBusyHoursString(day: string): string {
    let result: string = '';
    for (let s of this.busyHours[this.service.dayToIndex(day)]) {
      result += s;
    }
    return result;
  }

  getAvailableHours(day: string): string[] {
    const availableHours: string[] = [];
    for (let hour of this.service.hoursInSchedule) {
      if (this.isAvailable(day, hour)) {
        availableHours.push(hour);
      }
    }
    return availableHours;
  }
}
