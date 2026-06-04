import { foundations } from "./foundations.js";
import { languages } from "./languages.js";
import { frontend } from "./frontend.js";
import { backend } from "./backend.js";
import { dataTopics } from "./data.js";
import { architecture } from "./architecture.js";
import { cloudDevops } from "./cloud-devops.js";
import { fullstack } from "./fullstack.js";

export const CATS = ["Foundations", "Languages", "Frontend", "Backend", "Data", "Architecture", "Cloud / DevOps", "Fullstack Tracks"];

// 51 topics across 8 categories, combined in sidebar order
export const TOPICS = [
  ...foundations,
  ...languages,
  ...frontend,
  ...backend,
  ...dataTopics,
  ...architecture,
  ...cloudDevops,
  ...fullstack,
];
