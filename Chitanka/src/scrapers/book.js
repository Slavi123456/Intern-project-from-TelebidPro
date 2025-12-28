// const baseUlr = "https://chitanka.info/person/Anna-Blaman";

// async function fetchBookInfo(cheerio) {
//   const infoDiv = cheerio("div.book-extra-info");
//   const info = {};

//   infoDiv.find("p").each((i, el) => {
//     let text = cheerio(el).text().trim();

//     const [key, value] = text.split(":").map((x) => x.trim());

//     if (key && value) {
//       info[key] = value;
//     }
//   });

//   //   console.log(info);
//   return info;
// }