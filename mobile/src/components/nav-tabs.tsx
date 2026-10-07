import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'nativewind';

import { THEME } from '@/lib/theme';

export default function AppTabs() {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.muted}
      labelStyle={{ selected: { color: colors.foreground } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Timer</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
  sf={{ default: 'timer', selected: 'timer' }}
  md="timer"
/>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
  sf={{ default: 'list.bullet', selected: 'list.bullet' }}
  md="list"
/>
      </NativeTabs.Trigger>

       <NativeTabs.Trigger name="insights">
        <NativeTabs.Trigger.Label>Insights</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
  sf={{ default: 'chart.bar.xaxis', selected: 'chart.bar.xaxis' }}
  md="bar_chart"
/>
      </NativeTabs.Trigger>

       <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
  sf={{ default: 'person', selected: 'person' }}
  md="person"
/>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
