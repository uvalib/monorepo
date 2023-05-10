import { EleventyConfig } from '@11ty/eleventy';
import { CustomElementsPlugin } from "eleventy-custom-elements-plugin";

export default function (eleventyConfig: EleventyConfig) {
  // Add filters, etc.

  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy('src/static');

  eleventyConfig.addPlugin(new CustomElementsPlugin({
    version: "1.0.0",
  }));
  

  return {
    dir: {
      input: 'src',
      output: '_site',
    },
  };
}
