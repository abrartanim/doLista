# 📋 DoLista: Your Efficient Task Organizer

DoLista is a modern and responsive task management web app built with **Next.js** and powered by **Firebase Firestore** for real-time data sync. It supports **Google Authentication**, offers persistent task tracking, and a clean, mobile-friendly UI.

---

## ✨ Features

- 🔐 **User Authentication**
  Sign in securely with Google, or start anonymously for quick access.

- 📝 **Real-Time Task Management**

  - **Create** tasks with a title and description
  - **View** all tasks instantly
  - **Edit** any task
  - **Toggle Status** between active and completed
  - **Delete** tasks permanently

- 🗓️ **Persistent Data**
  All tasks are saved and synced in real-time via Firebase Firestore.

- 🔍 **Task Filtering**
  Filter tasks by **All**, **Active**, or **Completed**.

- 💻 **Responsive UI**
  Built with **Tailwind CSS**, fully responsive across devices.

---

## 🚀 Technologies Used

| Area         | Tech                                        |
| ------------ | ------------------------------------------- |
| Framework    | Next.js (App Router, TypeScript)            |
| Frontend     | React.js                                    |
| Styling      | Tailwind CSS                                |
| Backend & DB | Firebase                                    |
| Auth         | Firebase Authentication (Google, Anonymous) |
| Realtime DB  | Firebase Firestore                          |
| Utilities    | `date-fns`, `uuid`, `react-icons`           |

---

## ⚙️ Getting Started

Follow these steps to set up DoLista locally.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd dolista-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Firebase Setup

#### a. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and follow the setup.
3. Note your **Project ID**.

#### b. Enable Firestore Database

- Navigate to **Build → Firestore Database**
- Click **"Create Database"**
- Select **"Start in production mode"**, choose a region

#### c. Enable Google Authentication

- Go to **Build → Authentication → Sign-in method**
- Enable the **Google** provider and set a support email

#### d. Configure Firestore Security Rules

Go to **Firestore → Rules** and replace existing rules with:

```ts
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/tasks/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Click **Publish**.

### 4. Environment Variables

#### a. Get Firebase Config

- Go to **Project Settings → Your Apps → Web App (\</>)**
- Copy the `firebaseConfig` object

#### b. Create `.env.local` in the project root:

```env
# .env.local

NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_PROJECT_ID.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_PROJECT_ID.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" # Optional
```

> 🔒 Be sure to add `.env.local` to `.gitignore`

```gitignore
.env.local
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
.
├── app/
│   ├── layout.tsx        # Main layout with AuthProvider
│   └── page.tsx          # Renders main task list and filters
├── components/
│   ├── Header.tsx
│   ├── MenuItem.tsx
│   ├── GoogleSignInButton.tsx
│   ├── AddTaskForm.tsx
│   ├── FilterButtons.tsx
│   ├── TaskCard.tsx
│   └── TaskListAndFilters.tsx
├── context/
│   └── AuthContext.tsx   # Global Firebase auth state
├── lib/
│   └── firebase.ts       # Firebase initialization
├── types/
│   └── index.ts          # TypeScript interfaces
└── .env.local            # Firebase env variables (DO NOT COMMIT)
```

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js Interactive Tutorial](https://nextjs.org/learn)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

---

## 🚀 Deploy on Vercel

The easiest way to deploy a Next.js app is with [Vercel](https://vercel.com), from the creators of Next.js.

Check the [Next.js deployment docs](https://nextjs.org/docs/pages/building-your-application/deploying) for step-by-step deployment.

---

> Made with ❤️ using Next.js & Firebase
