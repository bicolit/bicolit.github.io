import { createReader } from "@keystatic/core/reader";

import keystaticConfig from "../../keystatic.config";

// Reads committed content from the local filesystem at build/request time.
// (The `github` storage kind only affects in-browser editing, not reads.)
export const reader = createReader(process.cwd(), keystaticConfig);
