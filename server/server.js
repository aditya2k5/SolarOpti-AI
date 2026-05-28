import dotenv from "dotenv";
dotenv.config(); // Safely loads environment variables from the neighboring .env file

import app from "./src/app.js"; // Pointing inside the src directory
import { connectDB } from "./src/config/db.js"; // Pointing inside the src/config directory

const PORT = process.env.PORT || 5000;

// CONNECT DATABASE
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});