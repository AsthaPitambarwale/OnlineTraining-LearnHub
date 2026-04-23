const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();

// ⚠️ DO NOT use dotenv in production like this
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
    console.error("Order error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});

/* VERIFY PAYMENT */
router.post("/verify", (req, res) => {
  try {
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

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    const id = Date.now().toString();
    const date = new Date().toISOString().slice(0, 10);

    // ✅ Save payment
    db.prepare(`
      INSERT INTO payments
      (id,userId,userName,courseId,courseTitle,amount,date,status)
      VALUES(?,?,?,?,?,?,?,?)
    `).run(
      id,
      userId,
      userName,
      courseId,
      courseTitle,
      amount,
      date,
      "completed"
    );

    // ✅ Enroll user
    db.prepare(`
      INSERT OR IGNORE INTO enrollments (userId,courseId)
      VALUES (?,?)
    `).run(userId, courseId);

    res.json({ success: true });
  } catch (err) {
    console.error("VERIFY error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
