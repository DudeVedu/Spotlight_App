import { Redirect } from "expo-router";
import React from "react";

//This is the next file that runs
//Here we redirect the user to the (tabs) folder
export default function Index(){
  return <Redirect href="./(auth)/login"/>;
  
}