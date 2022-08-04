# `occupancy-tools`

> Scripts to pull occupancy (and related) data from endpoints into our db

## Usage

```
export FIREBASEKEY=$(cat /path/to/keyfile)
export AXISUSER=user
export AXISPASS=password
npx occupancy-poller
```

## Deployment

First build the service container using [this TeamCity job](https://teamcity.lib.virginia.edu/buildConfiguration/OccupancyService_BuildImage#all-projects).

Then deploy the container using [this TeamCity job](https://teamcity.lib.virginia.edu/buildConfiguration/OccupancyService_ProductionDeploy#all-projects)
