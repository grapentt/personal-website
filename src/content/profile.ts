/**
 * Facts about me, in one place: used by the home page and the about page.
 * Keep this in sync with public/Resume.pdf.
 */

export interface Role {
  period: string;
  organisation: string;
  title: string;
  summary: string;
  details?: string[];
  tags?: string[];
}

export interface Education {
  period: string;
  degree: string;
  institution: string;
  summary: string;
  link?: { label: string; href: string };
}

export interface Project {
  title: string;
  kind: string;
  summary: string;
  href?: string;
  linkLabel?: string;
  tags: string[];
}

export interface ResearchItem {
  status: string;
  title: string;
  summary: string;
  points?: string[];
  links: { label: string; href: string }[];
}

export const intro = {
  name: 'Thomas Grapentin',
  location: 'Berlin',
  tagline: 'Mathematician and AI scientist',
  lede:
    'I am an AI scientist at SAP, working on RPT, SAP’s foundation model for tabular business data. I study mathematics at Humboldt University of Berlin and am writing my master’s thesis in Frank Noé’s AI4Science group at Freie Universität Berlin, on machine learning that respects the geometry of its data. And I write about the mathematics I love, with interactive visualisations.',
};

export const pillars = [
  {
    title: 'Research',
    text: 'Geometry-aware machine learning for molecules, in Frank Noé’s AI4Science group at FU Berlin, and topological deep learning. Before that, Seiberg–Witten theory and the topology of 4-manifolds.',
    link: { label: 'Research', to: '/#research' },
  },
  {
    title: 'Industry',
    text: 'AI scientist on SAP’s foundation model for business data, after four years of full-stack development: AI tooling and process automation at SAP, machine learning for aerospace manufacturing at KPMG, banking software at KfW.',
    link: { label: 'Experience', to: '/#experience' },
  },
  {
    title: 'Writing',
    text: 'Long-form articles on geometry, topology, physics and machine learning, built around hand-made visualisations and interactive films.',
    link: { label: 'The blog', to: '/blog' },
  },
];

export const research: ResearchItem[] = [
  {
    status: 'M.Sc. thesis · FU Berlin · in progress',
    title: 'Machine learning in the right geometry',
    summary:
      'My master’s thesis, written with Frank Noé in the AI4Science group at Freie Universität Berlin. Molecules come with geometry. Their energy does not change when they are moved or turned. Some of their motions are far stiffer than others: stretching a bond costs orders of magnitude more energy than twisting around it. And realistic configurations concentrate on lower-dimensional structure. The usual flat, Euclidean picture ignores all of this: it measures every direction of motion with the same ruler, so a tiny, costly bond stretch and a large, cheap twist count alike. The thesis develops machine learning that works in the geometry of molecules instead.',
    points: [
      'Generative models for molecular conformations that live on the space of shapes.',
      'Methods that discover the lower-dimensional structure molecular data lie on, and learn on it.',
    ],
    links: [{ label: 'The geometry of shape space', href: '/blog/shape-space' }],
  },
  {
    status: 'B.Sc. thesis · 2025',
    title: 'Seiberg–Witten theory and the differential topology of 4-manifolds',
    summary:
      'Written under Chris Wendl at Humboldt University. An overview of 4-manifold topology and the interplay between topology and physics, followed by a comprehensive introduction to the Seiberg–Witten equations.',
    links: [{ label: 'Read the thesis (PDF)', href: 'thesis.pdf' }],
  },
  {
    status: 'Open source',
    title: 'TopoBench: topological deep learning at scale',
    summary:
      'Contributed to all categories of the TAG-DS Topological Deep Learning Challenge: an on-disk inductive and transductive preprocessor and data loader that lets models learn on graphs too large for memory, using topology-aware sampling. The organisers included the work in the challenge white paper.',
    links: [{ label: 'TopoBench on GitHub', href: 'https://github.com/geometric-intelligence/TopoBench' }],
  },
];

