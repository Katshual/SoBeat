import React from "react";
import Auth from "./Components/Auth";
import Nft from "./Components/Nft";

const App: React.FC = () => {
  return (
    <div>
      <h1>Bienvenue sur SoBeat</h1>
      <Auth />
      <Nft />
    </div>
  );
};

export default App;
