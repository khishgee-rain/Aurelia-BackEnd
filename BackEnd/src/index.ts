import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));

// Middleware: Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// -------------------- AUTH --------------------

// Signup
app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const user = await prisma.user.create({ data: { email, password, name } });
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// -------------------- ROOM CRUD --------------------

// Create Room
app.post("/rooms", async (req: Request, res: Response) => {
  try {
    const {
      title, image, rating, capacity, bedType,
      roomSize, checkIn, checkOut, type, price, amenities
    } = req.body;

    const room = await prisma.room.create({
      data: {
        title,
        image,
        rating,
        capacity,
        bedType,
        roomSize,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        type,
        price: parseFloat(price),
        amenities // Assuming it's stored as a string[] or JSON[]
      },
    });

    res.json(room);
  } catch (error: any) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get All Rooms
app.get("/rooms", async (_req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// Get Room by ID
app.get("/rooms/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid room ID" });

  try {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update Room
app.put("/rooms/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        ...req.body,
        price: parseFloat(req.body.price),
        checkIn: new Date(req.body.checkIn),
        checkOut: new Date(req.body.checkOut),
      },
    });
    res.json(updatedRoom);
  } catch (error: any) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Room
app.delete("/rooms/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid room ID" });

  try {
    const deletedRoom = await prisma.room.delete({ where: { id } });
    res.json({ message: "Room deleted successfully", deletedRoom });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Room not found" });
    }
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Get all info sections
app.get("/infosections", async (_req, res) => {
  try {
    const sections = await prisma.infoSection.findMany();
    res.json(sections);
  } catch (error) {
    console.error("Error fetching info sections:", error);
    res.status(500).json({ error: "Failed to fetch info sections" });
  }
});


// Create Info Section
app.post("/infosections", async (req: Request, res: Response) => {
  try {
    const { title, description, image, reverse } = req.body;
    const section = await prisma.infoSection.create({
      data: {
        title,
        description,
        image,
        reverse,
      },
    });
    res.status(201).json(section);
  } catch (error: any) {
    console.error("Error creating info section:", error);
    res.status(500).json({ error: "Failed to create info section" });
  }
});

// Update Info Section
app.put("/infosections/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const updated = await prisma.infoSection.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error: any) {
    console.error("Error updating info section:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete Info Section
app.delete("/infosections/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    const deleted = await prisma.infoSection.delete({ where: { id } });
    res.json({ message: "Deleted", deleted });
  } catch (error: any) {
    console.error("Error deleting info section:", error);
    res.status(500).json({ error: error.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
