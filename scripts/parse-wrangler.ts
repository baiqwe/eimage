import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface D1Database {
  binding: string;
  database_name: string;
  database_id: string;
  migrations_dir?: string;
}

interface WranglerConfig {
  d1_databases?: D1Database[];
  [key: string]: unknown;
}

/**
 * Parses the wrangler.jsonc file and returns the configuration object
 * @returns {WranglerConfig} The parsed wrangler configuration
 * @throws {Error} If the file cannot be read or parsed
 */
export function parseWranglerConfig(): WranglerConfig {
  const wranglerPath = path.join(__dirname, '..', 'wrangler.jsonc');
  const wranglerContent = fs.readFileSync(wranglerPath, 'utf8');

  const jsonContent = stripJsoncComments(wranglerContent);

  // Fix trailing commas in objects and arrays (which are valid in JSONC but not in JSON)
  const fixedJsonContent = jsonContent.replace(/,\s*([}\]])/g, '$1'); // Replace trailing commas before closing brackets

  try {
    return JSON.parse(fixedJsonContent) as WranglerConfig;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse wrangler.jsonc: ${errorMessage}`);
  }
}

function stripJsoncComments(input: string): string {
  let output = '';
  let inString = false;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const next = input[i + 1];

    if (inLineComment) {
      if (char === '\n' || char === '\r') {
        inLineComment = false;
        output += char;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        i++;
      } else if (char === '\n' || char === '\r') {
        output += char;
      }
      continue;
    }

    if (inString) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      output += char;
    } else if (char === '/' && next === '/') {
      inLineComment = true;
      i++;
    } else if (char === '/' && next === '*') {
      inBlockComment = true;
      i++;
    } else {
      output += char;
    }
  }

  return output;
}

/**
 * Gets the D1 database configuration from wrangler.jsonc
 * @returns {{ name: string, id: string } | null} The database configuration or null if not found
 */
export function getD1Database(): { name: string; id: string } | null {
  const config = parseWranglerConfig();
  const d1Config = config.d1_databases?.[0];

  if (!d1Config) {
    return null;
  }

  return {
    name: d1Config.database_name,
    id: d1Config.database_id,
  };
}
