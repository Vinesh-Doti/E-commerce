import React from 'react'
import './Footer.css'
import footer_logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pintrest_icon from '../Assets/pintester_icon.png'
import watsapp_icon from '../Assets/whatsapp_icon.png'
const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-logo">
            <img src={footer_logo} alt="" />
            <p>TrendsHub</p>
        </div>
        <ul className="footer-links">
            <li>Company</li>
            <li>Products</li>
            <li>Officers</li>
            <li>About</li>
            <li>Contacts</li>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                <img src={instagram_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={pintrest_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={watsapp_icon} alt="" />
            </div>
        </div>
        <div className="footer-copyright">
           <hr />
           <p>Copyright @ 2025 - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
