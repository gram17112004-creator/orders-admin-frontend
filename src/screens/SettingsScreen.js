import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSettings } from "../context/SettingsContext";

export default function SettingsScreen({ currentUser, onLogout }) {
  const {
    settings,
    updateSettings,
    resetSettings,
    t,
    theme,
    isRTL,
  } = useSettings();

  const [editMode, setEditMode] = useState(false);
  const [draftSettings, setDraftSettings] = useState(settings);

  function startEdit() {
    setDraftSettings(settings);
    setEditMode(true);
  }

  function cancelEdit() {
    setDraftSettings(settings);
    setEditMode(false);
  }

  function updateDraftValue(key, value) {
    setDraftSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function getSuccessTitle(language) {
    if (language === "ar") return "تم الحفظ";
    if (language === "he") return "נשמר";
    return "Success";
  }

  function getSuccessMessage(language) {
    if (language === "ar") return "تم حفظ الإعدادات بنجاح";
    if (language === "he") return "ההגדרות נשמרו בהצלחה";
    return "Settings saved successfully";
  }

  function getResetTitle(language) {
    if (language === "ar") return "إرجاع الإعدادات";
    if (language === "he") return "איפוס הגדרות";
    return "Reset Settings";
  }

  function getResetMessage(language) {
    if (language === "ar") {
      return "هل أنت متأكد أنك تريد إرجاع الإعدادات للوضع الافتراضي؟";
    }

    if (language === "he") {
      return "האם אתה בטוח שברצונך לאפס את ההגדרות לברירת המחדל?";
    }

    return "Are you sure you want to reset settings to default?";
  }

  function getCancelText(language) {
    if (language === "ar") return "إلغاء";
    if (language === "he") return "ביטול";
    return "Cancel";
  }

  function getResetText(language) {
    if (language === "ar") return "إرجاع";
    if (language === "he") return "אפס";
    return "Reset";
  }

  async function saveSettings() {
    if (!draftSettings.appName.trim()) {
      Alert.alert("Warning", "App name is required");
      return;
    }

    await updateSettings(draftSettings);

    setEditMode(false);

    Alert.alert(
      getSuccessTitle(draftSettings.language),
      getSuccessMessage(draftSettings.language)
    );
  }

  function handleResetSettings() {
    Alert.alert(
      getResetTitle(settings.language),
      getResetMessage(settings.language),
      [
        {
          text: getCancelText(settings.language),
          style: "cancel",
        },
        {
          text: getResetText(settings.language),
          style: "destructive",
          onPress: async () => {
            await resetSettings();
            setDraftSettings(settings);
            setEditMode(false);
          },
        },
      ]
    );
  }

  function getLanguageName(language) {
    if (language === "ar") return t("arabic");
    if (language === "he") return t("hebrew");
    return t("english");
  }

  function getThemeName(themeName) {
    if (themeName === "dark") return t("dark");
    if (themeName === "green") return t("green");
    return t("blue");
  }

  const features = getFeaturesByLanguage(settings.language);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.screenContent,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={[styles.profileCard, { backgroundColor: theme.header }]}>
        <View style={[styles.avatarCircle, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>
            {(currentUser?.fullName || currentUser?.name || "S")
              .charAt(0)
              .toUpperCase()}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text
            style={[
              styles.profileName,
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {currentUser?.fullName || currentUser?.name || "Store Admin"}
          </Text>

          <Text
            style={[
              styles.profileEmail,
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {currentUser?.email || "admin@example.com"}
          </Text>
        </View>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <View
          style={[
            styles.sectionHeader,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.text,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {t("appSettings")}
          </Text>

          {!editMode ? (
            <Pressable
              style={[styles.editButton, { backgroundColor: theme.primary }]}
              onPress={startEdit}
            >
              <Text style={styles.editButtonText}>{t("edit")}</Text>
            </Pressable>
          ) : null}
        </View>

        {editMode ? (
          <>
            <EditableRow
              label={t("appName")}
              value={draftSettings.appName}
              onChangeText={(value) => updateDraftValue("appName", value)}
              isRTL={isRTL}
              theme={theme}
            />

            <Text
              style={[
                styles.inputLabel,
                {
                  color: theme.text,
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
            >
              {t("language")}
            </Text>

            <View
              style={[
                styles.optionRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <OptionButton
                label={t("english")}
                active={draftSettings.language === "en"}
                onPress={() => updateDraftValue("language", "en")}
                theme={theme}
              />

              <OptionButton
                label={t("arabic")}
                active={draftSettings.language === "ar"}
                onPress={() => updateDraftValue("language", "ar")}
                theme={theme}
              />

              <OptionButton
                label={t("hebrew")}
                active={draftSettings.language === "he"}
                onPress={() => updateDraftValue("language", "he")}
                theme={theme}
              />
            </View>

            <Text
              style={[
                styles.inputLabel,
                {
                  color: theme.text,
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
            >
              {t("currency")}
            </Text>

            <View
              style={[
                styles.optionRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <OptionButton
                label="₪"
                active={draftSettings.currency === "₪"}
                onPress={() => updateDraftValue("currency", "₪")}
                theme={theme}
              />

              <OptionButton
                label="$"
                active={draftSettings.currency === "$"}
                onPress={() => updateDraftValue("currency", "$")}
                theme={theme}
              />

              <OptionButton
                label="€"
                active={draftSettings.currency === "€"}
                onPress={() => updateDraftValue("currency", "€")}
                theme={theme}
              />
            </View>

            <Text
              style={[
                styles.inputLabel,
                {
                  color: theme.text,
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
            >
              {t("theme")}
            </Text>

            <View
              style={[
                styles.optionRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <OptionButton
                label={t("blue")}
                active={draftSettings.theme === "blue"}
                onPress={() => updateDraftValue("theme", "blue")}
                theme={theme}
              />

              <OptionButton
                label={t("dark")}
                active={draftSettings.theme === "dark"}
                onPress={() => updateDraftValue("theme", "dark")}
                theme={theme}
              />

              <OptionButton
                label={t("green")}
                active={draftSettings.theme === "green"}
                onPress={() => updateDraftValue("theme", "green")}
                theme={theme}
              />
            </View>

            <View
              style={[
                styles.editActions,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Pressable style={styles.saveButton} onPress={saveSettings}>
                <Text style={styles.actionButtonText}>{t("save")}</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={cancelEdit}>
                <Text style={styles.actionButtonText}>{t("cancel")}</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <SettingRow
              label={t("appName")}
              value={settings.appName}
              isRTL={isRTL}
              theme={theme}
            />

            <SettingRow
              label={t("language")}
              value={getLanguageName(settings.language)}
              isRTL={isRTL}
              theme={theme}
            />

            <SettingRow
              label={t("currency")}
              value={settings.currency}
              isRTL={isRTL}
              theme={theme}
            />

            <SettingRow
              label={t("theme")}
              value={getThemeName(settings.theme)}
              isRTL={isRTL}
              theme={theme}
            />
          </>
        )}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {t("account")}
        </Text>

        <SettingRow
          label={t("name")}
          value={currentUser?.fullName || currentUser?.name || "Store Admin"}
          isRTL={isRTL}
          theme={theme}
        />

        <SettingRow
          label={t("email")}
          value={currentUser?.email || "admin@example.com"}
          isRTL={isRTL}
          theme={theme}
        />

        <SettingRow
          label={t("accountType")}
          value={t("storeAdmin")}
          isRTL={isRTL}
          theme={theme}
        />

        <SettingRow
          label={t("loginStatus")}
          value={t("authenticated")}
          isRTL={isRTL}
          theme={theme}
        />
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {t("technologies")}
        </Text>

        <SettingRow
          label="Frontend"
          value="React Native Expo"
          isRTL={isRTL}
          theme={theme}
        />

        <SettingRow
          label="Backend"
          value="Node.js / Express.js"
          isRTL={isRTL}
          theme={theme}
        />

        <SettingRow
          label="Database"
          value="MongoDB"
          isRTL={isRTL}
          theme={theme}
        />

        <SettingRow
          label="API Type"
          value="REST API"
          isRTL={isRTL}
          theme={theme}
        />

        <SettingRow
          label="Authentication"
          value="Login / Register"
          isRTL={isRTL}
          theme={theme}
        />
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {t("projectFeatures")}
        </Text>

        {features.map((feature) => (
          <FeatureItem key={feature} text={feature} isRTL={isRTL} />
        ))}
      </View>

      <Pressable style={styles.resetButton} onPress={handleResetSettings}>
        <Text style={styles.resetButtonText}>{t("resetSettings")}</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>{t("logout")}</Text>
      </Pressable>
    </ScrollView>
  );
}

function getFeaturesByLanguage(language) {
  if (language === "ar") {
    return [
      "شاشة تسجيل الدخول وإنشاء الحساب",
      "إدارة الطلبات",
      "إدارة المنتجات والمخزون",
      "إدارة الزبائن",
      "تقارير المبيعات",
      "تنبيهات انخفاض ونفاد المخزون",
      "متوسط قيمة الطلب",
      "إجمالي مشتريات الزبون",
      "إنقاص المخزون تلقائيًا بعد إنشاء الطلب",
      "منع الطلب عند عدم توفر كمية كافية",
      "إعدادات تطبيق حقيقية قابلة للتعديل",
    ];
  }

  if (language === "he") {
    return [
      "מסך התחברות והרשמה",
      "ניהול הזמנות",
      "ניהול מוצרים ומלאי",
      "ניהול לקוחות",
      "דוחות מכירות",
      "התראות מלאי נמוך ואזל מהמלאי",
      "ממוצע ערך הזמנה",
      "סה״כ רכישות לקוח",
      "הפחתת מלאי אוטומטית לאחר יצירת הזמנה",
      "מניעת הזמנה כאשר אין מספיק מלאי",
      "הגדרות אפליקציה אמיתיות הניתנות לעריכה",
    ];
  }

  return [
    "Login and registration screen",
    "Orders management",
    "Products and stock tracking",
    "Customers management",
    "Sales reports",
    "Low stock and out of stock alerts",
    "Average order value",
    "Customer total purchases",
    "Automatic stock decrease after order creation",
    "Prevent order when stock is not enough",
    "Real editable application settings",
  ];
}

function SettingRow({ label, value, isRTL, theme }) {
  return (
    <View style={styles.settingRow}>
      <Text
        style={[
          styles.settingLabel,
          { textAlign: isRTL ? "right" : "left" },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.settingValue,
          {
            color: theme.text,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function EditableRow({ label, value, onChangeText, isRTL, theme }) {
  return (
    <View style={styles.inputBox}>
      <Text
        style={[
          styles.inputLabel,
          {
            color: theme.text,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          { textAlign: isRTL ? "right" : "left" },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}

function OptionButton({ label, active, onPress, theme }) {
  return (
    <Pressable
      style={[
        styles.optionButton,
        {
          backgroundColor: active ? theme.primary : "#F3F4F6",
          borderColor: active ? theme.primary : "#E5E7EB",
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.optionButtonText,
          {
            color: active ? "#FFFFFF" : "#111827",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function FeatureItem({ text, isRTL }) {
  return (
    <View
      style={[
        styles.featureItem,
        { flexDirection: isRTL ? "row-reverse" : "row" },
      ]}
    >
      <Text style={styles.featureDot}>•</Text>

      <Text
        style={[
          styles.featureText,
          { textAlign: isRTL ? "right" : "left" },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    padding: 14,
    paddingBottom: 40,
    minHeight: "100%",
  },

  profileCard: {
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  profileEmail: {
    color: "#CBD5E1",
    fontSize: 14,
    marginTop: 4,
  },

  sectionCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionHeader: {
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 14,
  },

  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 14,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  settingRow: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  settingLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },

  settingValue: {
    fontSize: 16,
    fontWeight: "900",
    marginTop: 4,
  },

  inputBox: {
    marginBottom: 12,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },

  optionRow: {
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 14,
  },

  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },

  optionButtonText: {
    fontWeight: "900",
    fontSize: 14,
  },

  editActions: {
    gap: 10,
    marginTop: 4,
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#16A34A",
    borderRadius: 14,
    paddingVertical: 14,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#6B7280",
    borderRadius: 14,
    paddingVertical: 14,
  },

  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  featureItem: {
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },

  featureDot: {
    color: "#2563EB",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
  },

  featureText: {
    flex: 1,
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },

  resetButton: {
    backgroundColor: "#F59E0B",
    borderRadius: 16,
    paddingVertical: 15,
    marginBottom: 10,
  },

  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  logoutButton: {
    backgroundColor: "#DC2626",
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 4,
  },

  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
});