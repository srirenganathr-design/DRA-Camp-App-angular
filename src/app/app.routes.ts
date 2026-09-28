import { Routes } from '@angular/router';
import { AppShellLayoutComponent } from './layout/app-shell-layout.component';
import { RoutePlaceholderComponent } from './screens/route-placeholder.component';

function placeholder(title: string) {
  return {
    component: RoutePlaceholderComponent,
    data: { title },
  };
}

export const routes: Routes = [
  {
    path: '',
    component: AppShellLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'patients' },
      { path: 'camps', ...placeholder('Camps') },
      { path: 'camps/create', ...placeholder('Create camp — basic') },
      { path: 'camps/create/location', ...placeholder('Create camp — location') },
      { path: 'camps/create/branches', ...placeholder('Create camp — branches') },
      { path: 'camps/create/team', ...placeholder('Create camp — team') },
      { path: 'camps/:campId/edit', ...placeholder('Edit camp — basic') },
      { path: 'camps/:campId/edit/location', ...placeholder('Edit camp — location') },
      { path: 'camps/:campId/edit/branches', ...placeholder('Edit camp — branches') },
      { path: 'camps/:campId/edit/team', ...placeholder('Edit camp — team') },
      { path: 'camps/:campId', ...placeholder('Camp details') },
      { path: 'patients', ...placeholder('Patients') },
      { path: 'patients/:patientId', ...placeholder('Patient details') },
      { path: 'patients/:patientId/appointment', ...placeholder('Patient — appointment') },
      { path: 'patients/:patientId/schedule-appointment', ...placeholder('Schedule appointment') },
      { path: 'patients/create', ...placeholder('Create patient') },
      { path: 'patients/create/medical-history', ...placeholder('Medical history') },
      { path: 'patients/create/dry-auto-refraction', ...placeholder('Dry auto refraction') },
      { path: 'patients/create/dry-refraction', ...placeholder('Dry refraction') },
      { path: 'patients/create/diagnosis', ...placeholder('Diagnosis') },
      { path: 'patients/:patientId/edit', ...placeholder('Edit patient') },
      { path: 'patients/:patientId/edit/medical-history', ...placeholder('Edit medical history') },
      { path: 'patients/:patientId/edit/dry-auto-refraction', ...placeholder('Edit dry auto refraction') },
      { path: 'patients/:patientId/edit/dry-refraction', ...placeholder('Edit dry refraction') },
      { path: 'patients/:patientId/edit/diagnosis', ...placeholder('Edit diagnosis') },
    ],
  },
];
