let list = document.getElementById("list");
const form = document.getElementById("myForm");
const pagination = document.getElementById("pagination");

let wishlist = getWishlist();

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission

  const search = document.getElementById("name").value;
  const genre = document.getElementById("choice").value;

  console.log("Name:", search);
  console.log("Choice:", genre);

  let str = "https://gutendex.com/books";
  if (search || genre) {
    str += "?";
    if (search) {
      str += "search=" + search.replace(" ", "%20");
    }
    if (search && genre) {
      str += "&topic=" + genre;
    }
  }
  prepareData(str);
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

function preparePagination(url) {
  const regex = /page=(\d+)/; // Matches "page=" followed by one or more digits

  const match = url.match(regex);

  if (match) {
    const currentPage = parseInt(match[1]); // Extract the captured group (page number) and convert to a number
    console.log("current Page:", currentPage); // Output: Page number: 2

    createPaginationDivs(currentPage, pagination);
  } else {
    console.log("No page number found in the URL");
  }
}

function createPaginationDivs(currentPage, paginationElement) {
  paginationElement.innerHTML = ""; // Clear existing divs

  // Calculate start and end page numbers for the pagination
  const startPage = currentPage - 1;
  const endPage = currentPage + 3;

  // Create divs for each page number within the range
  for (let i = startPage; i <= endPage; i++) {
    const anchorTag = document.createElement("a");
    anchorTag.href = `?page=${i}`;
    anchorTag.classList.add("sq-page", "max-sm:sq-hidden");
    anchorTag.textContent = i;

    paginationElement.appendChild(anchorTag);
  }
}

async function prepareData(url) {
  console.log(url);
  let response = await fetch(url);
  let data = await response.json();

  preparePagination(data["next"]);

  list.innerHTML = "";
  for (let i = 0; i < data.results.length; i++) {
    let li = document.createElement("li");

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
      console.log("Clicked heart with ID:", id);

      wishlist = getWishlist();

      // Apply red-heart class based on wishlist status
      if (wishlist.includes(id)) {
        wishlist = removeID(id);
        console.log("IF =", wishlist);
      } else {
        wishlist = addToLS(id);
        console.log("else = ", wishlist);
      }

      // Update localStorage
      localStorage.setItem("wishlist", JSON.stringify(wishlist));

      // Update class based on updated wishlist
      heartDiv.classList.toggle("red-heart"); // Toggle class on click
    });

    li.appendChild(textDiv);
    li.appendChild(heartDiv);

    list.appendChild(li);
  }
}

function searchAuthorOrTitle(name) {
  let str = "https://gutendex.com/books?search=" + name;
  prepareData(str);
}

function getBooks() {
  console.log("helolo");

  const urlParams = new URLSearchParams(window.location.search);

  // Ensure search, type, and page parameters are present
  let searchTerm = urlParams.get("search");
  let type = urlParams.get("type");
  let page = urlParams.get("page");

  console.log("page =", page);

  makeAPICall(searchTerm, type, page);
}

function makeAPICall(searchTerm, type, page) {
  let url = "https://gutendex.com/books";

  if (page) {
    url = `https://gutendex.com/books?page=${page}`;
  }
  prepareData(url);
}

document.addEventListener("DOMContentLoaded", getBooks);
