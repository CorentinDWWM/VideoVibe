import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

export default function Logout() {
  const { logoutConnetedUser } = useContext(UserContext);
  useEffect(() => {
    logoutConnetedUser();
  }, []);
  return (
    <div>
      <h2>Déconnexion en cours ...</h2>
    </div>
  );
}
