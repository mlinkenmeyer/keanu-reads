const bookList = document.querySelector("div");
bookList.className = "books-of-the-month";

const createBook = (book) => {
  const bookName = document.createElement("ul");
  bookName.className = "book-name";
  bookName.textContent = book.title;
  bookList.appendChild(bookName);
  const bookCover = document.createElement("img");
  bookCover.className = "book-cover";
  bookCover.src = `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`;
  bookName.appendChild(bookCover);
  const bookDescription = document.createElement("ul");
  bookDescription.className = "book-description";
  bookDescription.textContent = book.description;
  bookName.appendChild(bookDescription);
  // author portion to be adjusted later
  //   const addAuthor = (author) => {
  //     const bookAuthor = document.createElement("ul");
  //     bookAuthor.className = "book-author";
  //     bookAuthor.textContent = book.author_key;
  //     bookName.appendChild(bookAuthor);
  //   };
};

fetch("https://openlibrary.org/works/OL15987908W.json")
  .then((r) => r.json())
  .then((data) => {
    console.log(data);
    createBook(data);
  });

// to be adjusted later
// fetch("https://openlibrary.org/authors/${author}.json")
//   .then((r) => r.json())
//   .then((data) => {
//     console.log(data);
//     addAuthor(data);
//   });

// fetch("http://localhost:3000/books")
//   .then((r) => r.json())
//   .then((data) => {
//     console.log(data);
//   });
