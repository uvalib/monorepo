export default {
    occupancyEstimators: [
        {
          userId: process.env.AXISUSER,
          pass: process.env.AXISPASS,
          domain: "172.29.12.101",
          fbpath: "locations-schemaorg/location/science/estimatedOccupancy",
          fblogpath: "locationsLogs/science/estimatedOccupancylog"
        },
        {
          userId: process.env.AXISUSER,
          pass: process.env.AXISPASS,
          domain: "172.29.5.87",
          fbpath: "locations-schemaorg/location/clemons/estimatedOccupancy",
          fblogpath: "locationsLogs/clemons/estimatedOccupancylog"
        }
    ]
}