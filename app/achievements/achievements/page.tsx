"use client";

import { useEffect, useState } from "react";

interface Achievement {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  date: string;
  score: number;
  imageUrl: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch("/api/achievements");
        if (!response.ok) throw new Error("Failed to fetch achievements.");
        const data = await response.json();
        setAchievements(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) return <p>Loading achievements...</p>;
  if (achievements.length === 0) return <p>No achievements found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Achievements</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <li
            key={ach.id}
            className="p-4 bg-white rounded-2xl shadow-lg flex flex-col items-center"
          >
            <img
              src={ach.imageUrl}
              alt={`${ach.firstName} ${ach.lastName}`}
              className="w-24 h-24 rounded-full mb-3"
            />
            <p className="font-semibold">{`${ach.firstName} ${ach.lastName}`}</p>
            <p className="text-sm text-gray-500">Date: {ach.date}</p>
            <p className="text-lg font-bold">Score: {ach.score}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
