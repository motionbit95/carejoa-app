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

// Firebase Admin SDK 초기화
admin.initializeApp();
const db = admin.firestore();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getFacilityGeneral = onRequest(async (req, res) => {
  const longTermAdminSym = req.query.longTermAdminSym;

  console.log(longTermAdminSym);
  try {
    // 특정 사용자의 orders 하위 컬렉션을 참조합니다.
    const ordersRef = db
      .collection("database")
      .doc("carejoa")
      .collection("FACILITY_GENERAL")
      .where("test", "==", "2");
    // .where("장기요양기관코드", "==", longTermAdminSym); // 영어로 변경해서 올리기

    // 하위 컬렉션 내 모든 문서를 가져옵니다.
    const ordersSnapshot = await ordersRef.get();

    if (ordersSnapshot.empty) {
      res.status(404).send("No orders found for this user.");
      return;
    }

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
