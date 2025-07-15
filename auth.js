import { 
    auth, 
    database, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
    ref, 
    set, 
    get, 
    update 
} from './firebase.js';

/**
 * Registers a new user with email/password and saves their profile data
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {object} userData - User profile data
 * @returns {Promise<User>} Firebase user object
 */
export const signUpUser = async (email, password, userData) => {
    try {
        console.log('Attempting to create user with email:', email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Complete user profile structure
        const userProfile = {
            personalInfo: {
                name: userData.name,
                fatherName: userData.fatherName || '',
                email: user.email,
                contact: userData.contact || '',
                age: userData.age || '',
                gender: userData.gender || '',
                cnic: userData.cnic || ''
            },
            address: {
                street: userData.street || '',
                city: userData.city || '',
                state: userData.state || '',
                zip: userData.zip || '',
                country: userData.country || ''
            },
            accountInfo: {
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                isActive: true,
                emailVerified: false
            }
        };

        console.log('Saving user profile for:', user.uid);
        await set(ref(database, 'users/' + user.uid), userProfile);
        return user;
    } catch (error) {
        console.error('Signup error:', error.code, error.message);
        throw error;
    }
};

/**
 * Logs in a user and updates their last login time
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<User>} Firebase user object
 */
export const logInUser = async (email, password) => {
    try {
        console.log('Attempting login for:', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await update(ref(database, `users/${user.uid}/accountInfo`), {
            lastLogin: new Date().toISOString()
        });
        
        return user;
    } catch (error) {
        console.error('Login error:', error.code, error.message);
        throw error;
    }
};

/**
 * Logs out the current user
 * @returns {Promise<void>}
 */
export const logOutUser = async () => {
    try {
        console.log('Attempting user logout');
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error.code, error.message);
        throw error;
    }
};

/**
 * Sets up an auth state change listener
 * @param {function} callback - Callback function to execute on auth state changes
 * @returns {function} Unsubscribe function
 */
export const checkAuthState = (callback) => {
    return onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user ? user.uid : 'No user');
        callback(user);
    });
};

/**
 * Retrieves complete user data from database
 * @param {string} userId - Firebase user ID
 * @returns {Promise<object|null>} User data object or null if not found
 */
export const getUserData = async (userId) => {
    try {
        console.log('Fetching user data for:', userId);
        const snapshot = await get(ref(database, `users/${userId}`));
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error('Get user data error:', error.code, error.message);
        throw error;
    }
};

/**
 * Updates multiple fields in user profile
 * @param {string} userId - Firebase user ID
 * @param {object} newData - Object containing updated data
 * @returns {Promise<void>}
 */
export const updateUserData = async (userId, newData) => {
    try {
        console.log('Updating user data for:', userId);
        const currentData = await getUserData(userId);
        
        const updatedData = {
            personalInfo: {
                ...currentData.personalInfo,
                ...(newData.personalInfo || {})
            },
            address: {
                ...currentData.address,
                ...(newData.address || {})
            },
            accountInfo: {
                ...currentData.accountInfo,
                updatedAt: new Date().toISOString()
            }
        };
        
        await update(ref(database, `users/${userId}`), updatedData);
    } catch (error) {
        console.error('Update user data error:', error.code, error.message);
        throw error;
    }
};

/**
 * Updates a specific field in the user's profile
 * @param {string} userId - Firebase user ID
 * @param {string} fieldPath - Path to field (e.g., 'personalInfo/name')
 * @param {any} value - New value for the field
 * @returns {Promise<void>}
 */
export const updateUserField = async (userId, fieldPath, value) => {
    try {
        console.log(`Updating field ${fieldPath} for user:`, userId);
        await update(ref(database, `users/${userId}/${fieldPath}`), value);
    } catch (error) {
        console.error('Update field error:', error.code, error.message);
        throw error;
    }
};

/**
 * Updates the email verification status in the user's profile
 * @param {string} userId - Firebase user ID
 * @param {boolean} status - Verification status
 * @returns {Promise<void>}
 */
export const updateEmailVerification = async (userId, status) => {
    try {
        console.log(`Updating email verification status to ${status} for user:`, userId);
        await update(ref(database, `users/${userId}/accountInfo`), {
            emailVerified: status,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Update email verification error:', error.code, error.message);
        throw error;
    }
};