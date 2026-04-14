// Abre un modal por id y ajusta accesibilidad basica.
window.openModal = function openModal(modalId) {
	var modal = document.getElementById(modalId);
	if (!modal) {
		return;
	}
	modal.classList.add("open");
	modal.setAttribute("aria-hidden", "false");
};

// Cierra un modal por id y restaura su estado oculto.
window.closeModal = function closeModal(modalId) {
	var modal = document.getElementById(modalId);
	if (!modal) {
		return;
	}
	modal.classList.remove("open");
	modal.setAttribute("aria-hidden", "true");
};

// Habilita cierre por botones, click fuera del contenido y tecla Escape.
document.addEventListener("DOMContentLoaded", function () {
	document.body.addEventListener("click", function (event) {
		var closeButton = event.target.closest("[data-modal-close]");
		if (closeButton) {
			window.closeModal(closeButton.getAttribute("data-modal-close"));
			return;
		}

		if (event.target.classList.contains("modal")) {
			event.target.classList.remove("open");
			event.target.setAttribute("aria-hidden", "true");
		}
	});

	document.addEventListener("keydown", function (event) {
		if (event.key !== "Escape") {
			return;
		}
		document.querySelectorAll(".modal.open").forEach(function (modal) {
			modal.classList.remove("open");
			modal.setAttribute("aria-hidden", "true");
		});
	});
});
