'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function UserProfileEdit() {
  const [profile, setProfile] = useState({
    email:'',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    location_city: '',
    location_country: '',
    likes: '',
    profile_picture:''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      setError('No email provided');
      return;
    }

    // Fetch the existing profile using email
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profile?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError('Failed to fetch profile');
        }
      } catch (err) {
        setError('An error occurred while fetching the profile');
      }
    };

    fetchProfile();
  }, [email]);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);

      // preview image
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

    if (!profile.first_name || !profile.last_name || !profile.date_of_birth || !profile.location_city || !profile.location_country || !profile.likes) {
      setError('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('email', profile.email);
    formData.append('firstName', profile.first_name);
    formData.append('lastName', profile.last_name);
    formData.append('dob', profile.date_of_birth);
    formData.append('city', profile.location_city);
    formData.append('country', profile.location_country);
    formData.append('likes', profile.likes);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      const response = await fetch(`/api/profile`, {
        method: 'PUT', // You can use PATCH here if you're only updating specific fields
        body: formData,
      });

      if (response.ok) {
        setSuccess('Profile updated successfully');
        router.push(`/userProfileDisplay?email=${profile.email}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update profile');
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
        <DesktopNav />
      </Providers>
      <div className="grid grid-cols-12 gap-x-8">
        <div className="col-span-9 h-full">
          <Card className="shadow-lg ml-12 -mt-3">
            <CardHeader className="bg-white border-b-2 p-6">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Edit Profile
              </CardTitle>
              <CardDescription className="pt-2 text-gray-600">
                Modify your personal information to keep it up to date
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
                      name="first_name"
                      type="text"
                      placeholder="Enter your first name"
                      value={profile.first_name || 'NA'}
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
                      name="last_name"
                      type="text"
                      placeholder="Enter your last name"
                      value={profile.last_name || 'NA'}
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
                      name="date_of_birth"
                      type="date"
                      value={profile.date_of_birth || 'NA'}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      City
                    </Label>
                    <Input
                      id="city"
                      name="location_city"
                      type="text"
                      placeholder="Enter your city"
                      value={profile.location_city || "NA"}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="location_country"
                      type="text"
                      placeholder="Enter your Country"
                      value={profile.location_country || "NA"}
                      onChange={handleChange}
                      required
                    />
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
                    value={profile.likes || 'NA'}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center">{success}</p>}
                <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3 bg-white shadow-lg p-4 rounded-lg -mt-3">
          <img
            src={profile?.profile_picture || '/placeholder-user.jpg'}
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
