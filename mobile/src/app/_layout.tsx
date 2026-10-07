import { ThemeProvider } from 'expo-router/react-navigation';
import { useColorScheme } from 'nativewind';
import { PortalHost } from '@rn-primitives/portal';

import NavTabs from '@/components/nav-tabs';
import { NAV_THEME } from '@/lib/theme';
import '@/global.css';


export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  return (
    <ThemeProvider value={NAV_THEME[colorScheme === 'dark' ? 'dark' : 'light']}>
      <NavTabs />
      <PortalHost />
    </ThemeProvider>
  );
}
