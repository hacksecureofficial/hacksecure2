import { NextResponse } from "next/server";

const achievements = [
  {
    id: "9939ceda-9aa8-4b68-a83c-6543d4544e12",
    userId: "fa2a00e6-a50d-4072-bc3f-a09114458f7d",
    firstName: "Aditya",
    lastName: "Singh",
    date: "1/20/2025",
    score: 10,
    imageUrl: "https://via.placeholder.com/96", // Replace with actual image if available
  },
];

export async function GET() {
  return NextResponse.json(achievements);
}
