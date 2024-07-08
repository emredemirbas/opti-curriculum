import {Component} from '@angular/core';
import {ScheduleService} from "../../services/schedule.service";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  public years: number[] = [1, 2, 3, 4];

  constructor(public service: ScheduleService) {

  }

}
