const toggle = document.getElementById("navToggle");
const nav = document.getElementById("navMenu");
const overlay = document.getElementById("overlay");
let scrollY = 0;

// MENU OPEN/CLOSE
function openMenu() {
    nav.classList.add("active");
    toggle.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("no-scroll");
}

function closeMenu() {
    nav.classList.remove("active");
    toggle.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
}

toggle.addEventListener("click", () => {
    nav.classList.contains("active") ? closeMenu() : openMenu();
});

overlay.addEventListener("click", closeMenu);

// LINK CLICK (top-level only, ignore parents with submenu)
const links = nav.querySelectorAll("#navMenu > ul > li > a");
links.forEach(link => {
    if (!link.parentElement.classList.contains("has-submenu")) {
        link.addEventListener("click", closeMenu);
    }
});

// ------------------------ ACTIVE LINK HIGHLIGHT ------------------------
const allLinks = document.querySelectorAll("#navMenu a");
const currentPath = window.location.pathname
    .replace(/\/$/, "")
    .replace("index.html", "");

// Only apply 'active' for desktop or when page is loaded
allLinks.forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname
        .replace(/\/$/, "")
        .replace("index.html", "");

    // Skip mobile submenu links temporarily
    if (window.innerWidth <= 767 && link.closest(".submenu")) {
        return;
    }

    if (currentPath === linkPath) {
        link.classList.add("active");

        // Highlight parent menu if this is a submenu
        const parentLi = link.closest(".has-submenu");
        if (parentLi) parentLi.querySelector("> a").classList.add("active");
    }
});

// MOBILE SUBMENU TOGGLE
const submenuParents = document.querySelectorAll(".has-submenu > a");

submenuParents.forEach(parent => {
    parent.addEventListener("click", (e) => {
        if (window.innerWidth <= 767) {
            e.preventDefault();   // never navigate
            e.stopPropagation();  // prevent first-tap carry-over

            const li = parent.parentElement;
            li.classList.toggle("open");
        }
    });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        document.querySelector("header").classList.add("scrolled");
    } else {
        document.querySelector("header").classList.remove("scrolled");
    }
});

/**
 * Enables click-and-drag horizontal scrolling for desktop users.
 * Applied to horizontally scrollable card containers to improve UX
 * where traditional scrollbars are hidden.
 */
document
  .querySelectorAll('.features-cards-wrapper, .testimonials-wrapper')
  .forEach(container => {

    // Tracks whether the mouse button is currently held down
    let isDown = false;

    // Stores the initial mouse X position when dragging starts
    let startX;

    // Stores the container's initial scroll position
    let scrollLeft;

    // Mouse down: initialize drag state 
    container.addEventListener('mousedown', e => {
        isDown = true;
        container.classList.add('dragging'); // Visual feedback (cursor change)

        // Calculate mouse position relative to container
        startX = e.pageX - container.offsetLeft;

        // Capture current scroll position
        scrollLeft = container.scrollLeft;
    });

    // Mouse up: end dragging
    container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('dragging');
    });

    // Mouse leaves container: cancel dragging. Prevents "stuck" drag state if cursor exits container
    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('dragging');
    });

    //Mouse move: handle horizontal scrolling while dragging
    container.addEventListener('mousemove', e => {
        if (!isDown) return; // Only scroll when actively dragging

        e.preventDefault(); // Prevent text/image selection while dragging

        // Current mouse position relative to container
        const x = e.pageX - container.offsetLeft;

        // Distance dragged multiplied for smoother/faster scrolling
        const walk = (x - startX) * 1.5;

        // Apply scroll movement
        container.scrollLeft = scrollLeft - walk;
    });
});
