import React from "react";
import PageTitle from "../components/Typography/PageTitle";

const Profile = () => {
  return (
    <div>
      <PageTitle>Manage your Profile</PageTitle>
      {/* Thông tin cá nhân sẽ hiển thị ở đây */}
      {/* Menu Staff Management phía dưới Profile */}
      <div className="mt-12">
        <a
          href="/app/staff-management"
          className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Staff Management
        </a>
      </div>
    </div>
  );
};

export default Profile;
