"use server";

import { Message } from "@/components/Chat";
import { adminDb } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";

// number of documens the user is allowed to have.
const PRO_LIMIT = 20;
const FREE_LIMIT = 3;

export async function askQuestion(id: string, question: string) {
  auth().protect();
  const { userId } = await auth();

  const chatRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  // Check user membership limits for messages in a document
  const userRef = await adminDb.collection("users").doc(userId!).get();

  // Check if user is on FREE plan and has asked > FREE_LIMIT questions...
  if (!userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= FREE_LIMIT) {
      return {
        success: false,
        message: `You will need to upgrade to PRO tier to ask more than ${FREE_LIMIT} questions.`
      }
    }
  }

  // Check if the user is on PRO plan and has asked more than PRO_LIMIT questions.
  if (userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= PRO_LIMIT) {
      return {
        success: false,
        message: `You have reached the PRO limit of ${PRO_LIMIT} questions per document. Consider upgrading to PRO Plus tier.`
      }
    }
  }

  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  await chatRef.add(userMessage);

  // Generate AI response
  const reply = await generateLangchainCompletion(id, question);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  await chatRef.add(aiMessage);

  return  {
    success: true,
    message: null
  };
}
