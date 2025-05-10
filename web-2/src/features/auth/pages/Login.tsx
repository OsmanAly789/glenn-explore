import { Box, Button, Card, CardContent, TextField, Typography, Alert } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router';
import { useState } from 'react';

export const LoginPage = () => {
  const { user, requestOtp, verifyOtp, resendOtp, otpRequested, isLoading, error, currentEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestOtp(email);
    } catch (err) {
      console.error('Failed to request OTP:', err);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp(otp);
      navigate('/craft/game');
    } catch (err) {
      console.error('Failed to verify OTP:', err);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp();
    } catch (err) {
      console.error('Failed to resend OTP:', err);
    }
  };

  if(user) {
    return <Navigate to="/craft/game" replace />;
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom textAlign="center">
            {otpRequested ? 'Enter OTP' : 'Login'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          {otpRequested ? (
            <Box component="form" onSubmit={handleVerifyOtp} sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Enter the OTP sent to {currentEmail}
              </Typography>
              <TextField
                fullWidth
                label="OTP Code"
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button
                fullWidth
                size="large"
                onClick={handleResendOtp}
                sx={{ mt: 1 }}
                disabled={isLoading}
              >
                Resend OTP
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRequestOtp} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
