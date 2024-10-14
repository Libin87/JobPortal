import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function GoogleLoginComponent() {
  const handleSuccess = (response) => {
    console.log("Login Success:", response);
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId="693543230761-ptfddj3v02b2ef56e6nor0l7s0uhlm2g.apps.googleusercontent.com">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  }}>
        <GoogleLogin 
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginComponent;
