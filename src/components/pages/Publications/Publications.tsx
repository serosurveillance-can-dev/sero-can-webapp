import React from "react";
import { useMediaQuery } from "react-responsive";
import { mobileDeviceOrTabletWidth } from "../../../constants";
import { PublicationsCard } from "./PublicationsCard";
import { PublicationsInfo } from "./PublicationsConstants";
import './styles.scss';
import Translate from "../../../utils/translate/translateService";
import Slider from "react-slick";

export default function Publications() {
  const isMobileDeviceOrTablet = useMediaQuery({ maxDeviceWidth: mobileDeviceOrTabletWidth })

  return (
    <div className="col-12 page pb-6">
      <div className={isMobileDeviceOrTablet ? "pb-2 policy-container" : "policy-container static-content"}>
        <h1 className="col-12 p-0 fit">
          {Translate('Publications')}
        </h1>
        <h3 className="normal">
          {Translate('ResearchArticles')}
        </h3>
        { getCarouselOfPublicationsCards("articles") }
        <h3 className="normal">
          {Translate('Reports')}
        </h3>
        { getCarouselOfPublicationsCards("reports") }
        <h3 className="normal">
          {Translate('MediaMentions')}
        </h3>
        { getCarouselOfPublicationsCards("media") }
      </div>
    </div>
  )
}

const sliderSettings = {
  dots: true,
  infinite: true,
  arrows: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1048,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    }
  ]
};

export type PublicationsType = 'articles' | 'reports' | 'media';

const getCarouselOfPublicationsCards = (type: PublicationsType) => {
  return (
    <div className="slider-container">
      <Slider 
        {...sliderSettings}
      >
          {
            PublicationsInfo[type].map((publicationsProps, idx) => {
              return <PublicationsCard
                day={publicationsProps.day ?? ""}
                month={publicationsProps.month}
                year={publicationsProps.year}
                img={publicationsProps.img}
                titleKey1={publicationsProps.titleKey1}
                titleKey2={publicationsProps.titleKey2}
                url={publicationsProps.url} />
              })
          }
      </Slider>
    </div>
  )
}
