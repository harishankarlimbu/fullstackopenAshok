import React from "react";
import { useSelector } from "react-redux";
const Notification = () => {
    const notification = useSelector((state) => state.notification);
    if (!notification) return null;
    const style = {
        border: "solid",
        padding:6,
        borderWidth:2,
        marginBottom: 5,
        backgroundColor: "lightgrey",
    };
    return <div style={style}>{notification}</div>;
}
export default Notification;