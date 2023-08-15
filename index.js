const bookList = document.querySelector(".books-of-the-month");

const searchBookByTitle = (title) => {
  fetch(`https://openlibrary.org/search.json?title=${title}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.docs && data.docs.length) {
        createBook(data.docs[0]);
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
// FIX LATER, this will eventually be the description.
// const fetchBookDescription = (isbn) => {
//   return fetch(
//     `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=details&format=json`
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       const details = extractDetailsFromResponse(data);
//       if (details && details.description) {
//         return details.description.value;
//       } else {
//         return "This book doesn't have a description.";
//       }
//     });
// };

// const extractDetailsFromResponse = (response) => {
//   for (let topLevelKey in response) {
//     if (
//       response.hasOwnProperty(topLevelKey) &&
//       response[topLevelKey].hasOwnProperty("details")
//     ) {
//       return response[topLevelKey].details;
//     }
//   }
//   return null;
// };

const createBook = (book) => {
  const templateCard = document.querySelector('.book-card.template');
  const newCard = templateCard.cloneNode(true);

  newCard.classList.remove('template');

  const cardTitle = newCard.querySelector('.card-title');
  cardTitle.textContent = book.title;

  const cardImage = newCard.querySelector('.card-img-top');
  cardImage.src = `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  cardImage.alt = book.title;

  const cardText = newCard.querySelector('.author-text');

  if (book.author_key && book.author_key.length) {
    fetchAuthor(book.author_key[0]).then((authorData) => {
      if (authorData) {
        cardText.textContent = authorData.name;
      }
    });
  } else {
    cardText.textContent = "Author info not available.";
  }


  // This will eventually be the book description in our JSON
  // if (book.isbn && book.isbn.length) {
  //   fetchBookDescription(book.isbn[0])
  //     .then((description) => {
  //       const bookDescription = document.createElement("p");
  //       bookDescription.className = "book-description";
  //       bookDescription.textContent = description;
  //       newCard.appendChild(bookDescription);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching book description:", error);
  //     });
  // }

  // Like Button
  const likeButton = newCard.querySelector("#like-button");
  likeButton.textContent = "Like book";
  likeButton.addEventListener("click", () => {
    if (likeButton.textContent === "Like book") {
      likeButton.textContent = "Unlike book";
    } else {
      likeButton.textContent = "Like book";
    }
  });

  bookList.appendChild(newCard);
};

const createMonthDropdown = () => {
  const months = ["August", "September", "October", "November", "December"];
  const filterByMonth = document.createElement("select");
  filterByMonth.id = "filter-by-month";
  bookList.appendChild(filterByMonth);

  const monthOptions = document.createElement("option");
  monthOptions.textContent = "Select month";
  filterByMonth.appendChild(monthOptions);

  for (let month of months) {
    const monthOption = document.createElement("option");
    monthOption.value = month;
    monthOption.textContent = month;
    filterByMonth.appendChild(monthOption);
  }
};

// Fetch books from db.json
const fetchBooksFromDB = () => {
  fetch("http://localhost:3000/books")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length) {
        data.forEach((book) => {
          if (!book.image) {
            searchBookByTitle(book.title);
          } else {
            createBook(book);
          }
        });
      } else {
        console.log("No books found in db.json");
      }
    })
    .catch((error) => {
      console.error("Failed to fetch books from db.json:", error);
    });
};

// Fetch and display the books when the page loads
fetchBooksFromDB();

// Comment form
const commentDiv = document.querySelector("#comment-section");
const commentForm = document.querySelector("#comment-form");

commentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formContent = {
    username: document.querySelector("#username").value,
    title: document.querySelector("#commentTitle").value,
    comment: document.querySelector("#newComment").value,
  };

  const commentDetails = document.createElement("div");
  commentDetails.innerHTML = `
    <p> Username: ${formContent.username} </p>
    <p> Title: ${formContent.title} </p>
    <p> Comment: ${formContent.comment} </p>
  `;

  commentDiv.appendChild(commentDetails);
  commentForm.reset();
});

// Create the month dropdown
createMonthDropdown();
