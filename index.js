
const bookList = document.querySelector(".books-of-the-month");
const currentBookBanner = document.querySelector(".current-book");
const currentMonthTitle = document.createElement("h1");

currentMonthTitle.textContent = "August Pick";
currentBookBanner.appendChild(currentMonthTitle);

const currentMonthBook = document.createElement("p");
currentMonthBook.textContent = "Current Book Title";
currentBookBanner.appendChild(currentMonthBook);

const keanuPhoto = document.createElement("img");
keanuPhoto.src = `https://www.cheatsheet.com/wp-content/uploads/2023/03/Sad-Keanu-Reeves-meme.jpg`;
currentBookBanner.appendChild(keanuPhoto);

const searchBookByTitle = (title) => {
  return fetch(`https://openlibrary.org/search.json?title=${title}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.docs && data.docs.length) {
        return data.docs[0];
      } else {
        console.log("No books found for title:", title);
        return null;
      }
    })
    .catch((error) => {
      console.error("Failed to fetch books:", error);
      return null;
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

  const templateCard = document.querySelector(".book-card.template");
  const newCard = templateCard.cloneNode(true);

  newCard.classList.remove("template");

  const cardTitle = newCard.querySelector(".card-title");
  cardTitle.textContent = book.title;

  const cardImage = newCard.querySelector(".card-img-top");
  cardImage.src = `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
  cardImage.alt = book.title;

  const cardText = newCard.querySelector(".author-text");

  if (book.author_key && book.author_key.length) {
    fetchAuthor(book.author_key[0]).then((authorData) => {
      if (authorData) {
        cardText.textContent = authorData.name;
      }
    });
  } else {
    cardText.textContent = "Author info not available.";
  }
  // Add book description below the author's name
  const descriptionText = newCard.querySelector(".description-text");
  descriptionText.textContent =
    book.description || "Description not available.";

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

//begin fetches for db.json

const fetchBooksFromDB = () => {
  fetch("http://localhost:3000/books")
    .then((response) => response.json())
    .then(async (booksFromDB) => {
      if (booksFromDB && booksFromDB.length) {
        for (let book of booksFromDB) {
          if (!book.image) {
            let bookFromAPI = await searchBookByTitle(book.title);
            if (bookFromAPI) {
              // Merge the book from the API with the book from DB
              book = { ...bookFromAPI, ...book };
            }
          }
          createBook(book);
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


// Comment form

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

  const commentDetails = document.createElement("div");
  commentDetails.innerHTML = `
    <p> Username: ${formContent.username} </p>
    <p> Title: ${formContent.title} </p>
    <p> Comment: ${formContent.comment} </p>
  `;

  commentDiv.appendChild(commentDetails);
  commentForm.reset();
});

//dropdown for months
const createMonthDropdown = () => {
  const months = ["August", "September", "October", "November", "December"];
  const filterByMonth = document.createElement("select");
  filterByMonth.id = "filter-by-month";

  const monthOptions = document.createElement("option");
  monthOptions.textContent = "Select month";
  filterByMonth.appendChild(monthOptions);

  for (let month of months) {
    const monthOption = document.createElement("option");
    monthOption.value = month;
    monthOption.textContent = month;
    filterByMonth.appendChild(monthOption);
  }

  // Append the created dropdown to the month-dropdown div on the DOM
  const monthDropdownDiv = document.getElementById("month-dropdown");
  monthDropdownDiv.appendChild(filterByMonth);
}

// Create the month dropdown
createMonthDropdown();
