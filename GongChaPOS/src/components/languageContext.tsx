import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextProps {
  selectedLanguage: string;
  changeLanguage: (newLanguage: string) => void;
}

const defaultValue: LanguageContextProps = {
  selectedLanguage: 'en',
  changeLanguage: () => {},
};

const LanguageContext = createContext<LanguageContextProps>(defaultValue);

interface LanguageProviderProps {
  children: ReactNode;
}

export const useLanguageContext = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

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
