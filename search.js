document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#search-input, .search-input");
  const button = document.querySelector(".search-button");

  if (!input || !button) {
    return;
  }

  const handleSearch = () => {
    const query = input.value.trim();
    if (!query) {
      input.focus();
      return;
    }

    const destination = `search-results.html?q=${encodeURIComponent(query)}`;
    window.location.href = destination;
  };

  button.addEventListener("click", handleSearch);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  });
});
