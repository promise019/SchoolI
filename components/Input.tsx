import React from 'react';
import { 
  TextInput, 
  View, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextInputProps,
  useColorScheme 
} from 'react-native';
import { Colors } from '../constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ 
  label, 
  error, 
  containerStyle, 
  ...props 
}: InputProps) {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.secondaryText }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#FFFFFF', 
            color: colors.text,
            borderColor: error ? colors.error : colors.border
          }
        ]}
        placeholderTextColor={colors.secondaryText}
        {...props}
      />
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  input: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
});
