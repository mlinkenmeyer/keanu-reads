const bookList = document.querySelector(".books-of-the-month");

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

//pre-sets to false to make sure
//books that are added get an active class
let currentCarouselItem = null;
let booksAdded = 0;
const carouselInner = document.querySelector(".carousel-inner");

const createBook = (book) => {
  //moved book cards here instead
  const newCard = document.createElement("div");
  newCard.className = "book-card";

  const cardImage = document.createElement("img");
  cardImage.className = "card-img-top";
  newCard.appendChild(cardImage);
  cardImage.src = `http://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
  cardImage.alt = book.title;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  newCard.appendChild(cardBody);

  const cardTitle = document.createElement("h4");
  cardTitle.className = "card-title";
  cardBody.appendChild(cardTitle);
  cardTitle.textContent = book.title;

  const cardText = document.createElement("h5");
  cardText.className = "author-text";
  cardBody.appendChild(cardText);

  const descriptionText = document.createElement("p");
  descriptionText.className = "description-text";
  cardBody.appendChild(descriptionText);

  // Note: This is for when, on hover, you can view the full book details
  // And like a book with two buttons displayed over top.
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  const seeMoreBtn = document.createElement("a");
  seeMoreBtn.className = "btn btn-secondary";
  seeMoreBtn.textContent = "See More";

  const likeButton = document.createElement("a");
  likeButton.className = "btn btn-primary";
  likeButton.id = "like-button";
  cardBody.appendChild(likeButton);
  likeButton.textContent = "♥︎";
  likeButton.addEventListener("click", () => {
    if (likeButton.textContent === "♥︎") {
      likeButton.textContent = "♡";
    } else {
      likeButton.textContent = "♥︎";
    }
  });

  //Two Buttons now displaying on overlay instead of in body
  overlay.appendChild(seeMoreBtn);
  overlay.appendChild(likeButton);

  newCard.appendChild(overlay);

  //hides the HTML card's template so you don't see the default card
  newCard.classList.remove("template");

  if (booksAdded % 3 === 0) {
    currentCarouselItem = document.createElement("div");
    currentCarouselItem.className =
      "carousel-item d-flex justify-content-around";

    if (booksAdded === 0) {
      currentCarouselItem.classList.add("active");
    }
    carouselInner.appendChild(currentCarouselItem);
  }

  currentCarouselItem.appendChild(newCard);
  booksAdded++;

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
  descriptionText.textContent =
    book.description || "Description not available.";

  newCard.addEventListener("click", (e) => {
    displayHighLightedBook(book);
  });
};
//begin fetches for db.json

const fetchBooksFromDB = () => {
  carouselInner.innerHTML = "";
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

$("#bookCarousel").carousel();
// Comment form

//creates highlighted book section

const highlightedBookSection = document.querySelector("#highlighted-book");

const highlightedBookMonth = document.createElement("h5");
highlightedBookSection.append(highlightedBookMonth);

const highlightedBookTitle = document.createElement("h3");
highlightedBookSection.append(highlightedBookTitle);

const highlightedBookAuthor = document.createElement("p");
highlightedBookSection.append(highlightedBookAuthor);

const highlightedBookDescription = document.createElement("p");
highlightedBookSection.append(highlightedBookDescription);

const highlightedBookImage = document.createElement("img");
highlightedBookSection.append(highlightedBookImage);

//function to display the highlighted book; called in the createBook function
const displayHighLightedBook = (book) => {
  highlightedBookMonth.textContent = `Keanu\'s ${book.month} Pick`;
  highlightedBookTitle.textContent = book.title;
  highlightedBookAuthor.textContent = book.author;
  highlightedBookDescription.textContent = book.description;
  highlightedBookImage.src = `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
};

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
    <button class ="delete-button">Delete Review</button>
  `;
  const deleteButton = commentDetails.querySelector(".delete-button");
  deleteButton.addEventListener("click", () => {
    commentDiv.removeChild(commentDetails);
  });

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

  filterByMonth.addEventListener("change", (e) => {
    console.log(e);
    const selectedMonth = e.target.value;
    console.log(selectedMonth);
  });
};

// Create the month dropdown
createMonthDropdown();
