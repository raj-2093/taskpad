import { app } from "./app.js";
import { connectDB } from "./db/db.js";

const PORT = process.env.PORT || 8000;

connectDB().then((val) => {
    app.listen(PORT, '0.0.0.0', ()=>{
        console.log(`Server listening at PORT: ${PORT}`);
        console.log(`---------------------------------------------------------------------------`);
    })
}).catch((err) => {
    console.error("Failed to connect to the database:", err);
})