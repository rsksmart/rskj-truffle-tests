# Welcome to rskj-truffle-tests test suite
[![CircleCI](https://circleci.com/gh/rsksmart/rskj-truffle-tests/tree/master.svg?style=svg)](https://circleci.com/gh/rsksmart/rskj-truffle-tests/tree/master)
test


# About
This is a Test Suite for Truffle compatibility validation of [RSKj](https://github.com/rsksmart/rskj).
It's implemented using NodeJS and Truffle and it's meant to test Smart Contracts deployment and execution.
This is still a BETA but it's fully functional and tests can be incorporated.


# Getting Started
Prerequisites:
- npm 
- RSKj node running on localhost and port 4444

Instructions:
- Clone this repository
- npm install
- npm test

# Adding Tests
Tests & Contracts can be added directly to the respective folders in order for the suite to execute them.

This repository also includes CircleCI configuration for workflows on commit/builds and daily job.
