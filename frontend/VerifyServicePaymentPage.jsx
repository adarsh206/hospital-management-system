import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = 'http://localhost:4000';

const VerifyServicePaymentPage = () => {

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        const verifyServicePayment = async () => {
            const params = new URLSearchParams(location.search || "");
            const sessionId = params.get("session_id");

            if(location.pathname === "/service-appointment/cancel"){
                if(!cancelled){
                    navigate("/appointments?service_payment=Cancelled", {
                        replace: true,
                    })
                }
                return;
            }
        }
    })

  return (
    <div>VerifyServicePaymentPage</div>
  )
}

export default VerifyServicePaymentPage