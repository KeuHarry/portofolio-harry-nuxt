// Single source of truth for the site content. Text that changes between
// languages is stored as { en, fr } and read through useLocalized().

export interface Localized { en: string, fr: string }

export const profile = {
  name: 'Harry Keumezeu Feujio',
  shortName: 'Harry Keumezeu',
  role: { en: 'Senior software engineer', fr: 'Ingénieur logiciel senior' },
  email: 'harryforester10@gmail.com',
  location: { en: 'Accra, Ghana', fr: 'Accra, Ghana' },
  links: {
    linkedin: 'https://www.linkedin.com/in/harry-keumezeu-feujio-91242a138/',
    github: 'https://github.com/KeuHarry',
  },
}

export const intro: Localized = {
  en: '7+ years building web platforms for healthcare, infrastructure and network security, from requirements to production.',
  fr: 'Plus de 7 ans à construire des plateformes web pour la santé, les infrastructures et la sécurité réseau, du recueil des besoins à la mise en production.',
}

export const about: Localized[] = [
  {
    en: 'I’m a full-stack engineer who ships business-critical systems end to end: understanding the need, designing the data model and APIs, building the interface and seeing it through to production.',
    fr: 'Je suis ingénieur full-stack et je livre des systèmes critiques pour le métier de bout en bout : comprendre le besoin, concevoir le modèle de données et les API, construire l’interface et accompagner la mise en production.',
  },
  {
    en: 'On the frontend I care about performance, accessibility (WCAG) and components that stay easy to change. On the backend I write robust, well-tested APIs and keep the busy endpoints fast.',
    fr: 'Côté frontend, je soigne la performance, l’accessibilité (WCAG) et des composants faciles à faire évoluer. Côté backend, j’écris des API robustes et bien testées, et je garde les endpoints les plus sollicités rapides.',
  },
  {
    en: 'Most recently at Cyberdian Group, I built features for a network security platform used by European clients, inside a micro-frontend architecture that spans React, Nest.js, Go, Python and several data stores.',
    fr: 'Dernièrement chez Cyberdian Group, j’ai développé des fonctionnalités pour une plateforme de sécurité réseau utilisée par des clients européens, au sein d’une architecture micro-frontend qui réunit React, Nest.js, Go, Python et plusieurs bases de données.',
  },
]

export const facts: { label: Localized, value: Localized }[] = [
  {
    label: { en: 'Time zone', fr: 'Fuseau horaire' },
    value: { en: 'GMT, one or two hours behind Paris', fr: 'GMT, une à deux heures de décalage avec Paris' },
  },
  {
    label: { en: 'Languages', fr: 'Langues' },
    value: { en: 'French (native), English (fluent)', fr: 'Français (natif), anglais (courant)' },
  },
  {
    label: { en: 'Works with', fr: 'Travaille avec' },
    value: { en: 'Remote teams, in Europe and beyond', fr: 'Des équipes à distance, en Europe et au-delà' },
  },
  {
    label: { en: 'Off screen', fr: 'Hors écran' },
    value: { en: 'Football, reading and games', fr: 'Football, lecture et jeux' },
  },
]

export interface Role {
  id: string
  title: Localized
  company: string
  place: Localized
  start: string // YYYY-MM
  end: string // YYYY-MM
  points: Localized[]
  stack: string[]
  // Commit-graph placement: lane 0 is the main line, lane 1 a branch.
  lane: 0 | 1
  mergesAbove?: boolean
  branchesBelow?: boolean
}

