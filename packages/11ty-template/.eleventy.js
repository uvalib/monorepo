module.exports = (eleventyConfig) => {
    // Add filters, etc.
  
    // Passthrough copy for static assets
    eleventyConfig.addPassthroughCopy('src/static');
  
    return {
      dir: {
        input: 'src',
        output: '_site',
      },
    };
  };
  