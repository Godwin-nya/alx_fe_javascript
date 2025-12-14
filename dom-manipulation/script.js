let quotes = [];

// -------- LOCAL STORAGE --------
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
      { text: "An unexamined life is not worth living.", category: "Philosophy" },
      { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Individuality" }
    ];
    saveQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// -------- DOM --------
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// -------- RANDOM QUOTE --------
function showRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

newQuoteBtn.addEventListener("click", showRandomQuote);

// -------- SESSION STORAGE --------
function loadLastQuote() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <small>Category: ${quote.category}</small>
    `;
  }
}

// -------- ADD QUOTE --------
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value;
  const quoteCategory = document.getElementById("newQuoteCategory").value;

  if (!quoteText || !quoteCategory) {
    alert("Please enter both quote and category");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  saveQuotes(); // 

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// -------- DYNAMIC FORM --------
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addBtn);

  document.body.appendChild(formDiv);
}

// -------- JSON IMPORT --------
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        alert("Invalid JSON format");
        return;
      }

      quotes.push(...importedQuotes);
      saveQuotes();

      alert("Quotes imported successfully!");
    } catch {
      alert("Error reading JSON file");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// -------- INIT --------
loadQuotes();
loadLastQuote();
createAddQuoteForm();
