// Get references to DOM elements
const textarea = document.getElementById("input");
const content = document.getElementById("content");
const resetBtn = document.querySelector("#reset-btn");
const downloadBtn = document.querySelector("#download-btn");
const themeBtn = document.querySelector("#theme-btn");

marked.setOptions({
  breaks: true,
  gfm: true,
});

// Handling theme toggle
themeBtn.addEventListener("click", () => {
  const body = document.body;
  // Check if dark theme is active
  if (body.classList.contains("dark-theme")) {
    // Switch to light theme
    body.classList.remove("dark-theme");
    themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    // Switch to dark theme
    body.classList.add("dark-theme");
    themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }
});

// Load saved content from localStorage
textarea.value = localStorage.getItem("content");
// Render the saved markdown content
renderedMarkdown(textarea.value);

// Listen for input events on the textarea
textarea.addEventListener("input", (e) => {
  // Reset textarea height and adjust it dynamically
  textarea.style.height = `300px`;
  textarea.style.height = `${textarea.scrollHeight}px`;

  // Save the content to localStorage
  localStorage.setItem("content", e.target.value);

  // Render the updated markdown content
  renderedMarkdown(e.target.value);
});

// Function to render markdown content
function renderedMarkdown(value) {
  // Parse the markdown and set it as innerHTML of the content element
  const markdown = marked.parse(value);
  content.innerHTML = markdown;
}

// Handle reset button click
resetBtn.addEventListener("click", () => {
  // Clear the textarea and rendered content
  textarea.value = "";
  renderedMarkdown("");
});

// Handle download button click
downloadBtn.addEventListener("click", () => {
  const markdownContent = textarea.value;
  if (!markdownContent) return; // Do nothing if textarea is empty

  // Create a Blob with the markdown content
  const blob = new Blob([markdownContent], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element to trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = "markdown.md";
  a.click();

  // Revoke the object URL to free up memory
  URL.revokeObjectURL(url);
});
