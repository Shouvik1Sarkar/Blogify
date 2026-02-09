import mongoose from "mongoose";

async function connect_db(url) {
  await mongoose
    .connect(url)
    .then((result) => {
      console.log("DATA BASE CONNECTED SUCCESSFULLY:");
    })
    .catch((err) => {
      console.error("ERROR CONNECTING MONGODB", err);
    });
}

export default connect_db;
