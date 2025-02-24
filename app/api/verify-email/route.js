import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path to the users JSON file
const USERS_FILE_PATH = path.join(process.cwd(), 'data', 'users.json');

// 🚫 Removed: `export const dynamic = 'force-dynamic';`
// This was causing the export conflict. Remove it if you're using `output: export` in next.config.js.


// Read users from the JSON file
async function readUsersFile() {
  try {
    const data = await fs.readFile(USERS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Failed to read users file:', err);
    throw new Error('Could not read users file.');
  }
}

// Write updated users back to the JSON file
async function writeUsersFile(users) {
  try {
    await fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('❌ Failed to write users file:', err);
    throw new Error('Could not write users file.');
  }
}

// GET handler for email verification
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url); // Extract query parameters
    const token = searchParams.get('token'); // Get 'token' from URL

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required.' }, { status: 400 });
    }

    const users = await readUsersFile();
    const userIndex = users.findIndex((user) => user.verificationToken === token);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'Invalid verification token.' }, { status: 400 });
    }

    // Update user verification status
    users[userIndex].verified = true;
    delete users[userIndex].verificationToken;

    await writeUsersFile(users); // Save changes to the file

    return NextResponse.json({ message: '✅ Email verified successfully.' });
  } catch (error) {
    console.error('🚨 Error in email verification:', error);
    return NextResponse.json({ error: 'An error occurred during email verification.' }, { status: 500 });
  }
}
