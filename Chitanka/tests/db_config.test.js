import { describe, it, vi, expect } from 'vitest';

describe('sum()', () => {
  it('adds numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});

function sum(a, b) {
  return a + b;
}
// vi.mock('pg', () => {
//     return {
//         Client: vi.fn().mockImplementation(() => ({
//             connect: vi.fn().mockResolvedValue(true),
//             end: vi.fn().mockResolvedValue(true),
//             query: vi.fn().mockResolvedValue({ rows: [] }),
//         })),
//     };
// });

// import { Client } from "pg";

// describe("Database connection", () => {
//     it("should connect", async () => {
//         const client = new Client({
//             user: '',
//             password: '',
//             host: '',
//             port: '',
//             database: '',
//         });

//         await client.connect();
//         expect(client.connect).toHaveBeenCalled();
//     })
// })