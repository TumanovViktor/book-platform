import {Attribute, Directive} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';


@Directive({
  selector: '[compare-password]',
  providers: [{provide: NG_VALIDATORS, useExisting: CompareDirective, multi: true}]
})

export class CompareDirective implements Validator {

  constructor(@Attribute('compare-password') public comparer: string,
              @Attribute('parent') public parent: string){}

  // @ts-ignore
  validate(c: any): {[key: string]: any} {
    const e = c.root.get(this.comparer);

    if (e && c.value !== e.value && !this.isParent) {
      return { compare: true };
    }

    if (e && c.value === e.value && this.isParent) {
      delete e.errors['compare'];
      if (!Object.keys(e.errors).length) {
        e.setErrors(null);
      }
    }

    if (e && c.value !== e.value && this.isParent) {
      e.setErrors({ compare: true });
    }
  }

  private get isParent() {
    if (!this.parent) {
      return false;
    }
    return this.parent === 'true';
  }
}
