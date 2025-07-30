import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { Button, TextInput, Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../services/userServices";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/ShowToastMessages";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
     navigation.reset({
          index: 0,
          routes: [{ name: "BookList" }],
        });
    try {
      const response = await login(email, password);

      if (response.status === "error") {
        showErrorToast("Login Failed!", "Incorrect email or password!");
      } else {
        console.log("Login successful!");
        showSuccessToast(
          "Login Successful!",
          `Welcome,  ${response.data.first_name}`
        );

        await AsyncStorage.setItem("user", JSON.stringify(response.data));

        // navigation.navigate("BookList");
        navigation.reset({
          index: 0,
          routes: [{ name: "BookList" }],
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      // alert("An error occurred. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.avoidingView}
      >
        <View style={styles.formContainer}>
          <Title style={styles.title}>Login</Title>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={styles.input}
            autoCapitalize="none"
          />

          <Button
            mode="elevated"
            buttonColor="#007BFF"
            textColor="#ffffff"
            onPress={handleLogin}
            style={styles.button}
          >
            Login
          </Button>

          <View style={styles.registerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}>
                Don't have an account? Register Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    // backgroundColor: "#f5f5f5",
  },
  avoidingView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    color: "#ffffff",
    backgroundColor: "#ffffff",
    marginBottom: 10,
    width: "80%",
    alignSelf: "center",
  },
  button: {
    marginTop: 10,
    width: 200,
    alignSelf: "center",
  },
  registerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  registerLink: {
    color: "#007BFF",
    fontSize: 16,
  },
});

export default Login;
