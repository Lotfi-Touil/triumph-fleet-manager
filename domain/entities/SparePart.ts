import { randomUUID } from "crypto";

export class SparePart {
  constructor(
    public readonly id: string,
    public name: string,
    public category: string,
    public quantity: number,
    public minQuantity: number,
    public location: string,
    public lastRestockDate: Date,
    public price: number,
    public supplier?: string,
    public notes?: string
  ) {}

  static create(props: Omit<SparePart, "id"> & { id?: string }): SparePart {
    return new SparePart(
      props.id || randomUUID(),
      props.name,
      props.category,
      props.quantity,
      props.minQuantity,
      props.location,
      props.lastRestockDate,
      props.price,
      props.supplier,
      props.notes
    );
  }
}
