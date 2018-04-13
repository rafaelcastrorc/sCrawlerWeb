import { NgModule } from '@angular/core';
import {IconCamera, IconHeart, IconGithub, IconHome, IconMonitor, IconDatabase, IconGlobe} from 'angular-feather';

const icons = [
  IconCamera,
  IconHeart,
  IconGithub,
  IconHome,
  IconMonitor,
  IconDatabase,
  IconGlobe
];

@NgModule({
  exports: icons
})
export class IconsModule { }
