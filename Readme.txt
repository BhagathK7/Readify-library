Got it — you want a **clean text explanation of everything you’ve done**, from start to now, in a proper format (for report / viva). Here it is 👇

---

# 📘 READIFY LIBRARY MANAGEMENT SYSTEM

## 🚀 FULL MERN + DEVOPS PROJECT (STEP-BY-STEP)

---

# 🔹 1. PROJECT SETUP

* Developed a **Library Management System** using MERN stack:

  * **MongoDB** (Database)
  * **Express.js** (Backend framework)
  * **React.js** (Frontend)
  * **Node.js** (Runtime)

* Organized project into:

```text
backend/
frontend/
```

---

# 🔹 2. VERSION CONTROL (GITHUB)

* Initialized Git repository
* Pushed project to GitHub:

```text
GitHub Repository:
https://github.com/BhagathK7/Readify-library.git
```

👉 This acts as the **central codebase**

---

# 🔹 3. DATABASE SETUP (MONGODB ATLAS)

* Created cloud database using MongoDB Atlas
* Migrated local data (from Compass) using:

```bash
mongodump → mongorestore
```

* Updated backend connection:

```env
MONGO_URI = mongodb+srv://<username>:<password>@cluster.mongodb.net/library
```

* Enabled access:

```text
0.0.0.0/0 (allow all IPs)
```

---

# 🔹 4. BACKEND DEVELOPMENT

* Built REST APIs using Express.js:

```text
/api/auth
/api/books
/api/orders
/api/admin
```

* Added middleware:

  * CORS
  * Error handling
  * Authentication

* Verified backend using:

```text
http://localhost:5000
```

---

# 🔹 5. DOCKERIZATION

## Backend Dockerfile:

* Created Dockerfile inside `backend/`
* Built image:

```bash
docker build -t bhagathkr/readify-backend ./backend
```

* Ran container:

```bash
docker run -d -p 5000:5000 readify-backend
```

---

## Frontend Dockerfile:

* Created Dockerfile inside `frontend/`
* Built React app using:

```bash
npm run build
```

* Served using `serve`

---

# 🔹 6. CI/CD PIPELINE (JENKINS)

* Installed Jenkins in Ubuntu VM
* Created pipeline job

## Pipeline stages:

1. Clone code from GitHub
2. Build backend Docker image
3. Build frontend Docker image
4. Run containers

## Environment variables:

```text
MONGO_URI passed securely via Jenkins
```

👉 Result:

```text
GitHub → Jenkins → Docker → Running Containers
```

---

# 🔹 7. FULL MERN EXECUTION

* Backend running on:

```text
http://localhost:5000
```

* Frontend running on:

```text
http://localhost:3000
```

* Data fetched from MongoDB Atlas

---

# 🔹 8. INFRASTRUCTURE CHALLENGE (REAL-WORLD)

* Faced disk space issue (20GB limit)
* Resolved by:

  * Expanding VM disk to 40GB
  * Resizing partition using:

```bash
growpart + resize2fs
```

👉 Demonstrates real DevOps troubleshooting

---

# 🔹 9. KUBERNETES SETUP (MINIKUBE)

* Installed latest Minikube
* Started cluster using Docker driver:

```bash
minikube start --driver=docker
```

* Installed kubectl for cluster control

---

# 🔹 10. FINAL DEPLOYMENT (KUBERNETES)

* Cloned project into Ubuntu
* Created deployment file (`deployment.yaml`)

## Deployment features:

* 2 replicas (scaling)
* Backend container image
* MongoDB Atlas connection via env variable

## Applied deployment:

```bash
kubectl apply -f deployment.yaml
```

---

## Exposed service:

```bash
kubectl expose deployment readify-backend --type=NodePort --port=5000
```

---

## Accessed application:

```text
http://<minikube-ip>:<nodeport>
```

---

# 🎯 FINAL ARCHITECTURE

```text
Developer (VS Code - Windows)
        ↓
GitHub (Code Repository)
        ↓
Jenkins (CI/CD Pipeline)
        ↓
Docker (Containerization)
        ↓
Kubernetes (Minikube Cluster)
        ↓
Backend Pods (Node.js)
        ↓
MongoDB Atlas (Cloud Database)
        ↓
Frontend (React UI)
        ↓
User Browser
```

---

# 🏁 FINAL RESULT

✅ Full MERN application deployed
✅ CI/CD pipeline implemented
✅ Docker containerization completed
✅ Kubernetes orchestration achieved
✅ Cloud database integration done

---

# 🧠 KEY LEARNING OUTCOMES

* CI/CD using Jenkins
* Containerization with Docker
* Orchestration using Kubernetes
* Cloud database integration
* Real-world debugging (disk, network, env issues)

---

