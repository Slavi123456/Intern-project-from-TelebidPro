import { describe, it, expect, vi } from 'vitest';
import { unzipFile } from '../src/services/zip_manager.js'; 
import AdmZip from 'adm-zip';

vi.mock('adm-zip', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      extractAllTo: vi.fn().mockResolvedValue(true),
    })),
  };
});

vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

describe('unzipFile()', () => {

  it('should extract files', async () => {
    // const { existsSync } = require('fs');
    // existsSync.mockResolvedValue(true);

    const zipPath = 'path/book.zip';
    const outputFolder = './output';
    await unzipFile(zipPath, outputFolder);

    const zip = new AdmZip(zipPath);  
    await zip.extractAllTo(outputFolder, true);
    
    expect(AdmZip).toHaveBeenCalledWith(zipPath);
    expect(AdmZip().extractAllTo).toHaveBeenCalledWith(zipPath,outputFolder);
  });
});
