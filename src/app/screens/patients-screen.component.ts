import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { camps as seedCamps } from '../data/camps';
import type { CampOption } from '../data/campPicker';
import { getPatientKey, type Patient, type PatientStatus } from '../data/patients';
import { DEFAULT_ZONE, type Zone } from '../config/zones';
import {
  DEFAULT_TIME_RANGE_FILTER,
  getTimeRangeChipLabel,
  isDateWithinTimeRange,
  type TimeRangeFilter,
} from '../data/timeRangeFilter';
import { PhoneVerificationService } from '../services/phone-verification.service';
import { AppHeaderBarComponent } from '../components/molecules/app-header-bar.component';
import { FilterChipComponent } from '../components/molecules/filter-chip.component';
import { ListHeroHeaderComponent } from '../components/molecules/list-hero-header.component';
import { PatientCardComponent } from '../components/molecules/patient-card.component';
import { SearchFieldComponent } from '../components/molecules/search-field.component';
import { StatusBarComponent } from '../components/molecules/status-bar.component';
import { StatusFilterChipComponent } from '../components/molecules/status-filter-chip.component';
import { TimeRangeFilterBottomSheetComponent } from '../components/molecules/time-range-filter-bottom-sheet.component';
import { User2FillIconComponent } from '../components/atoms/user2-fill-icon.component';
import { ListScreenScrollLayoutComponent } from '../components/templates/list-screen-scroll-layout.component';
const ellipseIcon = 'assets/icons/camps-header-ellipse.svg';
const calendarIcon = 'assets/icons/calendar-line-hero.svg';
const tentLineHeroIcon = 'assets/icons/tent-line-hero.svg';
const addIcon = 'assets/icons/add-line-white.svg';

const PATIENT_STATUS_FILTERS: PatientStatus[] = ['Screened', 'Referred', 'Treated', 'Visited'];

@Component({
  selector: 'app-patients-screen',
  standalone: true,
  imports: [
    RouterLink,
    ListScreenScrollLayoutComponent,
    StatusBarComponent,
    AppHeaderBarComponent,
    ListHeroHeaderComponent,
    User2FillIconComponent,
    SearchFieldComponent,
    FilterChipComponent,
    StatusFilterChipComponent,
    PatientCardComponent,
    TimeRangeFilterBottomSheetComponent,
  ],
  templateUrl: './patients-screen.component.html',
  styleUrl: '../screens/CampsScreen.module.css',
})
export class PatientsScreenComponent {
  private readonly phoneVerification = inject(PhoneVerificationService);

  readonly selectedZone = signal<Zone>(DEFAULT_ZONE);
  readonly searchQuery = signal('');
  readonly statusFilters = signal<Record<PatientStatus, boolean>>({
    Screened: false,
    Referred: false,
    Treated: false,
    Visited: false,
  });
  readonly timeSheetOpen = signal(false);
  readonly campSheetOpen = signal(false);
  readonly timeRangeFilter = signal<TimeRangeFilter>(DEFAULT_TIME_RANGE_FILTER);
  readonly selectedCampIds = signal<string[]>([]);

  readonly statusFilterNodes = ['16:3117', '16:3118', '16:3119', '16:3120'] as const;
  readonly statusFilterLabels = PATIENT_STATUS_FILTERS;

  protected readonly ellipseIcon = ellipseIcon;
  protected readonly calendarIcon = calendarIcon;
  protected readonly tentLineHeroIcon = tentLineHeroIcon;
  protected readonly addIcon = addIcon;

  readonly patients = this.phoneVerification.patients;

  readonly campOptions = computed<CampOption[]>(() =>
    seedCamps
      .filter((camp) => camp.zone === this.selectedZone() && camp.id)
      .map((camp) => ({
        id: camp.id!,
        name: camp.name,
        campNumber: camp.campNumber,
        typeCode: camp.typeCode,
        location: camp.location,
        zone: camp.zone,
      })),
  );

  readonly timeChipLabel = computed(() => getTimeRangeChipLabel(this.timeRangeFilter()));

  readonly campChipLabel = computed(() => {
    const ids = this.selectedCampIds();
    const options = this.campOptions();
    if (ids.length === 0) return 'All Camps';
    if (ids.length === 1) {
      const camp = options.find((option) => option.id === ids[0]);
      return camp?.name ?? 'All Camps';
    }
    return `${ids.length} Camps`;
  });

  readonly filteredPatients = computed(() => {
    const activeStatuses = PATIENT_STATUS_FILTERS.filter((status) => this.statusFilters()[status]);
    const normalizedQuery = this.searchQuery().trim().toLowerCase();
    const zone = this.selectedZone();
    const campIds = this.selectedCampIds();
    const timeFilter = this.timeRangeFilter();

    return this.patients().filter((patient) => {
      if (patient.zone !== zone) return false;
      if (campIds.length > 0 && !campIds.includes(patient.campId)) return false;
      if (!isDateWithinTimeRange(patient.registeredAt, timeFilter)) return false;
      if (activeStatuses.length > 0 && !activeStatuses.includes(patient.status)) return false;
      if (!normalizedQuery) return true;
      const haystack = [
        patient.name,
        patient.patientNumber,
        patient.campName,
        patient.phone,
        patient.status,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  });

  onZoneChange(zone: Zone): void {
    this.selectedZone.set(zone);
    this.selectedCampIds.set([]);
    this.timeRangeFilter.set(DEFAULT_TIME_RANGE_FILTER);
  }

  toggleStatus(status: PatientStatus, checked: boolean): void {
    this.statusFilters.update((current) => ({ ...current, [status]: checked }));
  }

  isVerified(patient: Patient): boolean {
    return this.phoneVerification.isVerified(patient);
  }

  openVerification(patient: Patient): void {
    this.phoneVerification.openVerification(patient);
  }

  getPatientKey = getPatientKey;
}
