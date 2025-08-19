//scripts.js

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70,
        behavior: "smooth",
      });
    }
  });
});

// Back to top button visibility
window.addEventListener("scroll", () => {
  const backToTopButton = document.querySelector(".back-to-top");
  if (window.pageYOffset > 300) {
    backToTopButton.style.display = "flex";
  } else {
    backToTopButton.style.display = "none";
  }
});

// Add animation to elements when they come into view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  },
  { threshold: 0.1 }
);

document
  .querySelectorAll(".service-card, .about-img, h2, .lead")
  .forEach((el) => {
    observer.observe(el);
  });

// VALIDACIÓN Y ENVÍO DEL FORMULARIO DE CONTACTO
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#contactForm");

  const nombreInput = document.querySelector("#nombre");
  const correoInput = document.querySelector("#correo");
  const telefonoInput = document.querySelector("#telefono");
  const mensajeInput = document.querySelector("#mensaje");
  const servicioSelect = document.querySelector("#servicio"); // ✅ nuevo campo

  function mostrarError(input, mensaje) {
    let errorSpan = input.nextElementSibling;
    if (!errorSpan || !errorSpan.classList.contains("error-message")) {
      errorSpan = document.createElement("div");
      errorSpan.classList.add("error-message", "text-danger", "small", "mt-1");
      input.parentNode.appendChild(errorSpan);
    }
    errorSpan.textContent = mensaje;
  }

  function limpiarError(input) {
    let errorSpan = input.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains("error-message")) {
      errorSpan.textContent = "";
    }
  }

  // Validaciones en tiempo real
  nombreInput.addEventListener("input", () => {
    const nombreVal = nombreInput.value.trim();
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/;
    if (!nombreRegex.test(nombreVal)) {
      mostrarError(nombreInput, "Solo letras y espacios (máx 100 caracteres).");
    } else {
      limpiarError(nombreInput);
    }
  });

  correoInput.addEventListener("input", () => {
    const correoVal = correoInput.value.trim();
    if (
      correoVal.length > 50 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoVal)
    ) {
      mostrarError(correoInput, "Correo inválido o muy largo (máx 50 caracteres).");
    } else {
      limpiarError(correoInput);
    }
  });

  telefonoInput.addEventListener("input", () => {
    const telefonoVal = telefonoInput.value.trim();
    const telefonoRegex = /^[0-9]{0,50}$/;
    if (!telefonoRegex.test(telefonoVal)) {
      mostrarError(telefonoInput, "Solo números (máx 50 caracteres).");
    } else {
      limpiarError(telefonoInput);
    }
  });

  function mostrarAlerta(mensaje) {
    let alerta = document.createElement("div");
    alerta.className = "alert alert-success position-fixed bottom-0 end-0 m-3";
    alerta.style.zIndex = 1050;
    alerta.textContent = mensaje;
    document.body.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreVal = nombreInput.value.trim();
    const correoVal = correoInput.value.trim();
    const telefonoVal = telefonoInput.value.trim();
    const mensajeVal = mensajeInput.value.trim();
    const servicioVal = servicioSelect.value;

    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,100}$/;
    const telefonoRegex = /^[0-9]{0,50}$/;

    if (!nombreRegex.test(nombreVal)) {
      mostrarError(nombreInput, "Solo letras y espacios (máx 100 caracteres).");
      nombreInput.focus();
      return;
    } else {
      limpiarError(nombreInput);
    }

    if (
      correoVal.length > 50 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoVal)
    ) {
      mostrarError(correoInput, "Correo inválido o muy largo (máx 50 caracteres).");
      correoInput.focus();
      return;
    } else {
      limpiarError(correoInput);
    }

    if (!telefonoRegex.test(telefonoVal)) {
      mostrarError(telefonoInput, "Solo números (máx 50 caracteres).");
      telefonoInput.focus();
      return;
    } else {
      limpiarError(telefonoInput);
    }

    if (mensajeVal === "") {
      mostrarAlerta("Por favor, escriba un mensaje antes de enviar.");
      mensajeInput.focus();
      return;
    }

    // 🧠 Convertir el ID del servicio a número o null
    const servicioId = servicioVal && servicioVal !== "null" ? parseInt(servicioVal) : null;

    // Enviar datos a la API
    const contactoData = {
      nombre_completo: nombreVal,
      correo_electronico: correoVal,
      telefono: telefonoVal,
      mensaje: mensajeVal,
      id_producto_servicio: servicioId
    };

    fetch("http://localhost:3001/api/contacto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contactoData)
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || "Error al enviar mensaje.");
          });
        }
        return response.json();
      })
      .then(data => {
        mostrarAlerta("¡Mensaje enviado correctamente!");
        form.reset();
      })
      .catch(error => {
        console.error("Error:", error);
        mostrarAlerta("Hubo un error al enviar tu mensaje. Intenta de nuevo.");
      });
  });
});



