const { dir } = require('console');
const express=require('express');
const bcrypt=require('bcrypt');
// const user=require('./model/user')

const collection=require('./dbconfig/dbconfig')
collection();
const path=require('path');
require('dotenv').config();

const app=express();
const PORT=process.env.PORT;
const dirUrl=path.join(__dirname,'/page/');  
// console.log(dirUrl)


app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(dirUrl,'login.html'));
});
app.get('/signup',(req,res)=>{
   res.sendFile(path.join(dirUrl,'signup.html'));
});
app.post('/signup', async (req, res) => {
  const data = {
      name: req.body.username,
      password: req.body.password
  };

  try {
      const existingUser = await collection.findOne({ name: data.name });
      if (existingUser) {
          return res.send("User already exists. Please choose a different username.");
      }
      else{
      const saltRound = 10;
      const hashPassword = await bcrypt.hash(data.password, saltRound);
      data.password = hashPassword;
      await collection.insertMany(data);
      console.log("User registered successfully!");
      res.send("User registered successfully!");
      }
  } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).send("An error occurred during signup.");
  }
});

app.post('/login', async (req, res) => {
  try {
      const check = await collection.findOne({ name: req.body.username });
      if (!check) {
          return res.send("User does not exist");
      }

      const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
      if (isPasswordMatch) {
          return res.sendFile(path.join(dirUrl, 'home.html'));
      } else {
          return res.send("Wrong password");
      }
  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send("An error occurred during login.");
  }
});

app.listen(PORT,()=>{
    console.log(`the server is  running on : http://localhost:${PORT}`);
})
