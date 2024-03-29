import { useRouter } from 'next/router';
import { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // Perform your login logic here, for example, sending a request to your backend
    // Assume loginSuccess is a boolean indicating whether login was successful or not
    const loginSuccess = true; // Replace with your actual login logic

    if (loginSuccess) {
      // Redirect to the appropriate page after successful login
      router.push('/page'); // Replace '/page' with the path you want to redirect to
    } else {
      // Handle failed login, show error message, etc.
    }
  };

  return (
    <div>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
