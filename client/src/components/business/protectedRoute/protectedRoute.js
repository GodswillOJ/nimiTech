import { Navigate } from 'react-router-dom';
import { useFormSubmit } from '../../../context/formSubmitContext';

const ProtectedRoute = ({ children }) => {
  const { isSubmitted } = useFormSubmit();

  if (!isSubmitted) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
