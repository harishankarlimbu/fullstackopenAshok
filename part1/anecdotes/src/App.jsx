import { useState } from 'react';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ];

  const [index, setIndex] = useState(0);
  const [votes, setVotes] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [topVoteIndex, setTopVote] = useState(null);

  const nextQuote = () => {
    const random = Math.floor(Math.random() * anecdotes.length);
    setIndex(random);
  };

  const vote = () => {
    const copy = [...votes];
    copy[index] += 1;
    setVotes(copy);
  };

  function topVoted() {
    const Maxvotes = Math.max(...votes);
    const maxIndex = votes.indexOf(Maxvotes);
    setTopVote(maxIndex);

  }

  return (
    <div>
      <p>{anecdotes[index]}</p>
      <p>This quote has {votes[index]} votes.</p>
      <button onClick={nextQuote}>Next Quote</button>
      <button onClick={vote}>Vote</button>
      <button onClick={topVoted}> show most voted</button>
      {
        topVoteIndex !== null ? (
          <div>
            <p>{anecdotes[topVoteIndex]}</p>
            <p>With {votes[topVoteIndex]} votes</p>
          </div>
        ) : (
          <p>No top voted quote yet.</p>
        )
      }

    </div>
  );
};

export default App;
