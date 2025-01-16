import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Verification = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Typography variant="h5" className="!mb-10 !text-[#E2E2E2]">
        Verify your email to continue.
      </Typography>
      <Button
        type="button"
        variant="contained"
        onClick={()=> navigate("/auth/login")}
        className="h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
      >
        Back to Login
      </Button>
    </div>
  );
};

export default Verification;
