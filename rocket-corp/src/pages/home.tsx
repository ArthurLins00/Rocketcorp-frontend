import { Sidebar } from "../components/Sidebar";
export const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to Rocket Corp</h1>
      <p>Your one-stop solution for all things rocket-related!</p>
      <p>Explore our services and learn more about our mission.</p>
      <Sidebar />
    </div>
  );
};
