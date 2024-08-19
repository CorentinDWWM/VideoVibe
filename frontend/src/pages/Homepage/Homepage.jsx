import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { UserContext } from "../../context/UserContext";
import styles from "./Homepage.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import app from "../../firebase";
import Modal from "../../components/Modal/Modal";
import Avatar from "../Profile/components/Avatar";
import homme from "../Profile/components/img/Avatar-Homme.png";
import femme from "../Profile/components/img/Avatar-Femme.png";

export default function Homepage() {
  const { user } = useContext(UserContext);
  const [feedback, setFeedback] = useState("");
  const [vid, setVid] = useState(null);
  const [vidLink, setVidLink] = useState("");
  const [vidProgress, setVidProgress] = useState(0);
  const [allVid, setAllVid] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // pour voir les vidéos

  useEffect(() => {
    vid && uploadFile(vid);
  }, [vid]);

  useEffect(() => {
    async function getVideos() {
      try {
        const response = await fetch("http://localhost:5000/api/users/videos");
        if (response.ok) {
          const VideosFromApi = await response.json();
          setAllVid(VideosFromApi);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getVideos();
  }, []);

  const uploadFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, "videos/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // console.log(snapshot);
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setVidProgress(Math.round(progress));
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setVidLink(downloadURL.toString())
        );
      }
    );
  };

  // pour ajouter une vidéo

  const schema = yup.object({
    videoUrl: yup.string().required("Vous devez ajouter un fichier"),
    title: yup.string().required("Veuillez ajouter un titre"),
    user: yup.string().required("Utilisateur non authentifié"),
  });

  const defaultValues = {
    videoUrl: "",
    title: "",
    user: user ? JSON.stringify(user) : null,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (vidLink) {
      setValue("videoUrl", vidLink);
    }
  }, [vidLink, setValue]);

  useEffect(() => {
    if (user) {
      setValue("user", JSON.stringify(user));
    }
  }, [user, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVid(file);
    }
  };

  async function submit(values) {
    if (!vidLink) {
      setFeedback("Le lien vidéo n'est pas encore prêt. Veuillez patienter.");
      setShowModal(true);
      return;
    }

    try {
      console.log(values);
      const response = await fetch(
        "http://localhost:5000/api/users/addVideos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        const newVideo = await response.json();
        // console.log(newVideo);
        setAllVid([...allVid, newVideo]);
        // console.log(allVid);
        setVid(null);
        setVidLink("");
        setVidProgress(0);
        setFeedback("Vidéo ajouté");
        reset(defaultValues);
        setShowModal(true);
      } else {
        const errorResponse = await response.json();
        setFeedback(errorResponse.message || "Une erreur s'est produite");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la vidéo:", error);
      setFeedback("Une erreur s'est produite lors de l'ajout de la vidéo");
      setShowModal(true);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  function handleLike() {}

  function handleDislike() {}

  // console.log(allVid);

  return (
    <>
      <div className={`${styles.content} mt-40 ml-15`}>
        <h1 className="mb-20">All Videos</h1>
        {allVid &&
          allVid.map((vid) => (
            <div key={vid._id} className={`${styles.box}`}>
              <div className={`${styles.container}`}>
                <video
                  src={vid.videoUrl}
                  alt="video"
                  className={`${styles.video}`}
                  controls
                />
                <div className={`${styles.infoVid}`}>
                  <p>{vid.title}</p>
                  {user ? (
                    <div className="d-flex">
                      <div className="d-flex center mr-15">
                        <i
                          onClick={handleLike}
                          className="fa-regular fa-thumbs-up"
                        ></i>
                        <p>0</p>
                      </div>
                      <div className="d-flex center">
                        <i
                          onClick={handleDislike}
                          className="fa-regular fa-thumbs-down"
                        ></i>
                        <p>0</p>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="d-flex">
                  {vid.user && vid.user.genre === "homme" ? (
                    <div
                      style={{
                        display: "inline-block",
                        marginRight: "10px",
                      }}
                    >
                      <Avatar src={homme} name={vid.user.username} size={30} />
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "inline-block",
                        marginRight: "10px",
                      }}
                    >
                      <Avatar src={femme} name={vid.user.username} size={30} />
                    </div>
                  )}
                  <p style={{ margin: "0px", marginTop: "5px" }}>
                    {vid.user.username}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="d-flex flex-column mt-40 align-items-center">
        {user ? (
          <>
            <form
              className="d-flex flex-column fixed-form"
              onSubmit={handleSubmit(submit)}
            >
              <div>
                <h2 className="mb-10">Add Video</h2>
                <input
                  type="file"
                  id="videoUrl"
                  className="mb-10"
                  accept="video/*"
                  onChange={handleFileChange}
                />
                <label htmlFor="videoUrl"></label>
              </div>
              {vidProgress > 0 ? "Uploading: " + vidProgress + "%" : ""}
              {errors.videoUrl && (
                <p className="text-error">{errors.videoUrl.message}</p>
              )}
              <div style={{ width: "100%" }}>
                <p>Titre</p>
                <input
                  {...register("title")}
                  type="text"
                  id="title"
                  className="mb-20"
                  style={{ width: "100%" }}
                />
                {errors.title && (
                  <p className="text-error">{errors.title.message}</p>
                )}
                <div style={{ width: "100%" }}>
                  <input
                    {...register("user")}
                    type="hidden"
                    id="user"
                    value={user ? JSON.stringify(user) : ""}
                    className="mb-20"
                  />
                </div>
                <button className="btn btn-primary">Submit</button>
              </div>
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
          </>
        ) : (
          <h2 className={`${styles.login_title}`}>
            Please login to add and like videos
          </h2>
        )}
      </div>
    </>
  );
}
