# Storage Adapter

## Overview
This service provides the user with a consistent interface for various PaaS storages. It implements a subset of the capabilities of Amazon S3 or Microsoft Azure. Every provider has it's own strategy that will be used to perform the actions on the selected provider.

## Installation

TODO

## Running the server
To run the server, run:

```
npm start
```

To view the Swagger UI interface:

```
open https://{serverAddress}:8080/docs
```