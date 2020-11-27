#!/bin/bash -e

mkdir -p .cache/coverage


js_tests () {
    # JavaScript
    COMPOSE_FILE=./dev/docker-compose.yaml docker-compose build ui
    COMPOSE_FILE=./dev/docker-compose.yaml docker-compose run \
		-e CI=1 \
		ui yarn install
    COMPOSE_FILE=./dev/docker-compose.yaml docker-compose run \
		-e CI=1 \
		ui yarn test --coverage
}

py_tests () {
    # Python
    COMPOSE_FILE=./dev/docker-compose.yaml docker-compose build control
    COMPOSE_FILE=./dev/docker-compose.yaml docker-compose run \
		--entrypoint /bin/sh \
		control -c 'pytest --ignore-glob=*~ --flake8 --cov-append --cov=playground.control --cov-report=term --cov-report=xml:coverage/coverage.xml tests/*py'
}

# js_tests
py_tests
