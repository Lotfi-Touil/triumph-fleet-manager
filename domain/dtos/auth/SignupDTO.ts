import { IsEmail, IsString, MinLength, Matches } from "class-validator";

export class SignupDTO {
  @IsEmail({}, { message: "Email invalide" })
  email: string;

  @IsString({ message: "Le mot de passe doit être une chaîne de caractères" })
  @MinLength(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères",
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
  })
  password: string;

  @IsString({ message: "Le nom doit être une chaîne de caractères" })
  @MinLength(2, { message: "Le nom doit contenir au moins 2 caractères" })
  name: string;
}
