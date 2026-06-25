import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = 'http://localhost:4000';


const VerifyPaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        const verifyPayment = async () => {
            const params = new URLSearchParams(location.search || "");
            const sessionId = params.get('session_id');

            if(location.pathname === '/appointment/cancel'){
                if(!cancelled)
                    navigate("/appointment?payment_status=Cancelled", { replace: true });
                return;
            }

            if(!sessionId){
                if(!cancelled)
                    navigate("/appointment?payment_status=Failed", { replace: true });
            }

            try {
                
            } catch (error) {
                
            }
        }
    })
  return (
    <div>VerifyPaymentPage</div>
  )
}

export default VerifyPaymentPage