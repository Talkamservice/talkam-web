import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTikTokLoginMutation } from '../../../services/authApiSlice';
import { toast } from 'sonner';
import { ColoredLoader } from '../../../components/global/loader';

const TikTokCallbackPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { code } = useParams();

  console.log(code)

  const [tiktokLogin, { isLoading }] = useTikTokLoginMutation();

  const handleTikTokLogin = async () => {
    try {
      const { data } = await tiktokLogin({ code }).unwrap();
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.token,
        })
      );

      toast.success('Logged in successfully!');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to login');
    }
  };

  // Automatically trigger login attempt when component mounts
  React.useEffect(() => {
    handleTikTokLogin();
  }, [handleTikTokLogin]);

  return (
    <div className='flex items-center justify-center m-auto'>
      <h1>Logging you in</h1>
      <ColoredLoader />
    </div>
  );
};

export default TikTokCallbackPage;
