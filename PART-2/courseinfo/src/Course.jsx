function Header({ course }) {
    return <h2>{course.name}</h2>;
}

function Part({ name, exercises }) {
    return <p>{name}: {exercises}</p>;
}

function Content({ parts }) {
    return (
        <div>
            {parts.map(item => (
                <Part key={item.id} name={item.name} exercises={item.exercises} />
            ))}
        </div>
    );
}

function Total({ exercises }) {
    const total = exercises.reduce((sum, current) => sum + current.exercises, 0);
    return (
        <div>
            <h3>Total exercises: {total}</h3>
        </div>
    );
}

function Course({ course }) {
    return (
        <div>
             <Header course={course} />
            <Content parts={course.parts} />
            <Total exercises={course.parts} />
        </div>
    );
}

export default Course;
