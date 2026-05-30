import { afterNextRender, Component, computed, effect, EffectRef, inject, Injector, signal } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import { toObservable, toSignal, outputToObservable, outputFromObservable } from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  #courses = signal<Course[]>([]);
  courseService = inject(CoursesService);

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter((course) => course.category === 'ADVANCED');
  });

  constructor() {
    effect(() => {
      console.log('this.beginnerCourses(): ', this.beginnerCourses());
      console.log('this.advancedCourses(): ', this.advancedCourses());
    });
    this.loadCourses().then(() => {
      console.log('All courses loaded: ', this.#courses());
    });
  }
  async loadCourses() {
    try {
      const courses = await this.courseService.loadAllCourses();
      this.#courses.set(courses);
    } catch (err) {
      alert('Error loading courses!');
      console.log('err: ', err);
    }
  }
}
