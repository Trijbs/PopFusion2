document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");
    const closeButton = document.querySelector(".close-button");
    const menuLinks = document.querySelectorAll(".menu ul li a");

    if (!menuToggle || !menu || !closeButton) {
        console.error("Menu elements not found:", { menuToggle, menu, closeButton });
        return;
    }

    console.log("Menu script initialized");

    menuToggle.addEventListener("click", () => {
        console.log("Menu toggle clicked");
        menu.classList.toggle("active");
    });

    closeButton.addEventListener("click", () => {
        console.log("Close button clicked");
        menu.classList.remove("active");
    });

    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            console.log("Menu link clicked:", link.textContent);
            menu.classList.remove("active");
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768 && menu.classList.contains("active")) {
            console.log("Closing menu on resize to desktop");
            menu.classList.remove("active");
        }
    });
});