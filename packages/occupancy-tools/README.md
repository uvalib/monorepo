# `occupancy-tools`

> Scripts to pull occupancy (and related) data from endpoints into our db

## Usage

```
export GOOGLE_APPLICATION_CREDENTIALS="path/to/keyfile"
export AXISUSER=user
export AXISPASS=password
npx occupancy-poller
```

## Deployment

First build the service container using [this TeamCity job](https://github.com/uvalib/monorepo/commit/67b2aaff713afdb475b6dbd7d5a645070ed300c1).

Then deploy the container using [this TeamCity job](https://teamcity.lib.virginia.edu/buildConfiguration/OccupancyService_ProductionDeploy#all-projects)