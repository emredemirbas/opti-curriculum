import {Injectable} from '@angular/core';
import {SubSchedule} from "./subschedule";
import {ScheduleService} from "../services/schedule.service";
import {Course} from "./course";
import {Classroom} from "./classroom";
import {Instructor} from "./instructor";

@Injectable({
  providedIn: 'root'
})

export class Schedule {
  subSchedules: SubSchedule[];

  constructor(private service: ScheduleService) {
    this.subSchedules = [
      new SubSchedule(service), // 1st year
      new SubSchedule(service), // 2nd year
      new SubSchedule(service), // 3rd year
      new SubSchedule(service)  // 4th year
    ]
    this.service = service;
  }

  // Method to return appropriate Classroom that meets the following criteria:
  // 1) Classroom's capacity must be sufficient for the course
  // 2) Classroom must not be occupied for the specified hours
  // 3) There should not be any intersecting course in the same year
  // 4) Instructor of the course must not be busy for the specified hours
  // If there is no Classroom that satisfies all of these conditions, this method will return undefined.
  findAppropriateClassroom(course: Course, day: string, hours: string[]): Classroom | undefined {
    return this.service.classrooms.find(classroom => {
      return classroom.capacity >= course.numberOfStudents &&
        hours.every(hour => !classroom.isOccupied(day, hour)) &&
        hours.every(hour => !this.subSchedules[this.service.yearToIndex(course.year)].hasAssignedCourse(day, hour)) &&
        hours.every(hour => !course.instructor.isBusy(day, hour));
    });
  }

  // Method to assign single service course automatically.
  assignServiceCourse(courseCode: string, day: string, hours: string[]): void {
    const courseToAdd = this.service.courses.find(course => courseCode === course.code);

    // @ts-ignore
    const appropriateClassroom = this.findAppropriateClassroom(courseToAdd, day, hours);

    // Display an error message, and abort the schedule if there is no appropriate classroom for the courseToAdd.
    if (appropriateClassroom === undefined) {
      // @ts-ignore
      throw new Error(`Course ${courseToAdd.code} could not be added to the schedule. Please increase the number of classrooms or capacity of the existing classrooms.`);
    }

    // Find the subList according to the year of the courseToAdd and which day this course will be given.
    // @ts-ignore
    const subSchedule = this.subSchedules[this.service.yearToIndex(courseToAdd.year)];
    const subList = subSchedule.arr[this.service.dayToIndex(day)];

    // Then assign this course if everything is alright.
    for (let hour of hours) {
      const index = this.service.hourToIndex(hour);
      // @ts-ignore
      subList[index].courseCode = courseToAdd.code;
      subList[index].classroomName = appropriateClassroom.id;
      appropriateClassroom.occupy(day, hour);
    }
  }

  // Method to parse service.csv & add these courses into the schedule automatically.
  assignAllServiceCourses(): void {
    if (this.service.serviceCoursesData === undefined) {
      throw new Error('Please make sure to upload service.csv file.');
    }
    const lines = this.service.serviceCoursesData.split('\n');
    lines.forEach(line => {
      line = line.trim();
      if (line === '') {
        return;
      }
      const [courseCode, day] = line.split(',');
      const hoursString = line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'));
      const [...hours] = hoursString.split(',');
      this.assignServiceCourse(courseCode, day, hours);
    });
  }

  // Helper method to assign courses that have 2+1 hoursPref. This method is responsible for assigning that +1 hour.
  assignRemainingHour(courseToAdd: Course): void {
    let dayOfFirstSession = undefined;
    for (let day of this.service.weekDays) {
      const subList = this.subSchedules[this.service.yearToIndex(courseToAdd.year)].arr[this.service.dayToIndex(day)];
      for (let hour of this.service.hoursInSchedule) {
        if (subList[this.service.hourToIndex(hour)].courseCode === courseToAdd.code) {
          dayOfFirstSession = day;
          break;
        }
      }
    }
    console.log(courseToAdd.code + ' -> (dayOfFirstSession): ' + dayOfFirstSession);
    console.log(this.service.weekDays);
    for (let otherDay of this.service.weekDays) {
      //console.log('otherDay: ' + otherDay);
      if (otherDay === dayOfFirstSession) {
        continue;
      }

      const subList = this.subSchedules[this.service.yearToIndex(courseToAdd.year)].arr[this.service.dayToIndex(otherDay)];
      for (let hour of this.service.hoursInSchedule) {
        console.log(hour);
        const appropriateClassroom = this.findAppropriateClassroom(courseToAdd, otherDay, [hour]);

        if (appropriateClassroom === undefined) {
          continue;
        }
        console.log(courseToAdd.code + ' -> (otherDay): ' + dayOfFirstSession);
        const index = this.service.hourToIndex(hour);
        subList[index].courseCode = courseToAdd.code;
        subList[index].classroomName = appropriateClassroom.id;
        appropriateClassroom.occupy(otherDay, hour);
        return;
      }
    }
    this.unassignExistingCourse(courseToAdd); // unassign assigned 2 hours
    throw new Error(`Course ${courseToAdd.code} could not be added to the schedule. Please increase the number of classrooms or capacity of the existing classrooms.`);
  }

