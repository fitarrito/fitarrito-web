import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./features/cartSlice";
import menuSlice from "./features/menuSlice";
import trialSlice from "./features/slice"
import { persistReducer, persistStore } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Fix the storage import

// 🔹 Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage,
  version: 1, // Optional: Helps with migrations
};

// 🔹 Combine Reducers
const rootReducer = combineReducers({
  menu: menuSlice,
  cart: cartSlice,
  trial:trialSlice
});

// 🔹 Apply Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Create Store (Single Instance)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 🔹 Create Persistor
export const persistor = persistStore(store);

// 🔹 Type Definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
