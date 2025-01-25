import express, { Request, Response, NextFunction } from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import { MongoSparePartRepository } from "../../../adapters/repositories/MongoSparePartRepository";
import { createSparePartRouter } from "./routes/sparePart.routes";
import { createSparePartOrderRouter } from "./routes/sparePartOrder.routes";
import { MongoSparePartOrderRepository } from "../../../adapters/repositories/MongoSparePartOrderRepository";

const app = express();
const port = process.env.PORT || 3001;
const mongoUrl =
  process.env.MONGODB_URI || "mongodb://mongo:27017/fleet-manager";

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Connect to MongoDB and initialize repositories
let mongoClient: MongoClient;

async function initializeMongo() {
  try {
    mongoClient = await MongoClient.connect(mongoUrl);
    console.log("Connected to MongoDB");

    const sparePartRepository = new MongoSparePartRepository(mongoClient);
    const sparePartOrderRepository = new MongoSparePartOrderRepository(
      mongoClient
    );
    app.use("/api/spare-parts", createSparePartRouter(sparePartRepository));
    app.use(
      "/api/spare-part-orders",
      createSparePartOrderRouter(sparePartOrderRepository, sparePartRepository)
    );
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Initialize MongoDB connection and start server
initializeMongo().then(() => {
  app
    .listen(port, () => {
      console.log(`Express server running on port ${port}`);
    })
    .on("error", (err: Error) => {
      console.error("Failed to start server:", err);
    });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log("MongoDB connection closed");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});
