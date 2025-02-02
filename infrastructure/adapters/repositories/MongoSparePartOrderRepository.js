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
exports.MongoSparePartOrderRepository = void 0;
const SparePartOrder_1 = require("../../../domain/entities/SparePartOrder");
const SparePart_1 = require("../../../domain/entities/SparePart");
class MongoSparePartOrderRepository {
    constructor(client) {
        this.client = client;
        this.collection = this.client
            .db("fleet-manager")
            .collection("spare-part-orders");
    }
    mapToEntity(doc) {
        return SparePartOrder_1.SparePartOrder.create({
            id: doc.id,
            sparePart: SparePart_1.SparePart.create(doc.sparePart),
            quantity: doc.quantity,
            unitPrice: doc.unitPrice,
            status: doc.status,
            orderDate: new Date(doc.orderDate),
            expectedDeliveryDate: doc.expectedDeliveryDate
                ? new Date(doc.expectedDeliveryDate)
                : null,
            actualDeliveryDate: doc.actualDeliveryDate
                ? new Date(doc.actualDeliveryDate)
                : null,
            supplier: doc.supplier,
            orderReference: doc.orderReference,
            notes: doc.notes,
        });
    }
    mapToDocument(order) {
        return {
            id: order.id,
            sparePart: order.sparePart,
            quantity: order.quantity,
            unitPrice: order.unitPrice,
            status: order.status,
            orderDate: order.orderDate,
            expectedDeliveryDate: order.expectedDeliveryDate,
            actualDeliveryDate: order.actualDeliveryDate,
            supplier: order.supplier,
            orderReference: order.orderReference,
            notes: order.notes,
        };
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.collection.findOne({ id });
            return doc ? this.mapToEntity(doc) : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.collection.find().toArray();
            return docs.map((doc) => this.mapToEntity(doc));
        });
    }
    findByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.collection.find({ status }).toArray();
            return docs.map((doc) => this.mapToEntity(doc));
        });
    }
    findBySparePartId(sparePartId) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.collection
                .find({ "sparePart.id": sparePartId })
                .toArray();
            return docs.map((doc) => this.mapToEntity(doc));
        });
    }
    findPendingOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.collection
                .find({
                status: { $in: [SparePartOrder_1.OrderStatus.PENDING, SparePartOrder_1.OrderStatus.ORDERED] },
            })
                .toArray();
            return docs.map((doc) => this.mapToEntity(doc));
        });
    }
    findLateOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const docs = yield this.collection
                .find({
                status: SparePartOrder_1.OrderStatus.ORDERED,
                expectedDeliveryDate: { $lt: now },
            })
                .toArray();
            return docs.map((doc) => this.mapToEntity(doc));
        });
    }
    save(order) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.insertOne(this.mapToDocument(order));
        });
    }
    update(order) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.updateOne({ id: order.id }, { $set: this.mapToDocument(order) });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.deleteOne({ id });
        });
    }
}
exports.MongoSparePartOrderRepository = MongoSparePartOrderRepository;
