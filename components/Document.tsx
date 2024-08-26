"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { FileIcon, TrashIcon } from "lucide-react";
import useSubscription from "@/hooks/useSubscription";
import React, { useTransition } from "react";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import deleteDocument from "@/actions/deleteDocument";

function Document({
  id,
  name,
  size,
  downloadUrl,
}: {
  id: string;
  name: string;
  size: string;
  downloadUrl: string;
}) {
  const router = useRouter();
  const { hasActiveMembership } = useSubscription();
  const [isDeleting, startTransition] = useTransition();
  
  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength - 3) + "..."
      : text;
  };

  return (
    <div
      className="flex flex-col w-64 h-80 rounded-xl bg-white border border-gray-200 shadow-sm p-4 transition-all duration-300 ease-in-out hover:shadow-md hover:border-purple-400 hover:scale-105 cursor-pointer group"
      onClick={() => router.push(`/dashboard/files/${id}`)}
    >
      <div className="flex-1 flex flex-col items-center justify-center mb-4">
        <FileIcon className="w-20 h-20 text-purple-500 group-hover:text-purple-600 mb-2" />
        {/* <p className="font-semibold text-center break-words line-clamp-2 group-hover:text-purple-700">{name}</p> */}
        {/* Option 2: Text truncation (commented out) */}
        <p
          className="font-semibold text-center group-hover:text-purple-700 break-words"
          title={name}
        >
          {truncateText(name, 50)}
        </p>
      </div>
      <div className="mt-auto">
        <p className="text-sm text-gray-500 group-hover:text-purple-600">
          {byteSize(parseInt(size)).toString()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 justify-end">
        {/* 1. Delete document button. */}
        <Button
          variant="outline"
          disabled={isDeleting || !hasActiveMembership}
          onClick={() => {
            const prompt = window.confirm(
              "Are you sure you want to delete this document?"
            );
            if (prompt) {
              // delete the document
              startTransition(async () => {
                await deleteDocument(id);
              });
            }
          }}
        >
          <TrashIcon className="h-8 w-8 text-red-500" />
          {!hasActiveMembership && (
            <span className="text-red-500 ml-2">PRO Feature</span>
          )}
        </Button>

        {/* 2. Download Document button. */}
        <Button variant="secondary" asChild>
          <a 
          href={downloadUrl}          
          download>
            <DownloadCloud className="h-8 w-8 text-indigo-600"/>
          </a>
        </Button>

      </div>
    </div>
  );
}

export default Document;
