import mongoose from "mongoose";

const architectureSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    missionNumber: { type: Number, required: true },
    versionLabel: { type: String, required: true }, // 'v1' | 'v2' | 'v3' | 'final'
    // Drag-and-drop builder state: selected components + how they're connected.
    payload: {
      components: { type: [mongoose.Schema.Types.Mixed], default: [] },
      connections: { type: [mongoose.Schema.Types.Mixed], default: [] },
      // Only populated on the 'final' (Mission 4) submission — the
      // rollout/rollback/monitoring plan that goes with the architecture.
      // Optional and unused by missions 1–3.
      deploymentPlan: {
        rollout: { type: String, default: "" },
        rollback: { type: String, default: "" },
        monitoring: { type: String, default: "" },
      },
    },
    isAutosave: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// One saved record per candidate + mission + version, autosaves overwrite in place.
architectureSchema.index(
  { candidate: 1, missionNumber: 1, versionLabel: 1 },
  { unique: true },
);

export default mongoose.model("Architecture", architectureSchema);
