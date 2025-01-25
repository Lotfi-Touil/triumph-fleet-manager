import { Request, Response } from "express";
import { SparePartOrderRepository } from "../../../../../application/ports/repositories/SparePartOrderRepository";
import { SparePartRepository } from "../../../../../application/ports/repositories/SparePartRepository";
import {
  SparePartOrder,
  OrderStatus,
} from "../../../../../domain/entities/SparePartOrder";

export class SparePartOrderController {
  constructor(
    private readonly sparePartOrderRepository: SparePartOrderRepository,
    private readonly sparePartRepository: SparePartRepository
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const sparePart = await this.sparePartRepository.findById(
        req.body.sparePartId
      );
      if (!sparePart) {
        res.status(404).json({ error: "Spare part not found" });
        return;
      }

      const order = SparePartOrder.create({
        sparePart,
        quantity: req.body.quantity,
        unitPrice: req.body.unitPrice,
        status: OrderStatus.PENDING,
        orderDate: new Date(),
        expectedDeliveryDate: req.body.expectedDeliveryDate
          ? new Date(req.body.expectedDeliveryDate)
          : null,
        actualDeliveryDate: null,
        supplier: req.body.supplier,
        orderReference: req.body.orderReference,
        notes: req.body.notes,
      });

      await this.sparePartOrderRepository.save(order);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await this.sparePartOrderRepository.findAll();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await this.sparePartOrderRepository.findById(req.params.id);
      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = req.params.status as OrderStatus;
      const orders = await this.sparePartOrderRepository.findByStatus(status);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getBySparePartId = async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await this.sparePartOrderRepository.findBySparePartId(
        req.params.sparePartId
      );
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getPendingOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await this.sparePartOrderRepository.findPendingOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  getLateOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await this.sparePartOrderRepository.findLateOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const existing = await this.sparePartOrderRepository.findById(
        req.params.id
      );
      if (!existing) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      const sparePart = await this.sparePartRepository.findById(
        req.body.sparePartId
      );
      if (!sparePart) {
        res.status(404).json({ error: "Spare part not found" });
        return;
      }

      const order = SparePartOrder.create({
        id: req.params.id,
        sparePart,
        quantity: req.body.quantity,
        unitPrice: req.body.unitPrice,
        status: req.body.status,
        orderDate: new Date(req.body.orderDate),
        expectedDeliveryDate: req.body.expectedDeliveryDate
          ? new Date(req.body.expectedDeliveryDate)
          : null,
        actualDeliveryDate: req.body.actualDeliveryDate
          ? new Date(req.body.actualDeliveryDate)
          : null,
        supplier: req.body.supplier,
        orderReference: req.body.orderReference,
        notes: req.body.notes,
      });

      await this.sparePartOrderRepository.update(order);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.sparePartOrderRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}
