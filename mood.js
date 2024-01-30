const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

/*
1. Clear the results pane before next search
2. Send the query and make AJAX request
3. Display the search results to the user
4. Make them as clickable to the related results
5. Search the related result when the user clicks
6. Add the images that user wants to the board
 */

function runSearch() {

  // Clear the results pane before you run a new search
  document.getElementById("resultsImageContainer").innerHTML = "";

  openResultsPane();

  // Build your query by combining the bing_api_endpoint and a query attribute
  // named 'q' that takes the value from the search bar input field.
  const query = document.querySelector(".search input").value;
  const url = `${bing_api_endpoint}?q=${encodeURIComponent(query)}`;
  
  // Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //

  let request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'json';
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  request.onload = function() {
    if(request.status === 200) {
      console.log(request.response)
      displayResults(request.response);
      displayRelated(request.response);
    }else {
      console.error("Search Failed: ", request.statusText);
    }
  };

  // Send the request
  request.send();
  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function displayResults(response) {
  const resultsContainer = document.getElementById("resultsImageContainer");

  response.value.forEach(item => {
    const img = document.createElement("img");
    img.src = item.thumbnailUrl;
    img.onclick = () => addToMoodBoard(img);

    resultsContainer.appendChild(img);
  });
}

function displayRelated(response) {
  const suggestions = document.querySelector(".suggestions ul");
  // clear current suggestions
  suggestions.innerHTML = "";

  // limit the number of search suggestions
  const maxRelatedSuggestions = 10;
  const searchSuggestions = response.relatedSearches?.slice(0, maxRelatedSuggestions) || [];

  searchSuggestions.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.text;
    li.onclick = () => {
      document.querySelector(".search input").value = item.text;
      runSearch();
    };

    suggestions.appendChild(li);
  });
}

function addToMoodBoard(img) {
  const board = document.getElementById("board");
  const image = img.cloneNode();
  board.appendChild(image);
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

function runInitialSuggestionsSearch(query) {
  document.querySelector(".search input").value = query;
  runSearch();
}

// This will start searching by clicking the button or pressing Enter
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") { runSearch(); }
});

// This will close the results pane by clicking the cross button or pressing Escape
document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") { closeResultsPane(); }
});
