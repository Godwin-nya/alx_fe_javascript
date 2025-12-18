

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
      <small>Category: ${quote.category}</small>`
    
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
    populateCategories(); // Update categories in dropdown

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

function exportToJson() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
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



function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");

  // Clear existing options except "All Categories"
  categorySelect.innerHTML = '<option value="all">All Categories</option>';

  // Extract unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  // Add categories to dropdown
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // Restore last selected filter
  const lastFilter = localStorage.getItem("lastCategoryFilter");
  if (lastFilter && categories.includes(lastFilter)) {
    categorySelect.value = lastFilter;
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  // Save last selected filter to localStorage
  localStorage.setItem("lastCategoryFilter", selectedCategory);

  let filteredQuotes;
  if (selectedCategory === "all") {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  displayQuotes(filteredQuotes);
}

/* ----------INIT----------- */
loadQuotes();
populateCategories();
loadLastQuote();
createAddQuoteForm();
filterQuotes();

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

//fetch data
async function fetchQuotesFromServer(){
    try{
        const response = await fetch(SERVER_URL);
        const data = await response.json();

        //map data to quotes
        const serverQuotes = data.map(item => ({
            text: item.title,
            category: "Server"
        }));

        return serverQuotes;
    }catch(error){
        console.error("Error fetching server quotes:", error);
        return [];
    }   
}

// Load server quotes and merge with local quotes
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Merge logic: server data takes precedence
  const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Find quotes that are not on the server yet
  const newLocalQuotes = localQuotes.filter(
    local => !serverQuotes.some(server => server.text === local.text)
  );

  // Merge server + new local quotes
  const mergedQuotes = [...serverQuotes, ...newLocalQuotes];

  // Save merged quotes locally
  localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
  quotes = mergedQuotes; // update in-memory array

  // Notify user if updates occurred
  if (serverQuotes.length > 0) {
    alert("Quotes updated from server!");
  }

  // Refresh category dropdown and display
  populateCategories();
  showRandomQuote();
}

setInterval(syncQuotes, 60000);

function notifyUser(message) {
  const notification = document.getElementById("syncNotification");
  notification.textContent = message;
  notification.style.display = "block";

  // Hide after 3 seconds
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

notifyUser("Quotes updated from server!");

populateCategories();
showRandomQuote();


async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const data = await response.json();
    console.log("Quote posted to server:", data);
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}
