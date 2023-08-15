const bookList = document.querySelector("div");
bookList.className = "books-of-the-month";

const searchBookByTitle = (title) => {
  fetch(`https://openlibrary.org/search.json?title=${title}`)
    .then((response) => response.json())
    .then((data) => {
      //console.log(data.docs[0])
      if (data.docs && data.docs.length) {
        createBook(data.docs[0]); // Only use the first result
      } else {
        console.log("No books found for title:", title);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch books:", error);
    });
};

const fetchAuthor = (authorId) => {
  return fetch(`https://openlibrary.org/authors/${authorId}.json`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Failed to fetch author:", error);
    });
};

const createBook = (book) => {
  const bookName = document.createElement("ul");
  bookName.className = "book-name";
  bookName.textContent = book.title;
  bookList.appendChild(bookName);

  const bookCover = document.createElement("img");
  bookCover.className = "book-cover";
  bookCover.src = `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  bookName.appendChild(bookCover);
  const bookDescription = document.createElement("ul");
  bookDescription.className = "book-description";
  bookDescription.textContent = book.description;
  bookName.appendChild(bookDescription);
  const likeButton = document.createElement("button");
  likeButton.className = "like-button";
  likeButton.textContent = "Like book";
  bookList.appendChild(likeButton);
  likeButton.addEventListener("click", (e) => {
    console.log(e);
    if (likeButton.textContent === "Like book") {
      likeButton.textContent = "Unlike book";
    } else {
      likeButton.textContent = "Like book";
    }
  });
  const months = ["August", "September", "October", "November", "December"];
  const filterByMonth = document.createElement("select");
  filterByMonth.id = "filter-by-month";
  bookList.appendChild(filterByMonth);
  const monthOptions = document.createElement("option");
  monthOptions.textContent = "Select month";
  filterByMonth.appendChild(monthOptions);
  for (let i = 0; i < months.length; i++) {
    const monthOption = document.createElement("option");
    monthOption.value = months[i];
    monthOption.textContent = months[i];
    filterByMonth.appendChild(monthOption);
  }

  // author portion to be adjusted later
  //   const addAuthor = (author) => {
  //     const bookAuthor = document.createElement("ul");
  //     bookAuthor.className = "book-author";
  //     bookAuthor.textContent = book.author_key;
  //     bookName.appendChild(bookAuthor);
  //   };
};

const fetchBookDescription = (isbn) => {
  return fetch(
    `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`
  )
    .then((response) => response.json())
    .then((data) => {
      const details = extractDetailsFromResponse(data);
      if (details && details.description) {
        return details.description.value;
      } else {
        return "This book doesn't have a description.";
      }
    });
};

const extractDetailsFromResponse = (response) => {
  for (let topLevelKey in response) {
    if (
      response.hasOwnProperty(topLevelKey) &&
      response[topLevelKey].hasOwnProperty("details")
    ) {
      return response[topLevelKey].details;
    }
  }
  return null;
};

const fetchBooksFromDB = () => {
  fetch("http://localhost:3000/books")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length) {
        for (let book of data) {
          if (!book.image) {
            searchBookByTitle(book.title);
          } else {
            createBook(book);
          }
        }
      } else {
        console.log("No books found in db.json");
      }
    })
    .catch((error) => {
      console.error("Failed to fetch books from db.json:", error);
    });
};

// Initialization or Main
fetchBooksFromDB();
