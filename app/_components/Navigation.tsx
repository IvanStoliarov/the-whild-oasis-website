import { auth } from '../_lib/auth';
import NavigationMenu from './NavigationMenu';

export default async function Navigation() {
  const session = await auth();

  return (
    <NavigationMenu
      userImage={session?.user?.image}
      userName={session?.user?.name}
    />
  );
}
