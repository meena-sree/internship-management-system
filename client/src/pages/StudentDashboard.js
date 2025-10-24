import { useSelector } from "react-redux";
import Applications from "./Applications";
import Offers from "./Offers";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-blue-600">
        🎓 Welcome, {user?.name} (Student)
      </h1>
      
      {/*  Separate components */}
      <Applications />
      <Offers/>
    </div>
  );
}