export const projects: Project[] = [
  {
    title: 'Interactive films',
    kind: 'Visualisation engine',
    summary:
      'A small engine for narrated, scrubbable canvas animations whose scenes the reader can take over: first written to think through my master’s thesis, now the engine behind the films on this blog.',
    href: '/blog/hopf-fibration',
    linkLabel: 'See one: the Hopf fibration',
    tags: ['TypeScript', 'Canvas', 'KaTeX'],
  },
  {
    title: 'Route optimisation',
    kind: 'Freelance · 2022',
    summary:
      'Route optimisation software for a sneaker-cleaning delivery service: graph clustering to share the stops between drivers, travelling-salesman heuristics for each route, and iterative balancing of the workload. With a visualiser of the key algorithms.',
    href: 'https://grapentt.github.io/RouteOptimizationVisualizer/',
    linkLabel: 'Open the visualiser',
    tags: ['Java', 'JavaScript', 'Optimisation'],
  },
  {
    title: 'This website',
    kind: 'Open source',
    summary:
      'React, Vite and MDX with KaTeX, a design system with light and dark themes, and the film engine. Built so that writing a new visual article is mostly writing.',
    href: 'https://github.com/grapentt/personal-website',
    linkLabel: 'Source on GitHub',
    tags: ['React', 'TypeScript', 'MDX'],
  },
];

export const experience: Role[] = [
  {
    period: '2026 – today',
    organisation: 'Freie Universität Berlin',
    title: 'AI4Science group of Frank Noé',
    summary: 'Master’s thesis research on geometry-aware machine learning for molecules.',
    tags: ['Generative models', 'Differential geometry', 'JAX'],
  },
  {
    period: '2024 – today',
    organisation: 'SAP',
    title: 'AI scientist',
    summary: 'Since 2026 in the Business Foundation Model team, developing RPT, SAP’s foundation model for tabular business data. Before that, two and a half years as a full-stack developer on AI tooling and process automation.',
    details: [
      'Business Foundation Model (AI scientist, 2026 – today): research and development on RPT, SAP’s foundation model for tabular business data.',
      'MCP Builder (BTP AI, 2025 – 2026): architected and built the client of a platform that turns REST APIs (OpenAPI, OData) into Model Context Protocol tools, so that AI assistants can act on enterprise systems.',
      'SAP Build Process Automation (2024): backend services in Java and Spring Boot for SAP’s production workflow-automation platform, with API and end-to-end tests.',
      'Composable Process Platform (innovation team, 2024): a prototype for composing business capabilities with BPMN-style orchestration, in React, Spring Boot, SAP CAP, Temporal and Kubernetes.',
    ],
    tags: ['Foundation models', 'Python', 'Java', 'TypeScript', 'Kubernetes'],
  },
  {
    period: '2023',
    organisation: 'KPMG',
    title: 'Data science and advanced analytics',
    summary:
      'AI-assisted shot peening for rocket-tank production. I designed and built the energy inverter, which turns the model’s energy predictions into robot trajectories by mathematical optimisation. The project won WirtschaftsWoche’s Best of Consulting award.',
    tags: ['Python', 'TensorFlow', 'Optimisation'],
  },
  {
    period: '2022',
    organisation: 'KfW Development Bank',
    title: 'Java developer',
    summary: 'Internal banking software in an agile team, including the migration of legacy PL/I code to Java on mainframe systems.',
    tags: ['Java', 'Hibernate'],
  },
  {
    period: '2021',
    organisation: 'Humboldt University and private tutoring',
    title: 'Tutor',
    summary: 'Led the mathematics introduction course for incoming physics students, and tutored algorithms, programming, linear algebra and physics.',
  },
];

export const education: Education[] = [
  {
    period: '2025 – today',
    degree: 'M.Sc. Mathematics',
    institution: 'Humboldt University of Berlin',
    summary: 'Specialisation in differential geometry and topology. Master’s thesis in Frank Noé’s AI4Science group at Freie Universität Berlin.',
  },
  {
    period: '2019 – 2025',
    degree: 'B.Sc. Computer Science, Mathematics and Physics',
    institution: 'Humboldt University of Berlin',
    summary: 'An interdisciplinary programme (240 ECTS) across all three subjects, specialising in differential geometry and topology. Thesis on Seiberg–Witten theory under Chris Wendl.',
    link: { label: 'Thesis (PDF)', href: 'thesis.pdf' },
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Mathematics', items: ['Differential geometry', 'Topology', 'Gauge theory', 'Optimisation'] },
  { group: 'Machine learning', items: ['Generative models', 'Tabular foundation models', 'Geometric and topological deep learning', 'PyTorch, JAX, TensorFlow'] },
  { group: 'Engineering', items: ['Python', 'Java and Spring Boot', 'TypeScript and React', 'Kubernetes, Docker, CI/CD'] },
];
