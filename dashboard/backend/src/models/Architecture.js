import mongoose from "mongoose";

const architectureSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    missionNumber: { type: Number, required: true },
    versionLabel: { type: String, required: true },
    payload: {
      components: { type: [mongoose.Schema.Types.Mixed], default: [] },
      connections: { type: [mongoose.Schema.Types.Mixed], default: [] },
      answers: { type: mongoose.Schema.Types.Mixed, default: {} }, // ← add this
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

export default mongoose.model("Architecture", architectureSchema);
