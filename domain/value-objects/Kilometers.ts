export class Kilometers {
  constructor(private readonly value: number) {
    if (value < 0) {
      throw new Error('Kilometers cannot be negative');
    }
  }

  public getValue(): number {
    return this.value;
  }

  public add(other: Kilometers): Kilometers {
    return new Kilometers(this.value + other.getValue());
  }

  public subtract(other: Kilometers): Kilometers {
    const result = this.value - other.getValue();
    return new Kilometers(result);
  }

  public isGreaterThanOrEqual(other: Kilometers): boolean {
    return this.value >= other.getValue();
  }
} 