const CompanyStats = () => {
  return (
    <div className="bg-red-600 py-16"> {/* Increased vertical padding */}
      <h2 className="text-xl font-semibold text-white text-center mb-8">
        Our company in numbers
      </h2>
      <div className="flex justify-around text-white">
        <div className="text-center">
          <p className="text-3xl font-bold">2M €</p>
          <p className="text-base">annual turnover</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">27</p>
          <p className="text-base">employees</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">100</p>
          <p className="text-base">completed projects</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyStats;
