# Welcome to rskj-truffle-tests test suite
[![CircleCI](https://circleci.com/gh/rsksmart/rskj-truffle-tests/tree/master.svg?style=svg)](https://circleci.com/gh/rsksmart/rskj-truffle-tests/tree/master)


# About
This is a Test Suite for Truffle compatibility validation of [RSKj](https://github.com/rsksmart/rskj).
It's implemented using NodeJS and Truffle and it's meant to test Smart Contracts deployment and execution.
This is still a BETA but it's fully functional and tests can be incorporated.


## Prerequisites
- npm 
- RSKj node running on localhost and port 4444
- Clone this repository
- npm install

## Configuration
Create the `.env` file in the root directory with the following variable:
```
TESTOMATIO=Testomat_API_KEY
```

## Synchronize tests in testomat
- Run the script `sync_tests_testomat`

## Running tests
- npm test

## Adding Tests
Tests & Contracts can be added directly to the respective folders in order for the suite to execute them.

This repository also includes CircleCI configuration for workflows on commit/builds and daily job.

