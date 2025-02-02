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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const cors_1 = __importDefault(require("cors"));
const MongoSparePartRepository_1 = require("../../../adapters/repositories/MongoSparePartRepository");
const sparePart_routes_1 = require("./routes/sparePart.routes");
const sparePartOrder_routes_1 = require("./routes/sparePartOrder.routes");
const MongoSparePartOrderRepository_1 = require("../../../adapters/repositories/MongoSparePartOrderRepository");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGODB_URI || "mongodb://mongo:27017/fleet-manager";
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
// Connect to MongoDB and initialize repositories
let mongoClient;
function initializeMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            mongoClient = yield mongodb_1.MongoClient.connect(mongoUrl);
            console.log("Connected to MongoDB");
            const sparePartRepository = new MongoSparePartRepository_1.MongoSparePartRepository(mongoClient);
            const sparePartOrderRepository = new MongoSparePartOrderRepository_1.MongoSparePartOrderRepository(mongoClient);
            app.use("/api/spare-parts", (0, sparePart_routes_1.createSparePartRouter)(sparePartRepository));
            app.use("/api/spare-part-orders", (0, sparePartOrder_routes_1.createSparePartOrderRouter)(sparePartOrderRepository, sparePartRepository));
        }
        catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            process.exit(1);
        }
    });
}
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
});
// Initialize MongoDB connection and start server
initializeMongo().then(() => {
    app
        .listen(port, () => {
        console.log(`Express server running on port ${port}`);
    })
        .on("error", (err) => {
        console.error("Failed to start server:", err);
    });
});
// Graceful shutdown
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (mongoClient) {
            yield mongoClient.close();
            console.log("MongoDB connection closed");
        }
        process.exit(0);
    }
    catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    }
}));
