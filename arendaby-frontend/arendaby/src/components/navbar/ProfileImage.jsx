import ProfileIMG from "./no-profile-image.png";
import "./navbar.css";

const ProfileUserImage = () => {
    return (
        <div className={"profileImage"}>
            <img src={ProfileIMG} alt="profile image"/>
        </div>
    );
};

export default ProfileUserImage;