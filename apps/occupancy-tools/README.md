# `occupancy-tools`

> Script to pull occupancy (and related) data from endpoints into our libinsight db 

## Usage

Set the necessary environment variables:

```sh
export AXISUSER=user
export AXISPASS=password
export LIBINSIGHTTOKEN=token
```

Now you can execute the compiled script by running:

```sh
pnpm start
```

## Deployment

First, build the service container using [this TeamCity job](https://teamcity.lib.virginia.edu/buildConfiguration/OccupancyService_BuildImage#all-projects).

Then, deploy the container using [this TeamCity job](https://teamcity.lib.virginia.edu/buildConfiguration/OccupancyService_ProductionDeploy#all-projects).
