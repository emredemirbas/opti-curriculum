import {Instructor} from "./instructor";
import {ScheduleService} from "../services/schedule.service";

export class Course {
  code: string;
  name: string;
  year: number;
  credit: number;
  compulsoryOrElective: string;
  departmentOrService: string;
  numberOfStudents: number;
  instructor: Instructor;
  hoursPreference: string;

  constructor(code: string, name: string, year: number, credit: number, compulsoryOrElective: string, departmentOrService: string, numberOfStudents: number, instructor: Instructor, hoursPreference: string, private service: ScheduleService) {
    this.code = code;
    this.name = name;
    this.year = year;
    this.credit = credit;
    this.compulsoryOrElective = compulsoryOrElective;
    this.departmentOrService = departmentOrService;
    this.numberOfStudents = numberOfStudents;
    this.instructor = instructor;
    this.hoursPreference = hoursPreference;
  }

  isService(): boolean {
    return this.departmentOrService === 'S';
  }
}
