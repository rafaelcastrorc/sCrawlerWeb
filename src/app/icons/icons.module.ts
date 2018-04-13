import { NgModule } from '@angular/core';
import {
  IconCamera,
  IconHeart,
  IconGithub,
  IconHome,
  IconMonitor,
  IconDatabase,
  IconGlobe,
  IconClipboard
} from 'angular-feather';

const icons = [
  IconCamera,
  IconHeart,
  IconGithub,
  IconHome,
  IconMonitor,
  IconDatabase,
  IconGlobe,
  IconClipboard
];

@NgModule({
  exports: icons
})
export class IconsModule { }
