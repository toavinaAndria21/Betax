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
  Alert,
  ScrollView
} from "react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword } = formData;
    
    if (!fullName || !email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Veuillez remplir tous les champs",
      });
      return false;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Les mots de passe ne correspondent pas",
      });
      return false;
    }

    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Le mot de passe doit contenir au moins 6 caractères",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Veuillez entrer une adresse email valide",
      });
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const payload = {
      nom: formData.fullName,
      email: formData.email,
      mot_de_passe: formData.password,
      latitude: 0, 
      longitude: 0,
    };

    try {
      const response = await fetch("http://192.168.43.145:3000/radarbus/voyageur", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Compte créé avec succès !",
        });
        setTimeout(() => router.push("/auth/Login"), 2000);
      } else {
        Toast.show({
          type: "error",
          text1: data.description || "Erreur lors de la création du compte",
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Impossible de contacter le serveur",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🚌</Text>
          </View>
          <Text style={styles.appName}>Rejoignez-nous</Text>
          <Text style={styles.subtitle}>Créez votre compte Betax</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nom complet</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(value) => handleInputChange("fullName", value)}
              placeholder="Jean Dupont"
              placeholderTextColor="#A0A0A0"
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              placeholder="jean@example.com"
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
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              placeholder="••••••••"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
            <TextInput
              style={styles.input}
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange("confirmPassword", value)}
              placeholder="••••••••"
              placeholderTextColor="#A0A0A0"
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              En vous inscrivant, vous acceptez nos{" "}
              <Text style={styles.termsLink}>Conditions d'utilisation</Text>
              {" "}et notre{" "}
              <Text style={styles.termsLink}>Politique de confidentialité</Text>
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? "Création du compte..." : "Créer mon compte"}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity onPress={handleLogin} style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà un compte ? </Text>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 90,
    height: 90,
    backgroundColor: "#FFFFFF",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#27AE60",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 3,
    borderColor: "#27AE60",
  },
  logoText: {
    fontSize: 36,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2C3E50",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
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
    paddingVertical: 16,
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
  termsContainer: {
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  termsText: {
    fontSize: 13,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#27AE60",
    fontWeight: "600",
  },
  signupButton: {
    backgroundColor: "#27AE60",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#27AE60",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 32,
    zIndex:10
  },
  signupButtonDisabled: {
    backgroundColor: "#B0BEC5",
    shadowOpacity: 0.1,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
    zIndex: 10,
  },
  loginText: {
    fontSize: 15,
    color: "#7F8C8D",
    fontWeight: "500",
  },
  loginLink: {
    fontSize: 15,
    color: "#27AE60",
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    overflow: "hidden",
    pointerEvents: "none"
  },
  decorativeCircle1: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#27AE60",
    opacity: 0.08,
    bottom: -125,
    left: -75,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#E74C3C",
    opacity: 0.06,
    bottom: -90,
    right: -40,
  },
  decorativeCircle3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F39C12",
    opacity: 0.05,
    bottom: -60,
    left: "50%",
    marginLeft: -60,
  },
});