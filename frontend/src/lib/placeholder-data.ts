import type { Project, Experience, About } from "./types";
import type { PostListItem } from "./types";

export const projects: Project[] = [
    {
        id: "1",
        title: "ML Pipeline Orchestrator",
        summary: "End-to-end ML pipeline orchestration system for training and deploying models at scale.",
        description: "Built a production-grade ML pipeline orchestration system that handles data ingestion, feature engineering, model training, evaluation, and deployment. The system processes millions of records daily and reduces model deployment time from days to hours.",
        problem: "The existing ML workflow was fragmented across multiple tools with manual handoffs, leading to inconsistent results and lengthy deployment cycles.",
        approach: "Designed a DAG-based pipeline architecture using Python, integrated with cloud-native services for compute scaling, and implemented automated model validation gates.",
        outcome: "Reduced model deployment time by 85%, achieved 99.7% pipeline reliability, and enabled the team to ship 3x more models per quarter.",
        techStack: ["Python", "Apache Airflow", "Kubernetes", "PostgreSQL", "Redis", "Docker"],
        githubUrl: "https://github.com",
        demoUrl: "https://demo.example.com",
        featured: true,
    },
    {
        id: "2",
        title: "Real-time Inference API",
        summary: "Low-latency inference serving platform with automatic model versioning and A/B testing.",
        description: "Designed and implemented a real-time inference serving platform capable of handling 10,000+ requests per second with sub-50ms latency.",
        problem: "Model serving was a bottleneck — high latency, no versioning, and zero visibility into prediction quality in production.",
        approach: "Built a FastAPI-based serving layer with model registry integration, implemented request batching for GPU efficiency, and added real-time monitoring with custom metrics.",
        outcome: "Achieved p99 latency of 45ms, enabled zero-downtime model deployments, and provided real-time dashboards that caught a critical model drift within 2 hours of deployment.",
        techStack: ["FastAPI", "PyTorch", "ONNX Runtime", "Prometheus", "Grafana", "gRPC"],
        githubUrl: "https://github.com",
        demoUrl: null,
        featured: true,
    },
    {
        id: "3",
        title: "Document Intelligence System",
        summary: "NLP-powered document processing pipeline for automated information extraction.",
        description: "Built an intelligent document processing system that extracts structured data from unstructured documents using a combination of OCR, NLP, and custom transformer models.",
        problem: "Manual document review consumed thousands of analyst hours per month, with inconsistent extraction accuracy and no scalable solution in place.",
        approach: "Developed a multi-stage pipeline: OCR preprocessing, layout analysis, entity extraction using fine-tuned transformer models, and a human-in-the-loop validation interface.",
        outcome: "Automated 70% of document processing tasks, improved extraction accuracy to 94%, and saved the organization an estimated 2,000 analyst hours monthly.",
        techStack: ["Python", "Hugging Face", "Tesseract OCR", "spaCy", "FastAPI", "React"],
        githubUrl: "https://github.com",
        demoUrl: "https://demo.example.com",
        featured: true,
    },
    {
        id: "4",
        title: "Feature Store",
        summary: "Centralized feature management platform for ML teams.",
        description: "Designed and built a centralized feature store enabling ML teams to discover, share, and serve features consistently across training and inference.",
        problem: "Feature engineering was duplicated across teams, training-serving skew was common, and there was no standard way to share or discover features.",
        approach: "Built a metadata-driven feature registry, implemented dual compute paths (batch via Spark, real-time via Redis), and created SDK libraries for seamless integration.",
        outcome: "Reduced feature development time by 60%, eliminated training-serving skew for all onboarded models, and became the standard feature platform for 5 ML teams.",
        techStack: ["Python", "Apache Spark", "Redis", "PostgreSQL", "gRPC", "Terraform"],
        githubUrl: "https://github.com",
        demoUrl: null,
        featured: false,
    },
];

