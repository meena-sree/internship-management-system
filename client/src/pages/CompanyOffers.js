import { useEffect, useState } from "react";
import api from "../utils/api";

export default function CompanyOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/offers/company", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffers(res.data);
      } catch (err) {
        console.error("Error fetching company offers:", err);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold">📨 Internship Offers Sent</h2>
      <table className="mt-4 w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Internship</th>
            <th className="border border-gray-300 p-2">Student</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Offered On</th>
            <th className="border border-gray-300 p-2">Action Taken On</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.offer_id}>
              <td className="border border-gray-300 p-2">{offer.internship_title}</td>
              <td className="border border-gray-300 p-2">{offer.student_name}</td>
              <td className="border border-gray-300 p-2">
                <span className={`px-2 py-1 rounded text-white text-sm
                    ${offer.status === "pending" ? "bg-yellow-500" : ""}
                    ${offer.status === "accepted" ? "bg-green-500" : ""}
                    ${offer.status === "rejected" ? "bg-red-500" : ""}
                  `}>
                    {offer.status}
                  </span>
              </td>
               <td className="border border-gray-300 p-2">
                  {offer.offered_at ? new Date(offer.offered_at).toLocaleDateString() : "NA"}
                </td>
              <td className="border border-gray-300 p-2">
                {new Date(offer.offered_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {offers.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No offers sent yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
