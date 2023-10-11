const express = require("express");
const https = require("https");
const cors = require("cors");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const username = String(process.env.USER_NAME);
const password = String(process.env.PASSWORD);
const apiHost = String(process.env.API_HOST);

app.post("/send-sms", (req, res) => {
  const postData = JSON.stringify({
    to: req.body.to,
    body: req.body.body,
  });

  const options = {
    hostname: apiHost,
    port: 443,
    path: "/v1/messages",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": postData.length,
      Authorization:
        "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
  };

  const smsRequest = https.request(options, (smsResponse) => {
    let smsData = "";
    smsResponse.on("data", (chunk) => {
      smsData += chunk;
    });
    smsResponse.on("end", () => {
      res.json({ message: "SMS sent successfully", smsResponse: smsData });
    });
  });

  smsRequest.on("error", (e) => {
    console.error("Error sending SMS:", e);
    res.status(500).json({ error: "Failed to send SMS" });
  });

  smsRequest.write(postData);
  smsRequest.end();
});

const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`Server is running on port ${port} ...`);
});
