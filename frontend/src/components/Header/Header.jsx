import { useContext, useState } from "react";
import styles from "./Header.module.scss";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Avatar from "../../pages/Profile/components/Avatar";
import homme from "../../pages/Profile/components/img/Avatar-Homme.png";
import femme from "../../pages/Profile/components/img/Avatar-Femme.png";
import HeaderMobile from "./components/HeaderMobile";

function Header() {
  const { user } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);

  // console.log(user);
  return (
    <header className={`${styles.header} d-flex flex-row align-items-center`}>
      <div className="flex-fill">
        <NavLink end to="/">
          <strong style={{ color: "rgb(207, 3, 3)" }}> Video Vibe </strong>
        </NavLink>
      </div>
      <ul className={styles.headerList}>
        {user ? (
          <>
            {user.genre === "homme" ? (
              <div
                style={{
                  display: "inline-block",
                  marginRight: "10px",
                }}
              >
                <Avatar src={homme} name={user.username} size={50} />
              </div>
            ) : (
              <div
                style={{
                  display: "inline-block",
                  marginRight: "10px",
                }}
              >
                <Avatar src={femme} name={user.username} size={50} />
              </div>
            )}
            <NavLink className="mr-15" to="profile">
              <span>Profile</span>
            </NavLink>
            <NavLink className="mr-15" to="logout">
              <span>Logout</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink className="mr-15" to="register">
              <span>Register</span>
            </NavLink>
            <NavLink className="mr-15" to="login">
              <span>Login</span>
            </NavLink>
          </>
        )}
      </ul>
      <i
        onClick={() => setShowMenu(true)}
        className={`fas fa-bars mr-10 ${styles.mobileHeader}`}
      ></i>
      {showMenu && (
        <>
          <div className="calc" onClick={() => setShowMenu(false)}></div>
          <HeaderMobile setShowMenu={setShowMenu} />
        </>
      )}
    </header>
  );
}

export default Header;
