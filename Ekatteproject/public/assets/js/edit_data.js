window.addEventListener("DOMContentLoaded", loadOptions);

const districtSelect = document.getElementById("district_id");
const townshipSelect = document.getElementById("township_id");
let townships, districts;

districtSelect.addEventListener("change", async () => {
  const districtId = districtSelect.value;
  if (!districtId) {
    await fillOptions(townships, "township_id");
    return;
  }
  const filtered = townships.filter((t) => {
    const { id, name } = t;
    return id.includes(districtId);
  });
   await fillOptions(filtered, "township_id");
});

townshipSelect.addEventListener('change', async () => {
  const townshipId = townshipSelect.value;
  if (!townshipId) return;

  const district = districts.find(t => t.id === townshipId.slice(0,3));
  if (!district) return;

  const optionToSelect = [...districtSelect.options].find(
    (opt) => opt.value === district.id
  );
  optionToSelect.selected = true;
});

async function loadOptions() {
  try {
    const townshipRes = await fetch("/townships-names");
    townships = await townshipRes.json();
    await fillOptions(townships, "township_id");

    const districtRes = await fetch("/districts-names");
    districts = await districtRes.json();
    await fillOptions(districts, "district_id");

    fillOnEditForm();
  } catch (err) {
    console.error("Error fetching options:", err);
  }
}

document
  .getElementById("new-entry-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const townshipSelect = document.getElementById("township_id");
    const districtSelect = document.getElementById("district_id");

    const data = {
      name: document.getElementById("name").value,
      name_en: document.getElementById("name_en").value,
      township_name:
        townshipSelect.options[townshipSelect.selectedIndex].text.trim(),
      district_name:
        districtSelect.options[districtSelect.selectedIndex].text.trim(),
    };

    try {
      //Becuase the page is used for creation and editing i need the separation
      const data_id = new URLSearchParams(window.location.search).get("id");
      let res;
      if (data_id) {
        data.id = data_id;

        res = await fetch("/api/edit-data", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        res = await fetch("/api/create-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      if (res.ok) {
        console.log("Record added successfully!");
        window.location.href = "/";
      } else {
        const errMsg = await res.text();
        console.error("Failed to add record: " + errMsg);

        const errorBlock = document.getElementById("error-message");
        errorBlock.innerHTML = "";
        errorBlock.innerHTML = "Error:" + errMsg;
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error submitting form");
    }
  });

function selectOption(selectElement, textToMatch) {
  textToMatch = textToMatch?.trim() || "";

  const optionToSelect = [...selectElement.options].find(
    (opt) => opt.textContent.trim() === textToMatch
  );

  if (optionToSelect) {
    optionToSelect.selected = true;
  } else {
    selectElement.value = "";
  }
}

async function fillOptions(json, blockId) {
  const selectBlock = document.getElementById(blockId);
  selectBlock.innerHTML = "";

  json.forEach((t) => {
    const option = document.createElement("option");
    option.value = t.id;
    option.textContent = t.name;
    selectBlock.appendChild(option);
  });
  selectBlock.value = "";
}

function fillOnEditForm() {
  const params = new URLSearchParams(window.location.search);
  console.log(params);

  const mode = params.get("mode");
  const name = params.get("name");
  const name_en = params.get("name_en");
  const townshipname = params.get("townshipname");
  const districtname = params.get("districtname");

  if (mode === "edit") {
    document.getElementById("name").value = name ?? "";
    document.getElementById("name_en").value = name_en ?? "";

    const township = decodeURIComponent(townshipname || "").trim();
    selectOption(document.getElementById("township_id"), township);

    const district = decodeURIComponent(districtname || "").trim();
    selectOption(document.getElementById("district_id"), district);
  }
}
