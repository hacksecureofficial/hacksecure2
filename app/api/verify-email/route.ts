import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

// Define User interface to avoid implicit 'any' errors
interface User {
  id: string
  email: string
  verified: boolean
  verificationToken?: string
}

const USERS_FILE_PATH = path.join(process.cwd(), "data", "users.json")

// Force dynamic rendering
export const dynamic = "force-dynamic"

// Read users from JSON file
async function readUsersFile(): Promise<User[]> {
  const data = await fs.readFile(USERS_FILE_PATH, "utf8")
  return JSON.parse(data) as User[]
}

// Write updated users to JSON file
async function writeUsersFile(users: User[]): Promise<void> {
  await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2))
}

// Handle GET request for email verification
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    const users = await readUsersFile()

    // Use explicit 'User' type for the 'user' parameter
    const userIndex = users.findIndex((user: User) => user.verificationToken === token)

    if (userIndex === -1) {
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 })
    }

    // Update user verification status
    users[userIndex].verified = true
    delete users[userIndex].verificationToken

    await writeUsersFile(users)
    return NextResponse.json({ message: "Email verified successfully" })
  } catch (error) {
    console.error("Error in email verification:", error)
    return NextResponse.json({ error: "An error occurred during email verification" }, { status: 500 })
  }
}
