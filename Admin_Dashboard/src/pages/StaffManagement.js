import React, { useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import RoleManagement from "./RoleManagement";
import Accounts from "./Accounts";

function StaffManagement() {
    const [activeTab, setActiveTab] = useState("accounts");

    return (
        <div className="w-full">
            <PageTitle>Staff Management</PageTitle>
            <div className="mt-6 bg-white rounded shadow p-6 w-full">
                <div className="flex mb-6 border-b">
                    <button
                        className={`px-4 py-2 font-semibold ${activeTab === "accounts" ? "border-b-2 border-purple-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("accounts")}
                    >
                        Accounts
                    </button>
                    <button
                        className={`ml-4 px-4 py-2 font-semibold ${activeTab === "roles" ? "border-b-2 border-purple-600" : "text-gray-500"}`}
                        onClick={() => setActiveTab("roles")}
                    >
                        Roles & Permissions
                    </button>
                </div>
                <div>
                    {activeTab === "accounts" && (
                        <Accounts />
                    )}
                    {activeTab === "roles" && (
                        <RoleManagement />
                    )}
                </div>
            </div>
        </div>
    );
}

export default StaffManagement;
