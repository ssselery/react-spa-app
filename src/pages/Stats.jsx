import Dashboard from "../components/Dashboard";
import useTechnologies from "../hooks/useTechnologies";

function Stats() {
	const { techList } = useTechnologies();
	
	return <Dashboard technologies={techList} />;
}

export default Stats;
