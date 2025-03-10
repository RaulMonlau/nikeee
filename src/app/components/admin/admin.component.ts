import { Component, OnInit } from '@angular/core';
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

  // El validador evita nombres duplicados (excetuando el producto que se está editando)
  noDuplicateNameValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value || !this.adminForm) return null;
    const inputNameLower = control.value.toLowerCase();
    // Si se está editando, el campo reference está deshabilitado y se toma su valor mediante getRawValue
    const currentRef = this.adminForm.getRawValue().reference;
    const duplicate = this.productService.products.some(p =>
      p.name.toLowerCase() === inputNameLower && p.reference !== currentRef
    );
    return duplicate ? { duplicateName: true } : null;
  }

  // Al perder el foco en reference, se busca el producto. Si existe, se habilita el modo edición y se deshabilita el campo reference
  onReferenceBlur(): void {
    const ref = this.adminForm.get('reference')?.value;
    const product = this.productService.products.find(p => p.reference === ref);
    if (product) {
      this.isEditing = true;
      // Se deshabilita reference para no permitir su modificación
      this.adminForm.get('reference')?.disable();
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
      // Si no se encuentra, nos aseguramos de que el campo reference esté habilitado
      this.isEditing = false;
      this.adminForm.get('reference')?.enable();
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
    // Se obtiene el valor real, incluyendo el campo reference aunque esté deshabilitado
    const formValue = this.adminForm.getRawValue();
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }
    this.productService.addOrUpdateProduct(formValue);
    this.adminForm.reset();
    // Rehabilitamos el campo reference para la próxima inserción
    this.adminForm.get('reference')?.enable();
    this.previewImage = null;
    this.isEditing = false;
  }
}