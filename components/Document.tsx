"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import { FileIcon } from "lucide-react";

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
    </div>
  );
}

export default Document;
