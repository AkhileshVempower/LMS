import express from "express"
import courseRoutes from "./routes/course";
import registerationRoutes from "./routes/registration"

const app=express()
app.use(express.json())

app.use("/",courseRoutes)
app.use("/add",registerationRoutes)

export default app