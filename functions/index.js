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
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const os = require("os");
const fs = require("fs");
const cors = require("cors");

// Firebase Admin SDK 초기화 - private key는 따로 보관할 것
const serviceAccount = {
  type: "service_account",
  project_id: "motionbit-doc",
  private_key_id: "3088f06c46006361d9451ff31de2e60a65856302",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCo1hiJiPkbuzsX\n2IkiM1beA7zYRe6LqmP8sDDF2sSg20J9rupLshF8gVgYEY6m8F8BnOuWZZT/f0bI\na8bhMI4EoyZv62UNTz7TZCtcWPadpNwO0ZbBiP7dnqxOmgHIyqf+Ylj+35DRz9g0\nccoddWoXnz2PuDcJcqY/3JL2k9u/D9jh8t1gNeLIYMDl4MmtTzaq8/itsBaLJxjJ\ngTn6M5XjOQO4iAoPDa3HUiUaCr6IqoRZvR5qoxG+sPPdHhkcOySpc4zUArweqnjQ\nY835s/N1/nKnEpT0p3zkpM0x7Q4k9FUgrVROqpwDPPFy/O/AwVxR9RbTF5drdkpQ\nnfMQbg6dAgMBAAECgf8MAy+XK8xEY7J1Nrv4xUCf1FsbUUwno8ELuX11uuQd+3ut\nUPt/Hhn71BOCx3Pe2oR6PXkX3tk7C1M0yr9t/Riv8qKSnRqlxX2gjLbSNqbC/lM8\nKGQ2F8AKclH0s24j7Wvh5GaVKXd/vze1FdE5R1gyw8ZCGBAbibFKbDBRyKEQwASA\ncjtUK80GvqL26GVL5WQ4XF8tVpL467sMzMAVTVjTu8NAMXSNl195a9aKuClVDUOi\nOh2yXilWi/ZuVY7cP0s2JbCPsPe9Kketj5HTj/OA8TmXbGMhKuKVrKY3OsxYxl9h\nvLLDKZRa4AznoQK3jLP38IbWoQlovcv8cz6EM+8CgYEA4UfGz67vGspJzyhkXlN1\n1aE/N90newquHShzNuvWJ+iWl2VhUXj5DD+bB7zHs/dSZmW1DTFVxXGd+Hnp/CGo\nvZLg3fTigkO2vp9RfWxP7CiUJ71HYQtUfEdPEADZe7Y13h3KHNrrEs8uiVTzcUA1\n/n9mwq2AxhSYcOzTUk6p888CgYEAv9vvjFZH+Grgc1FxVWfRt7/ipSz0gw8ZxNLS\nk0HU350krMw97VgvxcDR2Jy0o3E7p+UYotwqJUQf0oozQ2e5Zaj4drunWPQws1x4\nPxANzifCb5VjGA+1LkMmR0TZJfA54DqRxwVERLEt2qUNsdwPADPwx7T38e6QqgT2\nkyvr9dMCgYB+D803sDtKcYIl8wNfKTLaDXYzy4RpPMu7s0PtqsDW6jdCls+DaL9s\nVDdrd/8EPNSWSjmrHT1S1EZCoe4GUct78bH1YjBSFpQvTTWriq2aiAaHykokCtQH\nC1w5p1AMAyVXmrHbvcEncFopLSlg6T6NoDsfmzlhHmtDXbLO7wf5TwKBgCftlqnn\nHu1FGNcHAQYcKBoMlhd4Bp7r2poKogZBchLjekl36/9kFfUaztE8s588JoUneXwT\nQ7YjulevqUGC6aONib/0B7zMfQIm4WOGbMkVnzJnrYrJYhRxpxq36lUp7HGM3t/D\nadS95uQU64ezW2/YX2jAccVot7SaedJhFqc/AoGBAMgsqemjUwOzU1XQwiBXf9Tl\nWPorlMsvxRTHBY0r7GR/eFjvI2GDgOI1ODvqEhxVJ0hv+lpIn609sXNxqW67Tg0O\nTODS1CK3pVNecmoIwZaPJ+/+utVpsQ38/ZQ5whi5YKYlStql9rnfxPvnHId/A8mU\njPbjChzjE2s57kiXuDPd\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-8tpfb@motionbit-doc.iam.gserviceaccount.com",
  client_id: "108688383191826501975",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8tpfb%40motionbit-doc.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const auth = admin.auth();

// Express 라우터
const express = require("express");
const app = express();

app.use(bodyParser.json());

// CORS 설정 (원하는 도메인만 허용)
const corsOptions = {
  origin: "http://localhost:3000", // 허용할 프론트엔드 URL
  methods: ["POST", "GET", "OPTIONS"], // 허용할 메서드
  allowedHeaders: ["Content-Type"], // 허용할 헤더
};

app.use(cors(corsOptions));

// Firebase Authentication 에뮬레이터 설정
// if (process.env.FUNCTIONS_EMULATOR) {
//   process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9098";
// }

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

exports.getDocument = onRequest(async (req, res) => {
  const collectionName = req.query.collection; // 예시: 'carejoa'
  const docId = req.query.docId;

  console.log(collectionName, docId);

  try {
    // 'users' 컬렉션에서 'age' 필드가 25 이상인 문서를 쿼리
    const docRef = await db
      .collection("database")
      .doc("carejoa")
      .collection(collectionName)
      .doc(docId);

    docRef.get().then((doc) => {
      if (doc.exists) {
        return res.status(200).json({ ...doc.data(), id: doc.id });
      } else {
        return res.status(404).json({ message: "No matching documents found" });
      }
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: error.message });
  }
});

exports.saveDocument = onRequest(async (req, res) => {
  const userId = "carejoa"; // 예시: 'carejoa'
  const subCollection = req.query.subCollection; // 예시: 'request'
  const documentData = req.body; // 요청 본문에서 저장할 데이터 받기

  try {
    // 특정 사용자의 하위 컬렉션 참조
    const subCollectionRef = db
      .collection("database")
      .doc(userId)
      .collection(subCollection);

    // 새 문서를 추가합니다.
    const docRef = await subCollectionRef.add(documentData);

    // 성공적으로 문서가 저장되었음을 응답
    res
      .status(200)
      .send({ id: docRef.id, message: "Document successfully saved." });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).send("Error saving document");
  }
});

