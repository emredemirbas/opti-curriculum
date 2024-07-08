import {ScheduleService} from "../services/schedule.service";

export class Classroom {
  id: string;
  capacity: number;
  arr: { busy: boolean }[][];

  constructor(id: string, capacity: number, private service: ScheduleService) {
    this.id = id;
    this.capacity = capacity;
    this.arr = [
      [], // Monday
      [], // Tuesday
      [], // Wednesday
      [], // Thursday
      []  // Friday
    ];
    for (let i = 0; i < service.weekDays.length; i++) { // 5 times
      for (let j = 0; j < service.hoursInSchedule.length; j++) { // 9 times
        this.arr[i].push({busy: false}); // initially set all hours as available for the classroom.
      }
    }
  }

  // Method to reserve specified day & hour for the classroom.
  occupy(day: string, hour: string): void {
    this.arr[this.service.dayToIndex(day)][this.service.hourToIndex(hour)].busy = true;
  }

  // Method to make classroom free for the specified day & hour.
  makeAvailable(day: string, hour: string): void {
    this.arr[this.service.dayToIndex(day)][this.service.hourToIndex(hour)].busy = false;
  }

  makeAllDaysAndHoursAvailable(): void {
    for (let day of this.service.weekDays) {
      for (let hour of this.service.hoursInSchedule) {
        this.makeAvailable(day, hour);
      }
    }
  }

  isOccupied(day: string, hour: string): boolean {
    return this.arr[this.service.dayToIndex(day)][this.service.hourToIndex(hour)].busy;
  }


}
