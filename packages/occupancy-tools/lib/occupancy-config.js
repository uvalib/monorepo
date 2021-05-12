export default {
  libraryHours: {
    libcalURL:
      'https://api3.libcal.com/api_hours_grid.php?format=jsonld&iid=863&lid=',
  },
  occupancyEstimators: [
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.12.101',
      fbpath: 'locations-schemaorg/location/science/estimatedOccupancy',
      fblogpath: 'locationsLogs/science/estimatedOccupancylog',
      name: 'Brown',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.87',
      fbpath: 'locations-schemaorg/location/clemons/estimatedOccupancy',
      fblogpath: 'locationsLogs/clemons/estimatedOccupancylog',
      name: 'Clemons',
    },
  ],
};
