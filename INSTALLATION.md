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

### References

(1*) https://github.com/openfaas/faas-netes/blob/master/chart/openfaas/README.md#deploy-openfaas-community-edition-ce