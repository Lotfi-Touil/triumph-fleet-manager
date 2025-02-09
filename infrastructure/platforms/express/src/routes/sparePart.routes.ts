import { Router } from "express";
import { SparePartController } from "../controllers/sparePart.controller";
import { SparePartRepository } from "../../../../../application/ports/repositories/SparePartRepository";
import { Request, Response } from "express";
import { EventEmitter } from "events";

export const notificationEmitter = new EventEmitter();

export const createSparePartRouter = (
  sparePartRepository: SparePartRepository
) => {
  const router = Router();
  const controller = new SparePartController(sparePartRepository);

  router.post("/", async (req: Request, res: Response) => {
    await controller.create(req, res);
    notificationEmitter.emit("low-stock-notification");
  });

  router.get("/", controller.getAll);
  router.get("/low-stock", controller.getLowStock);
  router.get("/low-stock-alerts", controller.getLowStockAlerts);
  router.get("/category/:category", controller.getByCategory);
  router.get("/:id", controller.getById);

  router.put("/:id", async (req: Request, res: Response) => {
    await controller.update(req, res);
    notificationEmitter.emit("low-stock-notification");
  });

  router.delete("/:id", controller.delete);

  router.get("/notifications/low-stock", (req: Request, res: Response) => {
    controller.getLowStockNotifications(req, res);
  });

  router.put(
    "/:id/acknowledge-low-stock",
    async (req: Request, res: Response) => {
      await controller.acknowledgeNotification(req, res);
      notificationEmitter.emit("low-stock-notification");
    }
  );

  router.get("/notifications/events", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const listener = () => {
      res.write(`data: ${JSON.stringify({ type: "NOTIFICATION_UPDATE" })}\n\n`);
    };

    notificationEmitter.on("low-stock-notification", listener);

    req.on("close", () => {
      notificationEmitter.off("low-stock-notification", listener);
    });
  });

  router.put(
    "/notifications/low-stock-:id/acknowledge",
    async (req: Request, res: Response) => {
      const sparePartId = req.params.id;
      req.params.id = sparePartId;
      await controller.acknowledgeNotification(req, res);
      notificationEmitter.emit("low-stock-notification");
    }
  );

  return router;
};
