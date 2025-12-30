window.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    await fetch("/api/init");

    const res = await fetch("/api/villages");
    const villageData = await res.json();
    console.log(villageData);
    fill_table(villageData);

    const resStat = await fetch("/api/init-statistics");
    const statistics = await resStat.json();

    console.log("Loaded:", statistics);

    document.getElementById("district_info").textContent = statistics.district_count;
    document.getElementById("township_info").textContent = statistics.township_count;
    document.getElementById("cityhall_info").textContent = statistics.cityhalls_count;
    document.getElementById("village_info").textContent = statistics.village_count;
  } catch (e) {
    console.error("Error loading:", e);
  }
}
///////////////////////////////////////////////////

document
  .getElementById("villageForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // stop page reload

    const data = {
      name: document.getElementById("bg-name").value,
      englishName: document.getElementById("en-name").value,
    };

    submid_handler(data);
  });

async function submid_handler(info) {
  // console.log("Form submitted:", info);

  const bg = document.getElementById("bg-name").value.trim();
  const en = document.getElementById("en-name").value.trim();

  const query = {};

  if (bg == "" && en == "") return;
  if (bg !== "") query.bgName = bg;
  if (en !== "") query.enName = en;

  const params = new URLSearchParams(query).toString();

  // console.log("QUery submitted:", query);

  await fetch(`/search/villages?${params}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Results:", data);
        console.log(data.rows);
      fill_table(data.rows);
    });
}
let currentPage = 1;
const rowsPerPage = 10;

function fill_table(data) {
  // const villagesData = [
  //   {
  //     id: "94126",
  //     name: "ДЗС",
  //     name_en: "DZS",
  //     districtname: "Русе",
  //     townshipname: "Русе",
  //     cityhallname: "Басарбово",
  //   },
  // ];
  // console.log(data);

  const tbody = document.querySelector("#villagesTable tbody");
  tbody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = data.slice(start, end);

  console.log(pageData);

  pageData.forEach((village) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><p>${village.id}</p></td>
      <td><p>${village.name}</p></td>
      <td><p>${village.name_en}</p></td>
      <td><p>${village.districtname}</p></td>
      <td><p>${village.townshipname}</p></td>
      <td><p>${village.cityhallname}</p></td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    row.querySelector(".edit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      console.log(`Edit ${village.name}`);
    });

    row.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const confirmDelete = confirm(`Delete ${village.name}?`);
      if (confirmDelete) {
        console.log(`Delete ${village.name}`);
      }
    });

    tbody.appendChild(row);
  });

  const pageInfo = document.getElementById("pageInfo");
  const totalPages = Math.ceil(data.length / rowsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}
