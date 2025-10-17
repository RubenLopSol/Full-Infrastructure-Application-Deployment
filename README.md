# Full Infrastructure & Application Deployment — *La Huella*

### Autor: **Rubén López**

> Un pipeline CI/CD completo que despliega automáticamente toda una infraestructura y una aplicación sobre Kubernetes, usando Terraform, Helm, Localstack y GitHub Actions.

---

## Descripción del proyecto

Este proyecto representa un **entorno DevOps automatizado de extremo a extremo**, diseñado para demostrar el ciclo completo de despliegue continuo (**CI/CD**) en un entorno local.

Con un solo `git push`, el sistema:

1. **Crea un clúster de Kubernetes (Minikube)** si no existe.
2. **Despliega Localstack** (simulador de AWS) mediante Helm.
3. **Crea los recursos de infraestructura** con Terraform (S3, DynamoDB, SQS, CloudWatch).
4. **Ejecuta un Job en Kubernetes** para inicializar el bucket remoto del estado de Terraform.
5. **Puebla las bases de datos** con datos de ejemplo (`init.sh`).
6. **Construye la imagen Docker** de la aplicación.
7. **Despliega la app** y la expone vía Ingress en `http://midominio.local/app`.

 Este flujo demuestra la integración entre **Infraestructura como Código**, **Observabilidad básica**, **CI/CD**, y **Kubernetes**, todo dentro de un entorno local reproducible.

---

## Arquitectura general

```
┌────────────────────────────────────────────┐
│              GitHub Actions                │
│--------------------------------------------│
│ 1. Minikube + Namespace setup              │
│ 2. Helm install (Localstack)               │
│ 3. ConfigMap + Job (Bucket S3 remoto)      │
│ 4. Terraform apply                         │
│ 5. init.sh (DynamoDB seeding)              │
│ 6. Docker build + deploy in K8s            │
└────────────────────────────────────────────┘
           ↓
┌────────────────────────────────────────────┐
│               Kubernetes (Minikube)        │
│--------------------------------------------│
│  - Localstack (simula AWS)                 │
│  - Terraform Infra (S3, DynamoDB, SQS)     │
│  - FastAPI App desplegada (Next.js + API)  │
│  - NGINX Ingress → http://midominio.local  │
└────────────────────────────────────────────┘
```

---

## Tecnologías y herramientas usadas

| Categoría                       | Herramienta                            |
| ------------------------------- | -------------------------------------- |
| **Infraestructura local**       | 🐳 Minikube                            |
| **Simulación de AWS**           | 🧩 Localstack (vía Helm)               |
| **Infraestructura como Código** | 🌍 Terraform                           |
| **Contenedores**                | 🐋 Docker                              |
| **Orquestación**                | ☸️ Kubernetes                          |
| **CI/CD**                       | ⚙️ GitHub Actions (self-hosted runner) |
| **Lenguaje principal**          | 🧠 Python / FastAPI + Next.js          |
| **Scripts de inicialización**   | Bash (`init.sh`)                       |

---

## Workflow principal (`deploy.yaml`)

El pipeline completo ejecuta automáticamente todas las fases de despliegue.
Aquí puedes ver el archivo que orquesta el proceso de principio a fin:

<details>
<summary>Ver workflow completo</summary>

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  # Secrets (almacenados en Settings > Secrets > Actions)
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  AWS_DEFAULT_REGION: ${{ secrets.AWS_DEFAULT_REGION }}

  # Variables no sensibles
  CLUSTER_NAME: lahuella
  NAMESPACE: localstack
  DOMAIN: midominio.local
  TERRAFORM_DIR: infra/terraform
  K8S_DIR: infra/k8s
  INIT_SCRIPT: script/init.sh

