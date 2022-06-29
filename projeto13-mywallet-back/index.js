import  express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import Joi from "joi";
import { stripHtml } from "string-strip-html";
import Trim from "trim";
import bcrypt from "bcrypt";
//import uuid from "uuid";

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

app.post("/sign-up", async (request, response) => {
    let dataSignup = {
        name: Trim(stripHtml(request.body.name).result),
        email: Trim(stripHtml(request.body.email).result),
        password: request.body.password,
        confirmPassword: request.body.confirmPassword
    };

    const signupSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().valid(request.body.password).required()
    });
    const { error } = signupSchema.validate(dataSignup, { abortEarly: false});

    if (error) {
        response.status(422).send("Dados invalidos, tente novamente");
        return;
    };

    let encryptedPassword = bcrypt.hashSync(dataSignup.password, 10);
    dataSignup = {
                    name: dataSignup.name,
                    email: dataSignup.email,
                    password: encryptedPassword
    };
    try {
        const checkEmail = await db.collection("users").findOne({email: dataSignup.email});
        if (checkEmail) {
            response.status(409).send("E-mail já cadastrado, cadastre outro ou faça login");
            return;
        };

        await db.collection("users").insertOne(dataSignup);
        response.status(200).send("Usuario cadastrado com sucesso");
    } catch (error) {
        response.status(500).send(error);
    };
});

const PORT = process.env.PORT || 5000
app.listen(PORT)
