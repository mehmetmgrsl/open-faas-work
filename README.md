### OpenFaaS?
- A framework to deploy serverless functions on Kubernetes using Docker images. 
- Unlike AWS Lambda, it gives you full control over the infrastructure.

### Core Concepts:

- faas-cli (CLI to build/deploy functions)

- Gateway (exposes functions via HTTP)

- Function templates (boilerplate code for Python, Go, Node, etc.)

- Watchdog (turns container into function)

- faas-netes (K8s controller)

### Installation

- [K8s Cluster with Kind](./k8s-cluster-with-kind.md)

- [Deploy open-faas community edition](./deploy-openfaas-community.md)

### Deploy a Custom Node.js Function on OpenFaaS

- [Deploy a Custom Node.js Function on OpenFaaS](./deploy-custom-function-to-openfaas.md)

### References

(1*) https://docs.openfaas.com/

(2*) https://docs.openfaas.com/cli/templates/