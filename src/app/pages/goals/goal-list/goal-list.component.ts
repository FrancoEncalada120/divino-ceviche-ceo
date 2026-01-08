import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Goal } from '../../../core/models/goal.models';

@Component({
  selector: 'app-goal-list',
  imports: [NgFor, NgIf],
  templateUrl: './goal-list.component.html',
  styleUrl: './goal-list.component.scss'
})
export class GoalListComponent {

  @Input()
  goals: Goal[] = [];

  @Output() edit = new EventEmitter<Goal>();
  @Output() delete = new EventEmitter<Goal>();

  onEdit(goal: Goal) {
    this.edit.emit(goal);
  }

  onDelete(goal: Goal) {
    this.delete.emit(goal);
  }

}
