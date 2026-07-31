import mongoose from "mongoose";

// Schema for individual mission states within an attempt
const missionStateSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["locked", "active", "complete"],
    default: "locked",
  },
  unlockedAt: { type: Date },
  completedAt: { type: Date },
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

// Schema for individual tab switch / focus violation logs
const tabSwitchLogSchema = new mongoose.Schema({
  reason: { type: String, required: true }, // 'tab_switch', 'window_blur', 'fullscreen_exit'
  timestamp: { type: Date, default: Date.now },
});

// Main Candidate Attempt Schema
const attemptSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "not-started",
        "in-progress",
        "submitted",
        "expired",
        "terminated",
      ],
      default: "not-started",
    },
    startedAt: { type: Date },
    endsAt: { type: Date },
    submittedAt: { type: Date },

    // Proctoring & Security
    tabSwitches: {
      type: Number,
      default: 0,
      min: 0,
    },
    tabSwitchLogs: [tabSwitchLogSchema],

    // Mission Progression
    missions: {
      type: [missionStateSchema],
      default: () => [
        { number: 1, status: "locked" },
        { number: 2, status: "locked" },
        { number: 3, status: "locked" },
        { number: 4, status: "locked" },
      ],
    },
  },
  { timestamps: true },
);

// Helper method to log tab switches and return auto-termination flag
attemptSchema.methods.recordTabSwitch = async function (reason) {
  this.tabSwitches += 1;
  this.tabSwitchLogs.push({ reason, timestamp: new Date() });

  if (this.tabSwitches >= 3) {
    this.status = "terminated";
    this.submittedAt = new Date();
  }

  await this.save();
  return {
    tabSwitches: this.tabSwitches,
    status: this.status,
    isTerminated: this.status === "terminated",
  };
};

export default mongoose.model("Attempt", attemptSchema);
