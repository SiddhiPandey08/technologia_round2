export const BUDGET_CAP = 9500; // matches Business Requirements §1 (~₹8,00,000/month)

export const techCatalog = [
  {
    key: "frontend",
    label: "Frontend App Tier",
    required: true,
    options: [
      {
        id: "fe-react-cdn",
        name: "React / Next.js Single Page App (CDN Hosted)",
        cost: 150,
        note: "Fast static delivery via global edge CDN with serverless SSR support.",
      },
      {
        id: "fe-monolith",
        name: "Server-Rendered Templates (Monolithic UI)",
        cost: 300,
        note: "Couples UI closely to backend app instances; harder to scale independently.",
      },
    ],
  },
  {
    key: "compute",
    label: "Backend API Engine",
    required: true,
    options: [
      {
        id: "compute-autoscale",
        name: "Auto-Scaling Managed Compute (VM-based / Containers)",
        cost: 1500,
        note: "Managed environment with low ops overhead for application services.",
      },
      {
        id: "compute-k8s",
        name: "Managed Kubernetes Cluster",
        cost: 3000,
        note: "High operational complexity and cost; steep learning curve for small teams.",
      },
      {
        id: "compute-serverless",
        name: "Serverless Functions (FaaS)",
        cost: 600,
        note: "Cost-effective for sporadic traffic, but vulnerable to cold starts.",
      },
    ],
  },
  {
    key: "database",
    label: "Primary Database",
    required: true,
    options: [
      {
        id: "db-medium-replica",
        name: "Managed Relational DB — Medium + Read Replica",
        cost: 900,
        note: "Separates primary read/write traffic while maintaining transaction integrity.",
      },
      {
        id: "db-large",
        name: "Managed Relational DB — Multi-AZ + 2 Replicas",
        cost: 2600,
        note: "High availability setup, best suited for heavy production loads.",
      },
      {
        id: "db-nosql",
        name: "Managed NoSQL Document Store",
        cost: 800,
        note: "Great for flexible schemas; requires extra care for relational data integrity.",
      },
    ],
  },
  {
    key: "auth",
    label: "Identity & Authentication",
    required: true,
    options: [
      {
        id: "auth-managed",
        name: "Managed Auth Service (OAuth2 / OIDC)",
        cost: 120,
        note: "Offloads session security, MFA, and credential storage compliance.",
      },
      {
        id: "auth-custom",
        name: "Custom JWT Auth Service",
        cost: 50,
        note: "Requires full team maintenance for security patches and token rotation.",
      },
    ],
  },
  {
    key: "messaging",
    label: "Notifications & Message Queues",
    required: true,
    options: [
      {
        id: "queue-managed",
        name: "Managed SQS / Message Broker",
        cost: 100,
        note: "Asynchronously decouples background tasks (emails, webhooks, processing).",
      },
      {
        id: "queue-kafka",
        name: "Distributed Event Stream (Kafka-class)",
        cost: 1400,
        note: "High throughput event stream; high maintenance overhead.",
      },
    ],
  },
  {
    key: "ai_ml",
    label: "AI Recommendation Engine",
    required: false,
    options: [
      {
        id: "ai-managed-api",
        name: "Managed AI/ML Recommendation API",
        cost: 450,
        note: "Pre-trained recommendation API; zero infrastructure maintenance.",
      },
      {
        id: "ai-custom-model",
        name: "Custom PyTorch Model on GPU Instances",
        cost: 1800,
        note: "High cost and training overhead; maximum flexibility.",
      },
    ],
  },
  {
    key: "payments",
    label: "Payment Gateway Integration",
    required: false,
    options: [
      {
        id: "pay-gateway",
        name: "PCI-DSS Certified Payment API",
        cost: 0,
        note: "Per-transaction fee structure — zero infrastructure management overhead.",
      },
      {
        id: "pay-inhouse",
        name: "In-House Vault Storage",
        cost: 500,
        note: "Violates compliance guidelines unless rigorous audit standards are met.",
      },
    ],
  },
  {
    key: "monitoring",
    label: "Observability & Analytics",
    required: false,
    options: [
      {
        id: "mon-suite",
        name: "Managed Log Aggregation & Metrics Suite",
        cost: 250,
        note: "Provides real-time dashboards, alerting, and APM tracing.",
      },
      {
        id: "mon-basic",
        name: "Basic Cloud Provider Metrics",
        cost: 50,
        note: "Includes fundamental CPU/Memory metrics without deep application tracing.",
      },
    ],
  },
  {
    key: "caching",
    label: "Caching Tier",
    required: false,
    options: [
      {
        id: "cache-redis",
        name: "Managed In-Memory Cache (Redis/Memcached)",
        cost: 200,
        note: "Reduces DB read load for high-frequency user requests.",
      },
      {
        id: "cache-none",
        name: "No In-Memory Cache",
        cost: 0,
        note: "All requests query the database tier directly.",
      },
    ],
  },
  {
    key: "storage",
    label: "Storage & CDN",
    required: false,
    options: [
      {
        id: "storage-object",
        name: "Cloud Object Storage + CDN Integration",
        cost: 355,
        note: "Scalable storage for user uploads, media, and static assets.",
      },
    ],
  },
  {
    key: "dr",
    label: "Disaster Recovery & Multi-AZ",
    required: false,
    options: [
      {
        id: "dr-backup",
        name: "Cross-Region Backup & Automated Failover",
        cost: 350,
        note: "Ensures low Recovery Time Objective (RTO) without dual active infrastructure costs.",
      },
      {
        id: "dr-active",
        name: "Multi-Region Active-Active Deployment",
        cost: 3500,
        note: "Fully redundant active infrastructure across multiple geographic regions.",
      },
    ],
  },
];
