import { SignUpWizardComponent } from './sign-up-wizard.component';
import { Step1Component } from './step1';
import { Step2Component } from './step2';

export const routes = [
  {
    path: '',
    component: SignUpWizardComponent,
    children: [
      { path: '', redirectTo: 'step1', pathMatch: 'full' },
      { path: 'step1', component: Step1Component },
      { path: 'step2', component: Step2Component },
      // { path: '**', redirectTo: 'step1' },
    ]
  }
];
