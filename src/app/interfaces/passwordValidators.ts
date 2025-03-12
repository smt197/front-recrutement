import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { environment } from 'src/environments/environment';
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirmation = control.get('password_confirmation');

    if (!password || !passwordConfirmation) {
      return null;
    }

    // Création d'un objet d'erreurs
    const errors: ValidationErrors = {};

    // Vérifier si les mots de passe correspondent
    if (password.value !== passwordConfirmation.value) {
      errors['password_not_match'] = true;
    }

    // Problème identifié: "Passer12" a 8 caractères, mais la fonction vérifie si la longueur est exactement 8
    // Comme la longueur est EXACTEMENT 8, cette condition ne devrait pas être considérée comme une erreur

    // Si vous voulez forcer exactement 8 caractères:
    if (password.value && password.value.length !== 8) {
      errors['password_length'] = true;
    }

    if (passwordConfirmation.value && passwordConfirmation.value.length !== 8) {
      errors['confirmation_length'] = true;
    }

    // Validation d'email
    if (isEmail(password.value)) {
      errors['password_is_email'] = true;
    }

    if (isEmail(passwordConfirmation.value)) {
      errors['confirmation_is_email'] = true;
    }

    // Validation de lien
    if (isLink(password.value)) {
      errors['password_contains_link'] = true;
    }

    if (isLink(passwordConfirmation.value)) {
      errors['confirmation_contains_link'] = true;
    }

    // Validation de la force du mot de passe - en utilisant la fonction correcte
    const passwordStrengthErrors = passwordStrengthValidator(password);
    const confirmationStrengthErrors = passwordStrengthValidator(passwordConfirmation);

    if (passwordStrengthErrors) {
      errors['password_strength'] = true;
    }

    if (confirmationStrengthErrors) {
      errors['confirmation_strength'] = true;
    }

    // Application des erreurs si présentes
    if (Object.keys(errors).length > 0) {
      // Appliquer les erreurs spécifiques à chaque contrôle
      const passwordErrors = { ...(password.errors || {}) };
      const confirmationErrors = { ...(passwordConfirmation.errors || {}) };

      Object.keys(errors).forEach(key => {
        if (key.startsWith('password_')) {
          passwordErrors[key] = errors[key];
        }
        if (key.startsWith('confirmation_')) {
          confirmationErrors[key] = errors[key];
        }
        if (key === 'password_not_match') {
          passwordErrors[key] = errors[key];
          confirmationErrors[key] = errors[key];
        }
      });

      password.setErrors(Object.keys(passwordErrors).length > 0 ? passwordErrors : null);
      passwordConfirmation.setErrors(Object.keys(confirmationErrors).length > 0 ? confirmationErrors : null);

      return errors;
    }

    // Réinitialisation des erreurs si tout est valide
    password.setErrors(null);
    passwordConfirmation.setErrors(null);

    return null;
  };
}

export function isLink(value: string): boolean {
  if (!value) return false;
  // Regex améliorée pour détecter les URLs
  const linkRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+|localhost|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/\S*)?$/i;
  return linkRegex.test(value);
}


export function isExactlyEightCharacters(password: string): boolean {
  if (!password) return false;
  // Vérifie simplement si la longueur est exactement 8
  return password.length === 8;
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return { required: true };
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    const errors: ValidationErrors = {};

    if (!hasUpperCase) errors['missing_uppercase'] = true;
    if (!hasLowerCase) errors['missing_lowercase'] = true;
    if (!hasNumeric) errors['missing_number'] = true;
    if (!hasSpecialChar) errors['missing_special'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
  };
}

export function passwordMatchValidatorChange(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirmation = control.get('password_confirmation');
    const currentPassword = control.get('current_password');

    if (!password || !passwordConfirmation || !currentPassword) {
      return null;
    }

    // Réinitialisation des erreurs précédentes
    password.setErrors(null);
    passwordConfirmation.setErrors(null);
    currentPassword.setErrors(null);

    const errors: ValidationErrors = {};

    // Validation de la correspondance des mots de passe
    if (password.value !== passwordConfirmation.value) {
      errors['password_not_match'] = true;
    }

    // Validation de la longueur exacte à 8 caractères
    if (!isExactlyEightCharacters(currentPassword.value) ||
      !isExactlyEightCharacters(password.value) ||
      !isExactlyEightCharacters(passwordConfirmation.value)) {
      errors['minlength'] = true;
    }

    // Validation d'email
    if (isEmail(currentPassword.value) ||
      isEmail(password.value) ||
      isEmail(passwordConfirmation.value)) {
      errors['password_email_mismatch'] = true;
    }

    // Validation de lien
    if (isLink(currentPassword.value) ||
      isLink(password.value) ||
      isLink(passwordConfirmation.value)) {
      errors['password_contains_link'] = true;
    }

    // Validation de la force du mot de passe
    const passwordStrengthErrors =
      passwordStrengthValidator(currentPassword.value) ||
      passwordStrengthValidator(password.value) ||
      passwordStrengthValidator(passwordConfirmation.value);

    if (passwordStrengthErrors) {
      errors['passwordStrength'] = true;
    }

    // Application des erreurs si présentes
    if (Object.keys(errors).length > 0) {
      password.setErrors(errors);
      passwordConfirmation.setErrors(errors);
      currentPassword.setErrors(errors);
      return errors;
    }

    return null;
  };
}

export function passwordMatchValidatorLogin(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');

    if (!password || !password.value) {
      return null;
    }

    const errors: ValidationErrors = {};

    // Validation de la longueur exacte à 8 caractères
    if (!isExactlyEightCharacters(password.value)) {
      errors['minlength'] = true;
    }

    // Validation d'email
    if (isEmail(password.value)) {
      errors['password_email_mismatch'] = true;
    }

    // Validation de lien
    if (isLink(password.value)) {
      errors['password_contains_link'] = true;
    }

    // Validation de la force du mot de passe - CORRECTED
    const value = password.value;
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    if (!hasUpperCase || !hasLowerCase || !hasNumeric || !hasSpecialChar) {
      errors['passwordStrength'] = true;
    }

    // Application des erreurs si présentes
    if (Object.keys(errors).length > 0) {
      password.setErrors(errors);
      return errors;
    }

    // Only clear errors if there are no validation errors
    password.setErrors(null);
    return null;
  };
}


export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) {
    return null;
  }

  const hasUpperCase = /[A-Z]+/.test(value);
  const hasLowerCase = /[a-z]+/.test(value);
  const hasNumeric = /[0-9]+/.test(value);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

  const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

  return !passwordValid ? { passwordStrength: true } : null;
}

export function isEmail(value: string): boolean {
  if (!value) return false;
  // Regex pour la validation d'email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
}
