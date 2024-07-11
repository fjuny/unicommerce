// Logout.js
import { useHistory } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();

  const handleLogout = () => {
    // Remove the user's authentication token or session information
    localStorage.removeItem('authToken');
    // Redirect the user to the login page
    history.push('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;