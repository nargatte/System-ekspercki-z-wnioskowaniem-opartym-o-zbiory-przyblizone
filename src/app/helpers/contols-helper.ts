import { AbstractControl, FormControl, ValidatorFn, ValidationErrors } from "@angular/forms";

export class ContolsHelper {
    static markAllDirty(control: AbstractControl) {
        if (control.hasOwnProperty('controls')) {
            control.markAsDirty() // mark group
            let ctrl = <any>control;
            for (let inner in ctrl.controls) {
                this.markAllDirty(ctrl.controls[inner] as AbstractControl);
            }
        }
        else {
            (<FormControl>(control)).markAsDirty();
        }
    }
    
    static noWhitespaceValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
       let isWhitespace = (control.value || '').trim().length === 0;
       let isValid = !isWhitespace;
       return isValid ? null : { 'whitespace': 'value is only whitespace' }
     };
}