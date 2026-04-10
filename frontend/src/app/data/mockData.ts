export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isLocked: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  thumbnail: string;
  category: string;
  rating: number;
  studentsEnrolled: number;
  duration: string;
  modules: Module[];
}

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch. Master HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a professional web developer.',
    price: 4999,
    instructor: 'Sarah Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGluZyUyMGNvbXB1dGVyfGVufDF8fHx8MTc3MzcwMzEzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Web Development',
    rating: 4.8,
    studentsEnrolled: 12450,
    duration: '42 hours',
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Web Development',
        lessons: [
          { id: 'l1', title: 'Welcome to the Course', duration: '5:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false },
          { id: 'l2', title: 'Setting Up Your Development Environment', duration: '12:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'l3', title: 'HTML Basics', duration: '18:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
        ],
      },
      {
        id: 'm2',
        title: 'CSS and Responsive Design',
        lessons: [
          { id: 'l4', title: 'CSS Fundamentals', duration: '22:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'l5', title: 'Flexbox and Grid', duration: '25:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'l6', title: 'Responsive Design Principles', duration: '20:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
        ],
      },
      {
        id: 'm3',
        title: 'JavaScript Mastery',
        lessons: [
          { id: 'l7', title: 'JavaScript Basics', duration: '28:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'l8', title: 'DOM Manipulation', duration: '32:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'l9', title: 'Async JavaScript', duration: '35:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Python for Data Science',
    description: 'Master Python programming for data science and machine learning. Learn pandas, NumPy, matplotlib, and scikit-learn. Work on real data analysis projects.',
    price: 5499,
    instructor: 'Dr. Michael Chen',
    thumbnail: 'https://images.unsplash.com/photo-1660616246653-e2c57d1077b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXRob24lMjBwcm9ncmFtbWluZyUyMGRhdGElMjBzY2llbmNlfGVufDF8fHx8MTc3MzczMDYzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Data Science',
    rating: 4.9,
    studentsEnrolled: 8920,
    duration: '38 hours',
    modules: [
      {
        id: 'm1',
        title: 'Python Fundamentals',
        lessons: [
          { id: 'l1', title: 'Introduction to Python', duration: '8:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false },
          { id: 'l2', title: 'Variables and Data Types', duration: '15:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'l3', title: 'Control Flow', duration: '20:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
        ],
      },
      {
        id: 'm2',
        title: 'Data Analysis with Pandas',
        lessons: [
          { id: 'l4', title: 'Introduction to Pandas', duration: '18:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'l5', title: 'Data Cleaning', duration: '22:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'l6', title: 'Data Visualization', duration: '25:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Digital Marketing Masterclass',
    description: 'Complete guide to digital marketing including SEO, social media marketing, content marketing, email marketing, and analytics. Grow your business online.',
    price: 3999,
    instructor: 'Emily Rodriguez',
    thumbnail: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwYnVzaW5lc3MlMjBsYXB0b3B8ZW58MXx8fHwxNzczNzMwNjM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Marketing',
    rating: 4.7,
    studentsEnrolled: 15680,
    duration: '32 hours',
    modules: [
      {
        id: 'm1',
        title: 'Digital Marketing Fundamentals',
        lessons: [
          { id: 'l1', title: 'Introduction to Digital Marketing', duration: '10:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false },
          { id: 'l2', title: 'Marketing Strategy', duration: '16:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
        ],
      },
      {
        id: 'm2',
        title: 'SEO and Content Marketing',
        lessons: [
          { id: 'l3', title: 'SEO Basics', duration: '22:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
          { id: 'l4', title: 'Keyword Research', duration: '18:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'UI/UX Design Complete Course',
    description: 'Learn user interface and user experience design from basics to advanced. Master Figma, design systems, prototyping, and user research.',
    price: 4499,
    instructor: 'Alex Turner',
    thumbnail: 'https://images.unsplash.com/photo-1622117515670-fcb02499491f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1aSUyMHV4JTIwZGVzaWduJTIwd2lyZWZyYW1lfGVufDF8fHx8MTc3MzcyNDY0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Design',
    rating: 4.8,
    studentsEnrolled: 9340,
    duration: '36 hours',
    modules: [
      {
        id: 'm1',
        title: 'UX Fundamentals',
        lessons: [
          { id: 'l1', title: 'What is UX Design?', duration: '12:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false },
          { id: 'l2', title: 'User Research Methods', duration: '20:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'Mobile App Development with React Native',
    description: 'Build native mobile apps for iOS and Android using React Native. Learn navigation, state management, APIs, and publish your apps to app stores.',
    price: 5999,
    instructor: 'James Wilson',
    thumbnail: 'https://images.unsplash.com/photo-1646737554389-49329965ef01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXZlbG9wbWVudCUyMHNtYXJ0cGhvbmV8ZW58MXx8fHwxNzczNjMxMzEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Mobile Development',
    rating: 4.6,
    studentsEnrolled: 6750,
    duration: '40 hours',
    modules: [
      {
        id: 'm1',
        title: 'React Native Basics',
        lessons: [
          { id: 'l1', title: 'Introduction to React Native', duration: '14:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false },
          { id: 'l2', title: 'Components and Props', duration: '18:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
        ],
      },
    ],
  },
  {
    id: '6',
    title: 'Cloud Computing with AWS',
    description: 'Master Amazon Web Services (AWS) cloud platform. Learn EC2, S3, Lambda, RDS, and more. Prepare for AWS certification.',
    price: 6499,
    instructor: 'David Park',
    thumbnail: 'https://images.unsplash.com/photo-1744868562210-fffb7fa882d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHNlcnZlciUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzczNjUwNjAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Cloud Computing',
    rating: 4.9,
    studentsEnrolled: 5420,
    duration: '45 hours',
    modules: [
      {
        id: 'm1',
        title: 'AWS Fundamentals',
        lessons: [
          { id: 'l1', title: 'Introduction to AWS', duration: '10:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: false },
          { id: 'l2', title: 'AWS Account Setup', duration: '12:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isLocked: true },
        ],
      },
    ],
  },
];

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export const mockPayments: Payment[] = [
  {
    id: 'p1',
    userId: 'u1',
    userName: 'John Doe',
    courseId: '1',
    courseTitle: 'Complete Web Development Bootcamp',
    amount: 4999,
    date: '2026-03-15',
    status: 'completed',
  },
  {
    id: 'p2',
    userId: 'u2',
    userName: 'Jane Smith',
    courseId: '2',
    courseTitle: 'Python for Data Science',
    amount: 5499,
    date: '2026-03-14',
    status: 'completed',
  },
  {
    id: 'p3',
    userId: 'u3',
    userName: 'Bob Johnson',
    courseId: '3',
    courseTitle: 'Digital Marketing Masterclass',
    amount: 3999,
    date: '2026-03-13',
    status: 'completed',
  },
  {
    id: 'p4',
    userId: 'u4',
    userName: 'Alice Williams',
    courseId: '1',
    courseTitle: 'Complete Web Development Bootcamp',
    amount: 4999,
    date: '2026-03-12',
    status: 'completed',
  },
  {
    id: 'p5',
    userId: 'u5',
    userName: 'Charlie Brown',
    courseId: '4',
    courseTitle: 'UI/UX Design Complete Course',
    amount: 4499,
    date: '2026-03-10',
    status: 'completed',
  },
];

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  enrolledCourses: number;
  joinDate: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    enrolledCourses: 3,
    joinDate: '2026-01-15',
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'student',
    enrolledCourses: 2,
    joinDate: '2026-02-01',
  },
  {
    id: 'u3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'student',
    enrolledCourses: 1,
    joinDate: '2026-02-10',
  },
  {
    id: 'u4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'student',
    enrolledCourses: 4,
    joinDate: '2026-01-20',
  },
  {
    id: 'u5',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'student',
    enrolledCourses: 2,
    joinDate: '2026-03-01',
  },
];

export const analyticsData = {
  revenue: [
    { month: 'Jan', amount: 125000 },
    { month: 'Feb', amount: 185000 },
    { month: 'Mar', amount: 95000 },
  ],
  enrollments: [
    { month: 'Jan', students: 450 },
    { month: 'Feb', students: 680 },
    { month: 'Mar', students: 320 },
  ],
  topCourses: [
    { name: 'Web Development', students: 1245 },
    { name: 'Data Science', students: 892 },
    { name: 'Digital Marketing', students: 1568 },
    { name: 'UI/UX Design', students: 934 },
  ],
};