  // Method to assign single course.
  assignSingleCourse(courseToAdd: Course, courseDuration: number): void {
    const instructor = courseToAdd.instructor;
    const subSchedule = this.subSchedules[this.service.yearToIndex(courseToAdd.year)];

    for (let i = 0; i < this.service.weekDays.length; i++) { // will iterate 5 times
      const subList = subSchedule.arr[i];
      for (let j = 0; j < this.service.hoursInSchedule.length - (courseDuration - 1); j++) { // will iterate 7 times, when hoursPref = 3
        const hoursSlice = this.service.hoursInSchedule.slice(j, j + courseDuration);

        // If the instructor is available in this slice, find the appropriate classroom and assign the course.
        if (hoursSlice.every(hour => instructor.isAvailable(this.service.weekDays[i], hour))) {
          const appropriateClassroom = this.findAppropriateClassroom(courseToAdd, this.service.weekDays[i], hoursSlice);

          // If the instructor is available, but appropriate class not found for this slice,
          // continue to search appropriate classroom for other hour slices.
          if (appropriateClassroom === undefined) {
            continue;
          }

          hoursSlice.forEach(hour => {
            const index = this.service.hourToIndex(hour);
            subList[index].courseCode = courseToAdd.code;
            subList[index].classroomName = appropriateClassroom.id;
            appropriateClassroom.occupy(this.service.weekDays[i], hour);
          });

          return; // Terminate this method if the course is assigned successfully.
        }
      }
    }
    // If the iteration ends without encountering the return statement in line 297, it means that there is no appropriate classroom for this course.
    throw new Error(`Course ${courseToAdd.code} could not be added to the schedule. Please increase the number of classrooms or capacity of the existing classrooms.`);
  }

  // Method to assign all department courses in courses.csv file.
  assignAllDepartmentCourses(): void {
    this.service.courses.filter(course => !course.isService()).forEach(course => {
      const hoursPref = course.hoursPreference;
      // hoursPref = 3
      if (hoursPref.indexOf('+') === -1) {
        this.assignSingleCourse(course, parseInt(hoursPref));
      }
      // hoursPref = 2 + 1
      else {
        this.assignSingleCourse(course, parseInt(hoursPref.substring(0, hoursPref.indexOf('+')))); // assign for 2 hours
        this.assignRemainingHour(course); // assign +1 hour
      }
    });
  }

  // Method to add a new course. Arguments are taken from the GUI. (See courses-and-classrooms component.)
  addNewCourse(code: string, name: string, year: number, credit: number, c_or_e: string, d_or_s: string, numberOfStudents: number, instructorName: string, hoursPreference: string): void {
    let instructor = this.service.instructors.find(i => i.name === instructorName);

    // If the instructor does not exist in the instructors array, create a new Instructor instance and push into the array.
    // This is needed because same instructor may offer different courses.
    if (!instructor) {
      instructor = new Instructor(instructorName, this.service);
      this.service.instructors.push(instructor);
    }

    const course = new Course(code, name, year, credit, c_or_e, d_or_s, numberOfStudents, instructor, hoursPreference, this.service);

    // If the course exists, then display an error message and terminate the method.
    if (this.service.courses.find(c => c.code === code && c.name === name) !== undefined) {
      alert(`Failed to add course ${code} (${name}). A course with the same code and same name already exists!`);
      return;
    }

    if (this.service.courses.find(c => c.code === code) !== undefined) {
      alert(`Failed to add course ${code} (${name}). A course with the same code already exists!`);
      return;
    }

    if (this.service.courses.find(c => c.name === name) !== undefined) {
      alert(`Failed to add course ${code} (${name}). A course with the same name already exists!`);
      return;
    }

    this.service.courses.push(course);

    try {
      if (hoursPreference === '3') {
        this.assignSingleCourse(course, 3);
      }
      // hoursPreference === '2 + 1'
      else {
        this.assignSingleCourse(course, 2);
        this.assignRemainingHour(course);
        // Display an informative message to user that the course is added.
      }
      alert(`Course ${code} has been added.`);
    } catch (err: any) {
      alert(err.message);
    }
  }

