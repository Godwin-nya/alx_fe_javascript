const quotes = [
        {
          text: "The best way to predict the future is to invent it.",
          category: "Inspiration",
        },
        {
          text: "Life is 10% what happens to us and 90% how we react to it.",
          category: "Motivation",
        },
        {
          text: "An unexamined life is not worth living.",
          category: "Philosophy",
        },
        {
          text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
          category: "Individuality",
        },
      ];

      const quoteDisplay = document.getElementById("quoteDisplay");
      const newQuoteBtn = document.getElementById("newQuote");

      function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];

        quoteDisplay.innerHTML = `
          <p>"${quote.text}"</p>
          <small>Category: ${quote.category}</small>
        `;
      }

      newQuoteBtn.addEventListener("click", showRandomQuote);

      function addQuote() {
        const quoteText = document.getElementById("newQuoteText").value;
        const quoteCategory = document.getElementById("newQuoteCategory").value;

        if (quoteText === "" || quoteCategory === "") {
          alert("Please enter both quote and category");
          return;
        }

        quotes.push({
          text: quoteText,
          category: quoteCategory,
        });

        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";

        alert("Quote added successfully!");
      }

      function createAddQuoteForm() {
        const formDiv = document.createElement("div");

        const quoteInput = document.createElement("input");
        quoteInput.id = "newQuoteText";
        quoteInput.placeholder = "Enter a new quote";

        const categoryInput = document.createElement ("input");
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
      createAddQuoteForm();