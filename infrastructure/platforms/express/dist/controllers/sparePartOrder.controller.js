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
exports.SparePartOrderController = void 0;
const SparePartOrder_1 = require("../../../../../domain/entities/SparePartOrder");
class SparePartOrderController {
    constructor(sparePartOrderRepository, sparePartRepository) {
        this.sparePartOrderRepository = sparePartOrderRepository;
        this.sparePartRepository = sparePartRepository;
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sparePart = yield this.sparePartRepository.findById(req.body.sparePartId);
                if (!sparePart) {
                    res.status(404).json({ error: "Spare part not found" });
                    return;
                }
                const order = SparePartOrder_1.SparePartOrder.create({
                    sparePart,
                    quantity: req.body.quantity,
                    unitPrice: req.body.unitPrice,
                    status: SparePartOrder_1.OrderStatus.PENDING,
                    orderDate: new Date(),
                    expectedDeliveryDate: req.body.expectedDeliveryDate
                        ? new Date(req.body.expectedDeliveryDate)
                        : null,
                    actualDeliveryDate: null,
                    supplier: req.body.supplier,
                    orderReference: req.body.orderReference,
                    notes: req.body.notes,
                });
                yield this.sparePartOrderRepository.save(order);
                res.status(201).json(order);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.sparePartOrderRepository.findAll();
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.sparePartOrderRepository.findById(req.params.id);
                if (!order) {
                    res.status(404).json({ error: "Order not found" });
                    return;
                }
                res.json(order);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getByStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const status = req.params.status;
                const orders = yield this.sparePartOrderRepository.findByStatus(status);
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getBySparePartId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.sparePartOrderRepository.findBySparePartId(req.params.sparePartId);
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getPendingOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.sparePartOrderRepository.findPendingOrders();
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getLateOrders = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.sparePartOrderRepository.findLateOrders();
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const existing = yield this.sparePartOrderRepository.findById(req.params.id);
                if (!existing) {
                    res.status(404).json({ error: "Order not found" });
                    return;
                }
                const sparePart = yield this.sparePartRepository.findById(req.body.sparePartId);
                if (!sparePart) {
                    res.status(404).json({ error: "Spare part not found" });
                    return;
                }
                const order = SparePartOrder_1.SparePartOrder.create({
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
                yield this.sparePartOrderRepository.update(order);
                res.json(order);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sparePartOrderRepository.delete(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.SparePartOrderController = SparePartOrderController;
