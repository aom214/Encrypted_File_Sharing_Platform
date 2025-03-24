import dotenv from 'dotenv';
dotenv.config();

console.log("index file is running")
import app from "./app.js";

const startserver=async()=>{
  try {
    console.log("Connecting to database...");
    await db_connect();
    console.log("database connected")

    const port =process.env.PORT ||3000
    app.listen(port, () => {
      console.log(`Server running on port:- http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
startserver();


import db_connect from './Database/index.js';
