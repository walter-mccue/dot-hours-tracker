/**
 * Title: main.ts
 * Author: Walter McCue
 * Date: 05/14/23
 * Description: Point of entry into the application
*/

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
