import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { connectDB } from "./db/db.js";

const PORT = process.env.PORT || 8000;

connectDB().then((val) => {
    app.listen(PORT, ()=>{
        console.log(`Server listening at PORT: ${PORT}`);
        console.log(`---------------------------------------------------------------------------`);
    })
}).catch((err) => {
})