import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Showcase() {
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        centerMode: true,
        centerPadding: "120px",
        slidesToShow: 1,
        speed: 800
    };
    return (
        <section className="showcase container">
            <h2 className="section-title">See TeamPulse in Action</h2>

            <Slider {...settings}>
                <div>
                    <div className="slide-box">
                        <img
                            src="/images/dashboard.png"
                            alt="Dashboard View"
                            className="carousel-image"
                        />
                    </div>
                </div>

                <div>
                    <div className="slide-box">
                        <img
                            src="/images/project.png"
                            alt="Project Management"
                            className="carousel-image"
                        />
                    </div>
                </div>

                <div>
                    <div className="slide-box">
                        <img
                            src="/images/task.png"
                            alt="Task Tracking"
                            className="carousel-image"
                        />
                    </div>
                </div>
            </Slider>
        </section>
    );
}

export default Showcase;