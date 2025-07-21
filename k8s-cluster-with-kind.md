### Install and Start kind Cluster

- Create a kind cluster with local registry integration:
   - ```kind create cluster --name openfaas --config kind-registry.yaml```

- Start a Local Docker Registry

``` 
docker rm -f kind-registry || true

docker run -d -p 5002:5000 --name kind-registry --restart=always registry:2
```

- Connect it to the Kind network:
  - ```docker network connect kind kind-registry || true```

- Verify registry is alive:
  - ```curl http://localhost:5002/v2/```
  - You should get:
    - ```{}```

### Configure Docker to Allow Insecure Registry (Only if Using Local HTTP Registry)

- This step is only needed if you're using a local Docker registry without HTTPS (e.g., localhost:5002) on macOS or Windows with Docker Desktop.

- Go to "Docker Desktop" -> Settings -> "Docker Engine" and update the JSON like this:

```
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "insecure-registries": ["localhost:5002", "127.0.0.1:5002", "host.docker.internal:5002"]
}
```

- Skip this step if you're using a secure registry (like AWS ECR, Azure ACR, Docker Hub, etc.) or you're on Linux and already configured --insecure-registry

### Tell Kubernetes About the Local Registry
```
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: local-registry-hosting
  namespace: kube-public
data:
  localRegistryHosting.v1: |
    host: "localhost:5002"
    help: "https://kind.sigs.k8s.io/docs/user/local-registry/"
EOF
```