function loadComponent(id, file) {
  fetch(file)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${file}`);
      }
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

          newScript.appendChild(
            document.createTextNode(oldScript.innerHTML)
          );

          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      }
    })
    .catch(error => {
      console.error(error);
    });
}

// Load Header
loadComponent("header", "/header.html");

// Load Banner
loadComponent("banner", "/banner.html");

// Load Footer
loadComponent("footer", "/footer.html");