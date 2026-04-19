# 📚 Readify - Library Management System

A full-stack **MERN (MongoDB, Express, React, Node.js)** based Library Management System with a complete **DevOps CI/CD pipeline** using Jenkins, Docker, and Kubernetes.

---

## 🚀 Features

* 📖 Book Management (Add, View, Delete)
* 👤 User Authentication (Login/Register)
* 🛒 Order Management
* 🛠️ Admin Panel
* 🌐 REST API Backend
* 🎨 React Frontend UI
* ☁️ Cloud Database (MongoDB Atlas)
* 🔄 CI/CD Pipeline (Jenkins)
* 🐳 Dockerized Application
* ☸️ Kubernetes Deployment (Minikube)

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React.js
* Vite
* Axios
* Tailwind CSS

### 🔹 Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### 🔹 DevOps

* Jenkins (CI/CD)
* Docker (Containerization)
* Kubernetes (Minikube)
* GitHub (Version Control)

---

## 📂 Project Structure

```
Readify-library/
│
├── backend/       # Node.js + Express API
├── frontend/      # React Application
├── deployment.yaml # Kubernetes Deployment File
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone Repository

```bash
git clone https://github.com/BhagathK7/Readify-library.git
cd Readify-library
```

---

### 🔹 2. Backend Setup

```bash
cd backend
npm install
npm start
```

---

### 🔹 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create a `.env` file inside `backend/`:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/library
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

---

## 🐳 Docker Setup

### 🔹 Build Images

```bash
docker build -t readify-backend ./backend
docker build -t readify-frontend ./frontend
```

---

### 🔹 Run Containers

```bash
docker run -d -p 5000:5000 readify-backend
docker run -d -p 3000:3000 readify-frontend
```

---

## 🔄 Jenkins CI/CD Pipeline

Pipeline stages:

1. Clone repository from GitHub
2. Build Docker images
3. Run backend & frontend containers
4. Connect to MongoDB Atlas

---

## ☸️ Kubernetes Deployment

### 🔹 Start Minikube

```bash
minikube start --driver=docker
```

---

### 🔹 Deploy Application

```bash
kubectl apply -f deployment.yaml
```

---

### 🔹 Expose Service

```bash
kubectl expose deployment readify-backend --type=NodePort --port=5000
```

---

### 🔹 Access Application

```bash
minikube service readify-backend --url
```

---

## 🧱 Architecture

```
Developer → GitHub → Jenkins → Docker → Kubernetes → MongoDB Atlas → Browser
```

---

## 📊 Screenshots

*Add your UI screenshots here*

---

## 🚀 Deployment Flow

1. Code pushed to GitHub
2. Jenkins triggers pipeline
3. Docker builds images
4. Containers deployed
5. Kubernetes manages scaling
6. App connects to MongoDB Atlas

---

## 🧠 Key Learnings

* CI/CD pipeline implementation
* Docker containerization
* Kubernetes orchestration
* Cloud database integration
* Real-world debugging and deployment

---

## 🎓 Conclusion

This project demonstrates a complete **end-to-end DevOps workflow** integrated with a MERN stack application, showcasing modern software deployment practices.

---

## 👨‍💻 Author

**Bhagath K**
GitHub: https://github.com/BhagathK7

---

## 📜 License

This project is for educational purposes.
