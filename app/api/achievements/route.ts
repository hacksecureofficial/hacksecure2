import { cookies } from "next/headers";
import Image from "next/image";
import React from "react";

interface Achievement {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  date: string;
  score: number;
  imageUrl: string;
}

async function getAchievements(): Promise<Achievement[]> {
  try {
    const cookieStore = cookies();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/achievements`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
    );

    if (!response.ok) throw new Error("Failed to fetch achievements");
    return response.json();
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
}

export default async function AchievementsPage() {
  const achievements = await getAchievements();

  if (achievements.length === 0) {
    return (
      <React.Fragment>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Achievements</h1>
          <p>No achievements found.</p>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Achievements</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <li
              key={ach.id}
              className="p-4 bg-white rounded-2xl shadow-lg flex flex-col items-center"
            >
              <Image
                src={ach.imageUrl || "/placeholder.svg"}
                alt={`${ach.firstName} ${ach.lastName}`}
                width={96}
                height={96}
                className="rounded-full mb-3"
              />
              <p className="font-semibold">{`${ach.firstName} ${ach.lastName}`}</p>
              <p className="text-sm text-gray-500">Date: {ach.date}</p>
              <p className="text-lg font-bold">Score: {ach.score}</p>
            </li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
}
