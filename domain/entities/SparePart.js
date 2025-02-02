"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparePart = void 0;
const crypto_1 = require("crypto");
class SparePart {
    constructor(id, name, category, // e.g., 'filter', 'tire', 'brake'
    quantity, minQuantity, // For stock alerts
    location, lastRestockDate, price, supplier, notes) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.minQuantity = minQuantity;
        this.location = location;
        this.lastRestockDate = lastRestockDate;
        this.price = price;
        this.supplier = supplier;
        this.notes = notes;
    }
    static create(props) {
        return new SparePart(props.id || (0, crypto_1.randomUUID)(), props.name, props.category, props.quantity, props.minQuantity, props.location, props.lastRestockDate, props.price, props.supplier, props.notes);
    }
}
exports.SparePart = SparePart;
