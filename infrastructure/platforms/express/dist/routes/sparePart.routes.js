"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSparePartRouter = exports.notificationEmitter = void 0;
const express_1 = require("express");
const sparePart_controller_1 = require("../controllers/sparePart.controller");
const events_1 = require("events");
exports.notificationEmitter = new events_1.EventEmitter();
const createSparePartRouter = (sparePartRepository) => {
    const router = (0, express_1.Router)();
    const controller = new sparePart_controller_1.SparePartController(sparePartRepository);
    router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.create(req, res);
        exports.notificationEmitter.emit("low-stock-notification");
    }));
    router.get("/", controller.getAll);
    router.get("/low-stock", controller.getLowStock);
    router.get("/low-stock-alerts", controller.getLowStockAlerts);
    router.get("/category/:category", controller.getByCategory);
    router.get("/:id", controller.getById);
    router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.update(req, res);
        exports.notificationEmitter.emit("low-stock-notification");
    }));
    router.delete("/:id", controller.delete);
    router.get("/notifications/low-stock", (req, res) => {
        controller.getLowStockNotifications(req, res);
    });
    router.put("/:id/acknowledge-low-stock", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.acknowledgeNotification(req, res);
        exports.notificationEmitter.emit("low-stock-notification");
    }));
    router.get("/notifications/events", (req, res) => {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("Access-Control-Allow-Origin", "*");
        const listener = () => {
            res.write(`data: ${JSON.stringify({ type: "NOTIFICATION_UPDATE" })}\n\n`);
        };
        exports.notificationEmitter.on("low-stock-notification", listener);
        req.on("close", () => {
            exports.notificationEmitter.off("low-stock-notification", listener);
        });
    });
    return router;
};
exports.createSparePartRouter = createSparePartRouter;
