import axios from "axios";

async function fetchPage(baseUlr) {
  const response = await axios.get(baseUlr);
  const html = response.data;

  console.log("Page downloaded! from url:", baseUlr);
  return html;
}


