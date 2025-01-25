import { Router } from "express";
import { SparePartOrderController } from "../controllers/sparePartOrder.controller";
import { SparePartOrderRepository } from "../../../../../application/ports/repositories/SparePartOrderRepository";
import { SparePartRepository } from "../../../../../application/ports/repositories/SparePartRepository";

export const createSparePartOrderRouter = (
  sparePartOrderRepository: SparePartOrderRepository,
  sparePartRepository: SparePartRepository
) => {
  const router = Router();
  const controller = new SparePartOrderController(
    sparePartOrderRepository,
    sparePartRepository
  );

  router.post("/", controller.create);
  router.get("/", controller.getAll);
  router.get("/pending", controller.getPendingOrders);
  router.get("/late", controller.getLateOrders);
  router.get("/status/:status", controller.getByStatus);
  router.get("/spare-part/:sparePartId", controller.getBySparePartId);
  router.get("/:id", controller.getById);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);

  return router;
};
