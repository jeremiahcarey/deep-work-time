import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <View className="w-full max-w-[800px] self-center items-center px-6 py-16">
          <Text className="text-center text-[32px] font-semibold leading-[44px] text-foreground">
            No sessions yet.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
