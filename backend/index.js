import app from "./app.js";
import { connectDB } from "./DB/connectDB.js";

const Port = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(Port, () => {
      console.log(`The server is running on port ${Port}`);
    });
  })
  .catch((error) => {
    console.log("connection to DB failed!", error);
  });
