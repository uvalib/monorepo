# `occupancy-tools`

> Script to pull occupancy (and related) data from endpoints into our libinsight db 

## Usage

```
export AXISUSER=user
export AXISPASS=password
export LIBINSIGHTTOKEN=token
npx occupancy-poller
```

## Deployment

First build the service container using [this TeamCity job](https://teamcity.lib.virginia.edu/buildConfiguration/OccupancyService_BuildImage#all-projects).

Then deploy the container using [this TeamCity job](https://teamcity.lib.virginia.edu/buildConfiguration/OccupancyService_ProductionDeploy#all-projects)
