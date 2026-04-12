const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();

require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* CREATE ORDER */

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

/* VERIFY PAYMENT */

router.post("/verify", (req, res) => {
  console.log("VERIFY API HIT");

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    courseId,
    userName,
    courseTitle,
    amount,
  } = req.body;

  console.log("DATA RECEIVED:", req.body);

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
    .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  console.log("EXPECTED:", expected);
  console.log("ACTUAL:", razorpay_signature);

  if (expected !== razorpay_signature) {
    console.log("❌ SIGNATURE FAILED");
    return res.status(400).json({ success: false });
  }

  console.log("✅ SIGNATURE VERIFIED");

  const id = Date.now().toString();
  const date = new Date().toISOString().slice(0, 10);

  db.run(
    `INSERT INTO payments
    (id,userId,userName,courseId,courseTitle,amount,date,status)
    VALUES(?,?,?,?,?,?,?,?)`,
    [id, userId, userName, courseId, courseTitle, amount, date, "completed"],
  );

  db.run("INSERT OR IGNORE INTO enrollments (userId,courseId) VALUES(?,?)", [
    userId,
    courseId,
  ]);

  console.log("✅ PAYMENT + ENROLLMENT SAVED");

  res.json({ success: true });
});

module.exports = router;
