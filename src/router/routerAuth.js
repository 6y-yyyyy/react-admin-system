import { Navigate } from "react-router-dom";

// React 会把组件开始标签和结束标签之间的内容，通过 props.children 传进去
export const RouterAuth = ({ children }) => {
    const token = localStorage.getItem('token')
    if (!token) {
        return <Navigate to='/login' replace />
    }
    return(
        children
    )
}