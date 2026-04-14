// Renderiza la lista desde LocalStorage, aplicando filtro opcional de busqueda.
window.renderBikeList = function renderBikeList() {
	var bikeList = document.getElementById("bikeList");
	var emptyState = document.getElementById("emptyState");
	if (!bikeList || !emptyState) {
		return;
	}

	var records = window.getBikeRecords();
	bikeList.innerHTML = "";
	if (!filtered.length) {
		emptyState.style.display = "block";
		return;
	}

	emptyState.style.display = "none";

	filtered.forEach(function (record) {
		var item = document.createElement("li");
		item.className = "bike-item";

		var image = document.createElement("img");
		image.src = record.imageBase64;
		image.alt = record.brand + " " + record.model;
		item.appendChild(image);

		var content = document.createElement("div");
		content.className = "bike-content";

		var name = document.createElement("h3");
		name.textContent = record.userName;

		var email = document.createElement("p");
		email.textContent = "Email: " + record.userEmail;

		var serial = document.createElement("p");
		serial.textContent = "Serie: " + record.serialNumber;

		var bike = document.createElement("p");
		bike.textContent = "Bici: " + record.brand + " " + record.model;

		var actions = document.createElement("div");
		actions.className = "item-actions";

		var editBtn = document.createElement("button");
		editBtn.type = "button";
		editBtn.className = "btn-action";
		editBtn.textContent = "Editar";
		editBtn.setAttribute("data-action", "edit");
		editBtn.setAttribute("data-id", record.id);

		var deleteBtn = document.createElement("button");
		deleteBtn.type = "button";
		deleteBtn.className = "btn-danger";
		deleteBtn.textContent = "Borrar";
		deleteBtn.setAttribute("data-action", "delete");
		deleteBtn.setAttribute("data-id", record.id);

		actions.appendChild(editBtn);
		actions.appendChild(deleteBtn);

		content.appendChild(name);
		content.appendChild(email);
		content.appendChild(serial);
		content.appendChild(bike);
		content.appendChild(actions);
		item.appendChild(content);

		bikeList.appendChild(item);
	});
};

// Configura los eventos para editar y borrar registros desde la lista.
document.addEventListener("DOMContentLoaded", function () {
	var bikeList = document.getElementById("bikeList");
	var editForm = document.getElementById("editForm");
	var editImageInput = document.getElementById("editBikeImage");
	var editPreviewImage = document.getElementById("editPreviewImage");
	var editPreviewPlaceholder = document.getElementById("editPreviewPlaceholder");
	var confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
	var deleteMessage = document.getElementById("deleteMessage");
	if (!bikeList || !editForm || !editImageInput || !editPreviewImage || !editPreviewPlaceholder || !confirmDeleteBtn || !deleteMessage) {
		return;
	}

	var editingId = "";
	var deletingId = "";
	var editingImageBase64 = "";

	window.renderBikeList();

	// Detecta clicks en botones de accion y abre el modal correspondiente.
	bikeList.addEventListener("click", function (event) {
		var button = event.target.closest("button[data-action]");
		if (!button) {
			return;
		}

		var action = button.getAttribute("data-action");
		var id = button.getAttribute("data-id") || "";
		var records = window.getBikeRecords();
		var record = records.find(function (item) {
			return item.id === id;
		});

		if (!record) {
			return;
		}

		if (action === "edit") {
			editingId = id;
			editingImageBase64 = record.imageBase64;

			document.getElementById("editUserName").value = record.userName;
			document.getElementById("editUserEmail").value = record.userEmail;
			document.getElementById("editSerialNumber").value = record.serialNumber;
			document.getElementById("editBrand").value = record.brand;
			document.getElementById("editModel").value = record.model;

			if (editingImageBase64) {
				editPreviewImage.src = editingImageBase64;
				editPreviewImage.style.display = "block";
				editPreviewPlaceholder.style.display = "none";
			} else {
				editPreviewImage.removeAttribute("src");
				editPreviewImage.style.display = "none";
				editPreviewPlaceholder.style.display = "block";
			}

			window.openModal("editModal");
		}

		if (action === "delete") {
			deletingId = id;
			deleteMessage.textContent = "Vas a borrar el registro de " + record.userName + ".";
			window.openModal("deleteModal");
		}
	});

	// Carga una nueva imagen en el modal de edicion y actualiza su preview.
	editImageInput.addEventListener("change", async function (event) {
		var file = event.target.files && event.target.files[0];
		if (!file) {
			return;
		}

		try {
			editingImageBase64 = await window.readFileAsBase64(file);
			editPreviewImage.src = editingImageBase64;
			editPreviewImage.style.display = "block";
			editPreviewPlaceholder.style.display = "none";
		} catch (error) {
			window.showToast("No se pudo leer la imagen.", "error");
		}
	});

	// Guarda los cambios del registro editado en LocalStorage.
	editForm.addEventListener("submit", function (event) {
		event.preventDefault();

		var data = {
			id: editingId,
			userName: String(editForm.userName.value || "").trim(),
			userEmail: String(editForm.userEmail.value || "").trim(),
			serialNumber: String(editForm.serialNumber.value || "").trim(),
			brand: String(editForm.brand.value || "").trim(),
			model: String(editForm.model.value || "").trim(),
			imageBase64: editingImageBase64
		};

		if (!window.validateBikeData(data, true)) {
			return;
		}

		var records = window.getBikeRecords();
		var updated = records.map(function (item) {
			if (item.id === editingId) {
				return data;
			}
			return item;
		});

		window.saveBikeRecords(updated);
		window.closeModal("editModal");
		window.showToast("Registro actualizado.", "ok");
		window.renderBikeList();
	});

	// Confirma y elimina el registro seleccionado.
	confirmDeleteBtn.addEventListener("click", function () {
		if (!deletingId) {
			return;
		}

		var records = window.getBikeRecords();
		var updated = records.filter(function (item) {
			return item.id !== deletingId;
		});

		window.saveBikeRecords(updated);
		window.closeModal("deleteModal");
		window.showToast("Registro eliminado.", "ok");
		window.renderBikeList();
		deletingId = "";
	});
});

