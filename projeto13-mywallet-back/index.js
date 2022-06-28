import  express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.use(cors(), express.json());
dotenv.config();

let db;
const mongoClient = new MongoClient(process.env.MONGO_DB_URI);
mongoClient.connect().then(() => {
    db = mongoClient.db(process.env.MONGO_DATABASE_NAME);
}).catch(() => {
    console.log("Deu pau ao entrar no banco de dados!!!")
});

app.post("/login", (request, response) => {

});

app.post("/signup", (request, response) => {
    
});

app.listen(process.env.PORT)
