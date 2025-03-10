import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdminComponent implements OnInit {
  @Input() products: any[] = [];
  // Ya no necesitamos emitir el productEvent, ya que el servicio se encarga de ello
  adminForm!: FormGroup;
  previewImage: string | null = null;
  isEditing: boolean = false;

  constructor(private fb: FormBuilder, private productService: ProductService) { }

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      reference: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, this.noDuplicateNameValidator.bind(this)]],
      price: [0, [Validators.required, Validators.min(0), Validators.max(10000)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      productType: ['', Validators.required],
      offer: [false],
      productImage: [null, Validators.required],
      productImageData: ['']
    });
  }

  noDuplicateNameValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) return null;
    const duplicate = this.products.some(p => p.name.toLowerCase() === control.value.toLowerCase());
    return duplicate ? { duplicateName: true } : null;
  }

  onReferenceBlur(): void {
    const ref = this.adminForm.get('reference')?.value;
    const product = this.productService.products.find(p => p.reference === ref);
    if (product) {
      this.isEditing = true;
      this.adminForm.patchValue({
        name: product.name,
        price: product.price,
        description: product.description,
        productType: product.productType,
        offer: product.offer,
        productImageData: product.productImageData || ''
      });
      this.previewImage = product.productImageData || null;
    } else {
      this.isEditing = false;
    }
  }

  onProductImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.previewImage = dataUrl;
        this.adminForm.patchValue({ productImage: file, productImageData: dataUrl });
      };
      reader.readAsDataURL(file);
    } else {
      this.previewImage = null;
    }
  }

  onSubmit(): void {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }
    // Actualiza el estado global a través del servicio
    this.productService.addOrUpdateProduct(this.adminForm.value);
    this.adminForm.reset();
    this.previewImage = null;
    this.isEditing = false;
  }
}