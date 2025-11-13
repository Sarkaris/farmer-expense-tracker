"use client";

import SectionCard from "@/components/SectionCard";
import UserProfileForm from "@/components/UserProfileForm";
import { useDashboard } from "@/components/DashboardProvider";

export default function ProfilePage() {
  const { user, handleSaveUser, profileLoading, error } = useDashboard();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 sm:space-y-6 px-3 sm:px-4 py-4 sm:py-8 lg:px-10">
      {error ? <div className="alert-error text-xs sm:text-sm p-3 sm:p-4">{error}</div> : null}
      <SectionCard
        title="Farmer Profile"
        description="Save your farm details to unlock weather data, AI-driven insights, and pincode-based forecasts."
      >
        <UserProfileForm
          key={
            user
              ? `${user._id}-${
                  new Date(user.updatedAt || user.createdAt || Date.now()).getTime()
                }`
              : "new-user"
          }
          user={user}
          onSave={handleSaveUser}
          loading={profileLoading}
        />
      </SectionCard>
    </div>
  );
}


