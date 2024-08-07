let books = [];

fetch("books.json")
  .then((response) => response.json())
  .then((result) => {
    books = result;
    displayData(books);
  })
  .catch((error) => {
    console.log("Error fetching the books:", error);
  });

function searchBookById(bookId) {
  return new Promise((resolve) => {
    const book = books.find((b) => b.bookId == bookId);
    resolve(book);
  });
}

function searchBooksByGenre(genre) {
  return new Promise((resolve) => {
    const filteredBooks = books.filter(
      (b) => b.genre.toLowerCase() === genre.toLowerCase()
    );
    resolve(filteredBooks);
  });
}

function searchBooksByPrice(price) {
  return new Promise((resolve) => {
    const filteredBooks = books.filter((b) => b.price === price);
    resolve(filteredBooks);
  });
}

function sortBooksByPrice(order) {
  return new Promise((resolve) => {
    books.sort((a, b) =>
      order === "asc" ? a.price - b.price : b.price - a.price
    );
    resolve(books);
  });
}

document
  .getElementById("arrow-up-asc")
  .addEventListener("click", function () {
    sortBooksByPrice("asc")
      .then((sortedBooks) => {
        displayData(sortedBooks);
      })
      .catch((error) => {
        console.log(error);
      });
  });

document
  .getElementById("arrow-down-desc")
  .addEventListener("click", function () {
    sortBooksByPrice("desc")
      .then((sortedBooks) => {
        displayData(sortedBooks);
      })
      .catch((error) => {
        console.log(error);
      });
  });

document
  .getElementById("btn-search-id")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const inputElement = document.getElementById("input-search-id");
    const bookId = inputElement.value;
    if (bookId) {
      searchBookById(bookId)
        .then((book) => {
          if (book) {
            displaySimilarData([book]);
          } else {
            console.log("Book not found");
          }
        })
        .catch((error) => {
          console.log("Error searching by bookId:", error);
        });
    }
    inputElement.value = "";
  });

document
  .getElementById("btn-search-genre")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const inputElement = document.getElementById("input-search-genre");
    const genre = inputElement.value;
    if (genre) {
      searchBooksByGenre(genre)
        .then((books) => {
          displaySimilarData(books);
        })
        .catch((error) => {
          console.log("Error searching by genre:", error);
        });
    }
    inputElement.value = "";
  });

document
  .getElementById("btn-search-price")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const inputElement = document.getElementById("input-search-price");
    const price = inputElement.value;
    if (price) {
      searchBooksByPrice(Number(price))
        .then((books) => {
          displaySimilarData(books);
        })
        .catch((error) => {
          console.log("Error searching by price:", error);
        });
    }
    inputElement.value = "";
  });

function displaySimilarData(books) {
  const similarBooks = document.querySelector("#table-similar-books tbody");
  similarBooks.innerHTML = "";
  books.forEach((book) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${book.bookId}</td>
      <td>${book.genre}</td>
      <td>${book.price}</td>
      <td><button class="btn-examine" onclick="examineBook(${book.bookId})">Examine</button></td>
    `;
    similarBooks.appendChild(tr);
  });
}

function displayData(books) {
  const allBooks = document.querySelector("#table-all-books tbody");
  allBooks.innerHTML = "";
  books.forEach((book) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${book.bookId}</td>
      <td>${book.genre}</td>
      <td>${book.price}</td>
      <td><button class="btn-examine" onclick="examineBook(${book.bookId})">Examine</button></td>
    `;
    allBooks.appendChild(tr);
  });
}

function displayExaminedBook(book) {
  const bookIdSpan = document.querySelector("#examined-book-id");
  const priceSpan = document.querySelector("#examined-book-price");
  const genreSpan = document.querySelector("#examined-book-genre");
  bookIdSpan.textContent = book.bookId;
  genreSpan.textContent = book.genre;
  priceSpan.textContent = book.price;
}

function examineBook(bookId) {
  const book = books.find((b) => b.bookId === bookId);
  if (book) {
    const modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = `
      <h2>Book Details</h2>
      <p>ID: ${book.bookId}</p>
      <p>Genre: ${book.genre}</p>
      <p>Price: ${book.price}</p>
    `;
    const modal = document.getElementById("bookModal");
    modal.style.display = "block";

    const closeButton = document.querySelector(".close");
    closeButton.onclick = function () {
      modal.style.display = "none";
    };

    window.onkeydown = function (e) {
      if (e.key === "Escape") {
        modal.style.display = "none";
      }
    };

    displayExaminedBook(book);
  } else {
    console.log("Book not found");
  }
}
