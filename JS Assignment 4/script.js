// In this project, I may not have written perfectly clean or modern code, but I built it on my own.

// Here, I'm selecting all the elements I need. I'll explain each element so you know what it does:

// This is the search input element, from which I take its value to get data according to that value
let searchInputElem = document.querySelector(".search input");

// This is the grid/list view button that controls whether books are displayed in a grid or list layout
let gridOrListBtnElem = document.querySelector(".gridOrList button");

// This is the heading element that changes according to the data (for example, if the user searches)
let headingElem = document.querySelector(".heading");

// This is the books wrapper where all books are created and appended
let booksElem = document.querySelector(".books");

// This represents all the single book elements; I need this to control grid/list view by adding a .list class
let allbookElem = document.querySelectorAll(".book");

// Pagination elements:
// This shows the current page and total pages
let pageInfoElem = document.querySelector(".page-info");
// This is the next button, which displays data for the next page
let nextBtnElem = document.querySelector(".next-btn");
// This is the previous button, which displays data for the previous page
let preBtnElem = document.querySelector(".prev-btn");

// This is the full details section (its wrapper), which will display complete info about a book
let fullDetailsElem = document.querySelector(".full-book-details");

// These are global variables that I can access anywhere:
// This boolean helps me implement grid/list view, so I can check which view the books are currently in
let isGrid = true;

// This keeps track of the current page number, so I can handle pagination correctly
let currentPage = 1;

// This will store all fetched data
let data = {};

// This grid/list view button calls togglingListAndGrid() on click
gridOrListBtnElem.addEventListener("click", togglingListAndGrid);

// In this function, I'm mainly handling classes. If isGrid is true, it means the current view is grid,
// so I add a .list class to .books and all .book elements, change the button icon, and set isGrid to false.
// Otherwise, I remove .list, revert the icon, and set isGrid to true.
function togglingListAndGrid() {
  if (isGrid) {
    booksElem.classList.add("list");
    allbookElem.forEach((bookElem) => bookElem.classList.add("list"));
    gridOrListBtnElem.querySelector("img").src =
      "https://img.icons8.com/sf-black-filled/64/list.png";
    isGrid = false;
  } else {
    booksElem.classList.remove("list");
    allbookElem.forEach((bookElem) => bookElem.classList.remove("list"));
    gridOrListBtnElem.querySelector("img").src =
      "https://img.icons8.com/ios-filled/50/table-1.png";
    isGrid = true;
  }
}

// In this function, I'm just making an API call based on the search query, page number, and sorting,
// then parsing the returned JSON data and returning it
async function getAllBooks(userQuery, pageNo, sorting) {
  let query = userQuery ?? "";
  let page = pageNo || 1;
  let inc = sorting;
  const res = await fetch(
    `https://api.freeapi.app/api/v1/public/books?page=${page}&limit=10&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=${query}`,
    { method: "GET", headers: { accept: "application/json" } }
  );
  const booksData = await res.json();
  return booksData;
}

// This is the main function containing all main logic for displaying books.
// It has three parameters: search query, current page, and inc.
async function displayAllBooks(query, page, inc) {
  // Before calling getAllData(), I add a loading spinner to the books wrapper,
  // so the user sees a loader while data is being fetched, improving user experience.
  booksElem.innerHTML = `<span class="loader"></span>`;

  // Then I set the data variable to whatever is returned
  data = await getAllBooks(query, page, inc);

  // I created this variable to store all books so that once all books are added,
  // I can directly set booksElem's innerHTML to this variable without creating each element
  let booksContent = "";

  // Now, I'm displaying data based on the result.
  // If data is available, I add each book to booksContent, else I display "no data"
  data.data.data.length !== 0 && data.data.data
    ? // Here I destructure volumeInfo or id from data, so I directly get the info I need
      data.data?.data.forEach(({ id, volumeInfo }) => {
        booksContent += `
                <div class="book" onClick="getFullDetails(${id})">
                        <div class="thumb-nail">
                                <img src=${
                                  volumeInfo.imageLinks?.thumbnail ||
                                  "https://habibza.in/wp-content/uploads/2021/08/404.png"
                                } alt="">
                        </div>
                        <div class="content">
                                <div class="title-author">
                                        <p class="title">${volumeInfo.title}</p>
                                        <p class="author"><span>author</span> - ${
                                          volumeInfo.authors?.[0]
                                        }</p>
                                </div>
                                <div class="publisher-date">
                                        <p class="publisher">${
                                          volumeInfo.publisher || "No publisher"
                                        }</p>  
                                        <p class="publishedDate">${
                                          volumeInfo.publishedDate
                                        }</p>
                                </div>
                        </div>
                </div>
            `;
      })
    : // If no data is found, just add "no data" to booksContent
      (booksContent = `<div class="no-data">
            <h3>No Books Found</h3>
            <p>Try searching for a different title or author.</p>
        </div>
        `);

  // Once the above is complete, I set booksElem's innerHTML to booksContent
  booksElem.innerHTML = booksContent;

  // In pageInfoElem, I display the current page and total pages
  pageInfoElem.innerText = `Page ${data.data.page} of ${data.data.totalPages}`;

  // This logic checks if the previous page is available. If data.data.previousPage is false,
  // it means we're on page 1, so the user can't go to page 0. Hence, disable the prev button
  !data.data?.previousPage
    ? (preBtnElem.disabled = true)
    : (preBtnElem.disabled = false);

  // Same logic for next page
  !data.data?.nextPage
    ? (nextBtnElem.disabled = true)
    : (nextBtnElem.disabled = false);

  // Re-select all book elements after rendering, because if we don't re-select,
  // the .list class won't be added when searching
  allbookElem = document.querySelectorAll(".book");
}

