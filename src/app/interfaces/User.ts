export interface User {
  id?: number; // ID facultatif (utilisé après enregistrement)
  first_name: string;
  last_name: string;
  name?: string; // Nom complet
  email: string;
  password?: string; // Facultatif pour éviter de le stocker après connexion
  password_confirmation?: string; // Facultatif, utilisé uniquement pour l'inscription
  role?: string; // Exemple : "admin", "user", etc.
}
