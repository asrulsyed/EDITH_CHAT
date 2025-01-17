import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { AuthError } from "@/lib/types";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

interface CodeProps {
  code: string;
}

const Code = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CodeProps>();

  const { setLogined } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  axios.defaults.headers.common['token'] = token;

  const onSubmit = async (code: CodeProps) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verify-code`,
        code
      );
      console.log("res", res);
      if (res.status === 201) {
        setLogined(true);
        navigate("/chat/text");
      } else {
        throw new AuthError(res.data.message || "Verification failed");
      }
    } catch (error) {
      if (error instanceof AuthError) {
        toast({
          variant: "destructive",
          description: error.message,
        });
      } else if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          description: error.response?.data?.message || "Invalid verification code",
        });
      } else {
        toast({
          variant: "destructive",
          description: "An unexpected error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<{ destination: string }>(token);
      const email = localStorage.getItem("EDITH_EMAIL");
      if (decoded.destination !== email) {
        navigate('/auth/login')
      }
    } else {
      navigate('/auth/login')
    }
  }, [])

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-mainBg font-Sofia text-buttonFont">
      <div className="flex items-end border-none outline-none focus:outline-none p-0 !mb-5">
        <img
          src="/EDITH_logo_png.png"
          alt="logo"
          className="h-16"
        />
      </div>

      {/* form */}
      <Box className="w-full max-w-sm p-6 space-y-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-start space-y-10"
        >
          <FormControl
            sx={{
              width: "100%",
              backgroundColor: "var(--bg-input)",
            }}
            variant="outlined"
          >
            <InputLabel
              htmlFor="outlined-adornment-code"
              sx={{
                color: "var(--font-button)",
                "&.Mui-focused": {
                  color: "var(--font-button)",
                },
              }}
            >
              Code
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-code"
              type="code"
              error={!!errors.code}
              label="Code"
              sx={{
                color: "white", // Change input text color
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--border-primary)", // Change border color
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--border-secondary)", // Optional: Change border color on hover
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--border-secondary)", // Optional: Change border color when focused
                },
              }}
              {...register("code", {
                required: "Code is required",
                pattern: {
                  value: /^[A-Za-z0-9]{6}$/,
                  message: "Code must be exactly 6 characters and contain only numbers and letters"
                }

              })}
            />
            {errors.code && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, color: "red" }}
              >
                {errors.code.message}
              </Typography>
            )}
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            className="!bg-buttonFont hover:!bg-buttonHoverBg h-10 disabled:!bg-buttonHoverBg !text-hoverFont"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                Check Code...
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </span>
            ) : (
              "Check Code"
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Code;
