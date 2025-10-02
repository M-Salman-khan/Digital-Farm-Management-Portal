
<div align="center">

# Digital Farm Management Portal

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  </a>
  <a href="https://supabase.io/">
    <img src="https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  </a>
</p>

A complete, production-ready Digital Farm Management Portal that transforms biosecurity from a compliance burden into a competitive advantage through innovative features like gamification, emergency response, financial management, and scientific feed optimization - all while being accessible to farmers in their own language on basic smartphones.

</div>

This project is built for the **Smart India Hackathon 2025 (Problem Statement SIH25006)**.

## ✨ Key Features

### Stand-Out Features
*   **❤️ Digital Health Records:** Complete livestock health tracking with batch management, vaccination schedules, and treatment history.
*   **💰 Finance Tracker:** Income/expense management with category-wise breakdown and profitability analysis.
*   **🧮 Smart Feed Calculator:** Scientific feed recommendations based on animal type, age, weight, and growth stage.
*   **🏆 Gamification System:** Points, levels, badges, and achievements to encourage engagement and best practices.
*   **🚨 Emergency SOS:** One-click emergency access to veterinarians and authorities with instant calling/SMS.
*   **🌙 Dark Mode:** System-wide dark theme for better accessibility and reduced eye strain.

### Core Features
*   **📊 Personalized Dashboard:** Quick stats, recent activities, and alerts at a glance.
*   **⚡ Risk Assessment:** Comprehensive biosecurity evaluation with automatic scoring and recommendations.
*   **🎓 Training Modules:** Interactive learning content on biosecurity practices with quizzes.
*   **📄 Compliance Records:** Digital documentation of vaccinations, inspections, and sanitation activities.
*   **🔔 Disease Alerts:** Real-time notifications about outbreaks in the region.
*   **👥 Community Forum:** Knowledge sharing platform for farmers, vets, and experts.
*   **📈 Admin Analytics:** System-wide statistics for policy makers and authorities.

## 💻 Tech Stack

*   **Frontend:** React.js, TypeScript, Vite, Tailwind CSS, Shadcn/UI, Lucide Icons
*   **Backend:** Supabase (PostgreSQL, Edge Functions with Hono, Auth, Real-time Subscriptions, Storage)
*   **Package Manager:** pnpm

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18+)
*   pnpm (or npm/yarn)
*   A Supabase Account ([Create one here](https://supabase.com))
*   Git

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/M-Salman-khan/Digital-Farm-Management-Portal.git
    cd Digital-Farm-Management-Portal
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up your Supabase backend:**
    *   Create a new project on [Supabase](https://supabase.com).
    *   Go to your project's **Settings > API**.
    *   Find your **Project URL**, **`anon` public key**, and **`service_role` secret key**.

4.  **Create an environment file:**
    *   Create a file named `.env` in the root of the project.
    *   Add your Supabase credentials to it like this:

    ```env
    VITE_SUPABASE_URL=YOUR_PROJECT_URL
    VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
    ```

5.  **Run the development server:**
    ```bash
    pnpm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## 👥 User Roles

The platform supports three distinct user roles:

1.  **🌾 Farmer (Primary User):** Access to all farm management tools, including health records, finance tracking, risk assessment, and more.
2.  **👨‍⚕️ Veterinarian:** Can create disease alerts, participate in the community, and access training modules to share expertise.
3.  **👔 Authority/Official:** Has access to a system-wide analytics dashboard to monitor compliance, track disease trends, and make data-driven policy decisions.

## 🤝 Contributing

Contributions are welcome! If you have a suggestion or want to fix a bug, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourAmazingFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
5.  Push to the branch (`git push origin feature/YourAmazingFeature`).
6.  Open a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for Indian farmers.*
