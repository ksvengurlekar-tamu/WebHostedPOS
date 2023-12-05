import React, { createContext, useContext, useState, ReactNode } from 'react';
/**
 * The properties of the LanguageContext.
 */
interface LanguageContextProps {
  /**
   * The currently selected language.
   */
  selectedLanguage: string;
  /**
   * Function to change the selected language.
   *
   * @param {string} newLanguage - The new language to set.
   */
  changeLanguage: (newLanguage: string) => void;
}

/**
 * Default values for the LanguageContext.
 */
const defaultValue: LanguageContextProps = {
  selectedLanguage: 'en',
  changeLanguage: () => {},
};


/**
 * Context to provide language-related information and functionality.
 *
 * This context is used to manage and share the selected language state
 * across components in the application.
 */
const LanguageContext = createContext<LanguageContextProps>(defaultValue);

/**
 * The properties of the LanguageProvider.
 */
interface LanguageProviderProps {
  /**
   * The children components to be wrapped by the LanguageProvider.
   */
  children: ReactNode;
}

/**
 * Hook to access the LanguageContext values.
 *
 * @returns {LanguageContextProps} The values of the LanguageContext.
 */
export const useLanguageContext = () => useContext(LanguageContext);
/**
 * LanguageProvider Component
 *
 * A provider component that wraps the application and provides language-related context and functionality.
 *
 * @component
 *
 * @param {Object} props - The properties of the LanguageProvider component.
 * @param {ReactNode} props.children - The children components to be wrapped by the LanguageProvider.
 *
 * @returns {JSX.Element} The rendered LanguageProvider component.
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  /**
   * State to store the currently selected language.
   *
   * @type {string}
   */
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  /**
   * Function to change the selected language.
   *
   * @param {string} newLanguage - The new language to set.
   */
  const changeLanguage = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
