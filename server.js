#!/usr/bin/env node

import { handler } from "./build/handler.js";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";

dotenv.config();

const app = express();

const credentials = {
  cert: fs.readFileSync(process.env.TLS_CERT),
  key: fs.readFileSync(process.env.TLS_CERT_KEY),
};

http
  .createServer(app)
  .listen(80, () => console.log("HTTP server running on: http://localhost"));
https
  .createServer(credentials, app)
  .listen(443, () => console.log("HTTPS server running on: https://localhost"));

app.use((req, res) => {
  // redirect http requests to the https version
  if (req.protocol === "http") {
    return res.redirect(307, `https://${req.headers.host}${req.url}`);
  }

  // let SvelteKit handle everything else, including serving prerendered pages and static assets
  handler(req, res);
});