// Newest first.
export const experience: Role[] = [
  {
    id: 'cyberdian',
    title: { en: 'Senior Software Engineer', fr: 'Ingénieur logiciel senior' },
    company: 'Cyberdian Group',
    place: { en: 'Paris, remote', fr: 'Paris, à distance' },
    start: '2025-04',
    end: '2026-07',
    points: [
      {
        en: 'Owned feature delivery in a micro-frontend architecture for a network security platform serving European clients.',
        fr: 'Responsable de la livraison de fonctionnalités dans une architecture micro-frontend, pour une plateforme de sécurité réseau au service de clients européens.',
      },
      {
        en: 'Worked on backend and data-pipeline components that process security event data at scale, with cross-functional teams in a French-speaking environment.',
        fr: 'Travail sur les composants backend et les pipelines de données qui traitent des événements de sécurité à grande échelle, avec des équipes pluridisciplinaires francophones.',
      },
    ],
    stack: ['React', 'Nest.js', 'Go', 'Python', 'PostgreSQL', 'MongoDB', 'ClickHouse', 'Neo4j', 'Airflow'],
    lane: 0,
  },
  {
    id: 'tcm-consultant',
    title: { en: 'Software Developer Consultant', fr: 'Consultant développeur logiciel' },
    company: 'The Coding Machine',
    place: { en: 'Paris, remote', fr: 'Paris, à distance' },
    start: '2023-06',
    end: '2024-10',
    points: [
      {
        en: 'Designed, built and deployed a project management platform for SADE, a global network and infrastructure company, including interactive scheduling views.',
        fr: 'Conception, développement et déploiement d’une plateforme de gestion de projets pour SADE, groupe international de réseaux et d’infrastructures, avec des vues de planification interactives.',
      },
      {
        en: 'Load- and performance-tested the platform with k6 under realistic usage before rollout.',
        fr: 'Tests de charge et de performance avec k6, en conditions d’usage réalistes, avant le déploiement.',
      },
    ],
    stack: ['Symfony', 'Vue.js', 'MySQL', 'Docker', 'Cypress', 'Bryntum', 'Matomo', 'k6'],
    lane: 1,
    mergesAbove: true,
  },
  {
    id: 'tcm-freelance',
    title: { en: 'Freelance Software Developer', fr: 'Développeur logiciel freelance' },
    company: 'The Coding Machine',
    place: { en: 'Paris, remote', fr: 'Paris, à distance' },
    start: '2021-12',
    end: '2023-05',
    points: [
      {
        en: 'Delivered web applications for several clients, taking each one from requirements to production deployment.',
        fr: 'Livraison d’applications web pour plusieurs clients, chacune menée du recueil des besoins jusqu’à la mise en production.',
      },
    ],
    stack: ['React', 'Vue.js', 'Nuxt', 'Laravel', 'Symfony', 'MySQL', 'MongoDB'],
    lane: 1,
    branchesBelow: true,
  },
  {
    id: 'pether',
    title: { en: 'Software Developer', fr: 'Développeur logiciel' },
    company: 'Pether Solutions',
    place: { en: 'Douala, Cameroon', fr: 'Douala, Cameroun' },
    start: '2019-01',
    end: '2021-12',
    points: [
      {
        en: 'Architected a Radiology Information System with PACS integration and an in-browser image viewer.',
        fr: 'Architecture d’un système d’information radiologique (RIS) avec intégration PACS et visionneuse d’images dans le navigateur.',
      },
      {
        en: 'Architected a multi-tenant pharmacy management platform with third-party API integrations and a consistent experience across tenants.',
        fr: 'Architecture d’une plateforme multi-tenant de gestion de pharmacies, avec intégrations d’API tierces et une expérience cohérente pour chaque client.',
      },
      {
        en: 'Maintained and updated the previous Laravel/AngularJS pharmacy platform in production while its multi-tenant successor was being designed.',
        fr: 'Maintenance et évolution de l’ancienne plateforme de pharmacie Laravel/AngularJS en production, pendant la conception de la nouvelle plateforme multi-tenant.',
      },
    ],
    stack: ['Laravel', 'Angular', 'AngularJS', 'MySQL'],
    lane: 0,
  },
]

export type ProjectKind = 'professional' | 'personal'

export interface Project {
  id: string
  title: string | Localized
  // Who it was for, shown above the title
  context: Localized
  period?: string
  kind: ProjectKind
  type: 'webapp' | 'website'
  summary: Localized
  role?: Localized
  // Keep to the 2–3 technologies that define the project; Skills lists the rest
  stack?: string[]
  // Demo, live site or repository; the card shows a link once this is set
  url?: string
}

