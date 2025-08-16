import express from "express"
import courseRoutes from "./routes/course";
import registerationRoutes from "./routes/registration"
import allotmentRoutes from "./routes/allotment"

const app=express()
app.use(express.json())

app.use("/",courseRoutes)
app.use("/reg",registerationRoutes)
app.use("/allot",allotmentRoutes)

export default app