

# READIFY

### Cloud-Native Library Management Platform

<p align="center">
Modern MERN Stack application integrated with a complete DevOps workflow using Kubernetes, Terraform, CI/CD automation, and Monitoring infrastructure.
</p>

---


# Overview

Readify is a full-stack Library Management System developed to demonstrate a production-style DevOps workflow integrated with a MERN stack application.

The platform showcases modern deployment and infrastructure practices including containerization, orchestration, infrastructure automation, CI/CD pipelines, and Monitoring.

---

# Core Features include :-

## Application Layer

- User Authentication System
- Book Catalog Management
- Shopping Cart & Orders
- Admin Dashboard
- REST API Architecture
- MongoDB Atlas Integration

---

## DevOps & Infrastructure

- Jenkins CI/CD Pipeline
- Docker Containerization
- Kubernetes Deployment
- Terraform Infrastructure Provisioning
- Prometheus Monitoring
- Grafana Visualization
- Minikube Local Cluster

---

# Technology Stack

| Layer | Technologies |
|------|-------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Containerization | Docker |
| CI/CD | Jenkins |
| Orchestration | Kubernetes, Minikube |
| Infrastructure as Code | Terraform |
| Monitoring | Prometheus, Grafana |
| Version Control | Git & GitHub |

---

# Architecture

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
Jenkins CI/CD Pipeline
    │
    ▼
Docker Image Build
    │
    ▼
Kubernetes Cluster (Minikube)
    │
    ├── Frontend Service
    ├── Backend Service
    │
    ▼
MongoDB Atlas
    │
    ▼
Prometheus + Grafana Monitoring
```

---

# Project Structure

```text
Readify-library/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── deployment.yaml
├── frontend-deployment.yaml
├── terraform-readify/
└── README.md
```

---

# Local Development Setup

## Clone Repository

```bash
git clone https://github.com/BhagathK7/Readify-library.git
cd Readify-library
```

---

## Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file inside `backend/`

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

---

# Docker Workflow

## Build Images

```bash
docker build -t readify-backend ./backend
docker build -t readify-frontend ./frontend
```

---

## Run Containers

```bash
docker run -d -p 5000:5000 readify-backend
docker run -d -p 3000:3000 readify-frontend
```

---

# Kubernetes Deployment

## Start Minikube

```bash
minikube start
```

---

## Deploy Backend & Frontend

```bash
kubectl apply -f deployment.yaml
kubectl apply -f frontend-deployment.yaml
```

---

## Access Frontend

```bash
minikube service readify-frontend --url
```

---

# Terraform Infrastructure

```bash
cd terraform-readify
terraform init
terraform apply
```

Terraform provisions:

- Kubernetes Namespace
- Frontend Deployment
- Backend Deployment
- Service Configuration

---

# Monitoring Stack

## Prometheus

```bash
kubectl port-forward svc/prometheus-kube-prometheus-prometheus 9090
```

Access:

```text
http://localhost:9090
```

---

## Grafana

```bash
kubectl port-forward svc/prometheus-grafana 3000:80
```

Access:

```text
http://localhost:3000
```

---

# Jenkins CI/CD Pipeline

Pipeline stages include:

1. Clone Repository from GitHub
2. Build Docker Images
3. Run Application Containers
4. Deploy Services
5. Monitor Infrastructure

---

# Deployment Workflow

```text
Code Commit
    │
    ▼
GitHub Push
    │
    ▼
Jenkins Pipeline Trigger
    │
    ▼
Docker Build Process
    │
    ▼
Kubernetes Deployment
    │
    ▼
Application Services
    │
    ▼
Prometheus Metrics Collection
    │
    ▼
Grafana Visualization
```

---

# Key Learnings

- Full CI/CD Pipeline Implementation
- Docker Containerization
- Kubernetes Orchestration
- Infrastructure As Code using Terraform
- Monitoring & Observability
- Cloud Database Integration
- Production-style Deployment Workflow
- Real-world Debugging & DevOps Practices

---

# License

This project is developed for educational and learning purposes.
