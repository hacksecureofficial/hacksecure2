import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

// Fetch users.json from the public folder
async function readUsersFile() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/users.json`)
    if (!response.ok) {
      throw new Error('Failed to fetch users.json')
    }
    return await response.json()
  } catch (error) {
    console.error('Error reading users file:', error)
    throw new Error('Unable to read users data')
  }
}

export async function POST(request) {
  console.log('Sign-in attempt received')
  try {
    const { email, password } = await request.json()

    const users = await readUsersFile()
    console.log(`Users file read, ${users.length} users found`)

    const user = users.find((u) => u.email === email)
    if (!user) {
      console.log(`User not found for email: ${email}`)
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '1h' }
    )

    const response = NextResponse.json({ message: 'Sign in successful' }, { status: 200 })

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error in signin:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred during signin' },
      { status: 500 }
    )
  }
}
