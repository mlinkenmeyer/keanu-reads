const bookList = document.querySelector("div");
bookList.className = "books-of-the-month";

const createBook = (book) => {
  const bookName = document.createElement("ul");
  bookName.className = "book-name";
  bookName.textContent = book.title;
  bookList.appendChild(bookName);
  const bookAuthor = document.createElement("ul");
  bookAuthor.className = "book-author";
  bookAuthor.textContent = book.authors[1];
  bookName.appendChild(bookAuthor);
  const bookCover = document.createElement("img");
  bookCover.className = "book-cover";
  bookCover.src = book.covers[0];
  bookName.appendChild(bookCover);
};

fetch("https://openlibrary.org/works/OL15987908W.json")
  .then((r) => r.json())
  .then((data) => {
    console.log(data);
    createBook(data);
  });
