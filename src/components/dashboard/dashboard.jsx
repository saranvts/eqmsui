import Navbar from "../navbar/navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2>Welcome to the Dashboard</h2>
        <p>This is your home page after logging in.</p>
      </div>
    </>
  );
};

export default Dashboard;
