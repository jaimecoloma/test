const express = require('express')
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const { Client } = require('pg')
const client = new Client({
  user: 'jaime.coloma@uc.cl',
  host: 'langosta.ing.puc.cl',
  database: 'jaime.coloma@uc.cl',
  password: '18639453',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.post('/', async function (req, res) {
  try {
    const data = await atob(req.body.message.data)
    //const message = await req.body.message.messageId
    const publish_time = await req.body.message.publishTime
    const operation = parseInt(data.substring(0, 4))
    const id = parseInt(data.substring(4, 14))
    const bank_origin = parseInt(data.substring(14, 21))
    const account_origin = parseInt(data.substring(21, 31))
    const bank_destiny = parseInt(data.substring(31, 38))
    const account_destiny = parseInt(data.substring(38, 48))
    const amount = parseInt(data.substring(48, 64))
    
    //const query = `INSERT INTO transactions (id, operation, bank_origin, account_origin, bank_destiny, account_destiny, amount, publish_time) VALUES ('${id}', '${operation}', '${bank_origin}', '${account_origin}', '${bank_destiny}', '${account_destiny}', '${amount}, '${publish_time}');`
    const query = `INSERT INTO transactions (id, operation, bank_origin, account_origin, bank_destiny, account_destiny, amount, publish_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`
    const values = [id, operation, bank_origin, account_origin, bank_destiny, account_destiny, amount, publish_time]
    client.query(query, values,  (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Inserted");
    });
  res.status(200).send('Hello World')
  } catch (error) {
    res.status(500).send('Error')
  }
})

app.get('/', async function (req, res) {
  //console.log(req.body)
  const query2 = `SELECT * FROM transactions;`
  try {
    const data = await new Promise((resolve, reject) => {
      client.query(query2, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log("Selected");
          resolve(result);
        }
      });
    });


    // Send the response to the front end
    res.status(200).send(data);
  } catch (error) {
    // Handle error
    res.status(500).send("An error occurred.");
  }
})

app.listen(3000)