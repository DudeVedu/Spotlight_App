import InitialLayout from '@/components/InitialLayout';
import ClerkAndConvexProvider from '@/providers/ClerkAndConvexProvider';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";




// This is the first file that runs in the app
// It sets up the root layout for the app
export default function RootLayout() {
  return(
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{flex:1,backgroundColor:"black"}}>  
            
          {/* <Stack
            screenOptions={{ headerShown: true}}/>  */}
            {/* This is the main entry point for the app  */}
            <InitialLayout/>
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  )
}
