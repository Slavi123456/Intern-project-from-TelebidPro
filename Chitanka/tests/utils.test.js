import {describe , it, expect, describe} from "vitest";

import {getAvrWordCountInSetence, nonRepeatingWords, uniqueBetweenArrays} from "../src/utils.js";

describe("getAvrWordCountInSentence()", () => {
    it("empty text", () => {
        expect(getAvrWordCountInSetence("")).toBe(0);
    });
    it("only dots", () => {
        expect(getAvrWordCountInSetence("...")).toBe(0);
    });
    it("in english", () => {
        expect(getAvrWordCountInSetence("abc")).toBe(0.00);
    });
    it("one word", () => {
        expect(getAvrWordCountInSetence("а")).toBe(1.00);
    });
    it("two word", () => {
        expect(getAvrWordCountInSetence("а б")).toBe(2.00);
    });
    it("two sentences", () => {
        expect(getAvrWordCountInSetence("а б. в ")).toBe(1.50);
    });
    it("whole text", () => {
        expect(getAvrWordCountInSetence("Здравей! Как си? Днес е хубав ден, нали.")).toBe(2.67);
    });
});


describe("nonRepeatingWords()", () => {
    it("empty text", () => {
        expect(nonRepeatingWords("").length).toBe(0);
    });
    it("in english", () => {
        expect(nonRepeatingWords("a").length).toBe(0);
    });
    it("one world", () => {
        expect(nonRepeatingWords("а").length).toBe(1);
    });
    it("whole sentence", () => {
        expect(nonRepeatingWords("маг маг аа б в б")).toStrictEqual(["аа", "в"]);
    });
});

describe("uniqueBetweenArrays()", () => {
    it("empty arrays", ()=> {
        expect(uniqueBetweenArrays([], [])).toStrictEqual([]);
    });
    it("one word", ()=> {
        expect(uniqueBetweenArrays(['a'], [])).toStrictEqual(['a']);
    });
    it("full test", ()=> {
        expect(uniqueBetweenArrays(['a', "g", "b", "h"], ["a", "b", "c"])).toStrictEqual(["g","h","c",]);
    });
})