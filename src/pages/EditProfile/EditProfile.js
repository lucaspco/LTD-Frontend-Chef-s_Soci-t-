import "./EditProfile.css";
// utilizaremos para a atualização do usuário
import { uploads } from "../../utils/config";
// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// Redux
// aqui vamos importar a nossa função profile, criada anteriormente.
import { profile, updateProfile, resetMessage } from "../../slices/userSlice";
// Components
import Message from "../../components/Message";
const EditProfile = () => {
  // dispatch para poder executar as funções do redux.
  const dispatch = useDispatch();
  // Para obter os estados que temos no userSlice.js.
  // a variável user terá os dados do usuário.
  const { user, message, error, loading } = useSelector((state) => state.user);
  // estados utilizados para o preencher o formulário do usuário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  // Load user data. Carregar os dados do usuario. Executado sempre que houver um dispatch
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);
  
  // Efetivamente preenche o formulário. sempre que houver mudança do usuário atualiza.
  useEffect(() => {
    // Preenhcerá o formulário.
    if (user) {
      console.log ("EditProfile.js - Vou preencher o formulario.")
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  console.log ("EditProfile.js - Dados do usuário: " , user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gather user data from states
    const userData = {
      name,
    };
    if (profileImage) {
      userData.profileImage = profileImage;
    }
    if (bio) {
      userData.bio = bio;
    }
    if (password) {
      userData.password = password;
    }
    // Construir o form data.
    const formData = new FormData(); // novo objeto
    // Looping em todas as chaves que serão enviadas, pode ser senha e nome mas pode ser 4 itens com imagem e bio
    const userFormData = Object.keys(userData).forEach((key) =>
      formData.append(key, userData[key])
    );
    formData.append("user", userFormData);
    await dispatch(updateProfile(formData));
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  // utilizada para Exibir Imagem Preview
  const handleFile = (e) => {
    // Vamos recuperar a imagem e guardar em uma variável.
    const image = e.target.files[0];
    setPreviewImage(image);
    // change image state
    setProfileImage(image);
  };
  return (
    <div id="edit-profile">
      <h2>Edite seus dados</h2>
      <p className="subtitle">
        Adicione uma imagem de perfil, e conte mais um pouco sobre você...
      </p>
      {/* Vamos executar um código dinamico. Já aplicado o css correto - className="profile-image"
      Se o usuário tem uma imagem e a variável previewImagem esta preenchida etnão buscará a imagem no backend.*/}
      {(user.profileImage || previewImage) && (
        <img
          className="profile-image"
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : `${uploads}/users/${user.profileImage}`
          }
          alt={user.name}
        />
      )}
      <form onSubmit={handleSubmit}>
        <label>
        <span>Nome:</span>
        <input
          type="text"
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
          value={name || ""}
        />
        </label>
        <label>
        <span>Email:</span>
        <input type="email" placeholder="E-mail" disabled value={email || ""} />
        </label>
        <label>
          <span>Imagem de Perfil:</span>
          <input type="file" onChange={handleFile} />
        </label>
        <label>
          <span>Fale sobre você e lugares que já trabalhou:</span>
          <input
            type="text"
            placeholder="Descrição do perfil"
            onChange={(e) => setBio(e.target.value)}
            value={bio || ""}
          />
        </label>
        <label>
          <span>Quer alterar sua senha?</span>
          <input
            type="password"
            placeholder="Digite sua nova senha..."
            onChange={(e) => setPassword(e.target.value)}
            value={password || ""}
          />
        </label>
        
        {!loading && <input type="submit" value="Atualizar" />}
        {loading && <input type="submit" disabled value="Aguarde..." />}
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </form>
    </div>
  );
};
export default EditProfile;