// Most substantial first. Professional work keeps the order of the experience timeline.
export const projects: Project[] = [
  {
    id: 'dane',
    title: 'Dane',
    context: { en: 'Cyberdian Group', fr: 'Cyberdian Group' },
    period: '2025–2026',
    kind: 'professional',
    type: 'webapp',
    summary: {
      en: 'Network security policy management platform used by European clients.',
      fr: 'Plateforme de gestion des politiques de sécurité réseau, utilisée par des clients européens.',
    },
    stack: ['React', 'Nest.js', 'Go'],
  },
  {
    id: 'wellrx',
    title: 'WellRx',
    context: { en: 'Personal product', fr: 'Produit personnel' },
    kind: 'personal',
    type: 'webapp',
    summary: {
      en: 'Pharmacy management system for multi-branch pharmacies, with an AI assistant and overnight engines that flag expiring stock and draft purchase orders.',
      fr: 'Logiciel de gestion pour pharmacies multi-sites, avec un assistant IA et des calculs de nuit qui signalent les produits bientôt périmés et préparent les bons de commande.',
    },
    role: {
      en: 'I designed and built the whole product: the Laravel API, the Vue.js app, the queues and real-time updates, the AI assistant (natural-language reports, chat, a daily briefing per branch) and the marketing website.',
      fr: 'J’ai conçu et réalisé tout le produit : l’API Laravel, l’application Vue.js, les files d’attente et le temps réel, l’assistant IA (rapports en langage naturel, chat, synthèse quotidienne par officine) et le site vitrine.',
    },
    stack: ['Laravel', 'Vue.js', 'TypeScript'],
  },
  {
    id: 'rag-chatbot',
    title: { en: 'Document Q&A chatbot', fr: 'Chatbot de questions-réponses sur documents' },
    context: { en: 'Personal product', fr: 'Produit personnel' },
    kind: 'personal',
    type: 'webapp',
    summary: {
      en: 'An embeddable RAG chatbot that answers website visitors’ questions from a company’s own documents.',
      fr: 'Un chatbot RAG intégrable qui répond aux questions des visiteurs d’un site à partir des documents de l’entreprise.',
    },
    role: {
      en: 'I built the FastAPI backend, the Vue.js dashboard where clients upload documents, and the JavaScript widget. Each client gets its own vector collection and S3 prefix, so documents never cross from one client to another.',
      fr: 'J’ai réalisé le backend FastAPI, le tableau de bord Vue.js où les clients déposent leurs documents, et le widget JavaScript. Chaque client a sa propre collection vectorielle et son préfixe S3, pour que les documents ne passent jamais d’un client à l’autre.',
    },
    stack: ['FastAPI', 'Chroma', 'Claude'],
  },
  {
    id: 'prologue',
    title: 'Prologue',
    context: { en: 'SADE, with The Coding Machine', fr: 'SADE, avec The Coding Machine' },
    period: '2023–2024',
    kind: 'professional',
    type: 'webapp',
    summary: {
      en: 'Project management platform for SADE, a global network and infrastructure company, with interactive scheduling views.',
      fr: 'Plateforme de gestion de projets pour SADE, groupe international de réseaux et d’infrastructures, avec des vues de planification interactives.',
    },
    stack: ['Symfony', 'Vue.js', 'Bryntum'],
  },
  {
    id: 'procivis',
    title: 'Procivis',
    context: { en: 'Procivis, with The Coding Machine', fr: 'Procivis, avec The Coding Machine' },
    kind: 'professional',
    type: 'webapp',
    summary: {
      en: 'Internal web application for Procivis, a leading cooperative housing and real estate network in France.',
      fr: 'Application web interne pour Procivis, réseau coopératif de référence dans l’habitat et l’immobilier en France.',
    },
    stack: ['Symfony', 'Nuxt'],
  },
  {
    id: 'econocom',
    title: 'Econocom',
    context: { en: 'Econocom, with The Coding Machine', fr: 'Econocom, avec The Coding Machine' },
    kind: 'professional',
    type: 'webapp',
    summary: {
      en: 'Custom digital supply chain and business application.',
      fr: 'Application métier sur mesure de supply chain numérique.',
    },
    stack: ['Laravel', 'Laravel Nova'],
  },
  {
    id: 'elite-berbere',
    title: 'Elite Berbère',
    context: { en: 'With The Coding Machine', fr: 'Avec The Coding Machine' },
    kind: 'professional',
    type: 'webapp',
    summary: {
      en: 'Dating platform for the Berber community in France.',
      fr: 'Site de rencontre destiné à la communauté berbère en France.',
    },
    stack: ['Symfony', 'React', 'Stripe'],
  },
  {
    id: 'pether-pharma',
    title: 'PetherPharma',
    context: { en: 'Pether Solutions', fr: 'Pether Solutions' },
    period: '2019–2021',
    kind: 'professional',
    type: 'webapp',
    summary: {
      en: 'Multi-tenant pharmacy management platform with third-party API integrations. I designed it while maintaining and improving the previous platform, built with Laravel and AngularJS.',
      fr: 'Plateforme multi-tenant de gestion de pharmacies, avec intégrations d’API tierces. Je l’ai conçue tout en maintenant et en faisant évoluer l’ancienne plateforme, réalisée avec Laravel et AngularJS.',
    },
    stack: ['Laravel', 'Angular'],
  },
  {
    id: 'pether-ris',
    title: 'PetherRIS',
    context: { en: 'Pether Solutions', fr: 'Pether Solutions' },
    period: '2019–2021',
    kind: 'professional',
    type: 'webapp',
    summary: {
      en: 'Radiology Information System with PACS integration and an in-browser image viewer.',
      fr: 'Système d’information radiologique (RIS) avec intégration PACS et visionneuse d’images dans le navigateur.',
    },
    stack: ['Laravel', 'Angular', 'OHIF Viewer'],
  },
  {
    id: 'geartrove',
    title: 'GearTrove',
    context: { en: 'Personal project', fr: 'Projet personnel' },
    kind: 'personal',
    type: 'website',
    summary: {
      en: 'Concept storefront for car parts and accessories, with a vehicle garage, cart and checkout flow.',
      fr: 'Boutique en ligne conceptuelle de pièces et accessoires auto, avec garage de véhicules, panier et tunnel de commande.',
    },
    stack: ['Next.js', 'TypeScript'],
  },
  {
    id: 'harry-co',
    title: 'Harry & Co',
    context: { en: 'Personal project', fr: 'Projet personnel' },
    kind: 'personal',
    type: 'website',
    summary: {
      en: 'Concept website for a corporate law firm, with practice areas, team profiles and articles.',
      fr: 'Site conceptuel pour un cabinet d’avocats d’affaires, avec domaines d’expertise, profils de l’équipe et articles.',
    },
    stack: ['Nuxt', 'TypeScript'],
  },
]

