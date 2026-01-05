import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [MenuComponent, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {}
