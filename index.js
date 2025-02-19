document.addEventListener("DOMContentLoaded", function () {
  const addDocbtn = document.querySelector("#adddoc");
  const closebtn = document.querySelector(".close-btn");

  // Handling Form
  const form = document.querySelector("#fileUploadForm");
  const docNameInput = document.getElementById("docName");
  const fileUploadInput = document.getElementById("fileUpload");
  const statusSelect = document.getElementById("status");
  let arr = JSON.parse(localStorage.getItem("documents")) || [];
  const submitbtn = document.querySelector("#submitbtn");
  const searchInput = document.querySelector(".search");
  const overlay = document.querySelector(".overlay");
  const popupform = document.querySelector(".popupform");
  const selectAll = document.querySelector("#selectall");

  showData(arr);

  addDocbtn.addEventListener("click", () => {
    showPopup();
  });

  closebtn.addEventListener("click", closePopup);

  overlay.addEventListener("click", closePopup);

  popupform.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  submitbtn.addEventListener("click", (event) => {
    event.preventDefault();

    const docName = docNameInput.value;
    const file = fileUploadInput.files[0];
    const status = statusSelect.value;
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    addData(docName, file, status, date, time);
    closePopup();
    clearFields();
  });

  searchInput.addEventListener("input", filterData);

  selectAll.addEventListener("change", toggleSelectAll);

  function clearFields() {
    docNameInput.value = "";
    fileUploadInput.value = "";
    statusSelect.selectedIndex = 0;
  }

  function showPopup() {
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".popupform").style.display = "block";
  }

  function closePopup() {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".popupform").style.display = "none";
    toggleDeleteButton();
    //selectAll.checked =false;
  }

  function addData(docName, file, status, date, time) {
    const fileData = file ? { name: file.name, type: file.type } : null;
    const data = {
      docName,
      file: fileData,
      status,
      date,
      time,
    };
    arr.push(data);
    savetoLocalStorage(arr);
    showData(arr);
  }

  function showData(values) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    values.forEach((data, index) => {
      const row = document.createElement("tr");

      const checkboxTd = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("row-checkbox");
      checkbox.dataset.index = index;
      checkbox.addEventListener("change", toggleDeleteButton);
      checkboxTd.appendChild(checkbox);
      row.appendChild(checkboxTd);

      const docName = document.createElement("td");
      docName.textContent = data.docName;
      row.appendChild(docName);

      const status = document.createElement("td");
      const statusSpan = document.createElement("span");
      statusSpan.classList.add("status", data.status);
      statusSpan.textContent = data.status;
      status.appendChild(statusSpan);
      row.appendChild(status);

      const lastModifiedCell = document.createElement("td");

      lastModifiedCell.innerHTML = `
            <div style="display: flex; gap: 20%; align-items: center;">
                <p>${data.date},<br>${data.time}</p>
                <button class="action-btn">Preview</button>
                <div class="menu-container">
                   <img id="threedot" src="assests/threedot.png" class="menu-icon" data-index="${index}" alt="Options"/>
                 </div>
            </div>
        `;

      row.appendChild(lastModifiedCell);
      tbody.appendChild(row);
    });
  }

  function filterData() {
    const filter = searchInput.value.toLowerCase();
    if (filter === " ") {
      showData(arr);
    } else {
      const filteredData = arr.filter((data) =>
        data.docName.toLowerCase().includes(filter)
      );
      showData(filteredData);
    }
  }

  function savetoLocalStorage(arr) {
    localStorage.setItem("documents", JSON.stringify(arr));
  }

  function toggleDeleteButton() {
    const checkboxes = document.querySelector(".row-checkbox:checked");
    const deleteButton = document.getElementById("delete-btn");

    if (checkboxes) {
      deleteButton.style.display = "block";
    } else {
      deleteButton.style.display = "none";
    }
  }

  function deleteSelectedRows() {
    const checkboxes = document.querySelectorAll(".row-checkbox:checked");
    const indexes = Array.from(checkboxes).map((checkbox) =>
      parseInt(checkbox.dataset.index)
    );

    arr = arr.filter((_, index) => !indexes.includes(index));
    showData(arr);
    savetoLocalStorage(arr);
    selectAll.checked=false;
  }

  function toggleSelectAll() {
    const checkboxes = document.querySelectorAll(".row-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAll.checked;
      console.log(selectAll.checked);
    });
    toggleDeleteButton();
  }
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<img src="assests/delete.png" alt="Delete" style="width: 28px; height: 28px;"> `;
  deleteButton.id = "delete-btn";
  deleteButton.style.display = "none";
  deleteButton.addEventListener("click", deleteSelectedRows);
  document.body.appendChild(deleteButton);
});

console.log("hello");