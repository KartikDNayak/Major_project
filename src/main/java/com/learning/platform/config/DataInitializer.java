package com.learning.platform.config;

import com.learning.platform.model.*;
import com.learning.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // Create admin user
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@learn.com");
            admin.setPassword("admin123");
            admin.setFullName("Administrator");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }

        // Create demo user
        if (!userRepository.existsByUsername("demo")) {
            User demo = new User();
            demo.setUsername("demo");
            demo.setEmail("demo@learn.com");
            demo.setPassword("demo123");
            demo.setFullName("Demo User");
            demo.setRole(User.Role.USER);
            userRepository.save(demo);
        }

        if (courseRepository.count() > 0) return;

        // Course 1: Java Programming
        Course javaCourse = createCourse(
            "Complete Java Programming Masterclass",
            "Master Java from basics to advanced. Covers OOP, collections, streams, multithreading, and Spring Framework fundamentals. Perfect for beginners and intermediate developers.",
            "24 hours",
            "Programming",
            "Sarah Johnson",
            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
            4.8,
            true
        );

        addLesson(javaCourse, "Introduction to Java", "History, JVM, and setting up environment", "15 min", "https://www.w3schools.com/html/mov_bbb.mp4", 1);
        addLesson(javaCourse, "Variables and Data Types", "Primitive types, strings, and type casting", "25 min", "https://www.w3schools.com/html/mov_bbb.mp4", 2);
        addLesson(javaCourse, "Control Flow Statements", "If-else, switch, loops in Java", "30 min", "https://www.w3schools.com/html/mov_bbb.mp4", 3);
        addLesson(javaCourse, "Object-Oriented Programming", "Classes, objects, inheritance, polymorphism", "45 min", "https://www.w3schools.com/html/mov_bbb.mp4", 4);
        addLesson(javaCourse, "Collections Framework", "Lists, Sets, Maps and their implementations", "40 min", "https://www.w3schools.com/html/mov_bbb.mp4", 5);
        addLesson(javaCourse, "Exception Handling", "Try-catch, throws, custom exceptions", "35 min", "https://www.w3schools.com/html/mov_bbb.mp4", 6);

        // Course 2: Web Development
        Course webCourse = createCourse(
            "Full Stack Web Development Bootcamp",
            "Build modern web applications with HTML5, CSS3, JavaScript, and backend integration. Learn responsive design, DOM manipulation, and API consumption.",
            "32 hours",
            "Web Development",
            "Michael Chen",
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
            4.9,
            true
        );

        addLesson(webCourse, "HTML5 Fundamentals", "Semantic markup, forms, and media elements", "20 min", "https://www.w3schools.com/html/mov_bbb.mp4", 1);
        addLesson(webCourse, "CSS3 Styling", "Selectors, box model, flexbox, and grid", "35 min", "https://www.w3schools.com/html/mov_bbb.mp4", 2);
        addLesson(webCourse, "JavaScript Essentials", "Variables, functions, DOM manipulation", "40 min", "https://www.w3schools.com/html/mov_bbb.mp4", 3);
        addLesson(webCourse, "Responsive Design", "Media queries, mobile-first approach", "30 min", "https://www.w3schools.com/html/mov_bbb.mp4", 4);
        addLesson(webCourse, "Async JavaScript", "Promises, async/await, fetch API", "35 min", "https://www.w3schools.com/html/mov_bbb.mp4", 5);
        addLesson(webCourse, "REST API Integration", "Consuming APIs, error handling", "25 min", "https://www.w3schools.com/html/mov_bbb.mp4", 6);
        addLesson(webCourse, "Deployment Basics", "Hosting, CI/CD introduction", "20 min", "https://www.w3schools.com/html/mov_bbb.mp4", 7);

        // Course 3: Data Science
        Course dsCourse = createCourse(
            "Data Science Fundamentals",
            "Introduction to data analysis, visualization, and machine learning basics using Python. Learn pandas, matplotlib, and scikit-learn.",
            "28 hours",
            "Data Science",
            "Dr. Emily Rodriguez",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
            4.7,
            true
        );

        addLesson(dsCourse, "Python for Data Science", "NumPy, Pandas basics", "30 min", "https://www.w3schools.com/html/mov_bbb.mp4", 1);
        addLesson(dsCourse, "Data Cleaning", "Handling missing values, outliers", "25 min", "https://www.w3schools.com/html/mov_bbb.mp4", 2);
        addLesson(dsCourse, "Data Visualization", "Matplotlib, Seaborn fundamentals", "35 min", "https://www.w3schools.com/html/mov_bbb.mp4", 3);
        addLesson(dsCourse, "Statistical Analysis", "Descriptive stats, hypothesis testing", "40 min", "https://www.w3schools.com/html/mov_bbb.mp4", 4);
        addLesson(dsCourse, "Machine Learning Intro", "Supervised vs unsupervised learning", "45 min", "https://www.w3schools.com/html/mov_bbb.mp4", 5);

        // Course 4: UI/UX Design
        Course uxCourse = createCourse(
            "UI/UX Design Principles",
            "Learn user-centered design, wireframing, prototyping, and design systems. Create intuitive interfaces with Figma and design thinking.",
            "18 hours",
            "Design",
            "Alex Turner",
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
            4.6,
            false
        );

        addLesson(uxCourse, "Design Thinking Process", "Empathize, define, ideate, prototype, test", "20 min", "https://www.w3schools.com/html/mov_bbb.mp4", 1);
        addLesson(uxCourse, "User Research Methods", "Interviews, surveys, personas", "25 min", "https://www.w3schools.com/html/mov_bbb.mp4", 2);
        addLesson(uxCourse, "Wireframing", "Low and high fidelity wireframes", "30 min", "https://www.w3schools.com/html/mov_bbb.mp4", 3);
        addLesson(uxCourse, "Prototyping in Figma", "Interactive prototypes and components", "35 min", "https://www.w3schools.com/html/mov_bbb.mp4", 4);
        addLesson(uxCourse, "Design Systems", "Colors, typography, spacing", "25 min", "https://www.w3schools.com/html/mov_bbb.mp4", 5);

        // Course 5: Mobile Development
        Course mobileCourse = createCourse(
            "Mobile App Development with React Native",
            "Build cross-platform mobile apps for iOS and Android using React Native. Learn navigation, state management, and native modules.",
            "22 hours",
            "Mobile Development",
            "James Wilson",
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
            4.5,
            false
        );

        addLesson(mobileCourse, "React Native Setup", "Environment, Expo CLI", "15 min", "https://www.w3schools.com/html/mov_bbb.mp4", 1);
        addLesson(mobileCourse, "Components & Props", "Core components, styling", "30 min", "https://www.w3schools.com/html/mov_bbb.mp4", 2);
        addLesson(mobileCourse, "Navigation", "Stack, tab, drawer navigation", "35 min", "https://www.w3schools.com/html/mov_bbb.mp4", 3);
        addLesson(mobileCourse, "State Management", "Hooks, Context API", "40 min", "https://www.w3schools.com/html/mov_bbb.mp4", 4);
        addLesson(mobileCourse, "Native Modules", "Platform-specific code", "25 min", "https://www.w3schools.com/html/mov_bbb.mp4", 5);

        // Course 6: Cloud Computing
        Course cloudCourse = createCourse(
            "Cloud Computing with AWS",
            "Understand cloud fundamentals, AWS core services, serverless architecture, and deployment strategies for scalable applications.",
            "20 hours",
            "Cloud Computing",
            "Priya Sharma",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
            4.7,
            true
        );

        addLesson(cloudCourse, "Cloud Fundamentals", "IaaS, PaaS, SaaS explained", "20 min", "https://www.w3schools.com/html/mov_bbb.mp4", 1);
        addLesson(cloudCourse, "AWS EC2 & S3", "Compute and storage services", "35 min", "https://www.w3schools.com/html/mov_bbb.mp4", 2);
        addLesson(cloudCourse, "Serverless with Lambda", "Functions, triggers, API Gateway", "30 min", "https://www.w3schools.com/html/mov_bbb.mp4", 3);
        addLesson(cloudCourse, "Databases on AWS", "RDS, DynamoDB overview", "25 min", "https://www.w3schools.com/html/mov_bbb.mp4", 4);
        addLesson(cloudCourse, "Security Best Practices", "IAM, security groups", "30 min", "https://www.w3schools.com/html/mov_bbb.mp4", 5);

        System.out.println("✅ Sample data initialized successfully!");
        System.out.println("🔑 Default accounts: admin/admin123 | demo/demo123");
    }

    private Course createCourse(String title, String desc, String duration, String category, 
                                String instructor, String imageUrl, Double rating, Boolean featured) {
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(desc);
        course.setDuration(duration);
        course.setCategory(category);
        course.setInstructor(instructor);
        course.setImageUrl(imageUrl);
        course.setRating(rating);
        course.setFeatured(featured);
        course.setTotalStudents(0);
        return courseRepository.save(course);
    }

    private void addLesson(Course course, String title, String desc, String duration, 
                           String videoUrl, Integer order) {
        Lesson lesson = new Lesson();
        lesson.setTitle(title);
        lesson.setDescription(desc);
        lesson.setDuration(duration);
        lesson.setVideoUrl(videoUrl);
        lesson.setOrderIndex(order);
        lesson.setCourse(course);
        lessonRepository.save(lesson);
    }
}
