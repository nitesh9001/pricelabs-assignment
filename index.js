const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const axios = require("axios");
const fs = require('fs');
const resolveJsonToCsv = require('./helper/resolveJsonToCsv');
const payloadObject = require('./payloadObject');
const http = require('http')
const app = express();
app.use(express.json());
app.use(express.static('./index.html'))

const port = process.env.PORT || 8080;

app.get('/', async (req, res)=>{
    try{
    fs.readFile('./index.html', function (err,data) {
        if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
        }
        res.writeHead(200);
        res.write(data);
        res.end();
    });
   }catch(e){
       res.send("Some error on fetching index file")
   }
})

app.post('/listing', async (req, res)=>{
    let {address, pageSize} = req.query ;
    
    try{
        
        let payLoadData = payloadObject(pageSize, address);
        console.log(process.env.COOKIE_DATA)
        const config = {
            method: 'POST',
            url: process.env.BASE_URL,
            headers: {
            'Content-Type': 'application/json',
            'Cookie': process.env.COOKIE_DATA
            },
            data : JSON.stringify(payLoadData)
        };
        const response = await axios(config);

        console.log("Checking response from API", 
        response.data.data.results.listings);
        if(response.data.data.results.listings.length > 0){
           await resolveJsonToCsv(response?.data?.data?.results?.listings, res);
        }
        else{
            res.status(200).json({
                "statusCode" : 200,
                "status": "Failed",
                "message": "resource get successfull but cannot create the CSV file",
                "listing":response.data.data.results.listings,
                "error" : {}
            });
            console.log("Can't dump json to csv due to data length is null")
        }
    }catch(error){
        console.log("error ", error);
        res.status(500).json({
            "statusCode": 500,
            "status": "Failed",
            "message": "Something went wrong - Refer to pricelabs end point",
            "error": error,
            "listing": {}
        })
    }
});

app.listen(port, () => {
    console.log(`Your script is listening at @ http://localhost:${port}\nTry to run on postman or anywhere`)
});