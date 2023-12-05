/**
 * GoogleLogInProps Interface
 *
 * Interface defining the props for the GoogleLogIn component.
 *
 * @interface
 *
 * @property {(googleUser: string) => void} onSignIn - Callback function triggered when a user successfully signs in with Google.
 * @param {string} googleUser - The Google user information.
 */
interface GoogleLogInProps {
    onSignIn: (googleUser: string) => void;
}

/**
 * GoogleLogIn Component
 *
 * A reusable component for handling Google sign-in.
 *
 * @component
 *
 * @param {GoogleLogInProps} props - The properties of the GoogleLogIn component.
 * @param {Function} props.onSignIn - Callback function triggered when a user successfully signs in with Google.
 *
 * @returns {JSX.Element} The rendered GoogleLogIn component.
 */
declare const GoogleLogIn: React.FC<GoogleLogInProps>;
export default GoogleLogIn;
