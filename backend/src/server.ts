import dotenv from "dotenv";
import app from "./app";
import { pool } from "./config/database";

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();

    await connection.query("SET time_zone = '-03:00'");

    console.log("Database connected successfully");
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();