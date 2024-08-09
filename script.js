let books = [];

// Function to fetch data from books.json
async function fetchBooksData() {
  const response = await fetch('books.json');
  books = await response.json();
  displayData(books);
}
fetchBooksData();

/*
Function to search a book by its unique id
@param {number} bookId - The id of the book
*/
function searchBookById(bookId) {
  return new Promise((resolve) => {
    resolve(books.find((b) => b.bookId === bookId));
  });
}

/*
Function to search books by its genre
@param {string} genre - The genre of the book
*/
function searchBooksByGenre(genre) {
  return new Promise((resolve) => {
    const filteredBooks = books.filter(
      (b) => b.genre.toLowerCase() === genre.toLowerCase()
    );
    resolve(filteredBooks);
  });
}

/*
Function to search books by its price
@param {number} price - The price of the book
*/
function searchBooksByPrice(price) {
  return new Promise((resolve) => {
    const filteredBooks = books.filter((b) => b.price === price);
    resolve(filteredBooks);
  });
}

/*
Function to sort books in ascending/descending order of price
@param {string} order - The order(asc/desc) of the book's price
*/
function sortBooksByPrice(order) {
  return new Promise((resolve) => {
    books.sort((a, b) =>
      order === 'asc' ? a.price - b.price : b.price - a.price
    );
    resolve(books);
  });
}

document.getElementById('arrow-up-asc').addEventListener('click', async function () {
  const sortedBooks = await sortBooksByPrice('asc');
  displayData(sortedBooks);
});

document.getElementById('arrow-down-desc').addEventListener('click', async function () {
  const sortedBooks = await sortBooksByPrice('desc');
  displayData(sortedBooks);
});

document.getElementById('btn-search-id').addEventListener('click', async function (event) {
  event.preventDefault();
  const inputElement = document.getElementById('input-search-id');
  const bookId = inputElement.value;
  if (bookId) {
    const book = await searchBookById(Number(bookId));
    if (book) {
      displaySimilarData([book]);
    } else {
      console.log('Book not found');
    }
  }
  inputElement.value = '';
});

document.getElementById('btn-search-genre').addEventListener('click', async function (event) {
  event.preventDefault();
  const inputElement = document.getElementById('input-search-genre');
  const genre = inputElement.value;
  if (genre) {
    const books = await searchBooksByGenre(genre);
    if (books) {
      displaySimilarData(books);
    } else {
      console.log('Genre not found');
    }
  }
  inputElement.value = '';
});

document.getElementById('btn-search-price').addEventListener('click', async function (event) {
  event.preventDefault();
  const inputElement = document.getElementById('input-search-price');
  const price = inputElement.value;
  if (price) {
    const books = await searchBooksByPrice(Number(price));
    if (books) {
      displaySimilarData(books);
    } else {
      console.log('price not found');
    }
  }
  inputElement.value = '';
});

/*
Function to display similar books when searched with id, genre, and price
@param {array} books - The list of all similar books
*/
function displaySimilarData(books) {
  const similarBooks = document.querySelector('#table-similar-books tbody');
  similarBooks.innerHTML = '';
  books.forEach((book) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.bookId}</td>
      <td>${book.genre}</td>
      <td>${book.price}</td>
      <td><button class="btn-examine" onclick="examineBook(${book.bookId})">Examine</button></td>
    `;
    similarBooks.appendChild(tr);
  });
}

/*
Function to display all the books from json file
@param {array} books - The list of all books
*/
function displayData(books) {
  const allBooks = document.querySelector('#table-all-books tbody');
  allBooks.innerHTML = '';
  books.forEach((book) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.bookId}</td>
      <td>${book.genre}</td>
      <td>${book.price}</td>
      <td><button class="btn-examine" onclick="examineBook(${book.bookId})">Examine</button></td>
    `;
    allBooks.appendChild(tr);
  });
}

/*
Function to display current examined book 
@param {object} book - The current examined book
*/
function displayExaminedBook(book) {
  const bookIdSpan = document.getElementById('examined-book-id');
  const priceSpan = document.getElementById('examined-book-price');
  const genreSpan = document.getElementById('examined-book-genre');
  bookIdSpan.textContent = book.bookId;
  genreSpan.textContent = book.genre;
  priceSpan.textContent = book.price;
}

/*
Function to examine books by clicking on examine button
@param {number} bookId - The id of the book being examined
*/
function examineBook(bookId) {
  const book = books.find((b) => b.bookId === bookId);
  if (book) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
      <h2>Book Details</h2>
      <p>ID: ${book.bookId}</p>
      <p>Genre: ${book.genre}</p>
      <p>Price: ${book.price}</p>
    `;
    const modal = document.getElementById('bookModal');
    modal.style.display = 'block';

    const closeButton = document.querySelector('.js-close');
    closeButton.onclick = function () {
      modal.style.display = 'none';
    };

    window.onkeydown = function (e) {
      if (e.key === 'Escape') {
        modal.style.display = 'none';
      }
    };

    displayExaminedBook(book);
  } else {
    console.log('Book not found');
  }
}
