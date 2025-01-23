import React from "react";
import { UserData } from "@/context/UserContext";

const StatusBar = () => {
  const { user } = UserData();

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex flex-col gap-5 items-start justify-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your courses today.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Your Role</p>
            <p className="font-medium text-purple-600 capitalize">{user.role}</p>
          </div>
          <img
            src={user.avatar || "/statusbar.jpg"}
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
