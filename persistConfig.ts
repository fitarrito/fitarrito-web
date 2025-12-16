import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Create a no-op storage for the server
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
});

// Use localStorage only on the client side
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export default storage;
