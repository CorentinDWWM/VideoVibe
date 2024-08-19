import { NavLink } from "react-router-dom";
import styles from "./HeaderMobile.module.scss";
import { UserContext } from "../../../context/UserContext";
import { useContext } from "react";

export default function HeaderMobile() {
  const { user } = useContext(UserContext);
  return (
    <ul className={`p-20 ${styles.container}`}>
      {user ? (
        <>
          <NavLink
            style={{ width: "100px", textAlign: "center" }}
            className="btn btn-primary fz-16"
            to="profile"
          >
            <span>Profile</span>
          </NavLink>
          <NavLink
            style={{
              margin: "0",
              marginTop: "10px",
              width: "100px",
              textAlign: "center",
            }}
            className="btn btn-primary fz-16"
            to="logout"
          >
            <span>Logout</span>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink
            style={{ width: "100px", textAlign: "center" }}
            className="btn btn-primary fz-16"
            to="register"
          >
            <span>Register</span>
          </NavLink>
          <NavLink
            style={{
              margin: "0",
              marginTop: "10px",
              width: "100px",
              textAlign: "center",
            }}
            className="btn btn-primary fz-16"
            to="login"
          >
            <span>Login</span>
          </NavLink>
        </>
      )}
      {/* <NavLink
        style={{ width: "80px" }}
        className="btn btn-primary fz-16"
        to="profile"
      >
        Profile
      </NavLink>
      <NavLink
        style={{
          margin: "0",
          marginTop: "10px",
          width: "80px",
          textAlign: "center",
        }}
        className="btn btn-primary fz-16"
        to="login"
      >
        <span>Login</span>
      </NavLink> */}
    </ul>
  );
}
