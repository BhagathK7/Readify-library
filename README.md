---

````md
# Readify

Production-ready Library Management System built using the MERN stack with a complete DevOps workflow powered by Jenkins, Docker, Kubernetes, Terraform, Prometheus, and Grafana.

---

## Overview

Readify is a full-stack web application designed to simulate a real-world cloud-native deployment pipeline.  
The project demonstrates modern DevOps practices including:

- CI/CD automation
- Containerization
- Kubernetes orchestration
- Infrastructure as Code
- Monitoring & Observability

---

## Core Features

### Application
- User Authentication
- Book Catalog Management
- Cart & Order System
- Admin Dashboard
- REST API Architecture

### DevOps & Cloud
- Jenkins CI/CD Pipeline
- Dockerized Services
- Kubernetes Deployment
- Terraform Infrastructure
- Prometheus Monitoring
- Grafana Dashboards
- MongoDB Atlas Integration

---

## Technology Stack

| Layer | Technology |
|------|-------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Containerization | Docker |
| CI/CD | Jenkins |
| Orchestration | Kubernetes (Minikube) |
| Infrastructure | Terraform |
| Monitoring | Prometheus, Grafana |

---

## System Architecture

```text
Developer
   ↓
GitHub Repository
   ↓
Jenkins Pipeline
   ↓
Docker Image Build
   ↓
Kubernetes Deployment
   ↓
MongoDB Atlas
   ↓
Monitoring (Prometheus + Grafana)
````

---

## Project Structure

```text
Readify-library/
│
├── backend/
├── frontend/
├── deployment.yaml
├── frontend-deployment.yaml
├── terraform-readify/
└── README.md
```

---

## Local Development

### Clone Repository

```bash
git clone https://github.com/BhagathK7/Readify-library.git
cd Readify-library
```

---

### Backend Setup

```bash
cd backend
npm install
npm start
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create `.env` inside `backend/`

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

---

## Docker Workflow

### Build Images

```bash
docker build -t readify-backend ./backend
docker build -t readify-frontend ./frontend
```

### Run Containers

```bash
docker run -d -p 5000:5000 readify-backend
docker run -d -p 3000:3000 readify-frontend
```

---

## Kubernetes Deployment

### Start Minikube

```bash
minikube start
```

### Deploy Application

```bash
kubectl apply -f deployment.yaml
kubectl apply -f frontend-deployment.yaml
```

### Access Frontend

```bash
minikube service readify-frontend --url
```

---

## Terraform Infrastructure

```bash
cd terraform-readify
terraform init
terraform apply
```

Terraform manages:

* Kubernetes Namespace
* Backend Deployment
* Frontend Deployment
* Services

---

## Monitoring Stack

### Prometheus

```bash
kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090
```

### Grafana

```bash
kubectl port-forward svc/prometheus-grafana 3000:80
```

---

## Jenkins Pipeline Stages

1. Clone Repository
2. Build Docker Images
3. Run Containers
4. Deploy Application
5. Monitor Services

---

## Learning Outcomes

* CI/CD Automation
* Kubernetes Orchestration
* Infrastructure as Code
* Monitoring & Observability
* Production-style Deployment Workflow

---

## License

Educational Project

````

---
