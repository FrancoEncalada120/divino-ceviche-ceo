import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-audit-info',
  imports: [CommonModule, CardModule, InputTextModule],
  templateUrl: './audit-info.component.html',
  styleUrl: './audit-info.component.scss',
})
export class AuditInfoComponent {
  @Input() createdAt?: Date | string;
  @Input() createdBy?: string;
  @Input() modifiedAt?: Date | string;
  @Input() modifiedBy?: string;
}
