import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Khởi tạo điều hướng bằng hook để tránh lỗi undefined [cite: 22]
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
               <Ionicons name="barbell" size={40} color="black" />
            </View>
            <Text style={styles.title}>Fitup</Text>
            <Text style={styles.subtitle}>Your daily progress starts here.</Text>
          </View>

          {/* Form Login Card */}
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Nút Log In màu cam đất chuẩn thiết kế */}
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>

          {/* Social Login */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Ionicons name="logo-google" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Footer Navigation */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Create an account</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Become A Trainer? </Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Join us now</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By continuing, you agree to our {'\n'}
            <Text style={styles.orangeLink}>Terms</Text> & <Text style={styles.orangeLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  inner: { padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 20 },
  logoContainer: { 
    backgroundColor: '#FF9500', 
    padding: 10, 
    borderRadius: 14,
    marginBottom: 16 
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  subtitle: { fontSize: 16, color: '#999', marginTop: 8 },
  card: { 
    backgroundColor: '#1E1E1E', 
    padding: 20, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: '#333' 
  },
  inputGroup: { marginBottom: 16 },
  label: { color: '#FFF', marginBottom: 8, fontSize: 14 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 54,
    borderWidth: 1,
    borderColor: '#444'
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  forgotText: { color: '#999', textAlign: 'right', marginTop: 10 },
  loginButton: {
    backgroundColor: '#A65E1F',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24
  },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#333' },
  dividerText: { color: '#666', marginHorizontal: 12 },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  googleButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: { color: '#999', fontSize: 15 },
  linkText: { color: '#FF9500', fontWeight: 'bold', fontSize: 15 },
  orangeLink: { color: '#FF9500' },
  termsText: { color: '#666', textAlign: 'center', marginTop: 32, fontSize: 12, lineHeight: 18 }
});