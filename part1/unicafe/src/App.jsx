import { useState } from "react";
import Button from "./Button";
import Statistics from "./Statics";
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const all = good + bad + neutral;
  const average = all === 0 ? 0 : (good - bad) / all;
  const positive = all === 0 ? 0 : (good /all) * 100;

  return (
    <div>
      <h1> Give Your Feedback for Nepali Dish Mo:Mo</h1>
      <Button clickFunc={() => setGood((good) => good + 1)} label="good" />
      <Button
        clickFunc={() => setNeutral((neutral) => neutral + 1)}
        label="neutral"
      />
      <Button clickFunc={() => setBad((bad) => bad + 1)} label="bad" />
      <h2>Statics:</h2>
      {all===0 ? (<p> No feedback are there </p>) : (

        <Statistics  good={good}
          neutral={neutral}
          bad={bad}
          all={all}
          average={average}
          positive={positive} />
      )}
    </div>
      
  );
};

export default App;
