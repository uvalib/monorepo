#!/usr/bin/env node
import dotenv from 'dotenv';
import { resetCounterBySlug } from '../lib/occupancy-client.js';

// Load environment variables from .env
dotenv.config();

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: reset-occupancy <slug>');
    process.exit(1);
  }
  try {
    console.log(`Triggering reset for slug: ${slug}`);
    const result = await resetCounterBySlug(slug);
    console.log('Reset result:', result);
  } catch (err) {
    console.error('Error during reset:', err);
    process.exit(1);
  }
}

main();