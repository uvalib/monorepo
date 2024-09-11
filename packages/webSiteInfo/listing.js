import { url } from "inspector";

const Sites = [
    { 
        name: "100 Objects", 
        matomoSiteId: 31, 
        urls: ["https://100objects.lib.virginia.edu/"] 
    },
    { 
        name: "Avalon", 
        matomoSiteId: 42, 
        urls: ["https://avalon.lib.virginia.edu/"] 
    },
    { 
        name: "Explore", 
        matomoSiteId: 2, 
        urls: ["https://explore.lib.virginia.edu/"] 
    },
    { 
        name: "Faculty Newsletter", 
        matomoSiteId: 22, 
        inactive: true 
    },
    { 
        name: "Library Cluster", 
        matomoSiteId: 3, 
        urls: [
            "https://jti.lib.virginia.edu/",
            "https://etext.virginia.edu/"
        ], 
        inactive: true },
    { 
        name: "Library Web Site", 
        matomoSiteId: 10,
        urls: [
            "https://www.library.virginia.edu/",
            "https://library.virginia.edu/"
        ]
    },
    { 
        name: "Mobile", 
        matomoSiteId: 13,
        inactive: true 
    },
    { 
        name: "Research Guides", 
        matomoSiteId: 5,
        urls: [
            "https://guides.lib.virginia.edu/"
        ]
    },
    { 
        name: "Staff newsletter", 
        matomoSiteId: 26,
        inactive: true
    },
    { 
        name: "Tedium Reducer III", 
        matomoSiteId: 41,
        urls: [
            "https://fillholdreader.internal.lib.virginia.edu/"
        ]
    },
    { 
        name: "Test UX", 
        matomoSiteId: 23,
        description: "Test Matomo Id for development/testing purposes",
    },
    { 
        name: "The Taper", 
        matomoSiteId: 25,
        urls: [
            "https://thetaper.library.virginia.edu/"
        ]
    },
    { 
        name: "Virgo", 
        matomoSiteId: 1,
        urls: [
            "https://search.lib.virginia.edu/"
        ] 
    },
    { 
        name: "Virgo Lite", 
        matomoSiteId: 40,
        urls: [
            "https://search-kiosk.lib.virginia.edu/"
        ]
    },
    {
        name: "Modern Library Bibliography",
        urls: [
            "https://mlbib.library.virginia.edu/"
        ]
    },
    {
        name: "Board of Visitors Minutes",
        urls: [
            "https://bov.library.virginia.edu/"
        ]   
    }
  ];
  
  export default Sites;
  