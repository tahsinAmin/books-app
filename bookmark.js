let list = document.getElementById("wishlist");
// const pagination = document.getElementById("pagination");

let wishlist = getWishlist();

function getWishlist() {
  if (localStorage.getItem("wishlist") === null) {
    return [];
  } else {
    return JSON.parse(localStorage.getItem("wishlist"));
  }
}

function prepareWishData() {

  // preparePagination(data["next"]);

  list.innerHTML = "";
  for (let i = 0; i < wishlist.length; i++) {
    let li = document.createElement("li");

    //   let textDiv = document.createElement("div");
    //   textDiv.innerText = data.results[i]["title"];

    //   let heartDiv = document.createElement("div");
    //   heartDiv.dataset.id = data.results[i]["id"];

    // Create the SVG heart icon
    //   row = document.createElement("tr");
    //   heartDiv.innerHTML = `
    //     <svg width="24" height="64" viewBox="0 0 64 64">
    //       <path d="M32.012,59.616c-1.119-.521-2.365-1.141-3.707-1.859a79.264,79.264,0,0,1-11.694-7.614C6.316,42,.266,32.6.254,22.076,0.244,12.358,7.871,4.506,17.232,4.5a16.661,16.661,0,0,1,11.891,4.99l2.837,2.889,2.827-2.9a16.639,16.639,0,0,1,11.874-5.02h0c9.368-.01,17.008,7.815,17.021,17.539,0.015,10.533-6.022,19.96-16.312,28.128a79.314,79.314,0,0,1-11.661,7.63C34.369,58.472,33.127,59.094,32.012,59.616Z">
    //       </path>
    //     </svg>
    //   `;

    //   // Check if the ID exists in the wishlist
    //   let isWishlisted = wishlist.includes(heartDiv.dataset.id);

    //   // Apply red-heart class based on wishlist status
    //   if (isWishlisted) {
    //     heartDiv.classList.add("red-heart");
    //   } else {
    //     heartDiv.classList.remove("red-heart");
    //   }

    //   heartDiv.addEventListener("click", function () {
    //     let id = this.dataset.id;
    //     console.log("Clicked heart with ID:", id);

    //     wishlist = getWishlist();

    //     // Apply red-heart class based on wishlist status
    //     if (wishlist.includes(id)) {
    //       wishlist = removeID(id);
    //       console.log("IF =", wishlist);
    //     } else {
    //       wishlist = addToLS(id);
    //       console.log("else = ", wishlist);
    //     }

    //     // Update localStorage
    //     localStorage.setItem("wishlist", JSON.stringify(wishlist));

    //     // Update class based on updated wishlist
    //     heartDiv.classList.toggle("red-heart"); // Toggle class on click
    //   });

    //   li.appendChild(textDiv);
    //   li.appendChild(heartDiv);

    li.innerHTML = wishlist[i];
    list.appendChild(li);
  }
}

document.addEventListener("DOMContentLoaded", prepareWishData);
