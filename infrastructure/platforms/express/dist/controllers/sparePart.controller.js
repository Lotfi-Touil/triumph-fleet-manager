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
exports.SparePartController = void 0;
const SparePart_1 = require("../../../../../domain/entities/SparePart");
const CheckLowStockAlert_1 = require("../../../../../application/usecases/CheckLowStockAlert");
class SparePartController {
    constructor(sparePartRepository) {
        this.sparePartRepository = sparePartRepository;
        this.acknowledgedNotifications = new Set();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sparePart = SparePart_1.SparePart.create({
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
                yield this.sparePartRepository.save(sparePart);
                res.status(201).json(sparePart);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const spareParts = yield this.sparePartRepository.findAll();
                res.json(spareParts);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sparePart = yield this.sparePartRepository.findById(req.params.id);
                if (!sparePart) {
                    res.status(404).json({ error: "Spare part not found" });
                    return;
                }
                res.json(sparePart);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getByCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const spareParts = yield this.sparePartRepository.findByCategory(req.params.category);
                res.json(spareParts);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const existing = yield this.sparePartRepository.findById(req.params.id);
                if (!existing) {
                    res.status(404).json({ error: "Spare part not found" });
                    return;
                }
                const sparePart = SparePart_1.SparePart.create({
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
                yield this.sparePartRepository.update(sparePart);
                res.json(sparePart);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sparePartRepository.delete(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getLowStock = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const lowStockParts = yield this.checkLowStockAlert.execute();
                res.json(lowStockParts);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.getLowStockAlerts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const lowStockParts = yield this.checkLowStockAlert.execute();
                res.json({
                    count: lowStockParts.length,
                    parts: lowStockParts,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
        this.checkLowStockAlert = new CheckLowStockAlert_1.CheckLowStockAlert(sparePartRepository);
    }
    getLowStockNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkLowStockAlert = new CheckLowStockAlert_1.CheckLowStockAlert(this.sparePartRepository);
                const lowStockParts = yield checkLowStockAlert.execute();
                const notifications = lowStockParts
                    .filter((part) => !this.acknowledgedNotifications.has(part.id))
                    .map((part) => ({
                    id: `low-stock-${part.id}`,
                    sparePart: {
                        id: part.id,
                        name: part.name,
                        quantity: part.quantity,
                        minQuantity: part.minQuantity,
                    },
                    createdAt: new Date(),
                    status: "PENDING",
                    message: `Stock bas pour ${part.name} (${part.quantity}/${part.minQuantity})`,
                    type: "LOW_STOCK",
                }));
                res.json(notifications);
            }
            catch (error) {
                res.status(500).json({
                    message: "Erreur lors de la récupération des notifications de stock bas",
                });
            }
        });
    }
    acknowledgeNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sparePart = yield this.sparePartRepository.findById(req.params.id);
                if (!sparePart) {
                    res.status(404).json({ error: "Spare part not found" });
                    return;
                }
                this.acknowledgedNotifications.add(req.params.id);
                res.status(200).json({ message: "Notification acknowledged" });
            }
            catch (error) {
                res.status(500).json({
                    message: "Erreur lors de l'acquittement de la notification",
                });
            }
        });
    }
}
exports.SparePartController = SparePartController;
