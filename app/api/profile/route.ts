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


export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData(); // Parse the FormData object
    const email = formData.get('email') as string;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required for updating the profile' },
        { status: 400 }
      );
    }

    // Get fields for update
    const firstName = formData.get('firstName') as string | null;
    const lastName = formData.get('lastName') as string | null;
    const dob = formData.get('dob') as string | null;
    const city = formData.get('city') as string | null;
    const country = formData.get('country') as string | null;
    const likes = formData.get('likes') as string | null;
    const profileImage = formData.get('profileImage') as File | null;

    // Prepare the updated fields
    const updatedFields: any = {};

    if (firstName) updatedFields.first_name = firstName;
    if (lastName) updatedFields.last_name = lastName;
    if (dob) {
      const dateOfBirth = new Date(dob).toISOString().split('T')[0];
      updatedFields.date_of_birth = dateOfBirth;
    }
    if (city) updatedFields.location_city = city;
    if (country) updatedFields.location_country = country;
    if (likes) updatedFields.likes = likes;

    // Handle file upload for profile picture
    if (profileImage) {
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${profileImage.name}`;
      const relativePath = `/uploads/${fileName}`;
      const fullPath = path.join(uploadDir, fileName);

      // Save the uploaded file to the server
      const fileBuffer = Buffer.from(await profileImage.arrayBuffer());
      fs.writeFileSync(fullPath, fileBuffer);
      updatedFields.profile_picture = relativePath;
    }

    // Update the user profile in the database
    const result = await db
      .update(userProfiles)
      .set(updatedFields)
      .where(eq(userProfiles.email, email))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Profile updated successfully', updatedFields },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}