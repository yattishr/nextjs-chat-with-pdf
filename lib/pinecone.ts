import { Pinecone } from '@pinecone-database/pinecone';

const pineconeClient = new Pinecone({
  apiKey: '72978fa2-aa01-4f84-ba5f-1120edff7dea'
});

export default pineconeClient

// pinecone index name: chatpdf
// https://chatpdf-fc72da9.svc.aped-4627-b74a.pinecone.io