import { Router } from "express";
import { SparePartController } from "../controllers/sparePart.controller";
import { SparePartRepository } from "../../../../../application/ports/repositories/SparePartRepository";
import { Request, Response } from "express";

export const createSparePartRouter = (
  sparePartRepository: SparePartRepository
) => {
  const router = Router();
  const controller = new SparePartController(sparePartRepository);

  router.post("/", controller.create);
  router.get("/", controller.getAll);
  router.get("/low-stock", controller.getLowStock);
  router.get("/low-stock-alerts", controller.getLowStockAlerts);
  router.get("/category/:category", controller.getByCategory);
  router.get("/:id", controller.getById);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);
  router.get("/notifications/low-stock", (req: Request, res: Response) => {
    controller.getLowStockNotifications(req, res);
  });
  router.put("/:id/acknowledge-low-stock", (req: Request, res: Response) => {
    controller.acknowledgeNotification(req, res);
  });

  return router;
};
