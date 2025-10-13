import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Offers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/offers/student", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffers(res.data);
      } catch (err) {
        console.error("Error fetching offers:", err);
      }
    };

    fetchOffers();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/offers/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOffers((prev) =>
        prev.map((o) =>
          o.offer_id === id ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error("Error updating offer:", err);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-blue-600">💼 My Internship Offers</h1>
      <p className="mt-2 text-gray-700">Review and respond to your offers.</p>

      <table className="mt-6 w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Internship</th>
            <th className="border border-gray-300 p-2">Company</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Offered At</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.offer_id}>
              <td className="border border-gray-300 p-2">{offer.internship_title}</td>
              <td className="border border-gray-300 p-2">{offer.company_name}</td>
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
                {new Date(offer.offered_at).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 p-2 space-x-2">
                {offer.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(offer.offer_id, "accepted")}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(offer.offer_id, "rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
                {offer.status !== "pending" && (
                  <span className="text-gray-500 italic">No actions</span>
                )}
              </td>
            </tr>
          ))}
          {offers.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No offers yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
