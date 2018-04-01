import { NgModule } from '@angular/core';
import {IconCamera, IconHeart, IconGithub, IconHome, IconMonitor} from 'angular-feather';

const icons = [
  IconCamera,
  IconHeart,
  IconGithub,
  IconHome,
  IconMonitor
];

@NgModule({
  exports: icons
})
export class IconsModule { }
