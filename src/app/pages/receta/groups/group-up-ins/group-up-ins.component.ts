import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Grupo, GrupoDetalle } from '../../../../core/models/grupos.model';
import { Insumo } from '../../../../core/models/insumo.model';
import { InsumoService } from '../../../../core/services/insumo.service';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.models';

type ModalMode = 'create' | 'edit';
@Component({
  selector: 'app-group-up-ins',
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    TableModule
  ],
  templateUrl: './group-up-ins.component.html',
  styleUrl: './group-up-ins.component.scss',
})
export class GroupUpInsComponent implements OnChanges {
  @Input() mode: ModalMode = 'create';
  @Input() conversion: Grupo | null = null;

  @Input() insumosOptions: { label: string; value: number; grupo?: string }[] =
    [];
  @Input() unidadesOptions: { label: string; value: number }[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  user: User | null = null;

  formData: Partial<Grupo> = {
    grupo_id: 0,
    grupo_nombre: '',
    created_at: '',
    created_by: 0,
    detalles: []
  };

  submitted = false;

  constructor(
    private service: InsumoService,
    private userService: UserService,
  ) {

  }

  ngOnInit(): void {

    this.user = this.userService.getUser();

    this.service.getInsumoAll().subscribe({
      next: (data) => {
        this.cInsumo = data.insumos ?? [];
      },
      error: (err) => {
        console.error('[cInsumo] GET error:', err);

      },
      complete: () => { }
    });


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversion'] || changes['mode']) {
      this.loadForm();
    }
  }

  private loadForm(): void {

    if (this.mode === 'edit' && this.conversion) {
      // Copia defensiva (muy importante)
      this.formData = { ...this.conversion };

      for (const item of this.conversion.detalles) {

        this.items.push({
          grupo_default: item.grupo_default,
          grupo_id: item.grupo_id,
          grupo_ultima_comrpa: item.grupo_ultima_comrpa,
          insumo_id: item.insumo_id,
          insumo: item.insumo
        });


      }


    } else {
      this.addRow();
    }

    this.submitted = false;
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submitted = true;


    this.formData.detalles = this.items.map(item => ({
      grupo_default: item.grupo_default,
      grupo_id: item.grupo_id,
      grupo_ultima_comrpa: item.grupo_ultima_comrpa,
      insumo_id: item.insumo_id,
      insumo: item.insumo
    }));

    this.formData.created_by = this.user?.user_id;

    this.submit.emit(this.formData as Grupo);
  }

  cInsumo: Insumo[] = [];
  items: GrupoDetalle[] = [];

  addRow() {

    this.items.push({
      grupo_default: 0,
      grupo_id: 0,
      grupo_ultima_comrpa: 0,
      insumo_id: 0,
      insumo: null
    });
  }

  removeRow(index: number) {
    this.items.splice(index, 1);
  }

  onInsumoChange(insumoId: number, row: any) {

    // Verificar si ya existe ese insumo en otra fila
    const existe = this.items.some(item =>
      item.insumo_id === insumoId && item !== row
    );

    if (existe) {
      alert('Este insumo ya fue agregado.');
      row.insumo_id = null;
      return;
    }

  }

  // get f() {
  //   return this.form.controls;
  // }
}
