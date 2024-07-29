import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "../firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { doc } from "firebase/firestore";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o-mini",
});

export const indexName = "chatpdf";

export async function fetchMessagesFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized access or User not found.");
  }

  console.log("--- Fetching chat history from firestore ---");
  const LIMIT = 5;
  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "asc")
    .limit(LIMIT)
    .get();

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(`-- fetched last ${chatHistory.length} messages successfully --`);
  console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized access.");
  }

  console.log("--- Fetching the download URL from Firebase ---");
  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  console.log(`Logging firebaseRef: ${JSON.stringify(firebaseRef)}`)

  const downloadUrl = firebaseRef.data()?.downloadURL;
  console.log(`--- Download URL: ${downloadUrl} ---`);

  if (!downloadUrl) {
    throw new Error("Download URL not found.");
  }

  // fetch the pdf from the specified url
  const response = await fetch(downloadUrl);

  // load the pdf into a PDF document object
  const data = await response.blob();

  // load the pdf document from the specified path
  console.log(`--- Loading PDF document ---`);
  const loader = new PDFLoader(data);
  const docs = await loader.load();
  console.log(`--- PDF document loaded successfully ---`);

  // split the documents into chunks
  console.log(`--- Splitting documents into chunks ---`);
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`--- Documents split successfully into ${splitDocs.length}---`);

  return splitDocs;
}

export async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string
) {
  if (namespace === null || namespace === undefined || namespace === "")
    throw new Error("Namespace cannot be null or empty");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineConeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized access.");
  }

  let pineconeVectorStore;

  // Generate embeddings for the split documents
  console.log("--- Generating embeddings for the split documents ---");
  const embeddings = new OpenAIEmbeddings();

  const index = await pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(
      `Namespace ${docId} already exists, reusing existing embeddings...`
    );

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    console.log(`Creating new namespace ${docId}...`);
    const splitDocs = await generateDocs(docId);

    console.log(
      `--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store ---`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );

    return pineconeVectorStore;
  }
}

const generateLangchainCompletion = async (docId: string, question: string) => {
  let pineconeVectorStore;

  pineconeVectorStore = await generateEmbeddingsInPineConeVectorStore(docId);
  if (!pineconeVectorStore) throw new Error("Pinecone vector store not found");

  console.log("---Creating a retriever---");
  const retriever = pineconeVectorStore.asRetriever();

  // fetch chat history from the db
  const chatHistory = await fetchMessagesFromDB(docId);

  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory,
    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);

  console.log("--- creating a history aware retriever chain ");
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  console.log("Defining a prompt template for answering questions");
  const historyAwareRetrievalPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's question based on the below context:\n\n{context}",
    ],
    ...chatHistory,
    ["user", "{input}"],
  ]);

  console.log("creating a document combining chain");
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrievalPrompt,
  });

  console.log("creating the main retrieval chain");
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  console.log("running the chain with a sample conversation");
  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  // log the result and return the result
  console.log(reply.answer)
  return reply.answer;
};


export { model, generateLangchainCompletion};
