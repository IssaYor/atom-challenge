"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreTaskRepository = void 0;
const firestoreClient_1 = require("../firebase/firestoreClient");
const TASKS_COLLECTION = "tasks";
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
class FirestoreTaskRepository {
    constructor() {
        this.collection = firestoreClient_1.db.collection(TASKS_COLLECTION);
    }
    async getByUserEmail(email) {
        const normalized = normalizeEmail(email);
        const snapshot = await this.collection
            .where("userId", "==", normalized)
            .orderBy("createdAt", "desc")
            .get();
        return snapshot.docs.map((doc) => {
            const data = doc.data();
            const createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
            return {
                id: doc.id,
                userId: data.userId,
                title: data.title,
                description: data.description ?? "",
                completed: data.completed ?? false,
                createdAt,
            };
        });
    }
    async create(data) {
        const now = new Date();
        const docRef = this.collection.doc();
        const payload = {
            userId: normalizeEmail(data.userId),
            title: data.title,
            description: data.description ?? "",
            completed: data.completed ?? false,
            createdAt: now.toISOString(),
        };
        await docRef.set(payload);
        return {
            id: docRef.id,
            ...payload,
            createdAt: now,
        };
    }
    async update(id, data) {
        const docRef = this.collection.doc(id);
        const updatePayload = {};
        if (data.title !== undefined) {
            updatePayload.title = data.title;
        }
        if (data.description !== undefined) {
            updatePayload.description = data.description;
        }
        if (data.completed !== undefined) {
            updatePayload.completed = data.completed;
        }
        if (Object.keys(updatePayload).length === 0) {
            return;
        }
        await docRef.update(updatePayload);
    }
    async delete(id) {
        await this.collection.doc(id).delete();
    }
    async getById(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            title: data.title,
            description: data.description ?? "",
            completed: data.completed ?? false,
            createdAt: toDate(data.createdAt),
        };
    }
}
exports.FirestoreTaskRepository = FirestoreTaskRepository;