export const skills: { group: Localized, items: string | Localized }[] = [
  {
    group: { en: 'Core engineering', fr: 'Fondamentaux' },
    items: 'System design (scalability, reliability, maintainability), API design (REST, GraphQL), OOP, SOLID, DDD, event-driven architecture, performance and security best practices',
  },
  {
    group: { en: 'Backend', fr: 'Backend' },
    items: 'PHP (Laravel, Symfony), Nest.js, Python (FastAPI), Go, WebSocket',
  },
  {
    group: { en: 'Data', fr: 'Données' },
    items: {
      en: 'PostgreSQL, MySQL, SQLite, MongoDB, Neo4j (graph), ClickHouse (analytics), Redis (caching), Airflow (data pipelines)',
      fr: 'PostgreSQL, MySQL, SQLite, MongoDB, Neo4j (graphe), ClickHouse (analytique), Redis (cache), Airflow (pipelines de données)',
    },
  },
  {
    group: { en: 'AI', fr: 'IA' },
    items: {
      en: 'RAG, LLM integration (Claude), vector search (Chroma), document ingestion (pypdf)',
      fr: 'RAG, intégration de LLM (Claude), recherche vectorielle (Chroma), ingestion de documents (pypdf)',
    },
  },
  {
    group: { en: 'Frontend', fr: 'Frontend' },
    items: 'Vue.js/Nuxt, React/Next.js, Angular, TypeScript, component architecture, accessibility (WCAG), performance (bundle size, lazy loading, tree-shaking)',
  },
  {
    group: { en: 'Testing', fr: 'Tests' },
    items: 'TDD, unit, integration, performance and load testing (k6), PHPUnit, Vitest, Jest, Playwright, Cypress',
  },
  {
    group: { en: 'Cloud and DevOps', fr: 'Cloud et DevOps' },
    items: 'AWS, Docker, CI/CD, Linux, Nginx, Traefik, Grafana',
  },
  {
    group: { en: 'Leadership', fr: 'Leadership' },
    items: {
      en: 'Mentoring and onboarding junior engineers, technical decision-making, trade-off analysis, communication across teams and with clients',
      fr: 'Mentorat et intégration de développeurs juniors, décisions techniques, analyse des compromis, communication entre équipes et avec les clients',
    },
  },
]

export const education = {
  degree: {
    en: 'Bachelor’s degree in computer science and networks',
    fr: 'Licence en informatique et réseaux',
  },
  school: 'Université des Montagnes',
  place: { en: 'Bangangté, Cameroon', fr: 'Bangangté, Cameroun' },
  date: '2016-11',
}

export const certifications: { name: string, issuer: string, date: string }[] = [
  { name: 'Certified Vue.js Developer, Level I', issuer: 'Certificates.dev', date: '2025-05' },
  { name: 'Certified Pinia Master', issuer: 'Vue School', date: '2024-12' },
  { name: 'CCNA Routing and Switching', issuer: 'Cisco Networking Academy', date: '2017-12' },
]
