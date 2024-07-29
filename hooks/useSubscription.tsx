"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from "@/firebase";
import { collection, doc } from "firebase/firestore";

// number of documens the user is allowed to have.
const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

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

  useEffect(() => {
    if (!snapshot) return;

    const data = snapshot.data();
    if (!data) return;

    sethasActiveMembership(data.activeMembership);
  }, [snapshot]);

  // checks to see whether the users files are over the limit.
  useEffect(() => {
    if (!filesSnapshot || hasActiveMembership === null) return;
    
    const files = filesSnapshot.docs;
    const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

    console.log(
      "Checking if user is over the file limit",
      files.length,
      usersLimit
    );

    setisOverFileLimit(files.length >= usersLimit);
  }, [filesSnapshot, hasActiveMembership, PRO_LIMIT, FREE_LIMIT]); // include everything that the useEffect uses in the dependancy array.

  return { hasActiveMembership, loading, error, isOverFileLimit, filesLoading };
}

export default useSubscription;
