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
      fbpath: [
        'locations-schemaorg/location/science/estimatedOccupancy',
        'locations-schemaorg/location/science/occupancy'
      ],
      fblogpath: 'locationsLogs/science/estimatedOccupancylog',
      name: 'SEL Main Entry (Lead Camera)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.12.102',
      name: 'SEL Lower Level Stairwell Exit Door 1 (C054)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.12.103',
      name: 'SEL Lower Level Stairwell Exit Door 2 (C059)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.12.104',
      name: 'SEL Lower Level Stairwell Exit Door 3 (C048)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.87',
      fbpath: [
        'locations-schemaorg/location/clemons/estimatedOccupancy',
        'locations-schemaorg/location/clemons/occupancy'
      ],
      fblogpath: 'locationsLogs/clemons/estimatedOccupancylog',
      name: 'Clemons Main Entry (Lead Camera)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.88',
      name: 'Clemons Main Entry (C410)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.89',
      name: 'Clemons western stair outside exit (C306)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.90',
      name: 'Clemons southern stair outside exit (C307)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.91',
      name: 'Clemons central stair outside exit (C305)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.92',
      name: 'Clemons 300c eastern exit to Special Collections Library',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.93',
      name: 'Clemons 300 northern exit (300)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.94',
      name: 'Clemons 200 northern exit (200)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.95',
      name: 'Clemons 200 western exit (200)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.96',
      name: 'Clemons eastern stair outside exit (c101)',
    },
    {
      userId: process.env.AXISUSER,
      pass: process.env.AXISPASS,
      domain: '172.29.5.97',
      name: 'Clemons 100 northern exit (100)',
    },
  ],
};