export const experience: Experience[] = [
    {
        id: "1",
        company: "Acme AI Labs",
        role: "Senior AI Engineer",
        duration: "2023 — Present",
        description: "Leading ML infrastructure and pipeline systems.",
        order_index: 0,
        achievements: [
            "Architected and deployed ML pipeline orchestration system processing 5M+ records daily",
            "Reduced model deployment cycle time from 5 days to 8 hours",
            "Led migration from monolithic model serving to microservice-based inference platform",
            "Mentored 3 junior engineers on ML systems design and best practices",
        ],
    },
    {
        id: "2",
        company: "DataFlow Inc.",
        role: "AI Engineer",
        duration: "2021 — 2023",
        description: "Built real-time ML inference and feature platform.",
        order_index: 1,
        achievements: [
            "Built real-time inference API serving 10,000+ predictions per second at sub-50ms latency",
            "Developed feature store platform adopted by 5 ML teams, reducing feature dev time by 60%",
            "Implemented automated model monitoring that detected production drift in under 2 hours",
            "Contributed to open-source ML tooling used by 200+ organizations",
        ],
    },
    {
        id: "3",
        company: "NeuralSoft",
        role: "ML Engineer",
        duration: "2019 — 2021",
        description: "Designed NLP pipelines and document intelligence systems.",
        order_index: 2,
        achievements: [
            "Designed NLP pipeline for document intelligence, automating 70% of manual review tasks",
            "Fine-tuned transformer models achieving 94% accuracy on domain-specific entity extraction",
            "Built data labeling and annotation tools that accelerated dataset creation by 3x",
            "Established ML experiment tracking practices using MLflow across the engineering team",
        ],
    },
];

// Skills kept as plain record — api.ts maps SkillCategory[] from backend
export const skills: Record<string, string[]> = {
    programming: ["Python", "TypeScript", "Go", "SQL", "Bash"],
    mlai: ["PyTorch", "TensorFlow", "Hugging Face", "scikit-learn", "ONNX", "LangChain"],
    backend: ["FastAPI", "PostgreSQL", "Redis", "gRPC", "Apache Kafka", "Celery"],
    infra: ["Docker", "Kubernetes", "Terraform", "AWS", "GCP", "GitHub Actions"],
    tools: ["Git", "Linux", "MLflow", "Weights & Biases", "Prometheus", "Grafana"],
};

// Writing placeholder — PostListItem shape (used when API is unreachable)
export const writing: PostListItem[] = [
    {
        id: "1",
        title: "Building Reliable ML Pipelines: Lessons from Production",
        slug: "building-reliable-ml-pipelines",
        summary: "Practical patterns for designing ML pipelines that don't break at 3 AM.",
        tags: ["mlops", "python"],
        is_published: true,
        created_at: "2025-11-15T00:00:00Z",
    },
    {
        id: "2",
        title: "Feature Stores: When You Need One and When You Don't",
        slug: "feature-stores-when-you-need-one",
        summary: "A pragmatic guide to evaluating whether your team actually needs a feature store.",
        tags: ["mlops", "feature-engineering"],
        is_published: true,
        created_at: "2025-08-22T00:00:00Z",
    },
    {
        id: "3",
        title: "Low-Latency Model Serving with FastAPI and ONNX Runtime",
        slug: "low-latency-model-serving",
        summary: "Technical deep-dive into optimizing model inference for real-time applications.",
        tags: ["fastapi", "mlops"],
        is_published: true,
        created_at: "2025-05-10T00:00:00Z",
    },
    {
        id: "4",
        title: "The Case for Boring ML Infrastructure",
        slug: "boring-ml-infrastructure",
        summary: "Why choosing proven, simple infrastructure patterns often outperforms chasing the latest MLOps trends.",
        tags: ["infrastructure"],
        is_published: true,
        created_at: "2025-02-18T00:00:00Z",
    },
];

export const about: About = {
    name: "Ravindranath Porandla",
    title: "AI Engineer",
    tagline: "Building production ML systems. Focused on infrastructure, reliability, and shipping models that actually work.",
    bio: "I'm an AI Engineer focused on the intersection of machine learning and systems engineering. I build the infrastructure that takes ML models from research notebooks to production services — pipelines, serving platforms, feature stores, and the glue that holds it all together. My work is driven by a simple belief: the hardest part of ML isn't the model, it's everything around it.",
    philosophy: "I believe in building systems that are boring in the best way — reliable, observable, and maintainable. I prefer proven patterns over hype, clear documentation over clever abstractions, and shipping iteratively over building the perfect system. Good ML infrastructure should be invisible to the people who use it.",
    education: [
        {
            degree: "B.Tech in Computer Science",
            institution: "University of Technology",
            year: "2019",
        },
    ],
};
