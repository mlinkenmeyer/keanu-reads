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
