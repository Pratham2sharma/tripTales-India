import React from "react";

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  onClose,
  onUpgrade,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          You&apos;ve Used Your 5 Free Plans!
        </h2>
        <p className="text-gray-600 mb-6">
          Upgrade to Premium to unlock unlimited AI trip planning and more
          exclusive features.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onUpgrade}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Upgrade to Premium
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
