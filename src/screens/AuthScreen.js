import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL } from "../constants/appConstants";
import { useSettings } from "../context/SettingsContext";

const authText = {
  en: {
    appName: "Store Manager",
    subtitle: "Manage orders, products, customers and reports",

    login: "Login",
    register: "Register",
    createAccount: "Create Account",

    loginDescription: "Welcome back. Please login to continue.",
    registerDescription:
      "Create a new account using your name, email and password.",

    name: "Name",
    email: "Email",
    password: "Password",

    noAccount: "Don't have an account? Register",
    haveAccount: "Already have an account? Login",

    warning: "Warning",
    enterEmail: "Please enter your email",
    enterPassword: "Please enter your password",
    enterName: "Please enter your name",
    passwordLength: "Password must be at least 6 characters",

    loginFailed: "Login Failed",
    registrationFailed: "Registration Failed",
    somethingWrong: "Something went wrong",
    emailExists: "This email already exists. Please login instead.",
    userNotFound: "User not found. Please check the email or create an account.",

    english: "English",
    arabic: "Arabic",
    hebrew: "Hebrew",
  },

  ar: {
    appName: "مدير المتجر",
    subtitle: "إدارة الطلبات والمنتجات والزبائن والتقارير",

    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    createAccount: "إنشاء حساب",

    loginDescription: "أهلًا بعودتك، قم بتسجيل الدخول للمتابعة.",
    registerDescription:
      "أنشئ حسابًا جديدًا باستخدام الاسم والإيميل وكلمة المرور.",

    name: "الاسم",
    email: "الإيميل",
    password: "كلمة المرور",

    noAccount: "ليس لديك حساب؟ إنشاء حساب",
    haveAccount: "لديك حساب بالفعل؟ تسجيل الدخول",

    warning: "تنبيه",
    enterEmail: "الرجاء إدخال الإيميل",
    enterPassword: "الرجاء إدخال كلمة المرور",
    enterName: "الرجاء إدخال الاسم",
    passwordLength: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",

    loginFailed: "فشل تسجيل الدخول",
    registrationFailed: "فشل إنشاء الحساب",
    somethingWrong: "حدث خطأ ما",
    emailExists: "هذا الإيميل موجود بالفعل، جرّب تسجيل الدخول بدل إنشاء حساب.",
    userNotFound: "المستخدم غير موجود، تأكد من الإيميل أو أنشئ حسابًا جديدًا.",

    english: "إنجليزي",
    arabic: "عربي",
    hebrew: "عبري",
  },

  he: {
    appName: "מנהל החנות",
    subtitle: "ניהול הזמנות, מוצרים, לקוחות ודוחות",

    login: "התחברות",
    register: "הרשמה",
    createAccount: "יצירת חשבון",

    loginDescription: "ברוך שובך, התחבר כדי להמשיך.",
    registerDescription: "צור חשבון חדש באמצעות שם, אימייל וסיסמה.",

    name: "שם",
    email: "אימייל",
    password: "סיסמה",

    noAccount: "אין לך חשבון? הירשם",
    haveAccount: "כבר יש לך חשבון? התחבר",

    warning: "אזהרה",
    enterEmail: "נא להזין אימייל",
    enterPassword: "נא להזין סיסמה",
    enterName: "נא להזין שם",
    passwordLength: "הסיסמה חייבת להיות לפחות 6 תווים",

    loginFailed: "ההתחברות נכשלה",
    registrationFailed: "ההרשמה נכשלה",
    somethingWrong: "משהו השתבש",
    emailExists: "האימייל כבר קיים. נא להתחבר במקום להירשם.",
    userNotFound: "המשתמש לא נמצא. בדוק את האימייל או צור חשבון חדש.",

    english: "אנגלית",
    arabic: "ערבית",
    hebrew: "עברית",
  },
};

