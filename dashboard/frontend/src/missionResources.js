// Central list of mission resource files.
// Files themselves live in /public/resources/ so Vite serves them at /resources/<name>.pdf

export const missionResources = {
  mission1: [
    {
      key: "client-requirements",
      title: "Client requirements",
      type: "document",
      url: "/resources/m1-client-requirements.pdf",
    },
  ],
  mission2: [
    {
      key: "oop-reference-guide",
      title: "OOP & Design Patterns Cheatsheet",
      type: "document",
      url: "/resources/m2-architecture-reference.pdf",
    },
  ],
  mission3: [
    {
      key: "webdev-reference-guide",
      title: "Full-Stack Web Dev & API Design Guide",
      type: "document",
      url: "/resources/m3-webdev-reference.pdf",
    },
  ],
  mission4: [
    {
      key: "deployment-reference-guide",
      title: "Full-Stack Web Dev & API Design Guide",
      type: "document",
      url: "/resources/m4-deployment-reference.pdf",
    },
  ],
};
