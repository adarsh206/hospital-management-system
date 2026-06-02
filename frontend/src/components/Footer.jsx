
import { footerStyles } from "../assets/dummyStyles"
import logo from '../assets/logo.png'
import { Activity, Mail, MapPin, Phone, Stethoscope } from "lucide-react"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";



const Footer = () => {

    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: "Home", href: "/" },
        { name: "Doctors", href: "/doctors" },
        { name: "Services", href: "/services" },
        { name: "Contact", href: "/contact" },
        { name: "Appointments", href: "/appointments" },
    ];

    const services = [
        { name: "Blood Pressure Check", href: "/services" },
        { name: "Blood Sugar Test", href: "/services" },
        { name: "Full Blood Count", href: "/services" },
        { name: "X-Ray Scan", href: "/services" },
        { name: "Blood Sugar Test", href: "/services" },
    ];

    const socialLinks = [
        {
            Icon: <FaFacebook />,
            color: footerStyles.facebookColor,
            name: "Facebook",
            href: "https://www.facebook.com/people/Hexagon-Digital-Services/61567156598660/",
        },
        {
            Icon: <FaTwitter />,
            color: footerStyles.twitterColor,
            name: "Twitter",
            href: "https://www.linkedin.com/company/hexagondigtial-services/",
        },
        {
            Icon: <FaInstagram />,
            color: footerStyles.instagramColor,
            name: "Instagram",
            href: "http://instagram.com/hexagondigitalservices?igsh=MWp2NG1oNTlibWVnZA%3D%3D",
        },
        {
            Icon: <FaLinkedin />,
            color: footerStyles.linkedinColor,
            name: "LinkedIn",
            href: "https://www.linkedin.com/company/hexagondigtial-services/",
        },
        {
            Icon: <FaYoutube />,
            color: footerStyles.youtubeColor,
            name: "YouTube",
            href: "https://youtube.com/@hexagondigitalservices?si=lxEFYNCP42t6AoDJ",
        },
    ];

  return (
    <footer className={footerStyles.footerContainer}>
        <div className={footerStyles.floatingIcon1}>
            <Stethoscope className={footerStyles.stethoscopeIcon} />
        </div>
        <div className={footerStyles.floatingIcon2} style={{ animationDelay: "3s"}}>
            <Activity className={footerStyles.activityIcon} />
        </div>

        <div className={footerStyles.mainContent}>
            <div className={footerStyles.gridContainer}>
                <div className={footerStyles.companySection}>
                    <div className={footerStyles.logoContainer}>
                        <div className={footerStyles.logoWrapper}>
                            <div className={footerStyles.logoImageContainer}>
                                <img src={logo} alt="logo" className={footerStyles.logoImage} />
                            </div>
                        </div>

                        <div>
                            <h2 className={footerStyles.companyName}>MediCare</h2>
                            <p className={footerStyles.companyTagline}>Healthcare Solutions</p>
                        </div>
                    </div>

                    <p className={footerStyles.companyDescription}>
                        Your trusted partner in healthcare innovation. We're committed to providing exceptional medical care with cutting-edge technology and compassionate service.
                    </p>

                    <div className={footerStyles.contactContainer}>
                        <div className={footerStyles.contactItem}>
                            <div className={footerStyles.contactIconWrapper}>
                                <Phone className={footerStyles.contactIcon} />
                            </div>
                            <span className={footerStyles.contactText}>+91 8299431275</span>
                        </div>

                        <div className={footerStyles.contactItem}>
                            <div className={footerStyles.contactIconWrapper}>
                                <Mail className={footerStyles.contactIcon} />
                            </div>
                            <span className={footerStyles.contactText}>adarsh2061998@gmail.com</span>
                        </div>

                        <div className={footerStyles.contactItem}>
                            <div className={footerStyles.contactIconWrapper}>
                                <MapPin className={footerStyles.contactIcon} />
                            </div>
                            <span className={footerStyles.contactText}>Bihar, India</span>
                        </div>
                    </div>
                </div>

                {/** quick links */}
            </div>
        </div>
    </footer>
  )
}

export default Footer
