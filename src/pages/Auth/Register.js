import "./Auth.css";
// Components
import { Link } from "react-router-dom";
import Message from "../../components/Message";

// Hooks
import { useState, useEffect } from "react";

//Novos
import { useSelector, useDispatch } from "react-redux";
// Redux
import { register, reset } from "../../slices/authSlice";


const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
 
  //Novos
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);


  const handleSubmit = (e) => {
    console.log("Botão pressionado.  register.js");
    e.preventDefault();
    const user = {
      name,
      email,
      password,
      confirmPassword,
    };
    console.log(" register.js Dados do usuário: ",user);
    // Novos
    dispatch(register(user));
    console.log("Depois dispatch register.js")
  };
  // Novos - Para toda nova requisição zeramos os dados em novo login e os erros.
  // Clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="register">
      <h2> Chef’s Société 🥂🍽️ Register </h2>
      <p className="subtitle">Cadastre-se para ter acesso a nossa comunidade.</p>
      <form onSubmit={handleSubmit}> 
        <input type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)}
          value={name}/>
        <input type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)}
          value={email}/>
        <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)}
          value={password}/>
        <input type="password" placeholder="Confirme a senha" onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}/>
        
        {!loading && <input type="submit" value="Cadastrar" />}
        {loading && <input type="submit" disabled value="Aguarde..." />}
        {error && <Message msg={error} type="error" />}
      
      </form>
      <p>
        Já tem conta? <Link to="/login">Clique aqui</Link>
      </p>
    </div>
  )
}
export default Register