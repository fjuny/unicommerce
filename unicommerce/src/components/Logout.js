import { useHistory } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    history.push('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;