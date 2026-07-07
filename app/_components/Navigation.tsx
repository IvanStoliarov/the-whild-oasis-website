import { Suspense } from 'react';
import NavigationMenu from './NavigationMenu';
import AccountAvatar from './AccountAvatar';
import AccountAvatarPlaceholder from './AccountAvatarPlaceholder';

export default async function Navigation() {
  return (
    <NavigationMenu>
      <Suspense fallback={<AccountAvatarPlaceholder />}>
        <AccountAvatar />
      </Suspense>
    </NavigationMenu>
  );
}
