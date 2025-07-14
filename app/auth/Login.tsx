import React, { useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Veuillez remplir tous les champs",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://192.168.43.145:3000/radarbus/voyageur/login/email/${email}/mdp/${password}`
      );

      const data = await response.json();

      if (response.ok && data.status === 200) {
        Toast.show({
          type: "success",
          text1: "Connexion réussie",
          text2: "Bienvenue !",
        });
        router.replace("(tabs)"); 
      } else if (data.status === 404) {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: "Utilisateur non trouvé !",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Erreur",
          text2: data.description || "Erreur lors de la connexion",
        });
      }

    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de se connecter au serveur",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    router.push("/auth/SignUp");
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.formContainer}>
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🚌</Text>
          </View>
          <Text style={styles.appName}>Betax</Text>
          <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="votre@email.com"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#A0A0A0"
            secureTextEntry
            autoComplete="password"
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

       <TouchableOpacity onPress={handleSignup} style={styles.signupContainer}>
          <Text style={styles.signupText}>Pas encore de compte ? </Text>
          <Text style={styles.signupLink}>Créer un compte</Text>
       </TouchableOpacity>

      </View>

      <View style={styles.footer}>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: "center",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 3,
    borderColor: "#4A90E2",
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    fontWeight: "400",
    fontStyle: "italic",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34495E",
    marginBottom: 12,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#E8EBF0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    color: "#2C3E50",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 32,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 32,
    transform: [{ scale: 1 }],
  },
  loginButtonDisabled: {
    backgroundColor: "#B0BEC5",
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8EBF0",
  },
  dividerText: {
    marginHorizontal: 20,
    fontSize: 14,
    color: "#95A5A6",
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    zIndex: 10
  },
  signupText: {
    fontSize: 15,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  signupLink: {
    fontSize: 15,
    color: "#4A90E2",
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#4A90E2",
    opacity: 0.08,
    bottom: -150,
    left: -100,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#E74C3C",
    opacity: 0.06,
    bottom: -100,
    right: -50,
  },
});