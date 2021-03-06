import {TemplateRef} from '@angular/core';
import {SelectOption, ElementType} from './types';

export class DynamicFormElement {
  title: string;
  name: string;
  options?: SelectOption[];
  optionsUrl?: string;
  type?: ElementType;
  validatorFunc?: (name: string, value: any) => string[];
  dependsElement?: string;
  cellTemplate?: TemplateRef<any>;
  formHidden?: boolean;
  isPrimaryKey?: boolean;
  keyElement?: string;

  getOptions(dependsValue?: any): SelectOption[] {
    if (this.options) {
      if (this.dependsElement && dependsValue) {
        return this.options.filter((value) => value.parentId === dependsValue);
      } else {
        return this.options;
      }
    }
  }

  validate(value: any): string[] {
    if (this.validatorFunc) {
      return this.validatorFunc(this.title, value);
    }
    return [];
  }

}
