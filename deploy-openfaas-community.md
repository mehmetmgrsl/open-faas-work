### Deploy OpenFaaS Community Edition (CE)

### Create Namespaces for OpenFaaS

- kubectl apply -f https://raw.githubusercontent.com/openfaas/faas-netes/master/namespaces.yml

### Add the OpenFaaS Helm Chart Repository

- helm repo add openfaas https://openfaas.github.io/faas-netes/
- helm repo update

### Install OpenFaaS via Helm (using NodePort)

- Install using NodePort service type:

```
helm upgrade openfaas --install openfaas/openfaas \
  --namespace openfaas \
  --set functionNamespace=openfaas-fn \
  --set generateBasicAuth=true \
  --set serviceType=NodePort
```

- This exposes the OpenFaaS Gateway at a NodePort (default: 31112)


### Retrieve the Admin Password

```echo $(kubectl -n openfaas get secret basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode)```

### Port-Forward the Gateway (localhost access)

```
kubectl port-forward -n openfaas svc/gateway 8080:8080 &
export OPENFAAS_URL=http://127.0.0.1:8080
```

- access it from a browser: http://127.0.0.1:8080
  - Login using:
    - Username: admin
    - Password: (use the password retrieved from the command above)

### Install and Log in to faas-cli
- Install cli
  - curl -sSL https://cli.openfaas.com | sudo sh
- Login
  - export OPENFAAS_URL=http://127.0.0.1:8080
  - export PASSWORD=$(kubectl -n openfaas get secret basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode)
  - echo -n $PASSWORD | faas-cli login -g $OPENFAAS_URL -u admin --password-stdin
    - Logs in to the OpenFaaS gateway using the admin username and the decoded password

### Deploy a Sample Function
- faas-cli store deploy figlet
- Then test it:
  - echo "Hello Mehmet" | faas-cli invoke figlet


### References

(1*) https://github.com/openfaas/faas-netes/blob/master/chart/openfaas/README.md#deploy-openfaas-community-edition-ce