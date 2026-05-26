function loadComponent(id, file, onDone) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      return response.text();
    })
    .then(data => {
      const container = document.getElementById(id);

      if (container) {
        container.innerHTML = data;

        // Re-execute scripts inside loaded component
        const scripts = container.querySelectorAll("script");
        scripts.forEach(oldScript => {
          const newScript = document.createElement("script");
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        container.classList.add("loaded");
      }

      if (onDone) onDone();
    })
    .catch(error => {
      console.error(error);
      if (onDone) onDone(); // still unblock loader on error
    });
}

// ── Track all 3 components, hide loader when all done ──
const TOTAL = 3;
let loadedCount = 0;

function updateLoaderProgress(count) {
  const percent = Math.round((count / TOTAL) * 100);
  const percentEl = document.getElementById("loaderPercent");
  const fillEl = document.getElementById("loaderBarFill");
  if (percentEl) percentEl.textContent = percent + "%";
  if (fillEl) fillEl.style.width = percent + "%";
}

function onComponentLoaded() {
  loadedCount++;
  updateLoaderProgress(loadedCount);

  if (loadedCount >= TOTAL) {
    setTimeout(() => {
      const loader = document.getElementById("page-loader");
      if (loader) loader.classList.add("hide");
      document.body.classList.add("page-ready"); // ← reveals the page
    }, 700);
  }
}

loadComponent("header", "/header.html", onComponentLoaded);
loadComponent("banner", "/banner.html", onComponentLoaded);
loadComponent("footer", "/footer.html", onComponentLoaded);