const bookList = document.querySelector("div");
bookList.className = "books-of-the-month";

const searchBookByTitle = (title) => {
  fetch(`https://openlibrary.org/search.json?title=${title}`)
    .then((response) => response.json())
    .then((data) => {
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

  if (book.author_key && book.author_key.length) {
    // this takes in the first author of the books
    fetchAuthor(book.author_key[0]).then((authorData) => {
      if (authorData) {
        const bookAuthor = document.createElement("ul");
        bookAuthor.className = "book-author";
        bookAuthor.textContent = authorData.name;
        bookName.appendChild(bookAuthor);
      }
    });
  }

  //Like Button Creation & toggler
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

  // Month Dropdown Menu
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
};

//begin fetches for db.json
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

fetchBooksFromDB();

//creates book review form
const commentDiv = document.querySelector("#comment-section");

const commentForm = document.querySelector("#comment-form");
commentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formContent = {
    username: document.querySelector("#username").value,
    title: document.querySelector("#commentTitle").value,
    comment: document.querySelector("#newComment").value,
  };
  console.log(formContent);

  const commentDetails = document.createElement("div");
  commentDetails.innerHTML = `
  <p> Username: ${formContent.username} </p>
  <p> Title: ${formContent.title} </p>
  <p> Comment: ${formContent.comment} </p>
  `;

  commentDiv.appendChild(commentDetails);

  commentForm.reset();
});
