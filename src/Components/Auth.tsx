import React, { useState } from "react";
import { Auth } from "../auth"; // Importer la classe Auth

const AuthComponent: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const handleConnect = async () => {
    try {
      const auth = new Auth();
      await auth.init();
      const user = await auth.getUserInfo();
      setUserInfo(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = new Auth();
      await auth.logout();
      setUserInfo(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={handleConnect}>Se connecter avec Web3Auth</button>
      ) : (
        <div>
          <p>Bienvenue, {userInfo?.name}</p>
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      )}
    </div>
  );
};

export default AuthComponent;
