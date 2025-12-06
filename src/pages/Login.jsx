import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();
	
	const [username, setUsername] = useState("");
	
	const handleSubmit = (e) => {
		e.preventDefault();
		
		if (!username.trim()) {
			alert("Введите имя");
			return;
		}
		
		login(username);
		navigate("/");
	};
	
	return (
		<section className="page login-page">
			<h1 className="page-title">Вход</h1>
			
			<form className="login-form" onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Имя пользователя"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				
				<button type="submit" className="login-btn">
					Войти
				</button>
			</form>
		</section>
	);
}

export default Login;
