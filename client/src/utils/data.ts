export interface IPowerUp {
  id: number;
  name: string;
  description: string;
  maximumAllowed: number;
  cost: number;
}

export const powerUps = [
  {
    id: 1,
    name: "Region Multiplier",
    description:
      "Description of Region Multiplier powerup in one or two lines , multiplies score of that region and so on and so forth.",
    maximumAllowed: 2,
    cost: 200,
  },
  {
    id: 2,
    name: "Question Skip",
    description:
      "Description of Question Skip powerup in one or two lines , multiplies score of that region and so on and so forth.",
    maximumAllowed: 1,
    cost: 300,
  },
  {
    id: 3,
    name: "Anagram",
    description:
      "Description of Anagram powerup in one or two lines , multiplies score of that region and so on and so forth.",
    maximumAllowed: 2,
    cost: 500,
  },
  {
    id: 4,
    name: "Question 50/50",
    description:
      "Description of Question 50/50 powerup in one or two lines , multiplies score of that region and so on and so forth.",
    maximumAllowed: 2,
    cost: 600,
  },
];
