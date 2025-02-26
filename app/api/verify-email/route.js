import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const USERS_FILE_PATH = path.join(process.cwd(), 'data', 'users.json');

// Removed: export const dynamic = 'force-dynamic'  🚫

/**
 * Reads the users.json file and returns the parsed users array.
 */
async function readUsersFile() {
  const data = await fs.readFile(USERS_FILE_PATH, 'utf8');
  return JSON.parse(data);
}

/**
 * Writes the updated users array to users.json.
 * @param {Array} users - Updated users array.
 */
async function writeUsersFile(users) {
  await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2));
}

/**
 * GET request to verify user's email with the provided token.
 */
export async function GET(request) {
  try {
    const url = new URL(request.url); // Correct usage for extracting the URL
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    const users = await readUsersFile();
    const userIndex = users.findIndex((user) => user.verificationToken === token);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Update user verification status
    users[userIndex].verified = true;
    delete users[userIndex].verificationToken;

    await writeUsersFile(users);

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error in email verification:', error);
    return NextResponse.json(
      { error: 'An error occurred during email verification' },
      { status: 500 }
    );
  }
}
