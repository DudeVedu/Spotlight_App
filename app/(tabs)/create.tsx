import { COLORS } from '@/constants/theme';
import { styles } from '@/styles/create.styles';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateScreen(){
  const router = useRouter();//After creating a post, we redirect the user to home page
  const { user } = useUser();
  
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const pickImage = async () =>{
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1,1],
      quality: 0.8,
    });

    if(!result.canceled) setSelectedImage(result.assets[0].uri);
  }

  console.log(selectedImage);

  if(!selectedImage){
    return(
    <View style={styles.container}> 
      <View style={styles.header}>
        <TouchableOpacity onPress = {() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={COLORS.primary}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <View style={{width:28}}/>
      </View>

      <TouchableOpacity style={styles.emptyImageContainer} onPress={pickImage}>
        <Ionicons name="image-outline" size={48} color={COLORS.grey}/>
        <Text style={styles.emptyImageText}>Tap to select an image</Text>
      </TouchableOpacity>
    </View>
    );
  }

  return(  
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style= {styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >

        <View style ={styles.contentContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() =>{
              setSelectedImage(null);
              setCaption("");
            }}
            disabled = {isSharing}
            >
               <Ionicons name="close-outline" size={28} color={isSharing?COLORS.grey:COLORS.white}/> 
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New post</Text>
          
            <TouchableOpacity
              style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
              disabled={isSharing || !selectedImage}
            >
              {isSharing ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : ( 
                <Text style={styles.shareText}>Share</Text>
              )}
            </TouchableOpacity> 
          </View>

          <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          contentOffset={{ x: 0, y: 100 }}
          >
          <View style={[styles.content, isSharing && styles.contentDisabled]}>
            {/* IMAGE SECTION */}
            <View style={styles.imageSection}>
              <Image
                source={selectedImage}
                style={styles.previewImage}
                contentFit="cover"
                transition={200}
              />
              <TouchableOpacity onPress={ }>
                <Ionicons name="image-outline" size={28} />

              </TouchableOpacity>
            </View>

            {/* INPUT SECTION */}
            <View style={styles.inputSection}>
              <View style={styles.captionContainer}>
                <Image
                  source={user?.imageUrl}
                  style={styles.userAvatar}
                  contentFit="cover"
                  transition={200}
                />
                <TextInput
                  style={styles.captionInput}
                  placeholder="Write a caption..."
                  placeholderTextColor={COLORS.grey}
                  multiline
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isSharing}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        </View>
    </KeyboardAvoidingView>  
  );
}