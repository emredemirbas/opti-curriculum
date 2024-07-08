import {Component} from '@angular/core';
import {ScheduleService} from "../../services/schedule.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-courses-and-classrooms',
  templateUrl: './courses-and-classrooms.component.html',
  styleUrls: ['./courses-and-classrooms.component.css']
})
export class CoursesAndClassroomsComponent {
  showForm: boolean = false;
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  dropdownOpen: boolean = false;
  schedule: any;
  addNewCourseMenuVisible: boolean = false;
  manipulateCourseMenuVisible: boolean = false;
  displayCoursesMenuVisible: boolean = false;
  addClassroomMenuVisible: boolean = false;
  manipulateClassroomMenuVisible: boolean = false;
  displayClassroomsMenuVisible: boolean = false;

  newCourseCode!: string;
  newCourseName!: string;
  newCourseYear!: number;
  newCourseCredit!: number;
  newCourseNumberOfStudents!: number;
  newCourse_c_or_e!: string;
  newCourse_d_or_s!: string;
  newCourseInstructorName!: string;
  newCourseHoursPreference!: string;


  manipulatedCourseCode!: string;
  newManipulatedCourseYear!: number;
  newManipulatedCourseNumberOfStudents!: number;
  newManipulatedCourseHoursPreference!: string;

  newClassroomId!: string;
  newClassroomCapacity!: number;

  manipulatedClassroomId!: string;
  newManipulatedClassroomCapacity!: number;


  constructor(public service: ScheduleService) {

  }


  addNewCourse(form: NgForm): void {
    const {
      newCourseCode,
      newCourseName,
      newCourseYear,
      newCourseCredit,
      newCourseNumberOfStudents,
      newCourse_c_or_e,
      newCourse_d_or_s,
      newCourseInstructorName,
      newCourseHoursPreference
    } = form.value;

    if (newCourseCode === undefined || newCourseName === undefined || newCourseYear === undefined ||
      newCourseCredit === undefined || newCourseNumberOfStudents === undefined || newCourse_c_or_e === undefined ||
      newCourse_d_or_s === undefined || newCourseInstructorName === undefined || newCourseHoursPreference === undefined) {
      alert('Failed to add new course! Please make sure that you entered all the course attributes.');
      return;
    }

    this.service.schedule.addNewCourse(newCourseCode, newCourseName, parseInt(newCourseYear), parseInt(newCourseCredit), newCourse_c_or_e, newCourse_d_or_s, parseInt(newCourseNumberOfStudents), newCourseInstructorName, newCourseHoursPreference);
  }

  updateExistingCourse(form: NgForm): void {
    const {
      manipulatedCourseCode,
      newManipulatedCourseYear,
      newManipulatedCourseNumberOfStudents,
      newManipulatedCourseHoursPreference
    } = form.value;

    if (manipulatedCourseCode === undefined || newManipulatedCourseYear === undefined || newManipulatedCourseNumberOfStudents === undefined ||
      newManipulatedCourseHoursPreference === undefined) {
      alert('Failed to update course! Please make sure that you entered all the course attributes.');
      return;
    }

    const course = this.service.courses.find(c => c.code === manipulatedCourseCode);
    // @ts-ignore
    this.service.schedule.updateExistingCourse(course, parseInt(newManipulatedCourseYear), parseInt(newManipulatedCourseNumberOfStudents), newManipulatedCourseHoursPreference);
  }

  addNewClassroom(form: NgForm): void {
    const {
      newClassroomId,
      newClassroomCapacity
    } = form.value;
    this.service.schedule.addNewClassroom(newClassroomId, parseInt(newClassroomCapacity));
  }

  updateExistingClassroom(form: NgForm): void {
    const {
      manipulatedClassroomId,
      newManipulatedClassroomCapacity
    } = form.value;
    console.log(manipulatedClassroomId);
    console.log(newManipulatedClassroomCapacity);
    const classroom = this.service.classrooms.find(c => c.id === manipulatedClassroomId);
    // @ts-ignore
    this.service.schedule.updateExistingClassroom(classroom, newManipulatedClassroomCapacity);
  }

  toggleAddNewCourseMenu() {
    this.addNewCourseMenuVisible = !this.addNewCourseMenuVisible;
    this.manipulateCourseMenuVisible = false;
    this.displayCoursesMenuVisible = false;
    this.addClassroomMenuVisible = false;
    this.manipulateClassroomMenuVisible = false;
    this.displayClassroomsMenuVisible = false;
  }

  toggleManipulateCourseMenu() {
    this.manipulateCourseMenuVisible = !this.manipulateCourseMenuVisible;
    this.addNewCourseMenuVisible = false;
    this.displayCoursesMenuVisible = false;
    this.addClassroomMenuVisible = false;
    this.manipulateClassroomMenuVisible = false;
    this.displayClassroomsMenuVisible = false;
  }

  toggleDisplayCoursesMenu() {
    this.displayCoursesMenuVisible = !this.displayCoursesMenuVisible;
    this.addNewCourseMenuVisible = false;
    this.manipulateCourseMenuVisible = false;
    this.addClassroomMenuVisible = false;
    this.manipulateClassroomMenuVisible = false;
    this.displayClassroomsMenuVisible = false;
  }

  toggleAddClassroomMenu() {
    this.addClassroomMenuVisible = !this.addClassroomMenuVisible;
    this.addNewCourseMenuVisible = false;
    this.manipulateCourseMenuVisible = false;
    this.displayCoursesMenuVisible = false;
    this.manipulateClassroomMenuVisible = false;
    this.displayClassroomsMenuVisible = false;
  }

  toggleManipulateClassroomMenu() {
    this.manipulateClassroomMenuVisible = !this.manipulateClassroomMenuVisible;
    this.addNewCourseMenuVisible = false;
    this.manipulateCourseMenuVisible = false;
    this.displayCoursesMenuVisible = false;
    this.addClassroomMenuVisible = false;
    this.displayClassroomsMenuVisible = false;
  }

  toggleDisplayClassroomsMenu() {
    this.displayClassroomsMenuVisible = !this.displayClassroomsMenuVisible;
    this.addNewCourseMenuVisible = false;
    this.manipulateCourseMenuVisible = false;
    this.displayCoursesMenuVisible = false;
    this.addClassroomMenuVisible = false;
    this.manipulateClassroomMenuVisible = false;
  }
}