  unassignExistingCourse(courseToUnassign: Course): void {
    const subSchedule = this.subSchedules[this.service.yearToIndex(courseToUnassign.year)];
    for (let day of this.service.weekDays) {
      for (let hour of this.service.hoursInSchedule) {
        let currentElement = subSchedule.arr[this.service.dayToIndex(day)][this.service.hourToIndex(hour)];
        if (currentElement.courseCode === courseToUnassign.code) {
          const classroom = this.service.classrooms.find(cRoom => cRoom.id === currentElement.classroomName);
          // @ts-ignore
          classroom.makeAvailable(day, hour);
          currentElement.courseCode = ' ';
          currentElement.classroomName = ' ';
        }
      }
    }
  }

  // Method to manipulate the existing course via GUI.
  updateExistingCourse(courseToUpdate: Course, year: number, numberOfStudents: number, hoursPreference: string): void {
    // Algorithm:
    // 1) Unassign the courseToUpdate.
    // 2) Update the course information.
    // 3) Find a new day & hours & classroom combination with respect to updated informations.

    this.unassignExistingCourse(courseToUpdate);

    courseToUpdate.year = year;
    courseToUpdate.numberOfStudents = numberOfStudents;
    courseToUpdate.hoursPreference = hoursPreference;

    try {
      if (hoursPreference === '3') {
        this.assignSingleCourse(courseToUpdate, 3);
      }
      // 2 + 1
      else {
        this.assignSingleCourse(courseToUpdate, 2);
        this.assignRemainingHour(courseToUpdate);
        // Display an informative message to user that the course is updated.
        alert(`Course ${courseToUpdate.code} is updated.`);
      }
    } catch (err: any) {
      alert(err.message);
    }
  }

  addNewClassroom(id: string, capacity: number): void {
    if (id.length === 0) {
      alert('Please enter a valid id!');
      return;
    }
    if (capacity <= 0) {
      alert('Please enter a valid capacity!');
      return;
    }
    if (this.service.classrooms.find(c => c.id === id) !== undefined) {
      alert(`Failed to add classroom ${id}. A classroom with the same ID already exists!`);
      return;
    }
    this.service.classrooms.push(new Classroom(id, capacity, this.service));
    this.service.classrooms.sort((c1, c2) => c1.capacity - c2.capacity);
    alert(`Classroom ${id} with the capacity ${capacity} has been added.`);
  }

  updateExistingClassroom(classroomToUpdate: Classroom, newCapacity: number): void {
    // Algorithm:

    // 1) Courses that assigned to classroomToUpdate must be unassigned. Because if the user decreases the capacity of the
    // classroom, then courses that assigned to that classroom may not have sufficient capacity for these courses.

    // 2)

    const unassignedCourses: Course[] = [];
    for (let subSchedule of this.subSchedules) {
      for (let day of this.service.weekDays) {
        for (let hour of this.service.hoursInSchedule) {
          const currentElement = subSchedule.arr[this.service.dayToIndex(day)][this.service.hourToIndex(hour)];
          if (currentElement.classroomName === classroomToUpdate.id) {
            const course = this.service.courses.find(c => c.code === currentElement.courseCode);
            // @ts-ignore
            if (!unassignedCourses.includes(course)) {
              // @ts-ignore
              unassignedCourses.push(course);
            }
            // @ts-ignore
            this.unassignExistingCourse(course);
          }
        }
      }
    }
    // Update the capacity
    classroomToUpdate.capacity = newCapacity;
    alert(`Capacity of ${classroomToUpdate.id} is updated.`);

    // If any error occurs while assigning the unassigned courses, abort the schedule and display an error message.
    try {
      unassignedCourses.forEach(course => {
        if (course.hoursPreference === '3') {
          this.assignSingleCourse(course, 3);
        }
        // 2+1
        else {
          this.assignSingleCourse(course, 3);
          this.assignRemainingHour(course);
        }
      })
    } catch (err: any) {
      alert(`As you changed the capacity of the classroom ${classroomToUpdate.id}, there is no way to make a schedule. Please add new classrooms or increase the capacity of existing classrooms.`);
      this.abortSchedule();
    }
  }

  abortSchedule(): void {
    this.service.classrooms.forEach(classroom => classroom.makeAllDaysAndHoursAvailable());

    for (let subSchedule of this.subSchedules) {
      for (let day of this.service.weekDays) {
        for (let hour of this.service.hoursInSchedule) {
          subSchedule.arr[this.service.dayToIndex(day)][this.service.hourToIndex(hour)].courseCode = ' ';
          subSchedule.arr[this.service.dayToIndex(day)][this.service.hourToIndex(hour)].classroomName = ' ';
        }
      }
    }

  }


}
