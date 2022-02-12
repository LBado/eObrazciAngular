import { formatDate } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ObrazciApiService } from 'src/app/obrazci-api.service';
import * as i18nIsoCountries from 'i18n-iso-countries';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-add-edit-obrazec',
  templateUrl: './add-edit-obrazec.component.html',
  styleUrls: ['./add-edit-obrazec.component.css'],
})
export class AddEditObrazecComponent implements OnInit {
  @Input() obrazecData: any;
  @ViewChild('pdfForm', { static: false }) pdfForm!: ElementRef;

  obrazciList: any[] = [];
  formSpolList: string[] = ['Moški', 'Ženska'];
  errorMessage: string = '';

  submitButtonIme: string = '';
  obrazecForm: any;

  countries: string[] = ['GB', 'DE', 'SI'];
  filteredCountries!: Observable<string[]>;

  constructor(
    private apiService: ObrazciApiService,
    private fbuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.obrazecForm = this.fbuilder.group({
      obrazecId: new FormControl({
        value: this.obrazecData.id,
        disabled: true,
      }),
      studentId: new FormControl({
        value: this.obrazecData.student.id,
        disabled: true,
      }),
      ime: new FormControl(this.obrazecData.student.ime, Validators.required),
      priimek: new FormControl(
        this.obrazecData.student.priimek,
        Validators.required
      ),
      datumRoj: new FormControl(
        formatDate(this.obrazecData.student.datumRojstva, 'yyyy-MM-dd', 'en'),
        Validators.required
      ),
      spol: new FormControl(this.obrazecData.student.spol, Validators.required),
      naslovId: new FormControl({
        value: this.obrazecData.student.naslov.id,
        disabled: true,
      }),
      ulica: new FormControl(
        this.obrazecData.student.naslov.ulica,
        Validators.required
      ),
      hisnaSt: new FormControl(
        this.obrazecData.student.naslov.hisnaStevilka,
        Validators.required
      ),
      postnaSt: new FormControl(
        this.obrazecData.student.naslov.postnaStevilka,
        Validators.required
      ),
      kraj: new FormControl(
        this.obrazecData.student.naslov.kraj,
        Validators.required
      ),
      drzava: new FormControl(
        this.obrazecData.student.naslov.drzava,
        Validators.required
      ),
      izpiti: this.fbuilder.array([]),
    });
    this.populateIzpiti(this.obrazecData.student.izpit);
    this.submitButtonIme = this.obrazecData.id === 0 ? 'Ustvari' : 'Uredi';
    console.log(this.obrazecData);
    i18nIsoCountries.registerLocale(
      require('i18n-iso-countries/langs/en.json')
    );
    // this.getCountries();
    this.onValueChanged();
  }

