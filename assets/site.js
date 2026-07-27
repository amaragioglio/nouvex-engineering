(() => {
  document.documentElement.classList.add("js");

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".primary-nav");

  if (menuButton && nav) {
    const setMenu = open => {
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "Close" : "Menu";
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
    };

    menuButton.addEventListener("click", () => {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", event => {
      if (!event.target.closest("a")) return;
      setMenu(false);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuButton.focus();
      }
    });

    // The menu button is hidden above 940px, so a resize past that point would
    // otherwise strand body.menu-open and leave the page unable to scroll.
    window.matchMedia("(max-width: 940px)").addEventListener("change", event => {
      if (!event.matches) setMenu(false);
    });
  }

  document.querySelectorAll("[data-year]").forEach(node => {
    node.textContent = new Date().getFullYear();
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(node => node.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });

  document.querySelectorAll(".reveal").forEach(node => observer.observe(node));
})();
