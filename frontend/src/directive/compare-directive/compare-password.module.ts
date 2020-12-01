import {NgModule} from '@angular/core';

// Directive
import {CompareDirective} from './compare-password.directive';


@NgModule({
  declarations: [
    CompareDirective
  ],
  exports: [
    CompareDirective
  ]
})
export class ComparePasswordModule { }
