import dotenv from 'dotenv';
dotenv.config();

console.log("index file is running");

import app from "./app.js";
import db_connect from './Database/index.js';  // ✅ Move this import here

const startserver = async () => {
  try {
    console.log("Connecting to database...");
    await db_connect();  // ✅ Now it is defined
    console.log("Database connected");

    const port = process.env.PORT || 3000;
    console.log(`PORT from env: ${process.env.PORT}`);
console.log(`Final PORT: ${port}`);

app.listen(port, "0.0.0.0", () => {  // ✅ Bind to 0.0.0.0
    console.log(`Server running on port:- http://localhost:${port}`);
});

  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

startserver();
