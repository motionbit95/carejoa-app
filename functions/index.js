/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const bodyParser = require("body-parser");

// Firebase Admin SDK 초기화
admin.initializeApp();
const db = admin.firestore();

// Express 라우터
const express = require("express");
const app = express();

app.use(bodyParser.json());

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getFacilityGeneral = onRequest(async (req, res) => {
  const longTermAdminSym = req.query.longTermAdminSym;

  try {
    // 'users' 컬렉션에서 'age' 필드가 25 이상인 문서를 쿼리
    const querySnapshot = await db
      .collection("database")
      .doc("carejoa")
      .collection("FACILITY_GENERAL")
      .where("longTermAdminSym", "==", parseInt(longTermAdminSym))
      .get();

    // 쿼리 결과가 비어있는지 확인
    if (querySnapshot.empty) {
      return res.status(404).json({ message: "No matching documents found" });
    }

    // 쿼리 결과를 배열로 저장
    let docs = [];
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });

    // 쿼리 결과 반환
    return res.status(200).json(docs);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: error.message });
  }
});

exports.getFacilityGrade = onRequest(async (req, res) => {
  const longTermAdminSym = req.query.longTermAdminSym;

  console.log(longTermAdminSym);
  try {
    // 특정 사용자의 orders 하위 컬렉션을 참조합니다.
    const ordersRef = db
      .collection("database")
      .doc("carejoa")
      .collection("FACILITY_GRADE")
      .where("longTermAdminSym", "==", longTermAdminSym);

    // 하위 컬렉션 내 모든 문서를 가져옵니다.
    const ordersSnapshot = await ordersRef.get().catch((error) => {
      res.status(404).send("Error fetching orders:", error);
    });

    // if (ordersSnapshot.empty) {
    //   res.status(404).send("No orders found for this user.");
    //   return;
    // }

    // 모든 문서 데이터를 배열로 저장
    let orders = [];
    ordersSnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    console.log(orders);

    // 클라이언트에 데이터를 반환합니다.
    res.status(200).send(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Error fetching orders");
  }
});
