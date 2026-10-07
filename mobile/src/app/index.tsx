import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl font-bold text-foreground">
            Deep Work Time
          </Text>
          <Button className="mt-4">
            <Text className="text-center inline-flex items-center justify-center">Start Deep Work</Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
