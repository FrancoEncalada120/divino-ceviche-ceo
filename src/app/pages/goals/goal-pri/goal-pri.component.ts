import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Goal } from '../../../core/models/goal.models';
import { GoalService } from '../../../core/services/goal.service';
import { GoalListComponent } from '../goal-list/goal-list.component';
import { GoalUpdInsComponent } from '../goal-upd-ins/goal-upd-ins.component';


@Component({
  selector: 'app-goal-pri',
  imports: [NgIf, GoalListComponent, GoalUpdInsComponent],
  templateUrl: './goal-pri.component.html',
  styleUrl: './goal-pri.component.scss'
})
export class GoalPriComponent {

  goals: Goal[] = [];
  loading = false;

  constructor(private service: GoalService
    //, private toast: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('[Locations] ngOnInit');
    this.load();
  }

  load(): void {
    console.log('[Locations] load() start');
    this.loading = true;

    this.service.getAll(this.currentMonth + 1, this.currentYear).subscribe({
      next: (data) => {
        console.log('[Locations] GET ok, items:', data?.length, data);
        this.goals = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
        this.loading = false;
      },
      complete: () => console.log('[Locations] GET complete'),
    });


  }

  // ===========================================
  // Abrel el popup
  // ===========================================

  showAddLocationModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedLocation: Goal | null = null;

  openCreate() {
    this.modalMode = 'create';
    this.selectedLocation = null;
    this.showAddLocationModal = true;
  }

  openEdit(goal: Goal) {
    this.modalMode = 'edit';
    this.selectedLocation = goal;
    this.showAddLocationModal = true;
  }

  delete(goal: Goal) {
    this.selectedLocation = goal;
    this.showAddLocationModal = false;

    this.service.delete(goal).subscribe({
      next: (deletedGoal) => {
        this.goals = this.goals.filter(
          g => g.goal_id !== deletedGoal.goal_id
        );
      },
      error: err => {
        console.error(err.message);
      }
    });


  }

  closeModal() {
    this.showAddLocationModal = false;
  }

  handleSubmit(goal: Goal) {
    const isCreate = this.modalMode === 'create';

    const action$ = isCreate
      ? this.service.create(goal)
      : this.service.update(goal);

    action$.subscribe({
      next: (savedLocation) => {
        console.log('[Goals] savedLocation:', savedLocation);

        if (isCreate) {
          // ➕ CREATE → agregar al array
          this.goals.push(savedLocation);
        } else {
          // ✏️ UPDATE → reemplazar en el array
          const index = this.goals.findIndex(
            l => l.location_id === savedLocation.location_id
          );

          if (index !== -1) {
            this.goals[index] = savedLocation;
          }
        }

        this.closeModal();
      },
      error: (err) => {
        console.error('[Locations] save error:', err);
      }
    });
  }

  // ===========================================
  // INICIO : Manejo de meses
  // ===========================================

  currentMonth = new Date().getMonth(); // 0-11
  currentYear = new Date().getFullYear();

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  get currentMonthName(): string {
    return this.months[this.currentMonth];
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }

    this.load();

  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }

    this.load();

  }


  // ===========================================
  // FIN : Manejo de meses
  // ===========================================


}
