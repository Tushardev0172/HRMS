const express = require("express")
const app = express();
const router = require("../server/routes/allRoute")
const connectDB = require("../server/dbConnection/db")
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
connectDB();

const PORT = process.env.PORT || 3210;
app.use(cors({ origin: '*' }));
app.use(express.json())
app.use('/',router)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});