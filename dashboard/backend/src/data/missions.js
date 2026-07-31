// data/missions.js
export const missions = [
  {
    number: 1,
    title: "Mission 1 – Project Discovery",
    type: "discovery", // <--- Interactive Tech Inventory & Requirements Analysis (No Canvas)
    savesVersion: "v1_discovery",
    scenario:
      "Study client requirements, business constraints, and available technology inventory.",
    objectives: [
      "Analyze project requirements and constraints.",
      "Select appropriate technologies from the inventory.",
      "Justify technology choices.",
    ],
  },
  {
    number: 2,
    title: "Mission 2 – Architecture Foundation",
    type: "architecture", // <--- Architecture Builder (Canvas Version 1)
    savesVersion: "v1",
    scenario:
      "Construct the core software architecture by selecting and arranging primary system components.",
    objectives: [
      "Arrange primary components in the Architecture Workspace.",
      "Establish logical component relationships.",
    ],
  },
  {
    number: 3,
    title: "Mission 3 – System Expansion",
    type: "architecture", // <--- Architecture Builder (Canvas Version 2 - loads v1)
    savesVersion: "v2",
    scenario:
      "Client requirements have changed. Extend your existing architecture to incorporate new features.",
    objectives: [
      "Integrate new expansion components into your previous layout.",
      "Refine logical component connections.",
    ],
  },
  {
    number: 4,
    title: "Mission 4 – Final Integration",
    type: "final_integration", // <--- Final Canvas + Deployment Plan
    savesVersion: "v4_final",
    scenario:
      "Review, organize, and finalize the complete software architecture and presentation before final submission.",
    objectives: [
      "Finalize overall architecture diagram.",
      "Complete deployment, rollback, and monitoring plans.",
    ],
  },
];

export function getMissionDefinition(number) {
  return missions.find((m) => m.number === number);
}