export default function AuthScreen({ onLogin }) {
  const { settings, updateSettings, isRTL, theme } = useSettings();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";
  const currentLanguage = settings?.language || "en";

  function tr(key) {
    return authText[currentLanguage]?.[key] || authText.en[key] || key;
  }

  function normalizeEmail(value) {
    return String(value || "").trim().toLowerCase();
  }

  async function changeLanguage(language) {
    await updateSettings({
      ...settings,
      language,
    });
  }

  async function handleSubmit() {
    Keyboard.dismiss();

    const cleanName = name.trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      Alert.alert(tr("warning"), tr("enterEmail"));
      return;
    }

    if (!cleanPassword) {
      Alert.alert(tr("warning"), tr("enterPassword"));
      return;
    }

    if (!isLogin && !cleanName) {
      Alert.alert(tr("warning"), tr("enterName"));
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert(tr("warning"), tr("passwordLength"));
      return;
    }

    try {
      setLoading(true);

      const endpoint = isLogin
        ? `${API_BASE_URL}/auth/login`
        : `${API_BASE_URL}/auth/register`;

      const payload = isLogin
        ? {
            email: cleanEmail,
            password: cleanPassword,
          }
        : {
            name: cleanName,
            fullName: cleanName,
            email: cleanEmail,
            password: cleanPassword,
          };

      console.log("AUTH ENDPOINT:", endpoint);
      console.log("AUTH PAYLOAD:", {
        ...payload,
        password: "******",
      });

      const response = await axios.post(endpoint, payload);

      const data = response.data;

      const token =
        data?.token ||
        data?.accessToken ||
        data?.data?.token ||
        data?.data?.accessToken ||
        "";

      const userFromApi =
        data?.user ||
        data?.data?.user ||
        data?.savedUser ||
        data?.newUser ||
        data;

      const userData = {
        id: userFromApi?._id || userFromApi?.id || "",
        name: userFromApi?.name || userFromApi?.fullName || cleanName,
        fullName: userFromApi?.fullName || userFromApi?.name || cleanName,
        email: userFromApi?.email || cleanEmail,
        role: userFromApi?.role || "customer",
        token,
      };

      if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        await AsyncStorage.setItem("authToken", token);
      }

      await AsyncStorage.setItem("currentUser", JSON.stringify(userData));

      onLogin(userData);
    } catch (error) {
      console.log("AUTH ERROR DATA:", error?.response?.data);
      console.log("AUTH ERROR MESSAGE:", error?.message);
      console.log("AUTH ERROR URL:", error?.config?.url);

      const serverMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        tr("somethingWrong");

      const lowerMessage = String(serverMessage).toLowerCase();

      let finalMessage = serverMessage;

      if (lowerMessage.includes("email already exists")) {
        finalMessage = tr("emailExists");
      }

      if (lowerMessage.includes("user not found")) {
        finalMessage = tr("userNotFound");
      }

      Alert.alert(
        isLogin ? tr("loginFailed") : tr("registrationFailed"),
        finalMessage
      );
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(isLogin ? "register" : "login");
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: theme.header || "#111827" }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View
              style={[
                styles.languageRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <LanguageButton
                label="EN"
                active={currentLanguage === "en"}
                onPress={() => changeLanguage("en")}
              />

              <LanguageButton
                label="AR"
                active={currentLanguage === "ar"}
                onPress={() => changeLanguage("ar")}
              />

              <LanguageButton
                label="HE"
                active={currentLanguage === "he"}
                onPress={() => changeLanguage("he")}
              />
            </View>

            <Text
              style={[
                styles.appName,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {tr("appName")}
            </Text>

            <Text
              style={[
                styles.subtitle,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {tr("subtitle")}
            </Text>
          </View>

          <View style={styles.card}>
            <Text
              style={[
                styles.title,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {isLogin ? tr("login") : tr("createAccount")}
            </Text>

            <Text
              style={[
                styles.description,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {isLogin ? tr("loginDescription") : tr("registerDescription")}
            </Text>

            {!isLogin ? (
              <TextInput
                style={[
                  styles.input,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
                placeholder={tr("name")}
                placeholderTextColor="#777"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
              />
            ) : null}

            <TextInput
              style={[
                styles.input,
                { textAlign: isRTL ? "right" : "left" },
              ]}
              placeholder={tr("email")}
              placeholderTextColor="#777"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <TextInput
              style={[
                styles.input,
                { textAlign: isRTL ? "right" : "left" },
              ]}
              placeholder={tr("password")}
              placeholderTextColor="#777"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            <Pressable
              style={[
                styles.mainButton,
                { backgroundColor: theme.primary || "#2563EB" },
                loading && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.mainButtonText}>
                  {isLogin ? tr("login") : tr("register")}
                </Text>
              )}
            </Pressable>

            <Pressable style={styles.switchButton} onPress={switchMode}>
              <Text
                style={[
                  styles.switchText,
                  {
                    color: theme.primary || "#2563EB",
                    textAlign: "center",
                  },
                ]}
              >
                {isLogin ? tr("noAccount") : tr("haveAccount")}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

function LanguageButton({ label, active, onPress }) {
  return (
    <Pressable
      style={[
        styles.languageButton,
        active && styles.activeLanguageButton,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.languageButtonText,
          active && styles.activeLanguageButtonText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22,
  },

  header: {
    marginBottom: 28,
  },

  languageRow: {
    gap: 8,
    marginBottom: 18,
  },

  languageButton: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  activeLanguageButton: {
    backgroundColor: "#FFFFFF",
  },

  languageButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },

  activeLanguageButtonText: {
    color: "#111827",
  },

  appName: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
  },

  subtitle: {
    color: "#CBD5E1",
    fontSize: 16,
    marginTop: 10,
    lineHeight: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },

  description: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 18,
    lineHeight: 20,
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 12,
    color: "#111827",
  },

  mainButton: {
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 4,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.7,
  },

  mainButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
    textAlign: "center",
  },

  switchButton: {
    marginTop: 16,
    alignItems: "center",
  },

  switchText: {
    fontWeight: "800",
    fontSize: 14,
  },
});