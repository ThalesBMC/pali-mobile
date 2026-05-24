import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, AppearanceProvider, useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const useTheme = () => {
	const { theme, setTheme } = useContext(ThemeContext);
	const isDarkMode = theme === 'dark';

	return { theme, isDarkMode, setTheme };
};

export const ThemeProvider = ({ children }) => {
	const systemPreference = useColorScheme();
	const [theme, setTheme] = useState(systemPreference);

	useEffect(() => {
		const loadTheme = async () => {
			const storedTheme = await AsyncStorage.getItem('theme');
			if (storedTheme) {
				console.log(storedTheme);
				setTheme(storedTheme);
			} else {
				console.log(systemPreference, 'theme');
				setTheme(systemPreference);
			}
		};
		loadTheme();
	}, [systemPreference]);

	useEffect(() => {
		const saveTheme = async () => {
			await AsyncStorage.setItem('theme', theme);
		};
		saveTheme();
	}, [theme]);

	const updateTheme = newTheme => {
		setTheme(newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, isDarkMode: theme === 'dark', setTheme: updateTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