jobs:
  full-deploy:
    runs-on: self-hosted
    name: Build Infra + Deploy App
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: ================= INFRASTRUCTURE PHASE =================
        run: echo "🏗️  Starting Infrastructure setup..."
      - name: Ensure Minikube cluster exists
        run: |
          echo "Checking cluster $CLUSTER_NAME..."
          if ! minikube profile list | grep -q "$CLUSTER_NAME"; then
            echo "Creating cluster $CLUSTER_NAME..."
            minikube start -p $CLUSTER_NAME --cpus=4 --memory=6g
          else
            echo "✅ Cluster $CLUSTER_NAME already exists"
          fi
          kubectl config use-context $CLUSTER_NAME
          kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
      - name: Install Localstack via Helm
        run: |
          helm repo add localstack https://helm.localstack.cloud
          helm repo update
          helm upgrade --install localstack localstack/localstack \
            --namespace $NAMESPACE \
            --create-namespace \
            -f $K8S_DIR/localstack-values.yaml
          sleep 15
          kubectl wait --for=condition=Ready pod -l app.kubernetes.io/name=localstack -n $NAMESPACE --timeout=180s || {
            sleep 10
            kubectl wait --for=condition=Ready pod -l app.kubernetes.io/name=localstack -n $NAMESPACE --timeout=120s
          }
      - name: Enable Ingress Controller
        run: |
          if ! minikube addons list -p $CLUSTER_NAME | grep -q "ingress.*enabled"; then
            minikube addons enable ingress -p $CLUSTER_NAME
          fi
          kubectl wait --namespace ingress-nginx --for=condition=Ready pod \
            --selector=app.kubernetes.io/component=controller --timeout=180s
          kubectl apply -f $K8S_DIR/ingress.yaml
          IP=$(minikube ip -p $CLUSTER_NAME)
          if ! grep -q "$DOMAIN" /etc/hosts; then
            echo "$IP $DOMAIN" | sudo tee -a /etc/hosts
          fi
      - name: Create S3 bucket for Terraform remote state
        run: |
          kubectl apply -f $K8S_DIR/configmap.yaml
          kubectl apply -f $K8S_DIR/job_exe_seed.yaml
          kubectl wait --for=condition=complete job/localstack-seed -n $NAMESPACE --timeout=300s
      - name: Apply Terraform Infrastructure
        working-directory: ${{ env.TERRAFORM_DIR }}
        run: |
          tfenv use 1.5.5 || true
          terraform init -upgrade
          terraform apply -auto-approve
      - name: Build Docker image
        run: docker build -t lahuella-app:latest .
      - name: Load image into Minikube
        run: minikube -p $CLUSTER_NAME image load lahuella-app:latest
      - name: Deploy Application
        run: |
          kubectl apply -f $K8S_DIR/deployment-app.yaml
          kubectl apply -f $K8S_DIR/service-app.yaml
          kubectl apply -f $K8S_DIR/ingress-app.yaml
          kubectl get pods -A
          kubectl get ingress -A
```

</details>

---

## Resultado

Al ejecutar el pipeline:

* Terraform aplica toda la infraestructura en Localstack.
* Los datos se inicializan correctamente.
* La app se despliega en Kubernetes.
* Todo el flujo termina con:

```
🎯 Application available at: http://midominio.local/app
✅ Infrastructure & application deployed successfully!
```

---

## Qué demuestra este proyecto

✔️ Creación automática de clúster y namespace.
✔️ Despliegue de infraestructura simulada con Terraform + Localstack.
✔️ Integración CI/CD completa con GitHub Actions (self-hosted).
✔️ Despliegue de aplicación sobre Kubernetes.
✔️ Ejemplo real de *Infrastructure as Code* + *Continuous Deployment*.

---


## Conclusión

Este proyecto fue diseñado como ejercicio técnico, pero se ha convertido en una **demostración práctica de un pipeline DevOps real**, integrando:

* Terraform (IaC)
* Helm y Kubernetes (infraestructura dinámica)
* Localstack (entorno AWS simulado)
* GitHub Actions (CI/CD)

