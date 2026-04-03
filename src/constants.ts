/**
 * PORTFOLIO CONSTANTS
 * Update these values to personalize your portfolio.
 */

export const USER_DATA = {
  name: "Ekalale Lokaale",
  role: "Junior Software Engineer (Full-stack)",
  email: "ayman11muhammad@gmail.com",
  location: "Kenya",
  bio: "Computer Science student and backend-focused Junior Software Engineer with hands-on experience designing, developing, and deploying full-stack web applications.",
  detailedBio: [
    "I'm a Computer Science student and backend-focused Junior Software Engineer with a strong foundation in backend logic, database design, and authentication systems. I have a demonstrated ability to independently take projects from concept to production, with a focus on security, maintainability, and scalability.",
    "I'm comfortable debugging, refactoring, and improving existing codebases while using modern development tools and AI-assisted workflows responsibly. My goal is to build robust systems that solve complex problems efficiently."
  ],
  
  // PHOTO URLS - Replace these with your own images
  photos: {
    hero: "https://picsum.photos/seed/simon-hero/1200/800", // Main hero background or element
    portrait: "https://picsum.photos/seed/simon-portrait/1000/1250", // The "Living Portrait" section
    about: "https://picsum.photos/seed/simon-about/800/800", // About page profile photo
  },

  socials: {
    github: "https://github.com/Ayman-muhammad",
    linkedin: "https://www.linkedin.com/in/ayman-ayman-muhammad-6905a937a",
    twitter: "https://twitter.com",
  },

  skills: [
    { name: "Python", category: "Backend", proficiency: 90, iconName: "Code2", color: "text-blue-400" },
    { name: "JavaScript", category: "Frontend", proficiency: 85, iconName: "Terminal", color: "text-yellow-400" },
    { name: "PHP", category: "Backend", proficiency: 85, iconName: "Database", color: "text-indigo-400" },
    { name: "Django", category: "Backend", proficiency: 80, iconName: "Cpu", color: "text-emerald-500" },
    { name: "Node.js", category: "Backend", proficiency: 80, iconName: "Zap", color: "text-green-500" },
    { name: "React.js", category: "Frontend", proficiency: 85, iconName: "Globe", color: "text-sky-400" },
    { name: "MySQL", category: "Database", proficiency: 90, iconName: "Database", color: "text-blue-500" },
    { name: "PostgreSQL", category: "Database", proficiency: 80, iconName: "Database", color: "text-indigo-500" },
    { name: "Docker", category: "DevOps", proficiency: 70, iconName: "Layers", color: "text-blue-400" },
    { name: "AWS", category: "Cloud", proficiency: 65, iconName: "Cloud", color: "text-orange-400" },
  ],

  experience: [
    {
      company: "Independent Software Development",
      role: "Junior Software Engineer",
      period: "2025 - Present",
      desc: "Independently designing, building, and deploying multiple academic and personal software projects. Practicing full development lifecycle including requirement analysis, implementation, debugging, and deployment."
    },
    {
      company: "Mount Kenya University",
      role: "Computer Science Student",
      period: "2023 - 2027",
      desc: "Focusing on Data Structures, Algorithms, Database Systems, and Software Engineering. Expected graduation in 2027."
    }
  ],
  
  // FALLBACK PROJECTS - Used if Supabase is empty
  fallbackProjects: [
    {
      title: "Monexia",
      slug: "monexia",
      tagline: "Enterprise-Ready Android Financial Analytics Platform",
      description: "A modular Android-based financial tracking and analytics platform architected to provide structured transaction management, financial insights, and scalable data visualization.",
      thumbnail_url: "https://picsum.photos/seed/monexia/1200/800",
      tech_stack: ["Kotlin", "Room", "Coroutines", "MPAndroidChart"],
      views: 1240,
      featured: true,
      content: "## Key Engineering Contributions\n\n* **Architected a structured local persistence layer** using Room (DAO pattern) to ensure reliable, type-safe, and scalable transaction storage.\n* **Designed a dynamic financial aggregation engine** to compute balance, income, expense metrics, and insight-driven analytics in real time.\n* **Engineered interactive financial dashboards** using MPAndroidChart, implementing stacked bar visualizations for monthly income vs. expense analysis.\n* **Developed a currency abstraction layer** enabling dynamic multi-currency formatting without hardcoded symbols.\n* **Implemented an insights module** that evaluates spending behavior and detects financial anomalies."
    },
    {
      title: "Ayglobe Ta’alim Nexa",
      slug: "ayglobe-taalim-nexa",
      tagline: "Full-Stack Educational Platform",
      description: "A web-based educational resource sharing and job announcement platform designed to support Kenyan universities and international institutions.",
      thumbnail_url: "https://picsum.photos/seed/ayglobe/1200/800",
      tech_stack: ["PHP", "MySQL", "JavaScript", "Bootstrap 5"],
      views: 850,
      featured: true,
      live_url: "https://wchhub.infinityfreeapp.com/WCH/?i=1",
      github_url: "https://github.com/Ayman-muhammad/AyglobeTa-allimNexa",
      content: "## Key Contributions & Achievements\n\n* **Designed and developed a full-stack PHP/MySQL application** with role-based user authentication and secure session management.\n* **Implemented document upload and download functionality** with validation, access control, and user interaction features.\n* **Built a dynamic admin dashboard** for content moderation, user management, and platform oversight.\n* **Developed real-time activity statistics** and engagement counters using JavaScript.\n* **Integrated a job board module** to extend platform functionality beyond document sharing."
    },
    {
      title: "Hospital Management System",
      slug: "hospital-management-system",
      tagline: "Full-Stack Healthcare Management Platform",
      description: "A comprehensive hospital operations management system designed to digitize patient records, appointment workflows, doctor management, billing processes, and administrative oversight.",
      thumbnail_url: "https://picsum.photos/seed/hospital/1200/800",
      tech_stack: ["Python", "Django", "PHP", "MySQL"],
      views: 2100,
      featured: true,
      live_url: "https://kishan0725.000webhostapp.com",
      content: "## Key Contributions & Achievements\n\n* **Designed and implemented a multi-role authentication system** (Patient, Doctor, Admin) with role-based access control.\n* **Developed secure user registration** with email validation and password hashing.\n* **Built appointment booking, approval, cancellation, and tracking workflows**.\n* **Created dynamic doctor dashboards** for managing appointments and consultancy fees.\n* **Developed an admin control panel** for managing patients, doctors, appointments, and feedback queries.\n* **Implemented invoice generation and billing management** with dynamic PDF output."
    }
  ]
};
