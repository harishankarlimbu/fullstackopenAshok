import Part from './Part';

function Content ({parts}){
    return (
        <div>
            {parts.map(item=>
            <Part topic={item.topic} exercises ={item.exercises}/>
            )}
          
        </div>
    )
}
export default Content;
