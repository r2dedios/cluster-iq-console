IMAGE_TAG := $(shell git rev-parse --short=7 HEAD)
CONTAINER_ENGINE ?= $(shell which podman >/dev/null 2>&1 && echo podman || echo docker)
K8S_CLI ?= $(shell which oc >/dev/null 2>&1 && echo oc || echo kubectl)
REGISTRY ?= quay.io
PROJECT_NAME ?= cluster-iq
REGISTRY_REPO ?= ecosystem-appeng
CONSOLE_IMG_NAME ?= $(PROJECT_NAME)-console
CONSOLE_IMAGE ?= $(REGISTRY)/$(REGISTRY_REPO)/$(CONSOLE_IMG_NAME)

install: ## Install project dependencies
	@echo "### [Installing dependencies] ###"
	@npm install

build-local: ## Build the project locally
	@echo "### [Building project] ###"
	@npm run build

build-container: ## Build the project's container image
	@echo "### [Building project's container image] ###"
	@$(CONTAINER_ENGINE) build -t $(CONSOLE_IMAGE):latest -f ./Containerfile .
	@$(CONTAINER_ENGINE) tag $(CONSOLE_IMAGE):latest $(CONSOLE_IMAGE):$(IMAGE_TAG)
	@echo "Build Successful"

push-container: ## Push the container image to the remote repository
	@$(CONTAINER_ENGINE) push $(CONSOLE_IMAGE):latest
	@$(CONTAINER_ENGINE) push $(CONSOLE_IMAGE):$(IMAGE_TAG)

start-dev: export VITE_CIQ_API_URL = http://localhost:8081
start-dev: ## Start the project in development mode
	@echo "### [Starting project DEV MODE] ###"
	@echo "### [API-URL: $$VITE_CIQ_API_URL] ###"
	@npm run start

.DEFAULT_GOAL := help
help: ## Display this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
