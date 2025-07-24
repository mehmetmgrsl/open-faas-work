### Deploy a Custom Node.js Function on OpenFaaS

- This guide uses the latest **Node.js 22 (HTTP-based)** template with **of-watchdog**, which allows your function to handle HTTP requests directly.

0. Create a Private ECR Repository on AWS

- aws ecr create-repository --repository-name hello-node

1. Create Secret to use Private Docker Registry on AWS

```
kubectl create secret docker-registry ecr-registry-secret \
  --docker-server=<account-id>.dkr.ecr.eu-west-1.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password --region eu-central-1) \
  --docker-email=user-email \
  --namespace=openfaas-fn
```

2. Pull the Latest Templates

- ```faas-cli template store pull node22```

   - Check available templates:
      - ```faas-cli template store list```

3. Create Your Function

- Create a new Node.js function named hello-node:
  - ```faas-cli new hello-node --lang node22```

  - Resulting structure:

```
./hello-node/
├── handler.js        # your Node.js function logic
├── package.json      # optional dependencies
stack.yaml            # OpenFaaS deployment config
```

- Update stack.yaml like below:

```
version: 1.0
provider:
  name: openfaas
  gateway: http://127.0.0.1:8080
functions:
  hello-node:
    lang: node22
    handler: ./hello-node
    image: <account-id>.dkr.ecr.eu-west-1.amazonaws.com/hello-node:latest
    imagePullSecrets:
      - ecr-registry-secret
```

3. Write Your Function Code

- Edit hello-node/handler.js:

```
"use strict"

module.exports = async (event, context) => {
  const name = event.body || "Mehmet"
  return context
    .status(200)
    .headers({ "Content-Type": "text/plain" })
    .succeed(`Hello, ${name} from Node.js + OpenFaaS`)
}
```

4. Build and Push to Local Registry

- Build the Docker image
  - faas-cli build -f stack.yaml

- Tag the image 
  - docker tag hello-node:latest <account-id>.dkr.ecr.eu-central-1.amazonaws.com/hello-node:latest


- Push it to the docker hub
  - docker push <account-id>.dkr.ecr.eu-central-1.amazonaws.com/hello-node:latest


5. Deploy the Function to OpenFaaS

- kubectl apply -f deploy.yaml
- kubectl apply -f svc.yaml

- kubectl port-forward svc/hello-node -n openfaas-fn 8081:8080
- http://localhost:8081


- **Note**: The following approach does not work with the OpenFaaS Community Edition if you are using a private container image:
   - faas-cli deploy -f stack.yaml
     - If you see the error :
       - "Unexpected status: 400, message: the Community Edition license agreement only allows public images"
     - To deploy private images, you need to use **[OpenFaaS Pro](https://www.openfaas.com/enterprise/)**, which includes support for private container registries and other enterprise features.


### Uninstall OpenFaaS and delete the K8S Cluster

- helm uninstall openfaas -n openfaas
- kubectl delete namespace openfaas openfaas-fn
- kind delete cluster --name openfaas   
- aws ecr delete-repository --repository-name hello-node --force
