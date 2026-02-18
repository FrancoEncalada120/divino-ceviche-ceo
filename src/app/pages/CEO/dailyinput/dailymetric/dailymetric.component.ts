import { Component } from '@angular/core';
import { DailymetricListComponent } from '../dailymetric-list/dailymetric-list.component';
import { DailymetriUpdInsComponent } from '../dailymetri-upd-ins/dailymetri-upd-ins.component';

@Component({
  selector: 'app-dailymetric',
  imports: [DailymetricListComponent, DailymetriUpdInsComponent],
  templateUrl: './dailymetric.component.html',
  styleUrl: './dailymetric.component.scss',
})
export class DailymetricComponent {}
