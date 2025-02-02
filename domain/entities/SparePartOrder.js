"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SparePartOrder = exports.OrderStatus = void 0;
const crypto_1 = require("crypto");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["ORDERED"] = "ORDERED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
class SparePartOrder {
    constructor(id, sparePart, quantity, unitPrice, status, orderDate, expectedDeliveryDate, actualDeliveryDate, supplier, orderReference, notes) {
        this.id = id;
        this.sparePart = sparePart;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.status = status;
        this.orderDate = orderDate;
        this.expectedDeliveryDate = expectedDeliveryDate;
        this.actualDeliveryDate = actualDeliveryDate;
        this.supplier = supplier;
        this.orderReference = orderReference;
        this.notes = notes;
    }
    static create(props) {
        return new SparePartOrder(props.id || (0, crypto_1.randomUUID)(), props.sparePart, props.quantity, props.unitPrice, props.status, props.orderDate, props.expectedDeliveryDate, props.actualDeliveryDate, props.supplier, props.orderReference, props.notes);
    }
    get totalCost() {
        return this.quantity * this.unitPrice;
    }
    get isDelivered() {
        return this.status === OrderStatus.DELIVERED;
    }
    get isLate() {
        if (!this.expectedDeliveryDate ||
            this.status === OrderStatus.DELIVERED ||
            this.status === OrderStatus.CANCELLED) {
            return false;
        }
        return new Date() > this.expectedDeliveryDate;
    }
}
exports.SparePartOrder = SparePartOrder;