  onValueChanged() {
    this.filteredCountries = this.obrazecForm.controls.drzava.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value))
    );
    console.log(this.filteredCountries);
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.countries.filter((country: any) =>
      this._normalizeValue(country).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  getCountries() {
    this.countries = Object.keys(
      i18nIsoCountries.getNames('en', { select: 'official' })
    );
    console.log(this.countries);
  }

  get ime() {
    return this.obrazecForm.get('ime');
  }
  get priimek() {
    return this.obrazecForm.get('priimek');
  }
  get spol() {
    return this.obrazecForm.get('spol');
  }
  get datumRoj() {
    return this.obrazecForm.get('datumRoj');
  }
  get ulica() {
    return this.obrazecForm.get('ulica');
  }
  get hisnaSt() {
    return this.obrazecForm.get('hisnaSt');
  }
  get postnaSt() {
    return this.obrazecForm.get('postnaSt');
  }
  get kraj() {
    return this.obrazecForm.get('kraj');
  }
  get drzava() {
    return this.obrazecForm.get('drzava');
  }

  get izpiti() {
    //as izpitArray
    return this.obrazecForm.controls['izpiti'] as FormArray;
  }

  populateIzpiti(arr: any) {
    arr.forEach((izpit: any) => {
      this.izpiti.push(
        this.fbuilder.group({
          id: [{ value: izpit.id, disabled: true }],
          naziv: [izpit.naziv, Validators.required],
          datumOprIzpita: [
            formatDate(izpit.datumOprIzpita, 'yyyy-MM-dd', 'en'),
            Validators.required,
          ],
          ocena: [izpit.ocena, Validators.required],
        })
      );
    });
  }

  addIzpit() {
    const izpitForm = this.fbuilder.group({
      id: [{ value: '', disabled: true }],
      naziv: ['', Validators.required],
      datumOprIzpita: ['', Validators.required],
      ocena: ['', Validators.required],
    });

    this.izpiti.push(izpitForm);
  }

  showValidationMsg(formGroup: FormGroup) {
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];

        //nested controls npr izpiti
        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup>formGroup.controls[key];
          this.showValidationMsg(formGroupChild);
        }

        control.markAsTouched();
      }
    }
  }

  submitForm() {
    this.showValidationMsg(this.obrazecForm);

    if (this.obrazecForm.invalid) {
      console.log('form invalid');
      return;
    }
    console.log('form ok');
    if (this.obrazecData.id === 0) {
      //add
      console.log('adding');
      this.addObrazec();
    } else {
      //update
      console.log('updating');
      this.updateObrazec();
    }
  }

  removeLastIzpit() {
    this.izpiti.removeAt(this.izpiti.value.length - 1);
  }

  removeIzpit(index: number) {
    this.izpiti.removeAt(index);
  }

  addObrazec() {
    var newObrazec = {
      ime: this.ime.value,
      priimek: this.priimek.value,
      spol: this.spol.value,
      datumRojstva: this.datumRoj.value,
      naslov: {
        ulica: this.ulica.value,
        hisnaStevilka: this.hisnaSt.value,
        postnaStevilka: this.postnaSt.value,
        kraj: this.kraj.value,
        drzava: this.drzava.value,
      },
      izpit: this.izpiti.value.map((item: any) => {
        delete item.id;
        return { ...item, ocena: +item.ocena };
      }),
    };

    let failAlert = document.getElementById('obrazec-fail-alert');

    this.apiService.addObrazec(newObrazec).subscribe(
      (data) => {
        var closeModalBtn = document.getElementById('add-edit-modal-close');
        if (closeModalBtn) {
          closeModalBtn.click();
        }
        var showAddSuccess = document.getElementById('success-alert');
        if (showAddSuccess) {
          showAddSuccess.style.display = 'block';
        }

        setTimeout(function () {
          if (showAddSuccess) {
            showAddSuccess.style.display = 'none';
          }
        }, 3000);
      },
      (error) => {
        if (error.status === 500) {
          this.errorMessage =
            'Nekaj je šlo narobe pri shranjevanju! Popravite.';
          failAlert!.style.display = 'block';
          setTimeout(function () {
            failAlert!.style.display = 'none';
          }, 3000);
        }
      }
    );
  }

  updateObrazec() {
    for (let i = 0; i < this.izpiti.length; i++) {
      this.izpiti.controls[i].enable();
    }
    var updatedObrazec = {
      id: this.obrazecData.student.id,
      ime: this.ime.value,
      priimek: this.priimek.value,
      spol: this.spol.value,
      datumRojstva: this.datumRoj.value,
      naslov: {
        id: this.obrazecData.student.naslov.id,
        ulica: this.ulica.value,
        hisnaStevilka: this.hisnaSt.value,
        postnaStevilka: this.postnaSt.value,
        kraj: this.kraj.value,
        drzava: this.drzava.value,
      },
      izpit: this.izpiti.value.map((item: any) => {
        if (item.id === '') {
          delete item.id;
        }
        return { ...item, ocena: +item.ocena };
      }),
    };
    var obrazecId: number = this.obrazecData.id;
    let failAlert = document.getElementById('obrazec-fail-alert');

    console.log(this.izpiti.controls[0].value.id);
    console.log(this.izpiti.value);
    console.log(updatedObrazec);
    console.log(obrazecId);

    this.apiService.updateObrazec(obrazecId, updatedObrazec).subscribe(
      (response) => {
        var closeModalBtn = document.getElementById('add-edit-modal-close');
        if (closeModalBtn) {
          closeModalBtn.click();
        }
        var showUpdateSuccess = document.getElementById('success-alert');
        if (showUpdateSuccess) {
          showUpdateSuccess.style.display = 'block';
        }
        setTimeout(function () {
          if (showUpdateSuccess) {
            showUpdateSuccess.style.display = 'none';
          }
        }, 3000);
      },
      (error) => {
        if (error.status === 500) {
          this.errorMessage =
            'Nekaj je šlo narobe pri shranjevanju! Popravite.';
          failAlert!.style.display = 'block';
          setTimeout(function () {
            failAlert!.style.display = 'none';
          }, 3000);
        }
      }
    );
  }

  downloadAsPdf() {
    const doc = new jsPDF();

    doc.text('Izpis: ', 10, 10);
    doc.line(10, 12, 160, 12);

    doc.text('Ime: ', 10, 20);
    doc.text(this.ime.value, 50, 20);

    doc.text('Priimek: ', 10, 28);
    doc.text(this.priimek.value, 50, 28);

    doc.text('Spol: ', 10, 36);
    doc.text(this.spol.value, 50, 36);

    doc.text('Datum rojstva: ', 10, 44);
    doc.text(this.datumRoj.value, 50, 44);

    //--
    doc.text('Ulica: ', 90, 20);
    doc.text(this.ulica.value, 140, 20);

    doc.text('Hišna številka: ', 90, 28);
    doc.text(this.hisnaSt.value, 140, 28);

    doc.text('Poštna številka: ', 90, 36);
    doc.text(String(this.postnaSt.value), 140, 36);

    doc.text('Kraj: ', 90, 44);
    doc.text(`${this.kraj.value}`, 140, 44);

    doc.text('Država: ', 90, 52);
    doc.text(this.drzava.value, 140, 52);

    doc.text('Izpiti: ', 10, 60);
    doc.line(10, 62, 160, 62);
    // doc.text(this.ime.value, 10, 10);

    doc.text("Naziv", 10, 70);
    doc.text("Datum opr. izpita", 70, 70);
    doc.text("Ocena", 120, 70);

    this.izpiti.value.forEach((izpit: any, index: any) => {
      doc.text(izpit.naziv, 10, 80+8*index);
      doc.text(izpit.datumOprIzpita, 70, 80+8*index);
      doc.text(String(izpit.ocena), 120, 80+8*index);
    });

    doc.save('htmlToPdf.pdf');
  }
}
