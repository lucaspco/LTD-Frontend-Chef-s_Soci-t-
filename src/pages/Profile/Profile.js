import "./Profile.css";

import { uploads } from "../../utils/config";

// components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
// BsFillEyeFill - ícone de ver fotos, 
// BsPencilFill editar a foto BsPencilFill
// BsXLg - para deletar a foto
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

// hooks
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Redux
import { getUserDetails } from "../../slices/userSlice";

import {
  getUserPhotos, 
  publishPhoto,
  resetMessage,
  deletePhoto,
  updatePhoto,
} from "../../slices/photoSlice";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // obter o usuário que eu entrei no perfil dele
  const { user, loading } = useSelector((state) => state.user);
  // obter o usuário autentica 
  const { user: userAuth } = useSelector((state) => state.auth);
    // estados das fotos
    const {
      photosArray,
      loading: loadingPhoto,
      error: errorPhoto,
      message: messagePhoto,
    } = useSelector((state) => state.photo);
  
  // Load user data
  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
  }, [dispatch, id]);

  const [title, setTitle] = useState();
  const [image, setImage] = useState();

  const [editId, setEditId] = useState();
  const [editImage, setEditImage] = useState();
  const [editTitle, setEditTitle] = useState();

  // New form and edit form refs
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();
  
  // Reset component message

  function resetComponentMessage() {
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  }

  // Publish a new photo
  const submitHandle = (e) => {
    e.preventDefault();
    const photoData = {
      title,
      image,
    };
    // build form data
    const formData = new FormData();
    const photoFormData = Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );
    formData.append("photo", photoFormData);
    dispatch(publishPhoto(formData));
    setTitle("");
    resetComponentMessage();
  };

  // change image state
  const handleFile = (e) => {
    console.log("handleFile")
    console.log("handleFile")
    console.log("handleFile")
    const image = e.target.files[0];

    setImage(image);
  };

  // Exclude an image. Ativar o Slice que ativa o service feito
  const handleDelete = (id) => {
    dispatch(deletePhoto(id));
    resetComponentMessage();
  };

  // Show or hide forms
  function hideOrShowForms() {
    newPhotoForm.current.classList.toggle("hide");
    editPhotoForm.current.classList.toggle("hide");
  }

  // Show edit form
  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }

    setEditId(photo._id);
    setEditImage(photo.image);
    setEditTitle(photo.title);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    hideOrShowForms();
  };

  // Update photo title
  const handleUpdate = (e) => {
    e.preventDefault();
    const photoData = {
      title: editTitle,
      id: editId,
    };
    dispatch(updatePhoto(photoData));
    resetComponentMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }
  return (
    <div id="profile">
      <div className="profile-header">
        {/* Vamos aqui carregar a imagem do usuario.*/}
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
        )}
        {/* Carregar o nome e bio do usuario. */}
        <div className="profile-description">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      {/* Usado para usuario que quer cadastrar foto em seu perfil*/}
      {id === userAuth._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe seu trabalho:</h3>
            <form onSubmit={submitHandle}>
              <label>
                <span>Fale sobre sua criação:</span>
                <input
                  type="text"
                  placeholder="Insira um título"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input type="file" onChange={handleFile} />
              </label>
              {!loadingPhoto && <input type="submit" value="Postar" /> }
              {loadingPhoto && (
                <input type="submit" disabled value="Aguarde..." />
              )}
            </form>
          </div>
          {/* Formulario de edição da foto. Abre escondido.*/}
          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editando:</p>
            {editImage && (
              <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle || ""}
              />
              <input type="submit" value="Atualizar" />
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancelar edição
              </button>
            </form>
          </div>
          {errorPhoto && <Message msg={errorPhoto} type="error" />}
          {messagePhoto && <Message msg={messagePhoto} type="success" />}
        </>
      )} 

      {/* Visualizar fotos de qualquer perfil*/}
      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        {console.log ("photosArray: ",photosArray)}
        <div className="photos-container">
            {photosArray && photosArray.length > 0 &&
                photosArray.map((photo) => (
                  <div className="photo" key={photo._id}>
                    {photo.image && (
                      <img
                        src={`${uploads}/photos/${photo.image}`}
                        alt={photo.title}
                      />
                    )}
                    {
                      id === userAuth._id ? (
                        <div className="actions">
                        <Link to={`/photos/${photo._id}`}>
                          <BsFillEyeFill />
                        </Link>
                        <BsPencilFill onClick={() => handleEdit(photo)} />
                        {/* A Arrow function dispara o evento. */}
                        <BsXLg onClick={() => handleDelete(photo._id)} /> 
                      </div>
                    ) : (
                      <Link className="btn" to={`/photos/${photo._id}`}>
                        Ver
                      </Link>
                   )}
                </div>
            ))}
            {photosArray.length === 0 && <p>Ainda não há fotos publicadas...</p>}

        </div>
      </div> 
    </div>
  );
};

export default Profile;
