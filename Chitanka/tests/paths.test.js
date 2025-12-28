import path from "path";
import { fileURLToPath } from "url";
import {describe ,it, expect } from "vitest";

import { __scrappedFileDir, __websiteUrl } from '../src/paths';

describe('Path and URL constants', () => {
  
  it('__scrappedFileDir is calculated correctly', () => {
    const __filename = fileURLToPath(import.meta.url);
    const __srcFolderDirectory = path.dirname(__filename);
    const __projectDir = path.dirname(__srcFolderDirectory);
    const expectedScrappedFileDir = path.join(__projectDir, "books");

    expect(path.isAbsolute(__scrappedFileDir)).toBe(true); 
    expect(__scrappedFileDir).toBe(expectedScrappedFileDir);
  });

  it('__websiteUrl is set correctly', () => {
    const expectedUrl = 'https://chitanka.info';
    
    expect(__websiteUrl).toBe(expectedUrl);
  });
});

