import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesAndClassroomsComponent } from './courses-and-classrooms.component';

describe('CoursesAndClassroomsComponent', () => {
  let component: CoursesAndClassroomsComponent;
  let fixture: ComponentFixture<CoursesAndClassroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoursesAndClassroomsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursesAndClassroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
