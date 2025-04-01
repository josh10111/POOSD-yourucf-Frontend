import '../Login.css';
import ucfLogo from '../assets/ucf-logo.png';

function PassLink()
{
    return(
        <div className="container">
        <div className="form-box login"> 
            <form action="">
                <div className="formTitle">
                <span style={{ fontWeight: 500 }}>Reset your</span>{' '}
                <span style={{ fontWeight: 700, color: '#F1CA3B' }}>Password</span>
                </div>
                <div className="message-text">
                    <span>Enter the email associated with your account and we'll send you a link to reset your password</span>
                </div>
                <div className="inputBox">
                    <input type="text" placeholder="Email" required />
                    <i className='bx bxs-envelope'></i>
                </div>
                <input type="submit" id="button" value="Send Email" />
    
            </form>
        </div>
        <div className="toggle-box">
            <div className="panel">
                <img src={ucfLogo} alt="UCF constellation logo"></img>
                <h1>yourUCF</h1>
                <h3>Chart your UCF path to</h3>
                <h2>graduation</h2>
            </div>

        </div>
    </div>
    );
};



export default PassLink;