import { Component, Input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

  @Input() predefinedRates!: {
    berthing1: {
      [unit: string]: number;
    };
  };
  @Input() dateRangeMessage: string = '';

  @Input() leasingType: string = '';
  costForm: FormGroup;

  formTotals = {
    berthing1: 0,
    utilities: 0,
    docs: 0,
    other: 0,
    discount: 0,
    subTotal1: 0,
    vat: 0,
    securityDeposit: 0,
    subTotal2: 0,
    grandTotal: 0
  };

  modeOfPayments = ['Pay By Link', 'POS', 'Cheque'];
  columns: string[] = ['description', 'unit', 'rate', 'total'];

  costItems: CostItem[] = [
    {
      label: 'Berthing Fees',
      unitControl: 'berthing1Unit',
      rateControl: 'berthing1Rate',
      totalKey: 'berthing1',
      unitOptions: ['Per Feet', 'Per Period', 'Per Day', 'Per Feet Per Month', 'Per Feet Per Year']
    },
    {
      label: 'Utilities-Power Supply',
      unitControl: 'utilitiesPowerOption',
      rateControl: 'utilitiesPower',
      totalKey: 'utilities',
      unitOptions: ['Per Month']
    },
    {
      label: 'Utilities-Water Supply',
      unitControl: 'utilitiesWaterOption',
      rateControl: 'utilitiesWater',
      totalKey: 'utilities',
      unitOptions: ['Per Month']
    },
    {
      label: 'Attestation Charges',
      unitControl: 'otherUnit',
      rateControl: 'otherRate',
      totalKey: 'other',
      unitOptions: ['AED']
    },
    {
      label: 'Discount',
      unitControl: 'discountUnit',
      rateControl: 'discountRate',
      totalKey: 'discount',
      unitOptions: ['%', 'AED']
    }
  ];

  constructor(private fb: FormBuilder) {
    this.costForm = this.fb.group({
      modeOfPayment: ['Pay By Link', Validators.required],
      agreedIncrease: ['5', [Validators.required, Validators.min(0), Validators.max(100)]],

      // Table-related form controls
      berthing1Unit: ['Per Feet'],
      berthing1Rate: [20],
      utilitiesUnit: ['Per Month'],
      utilitiesPower: [20],
      utilitiesPowerOption: ['Per Month'],
      utilitiesWater: [10],
      utilitiesWaterOption: ['Per Month'],

      otherUnit: ['AED'],
      otherRate: [100],
      discountUnit: ['% | AED'],
      discountRate: [],

      // VAT & Deposit
      vatUnit: ['%'],
      vatRate: [5],
      docsUnit: ['Fixed'],
      docsRate: [0.76],
      securityDepositUnit: ['Fixed'],
      securityDepositRate: [0]  //Security Deposit @ 3 months of Rental Fee
    });

    this.costForm.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  ngOnInit() {
    // if (this.contractType) {
    //   this.costForm.get('berthing1Unit')?.setValue(this.contractType);
    // }

    this.setupBerthingRateAutoUpdate();

    this.costForm.get('berthing1Unit')?.valueChanges.subscribe((selectedUnit) => {
      this.updateBerthingRateUnit(selectedUnit);
    });
    this.calculateTotals();
  }

  ngOnChanges() {
    const unit = this.costForm.get('berthing1Unit')?.value;
    if (unit) {
      this.updateBerthingRateUnit(unit);
    }
  }

  getTotal(key: keyof typeof this.formTotals): number {
    return this.formTotals[key] || 0;
  }

  calculateTotals() {
    let subTotal1 = 0;
    let subTotal2 = 0;

    this.costItems.forEach((item) => {
      const rate = parseFloat(this.costForm.get(item.rateControl)?.value || '0');

      if (item.totalKey === 'discount') {
        const discountUnit = this.costForm.get('discountUnit')?.value; // Check selected unit
        let discountValue = 0;

        if (discountUnit === '%') {
          discountValue = (subTotal1 * rate) / 100; // Calculate % discount on subtotal
        } else {
          discountValue = rate; // AED value discount
        }

        this.formTotals[item.totalKey] = discountValue;
        subTotal1 -= discountValue;
      } else {
        this.formTotals[item.totalKey] = rate;
        subTotal1 += rate;
      }
    });

    this.formTotals.subTotal1 = subTotal1;

    const vatRate = parseFloat(this.costForm.get('vatRate')?.value || '0');
    const vatAmount = (subTotal1 * vatRate) / 100;
    this.formTotals.vat = vatAmount;

    let documentRate = parseFloat(this.costForm.get('docsRate')?.value || '0');
    const baseAmount = (documentRate / 100) * subTotal1;
    const documentFee = 1 + baseAmount;
    const vat = (5 / 100) * baseAmount; // Only on the 0.76% portion, not on the extra 1 AED
    documentRate = subTotal1 + documentFee + vat;
    this.formTotals.docs = parseFloat(documentRate.toFixed(2));
    // this.costForm.get('docsRate')?.setValue(documentRate, { emitEvent: false });

    const berthingRate = parseFloat(this.costForm.get('berthing1Rate')?.value || '0');
    const secDep = (berthingRate * 3) / 12;  // 3 months out of 12
    this.formTotals.securityDeposit = secDep;

    this.costForm.get('securityDepositRate')?.setValue(secDep, { emitEvent: false });
    subTotal2 = this.formTotals.subTotal1 + secDep + vatAmount;
    this.formTotals.subTotal2 = subTotal2;

    this.formTotals.grandTotal = documentRate + subTotal2;
  }

  updateBerthingRateUnit(unit: string) {
    let rateValue = 0;

    switch (unit) {
      case 'Per Feet':
        rateValue = 20;
        break;
      case 'Per Period':
        rateValue = 100;
        break;
      case 'Per Day':
        rateValue = 15;
        break;
      case 'Per Feet Per Month':
        rateValue = 200;
        break;
      // case 'Per Year':
      //   rateValue = 2000;
      //   break;
      default:
        rateValue = 2000;
    }
    this.costForm.get('berthing1Rate')?.setValue(rateValue);
    // const calculatedRate = rateValue * (this.boatLength || 1);
    //this.costForm.get('berthing1Rate')?.setValue(calculatedRate);
  }

  setupBerthingRateAutoUpdate() {
    const unitControl = this.costForm.get('berthing1Unit');
    const rateControl = this.costForm.get('berthing1Rate');

    if (unitControl && rateControl && this.predefinedRates?.berthing1) {
      unitControl.valueChanges.subscribe((selectedUnit: string) => {
        const predefinedValue = this.predefinedRates.berthing1[selectedUnit];
        if (predefinedValue !== undefined) {
          rateControl.setValue(predefinedValue);
          this.calculateTotals();
        }
      });
    }
  }

  disableScroll(event: WheelEvent): void {
    (event.target as HTMLInputElement).blur();
  }

  onDropdownOpen(isOpen: boolean) {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }


  OnDateMessage1(message: string) {
    this.dateRangeMessage = message;
  }

}

interface CostItem {
  label: string;
  unitControl: string;
  rateControl: string;
  totalKey: keyof PaymentComponent['formTotals'];
  unitOptions: string[];
}