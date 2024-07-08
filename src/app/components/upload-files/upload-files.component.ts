import {Component} from '@angular/core';
import {ScheduleService} from "../../services/schedule.service";
import {Classroom} from "../../models/classroom";
import {Instructor} from "../../models/instructor";
import {Course} from "../../models/course";

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css'
})
export class UploadFilesComponent {


  constructor(public service: ScheduleService) {

  }

  readCourses(): void {
    const coursesFileInput = document.getElementById('coursesFile');
    // @ts-ignore
    const file = coursesFileInput.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        // @ts-ignore
        this.service.coursesData = e.target.result;
      }
      fileReader.readAsText(file);
    } else {
      alert('Please make sure to upload courses.csv file.');
    }
  }

  readClassrooms(): void {
    const classroomFileInput = document.getElementById('classroomFile');
    // @ts-ignore
    const file = classroomFileInput.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        // @ts-ignore
        this.service.classroomsData = e.target.result;
      }
      fileReader.readAsText(file);
    } else {
      alert('Please make sure to upload classroom.csv file.');
    }
  }

  readServiceCourses(): void {
    const serviceFileInput = document.getElementById('serviceFile');
    // @ts-ignore
    const file = serviceFileInput.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        // @ts-ignore
        this.service.serviceCoursesData = e.target.result;
      }
      fileReader.readAsText(file);
    } else {
      alert('Please make sure to upload service.csv file.');
    }
  }

  readBusyHours(): void {
    const busyFileInput = document.getElementById('busyFile');
    // @ts-ignore
    const file = busyFileInput.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        // @ts-ignore
        this.service.busyHoursData = e.target.result;
      }
      fileReader.readAsText(file);
    } else {
      alert('Please make sure to upload busy.csv file.')
    }
  }

  readAllFiles() {
    this.readCourses();
    this.readServiceCourses();
    this.readBusyHours();
    this.readClassrooms();
  }

  parseClassrooms(): void {
    if (this.service.classroomsData === '') {
      alert('Please make sure to upload classroom.csv file.');
      return;
    }
    const lines = this.service.classroomsData.split('\n');
    lines.forEach(line => {
      line = line.trim();
      if (line === '') {
        return;
      }
      const [id, capacity] = line.split(';');
      this.service.classrooms.push(new Classroom(id, parseInt(capacity), this.service));
    });
    this.service.classrooms.sort((c1, c2) => c1.capacity - c2.capacity);
  }

  // TODO: biraz mantığını değiştirdim, düzgün çalışıyor mu test et.
  parseCourses(): void {
    if (this.service.coursesData === '') {
      alert('Please make sure to upload courses file.');
      return;
    }
    const lines = this.service.coursesData.split('\n');
    lines.forEach(line => {
      line = line.trim();
      if (line === '') {
        return;
      }
      const [code, name, year, credit, c_or_e, d_or_s, numberOfStudents, instructorName, hoursPreference] = line.split(',');
      let instructor = this.service.instructors.find(i => i.name === name);
      // If the instructor does not exist in the instructors array, create new Instructor instance.
      if (instructor === undefined) {
        instructor = new Instructor(instructorName, this.service);
        this.service.instructors.push(instructor);
      }
      const course = new Course(code, name, parseInt(year), parseInt(credit), c_or_e, d_or_s, parseInt(numberOfStudents), instructor, hoursPreference, this.service);
      this.service.courses.push(course);
    });
  }

  parseBusyHours(): void {
    if (this.service.busyHoursData === '') {
      alert('Please make sure to upload busy hours file.');
      return;
    }
    const lines = this.service.busyHoursData.split('\n');
    lines.forEach(line => {
      line = line.trim();
      if (line === '') {
        return;
      }
      const [instructorName, day] = line.split(',')
      const hoursString = line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'));
      const [...hours] = hoursString.split(',');
      let instructor = this.service.instructors.find(instructor => instructor.name === instructorName);
      // If specified instructor is not found in the instructors array, create a new Instructor instance & add that into the instructors array.
      if (instructor === undefined) {
        const newInstructor = new Instructor(instructorName, this.service);
        this.service.instructors.push(newInstructor);
        instructor = newInstructor;
      }
      for (let hour of hours) {
        instructor.addBusyHour(day, hour);
      }
    });
  }

  processDatas(): void {
    this.service.classrooms = [];
    this.service.courses = [];
    this.service.instructors = [];
    this.parseClassrooms();
    this.parseCourses();
    this.parseBusyHours();
  }


}
