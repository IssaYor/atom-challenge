"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreUserRepository = void 0;
const firestoreClient_1 = require("../firebase/firestoreClient");
const USERS_COLLECTION = "users";
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function toDate(value) {
    if (!value)
        return new Date();
    if (typeof value.toDate === "function") {
        return value.toDate();
    }
    return new Date(value);
}
class FirestoreUserRepository {
    constructor() {
        this.collection = firestoreClient_1.db.collection(USERS_COLLECTION);
    }
    async findByEmail(email) {
        const normalized = normalizeEmail(email);
        const doc = await this.collection.doc(normalized).get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        const createdAt = toDate(data.createdAt);
        return {
            id: doc.id,
            email: data.email,
            createdAt,
        };
    }
    async create(email) {
        const normalized = normalizeEmail(email);
        const docRef = this.collection.doc(normalized);
        const now = new Date();
        await docRef.set({
            email: normalized,
            createdAt: now.toISOString(),
        });
        return {
            id: docRef.id,
            email: normalized,
            createdAt: now,
        };
    }
}
exports.FirestoreUserRepository = FirestoreUserRepository;
