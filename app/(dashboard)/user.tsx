// import { Button } from '@/components/ui/button';
// import { auth, signOut } from '@/lib/auth';
// import Image from 'next/image';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from '@/components/ui/dropdown-menu';
// import Link from 'next/link';

// export async function User() {
//   let session = await auth();
//   let user = session?.user;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           size="icon"
//           className="overflow-hidden rounded-full"
//         >
//           <Image
//             src={user?.image ?? '/placeholder-user.jpg'}
//             width={36}
//             height={36}
//             alt="Avatar"
//             className="overflow-hidden rounded-full"
//           />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuLabel>My Account</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         {user && (
//           <DropdownMenuItem>
//             <Link href="/userProfile">My Profile</Link>
//           </DropdownMenuItem>
//         )}
//         <DropdownMenuItem>Settings</DropdownMenuItem>
//         <DropdownMenuItem>Support</DropdownMenuItem>
//         <DropdownMenuSeparator />
//         {user ? (
//           <DropdownMenuItem>
//             <form
//               action={async () => {
//                 'use server';
//                 await signOut();
//               }}
//             >
//               <button type="submit">Sign Out</button>
//             </form>
//           </DropdownMenuItem>
//         ) : (
//           <>
//           <DropdownMenuItem>
//             <Link href="/login">Log In</Link>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//           <Link href="/signup">Sign Up</Link>
//         </DropdownMenuItem>
//         </>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
















































import { Button } from '@/components/ui/button';
import { auth, signOut } from '@/lib/auth';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { db, userProfiles } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { type InferSelectModel } from 'drizzle-orm';
export type UserProfile = InferSelectModel<typeof userProfiles>;

export async function User() {
  let session = await auth();
  let user = session?.user;

  let userResult: UserProfile[] = [];
  if (user?.email) {
    try {
      userResult = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.email, user.email))
        .limit(1);

    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  let userProfile = userResult.length > 0 ? userResult[0] : null;
  

  if (user) {
    if (userProfile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Image
                src={user?.image ?? '/placeholder-user.jpg'}
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            <Link href={`/userProfileDisplay?email=${user.email}`}>View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <form
                action={async () => {
                  'use server';
                  await signOut();
                }}
              >
                <button type="submit">Sign Out</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <Image
                src={user?.image ?? '/placeholder-user.jpg'}
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/userProfile">Complete Your Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <form
                action={async () => {
                  'use server';
                  await signOut();
                }}
              >
                <button type="submit">Sign Out</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src="/placeholder-user.jpg"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Welcome</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/login">Log In</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/signup">Sign Up</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
