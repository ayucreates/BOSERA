import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { googleLogin } from '../../store/slices/authSlice';

const GoogleSignInButton = ({ text = 'signin_with' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        toast.error('Google sign in failed');
        return;
      }

      await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      toast.success('Signed in successfully');
      navigate(redirect);
    } catch (error) {
      toast.error(error || 'Google sign in failed');
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google sign in failed')}
        text={text}
        shape="pill"
        size="large"
        width="320"
      />
    </div>
  );
};

export default GoogleSignInButton;
