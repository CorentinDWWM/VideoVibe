import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signup } from "../../apis/users";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import styles from "./Register.module.scss";

export default function Register() {
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object({
    username: yup.string().required("Le champ est obligatoire"),
    password: yup
      .string()
      .required("Le mot de passe est obligatoire")
      .min(5, "trop court")
      .max(10, "trop long"),
    confirmPassword: yup
      .string()
      .required("Vous devez confirmer votre mot de passe")
      .oneOf([yup.ref("password"), ""], "Les mots ne correspondent pas"),
    rgpd: yup
      .boolean()
      .oneOf([true], "Vous devez accepter les termes et les conditions"),
  });

  const defaultValues = {
    username: "",
    password: "",
    confirmPassword: "",
    genre: "homme",
    rgpd: false,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  async function submit(values) {
    console.log(values);
    try {
      const response = await signup(values);
      console.log(response);
      setFeedback(response.message);
      if (response.message !== "Username déjà existant") {
        reset(defaultValues);
      }
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    if (feedback !== "Username déjà existant") {
      navigate("/login");
    }
  }
  return (
    <div className="d-flex center container mt-40 mb-40">
      <form onSubmit={handleSubmit(submit)}>
        <div className="d-flex flex-column mb-10">
          <label htmlFor="username" className="mb-10">
            Pseudo
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            className="mb-10"
          />
          {errors.username && (
            <p className="text-error">{errors.username.message}</p>
          )}
        </div>
        <div className="d-flex flex-column mb-10">
          <label htmlFor="password" className="mb-10">
            Mot de passe
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            className="mb-10"
          />
          {errors.password && (
            <p className="text-error">{errors.password.message}</p>
          )}
        </div>
        <div className="d-flex flex-column mb-10">
          <label htmlFor="confirmPassword" className="mb-10">
            Confirmation de votre mot de passe
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            className="mb-10"
          />
          {errors.confirmPassword && (
            <p className="text-error">{errors.confirmPassword.message}</p>
          )}
        </div>
        <div className="d-flex flex-column mb-10">
          <label htmlFor="genre" className="mb-10">
            Genre
          </label>
          <div>
            <input
              {...register("genre")}
              type="radio"
              id="genre-homme"
              value="homme"
              className={`mb-10 ${styles.genre}`}
            />
            <label htmlFor="homme" className="mb-10">
              Homme
            </label>
          </div>
          <div>
            <input
              {...register("genre")}
              type="radio"
              id="genre-femme"
              value="femme"
              className={`mb-10 ${styles.genre}`}
            />
            <label htmlFor="femme" className="mb-10">
              Femme
            </label>
          </div>
          {errors.genre && <p className="text-error">{errors.genre}</p>}
        </div>
        <div className="d-flex flex-column mb-20">
          <div className="d-flex">
            <input {...register("rgpd")} type="checkbox" id="rgpd" />
            <label htmlFor="rgpd">
              En soutemettant ce formulaire j'accepte...
            </label>
          </div>
          {errors.rgpd && <p className="text-error">{errors.rgpd.message}</p>}
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
      {showModal && (
        <Modal onClose={handleCloseModal} feedback={feedback}>
          <button
            className="btn btn-reverse-primary"
            onClick={handleCloseModal}
          >
            X
          </button>
        </Modal>
      )}
    </div>
  );
}
