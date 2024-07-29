"use client";

import { useRouter } from "next/navigation";
import byteSize  from "byte-size";

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

  return (
    <div className="flex flex-col w-64 h-80 rounded-xl bg-white drop-shadow-sm justify-between p-4 transition-all transform hover:scale-185 hover:bg-indigo-600 hover:text-white cursor-pointer group">
      <div className="flex-1" onClick={() => {
        router.push(`/dashboard/files/${id}`);
      }}>
        <p className="font-semibold line-clamp-2">{name}</p>
        <p className="text-sm text-gray-500 group-hover:text-indigo-100">175<span className="text-indigo-600 font-semibold"> KB</span></p>
      </div>
    </div>
  );
}

// TODO: Fix Byte size display as it is not working.

export default Document;
