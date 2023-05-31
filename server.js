#!/usr/bin/env node

import { handler } from "./build/handler.js";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";

dotenv.config();

const app = express();

const http_port = process.env.HTTP_PORT ?? 80;
const https_port = process.env.HTTPS_PORT ?? 443;

if (http_port) {
  http
    .createServer(app)
    .listen(http_port, () => console.log(`HTTP server running on: http://localhost:${http_port}`));
}

if (https_port) {
  const credentials = {
    cert: fs.readFileSync(process.env.TLS_CERT),
    key: fs.readFileSync(process.env.TLS_CERT_KEY),
  };

  https
    .createServer(credentials, app)
    .listen(https_port, () => console.log(`HTTPS server running on: https://localhost:${https_port}`));
}

app.use((req, res) => {
  // redirect http requests to the https version
  if (https_port && req.protocol === "http") {
    return res.redirect(307, `https://${req.headers.host}${req.url}`);
  }

  // let SvelteKit handle everything else, including serving prerendered pages and static assets
  handler(req, res);
});
