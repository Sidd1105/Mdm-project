"""
Loads and caches the ANN model, preprocessor, and FAISS vector store
once at application startup via FastAPI lifespan.
"""

import logging
import os

import joblib
import tensorflow as tf
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings
from app.utils.constants import BUILT_IN_POLICIES

logger = logging.getLogger("carbon_api.loader")

# ── Module-level singletons (populated at startup) ────────────────────────────

ann_model = None
preprocessor = None
vector_db = None
embeddings_model = None


def load_ann_model():
    global ann_model
    logger.info(f"Loading ANN model from: {settings.ANN_MODEL_PATH}")
    ann_model = tf.keras.models.load_model(
    settings.ANN_MODEL_PATH,
    compile=False,
    safe_mode=False)
    logger.info("ANN model loaded successfully.")
    return ann_model


def load_preprocessor():
    global preprocessor
    logger.info(f"Loading preprocessor from: {settings.PREPROCESSOR_PATH}")
    preprocessor = joblib.load(settings.PREPROCESSOR_PATH)
    logger.info("Preprocessor loaded successfully.")
    return preprocessor


def load_embeddings():
    global embeddings_model
    logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL}")
    embeddings_model = HuggingFaceEmbeddings(
        model_name=settings.EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )
    logger.info("Embedding model loaded.")
    return embeddings_model


def load_vector_db():
    """
    Loads FAISS index from disk if it exists, otherwise builds one
    from the built-in policy documents.
    """
    global vector_db

    index_path = settings.FAISS_INDEX_PATH
    faiss_file = os.path.join(index_path, "index.faiss")

    emb = embeddings_model or load_embeddings()

    if os.path.exists(faiss_file):
        logger.info(f"Loading FAISS index from: {index_path}")
        vector_db = FAISS.load_local(
            index_path, emb, allow_dangerous_deserialization=True
        )
        logger.info(f"FAISS index loaded — {vector_db.index.ntotal} vectors.")
    else:
        logger.warning(
            "FAISS index not found on disk. Building from built-in policy documents."
        )
        vector_db = _build_index_from_policies(emb)

    return vector_db


def _build_index_from_policies(emb) -> FAISS:
    """Builds a FAISS index from the hardcoded policy corpus."""
    docs = [
        Document(
            page_content=p["content"],
            metadata={"source": p["source"]},
        )
        for p in BUILT_IN_POLICIES
    ]
    splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=60)
    chunks = splitter.split_documents(docs)
    logger.info(f"Built {len(chunks)} chunks from {len(docs)} policy documents.")
    db = FAISS.from_documents(chunks, emb)
    logger.info(f"In-memory FAISS index built — {db.index.ntotal} vectors.")
    return db


def get_ann_model():
    if ann_model is None:
        raise RuntimeError("ANN model is not loaded. Check startup sequence.")
    return ann_model


def get_preprocessor():
    if preprocessor is None:
        raise RuntimeError("Preprocessor is not loaded. Check startup sequence.")
    return preprocessor


def get_vector_db():
    if vector_db is None:
        raise RuntimeError("Vector DB is not loaded. Check startup sequence.")
    return vector_db


def load_all():
    """Called once at application startup."""
    load_preprocessor()
    load_ann_model()
    load_embeddings()
    load_vector_db()
    logger.info("All models and indices loaded successfully.")
