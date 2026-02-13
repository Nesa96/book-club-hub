import "./Hero.css";

function Hero() {

    return (

        <div className="hero_container">
            <div className="hero_basic">
                <div className="hero_login_present">
                    <h2>LA TRAMA SE COMPLICA</h2>
                    <h3>Read & Repeat</h3>
                    <p>Welcome to our incredible book club, it feeds your brain even if it doesn't let you sleep</p>
                </div> 
                <div className="hero_img">
                    <img src="../../public/img/book-club-hero.png" alt="Hero IMG" />
                </div>
            </div>
            <div className="hero_extra_info">
                <h3>JOIN OUR BOOK CLUB</h3>
                <button>Join the club</button>
            </div>
        </div>
    )
}

export default Hero;