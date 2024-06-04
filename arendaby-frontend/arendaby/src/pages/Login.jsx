import Form from "../components/LoginAndRegForm"

function Login() {
    return <Form route="/api/token" method="login" />
}

export default Login