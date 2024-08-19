import React from "react";
import styles from "./Avatar.module.scss"; // Importez des styles si nécessaire

const getInitials = (name) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("");
  return initials.substring(0, 2).toUpperCase();
};

const Avatar = ({ src, name, size = 50 }) => {
  const initials = getInitials(name);

  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size / 2,
        color: "#fff",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          style={{ width: size, height: size, borderRadius: "50%" }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
