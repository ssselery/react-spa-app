import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import TechnologyList from "./pages/TechnologyList.jsx";
import TechnologyDetail from "./pages/TechnologyDetail.jsx";
import AddTechnology from "./pages/AddTechnology.jsx";
import Login from "./pages/Login.jsx";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				
				<Route path="technologies" element={<TechnologyList />} />
				<Route path="technologies/:id" element={<TechnologyDetail />} />
				<Route path="add" element={<AddTechnology />} />
				
				<Route path="login" element={<Login />} />
			</Route>
		</Routes>
	);
}

export default App;
