let list = document.getElementById("details");


async function prepareData(url) {
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);
  list.innerHTML = data.results[0]['title'];
}


function getDetails() {

  const urlParams = new URLSearchParams(window.location.search);

  // Ensure search, type, and page parameters are present
  let id = urlParams.get("id");

  makeAPICall(id);
}

function makeAPICall(id) {
  let url = "https://gutendex.com/books";

  if (id) {
    url = `https://gutendex.com/books?ids=${id}`;
  }
  console.log(url);
  
  prepareData(url);
}

document.addEventListener("DOMContentLoaded", getDetails);
