import { 
    signUpUser, 
    logInUser, 
    logOutUser, 
    checkAuthState, 
    getUserData, 
    updateUserData 
} from './auth.js';

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Login Page
    if (document.getElementById('loginForm')) {
        const loginForm = document.getElementById('loginForm');
        const loginError = document.getElementById('loginError');
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                await logInUser(email, password);
                window.location.href = 'profile.html';
            } catch (error) {
                loginError.textContent = error.message;
                loginError.classList.remove('hidden');
            }
        });
    }
    
    // Signup Page
    if (document.getElementById('signupForm')) {
        const signupForm = document.getElementById('signupForm');
        const signupError = document.getElementById('signupError');
        
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const age = document.getElementById('signupAge').value;
            
            try {
                await signUpUser(email, password, { name, age });
                window.location.href = 'profile.html';
            } catch (error) {
                signupError.textContent = error.message;
                signupError.classList.remove('hidden');
            }
        });
    }
    
    // Profile Page
    if (document.getElementById('profileName')) {
        const profileError = document.getElementById('profileError');
        const logoutBtn = document.getElementById('logoutBtn');
        const editBtn = document.getElementById('editBtn');
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        const viewMode = document.getElementById('viewMode');
        const editForm = document.getElementById('editForm');
        
        // Check auth state
        checkAuthState(async (user) => {
            if (!user) {
                window.location.href = 'login.html';
                return;
            }
            
            try {
                const userData = await getUserData(user.uid);
                if (userData) {
                    document.getElementById('profileName').textContent = userData.name || 'Not set';
                    document.getElementById('profileEmail').textContent = user.email;
                    document.getElementById('profileAge').textContent = userData.age || 'Not set';
                    
                    // Set form values
                    document.getElementById('editName').value = userData.name || '';
                    document.getElementById('editAge').value = userData.age || '';
                }
            } catch (error) {
                profileError.textContent = error.message;
                profileError.classList.remove('hidden');
            }
        });
        
        // Logout button
        logoutBtn.addEventListener('click', async () => {
            try {
                await logOutUser();
                window.location.href = 'login.html';
            } catch (error) {
                profileError.textContent = error.message;
                profileError.classList.remove('hidden');
            }
        });
        
        // Edit button
        editBtn.addEventListener('click', () => {
            viewMode.classList.add('hidden');
            editForm.classList.remove('hidden');
        });
        
        // Cancel edit button
        cancelEditBtn.addEventListener('click', () => {
            viewMode.classList.remove('hidden');
            editForm.classList.add('hidden');
        });
        
        // Edit form submission
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('editName').value;
            const age = document.getElementById('editAge').value;
            
            try {
                const user = auth.currentUser;
                await updateUserData(user.uid, { name, age });
                
                // Update view
                document.getElementById('profileName').textContent = name || 'Not set';
                document.getElementById('profileAge').textContent = age || 'Not set';
                
                viewMode.classList.remove('hidden');
                editForm.classList.add('hidden');
            } catch (error) {
                profileError.textContent = error.message;
                profileError.classList.remove('hidden');
            }
        });
    }
});