import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-audit-info',
  imports: [CommonModule, CardModule, InputTextModule, ButtonModule],
  templateUrl: './audit-info.component.html',
  styleUrl: './audit-info.component.scss',
})
export class AuditInfoComponent {
  @Input() createdAt?: Date | string;
  @Input() createdBy?: string;
  @Input() modifiedAt?: Date | string;
  @Input() modifiedBy?: string;

  expanded = false;

  toggle(): void {
    this.expanded = !this.expanded;
  }
}
