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

// Firebase Admin SDK 초기화
admin.initializeApp();
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
if (process.env.FUNCTIONS_EMULATOR) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
}

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
    res
      .status(200)
      .send({
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
    const userRecord = await admin.auth().getUser(uid);

    // 사용자 정보 반환
    res.status(200).send(userRecord);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Error fetching user data");
  }
});

app.get("/getDocuments", async (req, res) => {
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

exports.api = functions.https.onRequest(app);
