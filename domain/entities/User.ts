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
  MANAGER = "manager",
  CLIENT = "client",
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

  toJSON(): UserProps {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
