CLUSTER_NAME := lahuella
NAMESPACE := localstack
DOMAIN := midominio.local
TERRAFORM_DIR := terraform
K8S_DIR := k8s

.PHONY: all cluster install-localstack ingress terraform validate clean

## Flujo completo
all: cluster install-localstack ingress terraform validate

## Crear cluster de Minikube
cluster:
	@echo "Creando cluster Minikube: $(CLUSTER_NAME)"
	minikube start -p $(CLUSTER_NAME) --cpus=4 --memory=6g
	kubectl create namespace $(NAMESPACE) --dry-run=client -o yaml | kubectl apply -f -

## Instalar Localstack vía Helm
install-localstack:
	@echo "Instalando Localstack con Helm..."
	helm repo add localstack https://helm.localstack.cloud
	helm repo update
	helm upgrade --install localstack localstack/localstack \
		--namespace $(NAMESPACE) \
		--create-namespace \
		-f $(K8S_DIR)/localstack-values.yaml
	@echo "Esperando a que el pod de Localstack esté listo..."
	kubectl wait --for=condition=Ready pod -l app.kubernetes.io/name=localstack -n $(NAMESPACE) --timeout=180s

## Crear Ingress (midominio.local)
ingress:
	@echo "Creando Ingress..."
	kubectl apply -f $(K8S_DIR)/ingress.yaml
	@echo "Añadiendo entrada al /etc/hosts (requiere sudo)"
	@sudo bash -c "grep -q '$(DOMAIN)' /etc/hosts || echo $$(minikube ip -p $(CLUSTER_NAME)) $(DOMAIN) >> /etc/hosts"

## Ejecutar Terraform
terraform:
	@echo "Inicializando y aplicando Terraform..."
	cd $(TERRAFORM_DIR) && tfenv use 1.5.5
	cd $(TERRAFORM_DIR) && terraform init -upgrade
	cd $(TERRAFORM_DIR) && terraform apply -auto-approve

## Validar recursos en Localstack
validate:
	@echo "Validando recursos creados en Localstack..."
	awslocal --endpoint-url=http://$(DOMAIN) s3 ls
	awslocal --endpoint-url=http://$(DOMAIN) dynamodb list-tables
	awslocal --endpoint-url=http://$(DOMAIN) sqs list-queues
	awslocal --endpoint-url=http://$(DOMAIN) logs describe-log-groups
	@echo "✅ Validación completa"

## Limpiar recursos
clean:
	@echo "Eliminando recursos..."
	cd $(TERRAFORM_DIR) && terraform destroy -auto-approve || true
	helm uninstall localstack -n $(NAMESPACE) || true
	minikube delete -p $(CLUSTER_NAME)
