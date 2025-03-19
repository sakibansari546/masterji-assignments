// Here I'm getting all the elements that I'll need

// This button generates a new quote
const newQuoteButtonElem = document.querySelector(".new-quote-btn");

// These elements will display the content:
// The quote is displayed here
const quoteElem = document.querySelector(".quote");
// The author's name is displayed here
const authorElem = document.querySelector(".author");

// These are the action buttons that I use to copy or share the quote
const shareTweeterBtnElem = document.querySelector(".share-twitter");
const clipBoardButtonElem = document.querySelector(".clip-board");

// A global variable "data" is created so that it can be accessed from any function
let data;

// This function makes an API call and returns the response.
// When I call this function, I will get that response.
async function getQuotes() {
  return await fetch(
    "https://api.freeapi.app/api/v1/public/quotes/quote/random",
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }
  );
}

// In this function, I call getQuotes() to generate a new quote and display it.
async function generateQuote() {
  try {
    // Before fetching data, I add a loading effect to quoteElem and authorElem
    // by changing their inner HTML/text.
    quoteElem.innerHTML = `<span class="loader"></span>`;
    authorElem.innerText = "...";

    // Then I fetch the data from getQuotes() and store the response in the "data" variable
    // and convert the response to JSON.
    const response = await getQuotes();
    data = await response.json();

    // Then I display the received data in quoteElem and authorElem.
    quoteElem.innerText = `“ ${data.data.content} ”`;
    authorElem.innerText = `— ${data.data.author}`;
  } catch (error) {
    // If there's an error, display it here.
    quoteElem.innerText = `“ ${error} ”`;
    authorElem.innerText = `— `;
    console.log(error);
  }
}

// Here, on button click, I call generateQuote() to generate a new quote.
newQuoteButtonElem.addEventListener("click", generateQuote);

// This function handles clipboard functionality: when the clipboard button is clicked,
// it shows its inner span (indicating the copy action), writes the text to the clipboard,
// and then hides the span after 1 second.
function handleClipBoard(content) {
  const clipBoardCopiedElem = clipBoardButtonElem.querySelector("span");

  clipBoardCopiedElem.style.display = "block";

  navigator.clipboard.writeText(content);

  setTimeout(() => {
    clipBoardCopiedElem.style.display = "none";
  }, 1000);
}

// I call handleClipBoard when the clipboard button is clicked.
clipBoardButtonElem.addEventListener("click", () =>
  handleClipBoard(data.data.content)
);

// Here, I handle the Twitter share button. When it is clicked,
// it redirects to the Twitter share URL with the quote.
shareTweeterBtnElem.addEventListener("click", () => {
  window.open(`https://twitter.com/intent/tweet?text=${data.data.content}`);
});

// Generate the initial quote when the page loads.
generateQuote();
