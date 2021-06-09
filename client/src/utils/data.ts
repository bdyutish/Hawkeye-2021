import multiply from '../assets/powerUps/multiplier.png';
import half from '../assets/powerUps/half.png';
import skip from '../assets/powerUps/skip.png';
import streak from '../assets/powerUps/streak.png';

export interface IPowerUp {
  id: number;
  name: string;
  description: string;
  maximumAllowed: number;
  cost: number;
  image: string;
}

export const powerUps = [
  {
    id: 1,
    name: 'Region Multiplier',
    description:
      'Description of Region Multiplier powerup in one or two lines , multiplies score of that region and so on and so forth.',
    maximumAllowed: 2,
    cost: 200,
    image: multiply,
  },
  {
    id: 2,
    name: 'Question Skip',
    description:
      'Description of Question Skip powerup in one or two lines , multiplies score of that region and so on and so forth.',
    maximumAllowed: 1,
    cost: 300,
    image: skip,
  },
  {
    id: 3,
    name: 'Streaks',
    description:
      'Description of Anagram powerup in one or two lines , multiplies score of that region and so on and so forth.',
    maximumAllowed: 2,
    cost: 500,
    image: streak,
  },
  {
    id: 4,
    name: 'Question 50/50',
    description:
      'Description of Question 50/50 powerup in one or two lines , multiplies score of that region and so on and so forth.',
    maximumAllowed: 2,
    cost: 600,
    image: half,
  },
];

export const coordinates = [
  {
    name: 'Antarctica',
    coords: [64.133304, -77.64007],
    color: '#38B8D3',
  },
  {
    name: 'Africa',
    coords: [21.758663, -4.038333],
    color: '#8458FF',
  },
  {
    name: 'Americas',
    coords: [-98.484245, 39.011902],
    color: '#5BCD66',
  },
  {
    name: 'Asia',
    coords: [94.433983, 51.719082],
    color: '#FF5C01',
  },
  {
    name: 'Europe',
    coords: [28.7806, 55.499908],
    color: '#A70379',
  },
  {
    name: 'Australia',
    coords: [133.579941, -21.89621],
    color: '#DE071D',
  },
];
