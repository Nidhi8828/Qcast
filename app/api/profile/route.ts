import { NextRequest, NextResponse } from 'next/server';
import { db, userProfiles } from '@/lib/db';
import path from 'path';
import fs from 'fs';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // Parse the FormData object
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const dob = formData.get('dob') as string;
    const city = formData.get('city') as string;
    const country = formData.get('country') as string;
    const likes = formData.get('likes') as string;
    const profileImage = formData.get('profileImage') as File | null;

    // Convert DOB to ISO format and extract the date part
    const dateOfBirth = new Date(dob).toISOString().split('T')[0];

    // Handle file upload
    let imagePath: string | null = null;

    if (profileImage) {
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${profileImage.name}`; // Use original file name or adjust as needed
      const relativePath = `/uploads/${fileName}`;
      const fullPath = path.join(uploadDir, fileName);

      // Save the uploaded file to the server
      const fileBuffer = Buffer.from(await profileImage.arrayBuffer());
      fs.writeFileSync(fullPath, fileBuffer);
      imagePath = relativePath;
    }

    // Insert data into the database
    await db.insert(userProfiles).values({
      email: email,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      location_city: city,
      location_country: country,
      likes,
      profile_picture: imagePath,
    });

    return NextResponse.json({ message: 'Profile saved successfully', imagePath }, { status: 200 });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the email from query parameters
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email query parameter is required' },
        { status: 400 }
      );
    }

    // Fetch the user by email
    const userResult = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.email, email))
      .limit(1);

      console.log('User fetched from database:', userResult);

    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult[0];
    console.log('userResult[0]', user);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
