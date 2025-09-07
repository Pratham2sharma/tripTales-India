import React from "react";

// Define the shape of the subscription object
interface Subscription {
  plan: "free" | "premium";
  expiresAt?: string; // The date comes from JSON as a string
}

// Define the shape of the user object prop
interface User {
  planGeneratedCount: number;
  subscription?: Subscription;
}

// Define the props for our component
interface SubscriptionStatusProps {
  user: User;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ user }) => {
  // Use optional chaining for safety, even with types
  const isPremium = user.subscription?.plan === "premium";

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isPremium) {
    return (
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
        <p className="font-bold">You are a Premium Member!</p>
        <p>
          Your access is active until {formatDate(user.subscription?.expiresAt)}
          .
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
      <p className="font-bold">You are on the Free Plan.</p>
      <p>
        You have {Math.max(0, 5 - user.planGeneratedCount)} free trip plans
        remaining.
      </p>
    </div>
  );
};

export default SubscriptionStatus;
