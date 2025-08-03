function Button({clickFunc, label}){
    return (
        <button onClick={clickFunc}>{label}</button>
    )
}
export default Button;