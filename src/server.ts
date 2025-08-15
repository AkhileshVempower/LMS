import express from "express"
import courseRoutes from "./routes/course";

const app=express()
app.use(express.json())

app.use("/",courseRoutes)




export default app