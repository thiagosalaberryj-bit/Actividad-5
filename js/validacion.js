window.BIKES_STORAGE_KEY = "bike_records";

// Muestra notificaciones globales usando Toastify con estilos por tipo.
window.showToast = function showToast(message, type) {
	var background = "#2563eb";
	if (type === "error") {
		background = "#dc2626";
	}
	if (type === "ok") {
		background = "#16a34a";
	}

	if (window.Toastify) {
		window.Toastify({
			text: message,
			duration: 2600,
			gravity: "top",
			position: "right",
			stopOnFocus: true,
			style: { background: background }
		}).showToast();
		return;
	}

	window.alert(message);
};

// Lee y normaliza la lista guardada en LocalStorage.
window.getBikeRecords = function getBikeRecords() {
	var raw = localStorage.getItem(window.BIKES_STORAGE_KEY);
	if (!raw) {
		return [];
	}

	try {
		var parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		return [];
	}
};

// Persiste todos los registros en LocalStorage.
window.saveBikeRecords = function saveBikeRecords(records) {
	localStorage.setItem(window.BIKES_STORAGE_KEY, JSON.stringify(records));
};

// Convierte el archivo seleccionado a base64 para guardarlo con el registro.
window.readFileAsBase64 = function readFileAsBase64(file) {
	return new Promise(function (resolve, reject) {
		var reader = new FileReader();
		reader.onload = function (event) {
			resolve(String(event.target.result || ""));
		};
		reader.onerror = function () {
			reject(new Error("No se pudo leer la imagen."));
		};
		reader.readAsDataURL(file);
	});
};

// Valida campos obligatorios y formato de email antes de guardar/editar.
window.validateBikeData = function validateBikeData(data, requireImage) {
	if (!data.userName.trim()) {
		window.showToast("El nombre es obligatorio.", "error");
		return false;
	}

	if (!data.userEmail.trim()) {
		window.showToast("El email es obligatorio.", "error");
		return false;
	}

	var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(data.userEmail.trim())) {
		window.showToast("Ingresa un email valido.", "error");
		return false;
	}

	if (!data.serialNumber.trim()) {
		window.showToast("El numero de serie es obligatorio.", "error");
		return false;
	}

	if (!data.brand.trim() || !data.model.trim()) {
		window.showToast("Marca y modelo son obligatorios.", "error");
		return false;
	}

	if (requireImage && !data.imageBase64) {
		window.showToast("Selecciona una imagen.", "error");
		return false;
	}

	return true;
};

// Inicializa eventos del formulario principal y preview de imagen.
document.addEventListener("DOMContentLoaded", function () {
	var bikeForm = document.getElementById("bikeForm");
	var imageInput = document.getElementById("bikeImage");
	var previewImage = document.getElementById("previewImage");
	var previewPlaceholder = document.querySelector("#imagePreview .preview-placeholder");
	var formMessage = document.getElementById("formMessage");
	var imageBase64 = "";

	if (!bikeForm || !imageInput || !previewImage || !previewPlaceholder || !formMessage) {
		return;
	}

	// Actualiza la vista previa y el base64 cuando el usuario selecciona imagen.
	imageInput.addEventListener("change", async function (event) {
		var file = event.target.files && event.target.files[0];
		if (!file) {
			imageBase64 = "";
			previewImage.removeAttribute("src");
			previewImage.style.display = "none";
			previewPlaceholder.style.display = "block";
			return;
		}

		try {
			imageBase64 = await window.readFileAsBase64(file);
			previewImage.src = imageBase64;
			previewImage.style.display = "block";
			previewPlaceholder.style.display = "none";
		} catch (error) {
			window.showToast("No se pudo cargar la imagen.", "error");
		}
	});

	// Toma datos del formulario, valida y guarda un nuevo registro.
	bikeForm.addEventListener("submit", function (event) {
		event.preventDefault();

		var data = {
			id: String(Date.now()),
			userName: String(bikeForm.userName.value || "").trim(),
			userEmail: String(bikeForm.userEmail.value || "").trim(),
			serialNumber: String(bikeForm.serialNumber.value || "").trim(),
			brand: String(bikeForm.brand.value || "").trim(),
			model: String(bikeForm.model.value || "").trim(),
			imageBase64: imageBase64
		};

		if (!window.validateBikeData(data, true)) {
			return;
		}

		var records = window.getBikeRecords();
		records.unshift(data);
		window.saveBikeRecords(records);

		bikeForm.reset();
		imageBase64 = "";
		previewImage.removeAttribute("src");
		previewImage.style.display = "none";
		previewPlaceholder.style.display = "block";
		formMessage.textContent = "Registro guardado.";

		window.showToast("Registro guardado correctamente.", "ok");
		if (window.renderBikeList) {
			window.renderBikeList();
		}
	});
});

