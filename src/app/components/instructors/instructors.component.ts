import {Component} from '@angular/core';
import {ScheduleService} from "../../services/schedule.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.css'
})
export class InstructorsComponent {
  addBusyHoursMenuVisible: boolean = false;
  removeBusyHoursMenuVisible: boolean = false;
  displayInstructorsMenuVisible: boolean = false;

  // for add busy hour
  chosenInstructorNameForAdd!: string;
  chosenDayForAdd!: string;
  chosenHourForAdd!: string;

  // for remove busy hour
  chosenInstructorNameForRemove!: string;
  chosenDayForRemove!: string;
  chosenHourForRemove!: string;


  addBusyHour(form: NgForm) {
    const {
      chosenInstructorNameForAdd,
      chosenDayForAdd,
      chosenHourForAdd
    } = form.value;
    const instructor = this.service.instructors.find(i => i.name === chosenInstructorNameForAdd);

    if (instructor === undefined) {
      alert('Instructor does not exist!');
      return;
    }

    if (instructor.busyHours[this.service.dayToIndex(chosenDayForAdd)].includes(chosenHourForAdd)) {
      alert(`Instructor ${instructor.name} is already busy at ${chosenDayForAdd} ${chosenHourForAdd}.`);
      return;
    }

    instructor.addBusyHour(chosenDayForAdd, chosenHourForAdd);
    alert('Busy hour has been added.');
  }

  removeBusyHour(form: NgForm) {
    const {
      chosenInstructorNameForRemove,
      chosenDayForRemove,
      chosenHourForRemove
    } = form.value;

    const instructor = this.service.instructors.find(i => i.name === chosenInstructorNameForRemove);
    if (instructor === undefined) {
      alert('Instructor does not exist!');
      return;
    }

    if (!instructor.busyHours[this.service.dayToIndex(chosenDayForRemove)].includes(chosenHourForRemove)) {
      alert(`Instructor ${instructor.name} is already available at ${chosenDayForRemove} ${chosenHourForRemove}.`);
      return;
    }

    const hourIndex = instructor.busyHours[this.service.dayToIndex(chosenDayForRemove)].indexOf(chosenHourForRemove);
    if (hourIndex !== -1) {
      instructor.busyHours[this.service.dayToIndex(chosenDayForRemove)].splice(hourIndex, 1);
    }

    // delete chosenHourForRemove from the instructor.busyHours[this.service.dayToIndex(chosenDayForRemove)]
    // note that busyHours is string[][].

    alert('Busy hour has been removed.');
  }

  toggleAddBusyHoursMenu() {
    this.addBusyHoursMenuVisible = !this.addBusyHoursMenuVisible;
    this.removeBusyHoursMenuVisible = false;
    this.displayInstructorsMenuVisible = false;
  }

  toggleRemoveBusyHoursMenu() {
    this.removeBusyHoursMenuVisible = !this.removeBusyHoursMenuVisible;
    this.addBusyHoursMenuVisible = false;
    this.displayInstructorsMenuVisible = false;
  }

  toggleDisplayInstructorsMenu() {
    this.displayInstructorsMenuVisible = !this.displayInstructorsMenuVisible;
    this.addBusyHoursMenuVisible = false;
    this.removeBusyHoursMenuVisible = false;
  }

  constructor(public service: ScheduleService) {
  }
}
