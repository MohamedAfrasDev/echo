// convex/example.ts
import { components } from "../../_generated/api";
import { RAG } from "@convex-dev/rag";
// Any AI SDK model that supports embeddings will work.
import { openai } from "@ai-sdk/openai";

const rag = new RAG(components.rag, {
    textEmbeddingModel: openai.embedding("text-embedding-3-small"),
    embeddingDimension: 1536, // Needs to match your embedding model
});

export default rag;