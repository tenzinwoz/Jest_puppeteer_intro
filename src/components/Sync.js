import { Box } from "@mui/system";
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore/lite";
import { Button } from "@mui/material";

const firebaseConfig = {
  apiKey: "AIzaSyDiXm_WmyGXFaGA7_f-cl_lA77EE-ftCNE",
  authDomain: "desn-3037.firebaseapp.com",
  projectId: "desn-3037",
  storageBucket: "desn-3037.appspot.com",
  messagingSenderId: "1940508173",
  appId: "1:1940508173:web:5129fd5a90b60098228f44",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getSnapshots() {
  const col = collection(db, "database");
  const q = query(col, orderBy("created_time", "desc"), limit(5));
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map((doc) => doc.data());

  const json = list[0].data;
  window.localStorage.setItem("payload", json);
  alert("Reloading app...");
  window.location.reload();

  return list;
}

async function addSnapshot() {
  const timestamp = String(new Date().getTime());
  const json = window.localStorage.getItem("payload");

  await setDoc(doc(db, "database", timestamp), {
    data: json,
    created_time: timestamp,
  });
}

export default function Sync() {
  const payload = useSelector((state) => state);
  const json = JSON.stringify(payload, null, 4);

  window.localStorage.setItem("payload", json);

  return (
    <Box>
      <hr />
      <Button variant="outlined" onClick={(e) => getSnapshots()}>
        Load
      </Button>
      &nbsp;
      <Button variant="outlined" onClick={(e) => addSnapshot()}>
        Save
      </Button>
      <pre>{json}</pre>
    </Box>
  );
}
