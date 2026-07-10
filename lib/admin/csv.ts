/** Escapes a field for safe CSV output, including protection against formula injection. */
function escapeCsvField(value: string | number): string {
  let str = String(value);

  // Prevent formula injection — Excel/Sheets can execute these as formulas
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }

  // Standard CSV escaping: wrap in quotes if it contains comma, quote, or newline
  if (/[",\n]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

export function buildCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [
    headers.map(escapeCsvField).join(","),
    ...rows.map((row) => row.map(escapeCsvField).join(",")),
  ];
  return lines.join("\n");
}