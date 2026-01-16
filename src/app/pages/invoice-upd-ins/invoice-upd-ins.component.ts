import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, Invoice } from '../../core/models/dashboard.models';
import { LocationService } from '../../core/services/location.service';
import { Location } from '../../core/models/location.model';
import { CategoryService } from '../../core/services/categoria.service';
import { AuditInfoComponent } from '../../shared/components/audit-info/audit-info.component';

@Component({
  selector: 'app-invoice-upd-ins',
  imports: [CommonModule, FormsModule, AuditInfoComponent],
  templateUrl: './invoice-upd-ins.component.html',
  styleUrl: './invoice-upd-ins.component.scss',
})
export class InvoiceUpdInsComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Invoice>();

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() invoice: Invoice | null = null;
  @Input() categoryType: number | null = null;

  locations: Location[] = [];
  categories: Category[] = [];

  constructor(
    private locationService: LocationService,
    private categoriaService: CategoryService
  ) {}

  ngOnInit(): void {
    this.load();

    if (this.mode === 'edit' && this.invoice) {
      // Copia defensiva (muy importante)
      this.formData = { ...this.invoice };
    }
  }

  load(): void {
    this.locationService.getAll().subscribe({
      next: (data) => {
        console.log('[Locations] GET ok, items:', data?.length, data);
        this.locations = data ?? [];
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => console.log('[Locations] GET complete'),
    });

    this.categoriaService.getAll().subscribe({
      next: (data) => {
        console.log('[Categories] GET ok, items:', data?.length, data);
        this.categories = data ?? [];

        this.categories = data.filter(
          (x) => Number(x.invoice_type_id) === this.categoryType
        );
      },
      error: (err) => {
        console.error('[Categories] GET error:', err);
      },
    });
  }

  formData: Partial<Invoice> = {
    invoice_id: 0,
    invoice_date: '',
    invoice_vendor_description: '',
    category_id: 0,
    invoice_amount: '0.00',
    invoice_notes: null,
    location_id: 0,
    invoice_create_user: '',
    created_at: '',
    invoice_update_user: '',
    update_at: '',
  };

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit(this.formData as Invoice);
  }
}
