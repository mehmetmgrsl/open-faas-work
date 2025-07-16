### Deploy OpenFaaS Community Edition (CE)

### Create a K8S Cluster


```
minikube start --nodes 2 -p host-k8s-cluster --driver=docker --bootstrapper=kubeadm --kubernetes-version=latest --force

minikube profile host-k8s-cluster

minikube addons enable ingress


kubectl --namespace ingress-nginx wait \
    --for=condition=ready pod \
    --selector=app.kubernetes.io/component=controller \
    --timeout=120s


export INGRESS_HOST=$(minikube ip)
echo "INGRESS_HOST:"
echo $INGRESS_HOST
```




### Create Namespaces for OpenFaaS

- kubectl apply -f https://raw.githubusercontent.com/openfaas/faas-netes/master/namespaces.yml

### Add the OpenFaaS Helm Chart Repo

- helm repo add openfaas https://openfaas.github.io/faas-netes/
- helm repo update

### Install OpenFaaS via Helm

- Install using NodePort service type:

```
helm upgrade openfaas --install openfaas/openfaas \
  --namespace openfaas \
  --set functionNamespace=openfaas-fn \
  --set generateBasicAuth=true \
  --set serviceType=NodePort
```

- This exposes the OpenFaaS Gateway at a NodePort (default: 31112)


### Get the admin password

```echo $(kubectl -n openfaas get secret basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode)```


### Port-forward the Gateway (for localhost access)

```
kubectl port-forward -n openfaas svc/gateway 8080:8080 &
export OPENFAAS_URL=http://127.0.0.1:8080
```

- access it from a browser: http://127.0.0.1:8080
  - Login using:
    - Username: admin
    - Password: (use the password retrieved from the command above)

### Install and Login to faas-cli
- Install cli
  - curl -sSL https://cli.openfaas.com | sudo sh
- Login
  - export OPENFAAS_URL=http://127.0.0.1:8080
  - export PASSWORD=$(kubectl -n openfaas get secret basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode)
  - echo -n $PASSWORD | faas-cli login -g $OPENFAAS_URL -u admin --password-stdin

- Deploy a Sample Function:
  - faas-cli store deploy figlet
- Then test it:
  - echo "Hello Mehmet" | faas-cli invoke figlet

### Uninstall

- helm uninstall openfaas -n openfaas
- kubectl delete namespace openfaas openfaas-fn

### References

(1*) https://github.com/openfaas/faas-netes/blob/master/chart/openfaas/README.md#deploy-openfaas-community-edition-ce