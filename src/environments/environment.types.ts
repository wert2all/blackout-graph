import { FirebaseOptions } from '@angular/fire/app';

export enum EnvironmentType {
  production = 'production',
  development = 'development',
}

export interface Environment {
  type: EnvironmentType;
  firebase: FirebaseOptions;
}
