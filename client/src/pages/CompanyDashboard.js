import { useSelector } from "react-redux";
import CompanyApplications from "./CompanyApplications";
import CompanyOffers from "./CompanyOffers"; 

export default function CompanyDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-green-600">
        🏢 Welcome, {user?.name} (Company)
      </h1>
      <p className="mt-2 text-gray-700">This is your company dashboard.</p>

      {/* ✅ Separate components */}
      <CompanyApplications />
       <CompanyOffers /> 
    </div>
  );
}
