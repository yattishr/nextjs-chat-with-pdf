"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from "@/firebase";
import { collection, doc } from "firebase/firestore";

// number of documens the user is allowed to have.
const PRO_LIMIT = 20;
const FREE_LIMIT = 3;

function useSubscription() {
  const [hasActiveMembership, sethasActiveMembership] = useState(null);
  const [isOverFileLimit, setisOverFileLimit] = useState(false);
  const [isOverMessageLimit, setisOverMessageLimit] = useState(false);
  const { user } = useUser();

  // Listen for the User documents
  const [snapshot, loading, error] = useDocument(
    user && doc(db, "users", user.id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  // Listen to the users files collection
  const [filesSnapshot, filesLoading] = useCollection(
    user && collection(db, "users", user?.id, "files")
  );

  // console.log(`--- Displaying filesSnapshot from useSubscription: ${JSON.stringify(filesSnapshot)} ---`)

  useEffect(() => {
    console.log(`--- Entering useEffect on useSubscription ---`);

    // console.log(`--- Logging snapshot from useSubscription: ${JSON.stringify(snapshot)} ---`);

    if (!snapshot) return;

    const data = snapshot.data();
    // console.log(`--- Logging data from useSubscription: ${JSON.stringify(data)} ---`);

    if (!data) return;

    sethasActiveMembership(data.hasActiveMembership);

    console.log(`--- Logging hasActiveMembership from useSubscription: ${data.hasActiveMembership} ---`);
  }, [snapshot]);

  // checks to see whether the users files are over the limit.
  useEffect(() => {
    if (!filesSnapshot || hasActiveMembership === null) return;

    const files = filesSnapshot.docs;
    const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

    console.log("Checking if user is over the file limit", files.length, usersLimit);

    setisOverFileLimit(files.length >= usersLimit);
  }, [filesSnapshot, hasActiveMembership, PRO_LIMIT, FREE_LIMIT]); // include everything that the useEffect uses in the dependancy array.

  return { hasActiveMembership, loading, error, isOverFileLimit, filesLoading };
}

export default useSubscription;
