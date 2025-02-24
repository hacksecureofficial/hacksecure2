import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

// Path for certificate data
const dataDirectory = path.join(process.cwd(), "data");
const CERTIFICATES_FILE_PATH = path.join(dataDirectory, "certificates.json");

// GET handler to fetch certificates (with JWT authentication)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIdFromQuery = searchParams.get("userId");
  const token = cookies().get("token")?.value;

  try {
    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error("JWT_SECRET is not set in the environment variables");
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      } catch (error) {
        console.error("Invalid token:", error);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      const userId = decoded.userId;
      if (!userId) {
        return NextResponse.json({ error: "User ID not found in token" }, { status: 400 });
      }

      const certificateData = await fs.readFile(CERTIFICATES_FILE_PATH, "utf8");
      const certificates = JSON.parse(certificateData || "[]");
      const userCertificates = certificates.filter((certificate: any) => certificate.userId === userId);

      return NextResponse.json({ certificates: userCertificates });
    } else if (userIdFromQuery) {
      const certificateData = await fs.readFile(CERTIFICATES_FILE_PATH, "utf8");
      const certificates = JSON.parse(certificateData || "[]");
      const userCertificates = certificates.filter((certificate: any) => certificate.userId === userIdFromQuery);

      return NextResponse.json({ certificates: userCertificates });
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error reading certificates:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}

// POST handler to save a new certificate
export async function POST(request: Request) {
  const data = await request.json();

  try {
    let certificateData = [];
    try {
      const fileContent = await fs.readFile(CERTIFICATES_FILE_PATH, "utf8");
      certificateData = JSON.parse(fileContent);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }

    const newCertificate = {
      id: crypto.randomUUID(),
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      date: data.date,
      score: data.score,
      imageUrl: data.imageUrl,
    };

    certificateData.push(newCertificate);

    await fs.writeFile(CERTIFICATES_FILE_PATH, JSON.stringify(certificateData, null, 2));

    return NextResponse.json({ success: true, certificate: newCertificate });
  } catch (error) {
    console.error("Error saving certificate:", error);
    return NextResponse.json({ error: "Failed to save certificate" }, { status: 500 });
  }
}