// Here I get the details by filtering the data using the book's id
function getFullDetails(id) {
  // I find the book from data, then destructure volumeInfo from that book
  const { volumeInfo } = data.data?.data.filter((book) => book.id === id)[0];

  // I hide the main (all books) page
  document.querySelector(".main").style.display = "none";
  // and show the full details page
  fullDetailsElem.style.display = "block";

  // Then I fill fullDetailsElem with the selected book's data
  fullDetailsElem.innerHTML = `
        <div class="book-detail">
            <div class="thumb-nail">
                <!-- Primary Thumbnail -->
                <img src=${
                  volumeInfo.imageLinks?.thumbnail ||
                  "https://habibza.in/wp-content/uploads/2021/08/404.png"
                } 
                    alt="Book Thumbnail" class="primary-img" />
                <!-- Secondary Thumbnail (Optional) -->
            </div>

            <div class="content">
                <h3 class="title">${volumeInfo.title}</h3>
                <h4 class="subtitle">${volumeInfo.subtitle}</h4>
                <p class="author">
                    <span>Author:</span> ${volumeInfo.authors.map(
                      (auth) => ` ${auth}`
                    )}, 
                </p>
                <p class="publisher">
                    <span>Publisher:</span> ${volumeInfo.publisher}
                </p>
                <p class="publishedDate">
                    <span>Published Date:</span> ${volumeInfo.publishedDate}
                </p>

                <p class="description">
                    This book provides a comprehensive guide for developers to transition
                    from coding to becoming a professional developer. It covers essential
                    skills, tools, and practices to excel in the software development
                    industry.
                </p>
            </div>
            <button class="back-btn" onClick="handleCloseDetailsPage()"><i class="fa-solid fa-xmark"></i></button>
        </div>
  `;
}

// This function hides the full details page and shows the all books page again
function handleCloseDetailsPage() {
  document.querySelector(".main").style.display = "block";
  fullDetailsElem.style.display = "none";
}

// Here I'm handling searching with debouncing

// Below is a function named "debounce" that takes a function and a delay parameter,
// and returns a new function
// I call it in the searchInputElem's listener, which triggers on every keystroke
const debounceFn = debounce(handleSearching, 1 * 1000);
searchInputElem.addEventListener("input", (e) => {
  if (!e.target.value) {
    headingElem.innerText = `All Books —`;
    displayAllBooks();
    return;
  }
  debounceFn(e.target.value);
});

// This function changes headingElem according to the search value
// and calls displayAllBooks() with the query. If no data is found, "no data" is displayed
function handleSearching(value) {
  headingElem.innerText = `Search — ${value}`;
  displayAllBooks(value, currentPage, "");
}

// The debounce function: if the user types within the delay, it cancels the previous call
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}


// Pagination handlers
nextBtnElem.addEventListener("click", () => {
  currentPage++;
  displayAllBooks("", currentPage, "");
});
preBtnElem.addEventListener("click", () => {
  currentPage--;
  displayAllBooks("", currentPage, "");
});

// Initially call displayAllBooks to load the first page
displayAllBooks();
