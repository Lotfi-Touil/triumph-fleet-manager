import { Request, Response } from "express";
import { SparePartRepository } from "../../../../../application/ports/repositories/SparePartRepository";
import { SparePart } from "../../../../../domain/entities/SparePart";

export class SparePartController {
  constructor(private readonly sparePartRepository: SparePartRepository) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const sparePart = SparePart.create({
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        minQuantity: req.body.minQuantity,
        location: req.body.location,
        lastRestockDate: new Date(),
        price: req.body.price,
        supplier: req.body.supplier,
        notes: req.body.notes,
      });

      await this.sparePartRepository.save(sparePart);
      res.status(201).json(sparePart);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const spareParts = await this.sparePartRepository.findAll();
      res.json(spareParts);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const sparePart = await this.sparePartRepository.findById(req.params.id);
      if (!sparePart) {
        res.status(404).json({ error: "Spare part not found" });
        return;
      }
      res.json(sparePart);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const spareParts = await this.sparePartRepository.findByCategory(
        req.params.category
      );
      res.json(spareParts);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const existing = await this.sparePartRepository.findById(req.params.id);
      if (!existing) {
        res.status(404).json({ error: "Spare part not found" });
        return;
      }

      const sparePart = SparePart.create({
        id: req.params.id,
        name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        minQuantity: req.body.minQuantity,
        location: req.body.location,
        lastRestockDate: new Date(req.body.lastRestockDate),
        price: req.body.price,
        supplier: req.body.supplier,
        notes: req.body.notes,
      });

      await this.sparePartRepository.update(sparePart);
      res.json(sparePart);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.sparePartRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getLowStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const spareParts = await this.sparePartRepository.findLowStock();
      res.json(spareParts);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}
