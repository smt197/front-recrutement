export interface UserForgotPassword {
  email: string;
  password?: string; // Facultatif pour éviter de le stocker après connexion
  password_confirmation?: string; // Facultatif, utilisé uniquement pour l'inscription
}
``