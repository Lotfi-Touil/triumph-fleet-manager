export class Driver {
  constructor(
    private readonly id: string,
    private readonly firstName: string,
    private readonly lastName: string,
    private readonly email: string,
    private readonly phoneNumber: string,
    private readonly licenseNumber: string,
    private readonly licenseType: string,
    private readonly licenseExpiryDate: Date,
    private readonly experienceYears: number,
    private readonly drivingHistory: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPhoneNumber(): string {
    return this.phoneNumber;
  }

  public getLicenseNumber(): string {
    return this.licenseNumber;
  }

  public getLicenseType(): string {
    return this.licenseType;
  }

  public getLicenseExpiryDate(): Date {
    return this.licenseExpiryDate;
  }

  public getExperienceYears(): number {
    return this.experienceYears;
  }

  public getDrivingHistory(): string {
    return this.drivingHistory;
  }
}