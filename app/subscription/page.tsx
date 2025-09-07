import React from "react";
import SubscribeButton from "../components/SubscribeButton"; // Assuming this is also a .tsx file

const SubscribePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Go Premium! ✨
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Unlock the full potential of Triptales India.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-center text-blue-900">
            ₹50 / month
          </h2>

          <ul className="mt-6 space-y-4 text-gray-700">
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✔</span>
              Unlimited AI Trip Plans
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✔</span>
              Access to All Themed Itineraries
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✔</span>
              Save and Share Your Plans
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✔</span>
              Priority Customer Support
            </li>
          </ul>
        </div>

        <div className="text-center">
          <SubscribeButton />
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;
