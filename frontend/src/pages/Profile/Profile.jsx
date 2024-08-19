import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Avatar from "./components/Avatar";
import homme from "./components/img/Avatar-Homme.png";
import femme from "./components/img/Avatar-Femme.png";

export default function Profile() {
  const { user } = useContext(UserContext);
  return (
    <div className="d-flex flex-column flex-fill center">
      {user.genre === "homme" ? (
        <div>
          <Avatar src={homme} name={user.username} size={100} />
        </div>
      ) : (
        <div>
          <Avatar src={femme} name={user.username} size={100} />
        </div>
      )}
      <p>{user.username}</p>
    </div>
  );
}