exports.getCounsels = onRequest(async (req, res) => {
  const userId = req.query.userId;

  try {
    // 'users' 컬렉션에서 'age' 필드가 25 이상인 문서를 쿼리
    const querySnapshot = await db
      .collection("database")
      .doc("carejoa")
      .collection("COUNSELING")
      .where("userId", "==", userId)
      .get();

    // 쿼리 결과가 비어있는지 확인
    if (querySnapshot.empty) {
      return res.status(404).json({ message: "No matching documents found" });
    }

    // 쿼리 결과를 배열로 저장
    let docs = [];
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
    });

    // 쿼리 결과 반환
    return res.status(200).json(docs);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: error.message });
  }
});

exports.getCounsel = onRequest(async (req, res) => {
  const counselId = req.query.counselId;

  try {
    // 'users' 컬렉션에서 'age' 필드가 25 이상인 문서를 쿼리
    const docRef = await db
      .collection("database")
      .doc("carejoa")
      .collection("COUNSELING")
      .doc(counselId);

    docRef.get().then((doc) => {
      if (doc.exists) {
        return res.status(200).json({ ...doc.data(), id: doc.id });
      } else {
        return res.status(404).json({ message: "No matching documents found" });
      }
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 파일 리스트를 업로드하는 Firebase Functions
exports.uploadFiles = onRequest(async (req, res) => {
  try {
    const files = req.body.files; // 클라이언트에서 보내는 파일 리스트
    const bucket = admin.storage().bucket();
    const filePaths = []; // 파일 경로를 저장할 배열

    // 파일 리스트 처리
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const tempFilePath = path.join(os.tmpdir(), file.name);

      // 파일을 임시 경로에 저장
      fs.writeFileSync(tempFilePath, file.content, "base64");

      const destinationPath = `uploads/${file.name}`;

      // Firebase Storage에 업로드
      let temp = await bucket.upload(tempFilePath, {
        destination: destinationPath,
        metadata: {
          contentType: file.mimetype,
        },
      });

      // 파일 경로 저장 (업로드된 파일의 경로 생성)
      const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${destinationPath.replace(/\//g, "%2F")}?alt=media`;
      filePaths.push(fileUrl);

      // 임시 파일 삭제
      fs.unlinkSync(tempFilePath);
    }

    res.status(200).send({
      message: "Files uploaded successfully",
      code: "0000",
      filePaths: filePaths,
    });
  } catch (error) {
    console.error("Error uploading files: ", error);
    res.status(500).send({ message: "Error uploading files", code: "1001" });
  }
});

// 특정 UID의 사용자 정보를 가져오는 함수
exports.getUserInfoByUID = onRequest(async (req, res) => {});

exports.addUser = onRequest(async (req, res) => {
  const userId = "carejoa"; // 예시: 'carejoa'
  const subCollection = "USERS"; // 예시: 'request'
  const uid = req.body.uid; // 클라이언트에서 UID 받기
  const documentData = req.body; // 요청 본문에서 저장할 데이터 받기

  console.log(documentData, uid, userId, subCollection);

  try {
    // 특정 사용자의 하위 컬렉션 참조
    const subCollectionRef = db
      .collection("database")
      .doc(userId)
      .collection(subCollection);

    // 새 문서를 추가합니다.
    const docRef = await subCollectionRef.doc(uid).set(documentData);

    // 성공적으로 문서가 저장되었음을 응답
    res
      .status(200)
      .send({ id: docRef.id, message: "Document successfully saved." });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).send("Error saving document");
  }
});

app.get("/", async (req, res) => {
  return res.status(200).send("Hello World!");
});

app.post("/addCoupon", async (req, res) => {
  const userId = "carejoa"; // 예시: 'carejoa'
  const subCollection = "COUPON"; // 예시: 'request'
  const documentData = req.body; // 요청 본문에서 저장할 데이터 받기

  console.log(documentData, userId, subCollection);

  try {
    // 특정 사용자의 하위 컬렉션 참조
    const subCollectionRef = db
      .collection("database")
      .doc(userId)
      .collection(subCollection);

    // 새 문서를 추가합니다.
    const docRef = await subCollectionRef.doc(req.body.code).set(documentData);

    // 성공적으로 문서가 저장되었음을 응답
    res.status(200).send({
      id: docRef.id,
      message: "Document successfully saved.",
      data: documentData,
    });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).send("Error saving document");
  }
});

app.get("/getCouponList", async (req, res) => {
  const userId = "carejoa"; // 예시: 'carejoa'
  const subCollection = "COUPON"; // 예시: 'request'

  try {
    // 특정 사용자의 하위 컬렉션 참조
    const subCollectionRef = db
      .collection("database")
      .doc(userId)
      .collection(subCollection);

    // 새 문서를 가져오기
    const documents = await subCollectionRef.get();
    const couponList = documents.docs.map((doc) => doc.data());

    return res.status(200).json(couponList);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/getCoupon", async (req, res) => {
  const collectionName = "COUPON"; // 예시: 'carejoa'
  const docId = req.query.id;

  console.log(collectionName, docId);

  try {
    // 'users' 컬렉션에서 'age' 필드가 25 이상인 문서를 쿼리
    const docRef = await db
      .collection("database")
      .doc("carejoa")
      .collection(collectionName)
      .doc(docId);

    docRef.get().then((doc) => {
      if (doc.exists) {
        return res.status(200).json({ ...doc.data(), id: doc.id });
      } else {
        return res.status(404).json({ message: "No matching documents found" });
      }
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/getPaymentList", async (req, res) => {
  const userId = "carejoa"; // 예시: 'carejoa'
  const subCollection = "PAYMENTS"; // 예시: 'request'

  const { uid } = req.query;

  console.log(userId, subCollection, uid);

  try {
    // 특정 사용자의 하위 컬렉션 참조
    const subCollectionRef = db
      .collection("database")
      .doc(userId)
      .collection(subCollection)
      // .orderBy("paidAt", "asc")
      .where("uid", "==", uid);
    // 새 문서를 가져오기
    const documents = await subCollectionRef.get();
    const paymentList = documents.docs.map((doc) => doc.data());

    return res.status(200).json(paymentList);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Firebase Function: POST 요청을 통해 유저 삭제
app.post("/deleteUser", async (req, res) => {
  console.log("deleteUser", req.body.uid);
  // POST 메서드인지 확인
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { uid } = req.body; // 요청의 body에서 uid 가져오기

  // uid가 없을 경우 에러 반환
  if (!uid) {
    return res.status(400).send("Missing uid");
  }

  try {
    // Firebase Authentication에서 유저 삭제
    await admin.auth().deleteUser(uid);
    return res.status(200).send(`Successfully deleted user with uid: ${uid}`);
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).send(`Error deleting user: ${error.message}`);
  }
});

app.get("/getUserInfo", async (req, res) => {
  const { uid } = req.query;
  // const uid = req.body.uid; // 클라이언트에서 UID 받기

  if (!uid) {
    return res.status(400).send("UID is required");
  }

  try {
    // UID를 사용해 Firebase Auth에서 사용자 정보 가져오기
    const userRecord = await auth.getUser(uid);

    // 사용자 정보 반환
    res.status(200).send(userRecord);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

app.get("/getDocuments", async (req, res) => {
  console.log("getDocuments");
  try {
    const { collectionName, order, page, limit } = req.query; // 쿼리 파라미터에서 페이지와 개수 가져오기

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum; // 오프셋 계산

    // 'users' 컬렉션에서 'age' 필드가 25 이상인 문서를 쿼리
    const querySnapshot = await db
      .collection("database")
      .doc("carejoa")
      .collection(collectionName)
      .orderBy(order) // 정렬할 필드 이름 입력
      // .offset(offset) // 오프셋 적용
      // .limit(limitNum) // 제한 개수 적용
      .get();

    // 쿼리 결과가 비어있는지 확인
    if (querySnapshot.empty) {
      return res.status(404).json({ message: "No matching documents found" });
    }

    // 쿼리 결과를 배열로 저장
    let docs = [];
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
    });

    // 쿼리 결과 반환
    return res.status(200).json(docs);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/updateDocument", async (req, res) => {
  const userId = "carejoa"; // 예시: 'carejoa'
  const subCollection = req.query.subCollection; // 예시: 'request'
  const documentId = req.query.documentId; // 예시: 'documentId'
  const documentData = req.body; // 예시: { title: 'updated title' }

  try {
    // 특정 사용자의 하위 컬렉션 참조
    const subCollectionRef = db
      .collection("database")
      .doc(userId)
      .collection(subCollection);

    // 문서를 변경합니다.
    await subCollectionRef
      .doc(documentId)
      .update(documentData, { merge: true });

    // 성공적으로 문서가 변경되었음을 응답
    res.status(200).send({ message: "Document successfully updated." });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).send("Error updating document");
  }
});

app.get("/deleteDocument", async (req, res) => {
  const userId = "carejoa"; // 예시: 'carejoa'
  const subCollection = req.query.subCollection; // 예시: 'request'
  const documentId = req.query.documentId; // 예시: 'documentId'

  try {
    // 특정 사용자의 하위 컬렉션 참조
    const subCollectionRef = db
      .collection("database")
      .doc(userId)
      .collection(subCollection);

    // 문서를 삭제합니다.
    await subCollectionRef.doc(documentId).delete();

    // 성공적으로 문서가 삭제되었음을 응답
    res.status(200).send({ message: "Document successfully deleted." });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).send("Error deleting document");
  }
});

app.get("/getReviews", async (req, res) => {
  try {
    const { page = 1, limit = 10, uid } = req.query; // 쿼리 파라미터에서 페이지와 개수 가져오기

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum; // 오프셋 계산

    // 'users' 컬렉션에서 'age' 필드가 25 이상인 문서를 쿼리
    const querySnapshot = await db
      .collection("database")
      .doc("carejoa")
      .collection("REVIEWS")
      .orderBy("createdAt") // 정렬할 필드 이름 입력
      .where("userId", "==", uid)
      // .offset(offset) // 오프셋 적용
      // .limit(limitNum) // 제한 개수 적용
      .get();

    // 쿼리 결과가 비어있는지 확인
    if (querySnapshot.empty) {
      return res.status(404).json({ message: "No matching documents found" });
    }

    // 쿼리 결과를 배열로 저장
    let docs = [];
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
    });

    // 쿼리 결과 반환
    return res.status(200).json(docs);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: error.message });
  }
});

// POST 요청을 받는 /payments/complete
app.post("/payment/complete", async (req, res) => {
  try {
    // 요청의 body로 paymentId가 오기를 기대합니다.
    const { paymentId, amount, uid, cash } = JSON.parse(req.body);

    console.log(paymentId, amount, uid, cash);

    // console.log(
    //   amount,
    //   `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`
    // );

    // 1. 포트원 결제내역 단건조회 API 호출
    const paymentResponse = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `PortOne wf9C8KsJJ63Pvt3Jnl2uloC2ya1t5UvF3Q3pJFUYL2gNKoHE6b8UVQTjvTdxmO8UxnHsg2f87oK9bAUP`,
        },
      }
    );
    if (!paymentResponse.ok) {
      throw new Error(`paymentResponse: ${await paymentResponse.json()}`);
    }
    const payment = await paymentResponse.json();

    // console.log("payment", payment);

    // 2. 고객사 내부 주문 데이터의 가격과 실제 지불된 금액을 비교합니다.

    // console.log("결제", payment.amount.total, amount);
    if (payment.amount.total === amount) {
      switch (payment.status) {
        case "VIRTUAL_ACCOUNT_ISSUED": {
          const paymentMethod = payment.paymentMethod;
          // 가상 계좌가 발급된 상태입니다.
          // 계좌 정보를 이용해 원하는 로직을 구성하세요.
          break;
        }
        case "PAID": {
          // 모든 금액을 지불했습니다! 완료 시 원하는 로직을 구성하세요.

          // 1. payment 데이터를 저장합니다.
          try {
            // 특정 사용자의 하위 컬렉션 참조
            const docRef = db
              .collection("database")
              .doc("carejoa")
              .collection("PAYMENTS")
              .doc(paymentId);

            await docRef.set(
              { ...payment, uid: uid, cash: cash },
              { merge: true }
            );

            // 성공적으로 문서가 저장되었음을 응답
            console.log({ message: "Payment Document successfully saved." });
          } catch (error) {
            console.error("Error saving document:", error);
            res.status(500).send("Error saving document");
          }

          // 2. 유저 캐시 업데이트
          try {
            // 특정 사용자의 하위 컬렉션 참조
            const docRef = db
              .collection("database")
              .doc("carejoa")
              .collection("USERS")
              .doc(uid);

            const userInfo = (await docRef.get()).data();

            console.log("USER DATA : ", userInfo);
            // 문서를 변경합니다.
            await docRef.update(
              { cash: (userInfo.cash || 0) + cash },
              { merge: true }
            );

            // 성공적으로 문서가 변경되었음을 응답
            console.log({ message: "USER Document successfully updated." });
          } catch (error) {
            console.error("Error updating document:", error);
            // res.status(500).send("Error updating document");
          }

          res.status(200).send(payment);
          break;
        }
      }
    } else {
      // 결제 금액이 불일치하여 위/변조 시도가 의심됩니다.
    }
  } catch (e) {
    // 결제 검증에 실패했습니다.
    res.status(400).send(e);
  }
});

exports.api = functions.https.onRequest(app);
