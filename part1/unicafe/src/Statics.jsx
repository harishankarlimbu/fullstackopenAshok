import StatisticLine from "./StaticLine"

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  return (
    <div>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={all} />
      <StatisticLine text="average" value={average.toFixed(1)} />
      <StatisticLine text="positive" value={positive.toFixed(1) + ' %'} />
    </div>
  );
};

export default Statistics;
