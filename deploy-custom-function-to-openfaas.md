### Deploy a Custom Node.js Function on OpenFaaS

- This guide uses the latest **Node.js 22 (HTTP-based)** template with **of-watchdog**, which allows your function to handle HTTP requests directly.

1. Pull the Latest Templates

- ```faas-cli template store pull node22```

   - Check available templates:
      - ```faas-cli template store list```

2. Create Your Function

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
    image: hello-node:latest
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

- Tag the image for the local registry
  - docker tag localhost:5002/hello-node:latest host.docker.internal:5002/hello-node:latest

- Push it to the local registry
  - docker push localhost:5002/hello-node:latest

5. Deploy the Function to OpenFaaS

- faas-cli deploy -f stack.yaml
  - **Note:** , If you see the error :
    - "Unexpected status: 400, message: the Community Edition license agreement only allows public images"
  - To deploy private images, you need to use **[OpenFaaS Pro](https://www.openfaas.com/enterprise/)**, which includes support for private container registries and other enterprise features.
