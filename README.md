# 🔐 Encrypted File Sharing System (AES + RSA) | MERN Stack

A secure file sharing platform built with the **MERN stack** that enables users to **share files privately** with end-to-end encryption. It uses **AES** for file encryption and **RSA** for secure key exchange, ensuring that only the intended recipient can decrypt and access shared files.

---

## 🚀 Features

- 🔐 End-to-End File Encryption
- 🧠 AES (symmetric) for encrypting file contents
- 🔑 RSA (asymmetric) for securely exchanging AES keys
- 👥 Friend System to share files privately
- 🧾 JWT-based Authentication
- 📂 File Upload & Download with Encryption
- 🔒 Decryption only possible by recipient

---

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Encryption**: AES (crypto), RSA (node-forge / crypto module)
- **Auth**: JWT (JSON Web Tokens)

---

## 🧠 How It Works

1. **Login/Register** with your account.
2. **Add Friends** using unique usernames or IDs.
3. When sending a file:
   - The file is **encrypted using AES** with a randomly generated key.
   - The AES key is **encrypted using the recipient’s RSA public key**.
   - Encrypted file and AES key are stored on the server.
4. The recipient downloads the file:
   - Their **RSA private key decrypts the AES key**.
   - The **AES key decrypts the file**, restoring the original content.

---

## 📦 Installation

### 🧰 Clone the Repo

```bash
git clone https://github.com/your-username/encrypted-file-sharing.git
cd encrypted-file-sharing---


```bash
git clone https://github.com/your-username/encrypted-file-sharing.git
cd encrypted-file-sharing---
