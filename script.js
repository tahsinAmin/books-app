let list = document.getElementById("list");
const inputElement = document.getElementById("search");
const form = document.getElementById("myForm");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission

  const search = document.getElementById("name").value;
  const genre = document.getElementById("choice").value;

  console.log("Name:", search);
  console.log("Choice:", genre);

  let str = "https://gutendex.com/books"
  if (search || genre) {
    str+= "?";
    if (search) {
      str+= "search=" + search.replace(" ", "%20");
    }
    if (search && genre) {
      str+= "&topic=" + genre;
    }
  }
  console.log(str);
  
  prepareData(str);
});

inputElement.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    let searchVal = inputElement.value.replace(" ", "%20");
    searchAuthorOrTitle(searchVal);
  }
});

async function prepareData(url) {
  console.log(url);
  let response = await fetch(url);
  let data = await response.json();

  list.innerHTML = "";
  for (let i = 0; i < data.results.length; i++) {
    let li = document.createElement("li");
    li.innerText = data.results[i]["title"];
    list.appendChild(li);
  }
}

async function searchAuthorOrTitle(name) {
  let str = "https://gutendex.com/books?search=" + name;
  prepareData(str);
}

async function getBooks() {
  let url = "https://gutendex.com/books/";
  prepareData(url);
}

document.addEventListener("DOMContentLoaded", getBooks);