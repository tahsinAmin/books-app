let list = document.getElementById("list");
const form = document.getElementById("myForm");
const pagination = document.getElementById("pagination");

const loadingTextElement = document.getElementById("loading-text"); // Replace with the ID of your loading text element
let baseBookAPI = "https://gutendex.com/books";

let wishlist = getWishlist();

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  let searchTerm = document.getElementById("name").value;
  let topic = document.getElementById("topic").value;
  let url = baseBookAPI;

  const urlParams = new URLSearchParams(window.location.search);

  if (searchTerm) {
    searchTerm = searchTerm.replace(" ", "%20");
    urlParams.set("search", searchTerm);
    url += (url.includes("?") ? "&" : "?") + `search=${searchTerm}`;
  }
  if (topic) {
    url += (url.includes("?") ? "&" : "?") + `topic=${topic}`;
    urlParams.set("topic", topic);
  }

  window.history.replaceState(
    {},
    document.title,
    `${window.location.pathname}?${urlParams.toString()}`
  );

  prepareData(url);
});

function getWishlist() {
  if (localStorage.getItem("wishlist") === null) {
    return [];
  } else {
    return JSON.parse(localStorage.getItem("wishlist"));
  }
}

function addToLS(id) {
  wishlist = getWishlist();
  wishlist.push(id);
  return wishlist;
}

function removeID(id) {
  wishlist = getWishlist();

  wishlist.forEach((listID, index) => {
    if (listID === id) {
      wishlist.splice(index, 1);
    }
  });

  // localStorage.setItem("wishlist", JSON.stringify(wishlist));
  return wishlist;
}

function preparePagination(url, previousExist, nextExist) {
  console.log(url);
  const regex = /page=(\d+)/; // Matches "page=" followed by one or more digits

  const match = url.match(regex);

  if (match) {
    const currentPage = parseInt(match[1]) - 1; // Extract the captured group (page number) and convert to a number
    console.log("current Page:", currentPage); // Output: Page number: 2

    createPaginationDivs(currentPage, pagination, previousExist, nextExist);
  } else {
    console.log("No page number found in the URL");
  }
}

function createPaginationDivs(
  currentPage,
  paginationElement,
  previousExist,
  nextExist
) {
  paginationElement.innerHTML = ""; // Clear existing divs
  let startPage, endPage;

  // Calculate start and end page numbers for the pagination
  if (currentPage == 1) {
    startPage = currentPage - 0;
    endPage = currentPage + 4;
  } else if (currentPage == 2) {
    startPage = currentPage - 1;
    endPage = currentPage + 3;
  } else {
    startPage = currentPage - 2;
    endPage = currentPage + 2;
  }
  console.log(startPage, endPage);

  // Create divs for each page number within the range
  for (let i = startPage; i <= endPage; i++) {
    const anchorTag = document.createElement("a");
    anchorTag.href = `?page=${i}`;
    anchorTag.classList.add("sq-page", "max-sm:sq-hidden");
    if (i == currentPage) {
      anchorTag.classList.add("sq-active");
    }
    anchorTag.textContent = i;

    paginationElement.appendChild(anchorTag);
  }
}

async function prepareData(url) {
  loadingTextElement.textContent = "Loading...";
  list.innerHTML = "";
  try {
    let response = await fetch(url);
    let data = await response.json();
    loadingTextElement.textContent = "";
    let previousExist = data["prevous"] ? true : false;
    let nextExist = data["next"] ? true : false;

    preparePagination(data["next"], previousExist, nextExist);

    for (let i = 0; i < data.results.length; i++) {
      let li = document.createElement("li");

      const anchorTag = document.createElement("a");
      anchorTag.href = `details.html?id=${data.results[i]["id"]}`;
      anchorTag.innerText = "Click Here";

      let textDiv = document.createElement("div");
      textDiv.innerText = data.results[i]["title"];

      let heartDiv = document.createElement("div");
      heartDiv.dataset.id = data.results[i]["id"];

      // Create the SVG heart icon
      row = document.createElement("tr");
      heartDiv.innerHTML = `
        <svg width="24" height="64" viewBox="0 0 64 64">
          <path d="M32.012,59.616c-1.119-.521-2.365-1.141-3.707-1.859a79.264,79.264,0,0,1-11.694-7.614C6.316,42,.266,32.6.254,22.076,0.244,12.358,7.871,4.506,17.232,4.5a16.661,16.661,0,0,1,11.891,4.99l2.837,2.889,2.827-2.9a16.639,16.639,0,0,1,11.874-5.02h0c9.368-.01,17.008,7.815,17.021,17.539,0.015,10.533-6.022,19.96-16.312,28.128a79.314,79.314,0,0,1-11.661,7.63C34.369,58.472,33.127,59.094,32.012,59.616Z">
          </path>
        </svg>
      `;

      // Check if the ID exists in the wishlist
      let isWishlisted = wishlist.includes(heartDiv.dataset.id);

      // Apply red-heart class based on wishlist status
      if (isWishlisted) {
        heartDiv.classList.add("red-heart");
      } else {
        heartDiv.classList.remove("red-heart");
      }

      heartDiv.addEventListener("click", function () {
        let id = this.dataset.id;

        wishlist = getWishlist();

        // Apply red-heart class based on wishlist status
        if (wishlist.includes(id)) {
          wishlist = removeID(id);
        } else {
          wishlist = addToLS(id);
        }

        // Update localStorage
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        // Update class based on updated wishlist
        heartDiv.classList.toggle("red-heart"); // Toggle class on click
      });

      li.appendChild(textDiv);
      li.appendChild(heartDiv);
      li.appendChild(anchorTag);
      list.appendChild(li);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    loadingTextElement.textContent = "Error loading data";
    throw error; // Re-throw the error for further handling
  }
}

function makeAPICall(searchTerm, topic, page) {
  let url = baseBookAPI;

  // If a search term is provided, add it as a query parameter
  if (searchTerm) {
    url += `?search=${encodeURIComponent(searchTerm)}`;
  }

  // Optionally, add other topics or filters if necessary
  if (topic) {
    url +=
      (url.includes("?") ? "&" : "?") + `topic=${encodeURIComponent(topic)}`;
  }

  // If a page is provided, append it as a query parameter
  if (page) {
    // Check if '?' already exists in the URL to decide whether to use '&' or '?'
    url += (url.includes("?") ? "&" : "?") + `page=${page}`;
  }

  // Call the function to prepare data with the constructed URL
  prepareData(url);
}

function getBooks() {
  const urlParams = new URLSearchParams(window.location.search);

  // Ensure search, topic, and page parameters are present
  let searchTerm = urlParams.get("search");
  let topic = urlParams.get("topic");
  let page = urlParams.get("page");

  makeAPICall(searchTerm, topic, page);
}

document.addEventListener("DOMContentLoaded", getBooks);
