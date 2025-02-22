'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DesktopNav from 'app/(dashboard)/DesktopNav';
import Providers from 'app/(dashboard)/providers';

export default function UserProfilePage() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    city: '',
    country: '',
    likes: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);

      // Optional: Preview the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgElement = document.querySelector("img");
        if (imgElement && e.target?.result) {
          imgElement.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!profile.firstName || !profile.lastName || !profile.dob ||!profile.email|| !profile.city || !profile.country || !profile.likes) {
      setError('Please fill in all fields');
      return;
    }

    const exampleuserid="1fb6f28b-d1af-4bcc-b261-c859e92742a3";

    const formData = new FormData();
    formData.append('email',profile.email );
    formData.append('firstName', profile.firstName);
    formData.append('lastName', profile.lastName);
    formData.append('dob', profile.dob);
    formData.append('city', profile.city);
    formData.append('country', profile.country);
    formData.append('likes', profile.likes);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccess('Profile saved successfully');
        router.push(`/userProfileDisplay?email=${profile.email}`); 
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
       <Providers>
       <DesktopNav/>
       </Providers>
      <div className="grid grid-cols-12 gap-x-8">
        <div className="col-span-9 h-full">
          <Card className="shadow-lg ml-12 -mt-3">
            <CardHeader className="bg-white border-b-2 p-6">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                My Profile
              </CardTitle>
              <CardDescription className="pt-2 text-gray-600">
                Update your personal information to enhance content recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={profile.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={profile.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={profile.dob}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Email used for signin
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="text"
                      placeholder="Enter your email used for signin"
                      value={profile.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                </div>
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Enter your city"
                      value={profile.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                    Country
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    placeholder="Enter your country"
                    value={profile.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="likes" className="text-sm font-medium text-gray-700">
                    Likes (comma-separated)
                  </Label>
                  <Input
                    id="likes"
                    name="likes"
                    type="text"
                    placeholder="Enter your likes"
                    value={profile.likes}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center">{success}</p>}
                <Button type="submit" className="bg-black hover:bg-gray-800 text-white"> 
                Save Profile
              </Button>
              </form>
            </CardContent>
            {/* <CardFooter className="p-4 bg-gray-100">
              {/* <Button
                onClick={() => router.push('/')}
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                Back to Home
              </Button> 
            </CardFooter> */}
          </Card>
        </div>

        {/* Right Section (Image or Additional Content) */}
        <div className="col-span-3 bg-white shadow-lg p-4 rounded-lg -mt-3">
          <img
            src="/placeholder-user.jpg"
            alt="Profile Visual"
            className="w-32 h-32 mx-auto rounded-full shadow-md"
          />
          <p className="text-center text-gray-600 mt-4">Visualize your profile here!</p>

          <div className="mt-4 text-center">
          <label
            htmlFor="uploadImage"
            className="inline-block bg-black text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-800 text-sm"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="uploadImage"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
          />
        </div>
        </div>
      </div>
    </div>
  );
}
