import axios from "axios";

export const serviceAPI = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// const getBooks = (body) => serviceAPI.get("/books");

// const addBook = (body) => serviceAPI.post("/books", body);
// const deleteBook = (id) => serviceAPI.delete(`/books/${id}`);
// const updateBook = (id, body) => serviceAPI.put(`/books/${id}`, body);

// export { addBook, getBooks, deleteBook, updateBook };
