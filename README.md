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

```bash
# Clone the repo
git clone https://github.com/your-username/encrypted-file-sharing.git
cd encrypted-file-sharing

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
⚙️ Running the App
Backend
bash
Copy
Edit
cd server
npm start
Frontend
bash
Copy
Edit
cd client
npm start
📁 Project Structure
pgsql
Copy
Edit
encrypted-file-sharing/
├── client/           # React frontend
├── server/           # Node.js + Express backend
│   ├── routes/       # API routes
│   ├── controllers/  # Logic for encryption and file handling
│   ├── models/       # MongoDB models
│   └── utils/        # AES and RSA helper functions
└── README.md
🔒 Security Notes
RSA keys are generated per user and stored securely.

AES keys are random per file and never stored in plain text.

Decryption is done only on the client side, enhancing privacy.

Files are transmitted securely via HTTPS (recommended in production).

📃 License
This project is licensed under the MIT License.

✨ Contributions
Feel free to open issues or pull requests to improve this system.

📧 Contact
For suggestions or questions, feel free to reach out:
Aom Kapadia Kapadiaaom78@example.com

yaml
Copy
Edit

---

Let me know if you want:
- Docker setup section
- Live demo badge/link
- Tech diagram (can generate)
- Deployment (Heroku, Vercel, AWS) instructions

Just drop your project repo name and author name if you'd like me to personalize it further.
