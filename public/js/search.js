document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-inp");
  const searchForm = document.querySelector(".search-oval-container");

  if (!searchInput || !searchForm) return;

  const listingLinks = document.querySelectorAll(".listing-link");

  const listings = Array.from(listingLinks).map((link) => {
    const titleElement = link.querySelector(".card-text b");
    return {
      element: link,
      title: titleElement ? titleElement.textContent.trim().toLowerCase() : "",
    };
  });

  function filterListings(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    let visibleCount = 0;

    listings.forEach((listing) => {
      if (term === "" || listing.title.includes(term)) {
        listing.element.style.display = "";
        visibleCount++;
      } else {
        listing.element.style.display = "none";
      }
    });

    let noResultsMsg = document.querySelector(".no-results-message");
    const rowContainer = document.querySelector(".row.row-cols-lg-3");

    if (visibleCount === 0 && term !== "") {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement("div");
        noResultsMsg.className = "no-results-message col-12";
        noResultsMsg.innerHTML = `
                    <i class="fa-solid fa-house-circle-xmark" style="font-size: 4rem; color: #d1d5db; margin-bottom: 1.5rem;"></i>
                    <h4 style="color: #717171; margin-bottom: 1rem;">No listings found for "${searchTerm}"</h4>
                    <p style="color: #717171;">Try searching with different keywords or <a href="/listings" style="color: #FF385C;">view all listings</a></p>
                `;
        rowContainer.appendChild(noResultsMsg);
      } else {
        noResultsMsg.querySelector(
          "h4"
        ).innerHTML = `No listings found for "${searchTerm}"`;
        noResultsMsg.style.display = "flex";
      }
    } else if (noResultsMsg) {
      noResultsMsg.style.display = "none";
    }
  }

  searchInput.addEventListener("input", function (e) {
    filterListings(e.target.value);
  });

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    filterListings(searchInput.value);
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      searchInput.value = "";
      filterListings("");
      searchInput.blur();
    }
  });

  const filterLinks = document.querySelectorAll(".filter-link");
  filterLinks.forEach((link) => {
    link.addEventListener("click", function () {
      searchInput.value = "";
    });
  });
});
