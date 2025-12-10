import { validateMany } from "../utils/validation.js";
import dotenv from 'dotenv';
export {parse_names_from_village_text};

dotenv.config();

function parse_names_from_village_text(text_to_parse) {
  validateMany ( {
    text_to_parse: process.env.VALIDATION_TYPE_NONEMPTY_STRING,
  }, arguments);

  /////
  //Logic
  const village_area_regex =
    /^\(([A-Za-z0-9]{5})\)\s*(?:(?:с\.|гр\.)?\s*([^,]+),\s*)?общ\.?\s*([^,]+),\s*обл\.?\s*(.+)$/;
  const match = text_to_parse.match(village_area_regex);

  if (!match) throw new SyntaxError(`Invalid village format for ${text_to_parse}`);
  const [, code, settlement, township, district] = match;
  
  const result = {
    code: code.trim(),
    settlement: settlement == null ? "null" : settlement.trim(),
    township: township.trim(),
    district: district.trim(),
  };
  
  if(result.township == "" || result.district == "") {
    throw new SyntaxError(`Invalid village format for ${text_to_parse}`);
  }

  return result;
}