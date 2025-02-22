// 'use client';
// import React, { Suspense } from 'react';
// import { useState, useEffect } from 'react';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from '@/components/ui/card';
// import { Pencil } from 'lucide-react';
// import { useSearchParams } from 'next/navigation';
// import DesktopNav from 'app/(dashboard)/DesktopNav';
// import Providers from 'app/(dashboard)/providers';

// const  ViewProfilePage=()=> {
//   const [profile, setProfile] = useState({
//     email:'',
//     first_name: '',
//     last_name: '',
//     date_of_birth: '',
//     location_city: '',
//     location_country: '',
//     likes: '',
//     profile_picture:''
//   });

//   const searchParams = useSearchParams();
//   const profileId = searchParams.get('email');

 

//   useEffect(() => {

//     if (!profileId) {
//      console.error("No profileId found");
//       return;
//     }
//     async function fetchProfile() {
//       try {
//         const response = await fetch(`/api/profile?email=${profileId}`, { method: 'GET' });
//         if (response.ok) {
//           const data = await response.json();
//           setProfile(data);
//         }
//       } catch (err) {
//         console.error('Failed to fetch profile:', err);
//       }
//     }
//     fetchProfile();
//   }, []);

//   // if (loading) {
//   //   return <div>Loading profile...</div>;
//   // }

//   // if (error) {
//   //   return <div>Error: {error}</div>;
//   // }

//   if (!profile) {
//     return <div>No profile found.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <Providers>
//         <DesktopNav />
//       </Providers>
//       <div className="grid grid-cols-12 gap-x-8">
//         <div className="col-span-9 h-full">
//           <Card className="shadow-lg ml-14 -mt-2 h-full flex flex-col">
//             <CardHeader className="bg-white border-b-2 p-6">
//               <CardTitle className="text-2xl font-semibold text-gray-800">
//                 My Profile
//               </CardTitle>
//               <CardDescription className="pt-2 text-gray-600">
//                 View your personal information
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="p-6 space-y-12 flex-grow h-full">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">First Name</p>
//                   <p className="text-lg text-gray-800">{profile.first_name || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">Last Name</p>
//                   <p className="text-lg text-gray-800">{profile.last_name || 'N/A'}</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">Date of Birth</p>
//                   <p className="text-lg text-gray-800">{profile.date_of_birth || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-700">Email Address</p>
//                   <p className="text-lg text-gray-800">{profile.email || 'N/A'}</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm font-medium text-gray-700">City</p>
//                 <p className="text-lg text-gray-800">{profile.location_city || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-700">Country</p>
//                 <p className="text-lg text-gray-800">{profile.location_country || 'N/A'}</p>
//               </div>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-700">Likes</p>
//                 <p className="text-lg text-gray-800">{profile.likes || 'N/A'}</p>
//               </div>
//               <div className="mt-10 flex ">
//                 <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-gray">
//                   <Pencil size={16} />
//                   <span>Edit Profile</span>
//                 </button>
//               </div>
              
//             </CardContent>
//           </Card>
//         </div>
//         <div className="col-span-3 bg-white shadow-lg p-4 rounded-lg -mt-2 h-full">
//           <img
//             src={profile?.profile_picture || '/placeholder-user.jpg'}
//             alt="Profile Visual"
//             className="w-32 h-32 mx-auto rounded-full shadow-md"
//           />
//           <p className="text-center text-gray-600 mt-4">Your Profile Picture</p>
//         </div>
//       </div>
//     </div>
//   );
// }



// export default function Page() {
//   return (
//     <Suspense fallback={<div>Loading User Profile...</div>}>
//       <ViewProfilePage />
//     </Suspense>
//   );
// }











































'use client';
import React, { Suspense, useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import DesktopNav from 'app/(dashboard)/DesktopNav';
import Providers from 'app/(dashboard)/providers';

const ViewProfilePage = () => {
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
    //  Use null initially
  const [error, setError] = useState<string | null>(null);; // Track errors
  const searchParams = useSearchParams();
  const profileId = searchParams?.get('email');

  useEffect(() => {
    if (!profileId) {
      setError('No profileId found in the URL');
      return;
    }

    async function fetchProfile() {
      try {
        const response = await fetch(`/api/profile?email=${profileId}`, { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          setError('Failed to fetch profile data');
        }
      } catch (err) {
        setError('An error occurred while fetching profile data');
        console.error(err);
      }
    }

    fetchProfile();
  }, [profileId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Providers>
        <DesktopNav />
      </Providers>
      <div className="grid grid-cols-12 gap-x-8">
        <div className="col-span-9 h-full">
          <Card className="shadow-lg ml-14 -mt-2 h-full flex flex-col">
            <CardHeader className="bg-white border-b-2 p-6">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                My Profile
              </CardTitle>
              <CardDescription className="pt-2 text-gray-600">
                View your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-12 flex-grow h-full">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">First Name</p>
                  <p className="text-lg text-gray-800">{profile.first_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Name</p>
                  <p className="text-lg text-gray-800">{profile.last_name || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                  <p className="text-lg text-gray-800">{profile.date_of_birth || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email Address</p>
                  <p className="text-lg text-gray-800">{profile.email || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">City</p>
                  <p className="text-lg text-gray-800">{profile.location_city || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Country</p>
                  <p className="text-lg text-gray-800">{profile.location_country || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Likes</p>
                <p className="text-lg text-gray-800">{profile.likes || 'N/A'}</p>
              </div>
              <div className="mt-10 flex">
                <button className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-gray">
                  <Pencil size={16} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3 bg-white shadow-lg p-4 rounded-lg -mt-2 h-full">
          <img
            src={profile?.profile_picture || '/placeholder-user.jpg'}
            alt="Profile Visual"
            className="w-32 h-32 mx-auto rounded-full shadow-md"
          />
          <p className="text-center text-gray-600 mt-4">Your Profile Picture</p>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading User Profile...</div>}>
      <ViewProfilePage />
    </Suspense>
  );
}
