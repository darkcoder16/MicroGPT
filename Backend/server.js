import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import userAuth from "./routes/auth.js";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.use("/api" , chatRoutes);
app.use("/api" , userAuth);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
  connectDB();
});

const connectDB = async() => {
  try {
     await mongoose.connect(process.env.MONGODB_URL);
     console.log("connected with database");
  } catch(err){
    console.log("failed to connect with DB" , err);
  }
}

app.post("/test" , async (req, res) => {
  const options = {
    method : "POST",
    headers: {
     "Content-Type" : "application/json",
     "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` 
    },

    body:JSON.stringify({
      model: "gpt-5.4-nano",
      messages: [{
        role: "user",
        content : req.body.message
      }]
    })
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions" , options);
    const data = response.json();
    
    console.log(data.choices[0].message.content); //reply s
    res.send(data.choices[0].message.content); //reply sending to frontend
  } catch(err) {
    console.log(err);
  }
});


// import OpenAI from 'openai';

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
// });

// const response = await client.responses.create({
//   model: 'gpt-4o-mini',
//   input: 'what is 8 + 9 ?',
// });

// console.log(response.output_text);
