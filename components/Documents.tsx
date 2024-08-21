import { auth } from "@clerk/nextjs/server";
import PlaceHolderDocument from "./PlaceHolderDocument";
import { adminDb } from "@/firebaseAdmin";
import Document from "./Document";
import { ChevronRight } from "lucide-react";
import FloatingBubbles from "./FloatingBubbles";

async function Documents() {
  auth().protect();
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized access");
  }

  const documentsSnapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();

  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-900">
      {/* <FloatingBubbles /> */}
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Your Documents</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold">All Files</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 [&>*]:border [&>*]:border-purple-600 [&>*]:rounded-lg">
            {documentsSnapshot.docs.map((doc) => {
              const { name, downloadUrl, size } = doc.data();
              return (
                <Document
                  key={doc.id}
                  id={doc.id}
                  name={name}
                  size={size}
                  downloadUrl={downloadUrl}
                />
              );
            })}
            <PlaceHolderDocument />
          </div>
        </div>
        <div className="mt-6 text-right">
          <button
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            disabled
          >
            View All
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
export default Documents;
