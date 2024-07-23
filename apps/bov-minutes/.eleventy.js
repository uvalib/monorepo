const templateConfig = require("@uvalib/11ty-template");

module.exports = function(eleventyConfig) {
    // Use the configuration from the template
    let config = templateConfig(eleventyConfig);

    eleventyConfig.addPassthroughCopy({ "searchIndex.json": "demo/searchIndex.json" });

    eleventyConfig.addFilter("safeJson", function(item) {
      // Create a new object with only the properties you need
      const safeItem = {
        title: item.data.title,
        description: item.data.description,
        // Add other necessary properties here
      };
      return JSON.stringify(safeItem); // Return stringified JSON
    });

    // Add a collection for the minutes
    eleventyConfig.addCollection("minutes", function(collectionApi) {
      return collectionApi.getFilteredByGlob("minutes/*.md");
    });
    eleventyConfig.addCollection("minutesByYear", function(collectionApi) {
        // Get all minutes
        let minutes = collectionApi.getFilteredByGlob("minutes/*.md");
      
        // Sort and group by year
        let minutesByYear = {};
        minutes.forEach(minute => {
          const year = minute.data.year;
          const month = minute.data.month;
      
          if (!minutesByYear[year]) {
            minutesByYear[year] = [];
          }
          
          minutesByYear[year].push(minute);
        });
      
        // Sort each year's minutes by month
        for (let year in minutesByYear) {
          minutesByYear[year].sort((a, b) => a.data.month - b.data.month);
        }
      
        return minutesByYear;
    });
      
    // other config settings...

    config.dir = {
        input: ".",
        output: "_site",
//        data: "mlb"
    };
    
    return config;
};