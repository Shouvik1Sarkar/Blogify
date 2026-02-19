import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./env.js";

// Create an Arcjet instance with multiple rules
export const aj = arcjet({
  key: ARCJET_KEY, // Get your site key from https://app.arcjet.com
  characteristics: ["ip.src"],
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),

    tokenBucket({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only

      //   refillRate: 5, // add 10 tokens
      //   interval: 60, // every 60 seconds
      //   capacity: 5, // max bucket size

      refillRate: 10, // refill 5 tokens per interval
      interval: 60, // refill every 10 seconds
      capacity: 10, // bucket maximum capacity of 10 tokens
    }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:API_CLIENT"], // "allow none" will block all detected bots
    }),
  ],
});
