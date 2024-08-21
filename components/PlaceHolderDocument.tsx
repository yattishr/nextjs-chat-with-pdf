"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { FrownIcon, PlusCircleIcon } from "lucide-react";
import useSubscription from "@/hooks/useSubscription";

function PlaceHolderDocument() {
  const router = useRouter();
  const { isOverFileLimit } = useSubscription();

  const handleClick = () => {
    // Check if user is over free file limit. push to the upgrade page if they are.
    if (isOverFileLimit) {
      router.push("/dashboard/upgrade");
    } else {
      router.push("/dashboard/upload");
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="flex flex-col items-center justify-center w-64 h-80 rounded-xl bg-gray-200 drop-shadow-md text-gray-400"
    >
      {isOverFileLimit ? (
        <FrownIcon className="h-16 w-16" />
      ) : (
        <PlusCircleIcon className="h-16 w-16" />
      )}
      <p className="font-semibold">
        {isOverFileLimit ? "Upgrade to add more documents" : "Add a document"}
      </p>
    </Button>
  );
}

export default PlaceHolderDocument;
