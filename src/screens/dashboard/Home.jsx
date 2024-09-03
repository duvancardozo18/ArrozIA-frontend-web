import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../components";

const Home = () => {
  return (
    <div className="content-area">
      <AreaTop title="Panel" /> 
      <AreaCards />
      <AreaCharts />
      <AreaTable />
    </div>
  );
};

export default Home;
