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
      'Hawk Gives You An Opportunity To Score 1.5x Times The Points That Were Previously Allotted To The Questions. This Powerup Is Valid ONLY for All Questions In That Particular Region. The Multiplier Starts From The Question, At Which It Is Applied. ',
    maximumAllowed: 2,
    cost: 500,
    image: multiply,
  },
  {
    id: 2,
    name: 'Question Skip',
    description:
      'Hawk Gives You The Opportunity To Skip A Question! Remember That This Will Not Count As An Answered Question, And Points Will Not Be Added For It.',
    maximumAllowed: 1,
    cost: 400,
    image: skip,
  },
  {
    id: 3,
    name: 'Streak',
    description:
      'Once You Purchase This Hawk Gives You A Score Multiplier Of 2x With 3 Strikes. Every Incorrect Attempt Is A Strike. 3 Strikes Remove This Extra Multiplier. On Getting A Correct Answer While This Multiplier Is Active The Number Of Strikes Left Is Reset To 3.',
    maximumAllowed: 2,
    cost: 300,
    image: streak,
  },
  {
    id: 4,
    name: 'Flip a coin*',
    description:
      'Hawk Flips A Biased Coin To Decide If You Skip That Question. If It Lands On “Hawk” You Skip That Question. Remember That This Will Not Count As An Answered Question, And Points Will Not Be Added For It If You Skip It.',
    maximumAllowed: 2,
    cost: 200,
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
