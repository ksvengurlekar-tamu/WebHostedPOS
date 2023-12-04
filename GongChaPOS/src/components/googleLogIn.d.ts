interface GoogleLogInProps {
    onSignIn: (googleUser: string) => void;
}

declare const GoogleLogIn: React.FC<GoogleLogInProps>;
export default GoogleLogIn;