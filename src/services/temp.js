const resume = `
Name: Rohan Sharma
Role: Backend Developer (MERN Stack)
Phone: +91 99887 76655
Email: rohan.dev@example.com
Location: Bangalore / Pune

Summary:
Performance-driven Backend Developer specializing in Node.js and Distributed Systems. 
Currently a 5th-semester CSE student with an 8.8 CGPA. Expert in architecting 
scalable REST APIs, managing high-traffic database operations, and implementing 
real-time synchronization.

Technical Skills:
- Backend: Node.js (Event-Driven Architecture), Express.js, JWT, OAuth 2.0, Socket.io
- Databases: MongoDB (Aggregation Framework, Transaction Management), Redis (Pub/Sub), PostgreSQL
- Languages: JavaScript (ES6+), TypeScript, C++ (Advanced DSA)
- Tools & Cloud: Docker, Kubernetes (Basics), Git/GitHub, GCP (VMs, Cloud Storage)

Projects:
1. Enterprise E-Commerce Engine (Flipkart Inspired):
   - Built a scalable backend that handles 50,000+ SKU records with complex relations.
   - Reduced database response time by 45% using MongoDB Compound Indexing and Query Profiling.
   - Implemented an automated inventory lock system to prevent race conditions during sales.

2. Real-Time Analytics Dashboard:
   - Developed a system to process 1,000+ events per second using Node.js and Redis.
   - Integrated Socket.io for live data streaming and visualized metrics on the frontend.
   - Used Redis as a primary cache to minimize heavy database reads.
`;

const selfDescription = `
I am a specialized MERN Stack Developer with a deep-rooted passion for backend logic and system design. 
I have hands-on experience in building high-load APIs and managing complex database schemas. 
My focus is on writing clean, testable, and optimized code that can scale. 
Currently, I am looking for a Backend role where I can work on Microservices and help 
optimize large-scale distributed systems.
`;

const jobDescription = `
Position: Senior Backend Developer (Node.js)
Location: Bangalore, India
Company: FinTech Giant (High Scale)

Responsibilities:
- Build, optimize, and maintain high-scale Microservices using Node.js.
- Implement complex business logic with a focus on data integrity and security.
- Optimize high-frequency database queries and manage distributed caching with Redis.
- Mentor junior developers and participate in code reviews and system design.
- Implement CI/CD pipelines and manage containerized deployments using Docker.

Required Skills:
- Advanced knowledge of Node.js, Event Loop, and Asynchronous patterns.
- Strong expertise in MongoDB (Aggregation, Sharding) and SQL databases.
- Experience with Distributed Systems, Redis, and message queues (Kafka/RabbitMQ).
- Proficiency in TypeScript and Unit Testing (Jest/Mocha).
- Understanding of Docker, Kubernetes, and Cloud Architecture (AWS/GCP).
`;

module.exports = {
    resume,
    selfDescription,
    jobDescription
};