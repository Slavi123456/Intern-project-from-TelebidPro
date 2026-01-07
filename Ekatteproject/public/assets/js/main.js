window.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    await fetch("/api/init");

    const res = await fetch("/api/villages");
    villageData = await res.json();
    console.log(villageData);
    fill_table(villageData);
    updatePageMenu();

    const resStat = await fetch("/api/init-statistics");
    const statistics = await resStat.json();

    console.log("Loaded:", statistics);

    document.getElementById("district_info").textContent =
      statistics.district_count;
    document.getElementById("township_info").textContent =
      statistics.township_count;
    document.getElementById("cityhall_info").textContent =
      statistics.cityhalls_count;
    document.getElementById("village_info").textContent =
      statistics.village_count;
  } catch (e) {
    console.error("Error loading:", e);
  }
}

document
  .getElementById("villageForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
      name: document.getElementById("bg-name").value,
      englishName: document.getElementById("en-name").value,
    };

    submid_handler(data);
  });

document.getElementById("prevBtn").addEventListener("click", function () {
  console.log("Previous button clicked!");
  prevPage();
});
document.getElementById("nextBtn").addEventListener("click", function () {
  console.log("Next button clicked!");
  nextPage();
});
document.getElementById("createRowBtn").addEventListener("click", function () {
  console.log("Create new row clicked!");
  window.location.href = "/edit_data.html?mode=create";

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
      console.log(data.rows);
      villageData = data.rows;
      fill_table(villageData);
      updatePageMenu();
    });
}

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
      <td><p style="font-size: 12px;">${village.id}</p></td>
      <td><p style="font-size: 12px;">${village.name}</p></td>
      <td><p style="font-size: 12px;">${village.name_en}</p></td>
      <td><p style="font-size: 12px;">${village.districtname}</p></td>
      <td><p style="font-size: 12px;">${village.townshipname}</p></td>
      <td><p style="font-size: 12px;">${village.cityhallname}</p></td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    row.querySelector(".edit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      console.log(`Edit ${village.name}`);
      const params = new URLSearchParams(village);
      window.location.href = "/edit_data.html?mode=edit&" + params.toString();
      // console.log("/edit?mode=edit" + params.toString());
    });

    row.querySelector(".delete-btn").addEventListener("click", async (e) => {
      e.stopPropagation();
      const confirmDelete = confirm(`Delete ${village.name}?`);
      if (confirmDelete) {
        console.log(`Delete ${village.id}`);
        const res = await fetch("/api/delete-data", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({id: village.id})
        });

        if (res.ok) {
          console.log("Village deleted successfully.");
          window.location.reload();
        } else {
          console.error("Failed to delete village.");
        }
      }
    });

    tbody.appendChild(row);
  });

  totalPages = Math.ceil(data.length / rowsPerPage);
}


function nextPage() {
  if (totalPages <= -1) return;
  if (currentPage < totalPages) {
    currentPage++;
    fill_table(villageData);
    updatePageMenu();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fill_table(villageData);
    updatePageMenu();
  }
}

let currentPage = 1;
const rowsPerPage = 10;
let totalPages = -1;
let villageData = [];

function updatePageMenu() {
  if (totalPages <= -1) return;
  const pageInfo = document.getElementById("pageInfo");
  pageInfo.textContent = `Страница ${currentPage} от ${totalPages}`;

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}
