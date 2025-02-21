import { NextRequest, NextResponse } from 'next/server';
import { db, userProfiles } from '@/lib/db';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // Parse the FormData object
    const userId = formData.get('userId') as string;
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
      user_id: userId,
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

export async function GET() {
  return NextResponse.json({ message: 'Method not implemented' }, { status: 405 });
}
