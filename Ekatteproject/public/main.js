window.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const res = await fetch("/api/init");
    const data = await res.json();

    console.log("Loaded:", data);

    document.getElementById("district_info").textContent = data.district_count;
    document.getElementById("township_info").textContent = data.township_count;
    document.getElementById("cityhall_info").textContent = data.cityhalls_count;
    document.getElementById("village_info").textContent = data.village_count;
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

  await fetch(`/villages?${params}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Results:", data);
        console.log(data.rows);
      fill_table(data.rows);
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

  data.forEach((village) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${village.id}</td>
      <td>${village.name}</td>
      <td>${village.name_en}</td>
      <td>${village.districtname}</td>
      <td>${village.townshipname}</td>
      <td>${village.cityhallname}</td>
    `;

    tbody.appendChild(row);
  });
}
