import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ObrazciApiService, Obrazec } from '../obrazci-api.service';

@Component({
  selector: 'app-obrazci',
  templateUrl: './obrazci.component.html',
  styleUrls: ['./obrazci.component.css'],
})
export class ObrazciComponent implements OnInit, AfterViewInit {
  obrazciList: any[] = [];
  modalTitle: string = '';
  activateAddEditObrazecComponent: boolean = false;
  obrazec: any;
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort!: MatSort;
  successAlertMsg: string = '';
  countries: any = [
    { iso: 'SI', name: 'Slovenia' },
    { iso: 'GB', name: 'United Kingdom' },
    { iso: 'DE', name: 'Germany' },
  ];

  displayedColumns: string[] = [
    'id',
    'ime',
    'priimek',
    'letoRoj',
    'kraj',
    'edit',
    'delete',
  ];

  constructor(
    private apiService: ObrazciApiService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.fetchObrazci();
    this.dataSource.sortingDataAccessor = (obrazec: any, property) => {
      switch (property) {
        case 'ime':
          return obrazec.student.ime;
        case 'priimek':
          return obrazec.student.priimek;
        case 'letoRoj':
          return obrazec.student.datumRojstva;
        case 'kraj':
          return obrazec.student.naslov.kraj;
        default:
          return obrazec[property];
      }
    };
    this.dataSource.filterPredicate = (data: any, filter) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
  }

  fetchObrazci() {
    this.apiService.getObrazciList().subscribe((obrazciList: any[]) => {
      this.obrazciList = obrazciList;

      this.dataSource.data = this.obrazciList;

      console.log(this.obrazciList);
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  filterTable(event: any) {
    const dataTable = this.dataSource;
    dataTable.filter = event.target.value.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  closeModal() {
    this.activateAddEditObrazecComponent = false;
    this.fetchObrazci();
  }

  addObrazec() {
    this.obrazec = {
      id: 0,
      student: {
        id: 0,
        ime: '',
        priimek: '',
        spol: '',
        datumRojstva: new Date(0),
        naslov: {
          id: 0,
          ulica: '',
          hisnaStevilka: '',
          postnaStevilka: null,
          kraj: '',
          drzava: '',
        },
        izpit: [
          {
            id: 0,
            naziv: '',
            datumOprIzpita: new Date(0),
            ocena: null,
          },
        ],
      },
    };
    this.modalTitle = 'Ustvari nov obrazec';
    this.successAlertMsg = 'Obrazec uspešno ustvarjen!';
    this.activateAddEditObrazecComponent = true;
  }

  editObrazec(selectedObrazec: any) {
    this.countries.forEach((country: any) => {
      if (country.name === selectedObrazec.student.naslov.drzava) {
        selectedObrazec.student.naslov.drzava = country.iso;
      }
    });
    console.log(selectedObrazec);
    this.obrazec = selectedObrazec;
    console.log(this.obrazec);
    this.modalTitle = 'Uredi obrazec';
    this.successAlertMsg = 'Obrazec uspešno urejen!';
    this.activateAddEditObrazecComponent = true;
  }

  deleteObrazec(selectedObrazec: any) {
    if (
      confirm(
        `Ste prepričani da želite izbrisati obrazec id: ${selectedObrazec.id}`
      )
    ) {
      this.apiService.deleteObrazec(selectedObrazec.id).subscribe((res) => {
        var closeModalBtn = document.getElementById('add-edit-modal-close');
        if (closeModalBtn) {
          closeModalBtn.click();
        }

        var showDeleteSuccess = document.getElementById('success-alert');
        if (showDeleteSuccess) {
          this.successAlertMsg = 'Obrazec uspešno zbrisan!';
          showDeleteSuccess.style.display = 'block';
        }

        setTimeout(function () {
          if (showDeleteSuccess) {
            showDeleteSuccess.style.display = 'none';
          }
        }, 3000);

        this.fetchObrazci();
      });
    }
  }
}
