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
exports.MongoSparePartRepository = void 0;
const SparePart_1 = require("../../../domain/entities/SparePart");
class MongoSparePartRepository {
    constructor(client) {
        this.client = client;
        this.collection = this.client.db("fleet-manager").collection("spare-parts");
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
    findByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.collection.find({ category }).toArray();
            return docs.map((doc) => this.mapToEntity(doc));
        });
    }
    save(sparePart) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.insertOne(this.mapToDocument(sparePart));
        });
    }
    update(sparePart) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.updateOne({ id: sparePart.id }, { $set: this.mapToDocument(sparePart) });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.collection.deleteOne({ id });
        });
    }
    findLowStock() {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.collection
                .find({
                $expr: { $lte: ["$quantity", "$minQuantity"] },
            })
                .toArray();
            return docs.map((doc) => this.mapToEntity(doc));
        });
    }
    mapToEntity(doc) {
        return new SparePart_1.SparePart(doc.id, doc.name, doc.category, doc.quantity, doc.minQuantity, doc.location, new Date(doc.lastRestockDate), doc.price, doc.supplier, doc.notes);
    }
    mapToDocument(sparePart) {
        return {
            id: sparePart.id,
            name: sparePart.name,
            category: sparePart.category,
            quantity: sparePart.quantity,
            minQuantity: sparePart.minQuantity,
            location: sparePart.location,
            lastRestockDate: sparePart.lastRestockDate,
            price: sparePart.price,
            supplier: sparePart.supplier,
            notes: sparePart.notes,
        };
    }
}
exports.MongoSparePartRepository = MongoSparePartRepository;
