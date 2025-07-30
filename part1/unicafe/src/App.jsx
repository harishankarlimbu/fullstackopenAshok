import Header from "./Header"
import Content from "./Content"
import Total from "./Total";
function App() {
  const course= {
    name: 'Half Stack application development',
    parts: [
      { topic:"Fundamentals of React", exercises:10},
      { topic:"using props to pass data", exercises:7},
      { topic:"State of a component", exercises:14},
    ]
  }
return (
<div> 
<Header course={course.name}/>
<Content parts={course.parts}/>
<Total parts={course.parts}/>

</div>

)       
}

export default App
