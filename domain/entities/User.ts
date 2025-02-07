export interface UserProps {
  id?: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  ADMIN = "admin",
  FLEET_MANAGER = "fleet_manager",
  CLIENT_PARTNER = "client_partner",
  TECHNICIAN = "technician",
  DRIVER = "driver",
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get name(): string {
    return this.props.name;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  updatePassword(password: string): void {
    this.props.password = password;
    this.props.updatedAt = new Date();
  }

  updateRole(role: UserRole): void {
    this.props.role = role;
    this.props.updatedAt = new Date();
  }

  updateProfile(name: string, email: string): void {
    this.props.name = name;
    this.props.email = email;
    this.props.updatedAt = new Date();
  }

  toJSON(): UserProps {
    return {
      ...this.props,
    };
  }

  getId(): string | undefined {
    return this.id;
  }
}
