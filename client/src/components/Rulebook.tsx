import React, { ReactElement } from 'react';
import Modal from 'react-modal';
import hawkpng from '../assets/hawk.svg';
interface Props {
  closeHandler: () => void;
  open: boolean;
}

export default function Rulebook({ closeHandler, open }: Props): ReactElement {
  return (
    <Modal
      onRequestClose={closeHandler}
      className="rulebook-modal"
      overlayClassName="overlay"
      isOpen={open}
    >
      <div onClick={closeHandler} className="close">
        <i className="fas fa-times"></i>
      </div>
      <div className="overlay-content">
        <img src={hawkpng} alt="logo" id="hawkk" />
        <h1>Rulebook</h1>
        <div>
          <h3>GamePlay</h3>
          <ol>
            <li>
              This is an online scavenger hunt, it starts at
              <span> 19/06/21 12:00</span> and ends on
              <span> 21/6/21 23:59</span>
            </li>
            <li>
              You will spawn in a <span>random region</span> out the 6 regions.
              You have to make your way through the regions one by one by
              solving perplexing riddles. Solve all questions to get a chance to
              beat the hawk.
            </li>
            <li>
              The next region will be made available after a
              <span> certain period of time</span>. You can unlock them faster
              if you solve the questions of your current timeline early.
            </li>
            <li>
              If the answer is <span>&#34;22 Cakes&#34;</span> then the answer
              you should write is <span>&#34;twotwo cakes&#34;</span>. If the
              answer contains special characters, replace them to the nearest
              character. For example, <span>&#x27;&#x101;&#x27;</span> becomes
              <span>&#x27;a&#x27;</span>. If the answer is
              <span>&#x27;Steve Jobs&#x27;</span> then the answer you should
              write is
              <span> &#x27;steven paul jobs&#x27;.</span>
            </li>
            <li>
              All names, places, organizations, things should be as appears on
              <span> Wikipedia</span> with a few exceptions. They will mostly be
              the <span>full name </span>
              of the person, place, or thing.
            </li>
            <li>
              All supporting images shall be linked externally or given to you.
              You will <span> not</span> find anything hidden in the
              <span> codebase of the game.</span>
            </li>
            <li>
              Hawk will also let you know if you’re on the
              <span> right track</span>, by indicating that it thinks you’re
              close if your <span>answer is similar </span>
              to the correct answer partially.
            </li>
            <li>
              Cheaters will be found by our monitoring system and will be
              <span> ineligible</span> for any prizes. Any suspicious behavior
              will be reported to us by the game.
            </li>
            <li>
              Powerups must be applied after buying for them to be effective
            </li>
          </ol>
        </div>
        <div className="pop2">
          <h3>Ranking & Points</h3>
          <ol>
            <li>
              You will receive <span>100 reputation points</span> for every
              question you solve. The leaderboard is calculated based on the
              total points you have,and <span>NOT</span> the number of questions
              you have solved.
            </li>
            <li>
              To make it interesting, Hawk presents you with
              <span> 4</span> different types of <span> Powerups</span>, that
              you can buy using your reputation points. However, due to a
              <span> limited supply</span>, there are only a few Powerups of
              each kind you can buy.
            </li>
            <li>
              Winners will be decided on the basis of who has the most
              reputation points at the end of the game and who got there first.
              Therefore, it’s imperative that you buy and use your
              <span> Powerups wisely</span> as it affects your position on the
              leaderboard.
            </li>
          </ol>
        </div>
        <div className="pop3">
          <h3>PowerUps</h3>
          <ol>
            <li>
              Region Multiplier - <span>500</span> Points <br />
              Available:
              <span> 2</span>
              <br />
              Hawk gives you an opportunity to score 1.5x times the points that
              were previously allotted to the questions. This powerup is valid{' '}
              <span>ONLY </span>
              for all questions in that particular region. The multiplier starts
              from the question, at which it is applied. You can use two such
              powerups together on the same region to increase the multiplier to
              <span> 1.5*1.5 = 2.25x times.</span>
            </li>
            <li>
              Question Skip - <span>400</span> Points <br />
              Available:
              <span> 1</span> <br />
              Hawk gives you the opportunity to skip a question! Remember that
              this will not count as an answered question, and points will not
              be added for it.
            </li>
            <li>
              Flip a coin <span>200</span> Points <br />
              Available:
              <span> 2</span> <br />
              Hawk flips a biased coin to decide if you skip that question. If
              it lands on “hawk” you skip that question. Remember that this will
              not count as an answered question, and points will not be added
              for it if you skip it.
            </li>
            <li>
              Streak <span>300</span> Points <br />
              Available: <span> 2</span>
              <br />
              Once you purchase this hawk gives you a score multiplier of
              <span> 2x with 3 strikes</span>. Every incorrect attempt is a
              strike. 3 strikes remove this extra multiplier. On getting a
              correct answer while this multiplier is active the number of
              strikes left is <span>reset to 3.</span>
            </li>
          </ol>
        </div>
        <div className="pop4">
          <h3>Contact Us:</h3>
          <ol>
            <li>Akhil - 9030544185</li>
            <li>Dyutish - 8777218544</li>
            <li>Ishan - 9430470186</li>
            <li>Himanshu - 7260954097</li>
            <li>Nishika - 9810517874</li>
            <li>Sarthak - 9810317930</li>
          </ol>
        </div>
      </div>
    </Modal>
  );
}
